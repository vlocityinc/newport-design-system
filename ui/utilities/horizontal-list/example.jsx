// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';

export let examples = [
  {
    id: 'horizontal-list',
    label: 'Default',
    element: (
      <ul className="nds-list_horizontal">
        <li>Horizontal List</li>
        <li>List Item</li>
        <li>List Item</li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-links',
    label: 'Links',
    element: (
      <ul className="nds-list_horizontal">
        <li>
          <a href="javascript:void(0);">
            Horizontal List with inline level links
          </a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-block-links',
    label: 'Block links',
    element: (
      <ul className="nds-list_horizontal nds-has-block-links">
        <li>
          <a href="javascript:void(0);">
            Horizontal List with block level links
          </a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-block-links-space',
    label: 'Block links with space',
    element: (
      <ul className="nds-list_horizontal nds-has-block-links_space">
        <li>
          <a href="javascript:void(0);">
            Horizontal List with block level links and space
          </a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-inline-block-links',
    label: 'Inline block links',
    element: (
      <ul className="nds-list_horizontal nds-has-inline-block-links">
        <li>
          <a href="javascript:void(0);">
            Horizontal List with inline-block level links
          </a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-inline-block-links-space',
    label: 'Inline block links with space',
    element: (
      <ul className="nds-list_horizontal nds-has-inline-block-links_space">
        <li>
          <a href="javascript:void(0);">
            Horizontal List with inline-block level links and space
          </a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li>
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-left',
    label: 'Left',
    element: (
      <ul className="nds-list_horizontal nds-has-dividers_left">
        <li className="nds-item">
          Horizontal List with dot dividers to the left
        </li>
        <li className="nds-item">List Item</li>
        <li className="nds-item">List Item</li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-link-left',
    label: 'Left with link',
    element: (
      <ul className="nds-list_horizontal nds-has-dividers_left nds-has-block-links">
        <li className="nds-item">
          <a href="javascript:void(0);">
            Horizontal List with block level links and dot dividers
          </a>
        </li>
        <li className="nds-item">
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li className="nds-item">
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-link-space-left',
    label: 'Left with link space',
    element: (
      <ul className="nds-list_horizontal nds-has-dividers_left nds-has-block-links_space">
        <li className="nds-item">
          <a href="javascript:void(0);">
            Horizontal List with block level links and dot dividers with space
          </a>
        </li>
        <li className="nds-item">
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li className="nds-item">
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-right',
    label: 'Right',
    element: (
      <ul className="nds-list_horizontal nds-has-dividers_right">
        <li className="nds-item">
          Horizontal List with dot dividers to the right
        </li>
        <li className="nds-item">List Item</li>
        <li className="nds-item">List Item</li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-link-right',
    label: 'Right with link',
    element: (
      <ul className="nds-list_horizontal nds-has-dividers_right nds-has-block-links">
        <li className="nds-item">
          <a href="javascript:void(0);">
            Horizontal List with block level links and dot dividers
          </a>
        </li>
        <li className="nds-item">
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li className="nds-item">
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  },
  {
    id: 'horizontal-list-link-space-right',
    label: 'Right with link space',
    element: (
      <ul className="nds-list_horizontal nds-has-dividers_right nds-has-block-links_space">
        <li className="nds-item">
          <a href="javascript:void(0);">
            Horizontal List with block level links and dot dividers with space
          </a>
        </li>
        <li className="nds-item">
          <a href="javascript:void(0);">List Item</a>
        </li>
        <li className="nds-item">
          <a href="javascript:void(0);">List Item</a>
        </li>
      </ul>
    )
  }
];
