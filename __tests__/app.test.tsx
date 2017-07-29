import { shallow } from "enzyme";
import * as React from "react";

import App from "../src/components/App";

describe("Basic app test", () => {
  it("Mounts the app component", () => {
    shallow(<App />);
  });
});
