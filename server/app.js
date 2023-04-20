require('babel-register')({
  presets: ['@babel/preset-react']
});

import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import Main from "../my-app/main";
import { Provider } from "react-redux";
import store from "./redux/store";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// serve your React Native app as the root route
app.get("/", (req, res) => {
  const appHtml = renderToString(
    <Provider store={store}>
      <Main />
    </Provider>
  );
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>React Native App</title>
      </head>
      <body>
        <div id="app">${appHtml}</div>
      </body>
    </html>
  `);
});

// set up API routes
app.use("/api/v1", User);

export default app;
