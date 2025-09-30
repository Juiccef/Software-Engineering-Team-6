import os
from openai import OpenAI
from pinecone import Pinecone

# Initialize clients
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("gsu-chatbot")

# Helper function to get embeddings
def get_embedding(text):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Query Pinecone for context
def ask_chatbot(user_question, top_k=3):
    query_vector = get_embedding(user_question)
    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True
    )

    # Extract full text from metadata
    context_texts = [match['metadata']['text'] for match in results['matches']]
    context = "\n\n".join(context_texts)

    # Generate GPT answer with context
    prompt = (
        f"Use the following information to answer the question:\n\n{context}\n\n"
        f"Question: {user_question}\nAnswer:"
    )

    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return response.choices[0].message.content.strip()

# Example usage
if __name__ == "__main__":
    user_question = input("Ask the GSU chatbot: ")
    answer = ask_chatbot(user_question)
    print("Chatbot:", answer)
