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
    <textarea id="textarea-id-01" class="nds-textarea nds-has-value" required=""></textarea>
    <label class="nds-form-element__label" for="textarea-id-01">Textarea Label</label>
  </div>
</div>`);
  })
  .add('Disabled (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <textarea disabled="" id="textarea-id-01" class="nds-textarea nds-has-value" required=""></textarea>
    <label class="nds-form-element__label" for="textarea-id-01">Textarea Label</label>
  </div>
</div>`);
  })
  .add('Required (states)', () => {
    return withExample(`<div class="nds-form-element">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <textarea required="" id="textarea-id-01" class="nds-textarea nds-has-value"></textarea>
    <label class="nds-form-element__label" for="textarea-id-01">
      <abbr class="nds-required" title="required">*</abbr>


      Textarea Label

    </label>
  </div>
</div>`);
  })
  .add('Error (states)', () => {
    return withExample(`<div class="nds-form-element nds-has-error">
  <div class="nds-form-element__control nds-form-element__control-animated-label">
    <textarea required="" aria-describedby="error-01" id="textarea-id-01" class="nds-textarea nds-has-value"></textarea>
    <label class="nds-form-element__label" for="textarea-id-01">
      <abbr class="nds-required" title="required">*</abbr>


      Textarea Label

    </label>
  </div>
  <div class="nds-form-element__help" id="error-01">This field is required</div>
</div>`);
  })
  .add('Read Only (states)', () => {
    return withExample(`<div class="nds-form-element">
  <span class="nds-form-element__label">Textarea Label</span>
  <div class="nds-form-element__control nds-form-element__control-animated-label nds-border_bottom">
    <div class="nds-form-element__static">
      <p>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Maecenas sed diam eget risus varius blandit sit amet non magna. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam
        quis risus eget urna mollis ornare vel eu leo. Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla. Maecenas faucibus mollis interdum.</p>
    </div>
  </div>
</div>`);
  });
