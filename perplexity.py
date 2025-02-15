from openai import OpenAI
from pydantic import BaseModel

# Replace with your actual API key
YOUR_API_KEY = "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"

# Define the structured output format
class TriggerEventFormat(BaseModel):
    trigger_hit: bool

# Initialize OpenAI client
client = OpenAI(api_key=YOUR_API_KEY, base_url="https://api.perplexity.ai")

def check_event_occurrence(event_description: str) -> dict:
    """
    Function to check if a specified event has occurred.

    Args:
        event_description (str): Description of the event to check.

    Returns:
        dict: A JSON object indicating whether the event occurred, e.g., {"trigger_hit": true}.
    """
    # Messages to define the task for the AI
    messages = [
        {
            "role": "system",
            "content": (
                "Be precise and concise. Check recent news, social media posts, or other credible sources to determine "
                "if the specified event occurred."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Has the following event occurred? {event_description} "
                "Return a JSON object containing the field: 'trigger_hit' (True/False)."
            ),
        },
    ]

    # Perform chat completion with structured output
    response = client.chat.completions.create(
        model="sonar-pro",
        messages=messages,
        response_format={
            "type": "json_schema",
            "json_schema": {"schema": TriggerEventFormat.model_json_schema()},
        }
    )

    # Parse and return the structured response
    return response.choices[0].message.content


# Example Usage with streaming and user input
while True:
    event_description = input("Enter event to check (or 'quit' to exit): ")
    if event_description.lower() == 'quit':
        break
    
    try:
        result = check_event_occurrence(event_description)
        print("Result:", result)
    except Exception as e:
        print(f"Error occurred: {e}")
