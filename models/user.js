module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
name: DataTypes.STRING,
email: { type: DataTypes.STRING, unique: true },
phone: { type: DataTypes.STRING, unique: true },
password_hash: DataTypes.STRING,
role: { type: DataTypes.ENUM('admin','seller','customer'), defaultValue: 'customer' },
mobile_money_account: DataTypes.STRING
}, { tableName: 'users', timestamps: true });
return User;
};