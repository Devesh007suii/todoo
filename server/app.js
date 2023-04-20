import express from "express";
import User from "./routers/User.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";

// create express app
const app = express();

// set up middleware
app.use(express.json()); // will convert string into obj
app.use(express.urlencoded({ extended: false })); // its a middleware function
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  })
);
app.use(cors());

// serve static files from frontend
app.use(express.static(path.join(__dirname, "../my-app/build")));

// serve frontend app on root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-app/build", "index.html"));
});

// set up API routes
app.use("/api/v1", User);

console.log("sui")
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
