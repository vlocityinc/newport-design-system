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
    return withExample(`<div class="nds-scoped-notification nds-media nds-media_center" role="status">
  <div class="nds-media__figure">
    <span class="nds-icon_container nds-icon-utility-info" title="information">
      <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
      </svg>
      <span class="nds-assistive-text">information</span>
    </span>
  </div>
  <div class="nds-media__body">
    <p>
      It looks as if duplicates exist for this lead.



      <a href="javascript:void(0);">View Duplicates.</a>
    </p>
  </div>
</div>`);
  })
  .add('Light Theme (examples)', () => {
    return withExample(`<div class="nds-scoped-notification nds-media nds-media_center nds-scoped-notification_light" role="status">
  <div class="nds-media__figure">
    <span class="nds-icon_container nds-icon-utility-info" title="information">
      <svg class="nds-icon nds-icon_small nds-icon-text-default" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
      </svg>
      <span class="nds-assistive-text">information</span>
    </span>
  </div>
  <div class="nds-media__body">
    <p>
      It looks as if duplicates exist for this lead.



      <a href="javascript:void(0);">View Duplicates.</a>
    </p>
  </div>
</div>`);
  })
  .add('Dark Theme (examples)', () => {
    return withExample(`<div class="nds-scoped-notification nds-media nds-media_center nds-scoped-notification_dark" role="status">
  <div class="nds-media__figure">
    <span class="nds-icon_container nds-icon-utility-info" title="information">
      <svg class="nds-icon nds-icon_small" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
      </svg>
      <span class="nds-assistive-text">information</span>
    </span>
  </div>
  <div class="nds-media__body">
    <p>
      It looks as if duplicates exist for this lead.



      <a href="javascript:void(0);">View Duplicates.</a>
    </p>
  </div>
</div>`);
  });
