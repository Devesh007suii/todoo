import express from 'express';
import { config } from "dotenv";
import mongoose from "mongoose";
import cloudinary from "cloudinary"
import path from 'path';

import { isAuthenticated } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";

config({
    path:"./config/config.env",
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const app = express();



// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to check authentication
app.use(isAuthenticated);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/app', (req, res) => {
  const html = `
    <html>
      <head>
        <title>Your React Native App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="root"></div>
        <script src="./bundle.js"></script>
      </body>
    </html>
  `;
  res.send(html);
});

// Serve the bundled JavaScript file for the React Native app
app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'bundle.js'));
});

// Error handler middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log(`MongoDb connected`);
});

const port = process.env.PORT || 4000;
app.set('port', port);

const server = app.listen(port, () => {
  console.log(`Server is running on PORT ${server.address().port}`);
});
