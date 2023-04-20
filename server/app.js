import express from "express";
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
  const jsx = (
    <Provider store={store}>
      <Main />
    </Provider>
  );
  const js = require("@babel/core").transformSync(jsx, {
    presets: ["@babel/preset-react"]
  }).code;
  res.send(js);
});

// set up API routes
app.use("/api/v1", User);

export default app;
