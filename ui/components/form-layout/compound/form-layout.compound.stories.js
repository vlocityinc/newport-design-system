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
    return withExample(`<div class="demo-only" style="width: 440px;">
  <div class="nds-form nds-form_compound">
    <fieldset class="nds-form-element">
      <legend class="nds-form-element__label nds-text-title_caps">Location</legend>
      <div class="nds-form-element__group">
        <div class="nds-form-element__row">
          <div class="nds-form-element nds-size_1-of-2">
            <label class="nds-form-element__label" for="input-01">Latitude</label>
            <input type="text" id="input-01" class="nds-input">
          </div>
          <div class="nds-form-element nds-size_1-of-2">
            <label class="nds-form-element__label" for="input-02">Longitude</label>
            <input type="text" id="input-02" class="nds-input">
          </div>
        </div>
      </div>
    </fieldset>
    <fieldset class="nds-form-element">
      <legend class="nds-form-element__label nds-text-title_caps">Address</legend>
      <div class="nds-form-element__group">
        <div class="nds-form-element__row">
          <div class="nds-form-element nds-size_1-of-1">
            <label class="nds-form-element__label" for="input-03">Street</label>
            <input type="text" id="input-03" class="nds-input">
          </div>
        </div>
        <div class="nds-form-element__row">
          <div class="nds-form-element nds-size_1-of-2">
            <label class="nds-form-element__label" for="input-04">City</label>
            <input type="text" id="input-04" class="nds-input">
          </div>
          <div class="nds-form-element nds-size_1-of-2">
            <label class="nds-form-element__label" for="input-05">State</label>
            <input type="text" id="input-05" class="nds-input">
          </div>
        </div>
        <div class="nds-form-element__row">
          <div class="nds-form-element nds-size_1-of-2">
            <label class="nds-form-element__label" for="input-06">ZIP Code</label>
            <input type="text" id="input-06" class="nds-input">
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</div>`);
  });
