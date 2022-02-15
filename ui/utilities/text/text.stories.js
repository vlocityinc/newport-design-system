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
  .add('Body Default (examples)', () => {
    return withExample(
      `<div class="nds-text-body_regular">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Body Small (examples)', () => {
    return withExample(
      `<div class="nds-text-body_small">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Heading Large (examples)', () => {
    return withExample(
      `<div class="nds-text-heading_large">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Heading Medium (examples)', () => {
    return withExample(
      `<div class="nds-text-heading_medium">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Heading Small (examples)', () => {
    return withExample(
      `<div class="nds-text-heading_small">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Heading Title (examples)', () => {
    return withExample(
      `<div class="nds-text-title">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Heading Title  Caps (examples)', () => {
    return withExample(
      `<div class="nds-text-title_caps">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Longform (examples)', () => {
    return withExample(`<div class="nds-text-longform">
  <p>The quick brown fox jumps over the lazy dog.</p>
  <p>The quick brown fox jumps over the lazy dog.</p>
  <h3 class="nds-text-heading_small">Heading</h3>
  <ul>
    <li>The quick brown fox jumps over the lazy dog.</li>
    <li>
      <!-- react-text: 9 -->The quick brown fox jumps over the lazy dog.
      <!-- /react-text -->
      <ul>
        <li>The quick brown fox jumps over the lazy dog.</li>
        <li>
          <!-- react-text: 13 -->The quick brown fox jumps over the lazy dog.
          <!-- /react-text -->
          <ul>
            <li>The quick brown fox jumps over the lazy dog.</li>
            <li>The quick brown fox jumps over the lazy dog.</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
  <h3 class="nds-text-heading_small">Heading</h3>
  <ol>
    <li>The quick brown fox jumps over the lazy dog.</li>
    <li>
      <!-- react-text: 21 -->The quick brown fox jumps over the lazy dog.
      <!-- /react-text -->
      <ol>
        <li>The quick brown fox jumps over the lazy dog.</li>
        <li>
          <!-- react-text: 25 -->The quick brown fox jumps over the lazy dog.
          <!-- /react-text -->
          <ol>
            <li>The quick brown fox jumps over the lazy dog.</li>
            <li>The quick brown fox jumps over the lazy dog.</li>
          </ol>
        </li>
      </ol>
    </li>
  </ol>
</div>`);
  })
  .add('Align Left (examples)', () => {
    return withExample(
      `<div class="nds-text-align_left">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Align Right (examples)', () => {
    return withExample(
      `<div class="nds-text-align_right">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Align Center (examples)', () => {
    return withExample(
      `<div class="nds-text-align_center">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Text Color Default (examples)', () => {
    return withExample(
      `<div class="nds-text-color_default">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Text Color Weak (examples)', () => {
    return withExample(
      `<div class="nds-text-color_weak">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Text Color Error (examples)', () => {
    return withExample(
      `<div class="nds-text-color_error">The quick brown fox jumps over the lazy dog.</div>`
    );
  })
  .add('Text Color Inverse (examples)', () => {
    return withExample(`<div class="demo-only" style="padding: 0.5rem; background: rgb(22, 50, 92) none repeat scroll 0% 0%;">
  <div class="nds-text-color_inverse">The quick brown fox jumps over the lazy dog.</div>
</div>`);
  })
  .add('Text Color Inverse Weak (examples)', () => {
    return withExample(`<div class="demo-only" style="padding: 0.5rem; background: rgb(22, 50, 92) none repeat scroll 0% 0%;">
  <div class="nds-text-color_inverse-weak">The quick brown fox jumps over the lazy dog.</div>
</div>`);
  });
