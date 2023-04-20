import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import Main from "../my-app/main";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createCompatibilityTransform } from '@babel/core';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// set up API routes
app.use("/api/v1", User);

// serve your React Native app as the root route
app.get("/", (req, res) => {
  const appHtml = renderToString(
    <Provider store={store}>
      <Main />
    </Provider>
  );
  const compatibilityTransform = createCompatibilityTransform({reactRuntime: 'automatic'});
  const transformedHtml = compatibilityTransform.processSync(appHtml).code;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>React Native App</title>
      </head>
      <body>
        <div id="app">${transformedHtml}</div>
      </body>
    </html>
  `);
});

export default app;
