const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
let fullpath = path.join(__dirname, "config/config.env");
dotenv.config({ path: fullpath });
const db = require("./db/db.connection");
const Role = db.Role;
const authRouter = require("./routes/auth.router");
const productRouter = require("./routes/product.router");
const app = express();
const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// db.sequelize.sync({ force: true  , alter : true}).then(() => {
//   console.log("db is dropped and re-built again ... ");
//   intitaiteRolesOnConnection();
// });
db.sequelize
  .query("SET FOREIGN_KEY_CHECKS = 0")
  .then(function () {
    return db.sequelize.sync({ force: true });
  })
  // .then(function () {
  //   return db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  // })
  .then(
    function () {
      console.log("Database synchronised.");
    },
    function (err) {
      console.log(err);
    }
  );
app.get("/", (req, res) => {
  res.json({
    message: "this sis the entry point of our app",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.listen(PORT, () => {
  console.log("app is running on port " + PORT);
});

// functions
function intitaiteRolesOnConnection() {
  Role.create({
    role: "user",
  });
  Role.create({
    role: "moderate",
  });
  Role.create({
    role: "admin",
  });
}
