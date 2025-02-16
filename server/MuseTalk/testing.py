import requests
import json

# URL of your FastAPI server
BASE_URL = "http://localhost:8000"

# Data for the POST request
data = {
    "image_path": "/Users/shivanshsoni/Documents/GitHub/posthuman/server/assets/jeffreyTwo.JPG",
    "text": "Happy Birthday Son. I love you so much. I hope you have a great day. I remember the days back when we used to ride the waves on the ocean. Those were good times. Keep them going for me.",
    "recipient_email": "shivanshmsoni@gmail.com"
}

# Send POST request to /generate endpoint
response = requests.post(f"{BASE_URL}/generate", json=data)

# Check the response
if response.status_code == 200:
    result = response.json()
    print("Success!")
    print(f"Message: {result['message']}")
    print(f"Result Path: {result['result_path']}")
else:
    print(f"Error: Status Code {response.status_code}")
    print(f"Error Message: {response.text}")

# Pretty print the full response
print("\nFull Response:")
print(json.dumps(response.json(), indent=2))
