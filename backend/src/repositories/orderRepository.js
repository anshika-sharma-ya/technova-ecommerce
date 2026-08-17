const { Order, OrderItem, Product, User } = require('../models');

// Repository Pattern for Order Operations
class OrderRepository {
  async createOrder(orderData, items) {
    const order = await Order.create(orderData);
    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
    await OrderItem.bulkCreate(orderItems);
    return await this.findById(order.id);
  }

  async findById(id) {
    return await Order.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: OrderItem, include: [Product] },
      ],
    });
  }

  async findByUserId(userId) {
    return await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findAll() {
    return await Order.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: OrderItem, include: [Product] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async updateStatus(id, status) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    order.status = status;
    await order.save();
    return order;
  }
}

module.exports = new OrderRepository();
