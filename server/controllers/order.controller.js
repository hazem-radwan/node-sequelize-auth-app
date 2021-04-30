const { User, Order, Order_Product, Product } = require("../db/db.connection");

const placeOrder = async (req, res) => {
  let { id } = req.payload;
  try {
    const user = await User.findByPk(id);
    let userPendingOrders = await user.getOrders({
      where: {
        status: "PENDING",
      },
    });
    if (userPendingOrders.length === 0) {
      await user.createOrder({
        status: "PENDING",
      });
      userPendingOrders = await user.getOrders();
    }
    return res.status(200).json({
      orders: userPendingOrders,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const addToOrder = async (req, res) => {
  const { id } = req.payload;
  const { prodId, status } = req.body;
  const { orderId } = req.params;
  try {
    const user = await User.findByPk(id);
    const product = await Product.findByPk(prodId);
    const orderProduct = await Order_Product.findOne({
      where: {
        productId: prodId,
        orderId: orderId,
      },
    });
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: id,
      },
    });
    let isOrderProduct = await order.hasProduct(prodId);
    let newBalance = user.balance;

    if (!isOrderProduct && status == "REMOVE")
      return res.status(400).json({
        messasge: "no product to be removed",
      });
    if (!isOrderProduct && status == "ADD" && newBalance - product.price >= 0) {
      newBalance = user.balance - product.price;
      await Order_Product.create({
        productId: prodId,
        orderId: orderId,
        qty: 1,
      });
    } else if (
      isOrderProduct &&
      status == "ADD" &&
      newBalance - product.price >= 0
    ) {
      newBalance = user.balance - product.price;
      await Order_Product.update(
        { qty: orderProduct.qty + 1 },
        { where: { productId: prodId, orderId: orderId } }
      );
    } else if (
      isOrderProduct &&
      status == "REMOVE" &&
      orderProduct.qty > 0 &&
      orderProduct.qty - 1 !== 0
    ) {
      newBalance = user.balance + product.price;
      await Order_Product.update(
        { qty: orderProduct.qty - 1 },
        { where: { productId: prodId, orderId: orderId } }
      );
    } else if (
      isOrderProduct &&
      status == "REMOVE" &&
      orderProduct.qty - 1 == 0
    ) {
      console.log("from last product ");
      newBalance = user.balance + product.price;
      await Order_Product.destroy({
        where: { productId: prodId, orderId: orderId },
      });
    } else {
      return res.status(400).json({
        messasge: "your balance reatched allowed limit",
      });
    }
    await User.update({ balance: newBalance }, { where: { id } });
    await Order.update(
      {
        total:
          status === "ADD"
            ? order.total + product.price
            : order.total - product.price,
      },
      { where: { id: orderId } }
    );
    return res.status(200).json({
      message: "order updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  const { id } = req.payload;
  const { orderId } = req.params;
  try {
    const user = await User.findByPk(id);
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: id,
        status: "PENDING",
      },
    });
    if (!order) {
      return res.status(400).json({
        message: "this order has been already delivered",
      });
    } else {
      await Promise.all([
        Order_Product.destroy({ where: { orderId: orderId } }),
        Order.destroy({
          where: {
            id: orderId,
          },
        }),
        await User.update(
          {
            balance: order.total + user.balance,
          },

          { where: { id } }
        ),
      ]);
    }
    return res.status(202).json({
      message: "order has been cancelled successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  placeOrder,
  addToOrder,
  cancelOrder,
};
