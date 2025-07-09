const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
