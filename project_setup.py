import os
from pinecone import Pinecone, ServerlessSpec

# -----------------------------
# Step 1: Initialize Pinecone
# -----------------------------
# Make sure your PINECONE_API_KEY is set in your environment variables
# export PINECONE_API_KEY="your_api_key_here" (Mac/Linux)
# setx PINECONE_API_KEY "your_api_key_here" (Windows CMD)
# $env:PINECONE_API_KEY="your_api_key_here" (Windows PowerShell)

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# -----------------------------
# Step 2: Create an index if it doesn't exist
# -----------------------------
index_name = "gsu-chatbot"
dimension = 1536  # Adjust to your vector size

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=dimension,
        metric="cosine",  # choose 'euclidean', 'dotproduct', or 'cosine'
        spec=ServerlessSpec(cloud="aws", region="us-east-1")  # free plan region
    )
    print(f"Index '{index_name}' created.")
else:
    print(f"Index '{index_name}' already exists.")

# -----------------------------
# Step 3: Connect to the index
# -----------------------------
index = pc.Index(index_name)

# -----------------------------
# Step 4: Upsert a sample vector
# -----------------------------
sample_vector = [0.1] * dimension  # Example vector of the correct dimension
upsert_response = index.upsert(vectors=[("sample_1", sample_vector)])
print("Upserted sample vector with ID: sample_1")

# -----------------------------
# Step 5: Query the index
# -----------------------------
query_result = index.query(vector=sample_vector, top_k=1)
print("Query Result:", query_result)
