const { User, Product } = require("../db/db.connection");
const { Op } = require("sequelize");

const createProduct = async (req, res) => {
  const { name, category, brand, price } = req.body;
  try {
    const product = await Product.create({
      name,
      category,
      brand,
      price,
    });
    return res.status(201).json({
      statusCode: 201,
      data: product,
      status: "CREATED",
      message: "product created successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
      message: err.message,
    });
  }
};
const getProductsWithInUserBalance = async (req, res) => {
  const { id } = req.payload;
  try {
    const user = await User.findByPk(id) ; 
    const product = await Product.findAll({
      where: {
        price: {
          [Op.lte]: user.balance,
        },
      },
    });
    return res.status(200).json({
      statusCode: 200,
      data: product,
      status: "OK",
      message: "data retrieved successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "INTERNAL SERVER ERROR | from controller",
      message: err.message,
      id,
    });
  }
};
const getProducts = async (req, res) => {
  try {
    const product = await Product.findOne();
    return res.status(200).json({
      statusCode: 200,
      data: product,
      status: "OK",
      message: "data retrieved successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
      message: err.message,
    });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.update(
      {
        ...req.body,
      },
      { where: { id } }
    );
    return res.status(!product ? 404 : 203).json({
      statusCode: !product ? 404 : 203,
      status: !product ? "Not Found" : "UPDATED",
      message: !product
        ? "product was not found"
        : "product updated successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
      message: err.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.destroy({
      where: {
        id,
      },
    });
    return res.status(product == 0 ? 404 : 202).json({
      statusCode: product == 0 ? 404 : 202,
      status: product == 0 ? "Not Found" : "OK",
      message:
        product == 0
          ? "product was not found"
          : "product deleted successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
      message: err.message,
    });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({
      where: { id },
    });
    return res.status(!product ? 404 : 200).json({
      statusCode: !product ? 404 : 200,
      data: !product ? undefined : product,
      status: !product ? "Not Found" : "OK",
      message: !product
        ? "product was not found"
        : "product retrieved successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "INTERNAL SERVER ERROR",
      message: err.message,
    });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProductsWithInUserBalance,
  getProduct,
};
