const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB, // database name
  process.env.USER, // database username
  process.env.PASSWORD, // database password
  {
    host: process.env.HOST, // database host
    dialect: process.env.DIALECT, // database dialect
    pool: {
      // pool connection
      acquire: +process.env.POOL_ACQUIRE,
      min: +process.env.POOL_MIN, //
      max: +process.env.POOL_MAX,
      idle: +process.env.POOL_IDLE,
    },
  }
);

const db = {
  sequelize,
  Sequelize,
  Roles: ["user", "moderate", "admin"],
};

db.User = require("./models/user.model")(sequelize, Sequelize);
db.Role = require("./models/role.model")(sequelize, Sequelize);

db.User.belongsToMany(db.Role, {
  // many-to-many relationship
  through: "user_role",
  foriegnKey: "userId",
  otherKey: "roleId",
});

db.Role.belongsToMany(db.User, {
  // many-to-many relationship
  through: "user_role",
  foriegnKey: "roleId", // representation of "current-table" Primary-key
  otherKey: "userId", // representation of "tergeted-table" Primary-key
});

module.exports = db;
