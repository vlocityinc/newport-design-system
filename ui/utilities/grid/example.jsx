// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export const Context = props => (
  <div className="demo-only-grid">{props.children}</div>
);

export let examples = [
  {
    id: 'stretch',
    label: 'Column Stretch',
    element: (
      <div className="nds-grid">
        <div className="nds-col" />
        <div className="nds-col" />
      </div>
    ),
    description:
      'By default, the grid items within a `.nds-grid` do not stretch to take up that available white-space on the main axis. Apply `.nds-col` to a grid item, it will stretch across the main axis. The width of each grid item will be determined by the content within that region.'
  },
  {
    id: 'stretch-gutters',
    label: 'Column Stretch w/ Gutters',
    element: (
      <div className="nds-grid nds-grid_pull-padded-medium">
        <div className="nds-col nds-p-horizontal_medium" />
        <div className="nds-col nds-p-horizontal_medium" />
      </div>
    ),
    description:
      'To apply gutters between each grid item, the following spacing classes are available to add your intended gutters, `.nds-p-horizontal_small`, `.nds-p-horizontal_medium`, `.nds-p-horizontal_large`, `.nds-p-around_small`, `.nds-p-around_medium` and `.nds-p-around_large`. You may need to pull the grid items back to their original grid boundaries of the grid container, apply the classes `.nds-grid_pull-padded`, `.nds-grid_pull-padded-medium` or `.nds-grid_pull-padded-large` to the `.nds-grid`.'
  },
  {
    id: 'no-stretch',
    label: 'No Column Stretch',
    element: (
      <div className="nds-grid">
        <div />
        <div />
      </div>
    )
  },
  {
    id: 'no-stretch-gutters',
    label: 'No Column Stretch w/ Gutters',
    element: (
      <div className="nds-grid nds-grid_pull-padded-medium">
        <div className="nds-p-horizontal_medium" />
        <div className="nds-p-horizontal_medium" />
      </div>
    )
  },
  {
    id: 'regions-with-sizing',
    label: 'Manual Sizing',
    element: (
      <div className="nds-grid nds-wrap nds-grid_pull-padded">
        <div className="nds-p-horizontal_small nds-size_1-of-1" />
        <div className="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_5-of-6 nds-large-size_8-of-12" />
        <div className="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_1-of-6 nds-large-size_4-of-12" />
        <div className="nds-p-horizontal_small nds-size_1-of-1 nds-medium-size_1-of-2 nds-large-size_1-of-3" />
        <div className="nds-p-horizontal_small nds-size_1-of-1 nds-medium-size_1-of-2 nds-large-size_1-of-3" />
        <div className="nds-p-horizontal_small nds-size_1-of-1 nds-large-size_1-of-3">
          <div className="nds-grid nds-wrap nds-grid_pull-padded">
            <div className="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_1-of-1 nds-large-size_1-of-2" />
            <div className="nds-p-horizontal_small nds-size_1-of-2 nds-medium-size_1-of-1 nds-large-size_1-of-2" />
          </div>
        </div>
      </div>
    ),
    description:
      'If you need to set explicit widths to your grid items, apply the sizing classes to your grid items. Check out [sizing helpers here](/utilities/sizing).'
  },
  {
    id: 'horizontal-align-center',
    label: 'Horizontal Alignment - Center',
    element: (
      <div className="nds-grid nds-grid_align-center">
        <div />
        <div />
        <div />
        <div />
      </div>
    ),
    description:
      'If you want your columns to grow from the the center of the main (horizontal) axis, apply the class `nds-grid_align-center`.'
  },
  {
    id: 'horizontal-align-space',
    label: 'Horizontal Alignment - Space',
    element: (
      <div className="nds-grid nds-grid_align-space">
        <div />
        <div />
        <div />
        <div />
      </div>
    ),
    description:
      'To evenly distribute columns on the main axis with an equal amount of white space separating the columns, apply the class `nds-grid_align-space`.'
  },
  {
    id: 'horizontal-align-spread',
    label: 'Horizontal Alignment - Spread',
    element: (
      <div className="nds-grid nds-grid_align-spread">
        <div />
        <div />
        <div />
        <div />
      </div>
    ),
    description:
      'To spread out your columns on the main axis, with the first column starting at the start of your main axis and last item ending at the far end of your main axis, apply the class `.nds-grid_align-spread`.'
  },
  {
    id: 'horizontal-align-end',
    label: 'Horizontal Alignment - End',
    element: (
      <div className="nds-grid nds-grid_align-end">
        <div />
        <div />
        <div />
        <div />
      </div>
    ),
    description:
      'If you want your columns to grow from the end of the main axis, apply the class `.nds-grid_align-end`.'
  },
  {
    id: 'vertical-align-start',
    label: 'Vertical Alignment - Start',
    element: (
      <div className="nds-grid nds-grid_vertical-align-start">
        <div />
        <div />
        <div />
        <div />
      </div>
    ),
    description:
      'To align a single row or multi-line rows to the beginning of the cross axis, apply the class `.nds-grid_vertical-align-start`. Note, to vertically align elements on a cross-axis of a `.nds-grid`, the elements need available vertical white space. This is usually achieved by having a height applied to the `.nds-grid`.'
  },
  {
    id: 'vertical-align-center',
    label: 'Vertical Alignment - Center',
    element: (
      <div className="nds-grid nds-grid_vertical-align-center">
        <div />
        <div />
        <div />
        <div />
      </div>
    ),
    description:
      'To vertically center align a single row or multi-line rows to the height of a grid container, apply the class `.nds-grid_vertical-align-center`. Note, to vertically align elements on a cross-axis of a `.nds-grid`, the elements need available vertical white space. This is usually achieved by having a height applied to the `.nds-grid`.When `.nds-grid_vertical-align-center` is used in conjunction with `.nds-grid_align-center`, the outcome would horizontally and vertically center align your content in the center of the `.nds-grid`.'
  },
  {
    id: 'vertical-align-end',
    label: 'Vertical Alignment - End',
    element: (
      <div className="nds-grid nds-grid_vertical-align-end">
        <div />
        <div />
        <div />
        <div />
      </div>
    ),
    description:
      'To align a single row or multi-line rows to the end of the cross axis, apply the class `.nds-grid_vertical-align-center`. Note, to vertically align elements on a cross-axis of a `.nds-grid`, the elements need available vertical white space. This is usually achieved by having a height applied to the `.nds-grid`.'
  },
  {
    id: 'vertical-align-item',
    label: 'Vertical Alignment - Item',
    element: (
      <div className="nds-grid">
        <div className="nds-align-top" />
        <div className="nds-align-middle" />
        <div className="nds-align-bottom" />
      </div>
    ),
    description:
      'To specify the vertical placement of grid items on the cross axis, you can apply `.nds-align-top`, `.nds-align-middle`, and `.nds-align-bottom` to a grid item. Note, to vertically align elements on a cross-axis of a `.nds-grid`, the elements need available vertical white space. This is usually achieved by having a height applied to the `.nds-grid`.'
  },
  {
    id: 'vertical-strecth',
    label: 'Vertical Stretch',
    element: (
      <div className="nds-grid nds-grid_vertical-stretch">
        <div />
        <div />
        <div />
        <div />
      </div>
    ),
    description:
      'By default, grid items extend vertically unless `.nds-wrap` is applied to your parent grid container or you have multiple rows. If you have need multiple rows that stretch the height of the parent grid container, you can apply the class `.nds-grid_vertical-stretch`. Note, to vertically align elements on a cross-axis of a `.nds-grid`, the elements need available vertical white space. This is usually achieved by having a height applied to the `.nds-grid`.'
  },
  {
    id: 'align-item-bump',
    label: 'Alignment Item Bump',
    element: (
      <div className="nds-grid">
        <div />
        <div />
        <div />
        <div />
        <div className="nds-col_bump-left" />
        <div />
      </div>
    ),
    description:
      'To "bump" a single grid item or a grid item plus the precedding grid items that follow, apply the class `.nds-col_bump-{direction}`, with `{direction}` being either `left`, `right`, `top` or `bottom` to a grid item.'
  },
  {
    id: 'order',
    label: 'Ordering',
    element: (
      <div className="nds-grid">
        <div className="nds-order_2 nds-medium-order_1 nds-large-order_3" />
        <div className="nds-order_3 nds-medium-order_2 nds-large-order_2" />
        <div className="nds-order_1 nds-medium-order_3 nds-large-order_1" />
      </div>
    ),
    description:
      'These helper classes visually reorder grid elements independently from their position in the markup.'
  },
  {
    id: 'container-app-frame',
    label: 'Container - App Frame',
    element: (
      <div className="nds-grid nds-grid_frame">
        <div />
      </div>
    ),
    description:
      'If you want your application to fill 100% of the width and height of the viewport and nest other grids inside, use the top-level app helper class `.nds-grid_frame`.'
  },
  {
    id: 'containers',
    label: 'Containers',
    element: (
      <div className="nds-grid nds-grid_vertical">
        <div className="nds-container_small" />
        <div className="nds-container_medium" />
        <div className="nds-container_large" />
        <div className="nds-container_x-large" />
        <div className="nds-container_fluid" />
      </div>
    ),
    description:
      'You can use the grid system&rsquo;s containers to constrain your content to a certain width. You can center or left or right align the containers within your viewport.'
  }
];
