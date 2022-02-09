/* eslint-env browser */
import { storiesOf } from '@storybook/html';
import { withKnobs, radios } from '@storybook/addon-knobs';
import base from 'paths.macro';
import notes from './doc.md';
import {
  withExample,
  withDocs,
} from '../../../../../scripts/storybook';

storiesOf(`${base}`.replace(/(^\/)|(\/$)/g, ''), module)
  .addDecorator(withKnobs)
  .addDecorator(withDocs(notes))
  .add('Basic Field', () => {
    return withExample('Field', `<c-output-field>
      <div>
        <div>
          <label class="nds-show--inline nds-form-element__label">FirstName </label>
        </div>
        <div>
          <span title="Jon" class="field-value">Jon</span>
        </div>
      </div>
    </omnistudio-output-field>`);
  });
