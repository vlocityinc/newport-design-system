// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import { Avatar } from '../../avatar/base/example';
import { Pill } from '../../pills/base/example';
import { ButtonIcon } from '../../button-icons/base/example';
import { Menu, MenuList, MenuItem } from '../../menus/dropdown/example';
import { Modal, ModalContent } from '../../modals/base/example';
import {
  RichTextEditor,
  RteToolbar,
  RteFormatFont,
  RteFormatText,
  RteFormatColor,
  RteFormatBody,
  RteAlignText,
  RteInsertContent,
  RteTextarea,
  RteClearFormatting
} from '../../rich-text-editor/base/example';
import { FormElement } from '../../form-element/base/example';
import { Input } from '../../input/base/example';
import {
  ComboboxContainer,
  Listbox,
  ListboxItem,
  EntityOption
} from '../../combobox/base/example';
import { ListboxPill } from '../../pills/listbox-of-pill-options/example';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

const dialogHeadingId = 'modal-heading-id-1';
const dialogBodyId = 'modal-content-id-1';

const composers = [
  {
    entity: 'email',
    title: 'Agenda for next week'
  },
  {
    entity: 'call',
    title: 'Lei Chan'
  },
  {
    entity: 'task',
    title: 'August 14 Meeting Notes'
  }
];

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

const Footer = props => (
  <div className="nds-col_bump-left nds-text-align_right">
    <button className="nds-button nds-button_brand">Action</button>
  </div>
);

const EmailFooter = props => (
  <div className="nds-col_bump-left nds-grid nds-grid_vertical-align-center">
    <div className="nds-grid nds-m-right_small" role="toolbar">
      <ul className="nds-grid" aria-label="Insert content">
        <li>
          <ButtonIcon
            className="nds-button_icon-small"
            symbol="link"
            assistiveText="Attach File"
            title="Attach File"
          />
        </li>
        <li>
          <ButtonIcon
            className="nds-button_icon-small"
            symbol="insert_template"
            assistiveText="Insert Template"
            title="Insert Template"
            tabIndex="-1"
          />
        </li>
        <li>
          <ButtonIcon
            className="nds-button_icon-small"
            symbol="insert_tag_field"
            assistiveText="Insert HTML"
            title="Insert HTML"
            tabIndex="-1"
          />
        </li>
      </ul>
      <ButtonIcon
        className="nds-button_icon-small"
        symbol="preview"
        assistiveText="Preview"
        title="Preview"
        tabIndex="-1"
      />
    </div>
    <button className="nds-button nds-button_brand">Send</button>
  </div>
);

export let DockedComposerPanel = props => (
  <section
    className={classNames(
      'nds-docked-composer nds-grid nds-grid_vertical',
      props.className,
      props.dialogClosed ? 'nds-is-closed' : null
    )}
    role={!props.nestedDialog ? 'dialog' : null}
    aria-labelledby={!props.nestedDialog ? dialogHeadingId : null}
    aria-describedby={!props.nestedDialog ? dialogBodyId : null}
  >
    <header
      className="nds-docked-composer__header nds-grid nds-shrink-none"
      aria-live="assertive"
    >
      <div className="nds-media nds-media_center nds-no-space">
        <div className="nds-media__figure nds-m-right_x-small">
          <span className="nds-icon_container">
            <SvgIcon
              className="nds-icon nds-icon_small nds-icon-text-default"
              sprite="standard"
              symbol={props.headerSymbol || 'call'}
            />
          </span>
        </div>
        <div className="nds-media__body">
          {props.dialogClosed ? (
            <span className="nds-assistive-text">Minimized</span>
          ) : null}
          <h2
            className="nds-truncate"
            id={dialogHeadingId}
            title={props.header || 'Header'}
          >
            {props.header || 'Header'}
          </h2>
        </div>
      </div>
      <div className="nds-col_bump-left nds-shrink-none">
        <ButtonIcon
          className="nds-button_icon"
          symbol="minimize_window"
          assistiveText="Minimize Composer Panel"
          title="Minimize window"
        />
        <ButtonIcon
          className="nds-button_icon"
          symbol="expand_alt"
          assistiveText="Expand Composer Panel"
          title="Expand Composer"
        />
        <ButtonIcon
          className="nds-button_icon"
          symbol="close"
          assistiveText="Close Composer Panel"
          title="Close"
        />
      </div>
    </header>
    <div
      className={classNames('nds-docked-composer__body', props.bodyClassName)}
      id={dialogBodyId}
    >
      {props.children}
    </div>
    {props.footer ? (
      <footer
        className={classNames(
          'nds-docked-composer__footer nds-shrink-none',
          props.footerClassName
        )}
      >
        {props.footer}
      </footer>
    ) : null}
  </section>
);

