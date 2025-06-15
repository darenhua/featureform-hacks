from mcp_client import MCPClient
from dotenv import load_dotenv
from anthropic import Anthropic
import os
import asyncio
from pydantic import BaseModel

load_dotenv()  # take environment variables

anthropic = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))


# This is a function that uses MCP server inside an ai call and
# returns both tool
async def process_query(mcp_session, session_messages: list):
    messages = session_messages

    response = await mcp_session.list_tools()

    available_tools = [
        {
            "name": tool.name,
            "description": tool.description,
            "input_schema": tool.inputSchema,
        }
        for tool in response.tools
    ]

    system = """
        You are responsible for helping 2 people have a conversation by summarizing their conversations and suggesting conversation topics.

        You will be given a list of tools to access a database containing info on the two people.

        Before you suggest a conversation topic, look into the previous conversation summaries and suggested topics. Make sure to never suggest a repeated summary or conversation topic that has already been logged in the 'conversations' table.

        Here are things that might help with suggesting conversation topics:
        - research things that are in common between the two people.
        - research things that are different between the two people.
        - research things that are unique to each person that might be worth a conversation.
    """

    final_text = []
    current_messages = messages.copy()

    while True:
        # Make Claude API call
        response = anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=current_messages,
            tools=available_tools,
            system=system,
        )

        assistant_message_content = []
        tool_use_found = False

        for content in response.content:
            if content.type == "text":
                final_text.append(content.text)
                assistant_message_content.append(content)
            elif content.type == "tool_use":
                tool_use_found = True
                tool_name = content.name
                tool_args = content.input

                # Execute tool call
                result = await mcp_session.call_tool(tool_name, tool_args)
                final_text.append(f"[Calling tool {tool_name} with args {tool_args}]")

                assistant_message_content.append(content)
                current_messages.append(
                    {"role": "assistant", "content": assistant_message_content}
                )
                current_messages.append(
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": content.id,
                                "content": result.content,
                            }
                        ],
                    }
                )
                break  # Break after first tool use to process it

        if not tool_use_found:
            # If no tool use was found, we're done
            break

    return "\n".join(final_text)


# This is what gets called in the api endpoint.
async def agent_loop(mcp_session, conversation_id: int, transcript: str):
    # Goal of this agent loop is to do suggest conversation topics between 2 people

    """Run an interactive chat loop"""
    print("\nMCP Client Started!")
    print("Type your queries or 'quit' to exit.")

    session_messages = [
        {
            "role": "user",
            "content": f"""{transcript}
            You are assisting in conversation ID {conversation_id}. Research the conversations that have happened so far, and record this new conversation snippet while using it to generate a new unique conversation topic.""",
        },
    ]

    response = await process_query(
        mcp_session,
        session_messages,
    )
    print(response)

    # while True:
    #     try:
    #         response = await process_query(mcp_session, query, session_messages)
    #         print("\n" + response)

    #     except Exception as e:
    #         print(f"\nError: {str(e)}")


async def main():
    client = MCPClient()
    server_script_path = "./data.mcp.py"
    try:
        mcp_session = await client.connect_to_server(server_script_path)
        await agent_loop(
            mcp_session,
            1,
            """
            Right. So so and then that also, you know, goes into every trial is gonna be very, you know, different You know? Some majorly, some minor. Mhmm. Even if they are the same you know, therapeutic area, same, you know, indication, same pharmaceutical company. Yeah. You know, it it could just just their their primary endpoint could be completely different from the very one. Got it. And it's kind of a stupid question, but, like, but each, like, each, like, trial is different. Right? But, like, do you work at, like, the same, like, hospital every day and, like, like, the same, like, like, what do you like, I guess, like, where where does the work happen? So so we if you do mostly voluntary research. So we do mostly psychiatric or is considered CNS studies for psychiatric patients. 
            """,
        )
    finally:
        await client.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
