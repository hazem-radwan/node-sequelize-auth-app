module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    category: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    brand: {
      type: Sequelize.TEXT,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  });
  return Product;
};
