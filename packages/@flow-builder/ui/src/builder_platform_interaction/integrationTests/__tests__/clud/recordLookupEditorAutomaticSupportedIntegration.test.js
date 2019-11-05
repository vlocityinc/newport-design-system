import { createElement } from 'lwc';
import RecordLookupEditor from 'builder_platform_interaction/recordLookupEditor';
import { resolveRenderCycles } from '../../resolveRenderCycles';

import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    resetState,
    getEntityResourcePicker,
    OnChangeEvent
} from '../../integrationTestUtils';
import { auraFetch, getFieldsForEntity } from '../../serverDataTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    EditElementEvent,
    AddElementEvent
} from 'builder_platform_interaction/events';
import { supportedFeaturesListForFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForFlow.json';
import { allEntities } from 'serverData/GetEntities/allEntities.json';
import { setRules } from 'builder_platform_interaction/ruleLib';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { setEntities } from 'builder_platform_interaction/sobjectLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { rules } from 'serverData/RetrieveAllRules/rules.json';
import {
    setGlobalVariables,
    setSystemVariables,
    setProcessTypeFeature
} from 'builder_platform_interaction/systemLib';
import { systemVariablesForFlow } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import { globalVariablesForFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForFlow.json';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { VARIABLE_AND_FIELD_MAPPING_VALUES } from 'builder_platform_interaction/recordEditorLib';

const PROCESS_TYPE_FLOW = 'Flow';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS,
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
        'builder_platform_interaction-sobject-or-sobject-collection-picker',
    VARIABLE_AND_FIELD_MAPPING_COMPONENT:
        'builder_platform_interaction-record-lookup-variable-and-field-mapping',
    RECORD_NUMBER_RECORD_TO_STORE:
        'builder_platform_interaction-record-number-record-to-store',
    ROW: 'builder_platform_interaction-row'
};

const getRecordSort = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.RECORD_SORT);
};

const createComponentForTest = (
    node,
    mode = EditElementEvent.EVENT_NAME,
    processType = PROCESS_TYPE_FLOW
) => {
    const el = createElement(
        'builder_platform_interaction-record-lookup-editor',
        { is: RecordLookupEditor }
    );
    node.outputReferenceIndex = { value: 'guid', error: null };
    node.objectIndex = { value: 'guid', error: null };
    // Assign needs to be in this order as "mode" is using the flowOutputHandling
    Object.assign(el, { node, processType, mode });
    document.body.appendChild(el);
    return el;
};

const getVariableAndFieldMappingComponent = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.VARIABLE_AND_FIELD_MAPPING_COMPONENT
    );
};

const getVariableAndFieldMappingRadioButtonGroup = recordLookupEditor => {
    const variableAndFieldmappingComponent = getVariableAndFieldMappingComponent(
        recordLookupEditor
    );
    return variableAndFieldmappingComponent.shadowRoot.querySelector(
        SELECTORS.LIGHTNING_RADIO_GROUP
    );
};

const getQueryFields = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.RECORD_QUERY_FIELDS_COMPONENT
    );
};

const getNumberRecordToStoreComponent = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.RECORD_NUMBER_RECORD_TO_STORE
    );
};

const getAutomaticRecordStoreOptionsRadioGroup = recordLookupEditor => {
    return getNumberRecordToStoreComponent(
        recordLookupEditor
    ).shadowRoot.querySelector(SELECTORS.LIGHTNING_RADIO_GROUP);
};

describe('Record Lookup Editor', () => {
    let recordLookupNode, store, uiFlow, recordLookupElement;
    beforeAll(() => {
        store = Store.getStore(reducer);
        setRules(rules);
        setEntities(allEntities);
        setGlobalVariables(globalVariablesForFlow);
        setSystemVariables(systemVariablesForFlow);
        setProcessTypeFeature(PROCESS_TYPE_FLOW, supportedFeaturesListForFlow);
        setAuraFetch(
            auraFetch({
                'c.getFieldsForEntity': getFieldsForEntity({
                    Account: accountFields
                })
            })
        );
    });
    afterAll(() => {
        resetState();
    });
    describe('Add new element', () => {
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
    describe('Working with automatic output handling', () => {
        beforeAll(() => {
            setProcessTypeFeature(
                PROCESS_TYPE_FLOW,
                supportedFeaturesListForFlow
            );
            uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
        });
        beforeEach(() => {
            const element = getElementByDevName('lookupRecordAutomaticOutput');
            recordLookupNode = getElementForPropertyEditor(element);
            recordLookupElement = createComponentForTest(
                recordLookupNode,
                EditElementEvent.EVENT_NAME
            );
        });
        it('Variable and Field Mapping radiobutton group: Automatic should be selected', () => {
            const variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                recordLookupElement
            );
            expect(variableAndFieldMappingRadioButtonGroup).toBeDefined();
            expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC
            );
        });
        it('"recordQuery" fields should not be visible', () => {
            const recordQueryFields = getQueryFields(recordLookupElement);
            expect(recordQueryFields).toBeNull();
        });
        it('record store option should have "Only the first record"', () => {
            const recordStoreOptionsRadioGroup = getAutomaticRecordStoreOptionsRadioGroup(
                recordLookupElement
            );
            return resolveRenderCycles(() => {
                expect(recordStoreOptionsRadioGroup.value).toBe('firstRecord');
            });
        });
        it('sortField and SortOrder should be correctly displayed', () => {
            const recordSortElement = getRecordSort(recordLookupElement);
            return resolveRenderCycles(() => {
                expect(recordSortElement.sortOrder).toBe('NotSorted');
            });
        });
        describe('Select Automatic with flow on the variable And Field Mapping Radio Button Group', () => {
            let variableAndFieldMappingRadioButtonGroup;
            beforeEach(() => {
                variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                    recordLookupElement
                );
                variableAndFieldMappingRadioButtonGroup.dispatchEvent(
                    new OnChangeEvent(
                        VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
                    )
                );
            });
            it('Variable and Field Mapping radiobutton group: Automatic should be selected', () => {
                variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                    recordLookupElement
                );
                expect(variableAndFieldMappingRadioButtonGroup).toBeDefined();
                expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                    VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
                );
            });
            it('Query fields should be displayed', () => {
                const recordQueryFields = getQueryFields(recordLookupElement);
                expect(recordQueryFields.queriedFields[0].field.value).toBe(
                    'Id'
                );
                expect(recordQueryFields.queriedFields[1].field.value).toBe('');
                expect(recordQueryFields.queriedFields[2]).toBeUndefined();
            });
        });
        describe('Select Manual on the variable And Field Mapping Radio Button Group', () => {
            let variableAndFieldMappingRadioButtonGroup;
            beforeEach(() => {
                variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                    recordLookupElement
                );
                variableAndFieldMappingRadioButtonGroup.dispatchEvent(
                    new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL)
                );
            });
            it('Variable and Field Mapping radiobutton group: Automatic should be selected', () => {
                return Promise.resolve().then(() => {
                    variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                        recordLookupElement
                    );
                    expect(
                        variableAndFieldMappingRadioButtonGroup
                    ).toBeDefined();
                    expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                        VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
                    );
                });
            });
        });
    });
});
