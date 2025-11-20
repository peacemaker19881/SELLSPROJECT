const { Product } = require('../models');

exports.pendingProducts = async (req,res) => {
  const products = await Product.findAll({ where: { approved: false } });
  res.render('admin_pending', { products });
};

exports.approveProduct = async (req,res) => {
  const id = req.params.id;
  await Product.update({ approved: true }, { where: { productid: id } });
  res.redirect('/admin/pending-products');
};