let ComposerOverflowMenu = props => (
  <div className="nds-docked-composer nds-docked-composer_overflow">
    <button
      className="nds-button nds-button_icon nds-docked-composer_overflow__button"
      aria-haspopup="true"
    >
      <SvgIcon
        className="nds-button__icon"
        sprite="utility"
        symbol="standard_objects"
      />
      <span className="nds-text-body_small nds-m-left_xx-small">
        3{' '}
        <span className="nds-assistive-text">other docked composer panels</span>
      </span>
    </button>

    <Menu className="nds-dropdown_left nds-dropdown_bottom nds-dropdown_medium nds-nubbin_bottom-left">
      <MenuList className="nds-dropdown_length-with-icon-7">
        {_.times(composers.length, i => (
          <MenuItem key={i}>
            <span
              className={
                'nds-icon_container nds-icon-standard-' +
                composers[i].entity +
                ' nds-m-right_x-small'
              }
            >
              <SvgIcon
                className="nds-icon nds-icon_small"
                sprite="standard"
                symbol={composers[i].entity}
              />
              <span className="nds-assistive-text">{composers[i].entity}</span>
            </span>
            {composers[i].title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  </div>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export const Context = props => (
  <div style={{ height: '500px', minWidth: '615px', overflowX: 'auto' }}>
    {props.children}
  </div>
);

export default (
  <div className="nds-docked_container">
    <DockedComposerPanel className="nds-is-open" footer={<Footer />}>
      <div className="nds-align_absolute-center">
        Docked Composer Panel Body <br /> This area consumes the feature
      </div>
    </DockedComposerPanel>
  </div>
);

export let states = [
  {
    id: 'single-composer-open',
    label: 'Open',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel className="nds-is-open" footer={<Footer />}>
          <div className="nds-align_absolute-center">
            Docked Composer Panel Body <br /> This area consumes the feature
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'single-composer-focused',
    label: 'Focused',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open nds-has-focus"
          footer={<Footer />}
        >
          <div className="nds-align_absolute-center">
            Docked Composer Panel Body <br /> This area consumes the feature
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'single-composer-closed',
    label: 'Closed',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel dialogClosed footer={<Footer />}>
          <div className="nds-align_absolute-center">
            Docked Composer Panel Body <br /> This area consumes the feature
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'single-composer-closed-focused',
    label: 'Closed Focused',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-has-focus"
          dialogClosed
          footer={<Footer />}
        >
          <div className="nds-align_absolute-center">
            Docked Composer Panel Body <br /> This area consumes the feature
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'single-composer-popout',
    label: 'Popout',
    element: (
      <div>
        <Modal
          className="nds-docked-composer-modal"
          aria-labelledby={dialogHeadingId}
          aria-describedby={dialogBodyId}
        >
          <ModalContent>
            <DockedComposerPanel footer={<Footer />} nestedDialog>
              <div className="nds-align_absolute-center">
                Docked Composer Panel Body <br /> This area consumes the feature
              </div>
            </DockedComposerPanel>
          </ModalContent>
        </Modal>
        <div className="nds-backdrop nds-backdrop_open" />
      </div>
    )
  },
  {
    id: 'multiple-composer-overflow',
    label: 'With Overflow Menu',
    element: (
      <div className="nds-docked_container">
        <ComposerOverflowMenu />
        <DockedComposerPanel className="nds-is-open" footer={<Footer />}>
          <div className="nds-align_absolute-center">
            Docked Composer Panel Body <br /> This area consumes the feature
          </div>
        </DockedComposerPanel>
      </div>
    )
  }
];

export let examples = [
  {
    id: 'task',
    label: 'Log a Task',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-docked-composer__body_form"
          header="New Task"
          headerSymbol="task"
          footer={
            <button className="nds-button nds-button_brand nds-col_bump-left">
              Save
            </button>
          }
        >
          <fieldset className="nds-form nds-form_compound">
            <legend className="nds-assistive-text">Log new task</legend>
            <div className="form-element__group">
              <div className="nds-form-element__row">
                <div className="nds-form-element nds-size_1-of-1">
                  <label
                    className="nds-form-element__label"
                    htmlFor="text-input-01"
                  >
                    Subject
                  </label>
                  <div className="nds-form-element__control">
                    <input
                      className="nds-input"
                      type="text"
                      id="text-input-01"
                    />
                  </div>
                </div>
              </div>
              <div className="nds-form-element__row">
                <div className="nds-form-element nds-size_1-of-2">
                  <label
                    className="nds-form-element__label"
                    htmlFor="text-input-02"
                  >
                    Assigned To
                  </label>
                  <div className="nds-form-element__control">
                    <input
                      className="nds-input"
                      type="text"
                      id="text-input-02"
                    />
                  </div>
                </div>
                <div className="nds-form-element nds-size_1-of-2">
                  <label
                    className="nds-form-element__label"
                    htmlFor="text-input-03"
                  >
                    Due Dates
                  </label>
                  <div className="nds-form-element__control">
                    <input
                      className="nds-input"
                      type="text"
                      id="text-input-03"
                    />
                  </div>
                </div>
              </div>
              <div className="nds-form-element__row">
                <ComboboxContainer
                  formClassName="nds-size_1-of-2"
                  autocomplete
                  label="Name"
                  placeholder="Search Leads"
                  inputIcon="right"
                  inputIconRightSymbol="search"
                  objectSwitcher
                  objectSwitcherInline
                />
                <ComboboxContainer
                  formClassName="nds-size_1-of-2"
                  autocomplete
                  label="Name"
                  placeholder="Search Accounts"
                  inputIcon="right"
                  inputIconRightSymbol="search"
                  objectSwitcher
                  objectSwitcherInline
                />
              </div>
            </div>
          </fieldset>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-queued',
    label: 'Voice - Queued',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-align_absolute-center"
          header="Lei Chan - Connecting..."
          footer={
            <button className="nds-button nds-button_destructive nds-size_1-of-1">
              End Call
            </button>
          }
        >
          <div className="nds-text-align_center nds-align-middle">
            <span className="nds-avatar nds-avatar_large">
              <img
                alt=""
                src="/assets/images/avatar2.jpg"
                title="Lei Chan avatar"
              />
            </span>
            <h3 className="nds-text-heading_large">Lei Chan</h3>
            <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
              <li className="nds-item">VP of Sales</li>
              <li className="nds-item ">Acme Corporation</li>
            </ul>
            <p className="nds-text-heading_medium nds-m-top_medium">
              Connecting...
            </p>
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-ringing',
    label: 'Voice - Ringing',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-align_absolute-center"
          header="Lei Chan - Dialing..."
          footer={
            <button className="nds-button nds-button_destructive nds-size_1-of-1">
              End Call
            </button>
          }
        >
          <div className="nds-text-align_center nds-align-middle">
            <span className="nds-avatar nds-avatar_large">
              <img
                alt=""
                src="/assets/images/avatar2.jpg"
                title="Lei Chan avatar"
              />
            </span>
            <h3 className="nds-text-heading_large">Lei Chan</h3>
            <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
              <li className="nds-item">VP of Sales</li>
              <li className="nds-item ">Acme Corporation</li>
            </ul>
            <p className="nds-text-heading_medium nds-m-top_medium">
              Dialing...
            </p>
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-connected',
    label: 'Voice - Connected',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          header="Lei Chan - Call in Progress"
          footer={
            <button className="nds-button nds-button_destructive nds-col_bump-left">
              End Call
            </button>
          }
        >
          <div className="nds-docked-composer__lead">
            <div className="nds-media">
              <div className="nds-media__figure">
                <span className="nds-avatar nds-avatar_medium">
                  <img
                    alt=""
                    src="/assets/images/avatar2.jpg"
                    title="Lei Chan avatar"
                  />
                </span>
              </div>
              <div className="nds-media__body">
                <p className="nds-text-heading_medium">Lei Chan</p>
                <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
                  <li className="nds-item">VP of Sales</li>
                  <li className="nds-item ">Acme Corporation</li>
                </ul>
              </div>
            </div>
            <p className="nds-col_bump-left nds-text-heading_large">5:37</p>
          </div>
          <div className="nds-docked-composer__toolbar">
            <ButtonIcon
              className="nds-button_icon-border-filled nds-button_icon-small"
              symbol="unmuted"
              assistiveText="Mute Yourself"
              title="Mute Yourself"
              aria-pressed="false"
            />
          </div>
          <label className="nds-assistive-text" htmlFor="composer-text-input-1">
            Take notes
          </label>
          <textarea
            id="composer-text-input-1"
            className="nds-docked-composer__input nds-input_bare nds-text-longform nds-grow"
            placeholder="Jot down notes here..."
          />
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-cancelled',
    label: 'Voice - Cancelled',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-align_absolute-center"
          header="Lei Chan - Cancelling..."
        >
          <div className="nds-text-align_center nds-align-middle">
            <span className="nds-avatar nds-avatar_large">
              <img
                alt=""
                src="/assets/images/avatar2.jpg"
                title="Lei Chan avatar"
              />
            </span>
            <h3 className="nds-text-heading_large">Lei Chan</h3>
            <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
              <li className="nds-item">VP of Sales</li>
              <li className="nds-item ">Acme Corporation</li>
            </ul>
            <p className="nds-text-heading_medium nds-m-top_medium">
              Cancelling...
            </p>
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-busy',
    label: 'Voice - Busy',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-align_absolute-center"
          header="Lei Chan - Busy"
          footer={[
            <button
              className="nds-button nds-button_neutral nds-size_1-of-2"
              key={_.uniqueId('follow-up-')}
            >
              Follow-Up Later
            </button>,
            <button
              className="nds-button nds-button_brand nds-size_1-of-2"
              key={_.uniqueId('call-again-')}
            >
              Call Again
            </button>
          ]}
        >
          <div className="nds-text-align_center nds-align-middle">
            <span className="nds-avatar nds-avatar_large">
              <img
                alt=""
                src="/assets/images/avatar2.jpg"
                title="Lei Chan avatar"
              />
            </span>
            <h3 className="nds-text-heading_large">Lei Chan</h3>
            <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
              <li className="nds-item">VP of Sales</li>
              <li className="nds-item ">Acme Corporation</li>
            </ul>
            <p className="nds-text-heading_medium nds-m-top_medium">Busy</p>
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-failed',
    label: 'Voice - Call Failed',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-align_absolute-center"
          header="Lei Chan - Call Failed"
          footer={[
            <button
              className="nds-button nds-button_neutral nds-size_1-of-2"
              key={_.uniqueId('follow-up-')}
            >
              Edit Phone Number
            </button>,
            <button
              className="nds-button nds-button_brand nds-size_1-of-2"
              key={_.uniqueId('call-again-')}
            >
              Call Again
            </button>
          ]}
        >
          <div className="nds-text-align_center nds-align-middle">
            <span className="nds-avatar nds-avatar_large">
              <img
                alt=""
                src="/assets/images/avatar2.jpg"
                title="Lei Chan avatar"
              />
            </span>
            <h3 className="nds-text-heading_large">Lei Chan</h3>
            <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
              <li className="nds-item">VP of Sales</li>
              <li className="nds-item ">Acme Corporation</li>
            </ul>
            <p className="nds-text-heading_medium nds-m-top_medium">
              Call Failed
            </p>
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-no-answer',
    label: 'Voice - No Answer',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-align_absolute-center"
          header="Lei Chan - No Answer"
          footer={[
            <button
              className="nds-button nds-button_neutral nds-size_1-of-2"
              key={_.uniqueId('follow-up-')}
            >
              Follow-Up Later
            </button>,
            <button
              className="nds-button nds-button_brand nds-size_1-of-2"
              key={_.uniqueId('call-again-')}
            >
              Call Again
            </button>
          ]}
        >
          <div className="nds-text-align_center nds-align-middle">
            <span className="nds-avatar nds-avatar_large">
              <img
                alt=""
                src="/assets/images/avatar2.jpg"
                title="Lei Chan avatar"
              />
            </span>
            <h3 className="nds-text-heading_large">Lei Chan</h3>
            <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
              <li className="nds-item">VP of Sales</li>
              <li className="nds-item ">Acme Corporation</li>
            </ul>
            <p className="nds-text-heading_medium nds-m-top_medium">
              No Answer
            </p>
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-call-finished',
    label: 'Voice - Call Finished',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          header="Lei Chan - Call Finished"
          footer={
            <button className="nds-button nds-button_brand nds-col_bump-left">
              Finish Notes
            </button>
          }
        >
          <div className="nds-docked-composer__lead">
            <div className="nds-media">
              <div className="nds-media__figure">
                <span className="nds-avatar nds-avatar_medium">
                  <img
                    alt=""
                    src="/assets/images/avatar2.jpg"
                    title="Lei Chan avatar"
                  />
                </span>
              </div>
              <div className="nds-media__body">
                <p className="nds-text-heading_medium">Lei Chan</p>
                <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
                  <li className="nds-item">VP of Sales</li>
                  <li className="nds-item ">Acme Corporation</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="nds-docked-composer__toolbar">
            <ButtonIcon
              className="nds-button_icon-border-filled nds-button_icon-small"
              symbol="unmuted"
              assistiveText="Mute Yourself"
              title="Mute Yourself"
              aria-pressed="false"
            />
          </div>
          <label className="nds-assistive-text" htmlFor="composer-text-input-1">
            Take notes
          </label>
          <textarea
            id="composer-text-input-1"
            className="nds-docked-composer__input nds-input_bare nds-text-longform nds-grow"
            placeholder="Jot down notes here..."
          />
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-call-incoming',
    label: 'Voice - Call Incoming',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-align_absolute-center nds-size_1-of-1"
          header="Lei Chan - Incoming Call..."
          footer={
            <button className="nds-button nds-button_brand nds-col_bump-left">
              Finish Notes
            </button>
          }
        >
          <div className="nds-text-align_center nds-align-middle">
            <span className="nds-avatar nds-avatar_large">
              <img
                alt=""
                src="/assets/images/avatar2.jpg"
                title="Lei Chan avatar"
              />
            </span>
            <h3 className="nds-text-heading_large">Lei Chan</h3>
            <ul className="nds-list_horizontal nds-has-dividers_right nds-text-body_small">
              <li className="nds-item">VP of Sales</li>
              <li className="nds-item ">Acme Corporation</li>
            </ul>
            <p className="nds-text-heading_medium nds-m-top_medium">
              (416) 555-1234
            </p>
          </div>
          <div className="nds-p-horizontal_x-small nds-text-align_left nds-size_1-of-1">
            <h3 className="nds-m-bottom_x-small">Recent Activity</h3>
            <ul className="nds-has-dividers_around-space">
              <li className="nds-item nds-theme_shade nds-grid">
                <span className="nds-icon_container nds-icon-standard-task nds-m-right_x-small">
                  <SvgIcon
                    className="nds-icon nds-icon_small"
                    sprite="standard"
                    symbol="task"
                  />
                  <span className="nds-assistive-text">Task</span>
                </span>
                Discussed New Pricing Models
                <span className="nds-col_bump-left">Yesterday</span>
              </li>
              <li className="nds-item nds-theme_shade nds-grid">
                <span className="nds-icon_container nds-icon-standard-email nds-m-right_x-small">
                  <SvgIcon
                    className="nds-icon nds-icon_small"
                    sprite="standard"
                    symbol="email"
                  />
                  <span className="nds-assistive-text">Email</span>
                </span>
                Re: Updated Proposals
                <span className="nds-col_bump-left">4 Hours Ago</span>
              </li>
              <li className="nds-item nds-theme_shade nds-grid">
                <span className="nds-icon_container nds-icon-standard-note nds-m-right_x-small">
                  <SvgIcon
                    className="nds-icon nds-icon_small"
                    sprite="standard"
                    symbol="note"
                  />
                  <span className="nds-assistive-text">Note</span>
                </span>
                Discuss Slides for Nov EBC
                <span className="nds-col_bump-left">2 Days Ago</span>
              </li>
            </ul>
          </div>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'voice-composer-call-logged',
    label: 'Voice - Log a Call',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          bodyClassName="nds-docked-composer__body_form"
          header="Lei Chan"
          footer={
            <button className="nds-button nds-button_brand nds-col_bump-left">
              Save
            </button>
          }
        >
          <fieldset className="nds-form nds-form_compound">
            <legend className="nds-assistive-text">Log a call</legend>
            <div className="form-element__group">
              <div className="nds-form-element__row">
                <div className="nds-form-element nds-size_1-of-1">
                  <label
                    className="nds-form-element__label"
                    htmlFor="text-input-01"
                  >
                    Subject
                  </label>
                  <div className="nds-form-element__control">
                    <input
                      className="nds-input"
                      type="text"
                      id="text-input-01"
                    />
                  </div>
                </div>
              </div>
              <div className="nds-form-element__row">
                <div className="nds-form-element nds-size_1-of-1">
                  <label
                    className="nds-form-element__label"
                    htmlFor="textarea-input-01"
                  >
                    Comments
                  </label>
                  <div className="nds-form-element__control">
                    <textarea className="nds-textarea" id="textarea-input-01" />
                  </div>
                </div>
              </div>
              <div className="nds-form-element__row">
                <ComboboxContainer
                  formClassName="nds-size_1-of-2"
                  autocomplete
                  label="Name"
                  placeholder="Search Leads"
                  inputIcon="right"
                  inputIconRightSymbol="search"
                  objectSwitcher
                  objectSwitcherInline
                />
                <ComboboxContainer
                  formClassName="nds-size_1-of-2"
                  autocomplete
                  label="Name"
                  placeholder="Search Accounts"
                  inputIcon="right"
                  inputIconRightSymbol="search"
                  objectSwitcher
                  objectSwitcherInline
                />
              </div>
            </div>
          </fieldset>
        </DockedComposerPanel>
      </div>
    )
  },
  {
    id: 'email',
    label: 'Email Composer',
    element: (
      <div className="nds-docked_container">
        <DockedComposerPanel
          className="nds-is-open"
          header="New Email"
          headerSymbol="email"
          footer={<EmailFooter />}
        >
          <div className="nds-email-composer">
            <ComboboxContainer
              id="recipients-to"
              formClassName="nds-email-composer__combobox"
              aria-controls="selected-recipients-to"
              selectedOptionsInline
              staticListbox
              label="To"
              placeholder=" "
              autocomplete
            >
              <Listbox
                id="selected-recipients-to"
                aria-label="Recipients:"
                inline
              >
                <ListboxItem>
                  <ListboxPill label="jrogers@cloudhub.com" tabIndex="0">
                    <Avatar className="nds-avatar_x-small nds-pill__icon_container">
                      <img
                        alt="Person name"
                        src="/assets/images/avatar2.jpg"
                        title="User avatar"
                      />
                    </Avatar>
                  </ListboxPill>
                </ListboxItem>
              </Listbox>
            </ComboboxContainer>
            <ComboboxContainer
              id="recipients-bcc"
              formClassName="nds-email-composer__combobox"
              selectedOptionsInline
              staticListbox
              label="Bcc"
              placeholder=" "
              autocomplete
            />
            <ComboboxContainer
              id="recipients-cc"
              formClassName="nds-email-composer__combobox"
              selectedOptionsInline
              staticListbox
              label="Cc"
              placeholder=" "
              autocomplete
            />
            <FormElement
              label="Enter subject"
              hideLabel
              inputId="input-subject-01"
            >
              <Input
                id="input-subject-01"
                className="nds-input_bare"
                placeholder="Enter Subject"
              />
            </FormElement>
            <RichTextEditor>
              <RteToolbar>
                <RteFormatFont />
                <RteFormatText tabIndexSetting="-1" />
                <RteFormatColor />
                <RteFormatBody />
                <RteAlignText />
                <RteInsertContent />
                <RteClearFormatting />
              </RteToolbar>

              <RteTextarea placeholder="Compose Email..." />
            </RichTextEditor>
          </div>
        </DockedComposerPanel>
      </div>
    )
  }
];
