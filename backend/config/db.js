//This file contains code to connect  app to  MongoDB database using Mongoose.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); //taking URL from .env file
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB; //Connects to the database

//And we are calling this in server.js