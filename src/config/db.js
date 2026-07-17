const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Connessione già attiva: riusala
  if (cached.conn) {
    return cached.conn;
  }

  // Connessione in corso: aspetta quella invece di crearne un'altra
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((m) => {
      console.log(`MongoDB Connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`Error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;