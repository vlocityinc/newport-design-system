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
    return withExample(`<span data-nds-strength="0" title="Description of the icon when needed" class="nds-icon-strength">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Strength 1 (states)', () => {
    return withExample(`<span data-nds-strength="1" title="Description of the icon when needed" class="nds-icon-strength">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Strength 2 (states)', () => {
    return withExample(`<span data-nds-strength="2" title="Description of the icon when needed" class="nds-icon-strength">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Strength 3 (states)', () => {
    return withExample(`<span data-nds-strength="3" title="Description of the icon when needed" class="nds-icon-strength">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Strength Negative 1 (states)', () => {
    return withExample(`<span data-nds-strength="-1" title="Description of the icon when needed" class="nds-icon-strength">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Strength Negative 2 (states)', () => {
    return withExample(`<span data-nds-strength="-2" title="Description of the icon when needed" class="nds-icon-strength">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Strength Negative 3 (states)', () => {
    return withExample(`<span data-nds-strength="-3" title="Description of the icon when needed" class="nds-icon-strength">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Animated (states)', () => {
    return withExample(`<span class="nds-icon-strength nds-is-animated" data-nds-strength="3" title="Description of the icon when needed">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Animated Negative (states)', () => {
    return withExample(`<span class="nds-icon-strength nds-is-animated" data-nds-strength="-3" title="Description of the icon when needed">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  })
  .add('Paused (states)', () => {
    return withExample(`<span class="nds-icon-strength nds-is-animated nds-is-paused" data-nds-strength="3" title="Description of the icon when needed">
  <svg viewBox="0 0 27 7" aria-hidden="true">
    <circle r="3.025" cx="3.5" cy="3.5"></circle>
    <circle r="3.025" cx="13.5" cy="3.5"></circle>
    <circle r="3.025" cx="23.5" cy="3.5"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative when needed</span>
</span>`);
  });
