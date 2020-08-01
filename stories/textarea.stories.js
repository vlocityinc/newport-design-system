import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import Textarea from 'c/textarea';

export default {
  title: 'c/textarea',
  component: Textarea,
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
  const textarea = createElement('c-textarea', { is: Textarea });
  textarea.theme = 'nds';
  textarea.label = 'My Textgroup';
  textarea.placeholder = 'Type here';
  return textarea;
};

Default.story = {
  parameters: {
    docs: {
      storyDescription: 'Checkbox description here.',
    },
  },
};
