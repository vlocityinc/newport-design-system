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
    return withExample(`<div class="nds-progress-ring">
  <div class="nds-progress-ring__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
    <svg viewBox="-1 -1 2 2">
      <path class="nds-progress-ring__path" id="nds-progress-ring-path" d="M 1 0 A 1 1 0 1 1 1 -2.4492935982947064e-16 L 0 0"></path>
    </svg>
  </div>
  <div class="nds-progress-ring__content"></div>
</div>`);
  })
  .add('Progress Ring Partially Drained (examples)', () => {
    return withExample(`<div class="nds-progress-ring">
  <div class="nds-progress-ring__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="88">
    <svg viewBox="-1 -1 2 2">
      <path class="nds-progress-ring__path" id="nds-progress-ring-path" d="M 1 0 A 1 1 0 1 1 0.7289686274214113 -0.684547105928689 L 0 0"></path>
    </svg>
  </div>
  <div class="nds-progress-ring__content"></div>
</div>`);
  })
  .add('Progress Ring Warning (examples)', () => {
    return withExample(`<div class="nds-progress-ring nds-progress-ring_warning">
  <div class="nds-progress-ring__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="20">
    <svg viewBox="-1 -1 2 2">
      <path class="nds-progress-ring__path" id="nds-progress-ring-path" d="M 1 0 A 1 1 0 0 1 0.30901699437494745 0.9510565162951535 L 0 0"></path>
    </svg>
  </div>
  <div class="nds-progress-ring__content">
    <span class="nds-icon_container nds-icon-utility-warning" title="Warning">
      <svg class="nds-icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#warning"></use>
      </svg>
      <span class="nds-assistive-text">Warning</span>
    </span>
  </div>
</div>`);
  })
  .add('Progress Ring Expired (examples)', () => {
    return withExample(`<div class="nds-progress-ring nds-progress-ring_expired">
  <div class="nds-progress-ring__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
    <svg viewBox="-1 -1 2 2">
      <path class="nds-progress-ring__path" id="nds-progress-ring-path" d="M 1 0 A 1 1 0 0 1 1 0 L 0 0"></path>
    </svg>
  </div>
  <div class="nds-progress-ring__content">
    <span class="nds-icon_container nds-icon-utility-error" title="Expired">
      <svg class="nds-icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#error"></use>
      </svg>
      <span class="nds-assistive-text">Expired</span>
    </span>
  </div>
</div>`);
  })
  .add('Progress Ring Complete (examples)', () => {
    return withExample(`<div class="nds-progress-ring nds-progress-ring_complete">
  <div class="nds-progress-ring__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
    <svg viewBox="-1 -1 2 2">
      <path class="nds-progress-ring__path" id="nds-progress-ring-path" d="M 1 0 A 1 1 0 1 1 1 -2.4492935982947064e-16 L 0 0"></path>
    </svg>
  </div>
  <div class="nds-progress-ring__content">
    <span class="nds-icon_container nds-icon-utility-check" title="Complete">
      <svg class="nds-icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
      </svg>
      <span class="nds-assistive-text">Complete</span>
    </span>
  </div>
</div>`);
  });
