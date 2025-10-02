/**
 * Pinecone Data Upload Script
 * 
 * This script uploads GSU-specific knowledge chunks to Pinecone
 * for enhanced context-aware responses.
 * 
 * @author GSU Software Engineering Team 6
 * @version 1.0.0
 */

require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');

// GSU-specific knowledge chunks
const gsuKnowledgeChunks = [
  {
    id: "cs_four_year_plan_overview",
    text: "The Bachelor of Science in Computer Science at Georgia State University requires a total of 120 credit hours. The program provides students with a strong foundation in mathematics, science, and computer science, preparing them for careers in technology and research or for graduate study. Students follow a structured four-year plan of study that includes core curriculum, major requirements, and electives.",
    metadata: {
      source: "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
      topic: "CS degree requirements"
    }
  },
  {
    id: "cs_four_year_plan_first_year",
    text: "In the first year, students complete English Composition I and II, Precalculus, and Calculus I. They also begin computer science coursework with CSC 1301 (Principles of Computer Science I) and CSC 1302 (Principles of Computer Science II). Additional requirements include U.S. History, Social Science electives, KINE 1000 Lifetime Fitness, and GSU 1010 New Student Orientation. By the end of the first year, students will have completed approximately 30 credit hours.",
    metadata: {
      source: "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
      topic: "CS degree requirements"
    }
  },
  {
    id: "cs_four_year_plan_second_year",
    text: "In the second year, students progress to Calculus II and III, Data Structures (CSC 2720), and Theoretical Foundations of Computer Science (CSC 2510). They also complete two lab science courses and additional Social Science electives. KINE 2000 Health and Wellness is also part of the second-year plan. By the end of the sophomore year, students should have completed around 61 credit hours.",
    metadata: {
      source: "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
      topic: "CS degree requirements"
    }
  },
  {
    id: "cs_four_year_plan_third_year",
    text: "In the third year, students take System-Level Programming (CSC 3320), Computer Organization and Programming (CSC 3210), and Algorithms (CSC 4330). They also complete lab sciences, a humanities elective, Database Systems (CSC 4520), Programming Languages (CSC 4320), and Software Engineering (CSC 4222). This year emphasizes core computer science and upper-division coursework.",
    metadata: {
      source: "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
      topic: "CS degree requirements"
    }
  },
  {
    id: "cs_four_year_plan_fourth_year",
    text: "In the fourth year, students complete the Senior Capstone Project sequence (CSC 4980 and CSC 4981), along with multiple computer science electives. Major electives, free electives, and additional humanities or fine arts courses round out the degree. This final year allows students to specialize in areas of interest while demonstrating their skills in a capstone project. By graduation, students will have completed 120 credit hours.",
    metadata: {
      source: "https://csds.gsu.edu/b-s-in-computer-science-four-year-plan-of-study/",
      topic: "CS degree requirements"
    }
  },
  {
    id: "gsu_general_info",
    text: "Georgia State University is a leading urban research university located in downtown Atlanta. Founded in 1913, GSU serves over 50,000 students across multiple campuses. The university offers over 250 degree programs across 12 colleges and schools, including the College of Arts & Sciences, J. Mack Robinson College of Business, College of Education & Human Development, and many others.",
    metadata: {
      source: "https://www.gsu.edu/about/",
      topic: "GSU general information"
    }
  },
  {
    id: "fafsa_deadline_info",
    text: "The FAFSA (Free Application for Federal Student Aid) deadline for Georgia State University is typically March 1st for priority consideration. Students should complete the FAFSA as early as possible after October 1st of the year before they plan to attend. Late applications may still be considered, but funding may be limited.",
    metadata: {
      source: "https://financialaid.gsu.edu/financial-aid-process/",
      topic: "Financial aid"
    }
  },
  {
    id: "campus_resources",
    text: "Georgia State University provides numerous campus resources including the Student Success Center, Career Services, Counseling and Testing Center, Disability Services, International Student Services, and the Library. The university also offers tutoring services, academic advising, and various student organizations and clubs.",
    metadata: {
      source: "https://www.gsu.edu/student-life/",
      topic: "Campus resources"
    }
  }
];

