from elasticsearch import Elasticsearch
import requests
import numpy as np
from transformers import AutoModel, AutoTokenizer
import json

# === Configuration ===
ELASTIC_URL = "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443"
API_KEY = "SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="  # Keep this secure
INDEX_NAME = "posthuman-knowledge"
OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Ollama's API

# === Initialize Clients ===
try:
    es = Elasticsearch(ELASTIC_URL, api_key=API_KEY)
    tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
except Exception as e:
    print(f"Error initializing clients: {e}")
    exit(1)

# === Function to Encode Query to Vector ===
def encode_query(query):
    inputs = tokenizer(query, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    vector = outputs.last_hidden_state.mean(dim=1).detach().numpy().tolist()[0]
    return vector

# === Function to Search in Elasticsearch ===
def search_emails(query, top_k=5):
    query_vector = encode_query(query)

    search_body = {
        "size": top_k,
        "query": {
            "script_score": {
                "query": {"match_all": {}},
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'vector') + 1.0",
                    "params": {"query_vector": query_vector}
                }
            }
        }
    }

    try:
        response = es.search(index=INDEX_NAME, body=search_body)
    except Exception as e:
        print(f"Elasticsearch error: {e}")
        return []


    emails = []
    for hit in response.get("hits", {}).get("hits", []):
        if "_source" in hit:
            # Adjust field name if "contents" does not exist
            emails.append(hit["_source"].get("text", ""))  # Check if "text" is the correct field

    return emails

# === Function to Generate a Response Using RAG with Ollama ===
def generate_response(query, emails):
    context = "\n\n".join(emails)
    prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"

    # Send request to Ollama (which is running Mistral locally)
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()  # Raise an error for HTTP failures
        response_data = response.json()
        return response_data.get("response", "No response from Mistral")
    except requests.RequestException as e:
        print(f"Error querying Ollama: {e}")
        return "Error generating response."

# === Main Loop for Querying ===
def main():
    print("🔍 Query Emails Using RAG + Mistral (via Ollama)")
    while True:
        query = input("\nEnter your query (or 'exit' to quit): ")
        if query.lower() == "exit":
            break

        emails = search_emails(query)
        if not emails:
            print("❌ No relevant emails found.")
            continue

        response = generate_response(query, emails)
        print(f"\n🧠 Mistral's Answer:\n{response}")

if __name__ == "__main__":
    main()
