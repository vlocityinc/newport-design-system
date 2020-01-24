import {
    LIGHTNING_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

const LEFT_PANEL_SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    LEFT_PANEL_RESOURCES: 'builder_platform_interaction-left-panel-resources',
    LEFT_PANEL_PALETTE: 'builder_platform_interaction-palette',
    LEFT_PANEL_RESOURCE_DETAILS:
        'builder_platform_interaction-resource-details',
    RESOURCE_DETAILS_PANEL_DELETE_BUTTON_TITLE:
        'FlowBuilderResourceDetailsPanel.deleteButtonLabel',
    RESOURCE_DETAILS_PANEL_EDIT_BUTTON_TITLE:
        'FlowBuilderResourceDetailsPanel.editButtonLabel'
};

export const getPalette = leftPanel => {
    return deepQuerySelector(leftPanel, [
        LEFT_PANEL_SELECTORS.LEFT_PANEL_RESOURCES,
        LEFT_PANEL_SELECTORS.LEFT_PANEL_PALETTE
    ]);
};

export const getChevronElement = (leftPanel, resourceGuid) => {
    const palette = getPalette(leftPanel);
    return palette.shadowRoot.querySelectorAll(
        '[data-key="' + resourceGuid + '"]'
    );
};

export const clickOnChevron = chevronElement => {
    const chevronButton = chevronElement.querySelector(
        LEFT_PANEL_SELECTORS.LIGHTNING_BUTTON_ICON
    );
    expect(chevronButton).toBeDefined();
    chevronButton.click();
};

export const clickDeleteButtonInResourceDetailsPanel = resourceDetailsPanel => {
    const deleteButton = resourceDetailsPanel.shadowRoot.querySelector(
        '[title="' +
            LEFT_PANEL_SELECTORS.RESOURCE_DETAILS_PANEL_DELETE_BUTTON_TITLE +
            '"]'
    );
    expect(deleteButton).toBeDefined();
    deleteButton.click();
};
