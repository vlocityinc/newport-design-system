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
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Select a plan</legend>
  <div class="nds-form-element__control">
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="radio" id="visual-picker-8" name="options" value="on">
      <label for="visual-picker-8">
        <span class="nds-visual-picker__figure nds-visual-picker__text nds-align_absolute-center">
          <span>
            <span class="nds-text-heading_large">$30</span>
            <span class="nds-text-title">USD/user/month *</span>
          </span>
        </span>
        <span class="nds-visual-picker__body">
          <span class="nds-text-heading_small">Lightning Professional</span>
          <span class="nds-text-title">Complete service CRM for teams of any size</span>
        </span>
        <span class="nds-icon_container nds-visual-picker__text-check">
          <svg class="nds-icon nds-icon-text-check nds-icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
        </span>
      </label>
    </div>
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="radio" id="visual-picker-9" name="options" value="on">
      <label for="visual-picker-9">
        <span class="nds-visual-picker__figure nds-visual-picker__text nds-align_absolute-center">
          <span>
            <span class="nds-text-heading_large">$150</span>
            <span class="nds-text-title">USD/user/month *</span>
          </span>
        </span>
        <span class="nds-visual-picker__body">
          <span class="nds-text-heading_small">Lightning Enterprise</span>
          <span class="nds-text-title">Everything you need to take support to the next level</span>
        </span>
        <span class="nds-icon_container nds-visual-picker__text-check">
          <svg class="nds-icon nds-icon-text-check nds-icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
        </span>
      </label>
    </div>
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="radio" id="visual-picker-10" name="options" value="on">
      <label for="visual-picker-10">
        <span class="nds-visual-picker__figure nds-visual-picker__text nds-align_absolute-center">
          <span>
            <span class="nds-text-heading_large">$300</span>
            <span class="nds-text-title">USD/user/month *</span>
          </span>
        </span>
        <span class="nds-visual-picker__body">
          <span class="nds-text-heading_small">Lightning Unlimited</span>
          <span class="nds-text-title">Complete support with enterprise-grade customization</span>
        </span>
        <span class="nds-icon_container nds-visual-picker__text-check">
          <svg class="nds-icon nds-icon-text-check nds-icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
        </span>
      </label>
    </div>
  </div>
</fieldset>`);
  })
  .add('Disabled (states)', () => {
    return withExample(`<fieldset class="nds-form-element">
  <legend class="nds-form-element__legend nds-form-element__label">Select a plan</legend>
  <div class="nds-form-element__control">
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="radio" id="visual-picker-11" name="options" value="on">
      <label for="visual-picker-11">
        <span class="nds-visual-picker__figure nds-visual-picker__text nds-align_absolute-center">
          <span>
            <span class="nds-text-heading_large">$30</span>
            <span class="nds-text-title">USD/user/month *</span>
          </span>
        </span>
        <span class="nds-visual-picker__body">
          <span class="nds-text-heading_small">Lightning Professional</span>
          <span class="nds-text-title">Complete service CRM for teams of any size</span>
        </span>
        <span class="nds-icon_container nds-visual-picker__text-check">
          <svg class="nds-icon nds-icon-text-check nds-icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
        </span>
      </label>
    </div>
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="radio" id="visual-picker-12" name="options" value="on">
      <label for="visual-picker-12">
        <span class="nds-visual-picker__figure nds-visual-picker__text nds-align_absolute-center">
          <span>
            <span class="nds-text-heading_large">$150</span>
            <span class="nds-text-title">USD/user/month *</span>
          </span>
        </span>
        <span class="nds-visual-picker__body">
          <span class="nds-text-heading_small">Lightning Enterprise</span>
          <span class="nds-text-title">Everything you need to take support to the next level</span>
        </span>
        <span class="nds-icon_container nds-visual-picker__text-check">
          <svg class="nds-icon nds-icon-text-check nds-icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
        </span>
      </label>
    </div>
    <div class="nds-visual-picker nds-visual-picker_medium">
      <input type="radio" id="visual-picker-13" name="options" disabled="" value="on">
      <label for="visual-picker-13">
        <span class="nds-visual-picker__figure nds-visual-picker__text nds-align_absolute-center">
          <span>
            <span class="nds-text-heading_large">$300</span>
            <span class="nds-text-title">USD/user/month *</span>
          </span>
        </span>
        <span class="nds-visual-picker__body">
          <span class="nds-text-heading_small">Lightning Unlimited</span>
          <span class="nds-text-title">Complete support with enterprise-grade customization</span>
        </span>
        <span class="nds-icon_container nds-visual-picker__text-check">
          <svg class="nds-icon nds-icon-text-check nds-icon_x-small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
          </svg>
        </span>
      </label>
    </div>
  </div>
</fieldset>`);
  })
  .add('Link (examples)', () => {
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
