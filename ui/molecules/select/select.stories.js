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
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="select-01">Select Label</label>
  <div class="nds-form-element__control">
    <div class="nds-select_container">
      <select class="nds-select" id="select-01">
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </select>
    </div>
  </div>
</div>`);
  })
  .add('Select Required (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="select-01">
    <abbr class="nds-required" title="required">*</abbr>


    Select Label

  </label>
  <div class="nds-form-element__control">
    <div class="nds-select_container">
      <select class="nds-select" id="select-01" required="">
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </select>
    </div>
  </div>
</div>`);
  })
  .add('Select Error (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <label class="nds-form-element__label" for="select-01">
    <abbr class="nds-required" title="required">*</abbr>


    Select Label

  </label>
  <div class="nds-form-element__control">
    <div class="nds-select_container">
      <select aria-describedby="error-02" class="nds-select" id="select-01" required="">
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </select>
    </div>
  </div>
  <div class="nds-form-element__help" id="error-02">This field is required</div>
</div>`);
  })
  .add('Select Disabled (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="select-01">Select Label</label>
  <div class="nds-form-element__control">
    <div class="nds-select_container">
      <select class="nds-select" disabled="" id="select-01">
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </select>
    </div>
  </div>
</div>`);
  })
  .add('Select Multiple (states)', () => {
    return withExample(`<div class="nds-form-element">
  <label class="nds-form-element__label" for="select-01">Select Label</label>
  <div class="nds-form-element__control">
    <select id="select-01" class="nds-select" multiple="">
      <option>Option One</option>
      <option>Option Two</option>
      <option>Option Three</option>
    </select>
  </div>
</div>`);
  });
