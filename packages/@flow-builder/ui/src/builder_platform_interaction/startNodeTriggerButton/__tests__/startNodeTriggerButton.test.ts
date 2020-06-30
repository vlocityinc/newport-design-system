// @ts-nocheck
import { createElement } from 'lwc';
import StartNodeContextButton from 'builder_platform_interaction/startNodeTriggerButton';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_TRIGGER_TYPE, FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { EditElementEvent } from 'builder_platform_interaction/events';

const createComponentUnderTest = (
    triggerType,
    object,
    filters,
    recordTriggerType,
    elementType = ELEMENT_TYPE.ASSIGNMENT
) => {
    const el = createElement('builder_platform_interaction-start-node-trigger-button', {
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
        filters,
        recordTriggerType
    };
    document.body.appendChild(el);
    return el;
};

const createComponentUnderTestWithSchedule = (triggerType, elementType = ELEMENT_TYPE.ASSIGNMENT) => {
    const el = createElement('builder_platform_interaction-start-node-trigger-button', {
        is: StartNodeContextButton
    });
    el.node = {
        guid: '1',
        locationX: '20px',
        locationY: '40px',
        elementType,
        label: 'Fri, Mar 27, 2020, 12:30:00 AM, Once',
        description: 'My first test node',
        triggerType,
        startDate: '2020-03-27',
        startTime: '00:30:00.000',
        frequency: 'Once'
    };
    document.body.appendChild(el);
    return el;
};

const selectors = {
    button: '.test-trigger-button',
    unsetTrigger: '.unset-start-button',
    triggerLabel: '.trigger-label-size',
    flowStartLabel: '.flow-starts-size',
    selectedTrigger: '.selected-trigger-label-size',
    selectedFlowStart: '.selected-flow-starts-size',
    edit: '.edit-size',
    runFlow: '.test-run-flow'
};

const runQuerySelector = (context, selector) => {
    return context.shadowRoot.querySelector(selector);
};

describe('Trigger Button', () => {
    it('Checks if non configured scheduled trigger button rendered text correctly', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.SCHEDULED);
        expect(runQuerySelector(nodeComponent, selectors.unsetTrigger).textContent).toBe(
            'FlowBuilderCanvasElement.startElementSetSchedule'
        );
    });

    it('Checks if non configured Journey audience button rendered text correctly', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY);
        expect(runQuerySelector(nodeComponent, selectors.unsetTrigger).textContent).toBe(
            'FlowBuilderCanvasElement.startElementSetSchedule'
        );
    });

    it('Checks if configured before record changed trigger button rendered correctly on create', () => {
        const nodeComponent = createComponentUnderTest(
            FLOW_TRIGGER_TYPE.BEFORE_SAVE,
            'account',
            [],
            FLOW_TRIGGER_SAVE_TYPE.CREATE
        );
        expect(runQuerySelector(nodeComponent, selectors.triggerLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementTrigger '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedTrigger).textContent).toBe(
            'FlowBuilderStartEditor.recordTriggerTypeCreated'
        );
        expect(runQuerySelector(nodeComponent, selectors.edit).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );

        expect(runQuerySelector(nodeComponent, selectors.runFlow).textContent).toBe(
            'FlowBuilderCanvasElement.startElementRunFlowFlowBuilderStartEditor.triggerTypeBeforeSave'
        );
    });

    it('Checks if configured before record changed trigger button rendered correctly on update', () => {
        const nodeComponent = createComponentUnderTest(
            FLOW_TRIGGER_TYPE.BEFORE_SAVE,
            'account',
            [],
            FLOW_TRIGGER_SAVE_TYPE.UPDATE
        );
        expect(runQuerySelector(nodeComponent, selectors.triggerLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementTrigger '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedTrigger).textContent).toBe(
            'FlowBuilderStartEditor.recordTriggerTypeUpdated'
        );
        expect(runQuerySelector(nodeComponent, selectors.edit).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );

        expect(runQuerySelector(nodeComponent, selectors.runFlow).textContent).toBe(
            'FlowBuilderCanvasElement.startElementRunFlowFlowBuilderStartEditor.triggerTypeBeforeSave'
        );
    });

    it('Checks if configured before record changed trigger button rendered correctly on update or create', () => {
        const nodeComponent = createComponentUnderTest(
            FLOW_TRIGGER_TYPE.BEFORE_SAVE,
            'account',
            [],
            FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE
        );
        expect(runQuerySelector(nodeComponent, selectors.triggerLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementTrigger '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedTrigger).textContent).toBe(
            'FlowBuilderStartEditor.recordTriggerTypeCreatedOrUpdated'
        );
        expect(runQuerySelector(nodeComponent, selectors.edit).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );

        expect(runQuerySelector(nodeComponent, selectors.runFlow).textContent).toBe(
            'FlowBuilderCanvasElement.startElementRunFlowFlowBuilderStartEditor.triggerTypeBeforeSave'
        );
    });

    it('Checks if configured after record changed trigger button rendered correctly on update or create', () => {
        const nodeComponent = createComponentUnderTest(
            FLOW_TRIGGER_TYPE.AFTER_SAVE,
            'account',
            [],
            FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE
        );
        expect(runQuerySelector(nodeComponent, selectors.triggerLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementTrigger '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedTrigger).textContent).toBe(
            'FlowBuilderStartEditor.recordTriggerTypeCreatedOrUpdated'
        );
        expect(runQuerySelector(nodeComponent, selectors.edit).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );

        expect(runQuerySelector(nodeComponent, selectors.runFlow).textContent).toBe(
            'FlowBuilderCanvasElement.startElementRunFlowFlowBuilderStartEditor.triggerTypeAfterSave'
        );
    });

    it('Checks if configured before delete record change trigger button rendered correctly on delete', () => {
        const nodeComponent = createComponentUnderTest(
            FLOW_TRIGGER_TYPE.BEFORE_DELETE,
            'account',
            [],
            FLOW_TRIGGER_SAVE_TYPE.DELETE
        );
        expect(runQuerySelector(nodeComponent, selectors.triggerLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementTrigger '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedTrigger).textContent).toBe(
            'FlowBuilderStartEditor.recordTriggerTypeDeleted'
        );
        expect(runQuerySelector(nodeComponent, selectors.edit).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );

        expect(runQuerySelector(nodeComponent, selectors.runFlow).textContent).toBe(
            'FlowBuilderCanvasElement.startElementRunFlowFlowBuilderStartEditor.triggerTypeBeforeDelete'
        );
    });

    it('Checks if configured scheduled button rendered correctly', () => {
        const nodeComponent = createComponentUnderTestWithSchedule(FLOW_TRIGGER_TYPE.SCHEDULED);
        expect(runQuerySelector(nodeComponent, selectors.flowStartLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementFlowStarts '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedFlowStart).textContent).toBe(
            'Fri, Mar 27, 2020, 12:30:00 AM, Once'
        );
        expect(runQuerySelector(nodeComponent, selectors.edit).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );

        expect(runQuerySelector(nodeComponent, selectors.runFlow).textContent).toBe(
            'FlowBuilderCanvasElement.startElementFrequencyOnce'
        );
    });

    it('Checks if configured journey button rendered correctly', () => {
        const nodeComponent = createComponentUnderTestWithSchedule(FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY);
        expect(runQuerySelector(nodeComponent, selectors.flowStartLabel).textContent).toBe(
            ' FlowBuilderCanvasElement.startElementFlowStarts '
        );
        expect(runQuerySelector(nodeComponent, selectors.selectedFlowStart).textContent).toBe(
            'Fri, Mar 27, 2020, 12:30:00 AM, Once'
        );
        expect(runQuerySelector(nodeComponent, selectors.edit).textContent).toBe(
            'FlowBuilderCanvasElement.startElementEdit'
        );

        expect(runQuerySelector(nodeComponent, selectors.runFlow).textContent).toBe(
            'FlowBuilderCanvasElement.startElementFrequencyOnce'
        );
    });

    it('Checks if an EditElementEvent is dispatched when button is clicked', () => {
        const nodeComponent = createComponentUnderTest(FLOW_TRIGGER_TYPE.BEFORE_SAVE);
        return Promise.resolve().then(() => {
            const callback = jest.fn();
            nodeComponent.addEventListener(EditElementEvent.EVENT_NAME, callback);
            nodeComponent.shadowRoot.querySelector(selectors.button).click();
            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls[0][0]).toMatchObject({
                detail: {
                    canvasElementGUID: nodeComponent.node.guid,
                    mode: FLOW_TRIGGER_TYPE.BEFORE_SAVE
                }
            });
        });
    });
});
