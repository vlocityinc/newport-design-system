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
  .add('Fixed (examples)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 150px; width: 300px; padding: 2rem;">
  <div class="nds-is-fixed">
    <div style="position: absolute; top: 1rem; left: 1rem; border: 1px solid red; background: rgb(244, 246, 249) none repeat scroll 0% 0%;">
      <!-- react-text: 5 -->An element with fixed positioning is positioned relative to the viewport. If no other positioning values are given (
      <!-- /react-text -->
      <code>top, right, bottom, left</code>
      <!-- react-text: 7 -->) it will start its positioning relative to where it is in the flow of the page.
      <!-- /react-text -->
    </div>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
</div>`);
  })
  .add('Absolute (examples)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 150px; width: 300px; padding: 2rem;">
  <div class="nds-is-absolute">
    <div style="position: absolute; top: 1rem; left: 1rem; border: 1px solid red; background: rgb(244, 246, 249) none repeat scroll 0% 0%;">
      <!-- react-text: 5 -->An element with absolute positioning is positioned relative to its closest ancestor with relative positioning. If no other positioning values are given (
      <!-- /react-text -->
      <code>top, right, bottom, left</code>
      <!-- react-text: 7 -->) it will start its positioning relative to where it is in the flow of the page.
      <!-- /react-text -->
    </div>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
</div>`);
  })
  .add('Relative (examples)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 150px; width: 300px; padding: 2rem;">
  <div class="nds-is-relative">
    <div style="position: absolute; top: 1rem; left: 1rem; border: 1px solid red; background: rgb(244, 246, 249) none repeat scroll 0% 0%;">
      <!-- react-text: 5 -->An absolutely positioned element is positioned relative to the nearest positioned parent. The
      <!-- /react-text -->
      <code>.nds-is-relative</code>
      <!-- react-text: 7 -->class can be used to give the parent or ancestor positioning.
      <!-- /react-text -->
    </div>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
</div>`);
  })
  .add('Static (examples)', () => {
    return withExample(`<div class="demo-only nds-grid" style="height: 150px; width: 300px; padding: 2rem;">
  <div class="nds-is-static">
    <div style="position: absolute; top: 1rem; left: 1rem; border: 1px solid red; background: rgb(244, 246, 249) none repeat scroll 0% 0%;">A static positioned element is positioned exactly as it comes in the flow of the page.</div>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
</div>`);
  });
