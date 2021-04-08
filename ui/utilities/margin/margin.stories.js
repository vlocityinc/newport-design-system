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
    return withExample(`<div class="demo-only-spacing demo-only-margin">
  <div>
    <div class="nds-m-top_none"><div class="nds-box"></div></div>
    <div class="nds-m-top_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-m-top_xx-small"><div class="nds-box"></div></div>
    <div class="nds-m-top_x-small"><div class="nds-box"></div></div>
    <div class="nds-m-top_small"><div class="nds-box"></div></div>
    <div class="nds-m-top_medium"><div class="nds-box"></div></div>
    <div class="nds-m-top_large"><div class="nds-box"></div></div>
    <div class="nds-m-top_x-large"><div class="nds-box"></div></div>
    <div class="nds-m-top_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Right (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-margin">
  <div>
    <div class="nds-m-right_none"><div class="nds-box"></div></div>
    <div class="nds-m-right_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-m-right_xx-small"><div class="nds-box"></div></div>
    <div class="nds-m-right_x-small"><div class="nds-box"></div></div>
    <div class="nds-m-right_small"><div class="nds-box"></div></div>
    <div class="nds-m-right_medium"><div class="nds-box"></div></div>
    <div class="nds-m-right_large"><div class="nds-box"></div></div>
    <div class="nds-m-right_x-large"><div class="nds-box"></div></div>
    <div class="nds-m-right_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Bottom (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-margin">
  <div>
    <div class="nds-m-bottom_none"><div class="nds-box"></div></div>
    <div class="nds-m-bottom_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-m-bottom_xx-small"><div class="nds-box"></div></div>
    <div class="nds-m-bottom_x-small"><div class="nds-box"></div></div>
    <div class="nds-m-bottom_small"><div class="nds-box"></div></div>
    <div class="nds-m-bottom_medium"><div class="nds-box"></div></div>
    <div class="nds-m-bottom_large"><div class="nds-box"></div></div>
    <div class="nds-m-bottom_x-large"><div class="nds-box"></div></div>
    <div class="nds-m-bottom_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Left (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-margin">
  <div>
    <div class="nds-m-left_none"><div class="nds-box"></div></div>
    <div class="nds-m-left_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-m-left_xx-small"><div class="nds-box"></div></div>
    <div class="nds-m-left_x-small"><div class="nds-box"></div></div>
    <div class="nds-m-left_small"><div class="nds-box"></div></div>
    <div class="nds-m-left_medium"><div class="nds-box"></div></div>
    <div class="nds-m-left_large"><div class="nds-box"></div></div>
    <div class="nds-m-left_x-large"><div class="nds-box"></div></div>
    <div class="nds-m-left_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Vertical (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-margin">
  <div>
    <div class="nds-m-vertical_none"><div class="nds-box"></div></div>
    <div class="nds-m-vertical_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-m-vertical_xx-small"><div class="nds-box"></div></div>
    <div class="nds-m-vertical_x-small"><div class="nds-box"></div></div>
    <div class="nds-m-vertical_small"><div class="nds-box"></div></div>
    <div class="nds-m-vertical_medium"><div class="nds-box"></div></div>
    <div class="nds-m-vertical_large"><div class="nds-box"></div></div>
    <div class="nds-m-vertical_x-large"><div class="nds-box"></div></div>
    <div class="nds-m-vertical_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Horizontal (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-margin">
  <div>
    <div class="nds-m-horizontal_none"><div class="nds-box"></div></div>
    <div class="nds-m-horizontal_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-m-horizontal_xx-small"><div class="nds-box"></div></div>
    <div class="nds-m-horizontal_x-small"><div class="nds-box"></div></div>
    <div class="nds-m-horizontal_small"><div class="nds-box"></div></div>
    <div class="nds-m-horizontal_medium"><div class="nds-box"></div></div>
    <div class="nds-m-horizontal_large"><div class="nds-box"></div></div>
    <div class="nds-m-horizontal_x-large"><div class="nds-box"></div></div>
    <div class="nds-m-horizontal_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Around (examples)', () => {
    return withExample(`<div class="demo-only-spacing demo-only-margin">
  <div>
    <div class="nds-m-around_none"><div class="nds-box"></div></div>
    <div class="nds-m-around_xxx-small"><div class="nds-box"></div></div>
    <div class="nds-m-around_xx-small"><div class="nds-box"></div></div>
    <div class="nds-m-around_x-small"><div class="nds-box"></div></div>
    <div class="nds-m-around_small"><div class="nds-box"></div></div>
    <div class="nds-m-around_medium"><div class="nds-box"></div></div>
    <div class="nds-m-around_large"><div class="nds-box"></div></div>
    <div class="nds-m-around_x-large"><div class="nds-box"></div></div>
    <div class="nds-m-around_xx-large"><div class="nds-box"></div></div>
  </div>
</div>`);
  });
