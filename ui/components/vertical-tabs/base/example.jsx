// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import classNames from 'classnames';

class VerticalTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTabIndex: 0
    };
  }

  render() {
    const { currentTabIndex } = this.state;

    return (
      <div className="nds-vertical-tabs">
        <ul
          className="nds-vertical-tabs__nav"
          role="tablist"
          aria-orientation="vertical"
        >
          {this.props.tabs.map((tab, index) => {
            const isActive = index === currentTabIndex ? 'nds-is-active' : '';
            const tabIndex = index === currentTabIndex ? 0 : -1;
            const isAriaSelected = index === currentTabIndex ? 'true' : 'false';
            const ariaControlId = `nds-vertical-tabs-${index}`;
            const tabNavId = `nds-vertical-tabs-${index}__nav`;

            return (
              <li
                className={classNames('nds-vertical-tabs__nav-item', isActive)}
                title={tab.label}
                role="presentation"
                key={tabNavId}
              >
                <a
                  className="nds-vertical-tabs__link"
                  href="javascript:void(0)"
                  role="tab"
                  tabIndex={tabIndex}
                  aria-selected={isAriaSelected}
                  aria-controls={ariaControlId}
                  id={tabNavId}
                  onClick={this.handleTabClick}
                >
                  {tab.label}
                </a>
              </li>
            );
          })}
        </ul>

        {this.props.tabs.map((tab, index) => {
          const tabContentId = `nds-vertical-tabs-${index}`;
          const showHideClass =
            index === currentTabIndex ? 'nds-show' : 'nds-hide';
          const ariaLabelledBy = `nds-vertical-tabs-${index}__nav`;

          return (
            <div
              className={classNames(
                'nds-vertical-tabs__content',
                showHideClass
              )}
              id={tabContentId}
              role="tabpanel"
              aria-labelledby={ariaLabelledBy}
              key={tabContentId}
            >
              {this.props.tabs[currentTabIndex].content}
            </div>
          );
        })}
      </div>
    );
  }
}

let exampleTabs = [
  {
    label: 'Tab 1',
    content: (
      <div className="nds-text-longform">
        <h3 className="nds-text-heading_medium">Tab Title</h3>
        <p>Content for Tab 1</p>
        <p>Lorem ipsum dolor...</p>
        <p>Lorem ipsum dolor...</p>
      </div>
    )
  },
  {
    label: 'Tab 2',
    content: (
      <div className="nds-text-longform">
        <p>Content for Tab 2</p>
      </div>
    )
  },
  {
    label: 'Tab 3 has a really long label and can wrap or truncate',
    content: (
      <div className="nds-text-longform">
        <p>Content for Tab 3</p>
      </div>
    )
  }
];

export default <VerticalTabs tabs={exampleTabs} />;
