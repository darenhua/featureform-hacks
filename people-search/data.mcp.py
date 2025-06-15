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
class Conversation(EnrichModel):
    """Conversation between two people."""

    id: int = Field(
        description="Unique conversation snippet ID in a conversation group"
    )
    summary: str = Field(description="Summary of the snippet of the conversation")
    next_convo_topic: str = Field(
        description="3 bullet points for conversation starters that was suggested after this snippet"
    )


@app.entity
class ConversationGroup(EnrichModel):
    """Group of conversations."""

    id: int = Field(description="Unique conversation group ID")
    user_id: int = Field(description="ID of the user that started the conversation")
    second_person_id: int = Field(
        description="ID of the second person in the conversation"
    )
    event_id: int = Field(
        description="ID of the event that the conversation took place"
    )
    conversations: list[Conversation] = Relationship(
        description="Summaries and suggested topics that happened since the conversation started"
    )


@app.entity
class Person(EnrichModel):
    """Person to find data about."""

    id: int = Field(description="Unique person ID")
    firstName: str = Field(description="First name")
    lastName: str = Field(description="Last name")
    shortDescription: str = Field(description="Short description of the person")
    longDescription: str = Field(description="Long description of the person")
    # headline: str = Field(description="Headline")
    # aboutDescription: str = Field(description="Description of this person on linkedin")
    # location: str = Field(description="Where this person lives")
    # currentSchool: str = Field(
    #     description="The school this person is currently attending, or none"
    # )
    # currentCompany: str = Field(
    #     description="The company they are currently working for, or null"
    # )

    # linkedinUrl: str = Field(description="Public LinkedIn profile")

    # Define navigable relationships
    # companies: list["Company"] = Relationship(
    #     description="Companies that this person has worked for"
    # )


# class PartialPerson(Person):
#     firstName: Optional[str]
#     lastName: Optional[str]
#     linkedinUrl: Optional[str]


# @app.entity
# class Media(EnrichModel):
#     """Media that a person has consumed."""
#     id: int = Field(description="Media ID")
#     name: str = Field(description="Media name")
#     type: str = Field(description="Media type")
#     mediaDescription: str = Field(description="Description of the media")


# @app.entity
# class Company(EnrichModel):
#     """Company that a person has worked for."""

#     id: int = Field(description="Company ID")
#     name: str = Field(description="Company name")


def map_db_to_obj(db_obj: dict) -> Person:
    """Map a database object to a Person object."""
    return Person(
        id=db_obj["id"],
        firstName=db_obj["firstName"],
        lastName=db_obj["lastName"],
        shortDescription=db_obj["short_description"],
        longDescription=db_obj["long_description"],
    )


def map_db_to_obj_conversation(db_obj: dict) -> Conversation:
    """Map a database object to a Conversation object."""
    return Conversation(
        id=db_obj["id"],
        summary=db_obj["summary"],
        next_convo_topic=db_obj["next_convo_topic"],
    )


def map_db_to_obj_conversation_group(db_obj: dict) -> ConversationGroup:
    """Map a database object to a ConversationGroup object."""
    return ConversationGroup(
        id=db_obj["id"],
        user_id=db_obj["user_id"],
        second_person_id=db_obj["second_person_id"],
        event_id=db_obj["event_id"],
    )


# def map_obj_to_db(mcp_obj: Person) -> dict:
#     """Map a Person object to a database object."""
#     update_fields = {"id": mcp_obj.id}
#     if mcp_obj.short_description is not None:
#         update_fields["short_description"] = mcp_obj.short_description

#     return update_fields


# Define how to fetch data
@app.resource
async def research_person(person_id: int) -> Person:
    """Research a person's data based on their ID."""
    person = supabase.table("user").select("*").eq("id", person_id).execute().data[0]

    mcp_person = map_db_to_obj(person)
    return mcp_person


@app.resource
async def reviewConversation(conversation_group_id: int) -> ConversationGroup:
    """Review the entire conversation so far"""
    conversation_group = (
        supabase.table("user_conversations_groups")
        .select("*")
        .eq("id", conversation_group_id)
        .execute()
        .data[0]
    )
    LOG.info(f"Conversation group: {conversation_group}")
    return map_db_to_obj_conversation_group(conversation_group)


@app.resource
async def addConversationAnalysis(
    conversation_group_id: int, summary: str, suggested_topic: str
) -> Conversation:
    """Take the conversation snippet transcript and record it by adding a conversation snippet and suggested conversation starters."""

    LOG.info(f"Adding conversation analysis: {summary} {suggested_topic}")

    conversation = (
        supabase.table("conversations")
        .insert(
            {
                "conversation_group_id": conversation_group_id,
                "summary": summary,
                "next_convo_topic": suggested_topic,
            }
        )
        .execute()
        .data[0]
    )

    return map_db_to_obj_conversation(conversation)


@ConversationGroup.conversations.resolver
async def getConversationsInGroup(
    conversation_group_id: int,
) -> list[Conversation]:
    """Get the conversations for a conversation group."""
    conversations = (
        supabase.table("conversations")
        .select("*")
        .eq("conversation_group_id", conversation_group_id)
        .execute()
        .data
    )
    LOG.info(f"Conversations: {conversations}")
    return [map_db_to_obj_conversation(conversation) for conversation in conversations]


# @app.resource
# async def enrich_person_data(update_schema: PartialPerson) -> Person:
#     """Enrich the data for a person using a lot of data."""
#     LOG.info(f"params: {update_schema}")
#     update_body = map_obj_to_db(update_schema)
#     try:
#         # Update the user record with the provided schema
#         supabase.table("scraped_users").update(update_body).eq(
#             "id", update_body["id"]
#         ).execute()
#         LOG.info(f"Updated person {update_schema.id}")
#     except Exception as e:
#         LOG.error(f"Error updating person {update_schema.id}: {e}")
#         raise e

#     return None


# Define relationship resolvers
# @Person.companies.resolver
# async def get_person_companies(person_id: int) -> list[Company]:
#     """Fetch companies for a person."""
#     person = supabase.table("people").select("*").eq("id", person_id).execute().data[0]
#     return [Company(**company) for company in response.json()]


# Run the server
if __name__ == "__main__":
    app.run()
