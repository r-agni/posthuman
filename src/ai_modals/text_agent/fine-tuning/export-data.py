import json
from elasticsearch import Elasticsearch

# Connect to Elasticsearch
ELASTICSEARCH_URL = "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443"
API_KEY = "SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
INDEX_NAME = "posthuman"

es = Elasticsearch(ELASTICSEARCH_URL, api_key=API_KEY)

def export_messages():
    """Retrieve past messages from Elasticsearch and save as fine-tuning dataset."""
    
    query_body = {"size": 10000, "query": {"match_all": {}}}  # Fetch up to 10,000 messages

    response = es.search(index=INDEX_NAME, body=query_body)

    messages = [
        {
            "instruction": "Reply like I would in a conversation.",
            "input": hit["_source"]["text"],  
            "output": hit["_source"]["text"]
        }
        for hit in response["hits"]["hits"]
    ]

    # Save as JSON
    with open("fine_tune_data.json", "w") as f:
        json.dump(messages, f, indent=2)

export_messages()
print("✅ Data exported to fine_tune_data.json for fine-tuning!")
