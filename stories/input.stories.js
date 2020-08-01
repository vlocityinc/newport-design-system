import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import Input from 'c/input';

// import PropTypes from 'prop-types';

export default {
  title: 'c/input',
  component: 'input',
  attribute: 'variant',
  parameters: {
    componentSubtitle: 'Buttons are clickable items used to perform an action.',
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
    docs: {
      storyDescription:
        'Buttons are clickable items used to perform an action.',
    },
  },
};

export const Neutral = () => {
  const input = createElement('c-input', { is: Input });
  input.label = 'My Input';
  input.theme = 'nds';
  return input;
};

Neutral.story = {
  parameters: {
    docs: {
      storyDescription: 'Neutral button description here.',
    },
  },
};
