module.exports = (sequelize, DataTypes) => {
const products = sequelize.define('products', {
productid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
seller_id: { type: DataTypes.INTEGER, allowNull: false },
title: DataTypes.STRING,
description: DataTypes.TEXT,
price: DataTypes.DECIMAL(12,2),
quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
image_url: DataTypes.STRING,
approved: { type: DataTypes.BOOLEAN, defaultValue: false },
is_sold: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'products', timestamps: true });
return products;
};