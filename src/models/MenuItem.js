const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ["antipasto", "primo", "secondo", "contorno", "dolce", "bevanda", "altro"],
    required: true
  },
  allergens: [{ type: String }],
  dietTags: [{ type: String }],
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("MenuItem", menuItemSchema);