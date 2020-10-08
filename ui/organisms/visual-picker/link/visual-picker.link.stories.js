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
    return withExample(`<div class="demo-only" style="width: 24rem;">
  <a href="javascript:void(0);" class="nds-box nds-box_link nds-box_x-small nds-media">
    <div class="nds-media__figure nds-media__figure_fixed-width nds-align_absolute-center nds-m-left_xx-small">
      <span class="nds-icon_container nds-icon-utility-knowledge_base" title="Description of icon when needed">
        <svg class="nds-icon nds-icon-text-default" aria-hidden="true">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#knowledge_base"></use>
        </svg>
        <span class="nds-assistive-text">Description of icon</span>
      </span>
    </div>
    <div class="nds-media__body nds-border_left nds-p-around_small">
      <h2 class="nds-truncate nds-text-heading_small" title="Share the knowledge">Share the knowledge</h2>
      <p class="nds-m-top_small">Harness your team's collective know-how with our powerful knowledge base</p>
    </div>
  </a>
</div>`);
  });
