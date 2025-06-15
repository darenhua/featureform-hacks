from browser_use import Agent, BrowserSession, Controller
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import asyncio

load_dotenv()

oai_key: str = os.environ.get("OPENROUTER_API_KEY")
linkedin_username: str = os.environ.get("LINKEDIN_USERNAME")
linkedin_password: str = os.environ.get("LINKEDIN_PASSWORD")

sensitive_data = {
    "https://*.linkedin.com": {
        "linkedin_email": linkedin_username,
        "linkedin_password": linkedin_password,
    },
}

allowed_domains = [
    "https://*.linkedin.com",
]


class LinkedInProfileData(BaseModel):
    first_name: str
    last_name: str
    headline: str
    about_description: str
    location: str
    current_school: str
    current_company: str


class LinkedInAgent:
    def __init__(self):
        # asyncio.run(self.run_agent())
        pass

    # async def run_agent(self):
    #     await self.browser_session.start()

    #     agent = Agent(
    #         task="Log into linkedin.com at linkedin.com/login. Return the profile data in the specified LinkedInProfileData model. Ensure that the data is accurate and complete.",
    #         # message_context="Additional information about the task",
    #         llm=ChatOpenAI(model="gpt-4o-mini", api_key=oai_key, timeout=100),
    #         browser_session=self.browser_session,
    #         sensitive_data=sensitive_data,
    #     )

    #     await agent.run()

    async def get_profile_data(self, linkedin_url: str) -> LinkedInProfileData:
        browser_session = BrowserSession(
            allowed_domains=allowed_domains,
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",  # macOS
            # For Windows: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            # For Linux: '/usr/bin/google-chrome'
            # Use a specific data directory on disk (optional, set to None for incognito)
            user_data_dir=None,  # this is the default
            keep_alive=True,
        )

        await browser_session.start()

        controller = Controller(output_model=LinkedInProfileData)

        agent = Agent(
            task=f"Search for the person with the linkedin url: {linkedin_url}. Log in if needed. Return the profile data in the specified LinkedInProfileData model. Ensure that the data is accurate and complete.",
            # message_context="Additional information about the task",
            llm=ChatOpenAI(model="gpt-4o-mini", api_key=oai_key, timeout=100),
            controller=controller,
            browser_session=browser_session,
            sensitive_data=sensitive_data,
        )

        result = await agent.run()
        print(result)

        result = result.final_result()
        if result:
            parsed: LinkedInProfileData = LinkedInProfileData.model_validate_json(
                result
            )
            return parsed

        return None


if __name__ == "__main__":
    LinkedInAgent()
