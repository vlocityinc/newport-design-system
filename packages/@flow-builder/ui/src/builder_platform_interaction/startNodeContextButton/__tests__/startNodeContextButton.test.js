import { createElement } from 'lwc';
import StartNodeContextButton from 'builder_platform_interaction/startNodeContextButton';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { format } from 'builder_platform_interaction/commonUtils';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { EDIT_START_CONTEXT } from 'builder_platform_interaction/elementConfig';

const createComponentUnderTest = (triggerType, object, filters, elementType = ELEMENT_TYPE.ASSIGNMENT) => {
    const el = createElement('builder_platform_interaction-start-node-context-button', {
        is: StartNodeContextButton
    });
    el.node = {
        guid: '1',
        locationX: '20px',
        locationY: '40px',
        elementType,
        label: 'start node',
        description: 'My first test node',
        triggerType,
        object,
        filters
    };
    document.body.appendChild(el);
    return el;
};

const selectors = {
    startContext: '.start-context',
    contextButtonText: '.start-context span',
    contextButtonOptionlText: '.start-context .optional',
    objectLabel: '.object-label-size',
    selectedObject: '.selected-object-label-size',
    editLabel: '.edit-size',
    recordConditions: '.test-conditions'
};

const runQuerySelector = (context, selector) => {
    return context.shadowRoot.querySelector(selector);
};

jest.mock('builder_platform_interaction/commonUtils', () => ({
    format: jest.fn()
}));

describe('Context Button', () => {
    it('Checks if non configured before record changed context button rendered text correctly', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.BEFORE_SAVE);
        expect(runQuerySelector(nodeComponent, selectors.contextButtonText).textContent).toBe(
            'FlowBuilderCanvasElement.startElementChooseObject'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if non configured after record changed context button rendered text correctly', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.AFTER_SAVE);
        expect(runQuerySelector(nodeComponent, selectors.contextButtonText).textContent).toBe(
            'FlowBuilderCanvasElement.startElementChooseObject'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if non configured scheduled context button rendered text correctly', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.SCHEDULED);
        expect(runQuerySelector(nodeComponent, selectors.contextButtonText).textContent).toBe(
            'FlowBuilderCanvasElement.startElementChooseObject'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText).textContent).toBe(
            'FlowBuilderCanvasElement.startElementOptional'
        );
    });

    it('Checks if non configured Journey audience button rendered text correctly', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY);
        expect(runQuerySelector(nodeComponent, selectors.contextButtonText).textContent).toBe(
            'FlowBuilderCanvasElement.startElementChooseAudience'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if configured before record changed context button rendered correctly', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.BEFORE_SAVE, 'account', []);
        expect(runQuerySelector(nodeComponent, selectors.startContext).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject accountFlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if configured after record changed context button rendered correctly', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.AFTER_SAVE, 'account', []);
        expect(runQuerySelector(nodeComponent, selectors.startContext).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject accountFlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if configured Scheduled context button rendered correctly with no filters', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.SCHEDULED, 'account', []);
        expect(runQuerySelector(nodeComponent, selectors.objectLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedObject).textContent).toBe('account');
        expect(runQuerySelector(nodeComponent, selectors.editLabel).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if configured Scheduled context button rendered correctly with filters', () => {
        format.mockReturnValue(' test conditions');
        const filter = [
            {
                rowIndex: 'a0e8a02d-60fb-4481-8165-10a01fe7031c',
                leftHandSide: {
                    value: 'text',
                    error: null
                },
                rightHandSide: {
                    value: '',
                    error: null
                },
                rightHandSideDataType: {
                    value: '',
                    error: null
                },
                operator: {
                    value: '',
                    error: null
                }
            }
        ];
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.SCHEDULED, 'account', filter);
        expect(runQuerySelector(nodeComponent, selectors.objectLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedObject).textContent).toBe('account');
        expect(runQuerySelector(nodeComponent, selectors.editLabel).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(nodeComponent, selectors.recordConditions).textContent).toBe(
            'FlowBuilderCanvasElement.startElementRecordConditions test conditions'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if configured Journey context button rendered correctly with no filters', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY, 'account', []);
        expect(runQuerySelector(nodeComponent, selectors.objectLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedObject).textContent).toBe('account');
        expect(runQuerySelector(nodeComponent, selectors.editLabel).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if configured Journey context button rendered correctly with filters', () => {
        format.mockReturnValue(' test conditions');
        const filter = [
            {
                rowIndex: 'a0e8a02d-60fb-4481-8165-10a01fe7031c',
                leftHandSide: {
                    value: 'text',
                    error: null
                },
                rightHandSide: {
                    value: '',
                    error: null
                },
                rightHandSideDataType: {
                    value: '',
                    error: null
                },
                operator: {
                    value: '',
                    error: null
                }
            }
        ];
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY, 'account', filter);
        expect(runQuerySelector(nodeComponent, selectors.objectLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementObject '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedObject).textContent).toBe('account');
        expect(runQuerySelector(nodeComponent, selectors.editLabel).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );
        expect(runQuerySelector(nodeComponent, selectors.recordConditions).textContent).toBe(
            'FlowBuilderCanvasElement.startElementRecordConditions test conditions'
        );
        expect(runQuerySelector(nodeComponent, selectors.contextButtonOptionlText)).toBeNull();
    });

    it('Checks if an EditElementEvent is dispatched when button is clicked', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.BEFORE_SAVE);
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            nodeComponent.addEventListener(EditElementEvent.EVENT_NAME, callback);
            nodeComponent.shadowRoot.querySelector(selectors.startContext).click();
            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls[0][0]).toMatchObject({
                detail: {
                    canvasElementGUID: nodeComponent.node.guid,
                    mode: EDIT_START_CONTEXT
                }
            });
        });
    });
});
