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
    return withExample(`<div class="nds-pill_container">
  <ul class="nds-listbox nds-listbox_horizontal" role="listbox" aria-label="Selected Options:" aria-orientation="horizontal">
    <li role="presentation">
      <span class="nds-pill" role="option" tabindex="0" aria-selected="true">
        <span class="nds-pill__label" title="Full pill label verbiage mirrored here">Pill Label</span>
        <span class="nds-icon_container nds-pill__remove" title="Remove">
          <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Press delete or backspace to remove</span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span class="nds-pill" role="option" aria-selected="true">
        <span class="nds-pill__label" title="Full pill label verbiage mirrored here">Pill Label</span>
        <span class="nds-icon_container nds-pill__remove" title="Remove">
          <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Press delete or backspace to remove</span>
        </span>
      </span>
    </li>
  </ul>
</div>`);
  })
  .add('Listbox Pill With Icon (states)', () => {
    return withExample(`<div class="nds-pill_container">
  <ul class="nds-listbox nds-listbox_horizontal" role="listbox" aria-label="Selected Options:" aria-orientation="horizontal">
    <li role="presentation">
      <span class="nds-pill" role="option" tabindex="0" aria-selected="true">
        <span class="nds-icon_container nds-icon-standard-account nds-pill__icon_container" title="Account">
          <svg class="nds-icon" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
          </svg>
          <span class="nds-assistive-text">Account</span>
        </span>
        <span class="nds-pill__label" title="Full pill label verbiage mirrored here">Pill Label</span>
        <span class="nds-icon_container nds-pill__remove" title="Remove">
          <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Press delete or backspace to remove</span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span class="nds-pill" role="option" aria-selected="true">
        <span class="nds-icon_container nds-icon-standard-case nds-pill__icon_container" title="Case">
          <svg class="nds-icon" aria-hidden="true">
            <use xlink:href="/assets/icons/standard-sprite/svg/symbols.svg#case"></use>
          </svg>
          <span class="nds-assistive-text">Case</span>
        </span>
        <span class="nds-pill__label" title="Full pill label verbiage mirrored here">Pill Label</span>
        <span class="nds-icon_container nds-pill__remove" title="Remove">
          <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Press delete or backspace to remove</span>
        </span>
      </span>
    </li>
  </ul>
</div>`);
  })
  .add('Listbox Pill With Avatar (states)', () => {
    return withExample(`<div class="nds-pill_container">
  <ul class="nds-listbox nds-listbox_horizontal" role="listbox" aria-label="Selected Options:" aria-orientation="horizontal">
    <li role="presentation">
      <span class="nds-pill" role="option" tabindex="0" aria-selected="true">
        <span class="nds-avatar nds-avatar_x-small nds-pill__icon_container">
          <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
        </span>
        <span class="nds-pill__label" title="Full pill label verbiage mirrored here">Pill Label</span>
        <span class="nds-icon_container nds-pill__remove" title="Remove">
          <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Press delete or backspace to remove</span>
        </span>
      </span>
    </li>
    <li role="presentation">
      <span class="nds-pill" role="option" aria-selected="true">
        <span class="nds-avatar nds-avatar_x-small nds-pill__icon_container">
          <img alt="Person name" src="/assets/images/avatar2.jpg" title="User avatar">
        </span>
        <span class="nds-pill__label" title="Full pill label verbiage mirrored here">Pill Label</span>
        <span class="nds-icon_container nds-pill__remove" title="Remove">
          <svg class="nds-icon nds-icon_x-small nds-icon-text-default" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
          </svg>
          <span class="nds-assistive-text">Press delete or backspace to remove</span>
        </span>
      </span>
    </li>
  </ul>
</div>`);
  });
