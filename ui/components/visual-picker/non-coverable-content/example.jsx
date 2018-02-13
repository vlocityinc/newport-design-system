// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import _ from '../../../shared/helpers';
import {
  Fieldset,
  Legend,
  FormElementControl
} from '../../radio-group/base/example';
import { VisualPicker } from '../coverable-content/example';
import { UtilityIcon } from '../../icons/base/example';

const PackageOne = [
  <span className="nds-text-heading_small" key={_.uniqueId()}>
    Lightning Professional
  </span>,
  <span className="nds-text-title" key={_.uniqueId()}>
    Complete service CRM for teams of any size
  </span>
];

const PackageTwo = [
  <span className="nds-text-heading_small" key={_.uniqueId()}>
    Lightning Enterprise
  </span>,
  <span className="nds-text-title" key={_.uniqueId()}>
    Everything you need to take support to the next level
  </span>
];

const PackageThree = [
  <span className="nds-text-heading_small" key={_.uniqueId()}>
    Lightning Unlimited
  </span>,
  <span className="nds-text-title" key={_.uniqueId()}>
    Complete support with enterprise-grade customization
  </span>
];

export let VisualPickerMediaObject = props => (
  <a
    href="javascript:void(0);"
    className={classNames(
      'nds-box nds-box_link nds-box_x-small nds-media',
      props.className
    )}
  >
    <div className="nds-media__figure nds-media__figure_fixed-width nds-align_absolute-center nds-m-left_xx-small">
      <UtilityIcon className="nds-icon-text-default" symbol="knowledge_base" />
    </div>
    <div className="nds-media__body nds-border_left nds-p-around_small">
      {props.children}
    </div>
  </a>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <Fieldset>
    <Legend>Select a plan</Legend>
    <FormElementControl>
      <VisualPicker type="radio" size="medium" label={PackageOne}>
        <span>
          <span className="nds-text-heading_large">$30</span>
          <span className="nds-text-title">USD/user/month *</span>
        </span>
      </VisualPicker>
      <VisualPicker type="radio" size="medium" label={PackageTwo}>
        <span>
          <span className="nds-text-heading_large">$150</span>
          <span className="nds-text-title">USD/user/month *</span>
        </span>
      </VisualPicker>
      <VisualPicker type="radio" size="medium" label={PackageThree}>
        <span>
          <span className="nds-text-heading_large">$300</span>
          <span className="nds-text-title">USD/user/month *</span>
        </span>
      </VisualPicker>
    </FormElementControl>
  </Fieldset>
);

export let states = [
  {
    id: 'disabled',
    label: 'Disabled option',
    element: (
      <Fieldset>
        <Legend>Select a plan</Legend>
        <FormElementControl>
          <VisualPicker type="radio" size="medium" label={PackageOne}>
            <span>
              <span className="nds-text-heading_large">$30</span>
              <span className="nds-text-title">USD/user/month *</span>
            </span>
          </VisualPicker>
          <VisualPicker type="radio" size="medium" label={PackageTwo}>
            <span>
              <span className="nds-text-heading_large">$150</span>
              <span className="nds-text-title">USD/user/month *</span>
            </span>
          </VisualPicker>
          <VisualPicker
            type="radio"
            size="medium"
            disabled
            label={PackageThree}
          >
            <span>
              <span className="nds-text-heading_large">$300</span>
              <span className="nds-text-title">USD/user/month *</span>
            </span>
          </VisualPicker>
        </FormElementControl>
      </Fieldset>
    )
  }
];

export let examples = [
  {
    id: 'link',
    label: 'Text link',
    element: (
      <div className="demo-only" style={{ width: '24rem' }}>
        <VisualPickerMediaObject symbol="user">
          <h2
            className="nds-truncate nds-text-heading_small"
            title="Share the knowledge"
          >
            Share the knowledge
          </h2>
          <p className="nds-m-top_small">
            Harness your team's collective know-how with our powerful knowledge
            base
          </p>
        </VisualPickerMediaObject>
      </div>
    )
  }
];
