import { createElement } from 'lwc';

import PropertyEditorPanel from '../propertyEditorPanel';

import {
    AddElementEvent,
    EditElementEvent,
    AddNodeEvent,
    UpdateNodeEvent,
    ClosePropertyEditorEvent
} from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

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
    it('handleCancel dispatches closePropertyEditorEvent', () => {
        const eventCallback = jest.fn();

        return createComponentUnderTest().then(component => {
            component.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);

            const cancelButton = component.shadowRoot.querySelector('.test-property-editor-footer-cancel-button');
            cancelButton.click();

            expect(eventCallback).toHaveBeenCalled();
        });
    });

    it('close button dispatches closePropertyEditorEvent', () => {
        const eventCallback = jest.fn();

        return createComponentUnderTest().then(component => {
            component.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);

            const closeButton = component.shadowRoot.querySelector('.slds-icon-utility-close');
            closeButton.click();

            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('handleOK', () => {
        let props;

        beforeEach(() => {
            props = {
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
        });

        it('validates the component', async () => {
            expect.assertions(1);

            const component = await createComponentUnderTest(props);

            return ticks().then(() => {
                const propertyEditor = component.shadowRoot.querySelector('.inline-property-editor');
                propertyEditor.validate = jest.fn(() => {
                    return [];
                });

                const doneButton = component.shadowRoot.querySelector('.test-property-editor-footer-ok-button');
                doneButton.click();

                expect(propertyEditor.validate).toHaveBeenCalled();
            });
        });

        it('with validation errors does nothing', () => {
            expect.assertions(1);

            return createComponentUnderTest(props).then(component => {
                return ticks().then(() => {
                    const propertyEditor = component.shadowRoot.querySelector('.inline-property-editor');
                    propertyEditor.validate = jest.fn(() => {
                        return [0, 1];
                    });

                    const eventCallback = jest.fn();
                    component.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, eventCallback);

                    const doneButton = component.shadowRoot.querySelector('.test-property-editor-footer-ok-button');
                    doneButton.click();

                    expect(eventCallback).not.toHaveBeenCalled();
                });
            });
        });

        it('with no validation errors and add mode fires AddNodeEvent', () => {
            expect.assertions(2);

            props.params.attr.bodyComponent.attr.mode = AddElementEvent.EVENT_NAME;

            return createComponentUnderTest(props).then(component => {
                return ticks().then(() => {
                    const propertyEditor = component.shadowRoot.querySelector('.inline-property-editor');

                    propertyEditor.validate = jest.fn(() => {
                        return [];
                    });

                    const mockNode = { a: 1 };
                    propertyEditor.getNode = jest.fn(() => {
                        return mockNode;
                    });

                    const eventCallback = jest.fn();
                    component.addEventListener(AddNodeEvent.EVENT_NAME, eventCallback);

                    const closeCallback = jest.fn();
                    component.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, closeCallback);

                    const doneButton = component.shadowRoot.querySelector('.test-property-editor-footer-ok-button');
                    doneButton.click();

                    const addNodeEvent = eventCallback.mock.calls[0][0];
                    expect(addNodeEvent.detail.node).toEqual(mockNode);

                    expect(closeCallback).toHaveBeenCalled();
                });
            });
        });

        it('with no validation errors and update mode fires UpdateNodeEvent', () => {
            expect.assertions(2);

            props.params.attr.bodyComponent.attr.mode = EditElementEvent.EVENT_NAME;

            return createComponentUnderTest(props).then(component => {
                return ticks().then(() => {
                    const propertyEditor = component.shadowRoot.querySelector('.inline-property-editor');

                    propertyEditor.validate = jest.fn(() => {
                        return [];
                    });

                    const mockNode = { a: 1 };
                    propertyEditor.getNode = jest.fn(() => {
                        return mockNode;
                    });

                    const eventCallback = jest.fn();
                    component.addEventListener(UpdateNodeEvent.EVENT_NAME, eventCallback);

                    const closeCallback = jest.fn();
                    component.addEventListener(ClosePropertyEditorEvent.EVENT_NAME, closeCallback);

                    const doneButton = component.shadowRoot.querySelector('.test-property-editor-footer-ok-button');
                    doneButton.click();

                    const updateEvent = eventCallback.mock.calls[0][0];
                    expect(updateEvent.detail.node).toEqual(mockNode);

                    expect(closeCallback).toHaveBeenCalled();
                });
            });
        });
    });
});
