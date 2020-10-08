// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React, { Component } from 'react';
import _ from '../../shared/helpers';
import classNames from 'classnames';

// internal imports
import SvgIcon from '../../shared/svg-icon';
import { Button } from '../buttons/base/example';
import Tabs from '../tabs/index.react';
import { Popover } from '../popovers/base/example';
import { FormElement } from '../form-element/base/example';
import { Input } from '../input/base/example';

const swatchColors = [
  '#e3abec',
  '#c2dbf7',
  '#9fd6ff',
  '#9de7da',
  '#9df0c0',
  '#fff099',
  '#fed49a',
  '#d073e0',
  '#86baf3',
  '#5ebbff',
  '#44d8be',
  '#3be282',
  '#ffe654',
  '#ffb758',
  '#bd35bd',
  '#5779c1',
  '#5ebbff',
  '#00aea9',
  '#3cba4c',
  '#f5bc25',
  '#f99221',
  '#580d8c',
  '#001970',
  '#0a2399',
  '#0b7477',
  '#0b6b50',
  '#b67e11',
  '#b85d0d'
];

const errorMessage = 'Please ensure value is correct';

/**
 * Swatch Subcomponent
 */
const Swatch = props => {
  return (
    <span
      key={_.uniqueId('swatch-')}
      className="nds-swatch"
      style={{ background: props.color }}
    >
      <span className="nds-assistive-text" aria-hidden={props.ariaHidden}>
        {props.color}
      </span>
    </span>
  );
};

/**
 * Summary Subcomponent
 */
