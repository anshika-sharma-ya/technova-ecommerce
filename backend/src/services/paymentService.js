// Strategy Pattern for Payment Processing

class CreditCardPaymentStrategy {
  async processPayment(amount, details) {
    console.log(`[Strategy] Processing Credit Card Payment of $${amount}`);
    return { success: true, transactionId: `CC-${Date.now()}`, method: 'credit_card' };
  }
}

class PaypalPaymentStrategy {
  async processPayment(amount, details) {
    console.log(`[Strategy] Processing PayPal Payment of $${amount}`);
    return { success: true, transactionId: `PP-${Date.now()}`, method: 'paypal' };
  }
}

class CashOnDeliveryStrategy {
  async processPayment(amount, details) {
    console.log(`[Strategy] Processing Cash on Delivery for $${amount}`);
    return { success: true, transactionId: `COD-${Date.now()}`, method: 'cod' };
  }
}

// Payment Context
class PaymentService {
  constructor() {
    this.strategies = {
      credit_card: new CreditCardPaymentStrategy(),
      paypal: new PaypalPaymentStrategy(),
      cod: new CashOnDeliveryStrategy(),
    };
  }

  async processPayment(method = 'credit_card', amount, details = {}) {
    const strategy = this.strategies[method] || this.strategies['credit_card'];
    return await strategy.processPayment(amount, details);
  }
}

module.exports = new PaymentService();
