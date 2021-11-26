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
  .add('Top (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-padding">
  <div>
    <div class="nds-p-top_none"><div class="nds-box"></div></div>
    <div class="nds-p-top_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-p-top_xx-small"><div class="nds-box"></div></div>
    <div class="nds-p-top_x-small"><div class="nds-box"></div></div>
    <div class="nds-p-top_small"><div class="nds-box"></div></div>
    <div class="nds-p-top_medium"><div class="nds-box"></div></div>
    <div class="nds-p-top_large"><div class="nds-box"></div></div>
    <div class="nds-p-top_x-large"><div class="nds-box"></div></div>
    <div class="nds-p-top_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Right (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-padding">
  <div>
    <div class="nds-p-right_none"><div class="nds-box"></div></div>
    <div class="nds-p-right_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-p-right_xx-small"><div class="nds-box"></div></div>
    <div class="nds-p-right_x-small"><div class="nds-box"></div></div>
    <div class="nds-p-right_small"><div class="nds-box"></div></div>
    <div class="nds-p-right_medium"><div class="nds-box"></div></div>
    <div class="nds-p-right_large"><div class="nds-box"></div></div>
    <div class="nds-p-right_x-large"><div class="nds-box"></div></div>
    <div class="nds-p-right_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Bottom (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-padding">
  <div>
    <div class="nds-p-bottom_none"><div class="nds-box"></div></div>
    <div class="nds-p-bottom_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-p-bottom_xx-small"><div class="nds-box"></div></div>
    <div class="nds-p-bottom_x-small"><div class="nds-box"></div></div>
    <div class="nds-p-bottom_small"><div class="nds-box"></div></div>
    <div class="nds-p-bottom_medium"><div class="nds-box"></div></div>
    <div class="nds-p-bottom_large"><div class="nds-box"></div></div>
    <div class="nds-p-bottom_x-large"><div class="nds-box"></div></div>
    <div class="nds-p-bottom_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Left (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-padding">
  <div>
    <div class="nds-p-left_none"><div class="nds-box"></div></div>
    <div class="nds-p-left_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-p-left_xx-small"><div class="nds-box"></div></div>
    <div class="nds-p-left_x-small"><div class="nds-box"></div></div>
    <div class="nds-p-left_small"><div class="nds-box"></div></div>
    <div class="nds-p-left_medium"><div class="nds-box"></div></div>
    <div class="nds-p-left_large"><div class="nds-box"></div></div>
    <div class="nds-p-left_x-large"><div class="nds-box"></div></div>
    <div class="nds-p-left_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Vertical (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-padding">
  <div>
    <div class="nds-p-vertical_none"><div class="nds-box"></div></div>
    <div class="nds-p-vertical_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-p-vertical_xx-small"><div class="nds-box"></div></div>
    <div class="nds-p-vertical_x-small"><div class="nds-box"></div></div>
    <div class="nds-p-vertical_small"><div class="nds-box"></div></div>
    <div class="nds-p-vertical_medium"><div class="nds-box"></div></div>
    <div class="nds-p-vertical_large"><div class="nds-box"></div></div>
    <div class="nds-p-vertical_x-large"><div class="nds-box"></div></div>
    <div class="nds-p-vertical_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Horizontal (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-padding">
  <div>
    <div class="nds-p-horizontal_none"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_xx-small"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_x-small"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_small"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_medium"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_large"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_x-large"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Around (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-padding">
  <div>
    <div class="nds-p-around_none"><div class="nds-box"></div></div>
    <div class="nds-p-around_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-p-around_xx-small"><div class="nds-box"></div></div>
    <div class="nds-p-around_x-small"><div class="nds-box"></div></div>
    <div class="nds-p-around_small"><div class="nds-box"></div></div>
    <div class="nds-p-around_medium"><div class="nds-box"></div></div>
    <div class="nds-p-around_large"><div class="nds-box"></div></div>
    <div class="nds-p-around_x-large"><div class="nds-box"></div></div>
    <div class="nds-p-around_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  });
