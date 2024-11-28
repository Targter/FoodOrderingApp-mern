const orderService = require("../services/order.service.js");
const userService = require("../services/user.service.js");

module.exports = {
  createOrder: async (req, res) => {
    try {
      //   console.log("logdat");
      const order = req.body;
      //   console.log("order", order);
      const user = req.user;
      console.log("createOrderCaleld:");
      //   console.log(order, "orderlog");
      if (!order) throw new Error("Please provide valid request body");
      else {
      }
      const paymentResponse = await orderService.createOrder(order, user);
      res.status(200).json("Order Placed Successfully:");
      console.log("this called");
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },

  getAllUserOrders: async (req, res) => {
    try {
      //   console.log("userCalled:");
      user = req.user;
      const userOrders = await orderService.getUserOrders(user._id);
      //   console.log("userOrder:", userOrders);
      res.status(200).json(userOrders);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
};
