// @ts-nocheck
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

export const PALETTE_RESOURCES_INDEX = 0;
export const PALETTE_ELEMENTS_INDEX = 1;

const LEFT_PANEL_SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS,
    RESOURCE_DETAILS_PANEL_DELETE_BUTTON_TITLE: 'FlowBuilderResourceDetailsPanel.deleteButtonLabel',
    RESOURCE_DETAILS_PANEL_EDIT_BUTTON_TITLE: 'FlowBuilderResourceDetailsPanel.editButtonLabel',
    BUTTON_LOCATOR_ICON: '.test-locator-icon',
    BUTTON_VIEW_DETAIL: '.test-details-chevron-icon'
};

export const getPalette = (leftPanel, paletteIndex = PALETTE_RESOURCES_INDEX) => {
    const panelResources = leftPanel.shadowRoot.querySelector(LEFT_PANEL_SELECTORS.LEFT_PANEL_RESOURCES);
    return panelResources.shadowRoot.querySelectorAll(LEFT_PANEL_SELECTORS.LEFT_PANEL_PALETTE)[paletteIndex];
};

export const getChevronElement = (leftPanel, resourceGuid, paletteIndex = PALETTE_RESOURCES_INDEX) => {
    const palette = getPalette(leftPanel, paletteIndex);
    return palette.shadowRoot.querySelector('[data-key="' + resourceGuid + '"]');
};

export const clickOnViewDetailButton = chevronElement => {
    const chevronButton = chevronElement.querySelector(LEFT_PANEL_SELECTORS.BUTTON_VIEW_DETAIL);
    expect(chevronButton).toBeDefined();
    chevronButton.click();
};

export const clickOnLocatorButton = chevronElement => {
    const locatorButton = chevronElement.querySelector(LEFT_PANEL_SELECTORS.BUTTON_LOCATOR_ICON);
    expect(locatorButton).toBeDefined();
    locatorButton.click();
};

export const clickDeleteButtonInResourceDetailsPanel = resourceDetailsPanel => {
    const deleteButton = resourceDetailsPanel.shadowRoot.querySelector(
        '[title="' + LEFT_PANEL_SELECTORS.RESOURCE_DETAILS_PANEL_DELETE_BUTTON_TITLE + '"]'
    );
    expect(deleteButton).toBeDefined();
    deleteButton.click();
};

export const getResourceDetail = leftPanel => {
    return deepQuerySelector(leftPanel, [LEFT_PANEL_SELECTORS.LEFT_PANEL_RESOURCE_DETAILS]);
};

export const getLeftPanel = editorCmp => {
    return editorCmp.shadowRoot.querySelector(LEFT_PANEL_SELECTORS.LEFT_PANEL);
};

export const getElementByTitle = (parent, title) => {
    return parent.shadowRoot.querySelector('[title="' + title + '"]');
};
