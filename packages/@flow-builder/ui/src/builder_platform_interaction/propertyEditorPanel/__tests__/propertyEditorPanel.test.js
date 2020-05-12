// @ts-nocheck
import { createElement } from 'lwc';

import PropertyEditorPanel from '../propertyEditorPanel';

import { UpdateNodeEvent, ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

const PROPERTY_EDITOR_SELECTOR = '.inline-property-editor';

jest.mock('builder_platform_interaction/stageEditor', () => require('builder_platform_interaction_mocks/stageEditor'));

const createComponentUnderTest = async props => {
    const el = await createElement('builder_platform_interaction-property-editor-panel', {
        is: PropertyEditorPanel
    });

    Object.assign(el, {}, props);
    document.body.appendChild(el);

    return el;
};

describe('propertyEditorPanel', () => {
    it('close button dispatches closePropertyEditorEvent', () => {
        const eventCallback = jest.fn();

        return createComponentUnderTest().then(component => {
            component.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);

            const closeButton = component.shadowRoot.querySelector('.slds-icon-utility-close');
            closeButton.click();

            expect(eventCallback).toHaveBeenCalled();
        });
    });

    it('property change triggers nodeUpdateCallback', async () => {
        expect.assertions(1);

        const nodeUpdateCallbackMock = jest.fn();

        const props = {
            element: { a: 0 },
            nodeUpdateCallback: nodeUpdateCallbackMock,
            params: {
                panelConfig: {
                    titleForModal: 'title'
                },
                attr: {
                    bodyComponent: {
                        desc: 'builder_platform_interaction:stageEditor',
                        className: 'builder_platform_interaction/stageEditor',
                        attr: {
                            mode: 'addelement'
                        }
                    }
                }
            }
        };

        const component = await createComponentUnderTest(props);

        return ticks().then(() => {
            const node = { a: 1 };

            const propertyEditor = component.shadowRoot.querySelector(PROPERTY_EDITOR_SELECTOR);

            propertyEditor.dispatchEvent(new UpdateNodeEvent(node));
            expect(nodeUpdateCallbackMock).toHaveBeenCalledWith(node);
        });
    });
});
