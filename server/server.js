import express from 'express';
import { config } from "dotenv";
import mongoose from "mongoose";
import cloudinary from "cloudinary"
import app from "./app.js";


config({
    path:"./config/config.env",
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})






// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});





// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log(`MongoDb connected`);
});

const port = process.env.PORT || 4000;
app.set('port', port);

const server = app.listen(port, () => {
  console.log(`Server is running on PORT ${server.address().port}`);
});
