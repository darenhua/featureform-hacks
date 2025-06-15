import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openai_key,  # Loaded from .env
)

person1 = "Maya Thompson is a 20-year-old junior at a liberal arts college in Vermont, majoring in Political Science with a minor in Sociology. Originally from Atlanta, Georgia, she is a first-generation college student and bilingual in English and Spanish. Maya works part-time as an assistant in the campus civic engagement office, where she helps coordinate voter outreach events and student education initiatives. Her academic and extracurricular interests include political theory, voter rights advocacy, and debate, and she’s an active member of both the campus debate team and a student-led voter registration coalition. In her free time, she enjoys reading nonfiction, listening to political podcasts, and writing opinion blogs focused on social equity. She plans to pursue a career as a policy analyst or community organizer in civic education."
person2 = "Elijah Brooks is a 22-year-old senior studying Urban Studies at a public university in Chicago, Illinois. Born and raised in a working-class neighborhood in Chicago, he has a strong interest in urban development and equitable housing policy. Elijah currently interns at a local housing nonprofit, where he assists with community planning initiatives and public outreach. He participates in the student debate society and is also a member of the campus urban policy club. His interests include civic engagement, city planning, and public speaking, and his hobbies involve listening to urban planning podcasts, exploring local architecture, and journaling. Elijah’s long-term goal is to work as a city planner or housing policy advisor, focusing on community-based solutions for urban inequality."
content = f"This is information about two individuals:\n\nPerson 1: {person1}\n\nPerson 2: {person2}\n\nCreate conversation starters in 2nd person as person 1 based on their similarities. For each conversation starter, include a 1 sentence explanation and a 2-3 sentences question. Format as a list of objects where the keys are short and long."

completion = client.chat.completions.create(
    extra_headers={
        "HTTP-Referer": "<YOUR_SITE_URL>",  # Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "<YOUR_SITE_NAME>",  # Optional. Site title for rankings on openrouter.ai.
    },
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": content}],
)

print(completion.choices[0].message.content)
