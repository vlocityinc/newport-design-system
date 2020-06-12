import { createElement } from "lwc";
import MyApp from "my/app";

export default {
  title: "lwctest",
};

export const lwctest = () => {
  return createElement("my-app", { is: MyApp });
};
