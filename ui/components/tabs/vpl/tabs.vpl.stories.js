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
    return withExample(`<div class="nds-tabs_default nds-tabs_default-vpl nds-tabs_default">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item nds-is-active" title="Item One" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-default-1" id="tab-default-1__item">Item One</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Two" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-2" id="tab-default-2__item">Item Two</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Three" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-3" id="tab-default-3__item">Item Three</a>
    </li>
  </ul>
  <div id="tab-default-1" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="tab-default-1__item">Item One Content</div>
  <div id="tab-default-2" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-2__item">Item Two Content</div>
  <div id="tab-default-3" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-3__item">Item Three Content</div>
</div>`);
  })
  .add('Selected (states)', () => {
    return withExample(`<div class="nds-tabs_default nds-tabs_default-vpl nds-tabs_default">
  <ul class="nds-tabs_default__nav" role="tablist">
    <li class="nds-tabs_default__item" title="Item One" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-1" id="tab-default-1__item">Item One</a>
    </li>
    <li class="nds-tabs_default__item nds-is-active" title="Item Two" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-default-2" id="tab-default-2__item">Item Two</a>
    </li>
    <li class="nds-tabs_default__item" title="Item Three" role="presentation">
      <a class="nds-tabs_default__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-default-3" id="tab-default-3__item">Item Three</a>
    </li>
  </ul>
  <div id="tab-default-1" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-1__item">Item One Content</div>
  <div id="tab-default-2" class="nds-tabs_default__content nds-show" role="tabpanel" aria-labelledby="tab-default-2__item">Item Two Content</div>
  <div id="tab-default-3" class="nds-tabs_default__content nds-hide" role="tabpanel" aria-labelledby="tab-default-3__item">Item Three Content</div>
</div>`);
  });
