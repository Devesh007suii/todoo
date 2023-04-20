import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import Main from "./Main";
import axios from "axios";

export default function App() {
  useEffect(() => {
    axios
      .get("https://todo007.onrender.com")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
