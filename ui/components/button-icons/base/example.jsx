// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

export let ButtonIcon = props => (
  <button
    className={classNames(
      'nds-button nds-button_icon',
      props.className,
      props.selected ? 'nds-is-selected' : null
    )}
    disabled={props.disabled}
    role={props.role}
    aria-describedby={props['aria-describedby']}
    aria-haspopup={props.hasDropdown ? 'true' : props['aria-haspopup']}
    aria-expanded={props['aria-expanded']}
    aria-controls={props['aria-controls']}
    aria-hidden={props['aria-hidden']}
    aria-pressed={props['aria-pressed']}
    aria-live={props.assertive ? 'assertive' : props['aria-live']}
    id={props.id}
    tabIndex={props.tabIndex}
    title={props.title || 'Provide description of action'}
  >
    <SvgIcon
      className={classNames('nds-button__icon', props.iconClassName)}
      sprite="utility"
      symbol={props.symbol || 'settings'}
    />
    {props.hasDropdown ? (
      <SvgIcon
        className="nds-button__icon nds-button__icon_x-small"
        sprite="utility"
        symbol="down"
      />
    ) : null}
    <span className="nds-assistive-text">
      {props.assistiveText || 'Provide description of action'}
    </span>
  </button>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export const Context = props => (
  <div style={{ padding: '0.5rem' }}>{props.children}</div>
);

export default <ButtonIcon />;

export let states = [
  {
    id: 'button-icon-error',
    label: 'Error',
    element: (
      <ButtonIcon
        className="nds-button_icon-error"
        symbol="warning"
        title="Warning"
        assistiveText="Warning"
      />
    )
  },
  {
    id: 'button-icon-disabled',
    label: 'Disabled',
    element: <ButtonIcon disabled />
  }
];

export let examples = [
  {
    id: 'hint-hover',
    label: 'Hint on hover',
    element: (
      <div className="nds-hint-parent">
        <ButtonIcon
          className="nds-button_icon"
          iconClassName="nds-button__icon_hint"
        />
      </div>
    )
  },
  {
    id: 'button-icon-inverse',
    label: 'Inverse',
    element: (
      <div style={{ padding: '0.5rem', backgroundColor: '#16325C' }}>
        <ButtonIcon inverse className="nds-button_icon-inverse" />
      </div>
    )
  },
  {
    id: 'button-icon-inverse-disabled',
    label: 'Inverse disabled',
    element: (
      <div style={{ padding: '0.5rem', backgroundColor: '#16325C' }}>
        <ButtonIcon inverse className="nds-button_icon-inverse" disabled />
      </div>
    )
  }
];
