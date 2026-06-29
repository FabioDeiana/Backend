const mongoose = require("mongoose");

const cookieConsentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  sessionId: {
    type: String,
    default: ""
  },
  necessary: {
    type: Boolean,
    default: true
  },
  analytics: {
    type: Boolean,
    default: false
  },
  marketing: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("CookieConsent", cookieConsentSchema);