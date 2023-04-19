import express from "express";
import User from "./routers/User.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
export const app = express();
import cors from "cors"


app.use(express.json());//will convert string into obj
app.use(express.urlencoded({extended: false})); // its a middleware function
app.use(cookieParser());
app.use(
    fileUpload({
        limits: { fileSize: 50*1024*1024},
        useTempFiles: true,
    })
);

app.use(cors());

app.use("/api/v1", User);