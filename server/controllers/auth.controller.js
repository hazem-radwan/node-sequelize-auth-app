const { User, Role, Sequelize } = require("../db/db.connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  let { username, email, password, userRoles, balance } = req.body;
  try {
    const user = await User.create({
      password: bcrypt.hashSync(password, 8),
      username,
      email,
      balance,
    });

    if (!userRoles) {
      await user.setRoles([1]);
    } else {
      const roles = await Role.findAll();

      await user.setRoles([1, 2, 3]);
    }
    return res.status(201).json({
      message: "user created successfully",
      statusCode: 201,
      status: "CREATED",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "this user never exsits",
        statusCode: 404,
        status: "Not Found",
      });
    }
    let isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "password is not correct",
        statusCode: 400,
        status: "Bad Request",
      });
    }
    let authotities = await user.getRoles();
    console.log(authotities, "=> authoroties");
    authotities = authotities.map((role) => `ROLE_${role.role.toUpperCase()}`);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "user signed in successfully",
      statusCode: 200,
      status: "CREATED",
      data: {
        user,
        authotities,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = {
  signup,
  signin,
};
