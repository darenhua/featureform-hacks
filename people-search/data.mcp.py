from typing import Optional
from enrichmcp import EnrichMCP, EnrichModel, Relationship
from pydantic import Field
import http
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from openai import OpenAI
import logging
from logger import FileLogger

import logging

LOG: FileLogger = FileLogger(
    log_file=f"logs/people-search.log", level=logging.INFO, domain="PeopleSearch"
)

LOG.info("PeopleSearch running...")

load_dotenv()  # take environment variables

url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, supabase_key)

oai_key: str = os.environ.get("OPENROUTER_API_KEY")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=oai_key,
)


app = EnrichMCP("API Gateway", description="MCP Server for people in the database")


@app.entity
class Person(EnrichModel):
    """Person to find data about."""

    id: int = Field(description="Unique person ID")
    firstName: str = Field(description="First name")
    lastName: str = Field(description="Last name")
    # age: int = Field(description="Age")
    # location: str = Field(description="City, state, or region")
    # oneLiner: str = Field(
    #     description="1 or 2 sentence description of this person (e.g., 'AI Enthusiast & Startup Founder')"
    # )

    linkedinUrl: str = Field(description="Public LinkedIn profile")
    # categories: list[str] = Field(
    #     description="Tags like ['Entrepreneurship', 'Product Design', 'Basketball']"
    # )

    # interests: list[str] = Field(description="Interests")
    # hobbies: list[str] = Field(description="Hobbies")

    # mediaConsumed: list["Media"] = Relationship(description="Media like youtube videos, blogs, movies, etc, that this person has consumed")

    # Define navigable relationships
    # companies: list["Company"] = Relationship(
    #     description="Companies that this person has worked for"
    # )


class PartialPerson(Person):
    firstName: Optional[str]
    lastName: Optional[str]
    linkedinUrl: Optional[str]


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


def map_db_to_obj(db_obj: dict) -> Person:
    """Map a database object to a Person object."""
    return Person(
        id=db_obj["id"],
        firstName=db_obj["first_name"] or "",
        lastName=db_obj["last_name"] or "",
        linkedinUrl=db_obj["linkedin_url"] or "",
    )


def map_obj_to_db(mcp_obj: Person) -> dict:
    """Map a Person object to a database object."""
    update_fields = {"id": mcp_obj.id}

    if mcp_obj.firstName is not None:
        update_fields["first_name"] = mcp_obj.firstName
    if mcp_obj.lastName is not None:
        update_fields["last_name"] = mcp_obj.lastName
    if mcp_obj.linkedinUrl is not None:
        update_fields["linkedin_url"] = mcp_obj.linkedinUrl

    return update_fields


# Define how to fetch data
@app.resource
async def get_person_data(person_id: int) -> Person:
    """Fetch detailed information about a person by their ID."""
    person = (
        supabase.table("scraped_users")
        .select("*")
        .eq("id", person_id)
        .execute()
        .data[0]
    )

    mcp_person = map_db_to_obj(person)
    return mcp_person


@app.resource
async def enrich_person_data(update_schema: PartialPerson) -> Person:
    """Enrich the data for a person using a lot of data."""
    LOG.info(f"params: {update_schema}")
    update_body = map_obj_to_db(update_schema)
    try:
        # Update the user record with the provided schema
        supabase.table("scraped_users").update(update_body).eq(
            "id", update_body["id"]
        ).execute()
        LOG.info(f"Updated person {update_schema.id}")
    except Exception as e:
        LOG.error(f"Error updating person {update_schema.id}: {e}")
        raise e

    return None


# Define relationship resolvers
# @Person.companies.resolver
# async def get_person_companies(person_id: int) -> list[Company]:
#     """Fetch companies for a person."""
#     person = supabase.table("people").select("*").eq("id", person_id).execute().data[0]
#     return [Company(**company) for company in response.json()]


# Run the server
if __name__ == "__main__":
    app.run()
