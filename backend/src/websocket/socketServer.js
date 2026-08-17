const { Server } = require('socket.io');
const notificationService = require('../services/notificationService');
const chatService = require('../services/chatService');

function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Observer Implementation: Connect NotificationService (Subject) to Socket.io (Observer)
  const socketObserver = {
    update: (event, payload) => {
      console.log(`[WebSocket Broadcast] Event: ${event}`, payload);
      io.emit('notification', { event, payload, timestamp: new Date() });
    },
  };

  notificationService.subscribe(socketObserver);

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Real-Time Chat Listener
    socket.on('send_message', async (data) => {
      try {
        const message = await chatService.saveMessage(
          data.senderName || 'Customer',
          data.senderRole || 'customer',
          data.text
        );
        // Broadcast to all connected clients
        io.emit('receive_message', message);
      } catch (err) {
        console.error('Error handling chat socket message:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = setupWebSocket;
