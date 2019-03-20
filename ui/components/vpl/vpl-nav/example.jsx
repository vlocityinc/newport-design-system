// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

export let VplNav = props => (
  <div className="nds-subnav__wrapper">
    <div className="nds-grid nds-subnav__inner cards-container nds-grid_vertical-stretch np-subnav-dropdown">
      <a className="nds-subnav__theme nds-subnav__overview-card">
        <section className="nds-subnav__active nds-subnav__overview nds-subnav__tabSelected">
          <div className="nds-subnav__cardtop nds-text-align_center">
            <div className="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
              <img src="/assets/images/VPL/speedometer.svg" />
            </div>
            <div className="nds-subnav__cardValues">
              <h2>Overview</h2>
            </div>
          </div>
        </section>
      </a>
      <div className="nds-subnav__fullWidth nds-scrollable_x">
        <div className="nds-grid">
          <div className="nds-subnav__theme">
            <section className="nds-subnav__active nds-subnav__tabNotSelected">
              <div className="nds-text-align_center">
                <div className="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                  <img src="/assets/images/VPL/auto.svg" />
                </div>
                <div className="nds-subnav__cardValues">
                  <h2>Add Auto Policy</h2>
                </div>
              </div>
            </section>
          </div>
          <div className="nds-subnav__theme">
            <section className="nds-subnav__active nds-subnav__tabNotSelected">
              <div className="nds-text-align_center">
                <div className="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                  <img src="/assets/images/VPL/owned.svg" />
                </div>
                <div className="nds-subnav__cardValues">
                  <h2>Add Business Owners Policy</h2>
                </div>
              </div>
            </section>
          </div>
          <div className="nds-subnav__theme">
            <section className="nds-subnav__active nds-subnav__tabNotSelected">
              <div className="nds-text-align_center">
                <div className="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                  <img src="/assets/images/VPL/rent.svg" />
                </div>
                <div className="nds-subnav__cardValues">
                  <h2>Add Renters Policy</h2>
                </div>
              </div>
            </section>
          </div>
          <div className="nds-subnav__theme">
            <section className="nds-subnav__active nds-subnav__tabNotSelected">
              <div className="nds-text-align_center">
                <div className="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                  <img src="/assets/images/VPL/general_insurance.svg" />
                </div>
                <div className="nds-subnav__cardValues">
                  <h2>Add Pet Policy</h2>
                </div>
              </div>
            </section>
          </div>
          <div className="nds-subnav__theme">
            <section className="nds-subnav__active nds-subnav__tabNotSelected">
              <div className="nds-text-align_center">
                <div className="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                  <img src="/assets/images/VPL/life-policy.svg" />
                </div>
                <div className="nds-subnav__cardValues">
                  <h2>Add Boat Owners</h2>
                </div>
              </div>
            </section>
          </div>
          <div className="nds-subnav__theme">
            <section className="nds-subnav__active nds-subnav__tabNotSelected">
              <div className="nds-text-align_center">
                <div className="nds-subnav__image nds-m-bottom--x-small nds-grid nds-grid--vertical-align-center">
                  <img src="/assets/images/VPL/home.svg" />
                </div>
                <div className="nds-subnav__cardValues">
                  <h2>Add Home Owners</h2>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/// ////////////////////////////////////////
// Export
/// ////////////////////////////////////////

export default <VplNav />;
