import { app } from "./app.js";
import { config } from "dotenv";
import mongoose from "mongoose";
import cloudinary from "cloudinary"

require('@babel/register')({
  presets: [
    '@babel/preset-env',
    '@babel/preset-node'
  ]
});

config({
    path:"./config/config.env",
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// we should always connect database after connecting config
mongoose.connect(process.env.MONGO_URI).then(()=>{console.log(`MongoDb connected`)})
console.log(process.env.MONGO_URI)

const port = process.env.PORT || 4000;

app.set('port', port);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const server = app.listen(port, () => {
  console.log(`Server is running on PORT ${server.address().port}`);
});
