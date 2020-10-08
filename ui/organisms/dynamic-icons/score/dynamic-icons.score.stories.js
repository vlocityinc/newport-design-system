import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from '../doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<span data-nds-state="positive" class="nds-icon-score" title="Description of the icon when needed">
  <svg viewBox="0 0 5 5" class="nds-icon-score__positive" aria-hidden="true">
    <circle cx="50%" cy="50%" r="1.875"></circle>
  </svg>
  <svg viewBox="0 0 5 5" class="nds-icon-score__negative" aria-hidden="true">
    <circle cx="50%" cy="50%" r="1.875"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Positive (states)', () => {
    return withExample(`<span data-nds-state="positive" class="nds-icon-score" title="Description of the icon when needed">
  <svg viewBox="0 0 5 5" class="nds-icon-score__positive" aria-hidden="true">
    <circle cx="50%" cy="50%" r="1.875"></circle>
  </svg>
  <svg viewBox="0 0 5 5" class="nds-icon-score__negative" aria-hidden="true">
    <circle cx="50%" cy="50%" r="1.875"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Negative (states)', () => {
    return withExample(`<span data-nds-state="negative" class="nds-icon-score" title="Description of the icon when needed">
  <svg viewBox="0 0 5 5" class="nds-icon-score__positive" aria-hidden="true">
    <circle cx="50%" cy="50%" r="1.875"></circle>
  </svg>
  <svg viewBox="0 0 5 5" class="nds-icon-score__negative" aria-hidden="true">
    <circle cx="50%" cy="50%" r="1.875"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  });
