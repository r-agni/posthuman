from elasticsearch import Elasticsearch

# Connect to Elasticsearch
client = Elasticsearch(
    "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443",
    api_key="SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
)

index_name = "posthuman"

# Define a mapping with a dense vector field for embeddings
mappings = {
    "mappings": {
        "properties": {
            "text": {
                "type": "text"
            },
            "embedding": {
                "type": "dense_vector",
                "dims": 384  # Must match the embedding model's output dimension
            }
        }
    }
}

# Create the index
client.indices.create(index=index_name, body=mappings, ignore=400)
print(f"Index {index_name} created successfully!")
