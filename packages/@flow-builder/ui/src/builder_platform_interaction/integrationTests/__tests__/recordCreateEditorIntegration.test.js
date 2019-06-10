import { createElement } from 'lwc';
import RecordCreateEditor from 'builder_platform_interaction/recordCreateEditor';
import { resolveRenderCycles } from '../resolveRenderCycles';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    focusoutEvent,
    changeComboboxValue,
    getLabelDescriptionLabelElement,
    getLabelDescriptionNameElement,
    expectGroupedComboboxItem,
    getEntityResourcePicker,
    getFieldToFerovExpressionBuilders,
    getBaseExpressionBuilder,
    getRadioGroup
} from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    EditElementEvent,
    AddElementEvent
} from 'builder_platform_interaction/events';
import { mockEntities } from 'mock/serverEntityData';
import { setRules } from 'builder_platform_interaction/ruleLib';
import { setEntities } from 'builder_platform_interaction/sobjectLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import {
    flowWithCreateRecordUsingSObject,
    flowWithCreateRecordUsingSObjectCollection,
    flowWithCreateRecordUsingFields
} from 'mock/flows/flowWithCreateRecord';
import { mockAllRules } from 'mock/ruleService';
import {
    setGlobalVariables,
    setSystemVariables
} from 'builder_platform_interaction/systemLib';
import {
    globalVariableTypes,
    globalVariables,
    systemVariables
} from 'mock/systemGlobalVars';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS,
    SOBJECT_OR_SOBJECT_COLLECTION_PICKER:
        'builder_platform_interaction-sobject-or-sobject-collection-picker',
    RECORD_STORE_OPTION: 'builder_platform_interaction-record-store-options',
    RECORD_INPUT_OUTPUT_ASSIGNMENTS:
        'builder_platform_interaction-record-input-output-assignments'
};

const VALIDATION_ERROR_MESSAGES = {
    GENERIC: 'FlowBuilderCombobox.genericErrorMessage',
    ...FLOW_BUILDER_VALIDATION_ERROR_MESSAGES
};

const getSObjectOrSObjectCollectionPicker = recordEditor => {
    return recordEditor.shadowRoot.querySelector(
        SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
    );
};

const getRecordStoreOption = recordEditor => {
    return recordEditor.shadowRoot.querySelector(SELECTORS.RECORD_STORE_OPTION);
};

const getInputOutputAssignments = recordEditor => {
    return recordEditor.shadowRoot.querySelector(
        SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS
    );
};

const getResourceGroupedCombobox = editor => {
    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
        editor
    );
    const ferovResourcePicker = sObjectOrSObjectCollectionPicker.shadowRoot.querySelector(
        SELECTORS.FEROV_RESOURCE_PICKER
    );
    const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
        SELECTORS.BASE_RESOURCE_PICKER
    );
    const interactionCombobox = baseResourcePicker.shadowRoot.querySelector(
        SELECTORS.INTERACTION_COMBOBOX
    );
    return interactionCombobox.shadowRoot.querySelector(
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
};

