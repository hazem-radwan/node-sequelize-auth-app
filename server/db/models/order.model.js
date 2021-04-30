module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    total: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["PENDING", "DELIVERED"],
      defaultValue: "PENDING",
    },
  },
  {
    freezeTableName: true,
  });
  return Order;
};
