from fastapi import FastAPI
import uvicorn
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()  # take environment variables

key: str = os.environ.get("OPENROUTER_API_KEY")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=key,
)

app = FastAPI()


@app.get("/")
async def root():
    # assume we have a person's linkedin

    completion = client.chat.completions.create(
        model="openai/gpt-4o",
        messages=[
            {
                "role": "user",
                "content": "Make up a lot of data about a person named John Doe. Make it as detailed as possible. Include what company they worked for and what they did there.",
            }
        ],
    )
    data = completion.choices[0].message.content

    return {"message": data}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
