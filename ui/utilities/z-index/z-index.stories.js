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
  .add('Default (examples)', () => {
    return withExample(
      `<div class="nds-is-relative" style="width: 100px; height: 100px">
         <div class="nds-z_1 nds-box" style="background-color: #fff; position: absolute; width: 90px; height: 50px; left: 0px; top: 0px">.nds-z_1</div>
         <div class="nds-z_0 nds-box" style="background-color: #fff; position: absolute; width: 90px; height: 50px; left: 40px; top: 35px">.nds-z_0</div>
         <div class="nds-z_-1 nds-box" style="background-color: #fff; position: absolute; width: 90px; height: 50px; left: 100px; top: 70px">.nds-z_-1</div>
       </div>`
    );
  });
