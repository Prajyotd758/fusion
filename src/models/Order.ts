import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    product: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    amount: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    payment: {
      type: String,
      required: true,
    },

    reviewAdded: {
      type: Boolean,
      default: false,
    },

    reason: {
      type: String,
      default: null,
    },
    comment: {
      type: String,
      default: null,
    },
    uploadedUrls: {
      type: [String],
      default: null,
    },
    uploadedVideoUrl: {
      type: [String],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
