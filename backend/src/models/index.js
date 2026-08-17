const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const ChatMessage = require('./ChatMessage');
const bcrypt = require('bcryptjs');

// Define Relationships
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Seed initial database content with Tech-Only products & INR prices
async function syncDatabase() {
  await sequelize.sync({ force: false });

  // Clear & re-seed to guarantee Tech-only catalog in Rupees (₹)
  await OrderItem.destroy({ where: {} });
  await Order.destroy({ where: {} });
  await Product.destroy({ where: {} });
  await Category.destroy({ where: {} });

  const laptops = await Category.create({ name: 'Laptops & PCs', description: 'High-performance laptops, ultrabooks, and workstations' });
  const mobiles = await Category.create({ name: 'Smartphones & Tablets', description: 'Latest flagship mobile phones and tablets' });
  const audio = await Category.create({ name: 'Audio & Wearables', description: 'Wireless headphones, smartwatches, and speakers' });
  const gaming = await Category.create({ name: 'Gaming & Accessories', description: 'Mechanical keyboards, gaming mice, monitors, and chargers' });

  // Laptops & PCs
  await Product.create({
    name: 'Pro Ultra Book 15" M3',
    description: '15-inch Liquid Retina XDR display, 16GB Unified RAM, 512GB SSD, 18-hour battery life.',
    price: 119999,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    categoryId: laptops.id,
  });

  await Product.create({
    name: 'ROG Strix Gaming Laptop RTX 4070',
    description: 'Intel i9 13th Gen, 32GB DDR5 RAM, 1TB NVMe SSD, 240Hz QHD Gaming Display.',
    price: 145000,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    categoryId: laptops.id,
  });

  await Product.create({
    name: 'UltraSlim Convertible 2-in-1 Laptop',
    description: '14-inch OLED Touchscreen, Intel Core i7, 16GB RAM, stylus pen included.',
    price: 78990,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
    categoryId: laptops.id,
  });

  // Smartphones & Tablets
  await Product.create({
    name: 'Flagship Smartphone Pro 256GB',
    description: 'Titanium chassis, 48MP Triple Camera System, A17 Bionic chip, 120Hz ProMotion display.',
    price: 129900,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    categoryId: mobiles.id,
  });

  await Product.create({
    name: 'Galaxy Ultra 5G 512GB',
    description: '200MP camera with 100x Space Zoom, built-in S-Pen, Snapdragon 8 Gen 3 Processor.',
    price: 114999,
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    categoryId: mobiles.id,
  });

  await Product.create({
    name: 'Pro Tablet 11" M2 Chip',
    description: 'Liquid Retina Display, Wi-Fi 6E, Face ID, USB-C Thunderbolt support.',
    price: 74900,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    categoryId: mobiles.id,
  });

  // Audio & Wearables
  await Product.create({
    name: 'Wireless ANC Noise-Canceling Headphones',
    description: 'Industry-leading noise cancellation, custom EQ, touch controls, 30-hour battery.',
    price: 24999,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    categoryId: audio.id,
  });

  await Product.create({
    name: 'Smart Watch Ultra Edition',
    description: 'Rugged titanium case, dual-frequency GPS, cellular connectivity, 36-hour battery life.',
    price: 49900,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    categoryId: audio.id,
  });

  await Product.create({
    name: 'True Wireless Earbuds Pro',
    description: 'Active Noise Cancellation, Transparency mode, MagSafe charging case, spatial audio.',
    price: 19999,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    categoryId: audio.id,
  });

  await Product.create({
    name: '360° Portable Bluetooth Speaker',
    description: 'Waterproof IPX7 rating, punchy deep bass, 24-hour continuous playtime.',
    price: 8999,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    categoryId: audio.id,
  });

  // Gaming & Accessories
  await Product.create({
    name: 'RGB Mechanical Gaming Keyboard',
    description: 'Hot-swappable mechanical switches, per-key RGB backlighting, aluminum top frame.',
    price: 6499,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    categoryId: gaming.id,
  });

  await Product.create({
    name: 'Ultra-Light Wireless Gaming Mouse',
    description: 'Sub-60g lightweight design, HERO 25K sensor, 70-hour rechargeable battery.',
    price: 4999,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    categoryId: gaming.id,
  });

  await Product.create({
    name: '27" Curved 165Hz Gaming Monitor',
    description: '1ms response time, WQHD 1440p resolution, AMD FreeSync Premium support.',
    price: 26999,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    categoryId: gaming.id,
  });

  await Product.create({
    name: '100W GaN 4-Port Fast Charger',
    description: 'Compact Gallium Nitride fast charger for laptops, smartphones, and tablets.',
    price: 3499,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    categoryId: gaming.id,
  });

    // Clear users to update name to Aadya
    await User.destroy({ where: {} });

    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedCustomerPassword = await bcrypt.hash('user123', 10);

    await User.create({
      name: 'System Admin',
      email: 'admin@ecommerce.com',
      password: hashedAdminPassword,
      role: 'admin',
    });

    await User.create({
      name: 'Aadya',
      email: 'user@ecommerce.com',
      password: hashedCustomerPassword,
      role: 'customer',
    });

  console.log('Database seeded with 14 Tech-only products across 4 tech categories with Rupee prices (₹).');
}

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  ChatMessage,
  syncDatabase,
};
