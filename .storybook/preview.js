import {
  addParameters,
  addDecorator
} from "@storybook/html";
import {
  withDesignTokens
} from "../scripts/storybook/design-tokens";

addDecorator(withDesignTokens);

addParameters({
  options: {
    name: "Newport Design System",
    isFullScreen: false,
    showPanel: true,
    hierarchySeparator: /\//
  },
});
