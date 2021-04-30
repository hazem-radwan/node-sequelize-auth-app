const { signup, signin } = require("../controllers/auth.controller");
const { placeOrder , addToOrder, cancelOrder } = require("../controllers/order.controller");
const {
  getProductsWithInUserBalance,
} = require("../controllers/product.controller");
const {
  signupMiddleware: { areUsernameAndEmailVailed, areRolesValid },
  authMiddleware: { isAuthorizedAs, verifyToken },
} = require("../middlewares");
const router = require("express").Router();

router.post("/signup", [areRolesValid, areUsernameAndEmailVailed], signup);
router.post("/signin", signin);
router.get("/products", [verifyToken], getProductsWithInUserBalance);
router.put("/orders/:orderId", [verifyToken], addToOrder).delete("/orders/:orderId", [verifyToken], cancelOrder);
router.get("/orders", [verifyToken], placeOrder);

module.exports = router;
