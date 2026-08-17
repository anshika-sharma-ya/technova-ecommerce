const chatService = require('../services/chatService');

class ChatController {
  async getMessages(req, res) {
    try {
      const messages = await chatService.getRecentMessages();
      return res.status(200).json(messages);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const { text, senderName, senderRole } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Message text is required' });
      }

      const name = senderName || (req.user ? req.user.name : 'Guest Customer');
      const role = senderRole || (req.user ? req.user.role : 'customer');

      const message = await chatService.saveMessage(name, role, text);
      return res.status(201).json(message);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ChatController();
