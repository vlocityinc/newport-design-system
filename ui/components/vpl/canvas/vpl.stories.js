import { storiesOf } from '@storybook/html';
import base from 'paths.macro';
import scss from './_index.scss';
import notes from '../doc.md';
import {
  withExample,
  withDocs,
  commentToHTML
} from '../../../../scripts/storybook';

storiesOf(`${base.replace('/ui/', '').replace('/canvas/', '')}`, module)
  .addDecorator(withDocs(notes))
  .addDecorator(commentToHTML(scss))
  .add('Canvas', () => {
    return withExample(`<div class="nds-canvas">
  <div class="nds-p-around_small">
    <h3 class="nds-is-relative nds-m-bottom_large nds-canvas__title">Title</h3>
    <div class="nds-grid nds-m-bottom_small nds-wrap cards-container">
      <div class="nds-size_1-of-1 nds-m-bottom--large">My Action 1</div>
      <div class="nds-size_1-of-1 nds-m-bottom--large">My Action 2</div>
    </div>
  </div>
</div>`);
  });
