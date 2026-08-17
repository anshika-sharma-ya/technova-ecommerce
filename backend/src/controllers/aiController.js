const aiService = require('../services/aiService');

class AiController {
  async chatAssistant(req, res) {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await aiService.chatAssistant(message);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async compareProducts(req, res) {
    try {
      const { productIds } = req.body;
      if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
        return res.status(400).json({ error: 'At least 2 product IDs are required for AI comparison' });
      }

      const comparison = await aiService.compareProducts(productIds);
      return res.status(200).json(comparison);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async summarizeReviews(req, res) {
    try {
      const summary = await aiService.summarizeReviews(req.params.id);
      return res.status(200).json(summary);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async generateBundle(req, res) {
    try {
      const { budget, usage } = req.body;
      const parsedBudget = parseFloat(budget) || 100000;
      const parsedUsage = usage || 'general';

      const bundle = await aiService.generateBundle(parsedBudget, parsedUsage);
      return res.status(200).json(bundle);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AiController();
