// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { ButtonIcon } from '../../button-icons/base/example';
import { UtilityIcon } from '../../icons/base/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';

/// ///////////////////////////////////////////
// State Constructor(s)
/// ///////////////////////////////////////////

export let Toast = props => {
  const { containerClassName, className, type, children, ...rest } = props;

  return (
    <div className={classNames('nds-notify_container', containerClassName)}>
      <div
        className={classNames(
          'nds-notify nds-notify_toast',
          className,
          type ? 'nds-theme_' + type : null
        )}
        role="alert"
      >
        <span className="nds-assistive-text">{type || 'info'}</span>
        {children}
        <ButtonIcon
          className="nds-notify__close nds-button_icon-inverse"
          iconClassName="nds-button__icon_large"
          symbol="close"
          assistiveText="Close"
          title="Close"
        />
      </div>
    </div>
  );
};

/// ///////////////////////////////////////////
// Export
/// ///////////////////////////////////////////

export default (
  <div className="demo-only" style={{ height: '4rem' }}>
    <Toast type="info" containerClassName="nds-is-relative">
      <UtilityIcon
        containerClassName="nds-m-right_small nds-no-flex nds-align-top"
        className="nds-icon_small"
        assistiveText={false}
        symbol="info"
      />
      <div className="nds-notify__content">
        <h2 className="nds-text-heading_small">
          26 potential duplicate leads were found.{' '}
          <a href="javascript:void(0);">Select Leads to Merge</a>
        </h2>
      </div>
    </Toast>
  </div>
);

export let states = [
  {
    id: 'success',
    label: 'Success',
    element: (
      <div className="demo-only" style={{ height: '4rem' }}>
        <Toast type="success" containerClassName="nds-is-relative">
          <UtilityIcon
            containerClassName="nds-m-right_small nds-no-flex nds-align-top"
            className="nds-icon_small"
            assistiveText={false}
            symbol="success"
          />
          <div className="nds-notify__content">
            <h2 className="nds-text-heading_small ">
              Account <a href="javascript:void(0);">ACME - 100</a> widgets was
              created.
            </h2>
          </div>
        </Toast>
      </div>
    )
  },
  {
    id: 'warning',
    label: 'Warning',
    element: (
      <div className="demo-only" style={{ height: '4rem' }}>
        <Toast type="warning" containerClassName="nds-is-relative">
          <UtilityIcon
            containerClassName="nds-m-right_small nds-no-flex nds-align-top"
            className="nds-icon_small"
            assistiveText={false}
            symbol="warning"
          />
          <div className="nds-notify__content">
            <h2 className="nds-text-heading_small ">
              Can’t share file “report-q3.pdf” with the selected users.
            </h2>
          </div>
        </Toast>
      </div>
    )
  },
  {
    id: 'error',
    label: 'Error',
    element: (
      <div className="demo-only" style={{ height: '4rem' }}>
        <Toast type="error" containerClassName="nds-is-relative">
          <UtilityIcon
            containerClassName="nds-m-right_small nds-no-flex nds-align-top"
            className="nds-icon_small"
            assistiveText={false}
            symbol="error"
          />
          <div className="nds-notify__content">
            <h2 className="nds-text-heading_small ">
              Can’t save lead “Sally Wong” because another lead has the same
              name.
            </h2>
          </div>
        </Toast>
      </div>
    )
  },
  {
    id: 'error-with-details',
    label: 'Error With Details',
    element: (
      <div className="demo-only" style={{ height: '4rem' }}>
        <Toast type="error" containerClassName="nds-is-relative">
          <UtilityIcon
            containerClassName="nds-m-right_small nds-no-flex nds-align-top"
            className="nds-icon_small"
            assistiveText={false}
            symbol="error"
          />
          <div className="nds-notify__content">
            <h2 className="nds-text-heading_small">
              You've encountered some errors when trying to save edits to Samuel
              Smith.
            </h2>
            <p>
              Here's some detail of what happened, being very descriptive and
              transparent.
            </p>
          </div>
        </Toast>
      </div>
    )
  }
];

export let examples = [
  {
    id: 'small',
    label: 'Small Column',
    element: (
      <div className="demo-only" style={{ height: '4rem', width: '25rem' }}>
        <div className="nds-region_narrow nds-is-relative">
          <Toast type="info" containerClassName="nds-is-absolute">
            <div className="nds-notify__content">
              <h2 className="nds-text-heading_small">
                26 potential duplicate leads were found.
              </h2>
            </div>
          </Toast>
        </div>
      </div>
    )
  }
];
