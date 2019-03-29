import { configure, addParameters, addDecorator } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';
import { withDesignTokens } from '../scripts/storybook/design-tokens';
const req = require.context('../ui', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withDesignTokens);
//addDecorator(withA11y);

addParameters({
  options: {
    name: 'Newport Design System',
    isFullScreen: false,
    showPanel: true
  }
});

configure(loadStories, module);
