const { Product } = require('../models');

exports.showRegisterForm = (req,res) => res.render('product_register');
exports.registerProduct = async (req,res) => {
  const seller_id = req.session.user.id;
  const { title, description, price, quantity, image_url } = req.body;
  await Product.create({ seller_id, title, description, price, quantity, image_url });
  res.redirect('/products/seller/dashboard');
};
exports.sellerDashboard = async (req,res) => {
  const products = await Product.findAll({ where: { seller_id: req.session.user.id } });
  res.render('seller_dashboard', { products });
};
exports.listPublic = async (req,res) => {
  const products = await Product.findAll({ where: { approved: true, is_sold: false } });
  res.render('product_list', { products });
};