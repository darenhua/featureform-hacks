from enrichmcp import EnrichMCP, EnrichModel, Relationship
from pydantic import Field
import http
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()  # take environment variables

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


app = EnrichMCP("API Gateway", description="MCP Server for people in the database")


@app.entity
class Person(EnrichModel):
    """Person to find data about."""

    id: int = Field(description="Unique person ID")
    name: str = Field(description="Full name")
    age: int = Field(description="Age")
    location: str = Field(description="City, state, or region")
    oneLiner: str = Field(
        description="1 or 2 sentence description of this person (e.g., 'AI Enthusiast & Startup Founder')"
    )
    linkedinUrl: str = Field(description="Public LinkedIn profile")
    categories: list[str] = Field(
        description="Tags like ['Entrepreneurship', 'Product Design', 'Basketball']"
    )

    # interests: list[str] = Field(description="Interests")
    # hobbies: list[str] = Field(description="Hobbies")

    # mediaConsumed: list["Media"] = Relationship(description="Media like youtube videos, blogs, movies, etc, that this person has consumed")

    # Define navigable relationships
    # companies: list["Company"] = Relationship(
    #     description="Companies that this person has worked for"
    # )


# @app.entity
# class Media(EnrichModel):
#     """Media that a person has consumed."""
#     id: int = Field(description="Media ID")
#     name: str = Field(description="Media name")
#     type: str = Field(description="Media type")
#     mediaDescription: str = Field(description="Description of the media")


@app.entity
class Company(EnrichModel):
    """Company that a person has worked for."""

    id: int = Field(description="Company ID")
    name: str = Field(description="Company name")


# Define how to fetch data
@app.resource
async def get_person_data(person_id: int) -> Person:
    """Fetch person from CRM API."""
    response = await http.get(f"/api/people/{person_id}")
    return Person(**response.json())


# Define relationship resolvers
# @Person.companies.resolver
# async def get_person_companies(person_id: int) -> list[Company]:
#     """Fetch companies for a person."""
#     response = await http.get(f"/api/people/{person_id}/companies")
#     return [Company(**company) for company in response.json()]


# Run the server
if __name__ == "__main__":
    print("Starting E-Commerce Shop API...")
    app.run()