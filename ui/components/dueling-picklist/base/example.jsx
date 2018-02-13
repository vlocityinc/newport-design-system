// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React from 'react';
import SvgIcon from '../../../shared/svg-icon';
import classNames from 'classnames';
import _ from '../../../shared/helpers';

/// ////////////////////////////////////////
// Partial(s)
/// ////////////////////////////////////////

const MultiSelect = props => {
  return (
    <div className="nds-dueling-list">
      <div
        className="nds-assistive-text"
        id="drag-live-region"
        aria-live="assertive"
      >
        {props.dataSet.liveRegionText}
      </div>
      <div className="nds-assistive-text" id="option-drag-label">
        {props.dataSet.optionDragLabel}
      </div>
      <SelectionGroup
        disabled={props.disabled}
        group={props.dataSet.selectionGroups[0]}
      />
      <MoveButtons
        direction="horizontal"
        targetA={props.dataSet.selectionGroups[0].label}
        targetB={props.dataSet.selectionGroups[1].label}
        disabled={props.disabled}
      />
      <SelectionGroup
        disabled={props.disabled}
        group={props.dataSet.selectionGroups[1]}
      />
      <MoveButtons disabled={props.disabled} direction="vertical" />
    </div>
  );
};

const MoveButtons = props => (
  <div className="nds-dueling-list__column">
    <button
      className="nds-button nds-button_icon nds-button_icon-container"
      title={
        'Move Selection ' + (props.direction === 'vertical') ? (
          'Up'
        ) : (
          'to ' + props.targetB
        )
      }
      disabled={props.disabled}
    >
      <SvgIcon
        className="nds-button__icon"
        sprite="utility"
        symbol={props.direction === 'vertical' ? 'up' : 'right'}
      />
      <span className="nds-assistive-text">
        Move Selection{' '}
        {props.direction === 'vertical' ? 'Up' : 'to ' + props.targetB}
      </span>
    </button>
    <button
      className="nds-button nds-button_icon nds-button_icon-container"
      title={
        'Move Selection ' + (props.direction === 'vertical') ? (
          'Down'
        ) : (
          'to ' + props.targetA
        )
      }
      disabled={props.disabled}
    >
      <SvgIcon
        className="nds-button__icon"
        sprite="utility"
        symbol={props.direction === 'vertical' ? 'down' : 'left'}
      />
      <span className="nds-assistive-text">
        Move Selection{' '}
        {props.direction === 'vertical' ? 'Down' : 'to ' + props.targetA}
      </span>
    </button>
  </div>
);

const SelectionGroup = props => {
  const groupLabelID = _.uniqueId('label-');
  return (
    <div className="nds-dueling-list__column">
      <span className="nds-form-element__label" id={groupLabelID}>
        {props.group.label}
      </span>
      <ListBox
        disabled={props.disabled}
        options={props.group.options}
        ariaLabelledby={groupLabelID}
      />
    </div>
  );
};

const ListBox = props => (
  <div
    className="nds-dueling-list__options"
    role="application"
    aria-disabled={props.disabled}
  >
    <ul
      aria-describedby="option-drag-label"
      aria-labelledby={props.ariaLabelledby}
      aria-multiselectable="true"
      className="nds-listbox nds-listbox_vertical"
      role="listbox"
    >
      {props.options.map(option => (
        <Option key={_.uniqueId('cell-resize-handle-')} option={option} />
      ))}
    </ul>
  </div>
);

const Option = props => (
  <li role="presentation" className="nds-listbox__item">
    <span
      className={classNames(
        'nds-listbox__option nds-listbox__option_plain nds-media',
        {
          'nds-is-grabbed': props.option.isGrabbed,
          'nds-is-selected': props.option.isSelected
        }
      )}
      aria-selected={props.option.isSelected}
      draggable="true"
      role="option"
      tabIndex={props.option.tabIndex}
    >
      <span className="nds-truncate" title={props.option.text}>
        {props.option.text}
        {props.option.required ? (
          <abbr className="nds-required" title="required">
            *
          </abbr>
        ) : null}
      </span>
    </span>
  </li>
);

/// ////////////////////////////////////////
// States
/// ////////////////////////////////////////