export const ColorPickerSummary = props => {
  const { hasSummaryError } = props;
  const errorId = 'color-picker-summary-error';

  return (
    <div className="nds-color-picker__summary">
      <label
        className="nds-color-picker__summary-label"
        htmlFor="color-picker-summary-input"
      >
        Choose Color
      </label>

      <Button
        className="nds-color-picker__summary-button nds-button_icon nds-button_icon-more"
        aria-haspopup
        title="Choose Color"
      >
        <Swatch color="hsl(220, 46%, 55%)" suppressAssistiveText />
        <SvgIcon
          className="nds-button__icon nds-button__icon_small"
          sprite="utility"
          symbol="down"
        />
        <span className="nds-assistive-text">
          Choose a color. Current color: #5679C0
        </span>
      </Button>

      <FormElement
        className={classNames('nds-color-picker__summary-input', {
          'nds-has-error': hasSummaryError
        })}
      >
        <Input
          id="color-picker-summary-input"
          defaultValue="#5679C0"
          aria-describedby={hasSummaryError ? errorId : null}
        />
      </FormElement>

      {hasSummaryError ? (
        <p className="nds-form-error" id={errorId}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

/**
 * Swatches (list of Swatch elements) Subcomponent
 */
export const ColorPickerSwatches = props => {
  const { isMenuRole } = props;
  const swatchesRole = isMenuRole ? 'menu' : 'listbox';
  const linkRole = isMenuRole ? 'menuitem' : 'option';

  return (
    <ul className="nds-color-picker__swatches" role={swatchesRole}>
      {swatchColors.map((swatch, index) => (
        <li
          key={_.uniqueId('color-picker-swatch-')}
          className="nds-color-picker__swatch"
          role="presentation"
        >
          <a
            className="nds-color-picker__swatch-trigger"
            href="#"
            role={linkRole}
            tabIndex={index === 0 ? 0 : -1}
          >
            <Swatch color={swatch} index={index} />
          </a>
        </li>
      ))}
    </ul>
  );
};

/**
 * Custom Picker Subcomponent
 */
const ColorPickerCustom = props => {
  const rangeInputId = _.uniqueId('color-picker-input-range-');
  const hexInputId = _.uniqueId('color-picker-input-hex-');
  const rInputId = _.uniqueId('color-picker-input-r-');
  const gInputId = _.uniqueId('color-picker-input-g-');
  const bInputId = _.uniqueId('color-picker-input-b-');
  const { hasCustomError } = props;
  const customErrorId = 'color-picker-custom-error';

  return (
    <div className="nds-color-picker__custom">
      <p id="color-picker-instructions" className="nds-assistive-text">
        Use arrow keys to select a saturation and brightness, on an x and y
        axis.
      </p>
      <div
        className="nds-color-picker__custom-range"
        style={{ background: 'hsl(220, 100%, 50%)' }}
      >
        <a
          className="nds-color-picker__range-indicator"
          style={{ bottom: '45%', left: '46%' }}
          href="#"
          aria-live="assertive"
          aria-atomic="true"
          aria-describedby="color-picker-instructions"
        >
          <span className="nds-assistive-text">
            Saturation: 46%. Brightness: 45%.
          </span>
        </a>
      </div>

      <div className="nds-color-picker__hue-and-preview">
        <label className="nds-assistive-text" htmlFor={rangeInputId}>
          Select Hue
        </label>
        <input
          type="range"
          className="nds-color-picker__hue-slider"
          min="0"
          max="360"
          defaultValue="208"
          id={rangeInputId}
        />
        <Swatch color="#5679C0" ariaHidden />
      </div>

      <div className="nds-color-picker__custom-inputs">
        <FormElement
          label="Hex"
          className={classNames('nds-color-picker__input-custom-hex', {
            'nds-has-error': hasCustomError
          })}
          inputId={hexInputId}
        >
          <Input
            id={hexInputId}
            defaultValue="#5679C0"
            aria-describedby={hasCustomError ? customErrorId : null}
          />
        </FormElement>

        <FormElement label={<abbr title="Red">R</abbr>} inputId={rInputId}>
          <Input defaultValue="86" id={rInputId} />
        </FormElement>

        <FormElement label={<abbr title="Green">G</abbr>} inputId={gInputId}>
          <Input defaultValue="121" id={gInputId} />
        </FormElement>

        <FormElement label={<abbr title="blue">B</abbr>} inputId={bInputId}>
          <Input defaultValue="192" id={bInputId} />
        </FormElement>
      </div>

      {hasCustomError ? (
        <p className="nds-form-error" id={customErrorId}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

/**
 * Footer Subcomponent
 */
const ColorPickerFooter = () => (
  <div className="nds-color-picker__selector-footer">
    <Button className="nds-button_neutral">Cancel</Button>
    <Button className="nds-button_brand">Done</Button>
  </div>
);

/**
 * Tabs Subcomponent
 */
const ColorPickerTabs = props => (
  <Tabs selectedIndex={props.selectedTabIndex}>
    <Tabs.Item title="Default" id="color-picker-default">
      <ColorPickerSwatches />
    </Tabs.Item>

    <Tabs.Item title="Custom" id="color-picker-custom">
      <ColorPickerCustom hasCustomError={props.hasCustomError} />
    </Tabs.Item>
  </Tabs>
);

class ColorPicker extends React.Component {
  constructor(props) {
    super();

    this.state = {
      selectedTabIndex: props.selectedTabIndex || 0
    };

    this.isFullFeatureMode = this.isFullFeatureMode.bind(this);
    this.isPredefinedMode = this.isPredefinedMode.bind(this);
    this.isCustomOnlyMode = this.isCustomOnlyMode.bind(this);
    this.isSwatchesOnlyMode = this.isSwatchesOnlyMode.bind(this);
  }

  isFullFeatureMode() {
    const { hasPredefined, hasCustom } = this.props;
    return !!(hasPredefined && hasCustom);
  }

  isPredefinedMode() {
    const { hasPredefined, hasCustom } = this.props;
    return !!(hasPredefined && !hasCustom);
  }

  isCustomOnlyMode() {
    const { hasPredefined, hasCustom } = this.props;
    return !!(!hasPredefined && hasCustom);
  }

  isSwatchesOnlyMode() {
    const { hasPredefined, hasCustom } = this.props;
    return !!(!hasPredefined && !hasCustom);
  }

  render() {
    const { selectedTabIndex } = this.state;
    const { isOpen, hasSummaryError, hasCustomError } = this.props;
    const popoverState = isOpen ? 'nds-show' : 'nds-hide';
    const colorPickerSummary = this.isSwatchesOnlyMode() ? null : (
      <ColorPickerSummary hasSummaryError={hasSummaryError} />
    );
    const footerContent = this.isSwatchesOnlyMode() ? null : (
      <ColorPickerFooter />
    );
    let colorPickerContent = null;

    if (this.isFullFeatureMode()) {
      colorPickerContent = (
        <ColorPickerTabs
          hasCustomError={hasCustomError}
          selectedTabIndex={selectedTabIndex}
        />
      );
    } else if (this.isPredefinedMode()) {
      colorPickerContent = <ColorPickerSwatches />;
    } else if (this.isCustomOnlyMode()) {
      colorPickerContent = (
        <ColorPickerCustom hasCustomError={hasCustomError} />
      );
    } else if (this.isSwatchesOnlyMode()) {
      colorPickerContent = (
        <ColorPickerTabs selectedTabIndex={selectedTabIndex} />
      );
    }

    return (
      <div className="nds-color-picker">
        {colorPickerSummary}

        <Popover
          title="Choose a color"
          className={classNames('nds-color-picker__selector', popoverState)}
          footer={footerContent}
        >
          {colorPickerContent}
        </Popover>
      </div>
    );
  }
}

ColorPicker.defaultProps = {
  selectedTabIndex: 0,
  isOpen: false,
  hasPredefined: true,
  hasCustom: true
};

export default ColorPicker;
