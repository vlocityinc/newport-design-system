// @ts-nocheck
import { createElement } from 'lwc';

import PropertyEditorPanel from '../propertyEditorPanel';
import { ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/stageEditor', () => require('builder_platform_interaction_mocks/stageEditor'));

const selectors = {
    CLOSE_BUTTON: 'lightning-button-icon.close-panel-button'
};

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-property-editor-panel', {
        is: PropertyEditorPanel
    });

    Object.assign(el, {}, props);
    setDocumentBodyChildren(el);

    return el;
};

describe('propertyEditorPanel', () => {
    it('close button dispatches closePropertyEditorEvent', () => {
        const eventCallback = jest.fn();
        const propertyEditorPanel = createComponentUnderTest();
        propertyEditorPanel.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);

        const closeButton = propertyEditorPanel.shadowRoot.querySelector(selectors.CLOSE_BUTTON);
        closeButton.click();

        expect(eventCallback).toHaveBeenCalled();
    });
    it('should focus the close panel button when the panel is designated with tab focus', () => {
        const propertyEditorPanel = createComponentUnderTest();

        const closeButton = propertyEditorPanel.shadowRoot.querySelector(selectors.CLOSE_BUTTON);

        closeButton.focus = jest.fn();

        propertyEditorPanel.focus();

        expect(closeButton.focus).toHaveBeenCalled();
    });
});
