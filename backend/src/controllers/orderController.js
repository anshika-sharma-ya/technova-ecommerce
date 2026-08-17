const orderRepository = require('../repositories/orderRepository');
const paymentService = require('../services/paymentService');
const notificationService = require('../services/notificationService');

class OrderController {
  async createOrder(req, res) {
    try {
      const { items, shippingAddress, paymentMethod } = req.body;
      if (!items || !items.length || !shippingAddress) {
        return res.status(400).json({ error: 'Order items and shipping address are required' });
      }

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Strategy Pattern: Process Payment via PaymentService
      const paymentResult = await paymentService.processPayment(paymentMethod, totalAmount, {
        userId: req.user.id,
      });

      if (!paymentResult.success) {
        return res.status(400).json({ error: 'Payment processing failed' });
      }

      // Create Order in DB via Repository Pattern
      const order = await orderRepository.createOrder(
        {
          userId: req.user.id,
          totalAmount,
          status: 'Processing',
          paymentMethod: paymentMethod || 'credit_card',
          shippingAddress,
        },
        items
      );

      // Observer Pattern: Notify real-time subscribers of new order creation
      notificationService.notify('ORDER_CREATED', {
        orderId: order.id,
        user: req.user.name,
        amount: totalAmount,
      });

      return res.status(201).json(order);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getUserOrders(req, res) {
    try {
      const orders = await orderRepository.findByUserId(req.user.id);
      return res.status(200).json(orders);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await orderRepository.findAll();
      return res.status(200).json(orders);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await orderRepository.updateStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Observer Pattern: Broadcast status change event
      notificationService.notify('ORDER_STATUS_CHANGED', {
        orderId: order.id,
        status: order.status,
        userId: order.userId,
      });

      return res.status(200).json(order);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new OrderController();
