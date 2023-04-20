import express from "express";
import Main from "./main";
import { Provider } from "react-redux";
import store from "./redux/store";

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(cors());

// serve your React Native app as the root route
app.get("/", (req, res) => {
  res.send(
    <Provider store={store}>
      <Main />
    </Provider>
  );
});

// set up API routes
app.use("/api/v1", User);

export default app;
