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
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <div class="nds-select_container">
      <select class="nds-select nds-has-value" id="select-01" required="">
        <option></option>
        <option>Option </option>
        <option>Option Tw11o</option>
        <option>Option Thr11ee</option>
      </select>
      <label class="nds-form-element__label" for="select-01">Select</label>
    </div>
  </div>
</div>`);
  })
  .add('Select Required (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <div class="nds-select_container">
      <select class="nds-select nds-has-value" id="select-01" required="">
        <option></option>
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </select>
      <label class="nds-form-element__label" for="select-01">Select</label>
    </div>
  </div>
</div>`);
  })
  .add('Select Error (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <div class="nds-select_container">
      <select aria-describedby="error-02" class="nds-select nds-has-value" id="select-01" required="">
        <option></option>
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </select>
      <label class="nds-form-element__label" for="select-01">Select</label>
    </div>
  </div>
  <div class="nds-form-element__help" id="error-02">This field is required</div>
</div>`);
  })
  .add('Select Disabled (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <div class="nds-select_container">
      <select class="nds-select nds-has-value" disabled="" id="select-01">
        <option></option>
        <option>Option One</option>
        <option>Option Two</option>
        <option>Option Three</option>
      </select>
      <label class="nds-form-element__label" for="select-01">Select</label>
    </div>
  </div>
</div>`);
  })
  .add('Select Multiple (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <select id="select-01" class="nds-select nds-has-value" multiple="">
      <option></option>
      <option>Option One</option>
      <option>Option Two</option>
      <option>Option Three</option>
    </select>
  </div>
</div>`);
  });
