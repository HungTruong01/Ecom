const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn.connection.readyState === 1) {
      console.log("Database connected successfully");
    } else {
      console.log("Database connecting");
    }
  } catch (error) {
    console.log("Database connection failed", error);
    throw new Error(error);
  }
};

module.exports = dbConnect;
