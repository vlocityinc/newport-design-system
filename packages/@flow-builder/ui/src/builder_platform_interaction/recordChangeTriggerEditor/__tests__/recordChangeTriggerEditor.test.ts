// @ts-nocheck
import { createElement } from 'lwc';
import {
    CONDITION_LOGIC,
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    FLOW_PROCESS_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { query, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import RecordChangeTriggerEditor from '../recordChangeTriggerEditor';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import { mergeErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { Validation } from 'builder_platform_interaction/validation';

const { AFTER_SAVE, BEFORE_DELETE, BEFORE_SAVE } = FLOW_TRIGGER_TYPE;
const { CREATE, UPDATE, DELETE } = FLOW_TRIGGER_SAVE_TYPE;

const SELECTORS = {
    SAVE_TYPE_SECTION: 'lightning-radio-group.recordCreateOrUpdate',
    TRIGGER_TYPE_SELECTION: 'builder_platform_interaction-visual-picker-list',
    BEFORE_DELETE_INFO_BOX: 'div.beforeDeleteInfo',
    RUN_ASYNC_CHECKBOX: 'lightning-input.test-input-selection-checkbox',
    REQUIRE_RECORD_CHANGE_OPTION: 'div.test-require-record-change-option',
    RECORD_ENTRY_CONDITIONS: 'builder_platform_interaction-record-filter',
    CONDITION_LIST: 'builder_platform_interaction-condition-list',
    CONDITION_LOGIC: 'lightning-combobox.conditionLogic'
};

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn(),
        isExecuteOnlyWhenChangeMatchesConditionsPossible: jest.fn().mockReturnValue(true),
        getProcessType: jest.fn()
    };
});

jest.mock('builder_platform_interaction/preloadLib', () => {
    return {
        loadOperatorsAndRulesOnTriggerTypeChange: jest.fn()
    };
});

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');

    return Object.assign({}, actual, {
        mergeErrorsFromHydratedElement: jest.fn((e) => e),
        getErrorsFromHydratedElement: jest.fn()
    });
});

jest.mock('builder_platform_interaction/validation', () => {
    const mockValidateAll = jest.fn((state) => state);
    const mockValidateProperty = jest.fn(() => {
        return null;
    });

    const Validation = function () {
        return {
            validateAll: mockValidateAll,
            validateProperty: mockValidateProperty
        };
    };

    return {
        Validation
    };
});

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-change-trigger-editor', {
        is: RecordChangeTriggerEditor
    });

    Object.assign(el, { node });

    setDocumentBodyChildren(el);
    return el;
}

function createRecordTriggerCustomEvent(recordTriggerType) {
    const event = new CustomEvent('change', {
        detail: {
            value: recordTriggerType
        }
    });
    return event;
}

function recordChangeTriggerElement(flowTriggerType, recordTriggerType) {
    const triggerStartElement = {
        elementType: 'START_ELEMENT',
        guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
        triggerType: { value: flowTriggerType, error: null },
        recordTriggerType: { value: recordTriggerType, error: null },
        scheduledPaths: [],
        description: { value: '', error: null },
        isCanvasElement: true,
        label: { value: '', error: null },
        name: { value: '', error: null },
        object: { value: 'Account', error: null },
        objectIndex: { value: 'guid', error: null },
        filterLogic: { value: CONDITION_LOGIC.AND, error: null },
        filters: []
    };

    return triggerStartElement;
}

