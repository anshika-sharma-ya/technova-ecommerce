const productRepository = require('../repositories/productRepository');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productRepository.findAll();
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productRepository.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async createProduct(req, res) {
    try {
      const { name, description, price, stock, imageUrl, categoryId } = req.body;
      if (!name || !price || !categoryId) {
        return res.status(400).json({ error: 'Name, price, and categoryId are required' });
      }

      const newProduct = await productRepository.create({
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock) || 10,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
        categoryId: parseInt(categoryId),
      });

      return res.status(201).json(newProduct);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const updatedProduct = await productRepository.update(req.params.id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(updatedProduct);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const deleted = await productRepository.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ProductController();
