from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer

# Connect to Elasticsearch
client = Elasticsearch(
    "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443",
    api_key="SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
)

index_name = "posthuman"

# Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

def search_similar_messages(query):
    """Perform a vector similarity search on the stored messages"""
    query_embedding = model.encode(query).tolist()

    # Perform the search in Elasticsearch
    response = client.search(index=index_name, body={
        "size": 3,
        "query": {
            "script_score": {
                "query": {"match_all": {}},
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                    "params": {"query_vector": query_embedding}
                }
            }
        }
    })

    # Display results
    print("\n🔍 **Top 3 Similar Messages:**")
    for hit in response["hits"]["hits"]:
        print(f"- {hit['_source']['text']} (Score: {hit['_score']:.4f})")

# Example usage
if __name__ == "__main__":
    user_query = input("Enter your query: ")
    search_similar_messages(user_query)
