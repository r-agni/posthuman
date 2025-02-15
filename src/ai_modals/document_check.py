from elasticsearch import Elasticsearch

# Connect to Elasticsearch
client = Elasticsearch(
    "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443",
    api_key="SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
)

index_name = "posthuman"

# Get the document count
response = client.count(index=index_name)
print(f"Document count in '{index_name}': {response['count']}")
