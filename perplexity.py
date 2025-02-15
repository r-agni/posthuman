from openai import OpenAI
from pydantic import BaseModel

YOUR_API_KEY = "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"

class AnswerFormat(BaseModel):
    first_name: str
    last_name: str
    year_of_birth: int
    num_seasons_in_nba: int

user = {"name": "Jathin Pranav Singaraju", "Location": "Berkeley,CA", "Detail": "Student"}

messages = [
    {
        "role": "system",
        "content": "Be precise and concise. And do deep research looking at orbituarues, news articles, rececent social media posts, etc. and answer in JSON format with the following fields: Alive(yes/no), Date, cause.",
    },
    {   
        "role": "user",
        "content": (
            "Scan to see if the following person is active, the last time they were active in the news. Here are the person's details:{'name': 'Jathin Pranav Singaraju', 'Location': 'Berkeley,CA', 'Detail': 'Student'}"
            "Please output a JSON object containing the following fields: "
            "Present(yes/no), Date."
        ),
    },
]

client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

# chat completion with structured output
response = client.chat.completions.create(
    model="sonar-pro",
    messages=messages,
    response_format={
        "type": "json_schema",
        "json_schema": {"schema": AnswerFormat.model_json_schema()},
    }
)
print(response.choices[0].message.content)

# Note: Streaming is not typically used with structured output