import { STORY_RENDERED } from '@storybook/core-events';
import addons, { makeDecorator } from '@storybook/addons';

import EVENTS, { PARAM_KEY } from './constants';
// addons, panels and events get unique names using a prefix
const channel = addons.getChannel();
let setup = {};

// NOTE: we should add paramaters to the STORY_RENDERED event and deprecate this
export const withDesignTokens = makeDecorator({
  name: 'withDesignTokens',
  parameterName: PARAM_KEY,
  wrapper: (getStory, context, { options, parameters }) => {
    const storyOptions = parameters || options;
    const infoOptions =
      typeof storyOptions === 'string' ? { text: storyOptions } : storyOptions;
    const mergedOptions =
      typeof infoOptions === 'string'
        ? infoOptions
        : { ...options, ...infoOptions };
    return getStory(context, mergedOptions);
  }
});

const run = (config, options) => {
  console.log('*~*~*~*~*~*~*~*~*~*~*~*~*');
  console.log(config, options);
  console.log('*~*~*~*~*~*~*~*~*~*~*~*~*');
};

channel.on(STORY_RENDERED, event => run(event, setup));
channel.on(EVENTS.REQUEST, event => run(setup.config, setup.options));

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
