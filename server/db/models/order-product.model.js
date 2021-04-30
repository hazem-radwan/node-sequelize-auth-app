const Order = require("./order.model");
const Product = require("./product.model");
module.exports = (sequelize, Sequelize) => {
  const Order_Product = sequelize.define(
    "order_product",
    {
      productId: {
        type: Sequelize.UUID,
        references: {
          model: Product,
          key: "id",
        },
      },
      orderId: {
        type: Sequelize.UUID,
        references: {
          model: Order,
          key: "id",
        },
      },
      qty: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Order_Product;
};
