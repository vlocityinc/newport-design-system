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
  .add('Vertical List (examples)', () => {
    return withExample(`<ul>
  <li>Vertical List</li>
  <li>List Item</li>
  <li>List Item</li>
</ul>`);
  })
  .add('Unordered List Decimal (examples)', () => {
    return withExample(`<ul class="nds-list_dotted">
  <li>Basic ordered list</li>
  <li>List Item</li>
  <li>List Item</li>
</ul>`);
  })
  .add('Ordered List Decimal (examples)', () => {
    return withExample(`<ol class="nds-list_ordered">
  <li>Basic ordered list</li>
  <li>List Item</li>
  <li>List Item</li>
</ol>`);
  })
  .add('Vertical List Links (examples)', () => {
    return withExample(`<ul>
  <li>
    <a href="javascript:void(0);">Vertical List with links</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical List Block Links (examples)', () => {
    return withExample(`<ul class="nds-has-block-links">
  <li>
    <a href="javascript:void(0);">Vertical List with block links</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical List Block Links Space (examples)', () => {
    return withExample(`<ul class="nds-has-block-links_space">
  <li>
    <a href="javascript:void(0);">Vertical List with block links with space</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical List Inline Block Links (examples)', () => {
    return withExample(`<ul class="nds-has-inline-block-links">
  <li>
    <a href="javascript:void(0);">Vertical List with inline-block links</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical List Inline Block Links Space (examples)', () => {
    return withExample(`<ul class="nds-has-inline-block-links_space">
  <li>
    <a href="javascript:void(0);">Vertical List with inline-block links with space</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li>
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical List Nested (examples)', () => {
    return withExample(`<ul>
  <li>Vertical List with nested vertical lists</li>
  <li>List Item</li>
  <li>
    <ul class="nds-is-nested">
      <li>Nested Vertical List</li>
      <li>List Item</li>
      <li>
        <ul class="nds-is-nested">
          <li>Nested Vertical List</li>
          <li>List Item</li>
          <li>List Item</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>`);
  })
  .add('Vertical Dividers Top (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_top">
  <li class="nds-item">List item with top divider</li>
  <li class="nds-item">List Item</li>
  <li class="nds-item">List Item</li>
</ul>`);
  })
  .add('Vertical Dividers Top Space (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_top-space">
  <li class="nds-item">List item with top divider with space</li>
  <li class="nds-item">List Item</li>
  <li class="nds-item">List Item</li>
</ul>`);
  })
  .add('Vertical Dividers Link Top (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_top nds-has-block-links">
  <li class="nds-item">
    <a href="javascript:void(0);">List item with link and top divider</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical Dividers Link Top Space (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_top nds-has-block-links_space">
  <li class="nds-item">
    <a href="javascript:void(0);">List item with link and top divider</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical Dividers Bottom (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_bottom">
  <li class="nds-item">List item with bottom divider</li>
  <li class="nds-item">List Item</li>
  <li class="nds-item">List Item</li>
</ul>`);
  })
  .add('Vertical Dividers Bottom Space (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_bottom-space">
  <li class="nds-item">List item with bottom divider with space</li>
  <li class="nds-item">List Item</li>
  <li class="nds-item">List Item</li>
</ul>`);
  })
  .add('Vertical Dividers Link Bottom (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_bottom nds-has-block-links">
  <li class="nds-item">
    <a href="javascript:void(0);">List item with link and bottom divider</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical Dividers Link Bottom Space (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_bottom nds-has-block-links_space">
  <li class="nds-item">
    <a href="javascript:void(0);">List item with link and bottom divider with space</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical Dividers Around (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_around">
  <li class="nds-item">List item with around divider</li>
  <li class="nds-item">List Item</li>
  <li class="nds-item">List Item</li>
</ul>`);
  })
  .add('Vertical Dividers Around Space (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_around-space">
  <li class="nds-item">List item with around divider with space</li>
  <li class="nds-item">List Item</li>
  <li class="nds-item">List Item</li>
</ul>`);
  })
  .add('Vertical Dividers Link Around (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_around nds-has-block-links">
  <li class="nds-item">
    <a href="javascript:void(0);">List item with link and around divider</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  })
  .add('Vertical Dividers Link Around Space (examples)', () => {
    return withExample(`<ul class="nds-has-dividers_around nds-has-block-links_space">
  <li class="nds-item">
    <a href="javascript:void(0);">List item with link and around divider with space</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
  <li class="nds-item">
    <a href="javascript:void(0);">List Item</a>
  </li>
</ul>`);
  });
