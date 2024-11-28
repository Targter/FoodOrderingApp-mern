const Address = require("../models/adress.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const Restaurant = require("../models/restaurant.model");
const cartService = require("./cart.service");
const paymentService = require("./payment.service");

module.exports = {
  async createOrder(order, user) {
    try {
      // const address = order.deliveryAddress;
      console.log("userOrder:", order);
      console.log("userDetails:", user);
      let savedAddress;
      const { restaurantId, deliveryAddress, items, totalAmount } = order.order;
      console.log(order, "orderfetched");
      const restaurant = await Restaurant.findById(restaurantId);
      console.log("resCall");
      // if (!restaurant) {
      //   throw new Error("Restaurant not found");
      // }

      console.log("restrasucces");
      // Check or create the delivery address
      console.log("addresStart");
      let address = await Address.findOne({
        streetAddress: deliveryAddress.streetAddress,
        city: deliveryAddress.city,
      });
      // if (!address) {
      //   // If no address is found, create a new one (this may vary depending on your logic)
      //   address = new Address(deliveryAddress);
      //   await address.save();
      // }
      // console.log("addressFailed");

      // Save order items into the database
      const orderItems = [];
      console.log(items);
      for (const item of items) {
        const orderItem = new OrderItem({
          food: item.food,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          ingredients: item.ingredients,
        });
        const savedItem = await orderItem.save();
        orderItems.push(savedItem._id);
      }
      // Create and save the order
      const newOrder = new Order({
        customer: user._id, // Assuming the user is available from the JWT
        restaurant: restaurantId,
        deliveryAddress: address,
        items: orderItems,
        totalAmount,
        orderStatus: "COMPLETED", // Default status, can be updated later
        payment: "online",
      });

      // Save the new order in the database
      // console.log("newOrder:", newOrder.save());
      const savedOrder = await newOrder.save();
      console.log("SaveOrder", savedOrder);
      // You can also associate this order with the restaurant or customer, as needed
      restaurant.orders.push(savedOrder._id);
      await restaurant.save();
      console.log("alldone");
      return savedOrder;
      // return savedOrder
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  },

  async cancelOrder(orderId) {
    try {
      await Order.findByIdAndDelete(orderId);
    } catch (error) {
      throw new Error(
        `Failed to cancel order with ID ${orderId}: ${error.message}`
      );
    }
  },

  async findOrderById(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error(`Order not found with ID ${orderId}`);
      }
      return order;
    } catch (error) {
      throw new Error(
        `Failed to find order with ID ${orderId}: ${error.message}`
      );
    }
  },

  async getUserOrders(userId) {
    try {
      const orders = await Order.find({ customer: userId }).populate({
        path: "items",
        populate: { path: "food" },
      });
      return orders;
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error.message}`);
    }
  },

  async getOrdersOfRestaurant(restaurantId, orderStatus) {
    try {
      let orders = await Order.find({ restaurant: restaurantId }).populate([
        {
          path: "items",
          populate: { path: "food" },
        },
        "customer",
      ]);
      if (orderStatus) {
        orders = orders.filter((order) => order.orderStatus === orderStatus);
      }
      return orders;
    } catch (error) {
      throw new Error(
        `Failed to get orders of restaurant with ID ${restaurantId}: ${error.message}`
      );
    }
  },

  async updateOrder(orderId, orderStatus) {
    try {
      const validStatuses = [
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "COMPLETED",
        "PENDING",
      ];
      if (!validStatuses.includes(orderStatus)) {
        throw new Error("Please select a valid order status");
      }

      const order = await Order.findById(orderId).populate({
        path: "items",
        populate: { path: "food" },
      });
      if (!order) {
        throw new Error(`Order not found with ID ${orderId}`);
      }

      order.orderStatus = orderStatus;
      await order.save();

      // Send notification
      // await NotificationService.sendOrderStatusNotification(order);

      return order;
    } catch (error) {
      throw new Error(
        `Failed to update order with ID ${orderId}: ${error.message}`
      );
    }
  },
};
