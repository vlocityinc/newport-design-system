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
  .add('Default (default)', () => {
    return withExample(`<div class="nds-clearfix">
  <div>
    <p>I’m floooaaaating</p>
  </div>
</div>`);
  })
  .add('Left (examples)', () => {
    return withExample(`<div class="nds-clearfix">
  <div class="nds-clearfix">
    <div class="nds-float_left">
      <p>I’m floooaaaating</p>
    </div>
  </div>
</div>`);
  })
  .add('Right (examples)', () => {
    return withExample(`<div class="nds-clearfix">
  <div class="nds-clearfix">
    <div class="nds-float_right">
      <p>I’m floooaaaating</p>
    </div>
  </div>
</div>`);
  })
  .add('None (examples)', () => {
    return withExample(`<div class="nds-clearfix">
  <div class="nds-float_none">
    <p>I’m not floooaaaating</p>
  </div>
</div>`);
  })
  .add('Clearfix (examples)', () => {
    return withExample(`<div class="nds-clearfix">
  <div class="nds-clearfix">
    <div class="nds-float_left">
      <p>I’m floooaaaating</p>
    </div>
    <div class="nds-float_right">
      <p>I’m floooaaaating</p>
    </div>
  </div>
</div>`);
  });
