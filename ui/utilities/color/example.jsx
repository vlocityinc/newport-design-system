// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../shared/svg-icon';

const paletteKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export let examples = [
  {
    id: 'color-grays',
    label: 'Gray Palette',
    element: (
      <div>
        <h2 className="nds-text-heading_large nds-m-bottom_medium">
          Background Colors
        </h2>
        <div className="nds-m-bottom_large">
          {paletteKeys.map((key, index) => {
            const textClass = key > 8 ? 'nds-color__text_gray-1' : null;

            return (
              <div
                key={index}
                className={`nds-color__background_gray-${key} nds-p-around_medium`}
              >
                <p className={textClass}>.nds-color__background_gray-{key}</p>
              </div>
            );
          })}
        </div>

        <h2 className="nds-text-heading_large nds-m-bottom_medium">
          Text Colors
        </h2>
        <div className="nds-m-bottom_large">
          {paletteKeys.map((key, index) => (
            <div
              key={index}
              className="nds-grid nds-grid_vertical-align-center"
            >
              <div
                className={`nds-color__background_gray-${key}`}
                style={{
                  height: '3rem',
                  width: '3rem',
                  display: 'inline-block'
                }}
              />
              <p className="nds-p-left_small">.nds-color__text_gray-{key}</p>
            </div>
          ))}
        </div>

        <h2 className="nds-text-heading_large nds-m-bottom_medium">
          Border Colors
        </h2>
        <div className="nds-m-bottom_large">
          {paletteKeys.map((key, index) => (
            <div
              key={index}
              className={`nds-color__border_gray-${key} nds-p-around_medium nds-m-bottom_small`}
              style={{ 'border-width': '1px', 'border-style': 'solid' }}
            >
              .nds-color__border_gray-{key}
            </div>
          ))}
        </div>

        <h2 className="nds-text-heading_large nds-m-bottom_medium">
          SVG Fill Colors
        </h2>
        <div className="nds-m-bottom_large">
          {paletteKeys.map((key, index) => (
            <div key={index} className="nds-p-around_small">
              <SvgIcon
                className={`nds-color__fill_gray-${key} nds-icon_small`}
                sprite="action"
                symbol="check"
              />
              <span className="nds-p-left_small">
                .nds-color__fill_gray-{key}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
];
