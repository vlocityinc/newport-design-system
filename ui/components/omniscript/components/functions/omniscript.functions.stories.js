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
  .add('Aggregate / Formula', () => {
    return withExample('Empty Aggregate / Formula', `<c-masked-input>
      <div aria-live="polite" class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label">
          <input id="input1-31" type="text" readonly="" disabled="" class="vlocity-input nds-input_mask nds-input">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
          <label aria-label="Aggregate" for="input1-31">Aggregate</label>
        </div>
      </div>
      <div class="nds-form-element__control nds-form-element__control-animated-label">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"></div>
      </div>
      <div class="nds-grid"></div>
    </div>
    </c-masked-input>`) +
      withExample('Aggregate / Formula with value', `<c-masked-input>
      <div aria-live="polite" class="nds-form-element nds-form-container">
        <div class="nds-form-element__control nds-form-element__control-animated-label">
          <input id="input1-31" type="text" readonly="" disabled="" class="vlocity-input nds-input_mask nds-input nds-not-empty nds-is-dirty" value="$0.00">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out">
          <label aria-label="Aggregate" for="input1-31">Aggregate</label>
        </div>
      </div>
      <div class="nds-form-element__control nds-form-element__control-animated-label">
        <div class="nds-form-element__label nds-align-middle nds-animated-label__ease-out"></div>
      </div>
      <div class="nds-grid"></div>
    </div>
    </c-masked-input>`);
  })
  .add('Messaging', () => {
    const ValueMap = {
      Success: {
        iconName: 'utility:check',
        iconVariant: 'success',
      },
      Comment: {
        iconName: 'utility:chat',
        iconVariant: 'default',
      },
      Warning: {
        iconName: 'utility:warning',
        iconVariant: 'warning',
      },
      Requirement: {
        iconName: 'utility:close',
        iconVariant: 'error',
        textClass: 'nds-text-color--error',
        ariaRole: 'alert',
        wrapperClassDynamic: 'nds-scoped-notification--error',
      }
    };
    let value = radios('Types', {
      Success: 'Success',
      Comment: 'Comment',
      Warning: 'Warning',
      Requirement: 'Requirement'
    }, 'Success');
    if (value === '' || value == null) {
      value = 'Success';
    }
    return withExample(`Requirement with label`, 'Use the Knobs to toggle the different states of the Messages', `
      <div ${ValueMap[value].ariaRole ? `role="${ValueMap[value].ariaRole}"` : ''}class="nds-is-relative nds-scoped-notification nds-scoped-notification_form ${ValueMap[value].wrapperClassDynamic || ''}">
        <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
          <div msg="${value}" class="nds-faux-animate">
            <span title="${value}" class="nds-icon_container nds-icon_container_circle nds-m-right_small">
              <c-icon>
                <svg aria-hidden="true" class="nds-icon nds-icon-text-${ValueMap[value].iconVariant}">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#${ValueMap[value].iconName.split(':')[1]}"></use>
                </svg>
                <span class="nds-assistive-text"></span>
              </c-icon>
            </span>
            <span class="${ValueMap[value].textClass}">Message</span>
          </div>
          <label class="nds-form-element__label" style="top: 0rem;">
            <span>Messaging</span>
          </label>
        </div>
      </div>`) +
      withExample('Requirement without label', 'Use the Knobs to toggle the different states of the Messages', `
      <div ${ValueMap[value].ariaRole ? `role="${ValueMap[value].ariaRole}"` : ''}class="nds-is-relative nds-scoped-notification nds-scoped-notification_form ${ValueMap[value].wrapperClassDynamic || ''}">
        <div class="nds-form-element__control nds-form-element__control-animated-label nds-grid">
          <div msg="${value}" class="nds-faux-animate">
            <span title="${value}" class="nds-icon_container nds-icon_container_circle nds-m-right_small">
              <c-icon>
                <svg aria-hidden="true" class="nds-icon nds-icon-text-${ValueMap[value].iconVariant}">
                  <use xlink:href="./assets/icons/utility-sprite/svg/symbols.svg#${ValueMap[value].iconName.split(':')[1]}"></use>
                </svg>
                <span class="nds-assistive-text"></span>
              </c-icon>
            </span>
            <span class="${ValueMap[value].textClass}">Message</span>
          </div>
        </div>
      </div>`);

  });
