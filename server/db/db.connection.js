const Sequelize = require("sequelize");
const Order_Product = require("./models/order-product.model");
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

db.Order = require("./models/order.model")(sequelize, Sequelize);
db.Product = require("./models/product.model")(sequelize, Sequelize);
db.Order_Product = require("./models/order-product.model")(
  sequelize,
  Sequelize
);
// user : role     M:N
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

// product  order

db.Product.belongsToMany(db.Order, {
  through: "order_product",
});
db.Order.belongsToMany(db.Product, {
  through: "order_product", // table name only
});

db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);
module.exports = db;