/**
 * Initialize OpenAI client for embeddings
 */
function initializeOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }

  return new OpenAI({
    apiKey: apiKey,
  });
}

/**
 * Initialize Pinecone client
 */
function initializePinecone() {
  const apiKey = process.env.PINECONE_API_KEY;
  
  if (!apiKey) {
    throw new Error('PINECONE_API_KEY not found in environment variables');
  }

  return new Pinecone({
    apiKey: apiKey,
  });
}

/**
 * Get embedding for text using OpenAI
 */
async function getEmbedding(text, openaiClient) {
  try {
    const response = await openaiClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('❌ Error generating embedding:', error);
    throw error;
  }
}

/**
 * Upload knowledge chunks to Pinecone
 */
async function uploadChunksToPinecone() {
  try {
    console.log('🚀 Starting Pinecone upload process...');

    // Initialize clients
    const openaiClient = initializeOpenAI();
    const pineconeClient = initializePinecone();

    const indexName = process.env.PINECONE_INDEX_NAME || 'gsu-chatbot';
    const dimension = 1536; // text-embedding-3-small dimension

    // Create index if it doesn't exist
    const existingIndexes = await pineconeClient.listIndexes();
    if (!existingIndexes.indexes.some(index => index.name === indexName)) {
      console.log(`📦 Creating Pinecone index: ${indexName}`);
      await pineconeClient.createIndex({
        name: indexName,
        dimension: dimension,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log(`✅ Index '${indexName}' created successfully`);
    } else {
      console.log(`📦 Index '${indexName}' already exists`);
    }

    // Connect to the index
    const index = pineconeClient.index(indexName);

    // Prepare vectors for upload
    console.log('🔄 Generating embeddings and preparing vectors...');
    const vectors = [];

    for (const chunk of gsuKnowledgeChunks) {
      console.log(`   Processing: ${chunk.id}`);
      const embedding = await getEmbedding(chunk.text, openaiClient);
      
      vectors.push({
        id: chunk.id,
        values: embedding,
        metadata: {
          text: chunk.text,
          source: chunk.metadata.source,
          topic: chunk.metadata.topic
        }
      });
    }

    // Upload vectors to Pinecone
    console.log('📤 Uploading vectors to Pinecone...');
    await index.upsert(vectors);

    console.log(`✅ Successfully uploaded ${vectors.length} knowledge chunks to Pinecone!`);
    console.log('🎉 GSU Chatbot knowledge base is now ready!');

  } catch (error) {
    console.error('❌ Error uploading to Pinecone:', error);
    process.exit(1);
  }
}

/**
 * Test the uploaded data
 */
async function testPineconeQuery() {
  try {
    console.log('\n🧪 Testing Pinecone query...');
    
    const openaiClient = initializeOpenAI();
    const pineconeClient = initializePinecone();
    const indexName = process.env.PINECONE_INDEX_NAME || 'gsu-chatbot';
    const index = pineconeClient.index(indexName);

    // Test query
    const testQuery = "What are the requirements for Computer Science degree?";
    const queryEmbedding = await getEmbedding(testQuery, openaiClient);

    const results = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });

    console.log(`📝 Test query: "${testQuery}"`);
    console.log('📊 Results:');
    results.matches.forEach((match, index) => {
      console.log(`   ${index + 1}. ${match.id} (score: ${match.score.toFixed(3)})`);
      console.log(`      Topic: ${match.metadata.topic}`);
    });

  } catch (error) {
    console.error('❌ Error testing Pinecone query:', error);
  }
}

// Main execution
if (require.main === module) {
  uploadChunksToPinecone()
    .then(() => testPineconeQuery())
    .then(() => {
      console.log('\n🎯 Upload process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Upload process failed:', error);
      process.exit(1);
    });
}

module.exports = {
  uploadChunksToPinecone,
  testPineconeQuery,
  gsuKnowledgeChunks
};
