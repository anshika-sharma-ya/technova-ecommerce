// Observer Pattern for Event Notifications

class NotificationService {
  constructor() {
    this.observers = [];
  }

  // Register an observer
  subscribe(observer) {
    this.observers.push(observer);
  }

  // Unregister an observer
  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // Notify all observers
  notify(event, payload) {
    this.observers.forEach((observer) => {
      if (typeof observer.update === 'function') {
        observer.update(event, payload);
      }
    });
  }
}

// Singleton Instance of Notification Observer Manager
module.exports = new NotificationService();
