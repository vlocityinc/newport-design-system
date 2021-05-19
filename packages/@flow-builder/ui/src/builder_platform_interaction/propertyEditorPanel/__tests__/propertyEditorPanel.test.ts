// @ts-nocheck
import { createElement } from 'lwc';

import PropertyEditorPanel from '../propertyEditorPanel';
import { ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/stageEditor', () => require('builder_platform_interaction_mocks/stageEditor'));

const createComponentUnderTest = async (props) => {
    const el = await createElement('builder_platform_interaction-property-editor-panel', {
        is: PropertyEditorPanel
    });

    Object.assign(el, {}, props);
    setDocumentBodyChildren(el);

    return el;
};

describe('propertyEditorPanel', () => {
    it('close button dispatches closePropertyEditorEvent', () => {
        const eventCallback = jest.fn();

        return createComponentUnderTest().then((component) => {
            component.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);

            const closeButton = component.shadowRoot.querySelector('.slds-icon-utility-close');
            closeButton.click();

            expect(eventCallback).toHaveBeenCalled();
        });
    });
});
