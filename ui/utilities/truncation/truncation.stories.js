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
  .add('Fluid (examples)', () => {
    return withExample(`<div class="nds-size_1-of-2">
  <p class="nds-truncate" title="Long text field with many lines and truncation will look like this. Even though the text might go on for ages and ages.">Long text field with many lines and truncation will look like this. Even though the text might go on for ages and ages.</p>
</div>`);
  })
  .add('25% (examples)', () => {
    return withExample(`<ul>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_25">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan">
      <a href="javascript:void(0);">Lei Chan</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_25">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name">
      <a href="javascript:void(0);">Lei Chan with Long Name</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_25">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name that might go on for quite some distance futher than you might expect">
      <a href="javascript:void(0);">Lei Chan with Long Name that might go on for quite some distance futher than you might expect</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
</ul>`);
  })
  .add('33% (examples)', () => {
    return withExample(`<ul>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_33">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan">
      <a href="javascript:void(0);">Lei Chan</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_33">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name">
      <a href="javascript:void(0);">Lei Chan with Long Name</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_33">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name that might go on for quite some distance futher than you might expect">
      <a href="javascript:void(0);">Lei Chan with Long Name that might go on for quite some distance futher than you might expect</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
</ul>`);
  })
  .add('50% (examples)', () => {
    return withExample(`<ul>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_50">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan">
      <a href="javascript:void(0);">Lei Chan</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_50">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name">
      <a href="javascript:void(0);">Lei Chan with Long Name</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_50">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name that might go on for quite some distance futher than you might expect">
      <a href="javascript:void(0);">Lei Chan with Long Name that might go on for quite some distance futher than you might expect</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
</ul>`);
  })
  .add('66% (examples)', () => {
    return withExample(`<ul>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_66">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan">
      <a href="javascript:void(0);">Lei Chan</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_66">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name">
      <a href="javascript:void(0);">Lei Chan with Long Name</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_66">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name that might go on for quite some distance futher than you might expect">
      <a href="javascript:void(0);">Lei Chan with Long Name that might go on for quite some distance futher than you might expect</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
</ul>`);
  })
  .add('75% (examples)', () => {
    return withExample(`<ul>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_75">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan">
      <a href="javascript:void(0);">Lei Chan</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_75">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name">
      <a href="javascript:void(0);">Lei Chan with Long Name</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
  <li class="nds-list__item nds-m-right_large nds-grid nds-truncate_container_75">
    <span>To:</span>
    <span class="nds-m-left_xx-small nds-truncate" title="Lei Chan with Long Name that might go on for quite some distance futher than you might expect">
      <a href="javascript:void(0);">Lei Chan with Long Name that might go on for quite some distance futher than you might expect</a>
    </span>
    <span class="nds-m-left_xx-small nds-no-flex"> + 44 more</span>
  </li>
</ul>`);
  });
