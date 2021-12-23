// @ts-nocheck
import { createElement } from 'lwc';

import PropertyEditorPanel from '../propertyEditorPanel';
import { ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/sharedUtils', () =>
    jest.requireActual('builder_platform_interaction_mocks/sharedUtils')
);

jest.mock('builder_platform_interaction/stageEditor', () =>
    jest.requireActual('builder_platform_interaction_mocks/stageEditor')
);

const selectors = {
    CLOSE_BUTTON: 'lightning-button-icon.close-panel-button',
    DYNAMIC_CONTENT: 'x-lazy'
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
    it('close button dispatches updateNodeEvent and closePropertyEditorEvent', async () => {
        const eventCallback = jest.fn();
        const propertyEditorPanel = createComponentUnderTest();
        await ticks(10);
        propertyEditorPanel.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);

        const closeButton = propertyEditorPanel.shadowRoot.querySelector(selectors.CLOSE_BUTTON);
        closeButton.click();

        expect(eventCallback).toHaveBeenCalled();
    });
    it('should focus the dynamic content when the panel is designated with tab focus', async () => {
        const props = {
            element: {},
            params: {
                attr: {
                    bodyComponent: {
                        className: 'builder_platform_interaction/stageEditor',
                        attr: {
                            mode: 'Test mode',
                            processType: 'Test processType'
                        }
                    }
                },
                panelConfig: {
                    titleForModal: 'Test titleForModal'
                }
            }
        };
        const propertyEditorPanel = createComponentUnderTest(props);

        await ticks(100);

        const dynamicContent = propertyEditorPanel.shadowRoot.querySelector(selectors.DYNAMIC_CONTENT);
        dynamicContent.focus = jest.fn();
        propertyEditorPanel.focus();

        expect(dynamicContent.focus).toHaveBeenCalled();
    });
});
