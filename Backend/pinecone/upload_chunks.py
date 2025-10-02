import os
from data_chunks import chunks
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "gsu-chatbot"
dimension = 1536  # Must match your embedding size

# Create index if it doesn't exist
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=dimension,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    print(f"✅ Index '{index_name}' created.")
else:
    print(f"Index '{index_name}' already exists.")

index = pc.Index(index_name)

# Helper function to get embeddings
def get_embedding(text):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Prepare vectors for Pinecone
vectors = []
for chunk in chunks:
    embedding = get_embedding(chunk["text"])
    vectors.append({
        "id": chunk["id"],
        "values": embedding,
        "metadata": {
            "text": chunk["text"],  # full text for context
            "source": chunk["metadata"]["source"],
            "topic": chunk["metadata"]["topic"]
        }
    })

# Upsert all vectors
index.upsert(vectors)
print(f"✅ Uploaded {len(vectors)} chunks to Pinecone!")
