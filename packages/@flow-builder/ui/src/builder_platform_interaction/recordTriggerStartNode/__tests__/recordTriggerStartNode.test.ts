// @ts-nocheck
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { EditElementEvent } from 'builder_platform_interaction/events';
import {
    FLOW_PROCESS_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    FLOW_TRIGGER_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { startElement as recordTriggeredStartElement } from 'mock/storeDataRecordTriggered';

const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE } = FLOW_TRIGGER_TYPE;
const { CREATE, UPDATE, DELETE } = FLOW_TRIGGER_SAVE_TYPE;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));
jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getProcessType: jest.fn()
    };
});

const selectors = {
    context: '.context',
    objectLabel: '.test-object-label',
    selectedObject: '.test-selected-object',
    editLabel: '.test-edit-label',
    triggerLabel: '.test-trigger-label',
    selectedTriggerLabel: '.test-selected-trigger-label',
    recordConditionsLabel: '.test-record-conditions-label',
    conditionsLengthLabel: '.test-conditions-length-label',
    runFlow: '.test-run-flow',
    runFlowLabel: '.test-run-flow-label',
    selectedRunFlowLabel: '.test-selected-run-flow-label'
};

const runQuerySelector = (context, selector) => {
    return context.shadowRoot.querySelector(selector);
};

const defaultOptions = {
    node: recordTriggeredStartElement
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-record-trigger-start-node', defaultOptions, overrideOptions);
};

describe('record-trigger-start-node', () => {
    beforeEach(() => {
        // Some tests override the getProcessType return value
        // so reset at the beginning of each test
        getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
    });

    describe('Focus Management', () => {
        let startElement;
        beforeEach(async () => {
            startElement = await createComponentUnderTest();
        });

        it('Checks if an EditElementEvent is dispatched when using the enter command', () => {
            return Promise.resolve().then(() => {
                const callback = jest.fn();
                startElement.addEventListener(EditElementEvent.EVENT_NAME, callback);
                startElement.performAction();
                expect(callback).toHaveBeenCalled();
            });
        });

        it('Checks if an EditElementEvent is dispatched when using the space command', () => {
            return Promise.resolve().then(() => {
                const callback = jest.fn();
                startElement.addEventListener(EditElementEvent.EVENT_NAME, callback);
                startElement.performAction();
                expect(callback).toHaveBeenCalled();
            });
        });

        it('Checks if an EditElementEvent is dispatched when clicked', () => {
            return Promise.resolve().then(() => {
                const callback = jest.fn();
                startElement.addEventListener(EditElementEvent.EVENT_NAME, callback);
                startElement.performAction();
                expect(callback).toHaveBeenCalled();
            });
        });
    });

    describe('When disableEditElements is true', () => {
        let startElement;
        beforeEach(async () => {
            startElement = await createComponentUnderTest({ disableEditElements: true });
        });

        it('Edit label should be absent', async () => {
            expect(runQuerySelector(startElement, selectors.editLabel)).toBeNull();
        });
    });

    describe('When flow triggerType is AFTER_SAVE', () => {
        let startElement;
        beforeAll(async () => {
            recordTriggeredStartElement.triggerType = AFTER_SAVE;
            recordTriggeredStartElement.recordTriggerType = UPDATE;
            startElement = await createComponentUnderTest();
        });

        it('Checks static labels rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.objectLabel)).toBeDefined();
            expect(runQuerySelector(startElement, selectors.editLabel)).toBeDefined();
            expect(runQuerySelector(startElement, selectors.triggerLabel)).toBeDefined();
            expect(runQuerySelector(startElement, selectors.recordConditionsLabel)).toBeDefined();
            expect(runQuerySelector(startElement, selectors.runFlowLabel)).toBeDefined();
        });

        it('Checks if selectedObject rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.selectedObject).textContent).toBe('Account');
        });

        it('Checks if selectedTriggerLabel rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.selectedTriggerLabel).textContent).toBe(
                'FlowBuilderStartEditor.recordTriggerTypeUpdated'
            );
        });

        it('Checks if conditionsLengthLabel rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.conditionsLengthLabel).textContent).toBe('1');
        });

        it('Checks if selectedRunFlowLabel rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.selectedRunFlowLabel).textContent).toBe(
                'FlowBuilderStartEditor.recordChangeTriggerTypeAfterSave'
            );
        });
    });

    describe('When flow triggerType is BEFORE_SAVE', () => {
        let startElement;
        beforeAll(async () => {
            recordTriggeredStartElement.triggerType = BEFORE_SAVE;
            recordTriggeredStartElement.recordTriggerType = CREATE;
            startElement = await createComponentUnderTest();
        });

        it('Checks if selectedTriggerLabel rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.selectedTriggerLabel).textContent).toBe(
                'FlowBuilderStartEditor.recordTriggerTypeCreated'
            );
        });

        it('Checks if selectedRunFlowLabel rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.selectedRunFlowLabel).textContent).toBe(
                'FlowBuilderStartEditor.recordChangeTriggerTypeBeforeSave'
            );
        });
    });

    describe('When flow triggerType is BEFORE_DELETE', () => {
        let startElement;
        beforeAll(async () => {
            recordTriggeredStartElement.triggerType = BEFORE_DELETE;
            recordTriggeredStartElement.recordTriggerType = DELETE;
            startElement = await createComponentUnderTest();
        });

        it('Checks if selectedTriggerLabel rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.selectedTriggerLabel).textContent).toBe(
                'FlowBuilderStartEditor.recordTriggerTypeDeleted'
            );
        });

        it('Checks if selectedRunFlowLabel rendered correctly', () => {
            expect(runQuerySelector(startElement, selectors.selectedRunFlowLabel).textContent).toBe(
                'FlowBuilderStartEditor.triggerTypeBeforeDelete'
            );
        });
    });

    describe('run flow', () => {
        it('is shown for other process types', async () => {
            const startElement = await createComponentUnderTest();
            expect(runQuerySelector(startElement, selectors.runFlow)).not.toBeNull();
        });

        it('is not shown for process type Orchestrator', async () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);
            const startElement = await createComponentUnderTest();
            expect(runQuerySelector(startElement, selectors.runFlow)).toBeNull();
        });
    });
});
