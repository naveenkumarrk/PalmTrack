require('dotenv').config(); // Load env variables at the top
const axios = require('axios');
const Together = require('together-ai');

const Neera = require('../models/Neera');
const ProcessingBatch = require('../models/ProcessingBatch');
const Inventory = require('../models/Inventory');

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

// GET /summary - Dashboard data
exports.getDashboardSummary = async (req, res) => {
  try {
    const neeraCollections = await Neera.find();
    const totalNeeraLiters = neeraCollections.reduce((sum, neera) => sum + neera.quantityLiters, 0);

    const processingBatches = await ProcessingBatch.find();

    let totalOutput = 0;
    let totalWastage = 0;
    processingBatches.forEach(batch => {
      batch.stageLogs.forEach(log => {
        totalOutput += log.outputLiters || 0;
        totalWastage += log.wastageLiters || 0;
      });
    });

    const inventories = await Inventory.find();
    const totalSugarKg = inventories.reduce((sum, item) => sum + (item.netWeightKg || 0), 0);

    const totalBatches = processingBatches.length;
    const completedBatches = processingBatches.filter(batch => batch.isCompleted).length;
    const processingBatchesCount = processingBatches.filter(batch => !batch.isCompleted).length;
    const pendingBatches = neeraCollections.filter(neera => neera.status === 'Pending').length;

    const wastagePercentage = totalNeeraLiters > 0
      ? ((totalWastage / totalNeeraLiters) * 100).toFixed(2)
      : '0.00';

    res.json({
      totalNeeraLiters,
      totalSugarKg,
      totalBatches,
      completedBatches,
      processingBatches: processingBatchesCount,
      pendingBatches,
      wastagePercentage
    });

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
};

// POST /chat-summary - Chatbot QnA
exports.getChatSummary = async (req, res) => {
  try {
    const { question } = req.body;

    // Fetch summary
    const summaryRes = await axios.get(`${process.env.API_URL}/dashboard/summary`);
    const summary = summaryRes.data;

    const prompt = `
You are a smart assistant helping monitor a Neera processing unit. Here's the current summary:
- Total Neera Collected: ${summary.totalNeeraLiters} liters
- Total Sugar Produced: ${summary.totalSugarKg} kg
- Total Batches: ${summary.totalBatches}
- Completed Batches: ${summary.completedBatches}
- Processing Batches: ${summary.processingBatches}
- Pending Batches: ${summary.pendingBatches}
- Wastage Percentage: ${summary.wastagePercentage}%

User asked: "${question}"

Answer clearly and concisely using the above data.
`;

    const response = await together.chat.completions.create({
      model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ response: response.choices[0].message.content });
  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(500).json({ error: 'Failed to generate response', details: err.message });
  }
};
