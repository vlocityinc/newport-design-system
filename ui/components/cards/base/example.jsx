// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { Menu, MenuList, MenuItem } from '../../menus/dropdown/example';
import { ButtonIcon } from '../../button-icons/base/example';
import { TileMedia } from '../../tiles/base/example';
import { StandardIcon } from '../../icons/standard/example';
import classNames from 'classnames';

const headerActionOverflow = (
  <button
    className="nds-button nds-button_icon-border-filled nds-button_icon-x-small"
    aria-haspopup="true"
  >
    <SvgIcon className="nds-button__icon" sprite="utility" symbol="down" />
    <span className="nds-assistive-text">More Options</span>
  </button>
);

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
  <article className={classNames('nds-card', props.className)}>
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

export let states = [
  {
    id: 'empty',
    label: 'Empty',
    element: (
      <Card>
        <CardHeader symbol="contact" actions>
          <span className="nds-text-heading_small">Card Header</span>
        </CardHeader>
        <CardBody />
        <CardFooter />
      </Card>
    )
  }
];

export let examples = [
  {
    id: 'related-list-table',
    label: 'With data-table',
    element: (
      <Card>
        <CardHeader symbol="contact" actions>
          <span className="nds-text-heading_small">Contacts (1)</span>
        </CardHeader>
        <CardBody>
          <table className="nds-table nds-table_fixed-layout nds-table_bordered nds-no-row-hover nds-table_cell-buffer">
            <thead>
              <tr className="nds-text-title_caps">
                <th scope="col">
                  <div className="nds-truncate" title="Name">
                    Name
                  </div>
                </th>
                <th scope="col">
                  <div className="nds-truncate" title="Company">
                    Company
                  </div>
                </th>
                <th scope="col">
                  <div className="nds-truncate" title="Title">
                    Title
                  </div>
                </th>
                <th scope="col">
                  <div className="nds-truncate" title="Email">
                    Email
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="nds-hint-parent">
                <th scope="row">
                  <div className="nds-truncate" title="Adam Choi">
                    <a href="javascript:void(0);">Adam Choi</a>
                  </div>
                </th>
                <td>
                  <div className="nds-truncate" title="Company One">
                    Company One
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="Director of Operations">
                    Director of Operations
                  </div>
                </td>
                <td>
                  <div className="nds-truncate" title="adam@company.com">
                    adam@company.com
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardBody>
        <CardFooter>
          <a href="javascript:void(0);">
            View All <span className="nds-assistive-text">entity type</span>
          </a>
        </CardFooter>
      </Card>
    )
  },
  {
    id: 'related-list-tiles',
    label: 'With tiles',
    element: (
      <Card>
        <CardHeader actions symbol="contact">
          <span className="nds-text-heading_small">Contacts (3)</span>
        </CardHeader>
        <CardBody>
          <ul className="nds-card__body_inner nds-grid nds-wrap nds-grid_pull-padded">
            <li className="nds-p-horizontal_small nds-size_1-of-1 nds-medium-size_1-of-3">
              <TileMedia
                actions
                className="nds-card__tile"
                media={
                  <StandardIcon
                    className="nds-icon_small"
                    symbol="contact"
                    assistiveText="Contact"
                  />
                }
                title="Related Record Title 1"
              />
            </li>
            <li className="nds-p-horizontal_small nds-size_1-of-1 nds-medium-size_1-of-3">
              <TileMedia
                actions
                className="nds-card__tile"
                media={
                  <StandardIcon
                    className="nds-icon_small"
                    symbol="contact"
                    assistiveText="Contact"
                  />
                }
                title="Related Record Title 1"
              />
            </li>
            <li className="nds-p-horizontal_small nds-size_1-of-1 nds-medium-size_1-of-3">
              <TileMedia
                actions
                className="nds-card__tile"
                media={
                  <StandardIcon
                    className="nds-icon_small"
                    symbol="contact"
                    assistiveText="Contact"
                  />
                }
                title="Related Record Title 1"
              />
            </li>
          </ul>
        </CardBody>
        <CardFooter>
          <a href="javascript:void(0);">
            View All <span className="nds-assistive-text">entity type</span>
          </a>
        </CardFooter>
      </Card>
    )
  },
  {
    id: 'card-wrapper',
    label: 'Wrapped cards',
    element: (
      <div className="nds-card-wrapper">
        <Card>
          <CardHeader actions symbol="contact">
            <span className="nds-text-heading_small">Contacts (3)</span>
          </CardHeader>
          <CardBody>
            <Card>
              <CardBody>
                <p>
                  This is a card inside a card wrapper to show the lack of
                  styling when nested.
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p>
                  This is a card inside a card wrapper to show the lack of
                  styling when nested.
                </p>
              </CardBody>
            </Card>
          </CardBody>
          <CardFooter>
            <a href="javascript:void(0);">
              View All <span className="nds-assistive-text">entity type</span>
            </a>
          </CardFooter>
        </Card>
      </div>
    )
  }
];