const DefaultSnapShot = {
  liveRegionText: '',
  optionDragLabel:
    'Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.',
  selectionGroups: [
    {
      label: 'First Category',
      options: [
        {
          text: 'Option 1',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 2',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 3',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 6',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    },
    {
      label: 'Second Category',
      options: [
        {
          text: 'Option 4',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 5',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    }
  ]
};

const RequiredSnapShot = {
  liveRegionText: '',
  optionDragLabel:
    'Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists. Required items must remain in the second category.',
  selectionGroups: [
    {
      label: 'First Category',
      options: [
        {
          text: 'Option 1',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 2',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 3',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 6',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    },
    {
      label: 'Second Category',
      options: [
        {
          text: 'Option 4',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false,
          required: true
        },
        {
          text: 'Option 5',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    }
  ]
};

const SelectedSnapShot = {
  liveRegionText: '',
  optionDragLabel:
    'Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.',
  selectionGroups: [
    {
      label: 'First Category',
      options: [
        {
          text: 'Option 1',
          tabIndex: 0,
          isSelected: true,
          isGrabbed: false
        },
        {
          text: 'Option 2',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 3',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 6',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    },
    {
      label: 'Second Category',
      options: [
        {
          text: 'Option 4',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 5',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    }
  ]
};

const MultiSelectedSnapShot = {
  liveRegionText: '',
  optionDragLabel:
    'Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.',
  selectionGroups: [
    {
      label: 'First Category',
      options: [
        {
          text: 'Option 1',
          tabIndex: -1,
          isSelected: true,
          isGrabbed: false
        },
        {
          text: 'Option 2',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 3',
          tabIndex: 0,
          isSelected: true,
          isGrabbed: false
        },
        {
          text: 'Option 6',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    },
    {
      label: 'Second Category',
      options: [
        {
          text: 'Option 4',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 5',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    }
  ]
};

const GrabbedSnapShot = {
  liveRegionText:
    'Option 3: current position 3 of 4. Press up or down arrows to move within list.',
  optionDragLabel: '',
  selectionGroups: [
    {
      label: 'First Category',
      options: [
        {
          text: 'Option 1',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 2',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 3',
          tabIndex: 0,
          isSelected: true,
          isGrabbed: true
        },
        {
          text: 'Option 6',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    },
    {
      label: 'Second Category',
      options: [
        {
          text: 'Option 4',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 5',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    }
  ]
};

const MovedInSnapShot = {
  liveRegionText: 'Option 3: current position 2 of 4.',
  optionDragLabel: '',
  selectionGroups: [
    {
      label: 'First Category',
      options: [
        {
          text: 'Option 1',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 3',
          tabIndex: 0,
          isSelected: true,
          isGrabbed: true
        },
        {
          text: 'Option 2',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 6',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    },
    {
      label: 'Second Category',
      options: [
        {
          text: 'Option 4',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 5',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    }
  ]
};

const DroppedSnapShot = {
  liveRegionText: 'Option 3: final position 2 of 4.',
  optionDragLabel:
    'Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.',
  selectionGroups: [
    {
      label: 'First Category',
      options: [
        {
          text: 'Option 1',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 3',
          tabIndex: 0,
          isSelected: true,
          isGrabbed: false
        },
        {
          text: 'Option 2',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 6',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    },
    {
      label: 'Second Category',
      options: [
        {
          text: 'Option 4',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 5',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    }
  ]
};

const MoveToSnapShot = {
  liveRegionText: 'Option 3: Moved to Second Category.',
  optionDragLabel:
    'Press space bar when on an item, to move it within the list. CMD plus left and right arrow keys, to move items between lists.',
  selectionGroups: [
    {
      label: 'First Category',
      options: [
        {
          text: 'Option 1',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 2',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 6',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        }
      ]
    },
    {
      label: 'Second Category',
      options: [
        {
          text: 'Option 4',
          tabIndex: 0,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 5',
          tabIndex: -1,
          isSelected: false,
          isGrabbed: false
        },
        {
          text: 'Option 3',
          tabIndex: 0,
          isSelected: true,
          isGrabbed: false
        }
      ]
    }
  ]
};

export default <MultiSelect dataSet={DefaultSnapShot} />;

export let states = [
  {
    id: 'required-dueling-picklist',
    label: 'Required',
    element: <MultiSelect dataSet={RequiredSnapShot} />
  },
  {
    id: 'disabled-dueling-picklist',
    label: 'Disabled',
    element: <MultiSelect dataSet={DefaultSnapShot} disabled />
  },
  {
    id: 'multi-select-selected-item',
    label: 'Selected Item',
    element: <MultiSelect dataSet={SelectedSnapShot} />
  },
  {
    id: 'multi-select-multi-selected-items',
    label: 'Multiple Selected Items',
    element: <MultiSelect dataSet={MultiSelectedSnapShot} />
  },
  {
    id: 'multi-select-grabbed',
    label: 'Grabbed',
    element: <MultiSelect dataSet={GrabbedSnapShot} />
  },
  {
    id: 'multi-select-moved-in',
    label: 'Moved in list',
    element: <MultiSelect dataSet={MovedInSnapShot} />
  },
  {
    id: 'multi-select-dropped',
    label: 'Dropped',
    element: <MultiSelect dataSet={DroppedSnapShot} />
  },
  {
    id: 'multi-select-moved-to',
    label: 'Moved to list',
    element: <MultiSelect dataSet={MoveToSnapShot} />
  }
];
