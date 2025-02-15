import ollama
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer

# -----------------------------
# 🔹 CONFIGURATION
# -----------------------------
ELASTICSEARCH_URL = "https://my-elasticsearch-project-ee9815.es.us-east-1.aws.elastic.cloud:443"
API_KEY = "SHhnOUNKVUJ3LThxak1XN2dPenQ6VDN2eElFTUFINmY0U3VJVjl1Z1B6Zw=="
INDEX_NAME = "posthuman"
TOP_K = 100 # Number of similar responses to retrieve

# -----------------------------
# 🔹 SETUP: Elasticsearch & Embeddings
# -----------------------------
# Connect to Elasticsearch
es = Elasticsearch(ELASTICSEARCH_URL, api_key=API_KEY)

# Load a text embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# -----------------------------
# 🔹 FUNCTION: Retrieve Similar Texts
# -----------------------------
def retrieve_similar_texts(user_input, index=INDEX_NAME, top_k=TOP_K):
    """Search Elasticsearch for similar past responses using vector embeddings."""
    
    # Convert user input into a vector embedding (must be 384 dimensions)
    query_vector = embed_model.encode(user_input).tolist()

    if len(query_vector) != 384:
        raise ValueError(f"Embedding vector has {len(query_vector)} dimensions, expected 384.")

    # ✅ Corrected kNN Query Format
    query_body = {
        "size": top_k,
        "knn": {
            "field": "embedding",  # ✅ Use correct field name
            "query_vector": query_vector,
            "k": top_k,
            "num_candidates": 150,  # ✅ Needs to be inside knn
            "filter": {  # ✅ Optional filter to avoid errors
                "exists": { "field": "embedding" }
            }
        }
    }

    # Execute search
    response = es.search(index=index, body=query_body)

    # Extract past responses from "text" field
    results = [hit["_source"]["text"] for hit in response["hits"]["hits"]]
    return results

# -----------------------------
# 🔹 FUNCTION: Generate AI Response
# -----------------------------
def chat_with_ai(user_input):
    """Generate a response using Mistral, incorporating retrieved texts in a more natural way."""

    # Retrieve past responses
    relevant_texts = retrieve_similar_texts(user_input)

    # Format the prompt with a more natural conversational flow
    conversation_history = "\n".join(
        [f"You: {user_input}\nMe: {text}" for text in relevant_texts]
    )

    # Construct a more natural-sounding prompt
    prompt = f"""
    I am continuing this conversation in the user's texting style.
    
    Previous messages:
    {conversation_history}

    Now, respond to this new message in the same tone:
    "You: {user_input}"
    
    Me:
    """

    # Generate response with Mistral
    response = ollama.chat(model="mistral", messages=[{"role": "user", "content": prompt}])
    return response["message"]["content"]

# -----------------------------
# 🔹 CHAT LOOP (RUN THE BOT)
# -----------------------------
if __name__ == "__main__":
    print("🤖 AI Chat Agent Ready! Type 'exit' to quit.\n")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Goodbye! 👋")
            break

        response = chat_with_ai(user_input)
        print(f"AI: {response}")
