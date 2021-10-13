// @ts-nocheck
import { startElement as recordTriggeredStartElement } from 'mock/storeDataRecordTriggered';
import RecordTriggerStartNode from 'builder_platform_interaction/recordTriggerStartNode';
import { createElement } from 'lwc';
import {
    FLOW_TRIGGER_TYPE,
    FLOW_PROCESS_TYPE,
    FLOW_TRIGGER_SAVE_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { getProcessType } from 'builder_platform_interaction/storeUtils';

const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE } = FLOW_TRIGGER_TYPE;
const { CREATE, UPDATE, DELETE } = FLOW_TRIGGER_SAVE_TYPE;

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { Keys } = keyboardInteractionUtils;

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

const setupComponentUnderTest = (node) => {
    const element = createElement('builder_platform_interaction-record-trigger-start-node', {
        is: RecordTriggerStartNode
    });
    element.node = node;

    setDocumentBodyChildren(element);
    return element;
};

describe('record-trigger-start-node', () => {
    beforeEach(() => {
        // Some tests override the getProcessType return value
        // so reset at the beginning of each test
        getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
    });

    describe('Focus Management', () => {
        let startElement;
        beforeEach(() => {
            startElement = setupComponentUnderTest(recordTriggeredStartElement);
        });

        it('Should fire ArrowKeyDownEvent with the right key on pressing arrow down key', () => {
            const callback = jest.fn();
            startElement.addEventListener(ArrowKeyDownEvent.EVENT_NAME, callback);
            startElement.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls[0][0].detail.key).toBe(Keys.ArrowDown);
        });

        it('Should fire ArrowKeyDownEvent with the right key on pressing arrow up key', () => {
            const callback = jest.fn();
            startElement.addEventListener(ArrowKeyDownEvent.EVENT_NAME, callback);
            startElement.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls[0][0].detail.key).toBe(Keys.ArrowUp);
        });

        it('Checks if an EditElementEvent is dispatched when using the enter command', () => {
            return Promise.resolve().then(() => {
                const callback = jest.fn();
                startElement.addEventListener(EditElementEvent.EVENT_NAME, callback);
                startElement.shadowRoot.querySelector(selectors.context).focus();
                startElement.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
                expect(callback).toHaveBeenCalled();
            });
        });

        it('Checks if an EditElementEvent is dispatched when using the space command', () => {
            return Promise.resolve().then(() => {
                const callback = jest.fn();
                startElement.addEventListener(EditElementEvent.EVENT_NAME, callback);
                startElement.shadowRoot.querySelector(selectors.context).focus();
                startElement.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
                expect(callback).toHaveBeenCalled();
            });
        });

        it('Checks if an EditElementEvent is dispatched when clicked', () => {
            return Promise.resolve().then(() => {
                const callback = jest.fn();
                startElement.addEventListener(EditElementEvent.EVENT_NAME, callback);
                startElement.shadowRoot.querySelector(selectors.context).click();
                expect(callback).toHaveBeenCalled();
            });
        });
    });

    describe('When flow triggerType is AFTER_SAVE', () => {
        let startElement;
        beforeAll(() => {
            recordTriggeredStartElement.triggerType = AFTER_SAVE;
            recordTriggeredStartElement.recordTriggerType = UPDATE;
            startElement = setupComponentUnderTest(recordTriggeredStartElement);
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
        beforeAll(() => {
            recordTriggeredStartElement.triggerType = BEFORE_SAVE;
            recordTriggeredStartElement.recordTriggerType = CREATE;
            startElement = setupComponentUnderTest(recordTriggeredStartElement);
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
        beforeAll(() => {
            recordTriggeredStartElement.triggerType = BEFORE_DELETE;
            recordTriggeredStartElement.recordTriggerType = DELETE;
            startElement = setupComponentUnderTest(recordTriggeredStartElement);
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
            const startElement = setupComponentUnderTest(recordTriggeredStartElement);
            expect(runQuerySelector(startElement, selectors.runFlow)).not.toBeNull();
        });

        it('is not shown for process type Orchestrator', async () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);
            const startElement = setupComponentUnderTest(recordTriggeredStartElement);
            expect(runQuerySelector(startElement, selectors.runFlow)).toBeNull();
        });
    });
});
