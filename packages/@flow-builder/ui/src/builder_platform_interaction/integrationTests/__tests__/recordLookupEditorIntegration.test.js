import {createElement} from 'lwc';
import RecordLookupEditor from "builder_platform_interaction/recordLookupEditor";
import { getShadowRoot } from 'lwc-test-utils';
import { resolveRenderCycles} from '../resolveRenderCycles';

import { LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    focusoutEvent,
    blurEvent,
    textInputEvent,
    getLabelDescriptionLabelElement,
    getLabelDescriptionNameElement,
    expectGroupedComboboxItem,
    getFieldToFerovExpressionBuilders,
    getBaseExpressionBuilder,
    getEntityResourcePicker,
    getRadioGroup} from "../integrationTestUtils";
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { EditElementEvent, AddElementEvent } from "builder_platform_interaction/events";
import { mockEntities } from "mock/serverEntityData";
import { setRules } from 'builder_platform_interaction/ruleLib';
import { mockAccountFields } from "mock/serverEntityData";
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { setEntities } from 'builder_platform_interaction/sobjectLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { Store } from "builder_platform_interaction/storeLib";
import { getElementByDevName } from "builder_platform_interaction/storeUtils";
import { translateFlowToUIModel } from "builder_platform_interaction/translatorLib";
import { reducer } from 'builder_platform_interaction/reducers';
import { flowWithGetRecordUsingSObject, flowWithGetRecordUsingSObjectCollection, flowWithGetRecordUsingFields } from 'mock/flows/flowWithGetRecord';
import { mockAllRules } from "mock/ruleService";
import { setGlobalVariables, setSystemVariables } from 'builder_platform_interaction/systemLib';
import { globalVariableTypes, globalVariables, systemVariables,  } from 'mock/systemGlobalVars';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

const auraFetch = (actionName, shouldExecuteCallback, callback) => {
    if (!shouldExecuteCallback()) {
        return undefined;
    }
    let result;
    switch (actionName) {
    case 'c.getEntities':
        result = { data : mockEntities };
        break;
    case 'c.getFieldsForEntity':
        result = { data : mockAccountFields };
        break;
    default:
        result = { error : 'Unknown actionName'};
    break;
    }
    return callback(result);
};

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS,
    RECORD_QUERY_FIELDS_COMPONENT: 'builder_platform_interaction-record-query-fields',
    SOBJECT_OR_SOBJECT_COLLECTION_PICKER: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    RECORD_FIELD_PICKER_ROW: 'builder_platform_interaction-record-field-picker-row',
    RECORD_FIELD_PICKER: 'builder_platform_interaction-field-picker',
    RECORD_FILTER: 'builder_platform_interaction-record-filter',
    RECORD_STORE_OPTION: 'builder_platform_interaction-record-store-options',
    RECORD_SORT: 'builder_platform_interaction-record-sort',
    RECORD_INPUT_OUTPUT_ASSIGNMENTS: 'builder_platform_interaction-record-input-output-assignments',
};

const VALIDATION_ERROR_MESSAGES = {
    GENERIC : 'FlowBuilderCombobox.genericErrorMessage',
    ...FLOW_BUILDER_VALIDATION_ERROR_MESSAGES
};

const getRecordQueryFieldElement = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(SELECTORS.RECORD_QUERY_FIELDS_COMPONENT);
};

const getSObjectOrSObjectCollectionPicker = (recordLookupEditor) => {
    return getShadowRoot(getRecordQueryFieldElement(recordLookupEditor)).querySelector(SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);
};

const getRecordStoreOption = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(SELECTORS.RECORD_STORE_OPTION);
};

const getRecordFilter = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(SELECTORS.RECORD_FILTER);
};

const getRecordSort = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(SELECTORS.RECORD_SORT);
};

const getInputOutputAssignments = (recordLookupEditor) => {
    return getShadowRoot(recordLookupEditor).querySelector(SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);
};

const getAllRecordFieldPickerRows = (recordStoreFieldsComponent) => {
    return getShadowRoot(recordStoreFieldsComponent).querySelectorAll(SELECTORS.RECORD_FIELD_PICKER_ROW);
};

