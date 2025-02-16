from flask import Flask, request, jsonify
import ollama
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

# Setup Elasticsearch and Embeddings
ELASTICSEARCH_URL = "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443"
API_KEY = "SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
INDEX_NAME = "posthuman"
TOP_K = 10

es = Elasticsearch(ELASTICSEARCH_URL, api_key=API_KEY)
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

def retrieve_similar_texts(user_input, index=INDEX_NAME, top_k=TOP_K):
    query_vector = embed_model.encode(user_input).tolist()
    query_body = {
        "size": top_k,
        "knn": {
            "field": "embedding",
            "query_vector": query_vector,
            "k": top_k,
            "num_candidates": 15,
            "filter": { "exists": { "field": "embedding" } }
        }
    }
    response = es.search(index=index, body=query_body)
    results = [hit["_source"]["text"] for hit in response["hits"]["hits"]]
    return results

def chat_with_ai(user_input):
    relevant_texts = retrieve_similar_texts(user_input)
    conversation_history = "\n".join([f"You: {user_input}\nMe: {text}" for text in relevant_texts])
    prompt = f"""I am continuing this conversation in the user's texting style.\n\nPrevious messages:\n{conversation_history}\n\nNow, respond to this new message in the same tone:\n"You: {user_input}"\n\nMe:"""
    
    response = ollama.chat(model="mistral", messages=[{"role": "user", "content": prompt}])
    return response["message"]["content"]

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get("input", "")
    if not user_input:
        return jsonify({"message": "No input provided"}), 400

    ai_response = chat_with_ai(user_input)
    return jsonify({"message": ai_response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