const getEntityResourcePickerComboboxElement = entityResourcePicker => {
    const resourcePicker = entityResourcePicker.shadowRoot.querySelector(
        SELECTORS.BASE_RESOURCE_PICKER
    );
    const combobox = resourcePicker.shadowRoot.querySelector(
        SELECTORS.COMBOBOX
    );
    const lightningGroupCombobox = combobox.shadowRoot.querySelector(
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
    return lightningGroupCombobox;
};

const getExpressionBuilderComboboxElement = expressionBuilder => {
    const interactionCombobox = expressionBuilder.shadowRoot.querySelector(
        SELECTORS.INTERACTION_COMBOBOX
    );
    return interactionCombobox.shadowRoot.querySelector(
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
};

const getOutputResourcePicker = recordEditor => {
    return recordEditor.shadowRoot.querySelector(
        SELECTORS.OUTPUT_RESOURCE_PICKER
    );
};

const createComponentForTest = (
    node,
    { mode = EditElementEvent.EVENT_NAME } = ''
) => {
    const el = createElement(
        'builder_platform_interaction-record-create-editor',
        { is: RecordCreateEditor }
    );
    Object.assign(el, { node, mode });
    document.body.appendChild(el);
    return el;
};

describe('Record Create Editor', () => {
    let recordCreateNode;
    let store;
    let uiFlow;
    beforeAll(() => {
        setRules(JSON.stringify(mockAllRules));
        setEntities(JSON.stringify(mockEntities));
        setGlobalVariables({ globalVariableTypes, globalVariables });
        setSystemVariables(systemVariables);
        store = Store.getStore(reducer);
    });
    afterAll(() => {
        // reset rules
        setRules();
        // TODO : fix setEntities (currently does not reset)
        setEntities();
        setSystemVariables();
        setGlobalVariables({ globalVariableTypes: [], globalVariables: [] });
    });
    describe('name and dev name', () => {
        beforeAll(() => {
            uiFlow = translateFlowToUIModel(flowWithCreateRecordUsingSObject);
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
        });
        beforeEach(() => {
            const element = getElementByDevName('Create_Record_Using_SObject');
            recordCreateNode = getElementForPropertyEditor(element);
        });
        it('do not change devName if it already exists after the user modifies the name', () => {
            const newLabel = 'new label';
            const recordCreateElement = createComponentForTest(
                recordCreateNode
            );
            return resolveRenderCycles(() => {
                const labelInput = getLabelDescriptionLabelElement(
                    recordCreateElement
                );
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(recordCreateElement.node.label.value).toBe(newLabel);
                    expect(recordCreateElement.node.name.value).toBe(
                        'Create_Record_Using_SObject'
                    );
                });
            });
        });
        it('modify the dev name', () => {
            const newDevName = 'newName';
            const recordCreateElement = createComponentForTest(
                recordCreateNode
            );
            return resolveRenderCycles(() => {
                const devNameInput = getLabelDescriptionNameElement(
                    recordCreateElement
                );
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(recordCreateElement.node.name.value).toBe(
                        newDevName
                    );
                });
            });
        });
        it('display error if name is cleared', () => {
            const newLabel = '';
            const recordCreateElement = createComponentForTest(
                recordCreateNode
            );
            return resolveRenderCycles(() => {
                const labelInput = getLabelDescriptionLabelElement(
                    recordCreateElement
                );
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(recordCreateElement.node.label.error).toBe(
                        VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                });
            });
        });
        it('display error if devName is cleared', () => {
            const newDevName = '';
            const recordCreateElement = createComponentForTest(
                recordCreateNode
            );
            return resolveRenderCycles(() => {
                const devNameInput = getLabelDescriptionNameElement(
                    recordCreateElement
                );
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(recordCreateElement.node.name.error).toBe(
                        VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                });
            });
        });
    });
    describe('Add new element', () => {
        let recordCreateElement;
        beforeEach(() => {
            recordCreateNode = getElementForPropertyEditor({
                locationX: 10,
                locationY: 10,
                elementType: ELEMENT_TYPE.RECORD_CREATE
            });
            recordCreateElement = createComponentForTest(
                recordCreateNode,
                AddElementEvent.EVENT_NAME
            );
        });
        it('all field should be empty', () => {
            const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                recordCreateElement
            );
            return resolveRenderCycles(() => {
                expect(sObjectOrSObjectCollectionPickerElement.value).toBe('');
            });
        });
        it('record Store Option should have firstRecord and sObjectVariable selected', () => {
            const recordStoreElement = getRecordStoreOption(
                recordCreateElement
            );
            const radioGroupElement = getRadioGroup(recordStoreElement);
            return resolveRenderCycles(() => {
                expect(recordStoreElement.numberOfRecordsToStore).toBe(
                    'firstRecord'
                );
                expect(recordStoreElement.wayToStoreFields).toBe(
                    'sObjectVariable'
                );
                expect(
                    recordStoreElement.assignNullValuesIfNoRecordsFound
                ).toBe(false);
                expect(radioGroupElement).toHaveLength(2);
            });
        });
    });
    describe('Existing element', () => {
        describe('Working with sObject', () => {
            let recordCreateElement;
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(
                    flowWithCreateRecordUsingSObject
                );
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName(
                    'Create_Record_Using_SObject'
                );
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
            });
            it('store option should have sObjectVariable and firstRecord selected', () => {
                const recordStoreElement = getRecordStoreOption(
                    recordCreateElement
                );
                const radioGroupElement = getRadioGroup(recordStoreElement);
                return resolveRenderCycles(() => {
                    expect(recordStoreElement.numberOfRecordsToStore).toBe(
                        'firstRecord'
                    );
                    expect(recordStoreElement.wayToStoreFields).toBe(
                        'sObjectVariable'
                    );
                    expect(
                        recordStoreElement.assignNullValuesIfNoRecordsFound
                    ).toBe(false);
                    expect(radioGroupElement).toHaveLength(2);
                });
            });
            it('inputReference should be display ', () => {
                return resolveRenderCycles(() => {
                    const sObJectPicker = getSObjectOrSObjectCollectionPicker(
                        recordCreateElement
                    );
                    expect(sObJectPicker.value).toBe(
                        recordCreateElement.node.inputReference.value
                    );
                });
            });
            it('sObject Or SObject Collection Picker should contain "New Resource"', () => {
                const rhsGroupedCombobox = getResourceGroupedCombobox(
                    recordCreateElement
                );
                return resolveRenderCycles(() => {
                    expectGroupedComboboxItem(
                        rhsGroupedCombobox,
                        'FlowBuilderExpressionUtils.newResourceLabel'
                    );
                });
            });
        });
        describe('Working with sObject Collection', () => {
            let recordCreateElement;
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(
                    flowWithCreateRecordUsingSObjectCollection
                );
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName(
                    'Create_Record_Using_SObject_Collection'
                );
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
            });
            it('record store option should have "All records" selected and the second radio group element should be hidden', () => {
                const recordStoreElement = getRecordStoreOption(
                    recordCreateElement
                );
                const radioGroupElement = getRadioGroup(recordStoreElement);
                return resolveRenderCycles(() => {
                    expect(recordStoreElement.numberOfRecordsToStore).toBe(
                        'allRecords'
                    );
                    expect(radioGroupElement).toHaveLength(1);
                });
            });
            it('input reference should display The variable "vAccountCollection"', () => {
                const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                    recordCreateElement
                );
                return resolveRenderCycles(() => {
                    expect(sObjectOrSObjectCollectionPickerElement.value).toBe(
                        recordCreateElement.node.inputReference.value
                    );
                });
            });
            it('sObject Or SObject Collection Picker should contain "New Resource"', () => {
                const rhsGroupedCombobox = getResourceGroupedCombobox(
                    recordCreateElement
                );
                return resolveRenderCycles(() => {
                    expectGroupedComboboxItem(
                        rhsGroupedCombobox,
                        'FlowBuilderExpressionUtils.newResourceLabel'
                    );
                });
            });
        });
        describe('Working with fields', () => {
            let recordCreateElement;
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(
                    flowWithCreateRecordUsingFields
                );
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName(
                    'Create_Record_using_Fields'
                );
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
            });
            it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', () => {
                const recordStoreElement = getRecordStoreOption(
                    recordCreateElement
                );
                const radioGroupElement = getRadioGroup(recordStoreElement);
                return resolveRenderCycles(() => {
                    expect(recordStoreElement.numberOfRecordsToStore).toBe(
                        'firstRecord'
                    );
                    expect(recordStoreElement.wayToStoreFields).toBe(
                        'separateVariables'
                    );
                    expect(
                        recordStoreElement.assignNullValuesIfNoRecordsFound
                    ).toBe(false);
                    expect(radioGroupElement).toHaveLength(2);
                });
            });
            it('entity Resource picker should display the entity', () => {
                return resolveRenderCycles(() => {
                    const entityResourcePicker = getEntityResourcePicker(
                        recordCreateElement
                    );
                    expect(entityResourcePicker.value).toBe(
                        recordCreateElement.node.object.value
                    );
                });
            });
            it('assign Record Id To Reference should have a value', () => {
                return resolveRenderCycles(() => {
                    const outputResource = getOutputResourcePicker(
                        recordCreateElement
                    );
                    expect(outputResource.value.value).toBe(
                        recordCreateElement.node.assignRecordIdToReference.value
                    );
                });
            });
            it('removing the entity should hide input assignment but store option element should remained', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordCreateElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                changeComboboxValue(comboboxElement, '');
                return resolveRenderCycles(() => {
                    expect(recordCreateElement.node.object.error).toBe(
                        VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                    expect(
                        getInputOutputAssignments(recordCreateElement)
                    ).toBeNull();
                    const recordStoreElement = getRecordStoreOption(
                        recordCreateElement
                    );
                    const radioGroupElement = getRadioGroup(recordStoreElement);
                    expect(recordStoreElement.numberOfRecordsToStore).toBe(
                        'firstRecord'
                    );
                    expect(recordStoreElement.wayToStoreFields).toBe(
                        'separateVariables'
                    );
                    expect(
                        recordStoreElement.assignNullValuesIfNoRecordsFound
                    ).toBe(false);
                    expect(radioGroupElement).toHaveLength(2);
                });
            });
            it('enter an invalid value in the entity resource picker should not display other element but should display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordCreateElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                changeComboboxValue(comboboxElement, 'invalidValue');
                return resolveRenderCycles(() => {
                    expect(
                        getInputOutputAssignments(recordCreateElement)
                    ).toBeNull();
                    expect(
                        getOutputResourcePicker(recordCreateElement)
                    ).toBeNull();
                    expect(recordCreateElement.node.object.error).toBe(
                        VALIDATION_ERROR_MESSAGES.GENERIC
                    );
                });
            });
            it('enter an valid value in the entity resource picker should not display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordCreateElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                changeComboboxValue(comboboxElement, 'Case');
                return resolveRenderCycles(() => {
                    return resolveRenderCycles(() => {
                        expect(
                            recordCreateElement.node.object.error
                        ).toBeNull();
                        expect(
                            getInputOutputAssignments(recordCreateElement)
                        ).not.toBeNull();
                        expect(
                            getOutputResourcePicker(recordCreateElement)
                        ).not.toBeNull();
                    });
                });
            });
            describe('Input Assignments', () => {
                let inputAssignments;
                let fieldToFerovExpressionBuilder;
                let baseExpressionBuilder;
                beforeEach(() => {
                    inputAssignments = getInputOutputAssignments(
                        recordCreateElement
                    );
                    fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(
                        inputAssignments
                    );
                    baseExpressionBuilder = getBaseExpressionBuilder(
                        fieldToFerovExpressionBuilder[0]
                    );
                });
                it('input Assignments should be visible and correctly displayed', () => {
                    return resolveRenderCycles(() => {
                        expect(fieldToFerovExpressionBuilder).toHaveLength(2);
                        expect(baseExpressionBuilder.lhsValue).toBe(
                            'Account.BillingCity'
                        );
                        expect(
                            baseExpressionBuilder.operatorValue
                        ).toBeUndefined();
                        expect(baseExpressionBuilder.rhsValue).toMatchObject({
                            category:
                                'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                            dataType: 'String',
                            displayText: '{!vBillingCity}',
                            hasNext: false,
                            iconName: 'utility:text',
                            iconSize: 'xx-small',
                            subtype: null,
                            subText: 'FlowBuilderDataTypes.textDataTypeLabel',
                            text: 'vBillingCity',
                            type: 'option-card'
                        });
                        baseExpressionBuilder = getBaseExpressionBuilder(
                            fieldToFerovExpressionBuilder[1]
                        );
                        expect(baseExpressionBuilder.lhsValue).toBe(
                            'Account.Name'
                        );
                        expect(
                            baseExpressionBuilder.operatorValue
                        ).toBeUndefined();
                        expect(baseExpressionBuilder.rhsValue).toMatchObject({
                            category:
                                'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                            dataType: 'String',
                            displayText: '{!vName}',
                            hasNext: false,
                            iconName: 'utility:text',
                            iconSize: 'xx-small',
                            subtype: null,
                            subText: 'FlowBuilderDataTypes.textDataTypeLabel',
                            text: 'vName',
                            type: 'option-card'
                        });
                    });
                });
                it('Removing the selected field should not change the value if the RHS has a value', () => {
                    const combobox = getExpressionBuilderComboboxElement(
                        baseExpressionBuilder
                    );
                    changeComboboxValue(combobox, '');
                    return resolveRenderCycles(() => {
                        expect(fieldToFerovExpressionBuilder).toHaveLength(2);
                        baseExpressionBuilder = getBaseExpressionBuilder(
                            fieldToFerovExpressionBuilder[0]
                        );
                        expect(baseExpressionBuilder.lhsValue).toBe(
                            'Account.BillingCity'
                        );
                    });
                });
            });
        });
    });
});
