// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import { ButtonIcon } from '../../button-icons/base/example';
import { Trigger } from '../../menus/dropdown/example';
import { GlobalHeader } from '../base/example';
import { Avatar } from '../../avatar/base/example';
import classNames from 'classnames';

/// ///////////////////////////////////////////
// Partials
/// //////////////////////////////////////////

const MoreIcon = (
  <ButtonIcon
    className="nds-button_icon-border-filled nds-button_icon-x-small"
    sprite="utility"
    symbol="down"
    assistiveText="Show More"
    title="Show More"
    aria-haspopup="true"
  />
);

let TriggerButton = props => (
  <Trigger className="nds-is-open" triggerIcon={MoreIcon}>
    {props.children}
  </Trigger>
);

let UnreadIcon = props => (
  <div className="nds-align-middle">
    <abbr className="nds-required nds-text-link" title="unread">
      ●
    </abbr>
  </div>
);

let NotificationItem = props => (
  <li
    className={classNames(
      'nds-global-header__notification nds-p-around_xx-small',
      props.className
    )}
  >
    <div className="nds-media nds-has-flexi-truncate nds-p-around_x-small">
      <div className="nds-media__figure">
        <Avatar className="nds-avatar_small nds-avatar_circle">
          <img
            alt={props.username}
            src="/assets/images/avatar3.jpg"
            title={`${props.username} avatar`}
          />
        </Avatar>
      </div>
      <div className="nds-media__body">
        <div className="nds-grid nds-grid_align-spread">
          <a
            href="javascript:void(0);"
            className="nds-text-link_reset nds-has-flexi-truncate"
          >
            <h3
              className="nds-truncate"
              title={`${props.username} ${props.messageTitle}`}
            >
              <strong>{`${props.username} ${props.messageTitle}`}</strong>
            </h3>
            <p className="nds-truncate" title={props.message}>
              {props.message}
            </p>
            <p className="nds-m-top_x-small nds-text-color_weak">
              {props.messageTime}
            </p>
          </a>
          <div className="nds-no-flex nds-grid nds-grid_vertical">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  </li>
);

let PopoverMenu = props => (
  <section
    className="nds-popover nds-popover_large nds-nubbin_top-right"
    role="dialog"
    aria-label="Notifications"
    aria-describedby="notifications-container"
    style={{ position: 'absolute', right: '3.125rem' }}
  >
    <div
      id="notifications-container"
      className="nds-popover__body nds-p-around_none"
    >
      <ul>{props.children}</ul>
    </div>
  </section>
);

/// ///////////////////////////////////////////
// Export
/// //////////////////////////////////////////

export default (
  <div className="demo-only" style={{ height: '28.571rem' }}>
    <GlobalHeader popoverMenu>
      <PopoverMenu>
        <NotificationItem
          className="nds-global-header__notification_unread"
          messageTitle="mentioned you in a comment:"
          message="I need you to review this for me @Paulina"
          messageTime="10m ago"
          username="Kelly Chan"
        >
          <TriggerButton />
          <UnreadIcon />
        </NotificationItem>
        <NotificationItem
          messageTitle="mentioned you in a comment:"
          message="I need you to review this for me @Paulina"
          messageTime="10m ago"
          username="Kelly Chan"
        >
          <TriggerButton />
        </NotificationItem>
        <NotificationItem
          messageTitle="mentioned you in a comment:"
          message="I need you to review this for me @Paulina"
          messageTime="10m ago"
          username="Kelly Chan"
        >
          <TriggerButton />
        </NotificationItem>
      </PopoverMenu>
    </GlobalHeader>
  </div>
);
