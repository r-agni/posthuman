import os
import re
from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer

# Configuration
ELASTICSEARCH_URL = "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443"
API_KEY = "SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
INDEX_NAME = "posthuman_knowledge"  # Correct Elasticsearch index
EVENTS_FILE = os.path.expanduser("~/desktop/important_events.txt")
OUTPUT_DIR = os.path.expanduser("~/desktop/extracted_events")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load SentenceTransformer model for embeddings
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Initialize Elasticsearch client
client = Elasticsearch(
    ELASTICSEARCH_URL,
    api_key=API_KEY
)

# Function to clean filenames (remove invalid characters)
def sanitize_filename(title):
    return re.sub(r'[<>:"/\\|?*]', '_', title)  # Replace invalid characters with "_"

# Function to extract events
def extract_events(text):
    events = re.split(r"-{40,}", text.strip())  # Split by 40+ dashes
    parsed_events = []
    
    for event in events:
        match = re.search(r"Title: (.*?)\nStart: (.*?)\nEnd: (.*?)\nLocation: (.*?)\nDescription: (.*)", event, re.DOTALL)
        if match:
            title, start, end, location, description = match.groups()
            parsed_events.append({
                "title": title.strip(),
                "start": start.strip(),
                "end": end.strip(),
                "location": location.strip(),
                "description": description.strip()
            })
    return parsed_events

# Read the events file
with open(EVENTS_FILE, "r", encoding="utf-8") as file:
    events_text = file.read()

# Extract events
events = extract_events(events_text)
batch = []

for idx, event in enumerate(events):
    sanitized_title = sanitize_filename(event["title"])  # Clean filename
    filename = f"{idx + 1}_{sanitized_title}.txt"
    file_path = os.path.join(OUTPUT_DIR, filename)

    # Save to individual text files
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(f"Title: {event['title']}\nStart: {event['start']}\nEnd: {event['end']}\nLocation: {event['location']}\nDescription: {event['description']}")

    # Convert event text to vector
    event_text = f"{event['title']} {event['description']}"
    vector = embedding_model.encode(event_text).tolist()

    # Prepare document for Elasticsearch
    batch.append({
        "_index": INDEX_NAME,  # Using the correct index
        "_source": {
            "text": event_text,  # Storing full event text
            "vector": vector
        }
    })

# Upload to Elasticsearch
if batch:
    helpers.bulk(client, batch)
    print(f"Uploaded {len(batch)} events to Elasticsearch (Index: {INDEX_NAME}).")

print("Finished processing and uploading events.")
