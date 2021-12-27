// @ts-nocheck
import { query, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import {
    CONDITION_LOGIC,
    FLOW_PROCESS_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    FLOW_TRIGGER_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { updateAndValidateElementInPropertyEditor } from 'builder_platform_interaction/validation';
import { createElement } from 'lwc';
import RecordChangeTriggerEditor from '../recordChangeTriggerEditor';

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
    CONDITION_LOGIC: 'lightning-combobox.conditionLogic',
    CONTEXT_OBJECT_DESCRIPTION: '.test-context-object-description',
    SET_CONDITIONS_DESCRIPTION: '.test-set-conditions-description',
    REQUIRE_RECORD_CHANGE_OPTION_LABEL: '.test-require-record-change-option-label',
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
    FORMULA_BUILDER: 'builder_platform_interaction-resourced-textarea'
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
        getErrorsFromHydratedElement: jest.fn()
    });
});

jest.mock('builder_platform_interaction/validation', () => {
    const actual = jest.requireActual('builder_platform_interaction/validation');
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

    return Object.assign('', actual, {
        Validation,
        updateAndValidateElementInPropertyEditor: jest.fn((_, e) => e)
    });
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

    describe('updateAndValidateElementInPropertyEditor', () => {
        const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);

        it('is called for new node if ProcessType is Orchestrator', () => {
            getProcessType.mockReturnValueOnce(FLOW_PROCESS_TYPE.ORCHESTRATOR);
            createComponentForTest(startElement);
            expect(updateAndValidateElementInPropertyEditor.mock.calls[0][0]).toStrictEqual(undefined);
            expect(updateAndValidateElementInPropertyEditor.mock.calls[0][1]).toStrictEqual(startElement);
        });

        it('is called for existing node if ProcessType is Orchestrator', async () => {
            getProcessType.mockReturnValueOnce(FLOW_PROCESS_TYPE.ORCHESTRATOR);
            const startElementEditor = createComponentForTest(startElement);
            await ticks(1);

            const newNode = recordChangeTriggerElement(AFTER_SAVE, CREATE);
            getProcessType.mockReturnValueOnce(FLOW_PROCESS_TYPE.ORCHESTRATOR);
            startElementEditor.node = newNode;

            expect(updateAndValidateElementInPropertyEditor.mock.calls[1][0]).toStrictEqual(startElement);
            expect(updateAndValidateElementInPropertyEditor.mock.calls[1][1]).toStrictEqual(newNode);
        });

        it('is not called for other process types', () => {
            const startElement = recordChangeTriggerElement(BEFORE_SAVE, CREATE);
            createComponentForTest(startElement);

            expect(updateAndValidateElementInPropertyEditor).not.toHaveBeenCalled();
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

        describe('trigger when a record is deleted', () => {
            it('is not shown for process type Orchestrator', async () => {
                getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);

                const startElement = recordChangeTriggerElement(AFTER_SAVE, CREATE);
                const element = createComponentForTest(startElement);

                await ticks(1);

                const recordTriggerOptions = element.shadowRoot.querySelector(SELECTORS.SAVE_TYPE_SECTION).options;
                const deleteOption = recordTriggerOptions.find((option) => option.value === DELETE);
                expect(deleteOption).toBeUndefined();
            });
            it('is shown for other process types', async () => {
                const startElement = recordChangeTriggerElement(AFTER_SAVE, CREATE);
                const element = createComponentForTest(startElement);

                await ticks(1);

                const recordTriggerOptions = element.shadowRoot.querySelector(SELECTORS.SAVE_TYPE_SECTION).options;
                const deleteOption = recordTriggerOptions.find((option) => option.value === DELETE);
                expect(deleteOption).not.toBeUndefined();
            });
        });

        describe('labels', () => {
            it('labels are rendered correctly for process type Orchestrator', async () => {
                getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);

                const startElement = recordChangeTriggerElement(AFTER_SAVE, UPDATE);
                const element = createComponentForTest(startElement);

                await ticks(1);
                expect(element.shadowRoot.querySelector(SELECTORS.CONTEXT_OBJECT_DESCRIPTION).textContent).toBe(
                    'FlowBuilderStartEditor.recordChangeContextObjectDescriptionOrchestrator'
                );
                expect(element.shadowRoot.querySelector(SELECTORS.SAVE_TYPE_SECTION).label).toBe(
                    'FlowBuilderStartEditor.createOrUpdateInputLabelOrchestrator'
                );
                expect(element.shadowRoot.querySelector(SELECTORS.SET_CONDITIONS_DESCRIPTION).value).toBe(
                    'FlowBuilderStartEditor.setConditionsDescriptionOrchestrator'
                );
                expect(element.shadowRoot.querySelector(SELECTORS.REQUIRE_RECORD_CHANGE_OPTION_LABEL).textContent).toBe(
                    'FlowBuilderRecordEditor.requireRecordChangeOptionOrchestrator'
                );
            });
            it('labels are rendered correctly for for other process types', async () => {
                const startElement = recordChangeTriggerElement(AFTER_SAVE, UPDATE);
                const element = createComponentForTest(startElement);

                await ticks(1);
                expect(element.shadowRoot.querySelector(SELECTORS.CONTEXT_OBJECT_DESCRIPTION).textContent).toBe(
                    'FlowBuilderStartEditor.recordChangeContextObjectDescription'
                );
                expect(element.shadowRoot.querySelector(SELECTORS.SAVE_TYPE_SECTION).label).toBe(
                    'FlowBuilderStartEditor.createOrUpdateInputLabel'
                );
                expect(element.shadowRoot.querySelector(SELECTORS.SET_CONDITIONS_DESCRIPTION).value).toBe(
                    'FlowBuilderStartEditor.setConditionsDescription'
                );
                expect(element.shadowRoot.querySelector(SELECTORS.REQUIRE_RECORD_CHANGE_OPTION_LABEL).textContent).toBe(
                    'FlowBuilderRecordEditor.requireRecordChangeOption'
                );
            });
        });
    });

    describe('ui', () => {
        it('should focus on entity-resource-picker when the editor calls focus', () => {
            const editor = createComponentForTest(recordChangeTriggerElement(BEFORE_SAVE, CREATE));
            const entityResourcePicker = editor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
            entityResourcePicker.focus = jest.fn();

            editor.focus();
            expect(entityResourcePicker.focus).toHaveBeenCalled();
        });
    });

    describe('condition logic formula evaluates to true', () => {
        it('formula builder is displayed when the formula logic is selected', async () => {
            const element = createComponentForTest(recordChangeTriggerElement(AFTER_SAVE, CREATE));
            await ticks(1);

            // show formula builder when "formula evaluates to true" option is selected
            let event = new CustomEvent('propertychanged', {
                detail: {
                    propertyName: 'filterLogic',
                    value: 'formula_evaluates_to_true'
                }
            });
            let recordFilterCmp = element.shadowRoot.querySelector(SELECTORS.RECORD_ENTRY_CONDITIONS);
            recordFilterCmp.dispatchEvent(event);
            await ticks(1);
            let formulaBuilder = element.shadowRoot.querySelector(SELECTORS.FORMULA_BUILDER);
            expect(formulaBuilder).not.toBeNull();

            // hide formula builder when "formula evaluates to true" option is not selected anymore
            event = new CustomEvent('propertychanged', {
                detail: {
                    propertyName: 'filterLogic',
                    value: 'and'
                }
            });
            recordFilterCmp = element.shadowRoot.querySelector(SELECTORS.RECORD_ENTRY_CONDITIONS);
            recordFilterCmp.dispatchEvent(event);
            await ticks(1);
            formulaBuilder = element.shadowRoot.querySelector(SELECTORS.FORMULA_BUILDER);
            expect(formulaBuilder).toBeNull();
        });
    });
});
