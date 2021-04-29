const jwt = require("jsonwebtoken");
const { Roles, User } = require("../db/db.connection");

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-auth-token"];
  if (!token)
    return res.status(403).json({
      statusCode: 403,
      status: "NO TOKEN PROVIDED",
      message: "no token provided",
    });
  try {
    let payload = await jwt.verify(token, process.env.JWT_SECRET);
    req.paload = paylaod;
    next();
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
      error: err.message,
    });
  }
};

const isAuthorizedAs = (roles) => async (req, res, next) => {
  const { id } = req.payload;
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({
        status: "Not Found",
        message: "data is never found",
        statusCode: 404,
      });
    const userRoles = await user.getRoles();
    for(let i = 0 ; i < roles.length  ; i ++) { 
        let isRole = userRoles.map((role) => role.name).includes(role);
        if (!isRole)
          return res.status(401).json({
            status: "UNAUTHORIZED",
            message: "access denied",
            statusCode: 401,
          });
        return next();
    }

  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
      error: err.message,
    });
  }
};

module.exports = {
  verifyToken,
  isAuthorizedAs,
};
