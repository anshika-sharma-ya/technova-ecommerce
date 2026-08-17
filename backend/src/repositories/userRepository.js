const { User } = require('../models');

// Repository Pattern for User Operations
class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id) {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findAll() {
    return await User.findAll({ attributes: { exclude: ['password'] } });
  }
}

module.exports = new UserRepository();
