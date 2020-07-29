import { configure, addParameters, addDecorator } from "@storybook/html";
import { withA11y } from "@storybook/addon-a11y";
import { withDesignTokens } from "../scripts/storybook/design-tokens";
//import { configure, addDecorator, addParameters } from '@storybook/vue';
import { initDsm } from "@invisionapp/dsm-storybook";

// automatically import all files ending in *.stories.js
//const req = require.context('../src', true, /\.stories\.js$/);
//function loadStories() {
//  req.keys().forEach((filename) => req(filename));
//}

//Init Dsm
initDsm({
  addDecorator,
  addParameters,
  callback: () => configure(loadStories, module),
});

const req = require.context("../ui", true, /\.stories\.js$/);
//const reqLWC = require.context('../stories', true, /\.stories\.js$/);
const reqDoc = require.context("../docs", true, /\.stories\.js$/);

import "../assets/styles/index.css";

function loadStories() {
  reqDoc.keys().forEach((filename) => reqDoc(filename));
  //reqLWC.keys().forEach(filename => reqDoc(filename));
  req.keys().forEach((filename) => req(filename));
}

addDecorator(withDesignTokens);
//addDecorator(withA11y);

addParameters({
  options: {
    name: "Newport Design System",
    isFullScreen: false,
    showPanel: true,
  },
});

//configure(loadStories, module);
