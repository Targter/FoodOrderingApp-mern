const mongoose = require("mongoose");

// Define the Order schema
const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  totalAmount: Number,
  orderStatus: {
    type: String,
    enum: ["PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
    },
  ],
  payment: {
    type: String, // type: mongoose.Schema.Types.ObjectId,

    // ref: "Payment",
    // ref: String,
  },
});

// Define and export the Order model
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
