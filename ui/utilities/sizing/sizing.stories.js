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
  .add('Two Column (examples)', () => {
    return withExample(`<div class="demo-only demo-only--sizing nds-grid nds-wrap">
  <div class="nds-size_1-of-2">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-2

    </div>
  </div>
  <div class="nds-size_1-of-2">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-2

    </div>
  </div>
  <div class="nds-size_2-of-2">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-2

    </div>
  </div>
</div>`);
  })
  .add('Three Column (examples)', () => {
    return withExample(`<div class="demo-only demo-only--sizing nds-grid nds-wrap">
  <div class="nds-size_1-of-3">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-3

    </div>
  </div>
  <div class="nds-size_1-of-3">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-3

    </div>
  </div>
  <div class="nds-size_1-of-3">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-3

    </div>
  </div>
  <div class="nds-size_1-of-3">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-3

    </div>
  </div>
  <div class="nds-size_2-of-3">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-3

    </div>
  </div>
  <div class="nds-size_3-of-3">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      3-of-3

    </div>
  </div>
</div>`);
  })
  .add('Four Column (examples)', () => {
    return withExample(`<div class="demo-only demo-only--sizing nds-grid nds-wrap">
  <div class="nds-size_1-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-4

    </div>
  </div>
  <div class="nds-size_1-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-4

    </div>
  </div>
  <div class="nds-size_1-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-4

    </div>
  </div>
  <div class="nds-size_1-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-4

    </div>
  </div>
  <div class="nds-size_1-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-4

    </div>
  </div>
  <div class="nds-size_3-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      3-of-4

    </div>
  </div>
  <div class="nds-size_2-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-4

    </div>
  </div>
  <div class="nds-size_2-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-4

    </div>
  </div>
  <div class="nds-size_4-of-4">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      4-of-4

    </div>
  </div>
</div>`);
  })
  .add('Five Column (examples)', () => {
    return withExample(`<div class="demo-only demo-only--sizing nds-grid nds-wrap">
  <div class="nds-size_1-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-5

    </div>
  </div>
  <div class="nds-size_1-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-5

    </div>
  </div>
  <div class="nds-size_1-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-5

    </div>
  </div>
  <div class="nds-size_1-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-5

    </div>
  </div>
  <div class="nds-size_1-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-5

    </div>
  </div>
  <div class="nds-size_1-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-5

    </div>
  </div>
  <div class="nds-size_4-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      4-of-5

    </div>
  </div>
  <div class="nds-size_2-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-5

    </div>
  </div>
  <div class="nds-size_3-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      3-of-5

    </div>
  </div>
  <div class="nds-size_5-of-5">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      5-of-5

    </div>
  </div>
</div>`);
  })
  .add('Six Column (examples)', () => {
    return withExample(`<div class="demo-only demo-only--sizing nds-grid nds-wrap">
  <div class="nds-size_1-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-6

    </div>
  </div>
  <div class="nds-size_1-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-6

    </div>
  </div>
  <div class="nds-size_1-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-6

    </div>
  </div>
  <div class="nds-size_1-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-6

    </div>
  </div>
  <div class="nds-size_1-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-6

    </div>
  </div>
  <div class="nds-size_1-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-6

    </div>
  </div>
  <div class="nds-size_2-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-6

    </div>
  </div>
  <div class="nds-size_4-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      4-of-6

    </div>
  </div>
  <div class="nds-size_3-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      3-of-6

    </div>
  </div>
  <div class="nds-size_3-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      3-of-6

    </div>
  </div>
  <div class="nds-size_6-of-6">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      6-of-6

    </div>
  </div>
</div>`);
  })
  .add('7 Column (examples)', () => {
    return withExample(`<div class="demo-only demo-only--sizing nds-grid nds-wrap">
  <div class="nds-size_1-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-7

    </div>
  </div>
  <div class="nds-size_1-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-7

    </div>
  </div>
  <div class="nds-size_1-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-7

    </div>
  </div>
  <div class="nds-size_1-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-7

    </div>
  </div>
  <div class="nds-size_1-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-7

    </div>
  </div>
  <div class="nds-size_1-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-7

    </div>
  </div>
  <div class="nds-size_1-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-7

    </div>
  </div>
  <div class="nds-size_2-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-7

    </div>
  </div>
  <div class="nds-size_5-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      5-of-7

    </div>
  </div>
  <div class="nds-size_3-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      3-of-7

    </div>
  </div>
  <div class="nds-size_4-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      4-of-7

    </div>
  </div>
  <div class="nds-size_7-of-7">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      7-of-7

    </div>
  </div>
</div>`);
  })
  .add('8 Column (examples)', () => {
    return withExample(`<div class="demo-only demo-only--sizing nds-grid nds-wrap">
  <div class="nds-size_1-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-8

    </div>
  </div>
  <div class="nds-size_1-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-8

    </div>
  </div>
  <div class="nds-size_1-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-8

    </div>
  </div>
  <div class="nds-size_1-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-8

    </div>
  </div>
  <div class="nds-size_1-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-8

    </div>
  </div>
  <div class="nds-size_1-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-8

    </div>
  </div>
  <div class="nds-size_1-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-8

    </div>
  </div>
  <div class="nds-size_1-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-8

    </div>
  </div>
  <div class="nds-size_2-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-8

    </div>
  </div>
  <div class="nds-size_6-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      6-of-8

    </div>
  </div>
  <div class="nds-size_3-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      3-of-8

    </div>
  </div>
  <div class="nds-size_5-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      5-of-8

    </div>
  </div>
  <div class="nds-size_4-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      4-of-8

    </div>
  </div>
  <div class="nds-size_4-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      4-of-8

    </div>
  </div>
  <div class="nds-size_8-of-8">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      8-of-8

    </div>
  </div>
</div>`);
  })
  .add('12 Column (examples)', () => {
    return withExample(`<div class="demo-only demo-only--sizing nds-grid nds-wrap">
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_1-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      1-of-12

    </div>
  </div>
  <div class="nds-size_2-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      2-of-12

    </div>
  </div>
  <div class="nds-size_10-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      10-of-12

    </div>
  </div>
  <div class="nds-size_3-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      3-of-12

    </div>
  </div>
  <div class="nds-size_9-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      9-of-12

    </div>
  </div>
  <div class="nds-size_4-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      4-of-12

    </div>
  </div>
  <div class="nds-size_8-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      8-of-12

    </div>
  </div>
  <div class="nds-size_5-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      5-of-12

    </div>
  </div>
  <div class="nds-size_7-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      7-of-12

    </div>
  </div>
  <div class="nds-size_6-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      6-of-12

    </div>
  </div>
  <div class="nds-size_6-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      6-of-12

    </div>
  </div>
  <div class="nds-size_12-of-12">
    <div class="nds-box nds-box_x-small nds-text-align_center nds-m-around_x-small">
      .nds-size_

      12-of-12

    </div>
  </div>
</div>`);
  });