const getEntityResourcePickerComboboxElement = (entityResourcePicker) => {
    const resourcePicker = getShadowRoot(entityResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    const combobox = getShadowRoot(resourcePicker).querySelector(SELECTORS.COMBOBOX);
    const lightningGroupCombobox = getShadowRoot(combobox).querySelector(SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
    return lightningGroupCombobox;
};

const getResourceGroupedCombobox = (editor) => {
    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(editor);
    const ferovResourcePicker = getShadowRoot(sObjectOrSObjectCollectionPicker).querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
    const baseResourcePicker = getShadowRoot(ferovResourcePicker).querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    const interactionCombobox = getShadowRoot(baseResourcePicker).querySelector(SELECTORS.INTERACTION_COMBOBOX);
    return getShadowRoot(interactionCombobox).querySelector(SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
};

const createComponentForTest = (node, { mode = EditElementEvent.EVENT_NAME} = '') => {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    Object.assign(el, {node, mode});
    document.body.appendChild(el);
    return el;
};

describe('Record Lookup Editor', () => {
    let recordLookupNode;
    let store;
    let uiFlow;
    beforeAll(() => {
        setRules(JSON.stringify(mockAllRules));
        setEntities(JSON.stringify(mockEntities));
        setGlobalVariables({ globalVariableTypes, globalVariables });
        setSystemVariables(systemVariables);
        setAuraFetch(auraFetch);
        store = Store.getStore(reducer);
    });
    afterAll(() => {
        // reset rules
        setRules();
        // TODO : fix setEntities (currently does not reset)
        setEntities();
        setSystemVariables();
        setGlobalVariables({ globalVariableTypes : [], globalVariables : [] });
    });
    describe('name and dev name', () => {
        beforeAll(() => {
            uiFlow = translateFlowToUIModel(flowWithGetRecordUsingSObject);
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            store.dispatch({type: 'INIT'});
        });
        beforeEach(() => {
            const element = getElementByDevName('Get_Record_Using_SObject');
            recordLookupNode = getElementForPropertyEditor(element);
        });
        it('do not change devName if it already exists after the user modifies the name', () => {
            const newLabel = 'new label';
            const recordLookupElement = createComponentForTest(recordLookupNode);
            return resolveRenderCycles(() => {
                const labelInput = getLabelDescriptionLabelElement(recordLookupElement);
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(recordLookupElement.node.label.value).toBe(newLabel);
                    expect(recordLookupElement.node.name.value).toBe('Get_Record_Using_SObject');
                });
            });
        });
        it('modify the dev name', () => {
            const newDevName = 'newName';
            const recordLookupElement = createComponentForTest(recordLookupNode);
            return resolveRenderCycles(() => {
                const devNameInput = getLabelDescriptionNameElement(recordLookupElement);
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(recordLookupElement.node.name.value).toBe(newDevName);
                });
            });
        });
        it('display error if name is cleared', () => {
            const newLabel = '';
            const recordLookupElement = createComponentForTest(recordLookupNode);
            return resolveRenderCycles(() => {
                const labelInput = getLabelDescriptionLabelElement(recordLookupElement);
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(recordLookupElement.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
            });
        });
        it('display error if devName is cleared', () => {
            const newDevName = '';
            const recordLookupElement = createComponentForTest(recordLookupNode);
            return resolveRenderCycles(() => {
                const devNameInput = getLabelDescriptionNameElement(recordLookupElement);
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(recordLookupElement.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
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
            recordLookupElement = createComponentForTest(recordLookupNode, AddElementEvent.EVENT_NAME);
        });
        it('entity picker should be empty', () => {
            const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
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
                store.dispatch({type: 'INIT'});
            });
            beforeEach(() => {
                const element = getElementByDevName('Get_Record_Using_SObject');
                recordLookupNode = getElementForPropertyEditor(element);
                recordLookupElement = createComponentForTest(recordLookupNode);
            });
            it('Selected entity is correctly displayed ', () => {
                return resolveRenderCycles(() => {
                    const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                    expect(entityResourcePicker.value.displayText).toBe(recordLookupElement.node.object.value);
                });
            });
            it('Selected sObject is correctly displayed ', () => {
                return resolveRenderCycles(() => {
                    const sObJectPicker = getSObjectOrSObjectCollectionPicker(recordLookupElement);
                    expect(sObJectPicker.value).toBe(recordLookupElement.node.outputReference.value);
                });
            });
            it('remove selected entity should hide filter, sort, store option and query fields', () => {
                const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                comboboxElement.dispatchEvent(textInputEvent(''));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    expect(getRecordQueryFieldElement(recordLookupElement)).toBeNull();
                    expect(getRecordStoreOption(recordLookupElement)).toBeNull();
                    expect(getRecordFilter(recordLookupElement)).toBeNull();
                    expect(getRecordSort(recordLookupElement)).toBeNull();
                    expect(recordLookupElement.node.object.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
            });
            it('Enter an invalid value in the entity resource picker should not display other element but should display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                comboboxElement.dispatchEvent(textInputEvent('invalidValue'));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    expect(getRecordQueryFieldElement(recordLookupElement)).toBeNull();
                    expect(getRecordStoreOption(recordLookupElement)).toBeNull();
                    expect(getRecordFilter(recordLookupElement)).toBeNull();
                    expect(getRecordSort(recordLookupElement)).toBeNull();
                    expect(recordLookupElement.node.object.error).toBe(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
            });
            it('Enter an valid value in the entity resource picker should not display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                comboboxElement.dispatchEvent(textInputEvent('Case'));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    return resolveRenderCycles(() => {
                        expect(recordLookupElement.node.object.error).toBeNull();
                        expect(getRecordQueryFieldElement(recordLookupElement)).not.toBeNull();
                        expect(getRecordStoreOption(recordLookupElement)).not.toBeNull();
                        expect(getRecordFilter(recordLookupElement)).not.toBeNull();
                        expect(getRecordSort(recordLookupElement)).not.toBeNull();
                    });
                });
            });
            it('Queried fields should be correctly displayed', () => {
                const queryFieldElement = getRecordQueryFieldElement(recordLookupElement);
                const recordFieldPickerRow = getAllRecordFieldPickerRows(queryFieldElement);
                return resolveRenderCycles(() => {
                   expect(recordFieldPickerRow).toHaveLength(2);
                   expect(recordFieldPickerRow[0].value).toBe('Id');
                   expect(recordFieldPickerRow[1].value).toBe('BillingCity');
                });
            });
            it('Filter should be correctly displayed', () => {
                const filterElement = getRecordFilter(recordLookupElement);
                const FieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(filterElement);
                return resolveRenderCycles(() => {
                   expect(FieldToFerovExpressionBuilder).toHaveLength(1);
                   const baseExpressionBuilder = getBaseExpressionBuilder(FieldToFerovExpressionBuilder[0]);
                   expect(baseExpressionBuilder.lhsValue).toBe('Account.BillingCity');
                   expect(baseExpressionBuilder.operatorValue).toBe('EqualTo');
                   expect(baseExpressionBuilder.rhsValue).toBe('San Francisco');
                });
            });
            it('sortField and SortOrder should be correctly displayed', () => {
                const recordSortElement = getRecordSort(recordLookupElement);
                return resolveRenderCycles(() => {
                   expect(recordSortElement.sortOrder).toBe('Asc');
                   expect(recordSortElement.selectedField).toBe('AnnualRevenue');
                });
            });
            it('record store option should have "Only the first record" and "Together in a record variable" selected', () => {
                const recordStoreElement = getRecordStoreOption(recordLookupElement);
                return resolveRenderCycles(() => {
                   expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                   expect(recordStoreElement.wayToStoreFields).toBe('sObjectVariable');
                   expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(false);
                });
            });
            it('SObject Or SObject Collection Picker contains "New Resource"', () => {
                const rhsGroupedCombobox = getResourceGroupedCombobox(recordLookupElement);
                return resolveRenderCycles(() => {
                    expectGroupedComboboxItem(rhsGroupedCombobox, 'FlowBuilderExpressionUtils.newResourceLabel');
                });
            });
        });
        describe('Working with sObject Collection', () => {
            let recordLookupElement;
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(flowWithGetRecordUsingSObjectCollection);
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({type: 'INIT'});
            });
            beforeEach(() => {
                const element = getElementByDevName('Get_Record_Using_SObject_Collection');
                recordLookupNode = getElementForPropertyEditor(element);
                recordLookupElement = createComponentForTest(recordLookupNode);
            });
            it('record store option should have "All records" selected and the second radio group element should be hidden', () => {
                const recordStoreElement = getRecordStoreOption(recordLookupElement);
                const radioGroupElement = getRadioGroup(recordStoreElement);
                return resolveRenderCycles(() => {
                   expect(recordStoreElement.numberOfRecordsToStore).toBe('allRecords');
                   expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(true);
                   expect(radioGroupElement).toHaveLength(1);
                });
            });
            it('The variable vAccountCollection should be displayed', () => {
                const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(recordLookupElement);
                return resolveRenderCycles(() => {
                    expect(sObjectOrSObjectCollectionPickerElement.value).toBe(recordLookupElement.node.outputReference.value);
                });
            });
            it('SObject Or SObject Collection Picker contains "New Resource"', () => {
                const rhsGroupedCombobox = getResourceGroupedCombobox(recordLookupElement);
                return resolveRenderCycles(() => {
                    expectGroupedComboboxItem(rhsGroupedCombobox, 'FlowBuilderExpressionUtils.newResourceLabel');
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
                store.dispatch({type: 'INIT'});
            });
            beforeEach(() => {
                const element = getElementByDevName('Get_Record_Using_Fields');
                recordLookupNode = getElementForPropertyEditor(element);
                recordLookupElement = createComponentForTest(recordLookupNode);
            });
            it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', () => {
                const recordStoreElement = getRecordStoreOption(recordLookupElement);
                const radioGroupElement = getRadioGroup(recordStoreElement);
                return resolveRenderCycles(() => {
                   expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                   expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                   expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(false);
                   expect(radioGroupElement).toHaveLength(2);
                });
            });
            it('Selected entity is correctly displayed ', () => {
                return resolveRenderCycles(() => {
                    const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                    expect(entityResourcePicker.value.displayText).toBe(recordLookupElement.node.object.value);
                });
            });
            it('remove selected entity should hide filter, sort, store option and query fields', () => {
                const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                comboboxElement.dispatchEvent(textInputEvent(''));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    expect(getRecordQueryFieldElement(recordLookupElement)).toBeNull();
                    expect(getRecordStoreOption(recordLookupElement)).toBeNull();
                    expect(getRecordFilter(recordLookupElement)).toBeNull();
                    expect(getRecordSort(recordLookupElement)).toBeNull();
                    expect(recordLookupElement.node.object.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
            });
            it('Enter an invalid value in the entity resource picker should not display other element but should display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                comboboxElement.dispatchEvent(textInputEvent('invalidValue'));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    expect(getRecordQueryFieldElement(recordLookupElement)).toBeNull();
                    expect(getRecordStoreOption(recordLookupElement)).toBeNull();
                    expect(getRecordFilter(recordLookupElement)).toBeNull();
                    expect(getRecordSort(recordLookupElement)).toBeNull();
                    expect(recordLookupElement.node.object.error).toBe(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
            });
            it('Enter an valid value in the entity resource picker should not display an error', () => {
                const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                comboboxElement.dispatchEvent(textInputEvent('Case'));
                comboboxElement.dispatchEvent(blurEvent);
                return resolveRenderCycles(() => {
                    return resolveRenderCycles(() => {
                        expect(recordLookupElement.node.object.error).toBeNull();
                        expect(getRecordQueryFieldElement(recordLookupElement)).not.toBeNull();
                        expect(getRecordStoreOption(recordLookupElement)).not.toBeNull();
                        expect(getRecordFilter(recordLookupElement)).not.toBeNull();
                        expect(getRecordSort(recordLookupElement)).not.toBeNull();
                    });
                });
            });
            it('sortField and SortOrder should be correctly displayed', () => {
                const recordSortElement = getRecordSort(recordLookupElement);
                return resolveRenderCycles(() => {
                   expect(recordSortElement.sortOrder).toBe('Asc');
                   expect(recordSortElement.selectedField).toBe('AnnualRevenue');
                });
            });
            it('Filter should be correctly displayed', () => {
                const filterElement = getRecordFilter(recordLookupElement);
                const FieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(filterElement);
                return resolveRenderCycles(() => {
                   expect(FieldToFerovExpressionBuilder).toHaveLength(1);
                   const baseExpressionBuilder = getBaseExpressionBuilder(FieldToFerovExpressionBuilder[0]);
                   expect(baseExpressionBuilder.lhsValue).toBe('Account.BillingCity');
                   expect(baseExpressionBuilder.operatorValue).toBe('EndsWith');
                   expect(baseExpressionBuilder.rhsValue).toBe('Francisco');
                });
            });
            describe('Output Assignments', () => {
                let outputAssignments;
                let FieldToFerovExpressionBuilder;
                let baseExpressionBuilder;
                beforeEach(() => {
                    outputAssignments = getInputOutputAssignments(recordLookupElement);
                    FieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(outputAssignments);
                });
                it('Output Assignments should be visible and correctly displayed', () => {
                    return resolveRenderCycles(() => {
                        expect(FieldToFerovExpressionBuilder).toHaveLength(2);
                        baseExpressionBuilder = getBaseExpressionBuilder(FieldToFerovExpressionBuilder[0]);
                        expect(baseExpressionBuilder.lhsValue).toBe('Account.BillingCity');
                        expect(baseExpressionBuilder.operatorValue).toBeUndefined();
                        expect(baseExpressionBuilder.rhsValue).toMatchObject({"category": "FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL", "dataType": "String", "displayText": "{!vBillingCity}", "hasNext": false, "iconName": "utility:text", "iconSize": "xx-small", "subtype": null, "subText": "FlowBuilderDataTypes.textDataTypeLabel", "text": "vBillingCity", "type": "option-card"});
                     });
                });
            });
        });
    });
});