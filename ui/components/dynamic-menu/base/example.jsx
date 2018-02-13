import React from 'react';
import {
  ComboboxContainer,
  EntityOption,
  Listbox,
  ListboxItem
} from '../../combobox/base/example';
import { ButtonIcon } from '../../button-icons/base/example';
import { Popover } from '../../popovers/base/example';
import SvgIcon from '../../../shared/svg-icon';
import _ from '../../../shared/helpers';

/* -----------------------------------------------------------------------------
    Data
----------------------------------------------------------------------------- */
const accounts = [
  'Acme',
  'Edge SLA',
  'Express Logistics SLA',
  'GenePoint Lab Generators',
  'GenePoint SLA',
  'Pyramid Emergency Generators',
  'United Oil Installations',
  'United Oil Plant Standby Generators',
  'University of AZ Installations',
  'University of AZ Portable Generators'
];

const ListboxList = props => (
  <Listbox
    className="nds-dropdown_length-10"
    vertical
    aria-label="My Favorites"
  >
    <ListboxItem>
      <span
        className="nds-media nds-listbox__option nds-listbox__option_plain"
        role="presentation"
      >
        <h3 className="nds-text-title_caps" role="presentation">
          My Favorites
        </h3>
      </span>
    </ListboxItem>
    {accounts.slice(0, props.length).map((value, i) => (
      <ListboxItem key={value}>
        <EntityOption
          id={_.uniqueId('listbox-option-id-')}
          entityTitle={value}
          entityMeta
          tabIndex={i === 0 && !props.isCombobox ? '0' : null}
        />
      </ListboxItem>
    ))}
  </Listbox>
);

const Footer = props => (
  <ul>
    <li>
      <button className="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
        <SvgIcon
          className="nds-button__icon nds-button__icon_left"
          sprite="utility"
          symbol="add"
        />
        Favorite this page
      </button>
    </li>
    <li>
      <button className="nds-button nds-button_reset nds-p-vertical_xx-small nds-size_1-of-1">
        <SvgIcon
          className="nds-button__icon nds-button__icon_left"
          sprite="utility"
          symbol="edit"
        />
        Edit Favorites
      </button>
    </li>
  </ul>
);

const DynamicMenu = props => (
  <Popover
    className="nds-nubbin_top-left nds-dynamic-menu"
    bodyClassName="nds-p-horizontal_none"
    title="My Favourites"
    footer={<Footer />}
    style={{ position: 'absolute', left: '0', top: '55px' }}
  >
    {props.children}
  </Popover>
);

// Default
export default (
  <div className="demo-only" style={{ height: '12rem' }}>
    <ButtonIcon
      className="nds-button_icon-border-filled"
      symbol="favorite"
      assistiveText="Show Favorites"
      title="Show Favorites"
    />
    <DynamicMenu>
      <div className="nds-p-vertical_x-small nds-p-horizontal_small">
        <h3
          className="nds-text-title_caps nds-m-bottom_x-small"
          role="presentation"
        >
          My Favorites
        </h3>
        <p>You can favorite any page!</p>
      </div>
    </DynamicMenu>
  </div>
);

// Examples
export let states = [
  {
    id: 'dynamic-menu-0-items',
    label: 'Dynamic Menu — 0 Items',
    element: (
      <div className="demo-only" style={{ height: '12rem' }}>
        <ButtonIcon
          className="nds-button_icon-border-filled"
          symbol="favorite"
          assistiveText="Show Favorites"
          title="Show Favorites"
        />
        <DynamicMenu>
          <div className="nds-p-vertical_x-small nds-p-horizontal_small">
            <h3
              className="nds-text-title_caps nds-m-bottom_x-small"
              role="presentation"
            >
              My Favorites
            </h3>
            <p>You can favorite any page!</p>
          </div>
        </DynamicMenu>
      </div>
    )
  },
  {
    id: 'dynamic-menu-1-item',
    label: 'Dynamic Menu — 1 Item',
    element: (
      <div className="demo-only" style={{ height: '13rem' }}>
        <ButtonIcon
          className="nds-button_icon-border-filled"
          symbol="favorite"
          assistiveText="Show Favorites"
          title="Show Favorites"
        />
        <DynamicMenu>
          <ListboxList length="1" />
        </DynamicMenu>
      </div>
    )
  },
  {
    id: 'dynamic-menu-sub-10-item',
    label: 'Dynamic Menu — <10 Items',
    element: (
      <div className="demo-only" style={{ height: '27rem' }}>
        <ButtonIcon
          className="nds-button_icon-border-filled"
          symbol="favorite"
          assistiveText="Show Favorites"
          title="Show Favorites"
        />
        <DynamicMenu>
          <ListboxList length="6" />
        </DynamicMenu>
      </div>
    )
  },
  {
    id: 'dynamic-menu-over-10-item',
    label: 'Dynamic Menu — >10 Items',
    element: (
      <div className="demo-only" style={{ height: '34rem' }}>
        <ButtonIcon
          className="nds-button_icon-border-filled"
          symbol="favorite"
          assistiveText="Show Favorites"
          title="Show Favorites"
        />
        <DynamicMenu>
          <ComboboxContainer
            autocomplete
            isOpen
            placeholder="Search Favorites"
            hideLabel
            inputIcon="right"
            inputIconRightSymbol="search"
            inputContainerClassName="nds-m-around_small"
            listbox={<ListboxList length="12" isCombobox />}
            staticListbox
          />
        </DynamicMenu>
      </div>
    )
  }
];
