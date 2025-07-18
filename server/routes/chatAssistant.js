require("dotenv").config();
const { OpenAI } = require("openai");
const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

router.post("/query", async (req, res) => {
  const userMessage = req.body.message;

  console.log(userMessage);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const systemPrompt = `
You are a system that converts natural language into MongoDB query filters. the db contains the following Schema:
{
"_id": "68709db2402cf56cd3813d9e",
"country_code": "US",
"currency_code": "USD",
"progress": {
"SWITCH_INDEX": true,
"TOTAL_RECORDS_IN_FEED": 16493,
"TOTAL_JOBS_FAIL_INDEXED": 1521,
"TOTAL_JOBS_IN_FEED": 13705,
"TOTAL_JOBS_SENT_TO_ENRICH": 20,
"TOTAL_JOBS_DONT_HAVE_METADATA": 2540,
"TOTAL_JOBS_DONT_HAVE_METADATA_V2": 2568,
"TOTAL_JOBS_SENT_TO_INDEX": 13686
},
"status": "completed",
"timestamp": "2025-07-11T05:16:20.626Z",
"transactionSourceName": "Deal4",
"noCoordinatesCount": 160,
"recordCount": 11118,
"uniqueRefNumberCount": 9253
}

the above numbers are just an example, one document out of around 90k documents.
explanation on the different fields: 
- SWITCH_INDEX: True if indexing switched to a new ElasticSearch index.
- TOTAL_RECORDS_IN_FEED: Items received before filtering.
- TOTAL_JOBS_IN_FEED: Items after filtering (min CPC, etc.).
- TOTAL_JOBS_FAIL_INDEXED: Failed indexing count.
- TOTAL_JOBS_SENT_TO_ENRICH: Jobs sent to LLM for metadata enrichment.
- TOTAL_JOBS_DONT_HAVE_METADATA: Jobs lacking metadata after enrichment.
- TOTAL_JOBS_SENT_TO_INDEX: Successfully indexed jobs.

very important!:
- Respond only with a valid JSON object.
- Do not include any explanation or commentary.
- Do not wrap it in markdown (no \`\`\`json).
- The object should be a MongoDB query thats used inside: collection.find(query).limit(20).toArray() or inside collection.aggregate(query).toArray()
- Do NOT use ISODate() or any shell functions.
- All dates MUST be in plain string ISO format, like "2025-07-01T00:00:00.000Z".

If the user's question is asking for a count, average, or summary statistic, return a MongoDB aggregation pipeline instead of a filter query. Example:

User: "How many jobs failed in June?"
Response:
[
  { "$match": { "timestamp": { "$gte": ..., "$lt": ... } } },
  { "$group": { "_id": null, "totalFailed": { "$sum": "$progress.TOTAL_JOBS_FAIL_INDEXED" } } }
]


 you are questioned by account managers that work in a company called Boston.ai,
 you need to answer politely and informative as possible.
`;

  try {
    const queryResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    let queryText = queryResponse.choices[0].message.content;
    let query;

    try {
      query = JSON.parse(queryText);
    } catch (parseErr) {
      console.error("Failed to parse query:", queryText);

      const fallbackMessage = `
Unfortunately, I couldn't understand your request in a way that can be converted into a valid database query.

Here are some example questions I can help with:
- "How many jobs failed last month in the US?"
- "List jobs that were sent to enrich last week"
- "Show total records received in feeds in July"
- "What percentage of jobs failed to index last quarter?"

Please try rephrasing your question using clear metrics, date ranges, or filters.
  `;

      return res.status(200).json({
        query: null,
        summary: fallbackMessage,
      });
    }

    await client.connect();
    const collection = client.db("boston").collection("transformedFeeds");

    const isAggregation = Array.isArray(query);

    if (isAggregation) {
      results = await collection.aggregate(query).toArray();
    } else {
      results = await collection.find(query).limit(20).toArray();
    }

    const summaryPrompt = isAggregation
      ? `
You are a business data assistant. The user asked: "${userMessage}"
The results are from a MongoDB aggregation query.

Summarize the numeric insight clearly and politely (total failed jobs, average jobs per feed). Do not list documents.

Results:
${JSON.stringify(results, null, 2)}
`
      : `
You are a business data assistant. The user asked: "${userMessage}"
The results are from a MongoDB find query.

Start your answer with a title like: "📄 Matched Documents Summary".

Summarize key fields and values observed across the documents. If there's a pattern (all from US, similar job counts), highlight it. Keep it short and helpful.

Results:
${JSON.stringify(results, null, 2)}
`;

    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You summarize MongoDB query results for business users.",
        },
        { role: "user", content: summaryPrompt },
      ],
    });

    const summary = summaryResponse.choices[0].message.content;

    res.json({ query, summary });
  } catch (err) {
    console.error("Chat Query Error:", err);
    res.status(500).json({ error: "Failed to process query or summarize" });
  }
});

module.exports = router;
