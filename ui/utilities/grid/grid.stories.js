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
  .add('Stretch (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid">
    <div class="nds-col"><div class="nds-box"></div></div>
    <div class="nds-col"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Stretch Gutters (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_pull-padded-medium">
    <div class="nds-col nds-p-horizontal_medium"><div class="nds-box"></div></div>
    <div class="nds-col nds-p-horizontal_medium"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('No Stretch (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('No Stretch Gutters (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_pull-padded-medium">
    <div class="nds-p-horizontal_medium"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_medium"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Regions With Sizing (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-wrap nds-grid_pull-padded">
    <div class="nds-p-horizontal_small nds-size_1-of-1"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_5-of-6 nds-large-size_8-of-12"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_1-of-6 nds-large-size_4-of-12"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_small nds-size_1-of-1 nds-medium-size_1-of-2 nds-large-size_1-of-3"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_small nds-size_1-of-1 nds-medium-size_1-of-2 nds-large-size_1-of-3"><div class="nds-box"></div></div>
    <div class="nds-p-horizontal_small nds-size_1-of-1 nds-large-size_1-of-3">
      <div class="nds-grid nds-wrap nds-grid_pull-padded">
        <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_1-of-1 nds-large-size_1-of-2"><div class="nds-box"></div></div>
        <div class="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_1-of-1 nds-large-size_1-of-2"><div class="nds-box"></div></div>
      </div>
    </div>
  </div>
</div>`);
  })
  .add('Horizontal Align Center (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_align-center">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Horizontal Align Space (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_align-space">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Horizontal Align Spread (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_align-spread">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Horizontal Align End (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_align-end">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Vertical Align Start (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_vertical-align-start">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Vertical Align Center (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_vertical-align-center">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Vertical Align End (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_vertical-align-end">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Vertical Align Item (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid">
    <div class="nds-align-top"><div class="nds-box"></div></div>
    <div class="nds-align-middle"><div class="nds-box"></div></div>
    <div class="nds-align-bottom"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Vertical Strecth (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_vertical-stretch">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Align Item Bump (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid">
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
    <div class="nds-col_bump-left"><div class="nds-box"></div></div>
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Order (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid">
    <div class="nds-order_2 nds-medium-order_1 nds-large-order_3"><div class="nds-box"></div></div>
    <div class="nds-order_3 nds-medium-order_2 nds-large-order_2"><div class="nds-box"></div></div>
    <div class="nds-order_1 nds-medium-order_3 nds-large-order_1"><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Container App Frame (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_frame">
    <div><div class="nds-box"></div></div>
  </div>
</div>`);
  })
  .add('Containers (examples)', () => {
    return withExample(`<div class="demo-only-grid">
  <div class="nds-grid nds-grid_vertical">
    <div class="nds-container_small"><div class="nds-box">Small</div></div>
    <div class="nds-container_medium"><div class="nds-box">Medium</div></div>
    <div class="nds-container_large"><div class="nds-box">Large</div></div>
    <div class="nds-container_x-large"><div class="nds-box">X-Large</div></div>
    <div class="nds-container_fluid"><div class="nds-box">Fluid</div></div>
  </div>
</div>`);
  });
