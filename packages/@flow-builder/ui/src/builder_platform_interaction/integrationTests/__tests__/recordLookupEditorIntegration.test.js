import { createElement } from 'lwc';
import RecordLookupEditor from 'builder_platform_interaction/recordLookupEditor';
import { resolveRenderCycles } from '../resolveRenderCycles';

import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    blurEvent,
    textInputEvent,
    getLabelDescriptionLabelElement,
    getLabelDescriptionNameElement,
    expectGroupedComboboxItem,
    getFieldToFerovExpressionBuilders,
    getBaseExpressionBuilder,
    getEntityResourcePicker,
    auraFetch,
    getRadioGroup,
    getChildComponent,
    changeInputValue,
    changeComboboxValue,
    newFilterItem
} from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    EditElementEvent,
    AddElementEvent
} from 'builder_platform_interaction/events';
import { mockEntities } from 'mock/serverEntityData';
import { setRules } from 'builder_platform_interaction/ruleLib';
import { mockAccountFields } from 'mock/serverEntityData';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { setEntities } from 'builder_platform_interaction/sobjectLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import {
    flowWithGetRecordUsingSObject,
    flowWithGetRecordUsingSObjectCollection,
    flowWithGetRecordUsingFields
} from 'mock/flows/flowWithGetRecord';
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
import { FLOW_AUTOMATIC_OUTPUT_HANDLING } from 'builder_platform_interaction/processTypeLib';

const SELECTORS = {
    RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT:
        'builder_platform_interaction-record-sobject-and-query-fields',
    RECORD_QUERY_FIELDS_COMPONENT:
        'builder_platform_interaction-record-query-fields',
    RECORD_FIELD_PICKER_ROW:
        'builder_platform_interaction-record-field-picker-row',
    RECORD_FIELD_PICKER: 'builder_platform_interaction-field-picker',
    RECORD_FILTER: 'builder_platform_interaction-record-filter',
    RECORD_STORE_OPTION: 'builder_platform_interaction-record-store-options',
    RECORD_SORT: 'builder_platform_interaction-record-sort',
    RECORD_INPUT_OUTPUT_ASSIGNMENTS:
        'builder_platform_interaction-record-input-output-assignments',
    SOBJECT_OR_SOBJECT_COLLECTION_PICKER:
        'builder_platform_interaction-sobject-or-sobject-collection-picker'
};

const getRecordSobjectAndQueryFieldElement = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT
    );
};

const getSObjectOrSObjectCollectionPicker = recordLookupEditor => {
    return getRecordSobjectAndQueryFieldElement(
        recordLookupEditor
    ).shadowRoot.querySelector(SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);
};

const getSobjectAndFieldsElement = recordLookupEditor => {
    return getRecordSobjectAndQueryFieldElement(
        recordLookupEditor
    ).shadowRoot.querySelector(SELECTORS.RECORD_QUERY_FIELDS_COMPONENT);
};

const getRecordStoreOption = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.RECORD_STORE_OPTION
    );
};

const getRecordFilter = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.RECORD_FILTER);
};

const getRecordSort = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.RECORD_SORT);
};

const getInputOutputAssignments = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS
    );
};

const getAllRecordFieldPickerRows = recordStoreFieldsComponent => {
    return recordStoreFieldsComponent.shadowRoot.querySelectorAll(
        SELECTORS.RECORD_FIELD_PICKER_ROW
    );
};

const getEntityResourcePickerComboboxElement = entityResourcePicker => {
    const resourcePicker = entityResourcePicker.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
    );
    const combobox = resourcePicker.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
    );
    const lightningGroupCombobox = combobox.shadowRoot.querySelector(
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
    return lightningGroupCombobox;
};

const getResourceGroupedCombobox = editor => {
    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
        editor
    );
    const ferovResourcePicker = sObjectOrSObjectCollectionPicker.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER
    );
    const baseResourcePicker = ferovResourcePicker.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
    );
    const interactionCombobox = baseResourcePicker.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.INTERACTION_COMBOBOX
    );
    return interactionCombobox.shadowRoot.querySelector(
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
};

const createComponentForTest = (
    node,
    mode = EditElementEvent.EVENT_NAME,
    flowOutputHandling = FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED
) => {
    const el = createElement(
        'builder_platform_interaction-record-lookup-editor',
        { is: RecordLookupEditor }
    );
    node.outputReferenceIndex = { value: 'guid', error: null };
    node.objectIndex = { value: 'guid', error: null };
    // Assign needs to be in this order as "mode" is using the flowOutputHandling
    Object.assign(el, { node, flowOutputHandling, mode });
    document.body.appendChild(el);
    return el;
};

