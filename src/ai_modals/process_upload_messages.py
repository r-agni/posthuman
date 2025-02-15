import os
import time
import logging
from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Elasticsearch Connection
client = Elasticsearch(
    "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443",
    api_key="SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
)

index_name = "posthuman"
input_dir = os.path.expanduser("~/Desktop/messages_filtered/")

# Check if the directory exists
if not os.path.exists(input_dir):
    logging.error(f"❌ Error: Directory {input_dir} does not exist.")
    exit(1)

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Start processing messages
logging.info(f"📂 Processing messages from {input_dir}...")

docs = []
message_id = 1
file_count = 0

# Iterate through all files
for filename in os.listdir(input_dir):
    if filename.endswith(".txt"):
        file_count += 1
        input_file = os.path.join(input_dir, filename)
        
        with open(input_file, "r", encoding="utf-8") as infile:
            for line in infile:
                text = line.strip()
                if text:
                    embedding = model.encode(text).tolist()
                    
                    docs.append({
                        "_index": index_name,
                        "_id": message_id,
                        "_source": {"text": text, "embedding": embedding}
                    })
                    
                    message_id += 1
        
        logging.info(f"✅ Processed file: {filename}")

# Log if no messages were found
if not docs:
    logging.warning("⚠️ No messages found in the input directory.")
    exit(1)

# Upload data to Elasticsearch
logging.info(f"📡 Uploading {len(docs)} messages to Elasticsearch...")

start_time = time.time()
helpers.bulk(client, docs)
end_time = time.time()

logging.info(f"✅ Upload completed in {end_time - start_time:.2f} seconds.")
