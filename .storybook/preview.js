import { addParameters, addDecorator } from "@storybook/html";
import { withDesignTokens } from "../scripts/storybook/design-tokens";
// import { DocsPage, DocsContainer } from "@storybook/addon-docs/blocks";

// import { setCustomElements } from "@storybook/web-components";
// import customElements from "../custom-elements.json";

// setCustomElements(customElements);

import "../assets/styles/index.css";

addDecorator(withDesignTokens);
//addDecorator(withA11y);

addParameters({
  options: {
    name: "Newport Design System",
    isFullScreen: false,
    showPanel: true,
    hierarchySeparator: /\//
  },
  // docs: {
  //   container: DocsContainer,
  //   page: DocsPage,
  // },
});
