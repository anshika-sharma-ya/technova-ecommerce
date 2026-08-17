const { Product, Category } = require('../models');

// Repository Pattern for Product Operations
class ProductRepository {
  async findAll() {
    return await Product.findAll({ include: [{ model: Category, attributes: ['id', 'name'] }] });
  }

  async findById(id) {
    return await Product.findByPk(id, { include: [{ model: Category, attributes: ['id', 'name'] }] });
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async update(id, updateData) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(updateData);
  }

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return false;
    await product.destroy();
    return true;
  }
}

module.exports = new ProductRepository();
