import { configure, addParameters, addDecorator } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';
import { withDesignTokens } from '../scripts/storybook/design-tokens';
const req = require.context('../ui', true, /\.stories\.js$/);
const reqDoc = require.context('../docs', true, /\.stories\.js$/);

import '../assets/styles/index.css';

function loadStories() {
  reqDoc.keys().forEach(filename => reqDoc(filename));
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