describe('record-change-trigger-editor', () => {
    beforeEach(() => {
        // Some tests override the getProcessType return value
        // so reset at the beginning of each test
        getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
    });

    describe('mergeErrorsFromHydratedElement', () => {
        const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);

        it('is called for new node', () => {
            createComponentForTest(startElement);
            expect(mergeErrorsFromHydratedElement).toHaveBeenCalledWith(startElement, undefined);
        });

        it('is called for existing node', async () => {
            const startElementEditor = createComponentForTest(startElement);
            await ticks(1);

            const newNode = recordChangeTriggerElement(AFTER_SAVE, CREATE);
            startElementEditor.node = newNode;

            expect(mergeErrorsFromHydratedElement).toHaveBeenCalledWith(newNode, startElement);
        });
    });

    describe('validation', () => {
        it('is called for new node if ProcessType is Orchestrator', () => {
            getProcessType.mockReturnValueOnce(FLOW_PROCESS_TYPE.ORCHESTRATOR);

            const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);
            createComponentForTest(startElement);

            const validator = new Validation();
            expect(validator.validateAll).toHaveBeenCalled();
        });
        it('is not called for new node for other process types', () => {
            const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);
            createComponentForTest(startElement);

            const validator = new Validation();
            expect(validator.validateAll).not.toHaveBeenCalled();
        });
    });

    describe('hasError state changes', () => {
        it('sets hashError from undefined to true, then from true to false', async () => {
            const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);
            const startElementEditor = createComponentForTest(startElement);
            await ticks(1);

            expect.assertions(2);
            const eventCallback = jest.fn();
            startElementEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, eventCallback);

            let newNode = recordChangeTriggerElement(AFTER_SAVE, CREATE);
            newNode.config = { hasError: true };
            startElementEditor.node = newNode;
            expect(eventCallback.mock.calls[0][0].detail.node).toEqual(newNode);

            newNode = recordChangeTriggerElement(AFTER_SAVE, CREATE);
            newNode.config = { hasError: false };
            startElementEditor.node = newNode;
            expect(eventCallback.mock.calls[1][0].detail.node).toEqual(newNode);
        });
    });

    it('handles recordTriggerType updates', async () => {
        const element = createComponentForTest(recordChangeTriggerElement(BEFORE_SAVE, CREATE));
        const event = new CustomEvent('change', {
            detail: {
                value: UPDATE
            }
        });
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(event);
        await ticks(1);
        expect(element.node.recordTriggerType.value).toBe(UPDATE);
        const requireRecordChangeOptions = element.shadowRoot.querySelector(SELECTORS.REQUIRE_RECORD_CHANGE_OPTION);
        expect(requireRecordChangeOptions).not.toBeUndefined();
    });

    it('handles typeBeforeSave get selected', () => {
        const element = createComponentForTest(recordChangeTriggerElement(BEFORE_SAVE, CREATE));
        const event = new CustomEvent('visualpickerlistchanged', {
            detail: {
                items: [{ id: BEFORE_SAVE, isSelected: true }]
            }
        });
        query(element, SELECTORS.TRIGGER_TYPE_SELECTION).dispatchEvent(event);

        expect(element.node.triggerType.value).toBe(BEFORE_SAVE);
        expect(query(element, SELECTORS.BEFORE_DELETE_INFO_BOX)).toBeNull();
    });

    it('handles typeAfterSave get selected', () => {
        const element = createComponentForTest(recordChangeTriggerElement(BEFORE_SAVE, CREATE));
        const event = new CustomEvent('visualpickerlistchanged', {
            detail: {
                items: [{ id: AFTER_SAVE, isSelected: true }]
            }
        });
        query(element, SELECTORS.TRIGGER_TYPE_SELECTION).dispatchEvent(event);

        expect(element.node.triggerType.value).toBe(AFTER_SAVE);
        expect(query(element, SELECTORS.BEFORE_DELETE_INFO_BOX)).toBeNull();
    });

    it('Verify Delete record trigger type auto selects Before Delete as the Flow Trigger', () => {
        const element = createComponentForTest(recordChangeTriggerElement(BEFORE_SAVE, CREATE));
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(createRecordTriggerCustomEvent(DELETE));
        // Setting the record trigger type to Delete should automatically select Before Delete flow trigger type
        expect(element.node.recordTriggerType.value).toBe(DELETE);
        expect(element.node.triggerType.value).toBe(BEFORE_DELETE);
        expect(query(element, SELECTORS.BEFORE_DELETE_INFO_BOX)).toBeDefined();
    });

    it('Verify switching from delete to create auto selects previously selected Flow Trigger type', () => {
        const element = createComponentForTest(recordChangeTriggerElement(AFTER_SAVE, CREATE));
        // Switch to Delete
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(createRecordTriggerCustomEvent(DELETE));

        // Switch to Create
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(createRecordTriggerCustomEvent(CREATE));
        // Setting the record trigger type to Create should automatically select the flow trigger type which was prior to selecting
        // Delete. In this case, the recordChangeTriggerElement is defined as After Save, so selecting from delete to create
        // should select Before Save as the flow trigger type
        expect(element.node.recordTriggerType.value).toBe(CREATE);
        expect(element.node.triggerType.value).toBe(AFTER_SAVE);
    });

    it('Verify switching from delete to create auto selects Flow Trigger type to After Save if Flow Trigger type is found as null in the start element', () => {
        const element = createComponentForTest(recordChangeTriggerElement(null, DELETE));

        // Switch to Create
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(createRecordTriggerCustomEvent(CREATE));
        // Setting the record trigger type to Create should automatically select the flow trigger type to Before Save if Flow trigger type
        // is found as null.. Ideally, this shouldn't happen, but a negative test case to ensure Flow Trigger Type is always set to a valid
        // trigger type value and doesn't leave the start element in invalid state
        expect(element.node.recordTriggerType.value).toBe(CREATE);
        expect(element.node.triggerType.value).toBe(AFTER_SAVE);
    });

    describe('choose trigger type', () => {
        it('is not shown for process type Orchestrator', async () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);

            const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);
            const element = createComponentForTest(startElement);

            await ticks(1);

            const requireRecordChangeOptions = element.shadowRoot.querySelector(SELECTORS.TRIGGER_TYPE_SELECTION);
            expect(requireRecordChangeOptions).toBeNull();
        });
        it('is shown for other process types', async () => {
            const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);
            const element = createComponentForTest(startElement);

            await ticks(1);

            const requireRecordChangeOptions = element.shadowRoot.querySelector(SELECTORS.TRIGGER_TYPE_SELECTION);
            expect(requireRecordChangeOptions).not.toBeNull();
        });
    });

    describe('run on success', () => {
        it('is not shown for process type Orchestrator', async () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);

            const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);
            const element = createComponentForTest(startElement);

            await ticks(1);

            const requireRecordChangeOptions = element.shadowRoot.querySelector(SELECTORS.RUN_ASYNC_CHECKBOX);
            expect(requireRecordChangeOptions).toBeNull();
        });
        it('is shown for other process types', async () => {
            const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);
            const element = createComponentForTest(startElement);

            await ticks(1);

            const requireRecordChangeOptions = element.shadowRoot.querySelector(SELECTORS.RUN_ASYNC_CHECKBOX);
            expect(requireRecordChangeOptions).not.toBeNull();
        });
    });

    describe('UpdateNodeEvent', () => {
        it('dispatched on handleTypeBeforeSave', async () => {
            expect.assertions(1);
            const element = createComponentForTest(recordChangeTriggerElement(BEFORE_SAVE, CREATE));
            const updateNodeCallback = jest.fn();
            element.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            await ticks(1);

            const event = new CustomEvent('visualpickerlistchanged', {
                detail: {
                    items: [{ id: BEFORE_SAVE, isSelected: true }]
                }
            });
            query(element, SELECTORS.TRIGGER_TYPE_SELECTION).dispatchEvent(event);

            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: element.getNode() }
                })
            );
        });
        it('dispatched on handleTypeBeforeDelete', async () => {
            expect.assertions(1);
            const element = createComponentForTest(recordChangeTriggerElement(null, DELETE));

            const updateNodeCallback = jest.fn();
            element.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            await ticks(1);

            query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(createRecordTriggerCustomEvent(DELETE));

            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: element.getNode() }
                })
            );
        });

        it('dispatched on handleTypeAfterSave', async () => {
            expect.assertions(1);
            const element = createComponentForTest(recordChangeTriggerElement(BEFORE_SAVE, CREATE));

            const updateNodeCallback = jest.fn();
            element.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            await ticks(1);

            const event = new CustomEvent('visualpickerlistchanged', {
                detail: {
                    items: [{ id: AFTER_SAVE, isSelected: true }]
                }
            });
            query(element, SELECTORS.TRIGGER_TYPE_SELECTION).dispatchEvent(event);

            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: element.getNode() }
                })
            );
        });

        it('dispatched on togglerunAsync', async () => {
            expect.assertions(1);
            const element = createComponentForTest(recordChangeTriggerElement(AFTER_SAVE, CREATE));

            const updateNodeCallback = jest.fn();
            element.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            await ticks(1);

            const event = new CustomEvent('change', {
                detail: {
                    value: true
                }
            });
            query(element, SELECTORS.RUN_ASYNC_CHECKBOX).dispatchEvent(event);

            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: element.getNode() }
                })
            );
        });

        it('conditionLogic is present and disabled when record trigger criteria is not met anymore', async () => {
            expect.assertions(3);
            const startElement = recordChangeTriggerElement(AFTER_SAVE, CREATE);
            startElement.object = '';
            const element = createComponentForTest(startElement);
            const recordEntryConditions = element.shadowRoot.querySelector(SELECTORS.RECORD_ENTRY_CONDITIONS);
            const conditionList = recordEntryConditions.shadowRoot.querySelector(SELECTORS.CONDITION_LIST);
            const conditionLogic = conditionList.shadowRoot.querySelector(SELECTORS.CONDITION_LOGIC);
            expect(recordEntryConditions).not.toBeNull();
            expect(conditionLogic).not.toBeNull();
            expect(conditionLogic.disabled).toBe(true);
        });
    });
});
