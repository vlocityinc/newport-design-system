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
    return withExample(`<div class="demo-only nds-size_3-of-4">
  <div class="nds-media">
    <div class="nds-media__figure">
      <span class="nds-avatar nds-avatar_large">
        <img alt="Person name" src="/assets/images/avatar3.jpg" title="User avatar">
      </span>
    </div>
    <div class="nds-media__body">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat minus molestias reprehenderit consequuntur sapiente. Modi veritatis totam accusantium numquam assumenda.</p>
    </div>
  </div>
</div>`);
  })
  .add('Center (examples)', () => {
    return withExample(`<div class="demo-only nds-size_3-of-4">
  <div class="nds-media nds-media_center">
    <div class="nds-media__figure">
      <span class="nds-avatar nds-avatar_large">
        <img alt="Person name" src="/assets/images/avatar3.jpg" title="User avatar">
      </span>
    </div>
    <div class="nds-media__body">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat minus molestias reprehenderit consequuntur sapiente. Modi veritatis totam accusantium numquam assumenda.</p>
    </div>
  </div>
</div>`);
  })
  .add('Reverse (examples)', () => {
    return withExample(`<div class="demo-only nds-size_3-of-4">
  <div class="nds-media">
    <div class="nds-media__body">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat minus molestias reprehenderit consequuntur sapiente. Modi veritatis totam accusantium numquam assumenda.</p>
    </div>
    <div class="nds-media__figure nds-media__figure_reverse">
      <span class="nds-avatar nds-avatar_large">
        <img alt="Person name" src="/assets/images/avatar3.jpg" title="User avatar">
      </span>
    </div>
  </div>
</div>`);
  })
  .add('Reverse Center (examples)', () => {
    return withExample(`<div class="demo-only nds-size_3-of-4">
  <div class="nds-media nds-media_center">
    <div class="nds-media__body">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat minus molestias reprehenderit consequuntur sapiente. Modi veritatis totam accusantium numquam assumenda.</p>
    </div>
    <div class="nds-media__figure nds-media__figure_reverse">
      <span class="nds-avatar nds-avatar_large">
        <img alt="Person name" src="/assets/images/avatar3.jpg" title="User avatar">
      </span>
    </div>
  </div>
</div>`);
  })
  .add('Double (examples)', () => {
    return withExample(`<div class="demo-only nds-size_3-of-4">
  <div class="nds-media">
    <div class="nds-media__figure">
      <span class="nds-avatar nds-avatar_large">
        <img alt="Person name" src="/assets/images/avatar3.jpg" title="User avatar">
      </span>
    </div>
    <div class="nds-media__body">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat minus molestias reprehenderit consequuntur sapiente. Modi veritatis totam accusantium numquam assumenda.</p>
    </div>
    <div class="nds-media__figure nds-media__figure_reverse">
      <span class="nds-avatar nds-avatar_large">
        <img alt="Person name" src="/assets/images/avatar3.jpg" title="User avatar">
      </span>
    </div>
  </div>
</div>`);
  })
  .add('Responsive (examples)', () => {
    return withExample(`<div class="demo-only nds-size_3-of-4">
  <div class="nds-media nds-media_responsive">
    <div class="nds-media__figure">
      <span class="nds-avatar nds-avatar_large">
        <img alt="Person name" src="/assets/images/avatar3.jpg" title="User avatar">
      </span>
    </div>
    <div class="nds-media__body">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat minus molestias reprehenderit consequuntur sapiente. Modi veritatis totam accusantium numquam assumenda.</p>
    </div>
  </div>
</div>`);
  });
