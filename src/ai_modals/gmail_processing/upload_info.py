import os
from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer

# Configuration
ELASTICSEARCH_URL = "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443"
API_KEY = "SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
INDEX_NAME = "posthuman-knowledge"
BATCH_SIZE = 50  # Upload every 50 documents

# Load SentenceTransformer for text embedding
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Initialize Elasticsearch client
client = Elasticsearch(
    ELASTICSEARCH_URL,
    api_key=API_KEY
)

# Ensure the index exists with vector mapping
index_mappings = {
    "mappings": {
        "properties": {
            "text": {"type": "text"},
            "vector": {"type": "dense_vector", "dims": 384}  # Match model output dims
        }
    }
}

# Create index if it doesn't exist
if not client.indices.exists(index=INDEX_NAME):
    client.indices.create(index=INDEX_NAME, body=index_mappings)

# Function to upload a batch of documents
def upload_batch(docs):
    if docs:
        helpers.bulk(client, docs)
        print(f"Uploaded {len(docs)} documents.")
        docs.clear()  # Clear batch after uploading

# Collect documents in batches
batch = []

# Process emails from desktop/mailbox folder
email_folder = os.path.expanduser("~/desktop/mailbox")

for filename in os.listdir(email_folder):
    file_path = os.path.join(email_folder, filename)
    if filename.endswith(".txt"):
        with open(file_path, "r", encoding="utf-8") as file:
            email_text = file.read().strip()
            vector = embedding_model.encode(email_text).tolist()
            batch.append({"_index": INDEX_NAME, "_source": {"text": email_text, "vector": vector}})

            # Upload batch when size reaches BATCH_SIZE
            if len(batch) >= BATCH_SIZE:
                upload_batch(batch)

# Process calendar events from desktop/important_events.txt
calendar_file = os.path.expanduser("~/desktop/important_events.txt")

with open(calendar_file, "r", encoding="utf-8") as file:
    events = file.read().strip().split("\n\n")  # Assuming events are separated by double newlines
    for event in events:
        vector = embedding_model.encode(event).tolist()
        batch.append({"_index": INDEX_NAME, "_source": {"text": event, "vector": vector}})

        # Upload batch when size reaches BATCH_SIZE
        if len(batch) >= BATCH_SIZE:
            upload_batch(batch)

# Upload any remaining documents
upload_batch(batch)

print("Finished uploading all documents to Elasticsearch.")
