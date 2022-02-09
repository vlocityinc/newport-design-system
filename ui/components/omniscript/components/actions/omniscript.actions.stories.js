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
  .add('Actions', () => {
    return withExample('Simple Action as Button', 'Actions will appear as a button when inside the Step of an OmniScript. If the Action is outside of Steps then it is not rendered and a standard Newport spinner is shown instead', `
      <div class="nds-is-relative nds-p-around_x-small nds-m-bottom_x-small">
      <c-button>
        <button type="button" label="My Action" class="vlocity-btn nds-button nds-button_brand nds-button_stretch">
          <span class="btnLabel">My Action</span>
        </button>
      </c-button>
    </div>`);
  });
