module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    type: DataTypes.ENUM('payment','payout','commission'),
    amount: DataTypes.DECIMAL(12,2),
    currency: { type: DataTypes.STRING, defaultValue: 'RWF' },
    status: { type: DataTypes.ENUM('pending','success','failed'), defaultValue: 'pending' },
    provider_txn_id: DataTypes.STRING,
    metadata: DataTypes.JSON
  }, { tableName: 'transactions', timestamps: true });
  return Transaction;
};
