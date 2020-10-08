import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import notes from './doc.md';
import scss from './base/_index.scss';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../scripts/storybook';

storiesOf(`${base}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Default (default)', () => {
    return withExample(`<div class="nds-vertical-tabs">
  <ul class="nds-vertical-tabs__nav" role="tablist" aria-orientation="vertical">
    <li class="nds-vertical-tabs__nav-item nds-is-active" title="Tab 1" role="presentation">
      <a class="nds-vertical-tabs__link" href="javascript:void(0)" role="tab" tabindex="0" aria-selected="true" aria-controls="nds-vertical-tabs-0" id="nds-vertical-tabs-0__nav">Tab 1</a>
    </li>
    <li class="nds-vertical-tabs__nav-item" title="Tab 2" role="presentation">
      <a class="nds-vertical-tabs__link" href="javascript:void(0)" role="tab" tabindex="-1" aria-selected="false" aria-controls="nds-vertical-tabs-1" id="nds-vertical-tabs-1__nav">Tab 2</a>
    </li>
    <li class="nds-vertical-tabs__nav-item" title="Tab 3 has a really long label and can wrap or truncate" role="presentation">
      <a class="nds-vertical-tabs__link" href="javascript:void(0)" role="tab" tabindex="-1" aria-selected="false" aria-controls="nds-vertical-tabs-2" id="nds-vertical-tabs-2__nav">Tab 3 has a really long label and can wrap or truncate</a>
    </li>
  </ul>
  <div class="nds-vertical-tabs__content nds-show" id="nds-vertical-tabs-0" role="tabpanel" aria-labelledby="nds-vertical-tabs-0__nav">
    <div class="nds-text-longform">
      <h3 class="nds-text-heading_medium">Tab Title</h3>
      <p>Content for Tab 1</p>
      <p>Lorem ipsum dolor...</p>
      <p>Lorem ipsum dolor...</p>
    </div>
  </div>
  <div class="nds-vertical-tabs__content nds-hide" id="nds-vertical-tabs-1" role="tabpanel" aria-labelledby="nds-vertical-tabs-1__nav">
    <div class="nds-text-longform">
      <h3 class="nds-text-heading_medium">Tab Title</h3>
      <p>Content for Tab 1</p>
      <p>Lorem ipsum dolor...</p>
      <p>Lorem ipsum dolor...</p>
    </div>
  </div>
  <div class="nds-vertical-tabs__content nds-hide" id="nds-vertical-tabs-2" role="tabpanel" aria-labelledby="nds-vertical-tabs-2__nav">
    <div class="nds-text-longform">
      <h3 class="nds-text-heading_medium">Tab Title</h3>
      <p>Content for Tab 1</p>
      <p>Lorem ipsum dolor...</p>
      <p>Lorem ipsum dolor...</p>
    </div>
  </div>
</div>`);
  });