describe('Record Lookup Editor', () => {
    let recordLookupNode, store, uiFlow;
    beforeAll(() => {
        setRules(JSON.stringify(mockAllRules));
        setEntities(JSON.stringify(mockEntities));
        setGlobalVariables({ globalVariableTypes, globalVariables });
        setSystemVariables(systemVariables);
        setAuraFetch(
            auraFetch({
                'c.getFieldsForEntity': () => ({
                    data: mockAccountFields
                })
            })
        );
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
        let recordLookupElement, newLabel, newDevName;
        beforeAll(() => {
            uiFlow = translateFlowToUIModel(flowWithGetRecordUsingSObject);
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
        });
        beforeEach(() => {
            const element = getElementByDevName('Get_Record_Using_SObject');
            recordLookupNode = getElementForPropertyEditor(element);
            recordLookupElement = createComponentForTest(recordLookupNode);
        });
        it('do not change devName if it already exists after the user modifies the name', () => {
            newLabel = 'new label';
            const labelInput = getLabelDescriptionLabelElement(
                recordLookupElement
            );
            changeInputValue(labelInput, newLabel);
            return resolveRenderCycles(() => {
                expect(recordLookupElement.node.label.value).toBe(newLabel);
                expect(recordLookupElement.node.name.value).toBe(
                    'Get_Record_Using_SObject'
                );
            });
        });
        it('modify the dev name', () => {
            newDevName = 'newName';
            const devNameInput = getLabelDescriptionNameElement(
                recordLookupElement
            );
            changeInputValue(devNameInput, newDevName);
            return resolveRenderCycles(() => {
                expect(recordLookupElement.node.name.value).toBe(newDevName);
            });
        });
        it('display error if name is cleared', () => {
            newLabel = '';
            const labelInput = getLabelDescriptionLabelElement(
                recordLookupElement
            );
            changeInputValue(labelInput, newLabel);
            return resolveRenderCycles(() => {
                expect(recordLookupElement.node.label.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
        it('display error if devName is cleared', () => {
            newDevName = '';
            const devNameInput = getLabelDescriptionNameElement(
                recordLookupElement
            );
            changeInputValue(devNameInput, newDevName);
            return resolveRenderCycles(() => {
                expect(recordLookupElement.node.name.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
    });
    describe('Add new element', () => {
        let recordLookupElement;
        beforeEach(() => {
            recordLookupNode = getElementForPropertyEditor({
                locationX: 10,
                locationY: 10,
                elementType: ELEMENT_TYPE.RECORD_LOOKUP
            });
            recordLookupElement = createComponentForTest(
                recordLookupNode,
                AddElementEvent.EVENT_NAME
            );
        });
        it('entity picker should be empty', () => {
            const entityResourcePicker = getEntityResourcePicker(
                recordLookupElement
            );
            return resolveRenderCycles(() => {
                expect(entityResourcePicker.value.displayText).toBeUndefined();
            });
        });
    });
    describe('Existing element', () => {
        describe('Working with sObject', () => {
            let recordLookupElement;
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(flowWithGetRecordUsingSObject);
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName('Get_Record_Using_SObject');
                recordLookupNode = getElementForPropertyEditor(element);
                recordLookupElement = createComponentForTest(recordLookupNode);
            });
            it('Selected entity is correctly displayed ', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordLookupElement
                );
                expect(entityResourcePicker.value.displayText).toBe(
                    recordLookupElement.node.object.value
                );
            });
            it('Selected sObject is correctly displayed ', () => {
                const sObJectPicker = getSObjectOrSObjectCollectionPicker(
                    recordLookupElement
                );
                expect(sObJectPicker.value).toBe(
                    recordLookupElement.node.outputReference.value
                );
            });
            it('remove selected entity should hide filter, sort, store option and query fields', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordLookupElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                changeComboboxValue(comboboxElement, '');
                return resolveRenderCycles(() => {
                    expect(
                        getRecordSobjectAndQueryFieldElement(
                            recordLookupElement
                        )
                    ).toBeNull();
                    expect(
                        getRecordStoreOption(recordLookupElement)
                    ).toBeNull();
                    expect(getRecordFilter(recordLookupElement)).toBeNull();
                    expect(getRecordSort(recordLookupElement)).toBeNull();
                    expect(recordLookupElement.node.object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                });
            });
            it('Enter an invalid value in the entity resource picker should not display other element but should display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordLookupElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                changeComboboxValue(comboboxElement, 'invalidValue');
                return resolveRenderCycles(() => {
                    expect(
                        getRecordSobjectAndQueryFieldElement(
                            recordLookupElement
                        )
                    ).toBeNull();
                    expect(
                        getRecordStoreOption(recordLookupElement)
                    ).toBeNull();
                    expect(getRecordFilter(recordLookupElement)).toBeNull();
                    expect(getRecordSort(recordLookupElement)).toBeNull();
                    expect(recordLookupElement.node.object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                    );
                });
            });
            it('Enter an valid value in the entity resource picker should not display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordLookupElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                changeComboboxValue(comboboxElement, 'Case');
                return resolveRenderCycles(() => {
                    expect(recordLookupElement.node.object.error).toBeNull();
                    expect(
                        getRecordSobjectAndQueryFieldElement(
                            recordLookupElement
                        )
                    ).not.toBeNull();
                    expect(
                        getRecordStoreOption(recordLookupElement)
                    ).not.toBeNull();
                    expect(getRecordFilter(recordLookupElement)).not.toBeNull();
                    expect(getRecordSort(recordLookupElement)).not.toBeNull();
                });
            });
            it('Queried fields should be correctly displayed', () => {
                const queryFieldElement = getSobjectAndFieldsElement(
                    recordLookupElement
                );
                const recordFieldPickerRow = getAllRecordFieldPickerRows(
                    queryFieldElement
                );
                expect(recordFieldPickerRow).toHaveLength(2);
                expect(recordFieldPickerRow[0].value).toBe('Id');
                expect(recordFieldPickerRow[1].value).toBe('BillingCity');
            });
            describe('Filter', () => {
                let recordFilter;
                beforeEach(() => {
                    recordFilter = getChildComponent(
                        recordLookupElement,
                        SELECTORS.RECORD_FILTER
                    );
                });
                it('should be displayed', () => {
                    expect(recordFilter).not.toBeNull();
                });
                it('number of filters', () => {
                    expect(recordFilter.filterItems).toHaveLength(1);
                });
                it('LHS/Operator/LHS values', () => {
                    expect(recordFilter.filterItems[0]).toMatchObject(
                        newFilterItem(
                            'Account.BillingCity',
                            'EqualTo',
                            'San Francisco',
                            'String'
                        )
                    );
                });
            });
            it('sortField and SortOrder should be correctly displayed', () => {
                const recordSortElement = getRecordSort(recordLookupElement);
                return resolveRenderCycles(() => {
                    expect(recordSortElement.sortOrder).toBe('Asc');
                    expect(recordSortElement.selectedField).toBe(
                        'AnnualRevenue'
                    );
                });
            });
            it('record store option should have "Only the first record" and "Together in a record variable" selected', () => {
                const recordStoreElement = getRecordStoreOption(
                    recordLookupElement
                );
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
                });
            });
            it('SObject Or SObject Collection Picker contains "New Resource"', () => {
                const rhsGroupedCombobox = getResourceGroupedCombobox(
                    recordLookupElement
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
            let recordLookupElement;
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(
                    flowWithGetRecordUsingSObjectCollection
                );
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName(
                    'Get_Record_Using_SObject_Collection'
                );
                recordLookupNode = getElementForPropertyEditor(element);
                recordLookupElement = createComponentForTest(recordLookupNode);
            });
            it('record store option should have "All records" selected and the second radio group element should be hidden', () => {
                const recordStoreElement = getRecordStoreOption(
                    recordLookupElement
                );
                const radioGroupElement = getRadioGroup(recordStoreElement);
                return resolveRenderCycles(() => {
                    expect(recordStoreElement.numberOfRecordsToStore).toBe(
                        'allRecords'
                    );
                    expect(
                        recordStoreElement.assignNullValuesIfNoRecordsFound
                    ).toBe(true);
                    expect(radioGroupElement).toHaveLength(1);
                });
            });
            it('The variable vAccountCollection should be displayed', () => {
                const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                    recordLookupElement
                );
                return resolveRenderCycles(() => {
                    expect(sObjectOrSObjectCollectionPickerElement.value).toBe(
                        recordLookupElement.node.outputReference.value
                    );
                });
            });
            it('SObject Or SObject Collection Picker contains "New Resource"', () => {
                const rhsGroupedCombobox = getResourceGroupedCombobox(
                    recordLookupElement
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
            let recordLookupElement;
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(flowWithGetRecordUsingFields);
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName('Get_Record_Using_Fields');
                recordLookupNode = getElementForPropertyEditor(element);
                recordLookupElement = createComponentForTest(recordLookupNode);
            });
            it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', () => {
                const recordStoreElement = getRecordStoreOption(
                    recordLookupElement
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
            it('Selected entity is correctly displayed ', () => {
                return resolveRenderCycles(() => {
                    const entityResourcePicker = getEntityResourcePicker(
                        recordLookupElement
                    );
                    expect(entityResourcePicker.value.displayText).toBe(
                        recordLookupElement.node.object.value
                    );
                });
            });
            it('remove selected entity should hide filter, sort, store option and query fields', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordLookupElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                comboboxElement.dispatchEvent(textInputEvent(''));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    expect(
                        getRecordSobjectAndQueryFieldElement(
                            recordLookupElement
                        )
                    ).toBeNull();
                    expect(
                        getRecordStoreOption(recordLookupElement)
                    ).toBeNull();
                    expect(getRecordFilter(recordLookupElement)).toBeNull();
                    expect(getRecordSort(recordLookupElement)).toBeNull();
                    expect(recordLookupElement.node.object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                });
            });
            it('Enter an invalid value in the entity resource picker should not display other element but should display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordLookupElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                comboboxElement.dispatchEvent(textInputEvent('invalidValue'));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    expect(
                        getRecordSobjectAndQueryFieldElement(
                            recordLookupElement
                        )
                    ).toBeNull();
                    expect(
                        getRecordStoreOption(recordLookupElement)
                    ).toBeNull();
                    expect(getRecordFilter(recordLookupElement)).toBeNull();
                    expect(getRecordSort(recordLookupElement)).toBeNull();
                    expect(recordLookupElement.node.object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                    );
                });
            });
            it('Enter an valid value in the entity resource picker should not display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(
                    recordLookupElement
                );
                const comboboxElement = getEntityResourcePickerComboboxElement(
                    entityResourcePicker
                );
                comboboxElement.dispatchEvent(textInputEvent('Case'));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    return resolveRenderCycles(() => {
                        expect(
                            recordLookupElement.node.object.error
                        ).toBeNull();
                        expect(
                            getRecordSobjectAndQueryFieldElement(
                                recordLookupElement
                            )
                        ).not.toBeNull();
                        expect(
                            getRecordStoreOption(recordLookupElement)
                        ).not.toBeNull();
                        expect(
                            getRecordFilter(recordLookupElement)
                        ).not.toBeNull();
                        expect(
                            getRecordSort(recordLookupElement)
                        ).not.toBeNull();
                    });
                });
            });
            it('sortField and SortOrder should be correctly displayed', () => {
                const recordSortElement = getRecordSort(recordLookupElement);
                return resolveRenderCycles(() => {
                    expect(recordSortElement.sortOrder).toBe('Asc');
                    expect(recordSortElement.selectedField).toBe(
                        'AnnualRevenue'
                    );
                });
            });
            describe('Filter', () => {
                let recordFilter, fieldToFerovExpressionBuilders;
                beforeEach(() => {
                    recordFilter = getRecordFilter(recordLookupElement);
                    fieldToFerovExpressionBuilders = getFieldToFerovExpressionBuilders(
                        recordFilter
                    );
                });
                it('should be displayed', () => {
                    expect(recordFilter).not.toBeNull();
                });
                it('number of filters', () => {
                    expect(fieldToFerovExpressionBuilders).toHaveLength(1);
                });
                it('LHS/Operator/LHS values', () => {
                    expect(recordFilter.filterItems[0]).toMatchObject({
                        leftHandSide: {
                            value: 'Account.BillingCity'
                        },
                        operator: {
                            value: 'EndsWith'
                        },
                        rightHandSide: {
                            value: 'Francisco'
                        },
                        rightHandSideDataType: {
                            value: 'String'
                        }
                    });
                });
                it('operators available for the first filter', () => {
                    const baseExpressionBuilderComponent = getBaseExpressionBuilder(
                        fieldToFerovExpressionBuilders[0]
                    );
                    const operatorsComboboxComponent = getChildComponent(
                        baseExpressionBuilderComponent,
                        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
                    );
                    return resolveRenderCycles(() => {
                        expect(operatorsComboboxComponent.options).toHaveLength(
                            6
                        );
                        expect(operatorsComboboxComponent.options).toEqual(
                            expect.arrayContaining([
                                expect.objectContaining({ value: 'EqualTo' }),
                                expect.objectContaining({
                                    value: 'NotEqualTo'
                                }),
                                expect.objectContaining({
                                    value: 'StartsWith'
                                }),
                                expect.objectContaining({ value: 'Contains' }),
                                expect.objectContaining({ value: 'EndsWith' }),
                                expect.objectContaining({ value: 'IsNull' })
                            ])
                        );
                    });
                });
            });
            describe('Output Assignments', () => {
                let outputAssignments, fieldToFerovExpressionBuilder;
                beforeEach(() => {
                    outputAssignments = getInputOutputAssignments(
                        recordLookupElement
                    );
                    fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(
                        outputAssignments
                    );
                });
                it('should be displayed', () => {
                    expect(outputAssignments).not.toBeNull();
                });
                it('number of', () => {
                    expect(
                        outputAssignments.inputOutputAssignmentsItems
                    ).toHaveLength(2);
                });
                it('LHS/Operator/LHS values', () => {
                    const baseExpressionBuilder = getBaseExpressionBuilder(
                        fieldToFerovExpressionBuilder[0]
                    );
                    expect(baseExpressionBuilder.lhsValue).toMatchObject({
                        value: 'Account.BillingCity'
                    });
                    expect(baseExpressionBuilder.operatorValue).toBeUndefined();
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
                });
            });
        });
    });
});
