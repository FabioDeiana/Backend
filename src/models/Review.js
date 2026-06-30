const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratings: {
      ecoFriendliness: { type: Number, required: true, min: 1, max: 5 },
      accessibility: { type: Number, required: true, min: 1, max: 5 },
      dietOptions: { type: Number, required: true, min: 1, max: 5 },
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

// Un utente può recensire una attività una sola volta
reviewSchema.index({ activity: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
