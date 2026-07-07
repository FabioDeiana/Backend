const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["user", "owner", "admin"],
    default: "user"
  },
  avatar: {
    type: String,
    default: ""
  },
  preferences: {
    diet: [{ type: String }],
    accessibility: [{ type: String }],
    allergens: [{ type: String }]
  },
  favoriteActivities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity"
  }],
  businessName: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  newsletter: {
    subscribed: { type: Boolean, default: false },
    subscribedAt: { type: Date }
  }
}, { timestamps: true });

// Hash password prima di salvare
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Metodo per confrontare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);