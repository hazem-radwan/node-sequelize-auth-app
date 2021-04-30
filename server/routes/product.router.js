const router = require("express").Router();
const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} = require("../controllers/product.controller");

router
  .get("/:id", getProduct)
  .delete("/:id", deleteProduct)
  .put("/:id", updateProduct);


router.get("/", getProducts).post("/", createProduct);



module.exports = router ;