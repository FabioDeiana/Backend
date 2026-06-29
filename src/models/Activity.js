const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["ristorante", "supermercato", "negozio", "bar", "palestra", "altro"],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  tags: {
    diet: [{ type: String }],
    accessibility: [{ type: String }],
    other: [{ type: String }]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);