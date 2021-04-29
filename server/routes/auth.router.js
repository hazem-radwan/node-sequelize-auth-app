const { signup, signin } = require("../controllers/auth.controller");
const {
  signupMiddleware: { areUsernameAndEmailVailed, areRolesValid },
} = require("../middlewares");
const router = require("express").Router();

router.post("/signup", [areRolesValid, areUsernameAndEmailVailed], signup);
router.post("/signin", signin);

module.exports = router;
