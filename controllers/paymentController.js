const { sequelize, Product, ProductOut, Transaction, User } = require('../models');
const mtn = require('../services/mtnService');

exports.initiatePurchase = async (req,res) => {
  const productId = req.params.productId;
  const buyerId = req.session.user.id;
  const buyer = await User.findByPk(buyerId);
  const t = await sequelize.transaction();
  try {
    const product = await Product.findOne({ where: { productid: productId, is_sold: false, approved: true }, transaction: t, lock: t.LOCK.UPDATE });
    if (!product) { await t.rollback(); return res.status(400).send('Product not available'); }
    const salePrice = parseFloat(product.price);
    const commission = +(salePrice * 0.10).toFixed(2);
    const sellerAmount = +(salePrice - commission).toFixed(2);
    const paymentTx = await Transaction.create({ user_id: buyerId, type: 'payment', amount: salePrice, status: 'pending', metadata: { productId } }, { transaction: t });

    // Initiate MTN RequestToPay (Collection)
    // Note: in sandbox you need API user and subscription key. The requestToPay function returns referenceId.
    const externalId = `order_${paymentTx.id}`;
    const payerPhone = buyer.phone; // ensure buyer has a phone in MSISDN format e.g. 2507xxxxxxxx
    const r = await mtn.requestToPay(salePrice, 'RWF', externalId, payerPhone, 'Payment for order', 'Order payment');

    await t.commit();
    // show page instructing user to approve/enter PIN on phone - poll or wait for webhook
    return res.render('payment_request', { product, salePrice, commission, sellerAmount, txId: paymentTx.id, mtnRef: r.referenceId });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).send('Error initiating purchase');
  }
};

exports.webhook = async (req,res) => {
  // MTN webhook will call this endpoint for collection notifications. Verify signature in production per docs.
  const payload = req.body;
  console.log('MTN webhook payload:', payload);
  // Expected: { referenceId, status, amount, externalId, payer, ... } depending on provider
  // This sample assumes metadata.externalId contains order info
  // In real integration map provider fields accordingly
  res.status(200).send('OK');
};
