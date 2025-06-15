from fastapi import FastAPI
import uvicorn
from openai import OpenAI
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from supabase import create_client, Client
from linkedin import LinkedInAgent
from playwright.async_api import async_playwright
import asyncio
from markdownify import markdownify as md
from json_helpers import extract_json, validate_json_with_model, json_to_pydantic
import time

load_dotenv()  # take environment variables

oai_key: str = os.environ.get("HACKATHON_API_KEY")
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=oai_key,
)

app = FastAPI()

url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, supabase_key)

linkedin_agent = LinkedInAgent()


class BrowserManager:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None

    async def init(self):
        if not self.playwright:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=True)
            self.context = await self.browser.new_context()
            self.page = await self.context.new_page()
            await self.login()

    async def login(self):
        # Navigate to LinkedIn login page
        await self.page.goto("https://www.linkedin.com/login")

        # Fill in login credentials
        await self.page.fill("#username", os.environ.get("LINKEDIN_USERNAME"))
        await self.page.fill("#password", os.environ.get("LINKEDIN_PASSWORD"))

        # Click the sign in button
        await self.page.click('button[type="submit"]')

        # Wait for navigation to complete
        await self.page.wait_for_load_state("domcontentloaded")

        return self.page

    async def get_profile_data(self, linkedin_url: str):
        if not self.page:
            await self.init()

        await self.page.goto(linkedin_url)
        await self.page.wait_for_load_state("domcontentloaded")
        return md(await self.page.content())

    async def close(self):
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()


# Create a global browser manager instance
browser_manager = BrowserManager()


@app.on_event("startup")
async def startup_event():
    await browser_manager.init()


@app.on_event("shutdown")
async def shutdown_event():
    await browser_manager.close()


class CreatePerson(BaseModel):
    linkedinUrl: str


class LinkedInProfileData(BaseModel):
    first_name: str
    last_name: str
    headline: str
    about_description: str
    location: str
    current_school: str
    current_company: str


@app.post("/person")
async def create_person(body: CreatePerson):
    # assume we have a person's linkedin
    profile_data = await browser_manager.get_profile_data(body.linkedinUrl)

    max_retries = 3
    retry_count = 0
    validated_data = None
    validation_errors = []

    while retry_count < max_retries and not validated_data:
        completion = client.chat.completions.create(
            model="openai/gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": """You are a helpful assistant that extracts profile data from a LinkedIn profile. 
                    You will be given a markdown formatted LinkedIn profile. Analyze the markdown by first looking at
                    data related to the person's name and basic info. Then look for info related to their education. Then look 
                    into their work experience.
                    
                    You must return a JSON object that exactly matches this structure:
                    {
                        "first_name": "string",
                        "last_name": "string",
                        "headline": "string",
                        "about_description": "string",
                        "location": "string",
                        "current_school": "string",
                        "current_company": "string"
                    }
                    All fields are required. If you cannot find a value for a field, use an empty string.
                    Extract the data from the profile and format it exactly as shown above.""",
                },
                {
                    "role": "user",
                    "content": f"<profile_data>{profile_data}</profile_data>",
                },
            ],
        )

        extracted_json = extract_json(completion.choices[0].message.content)
        if extracted_json:
            validated_data, validation_errors = validate_json_with_model(
                LinkedInProfileData, extracted_json[0]
            )

            if validated_data:
                # Convert the validated data to a LinkedInProfileData instance
                profile = json_to_pydantic(LinkedInProfileData, validated_data[0])

                supabase.table("user").insert(
                    {
                        "linkedinUrl": body.linkedinUrl,
                        "firstName": profile.first_name,
                        "lastName": profile.last_name,
                        "headline": profile.headline,
                        "aboutDescription": profile.about_description,
                        "location": profile.location,
                        "currentSchool": profile.current_school,
                        "currentCompany": profile.current_company,
                    }
                ).execute()

                return {"message": profile.model_dump()}

        retry_count += 1
        if retry_count < max_retries:
            time.sleep(1)  # Wait a bit before retrying

    # If we get here, we failed to get valid data
    return {
        "error": "Failed to extract valid profile data",
        "validation_errors": validation_errors,
        "attempts": retry_count,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
