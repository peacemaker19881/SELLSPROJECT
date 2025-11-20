module.exports = (sequelize, DataTypes) => {
  const ProductOut = sequelize.define('ProductOut', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productid: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    sale_price: DataTypes.DECIMAL(12,2),
    commission_amount: DataTypes.DECIMAL(12,2),
    seller_amount: DataTypes.DECIMAL(12,2),
    mobile_money_txn_id: DataTypes.STRING
  }, { tableName: 'product_out', timestamps: true });
  return ProductOut;
};
