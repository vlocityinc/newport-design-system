import React from 'react';
import addons, { types } from '@storybook/addons';
import DesignTokensPanel from './DesignTokensPanel';
import { ADDON_ID, PANEL_ID } from './constants';

export function register() {
  addons.register(ADDON_ID, api => {
    addons.add(PANEL_ID, {
      type: types.PANEL,
      title: 'Design Tokens',
      render: ({ active, key }) => (
        <DesignTokensPanel api={api} key={key} active={active} />
      )
    });
  });
}
