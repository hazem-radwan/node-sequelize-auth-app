module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("role", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    role: {
      type: Sequelize.STRING,
      unique: true,
    },
  });
  return Role;
};
