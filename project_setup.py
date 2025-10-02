import os
from openai import OpenAI
from data_chunks import chunks  # rename to plural if it's a list
from pinecone import Pinecone, ServerlessSpec

# -----------------------------
# Step 1: Initialize clients
# -----------------------------
openai_client = OpenAI(api_key=os.getenv("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"))
pc = Pinecone(api_key=os.getenv("pcsk_mBiaG_QMbCjMHP4Rz468EMSWSoqWjeovk21S4B9bx5vrDCsb2juAdXw874EHseasQQrbd"))

def get_embedding(text):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# -----------------------------
# Step 2: Create an index if it doesn't exist
# -----------------------------
index_name = "gsu-chatbot"
dimension = 1536  # for text-embedding-3-small

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=dimension,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    print(f"Index '{index_name}' created.")
else:
    print(f"Index '{index_name}' already exists.")

# -----------------------------
# Step 3: Connect to the index
# -----------------------------
index = pc.Index(index_name)

# -----------------------------
# Step 4: Upsert your chunks
# -----------------------------
vectors_to_upsert = []
for chunk in chunks:
    vector = get_embedding(chunk["text"])
    vectors_to_upsert.append((chunk["id"], vector, chunk["metadata"]))

index.upsert(vectors=vectors_to_upsert)
print(f"Upserted {len(vectors_to_upsert)} chunks.")

# -----------------------------
# Step 5: Query the index
# -----------------------------
query = "When is the deadline for FAFSA?"
query_vector = get_embedding(query)

results = index.query(vector=query_vector, top_k=3, include_metadata=True)

for match in results.matches:
    print(match.id, match.score, match.metadata)

