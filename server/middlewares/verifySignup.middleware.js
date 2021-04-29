const { User, Roles } = require("../db/db.connection");

const areUsernameAndEmailVailed = async ({ body }, res, next) => {
  let { email, username } = body;
  try {
    const userWithEmail = await User.findOne({ where: { email } });
    const userWithUsername = await User.findOne({ where: { username } });
    if (userWithEmail) {
      return res.status(400).json({
        message: "this email is already exist",
        status: "BAD REQUEST",
        statuscode: 400,
      });
    }
    if (userWithUsername) {
      return res.status(400).json({
        message: "this username is already exist",
        status: "BAD REQUEST",
        statuscode: 400,
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      status: "INTERNAL SERVER ERROR",
      statusCode: 500,
    });
  }
};

const areRolesValid = ({ body }, res, next) => {
  let { userRoles } = body;
  if (!userRoles) return next();
  for (let i = 0; i < userRoles.length; i++) {
    if (!Roles.includes(userRoles[i])) {
      return res.status(400).json({
        message: `"${userRoles[i]}" is not a valid role`,
        status: "BAD REQUEST",
        statuscode: 400,
      });
    }
  }
  next();
};

module.exports = {
  areRolesValid,
  areUsernameAndEmailVailed,
};
