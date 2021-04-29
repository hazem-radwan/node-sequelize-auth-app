const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
let fullpath = path.join(__dirname, "config/config.env");
dotenv.config({ path: fullpath });
const db = require("./db/db.connection");
const Role = db.Role;
const authRouter = require("./routes/auth.router") ; 
const app = express();
const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.sequelize.sync({ force: true }).then(() => {
  console.log("db is dropped and re-built again ... ");
  intitaiteRolesOnConnection();
});
app.get("/", (req, res) => {
  res.json({
    message: "this sis the entry point of our app",
  });
});

app.listen(PORT, () => {
  console.log("app is running on port " + PORT);
});
app.use("/api/auth" , authRouter) ; 
// functions
function intitaiteRolesOnConnection() {
  Role.create({
    id: 1,
    role: "user",
  });
  Role.create({
    id: 2,
    role: "moderate",
  });
  Role.create({
    id: 3,
    role: "admin",
  });
}
