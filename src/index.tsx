/// <reference types="webpack-env" />
import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";

const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById("root")
  );
};

if (module.hot) {
  module.hot.accept("./components/app.tsx", render);
}

render();
