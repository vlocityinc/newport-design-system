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

const createComponentUnderTest = props => {
    return new Promise(resolve => {
        const el = createElement('builder_platform_interaction-property-editor-panel', {
            is: PropertyEditorPanel
        });

        Object.assign(el, {}, props);
        document.body.appendChild(el);

        return ticks().then(() => {
            resolve(el);
        });
    });
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
                            desc: 'builder_platform_interaction:assignmentEditor',
                            attr: {
                                node: {},
                                mode: 'addelement',
                                processType: 'someProcessType'
                            }
                        }
                    }
                }
            };
        });

        it('validates the component', () => {
            return createComponentUnderTest(props).then(async component => {
                ticks().then(() => {
                    const propertyEditor = component.shadowRoot.querySelector('.inline-property-editor');

                    propertyEditor.validate = jest.fn(() => {
                        return [];
                    });

                    const doneButton = component.shadowRoot.querySelector('.test-property-editor-footer-ok-button');
                    doneButton.click();

                    expect(propertyEditor.validate).toHaveBeenCalled();
                });
            });
        });

        it('with validation errors does nothing', () => {
            return createComponentUnderTest(props).then(component => {
                ticks().then(() => {
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
            props.params.attr.bodyComponent.attr.mode = AddElementEvent.EVENT_NAME;

            return createComponentUnderTest(props).then(component => {
                ticks().then(() => {
                    const propertyEditor = component.shadowRoot.querySelector('.inline-property-editor');

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
            props.params.attr.bodyComponent.attr.mode = EditElementEvent.EVENT_NAME;

            return createComponentUnderTest(props).then(component => {
                ticks().then(() => {
                    const propertyEditor = component.shadowRoot.querySelector('.inline-property-editor');

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
