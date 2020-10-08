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
    return withExample(`<span data-nds-trend="neutral" class="nds-icon-trend nds-is-animated" title="Description of the icon">
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path class="nds-icon-trend__arrow" d="M.75 8H11M8 4.5L11.5 8 8 11.5"></path>
    <circle class="nds-icon-trend__circle" cy="8" cx="8" r="7.375" transform="rotate(-28 8 8) scale(-1 1) translate(-16 0)"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative</span>
</span>`);
  })
  .add('Down (states)', () => {
    return withExample(`<span data-nds-trend="down" class="nds-icon-trend nds-is-animated" title="Description of the icon">
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path class="nds-icon-trend__arrow" d="M.75 8H11M8 4.5L11.5 8 8 11.5"></path>
    <circle class="nds-icon-trend__circle" cy="8" cx="8" r="7.375" transform="rotate(-28 8 8) scale(-1 1) translate(-16 0)"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative</span>
</span>`);
  })
  .add('Up (states)', () => {
    return withExample(`<span data-nds-trend="up" class="nds-icon-trend nds-is-animated" title="Description of the icon">
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path class="nds-icon-trend__arrow" d="M.75 8H11M8 4.5L11.5 8 8 11.5"></path>
    <circle class="nds-icon-trend__circle" cy="8" cx="8" r="7.375" transform="rotate(-28 8 8) scale(-1 1) translate(-16 0)"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative</span>
</span>`);
  })
  .add('Static (states)', () => {
    return withExample(`<span data-nds-trend="up" title="Description of the icon" class="nds-icon-trend">
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path class="nds-icon-trend__arrow" d="M.75 8H11M8 4.5L11.5 8 8 11.5"></path>
    <circle class="nds-icon-trend__circle" cy="8" cx="8" r="7.375" transform="rotate(-28 8 8) scale(-1 1) translate(-16 0)"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative</span>
</span>`);
  })
  .add('Paused (states)', () => {
    return withExample(`<span data-nds-trend="up" class="nds-icon-trend nds-is-animated nds-is-paused" title="Description of the icon">
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path class="nds-icon-trend__arrow" d="M.75 8H11M8 4.5L11.5 8 8 11.5"></path>
    <circle class="nds-icon-trend__circle" cy="8" cx="8" r="7.375" transform="rotate(-28 8 8) scale(-1 1) translate(-16 0)"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative</span>
</span>`);
  });
