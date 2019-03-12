import { storiesOf } from '@storybook/html';
import base from 'paths.macro';

storiesOf(
  `${base}`,
  module
).add(
  'buttons',
  () => `<button class="nds-button">Button</button>
<button class="nds-button nds-button_neutral">Neutral Button</button>
<button class="nds-button nds-button_brand">Brand Button</button>
<button class="nds-button nds-button_outline-brand">Outline Brand Button</button>
<button class="nds-button nds-button_destructive">Destructive Button</button>
<button class="nds-button nds-button_text-destructive">Text Destructive Button</button>
<button class="nds-button nds-button_success">Success Button</button>`,
  {
    info: {
      text: 'Buttons should be used in situations where users might need to'
    }
  }
);
