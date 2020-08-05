// @ts-nocheck
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

const LABEL_DESCRIPTION_SELECTORS = {
    DEV_NAME: '.devName',
    LABEL: '.label'
};

export const getLabelDescriptionElement = (editor) => {
    return editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LABEL_DESCRIPTION);
};

export const getLabelDescriptionNameElement = (editor) => {
    return getLabelDescriptionElement(editor).shadowRoot.querySelector(LABEL_DESCRIPTION_SELECTORS.DEV_NAME);
};

export const getLabelDescriptionLabelElement = (editor) => {
    return getLabelDescriptionElement(editor).shadowRoot.querySelector(LABEL_DESCRIPTION_SELECTORS.LABEL);
};
