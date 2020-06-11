import { addParameters, addDecorator } from "@storybook/html";
import { withDesignTokens } from "../scripts/storybook/design-tokens";

import "../assets/styles/index.css";

addDecorator(withDesignTokens);
//addDecorator(withA11y);

addParameters({
  options: {
    name: "Newport Design System",
    isFullScreen: false,
    showPanel: true,
    hierarchySeparator: /\//,
  },
});
