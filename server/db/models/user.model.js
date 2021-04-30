module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    email: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    balance: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
  },
  {
    freezeTableName: true,
  });
  return User;
};
