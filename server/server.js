require('@babel/register')({
  presets: [
    '@babel/preset-env',
    '@babel/preset-node'
  ]
});

import app from "./app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
