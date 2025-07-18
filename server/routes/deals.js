const express = require("express");
const router = express.Router();
const { getDb } = require("../db");

router.get("/summary", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("transformedFeeds");

    const pipeline = [
      {
        $group: {
          _id: null,
          totalRecords: { $sum: "$recordCount" },
          totalNoCoords: { $sum: "$noCoordinatesCount" },
          totalFailed: { $sum: "$progress.TOTAL_JOBS_FAIL_INDEXED" },
          totalDeals: { $sum: 1 },
          uniqueSources: { $addToSet: "$transactionSourceName" },
          totalNoMetadata: { $sum: "$progress.TOTAL_JOBS_DONT_HAVE_METADATA" },
          totalJobs: { $sum: "$progress.TOTAL_JOBS_IN_FEED" },
          totalEnriched: { $sum: "$progress.TOTAL_JOBS_SENT_TO_ENRICH" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRecords: 1,
          totalNoCoords: 1,
          totalFailed: 1,
          totalDeals: 1,
          totalJobs: 1,
          totalNoMetadata: 1,
          totalEnriched: 1,
          uniqueSources: { $size: "$uniqueSources" },
          avgJobsPerFeed: {
            $cond: [
              { $gt: ["$totalDeals", 0] },
              { $divide: ["$totalJobs", "$totalDeals"] },
              0,
            ],
          },
          indexingSuccessRate: {
            $cond: [
              { $gt: ["$totalJobs", 0] },
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$totalJobs", "$totalFailed"] },
                      "$totalJobs",
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
          metadataCoverageRate: {
            $cond: [
              { $gt: ["$totalJobs", 0] },
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$totalJobs", "$totalNoMetadata"] },
                      "$totalJobs",
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ];

    const summary = await collection.aggregate(pipeline).toArray();
    res.json(summary[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

router.get("/monthly", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("transformedFeeds");

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const pipeline = [
      {
        $addFields: {
          parsedTimestamp: { $toDate: "$timestamp" },
        },
      },
      {
        $match: {
          parsedTimestamp: { $gte: threeMonthsAgo },
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$parsedTimestamp" },
            month: { $month: "$parsedTimestamp" },
          },
          totalJobs: { $sum: "$progress.TOTAL_JOBS_IN_FEED" },
          dealCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    const formatted = results.map((entry) => ({
      month: `${entry._id.month}/${entry._id.year}`,
      totalJobs: entry.totalJobs,
      dealCount: entry.dealCount,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Monthly aggregation failed:", err);
    res.status(500).json({ error: "Failed to fetch monthly stats" });
  }
});

router.get("/by-country", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("transformedFeeds");

    const pipeline = [
      {
        $group: {
          _id: "$country_code",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 4,
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    res.json(result);
  } catch (err) {
    console.error("Country aggregation failed:", err);
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

router.get("/top-deals", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("transformedFeeds");

    const pipeline = [
      {
        $project: {
          _id: 0,
          transactionSourceName: 1,
          timestamp: 1,
          country_code: 1,
          recordCount: 1,
          noCoordinatesCount: 1,
          totalJobs: "$progress.TOTAL_JOBS_IN_FEED",
          failedJobs: "$progress.TOTAL_JOBS_FAIL_INDEXED",
        },
      },
      {
        $sort: { totalJobs: -1 },
      },
      {
        $limit: 500,
      },
    ];

    const deals = await collection.aggregate(pipeline).toArray();
    res.json(deals);
  } catch (err) {
    console.error("Top deals aggregation failed:", err);
    res.status(500).json({ error: "Failed to fetch top deals" });
  }
});

module.exports = router;
