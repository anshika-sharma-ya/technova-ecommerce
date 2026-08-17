const { ChatMessage } = require('../models');

class ChatService {
  async saveMessage(senderName, senderRole, text) {
    return await ChatMessage.create({
      senderName,
      senderRole,
      text,
      timestamp: new Date(),
    });
  }

  async getRecentMessages(limit = 50) {
    return await ChatMessage.findAll({
      order: [['createdAt', 'ASC']],
      limit,
    });
  }
}

module.exports = new ChatService();
