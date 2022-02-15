import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''),  module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Assistive Text (examples)', () => {
    return withExample(
      `<div class="nds-assistive-text">I am hidden from sight</div>`
    );
  })
  .add('Collapsed Expanded (examples)', () => {
    return withExample(`<div class="demo-only">
  <div class="nds-is-collapsed">
    <h3>I am collapsed</h3>
    <p>I am a child inside a collapsed element</p>
  </div>
  <div class="nds-is-expanded">
    <h3>I am expanded</h3>
    <p>I am a child inside an expanded element</p>
  </div>
</div>`);
  })
  .add('Hidden Visible (examples)', () => {
    return withExample(`<div class="demo-only">
  <div class="nds-hidden">I am hidden</div>
  <div class="nds-visible">I am visible</div>
</div>`);
  })
  .add('Hide Show (examples)', () => {
    return withExample(`<div class="demo-only">
  <div class="nds-hide">I am hidden</div>
  <div class="nds-show">I am shown as a block</div>
  <div class="nds-show_inline-block">I am shown as an inline-block</div>
</div>`);
  })
  .add('Transition Hide Show (examples)', () => {
    return withExample(`<div class="demo-only">
  <div class="nds-transition-hide">I have zero opacity</div>
  <div class="nds-transition-show">I have 100% opacity</div>
</div>`);
  })
  .add('Responsive (examples)', () => {
    return withExample(`<div class="demo-only demo-visibility">
  <div class="nds-show_x-small">Hides on 319px and down</div>
  <div class="nds-hide_x-small">Hides on 320px and up</div>
  <div class="nds-show_small">Hides on 479px and down</div>
  <div class="nds-hide_small">Hides on 480px and up</div>
  <div class="nds-show_medium">Hides on 767px and down</div>
  <div class="nds-hide_medium">Hides on 768px and up</div>
  <div class="nds-show_large">Hides on 1023px and down</div>
  <div class="nds-hide_large">Hides on 1024px and up</div>
  <div class="nds-show_x-large">Hides on 1279px and down</div>
  <div class="nds-hide_x-large">Hides on 1280px and up</div>
</div>`);
  });
