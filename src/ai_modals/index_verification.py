from elasticsearch import Elasticsearch

# Connect to Elasticsearch
client = Elasticsearch(
    "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443",
    api_key="SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
)

index_name = "posthuman"

# Check if the index exists
if client.indices.exists(index=index_name):
    print(f"✅ Index '{index_name}' exists.")
else:
    print(f"❌ Index '{index_name}' does NOT exist. Creating it now...")
    
    # Define the index mapping with a dense vector field
    mappings = {
        "mappings": {
            "properties": {
                "text": {"type": "text"},
                "embedding": {"type": "dense_vector", "dims": 384}  # Adjust this based on your model
            }
        }
    }
    
    # Create the index
    client.indices.create(index=index_name, body=mappings, ignore=400)
    print(f"✅ Index '{index_name}' created successfully!")
