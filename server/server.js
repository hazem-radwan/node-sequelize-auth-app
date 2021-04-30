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

db.sequelize
  .query("SET FOREIGN_KEY_CHECKS = 0")
  .then(function () {
    return db.sequelize.sync({ force: true });
    
  })
  .then(
    function () {
      console.log("Database synchronised.");
      intitaiteRolesOnConnection()
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
async function  intitaiteRolesOnConnection() {
  await Role.create({
    id : 1 , 
    role: "user",
  });
  await Role.create({
    id:2 , 
    role: "moderate",
  });
  await Role.create({
    id : 3 , 
    role: "admin",
  });
}
