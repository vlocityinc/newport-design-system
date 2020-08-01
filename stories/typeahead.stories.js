import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import Typeahead from 'c/typeahead';

export default {
  title: 'c/typeahead',
  component: Typeahead,
  parameters: {
    componentSubtitle:
      'A checkable input that communicates if an option is true, false or indeterminate.',
    // Using storyDescription here applies one description to all stories--is overridden by story parameter storyDescription
    // docs: {
    //   storyDescription: "Buttons are clickable items used to perform an action."
    // },
  },
};

export const Default = () => {
  const typeahead = createElement('c-typeahead', { is: Typeahead });
  typeahead.theme = 'nds';
  typeahead.label = 'My Typeahead';
  typeahead.data = ['Morin', 'Banks', 'Olivia', 'Morina', 'Banker', 'Adeola'];
  return typeahead;
};

Default.story = {
  parameters: {
    docs: {
      storyDescription: 'Checkbox description here.',
    },
  },
};
