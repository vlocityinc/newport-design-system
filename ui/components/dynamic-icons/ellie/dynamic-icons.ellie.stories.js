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
    return withExample(`<span class="nds-icon-ellie nds-is-animated" title="Description of the icon">
  <svg viewBox="0 0 280 14" aria-hidden="true">
    <circle cx="7" cy="7" r="4"></circle>
    <circle cx="7" cy="7" r="3"></circle>
    <circle cx="21" cy="7" r="4"></circle>
    <circle cx="21" cy="7" r="3"></circle>
    <circle cx="35" cy="7" r="4"></circle>
    <circle cx="35" cy="7" r="3"></circle>
    <circle cx="49" cy="7" r="4"></circle>
    <circle cx="49" cy="7" r="3"></circle>
    <circle cx="63" cy="7" r="4"></circle>
    <circle cx="63" cy="7" r="3"></circle>
    <circle cx="77" cy="7" r="4"></circle>
    <circle cx="77" cy="7" r="3"></circle>
    <circle cx="91" cy="7" r="4"></circle>
    <circle cx="91" cy="7" r="3"></circle>
    <circle cx="105" cy="7" r="4"></circle>
    <circle cx="105" cy="7" r="3"></circle>
    <circle cx="119" cy="7" r="4"></circle>
    <circle cx="119" cy="7" r="3"></circle>
    <circle cx="133" cy="7" r="4"></circle>
    <circle cx="133" cy="7" r="3"></circle>
    <circle cx="147" cy="7" r="4"></circle>
    <circle cx="147" cy="7" r="3"></circle>
    <circle cx="161" cy="7" r="4"></circle>
    <circle cx="161" cy="7" r="3"></circle>
    <circle cx="175" cy="7" r="4"></circle>
    <circle cx="175" cy="7" r="3"></circle>
    <circle cx="189" cy="7" r="4"></circle>
    <circle cx="189" cy="7" r="3"></circle>
    <circle cx="203" cy="7" r="4"></circle>
    <circle cx="203" cy="7" r="3"></circle>
    <circle cx="217" cy="7" r="4"></circle>
    <circle cx="217" cy="7" r="3"></circle>
    <circle cx="231" cy="7" r="4"></circle>
    <circle cx="231" cy="7" r="3"></circle>
    <circle cx="245" cy="7" r="4"></circle>
    <circle cx="245" cy="7" r="3"></circle>
    <circle cx="259" cy="7" r="4"></circle>
    <circle cx="259" cy="7" r="3"></circle>
    <circle cx="273" cy="7" r="4"></circle>
    <circle cx="273" cy="7" r="3"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative</span>
</span>`);
  })
  .add('Paused (states)', () => {
    return withExample(`<span class="nds-icon-ellie nds-is-animated nds-is-paused" title="Description of the icon">
  <svg viewBox="0 0 280 14" aria-hidden="true">
    <circle cx="7" cy="7" r="4"></circle>
    <circle cx="7" cy="7" r="3"></circle>
    <circle cx="21" cy="7" r="4"></circle>
    <circle cx="21" cy="7" r="3"></circle>
    <circle cx="35" cy="7" r="4"></circle>
    <circle cx="35" cy="7" r="3"></circle>
    <circle cx="49" cy="7" r="4"></circle>
    <circle cx="49" cy="7" r="3"></circle>
    <circle cx="63" cy="7" r="4"></circle>
    <circle cx="63" cy="7" r="3"></circle>
    <circle cx="77" cy="7" r="4"></circle>
    <circle cx="77" cy="7" r="3"></circle>
    <circle cx="91" cy="7" r="4"></circle>
    <circle cx="91" cy="7" r="3"></circle>
    <circle cx="105" cy="7" r="4"></circle>
    <circle cx="105" cy="7" r="3"></circle>
    <circle cx="119" cy="7" r="4"></circle>
    <circle cx="119" cy="7" r="3"></circle>
    <circle cx="133" cy="7" r="4"></circle>
    <circle cx="133" cy="7" r="3"></circle>
    <circle cx="147" cy="7" r="4"></circle>
    <circle cx="147" cy="7" r="3"></circle>
    <circle cx="161" cy="7" r="4"></circle>
    <circle cx="161" cy="7" r="3"></circle>
    <circle cx="175" cy="7" r="4"></circle>
    <circle cx="175" cy="7" r="3"></circle>
    <circle cx="189" cy="7" r="4"></circle>
    <circle cx="189" cy="7" r="3"></circle>
    <circle cx="203" cy="7" r="4"></circle>
    <circle cx="203" cy="7" r="3"></circle>
    <circle cx="217" cy="7" r="4"></circle>
    <circle cx="217" cy="7" r="3"></circle>
    <circle cx="231" cy="7" r="4"></circle>
    <circle cx="231" cy="7" r="3"></circle>
    <circle cx="245" cy="7" r="4"></circle>
    <circle cx="245" cy="7" r="3"></circle>
    <circle cx="259" cy="7" r="4"></circle>
    <circle cx="259" cy="7" r="3"></circle>
    <circle cx="273" cy="7" r="4"></circle>
    <circle cx="273" cy="7" r="3"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative</span>
</span>`);
  })
  .add('Static (states)', () => {
    return withExample(`<span class="nds-icon-ellie" title="Description of the icon">
  <svg viewBox="0 0 280 14" aria-hidden="true">
    <circle cx="7" cy="7" r="4"></circle>
    <circle cx="7" cy="7" r="3"></circle>
    <circle cx="21" cy="7" r="4"></circle>
    <circle cx="21" cy="7" r="3"></circle>
    <circle cx="35" cy="7" r="4"></circle>
    <circle cx="35" cy="7" r="3"></circle>
    <circle cx="49" cy="7" r="4"></circle>
    <circle cx="49" cy="7" r="3"></circle>
    <circle cx="63" cy="7" r="4"></circle>
    <circle cx="63" cy="7" r="3"></circle>
    <circle cx="77" cy="7" r="4"></circle>
    <circle cx="77" cy="7" r="3"></circle>
    <circle cx="91" cy="7" r="4"></circle>
    <circle cx="91" cy="7" r="3"></circle>
    <circle cx="105" cy="7" r="4"></circle>
    <circle cx="105" cy="7" r="3"></circle>
    <circle cx="119" cy="7" r="4"></circle>
    <circle cx="119" cy="7" r="3"></circle>
    <circle cx="133" cy="7" r="4"></circle>
    <circle cx="133" cy="7" r="3"></circle>
    <circle cx="147" cy="7" r="4"></circle>
    <circle cx="147" cy="7" r="3"></circle>
    <circle cx="161" cy="7" r="4"></circle>
    <circle cx="161" cy="7" r="3"></circle>
    <circle cx="175" cy="7" r="4"></circle>
    <circle cx="175" cy="7" r="3"></circle>
    <circle cx="189" cy="7" r="4"></circle>
    <circle cx="189" cy="7" r="3"></circle>
    <circle cx="203" cy="7" r="4"></circle>
    <circle cx="203" cy="7" r="3"></circle>
    <circle cx="217" cy="7" r="4"></circle>
    <circle cx="217" cy="7" r="3"></circle>
    <circle cx="231" cy="7" r="4"></circle>
    <circle cx="231" cy="7" r="3"></circle>
    <circle cx="245" cy="7" r="4"></circle>
    <circle cx="245" cy="7" r="3"></circle>
    <circle cx="259" cy="7" r="4"></circle>
    <circle cx="259" cy="7" r="3"></circle>
    <circle cx="273" cy="7" r="4"></circle>
    <circle cx="273" cy="7" r="3"></circle>
  </svg>
  <span class="nds-assistive-text">Text alternative</span>
</span>`);
  });
