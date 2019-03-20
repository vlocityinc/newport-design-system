// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonIcon } from '../../button-icons/base/example';
import classNames from 'classnames';

const headerAction = (
  <button className="nds-button nds-button_neutral">New</button>
);

const headerSearch = (
  <div className="nds-input-has-icon nds-input-has-icon_left nds-size_1-of-3">
    <SvgIcon
      className="nds-input__icon nds-icon-text-default"
      sprite="utility"
      symbol="search"
    />
    <label htmlFor="text-input-01" className="nds-assistive-text">
      Find in List
    </label>
    <input
      id="text-input-01"
      className="nds-input"
      type="text"
      placeholder="Find in List"
    />
  </div>
);

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let Card = props => (
  <article
    className={classNames('nds-card nds-card_asset-detail', props.className)}
  >
    {props.children}
  </article>
);

export let CardHeader = props => (
  <div className={classNames('nds-card__header nds-grid', props.className)}>
    <header
      className={classNames(
        'nds-media nds-media_center nds-has-flexi-truncate',
        props.search ? 'nds-size_1-of-3' : null
      )}
    >
      {props.symbol ? (
        <div className="nds-media__figure">
          <span
            className={'nds-icon_container nds-icon-standard-' + props.symbol}
            title="description of icon when needed"
          >
            <SvgIcon
              className="nds-icon nds-icon_small"
              sprite="standard"
              symbol={props.symbol}
            />
          </span>
        </div>
      ) : null}
      <div className="nds-media__body">
        <h2>
          <a
            href="javascript:void(0);"
            className="nds-card__header-link nds-truncate"
            title={props.children}
          >
            {props.children}
          </a>
        </h2>
      </div>
    </header>
    {props.search ? headerSearch : null}
    <div
      className={classNames(
        'nds-no-flex',
        props.search ? 'nds-size_1-of-3' : null
      )}
    >
      {props.actions == 'overflow' ? (
        <ButtonIcon
          className="nds-button_icon-border-filled nds-button_icon-x-small"
          symbol="down"
          title="More Options"
          assistiveText="More Options"
          aria-haspopup="true"
        />
      ) : (
        headerAction
      )}
    </div>
  </div>
);

export let CardBody = props => (
  <div className={classNames('nds-card__body', props.className)}>
    {props.children}
  </div>
);

export let CardFooter = props => (
  <footer className={classNames('nds-card__footer', props.className)}>
    {props.children}
  </footer>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default (
  <Card>
    <CardHeader symbol="contact" actions>
      <span className="nds-text-heading_small">Card Header</span>
    </CardHeader>
    <CardBody className="nds-card__body_inner">
      Card Body (custom goes in here)
    </CardBody>
    <CardFooter>Card Footer</CardFooter>
  </Card>
);
