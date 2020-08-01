import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import RadioImageGroup from 'c/radioImageGroup';

// import PropTypes from 'prop-types';

export default {
  title: 'c/radioImageGroup',
  component: 'radioImageGroup',
  attribute: 'variant',
  parameters: {
    componentSubtitle: 'Radio Image Group description.',
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
    docs: {
      storyDescription: 'Radio Image Group description.',
    },
  },
};

export const Base = () => {
  const radioImageGroup = createElement('c-radio-image-group', {
    is: RadioImageGroup,
  });
  radioImageGroup.label = 'My Radio Image Group';
  radioImageGroup.theme = 'nds';
  radioImageGroup.options = [
    { label: 'car', value: 'car' },
    { label: 'bike', value: 'bike' },
    { label: 'ship', value: 'ship' },
  ];
  return radioImageGroup;
};

Base.story = {
  parameters: {
    docs: {
      storyDescription: 'Radio Image Group description.',
    },
  },
};
