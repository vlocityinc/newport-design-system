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
  .add('Horizontal List (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal">
  <li>Horizontal List</li>
  <li>List Item</li>
  <li>List Item</li>
</ul>`);
  })
  .add('Horizontal List Links (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal">
  <li>
    <a href="javascript:void(0);">Horizontal List with inline level links</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Horizontal List Block Links (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-block-links">
  <li>
    <a href="javascript:void(0);">Horizontal List with block level links</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Horizontal List Block Links Space (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-block-links_space">
  <li>
    <a href="javascript:void(0);">Horizontal List with block level links and space</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Horizontal List Inline Block Links (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-inline-block-links">
  <li>
    <a href="javascript:void(0);">Horizontal List with inline-block level links</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Horizontal List Inline Block Links Space (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-inline-block-links_space">
  <li>
    <a href="javascript:void(0);">Horizontal List with inline-block level links and space</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Horizontal List Left (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-dividers_left">
  <li class="nds-item">Horizontal List with dot dividers to the left</li>
  <li class="nds-item">List Item</li>
  <li class="nds-item">List Item</li>
</ul>`);
  })
  .add('Horizontal List Link Left (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-dividers_left nds-has-block-links">
  <li class="nds-item">
    <a href="javascript:void(0);">Horizontal List with block level links and dot dividers</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Horizontal List Link Space Left (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-dividers_left nds-has-block-links_space">
  <li class="nds-item">
    <a href="javascript:void(0);">Horizontal List with block level links and dot dividers with space</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Horizontal List Right (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-dividers_right">
  <li class="nds-item">Horizontal List with dot dividers to the right</li>
  <li class="nds-item">List Item</li>
  <li class="nds-item">List Item</li>
</ul>`);
  })
  .add('Horizontal List Link Right (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-dividers_right nds-has-block-links">
  <li class="nds-item">
    <a href="javascript:void(0);">Horizontal List with block level links and dot dividers</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Horizontal List Link Space Right (examples)', () => {
    return withExample(`<ul class="nds-list_horizontal nds-has-dividers_right nds-has-block-links_space">
  <li class="nds-item">
    <a href="javascript:void(0);">Horizontal List with block level links and dot dividers with space</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  });
