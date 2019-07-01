import { createElement } from 'lwc';
import RecordUpdateEditor from 'builder_platform_interaction/recordUpdateEditor';

import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    auraFetch,
    LIGHTNING_COMPONENTS_SELECTORS,
    getLabelDescriptionLabelElement,
    getLabelDescriptionNameElement,
    expectGroupedComboboxItem,
    getChildComponent,
    getEntityResourcePicker,
    getBaseExpressionBuilder,
    getFieldToFerovExpressionBuilders,
    getRecordVariablePickerChildGroupedComboboxComponent,
    getEntityResourcePickerChildGroupedComboboxComponent,
    newFilterItem,
    changeComboboxValue,
    changeInputValue
} from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
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
import * as FLOWS_WITH_UPDATE_RECORDS from 'mock/flows/flowWithUpdateRecord';
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
import { RecordStoreOptionChangedEvent } from 'builder_platform_interaction/events';
import { resolveRenderCycles } from '../resolveRenderCycles';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';

const createComponentForTest = node => {
    const el = createElement(
        'builder_platform_interaction-record-update-editor',
        { is: RecordUpdateEditor }
    );
    Object.assign(el, { node });
    document.body.appendChild(el);
    return el;
};

const SELECTORS = {
    SOBJECT_OR_SOBJECT_COLLECTION_PICKER:
        'builder_platform_interaction-sobject-or-sobject-collection-picker',
    RECORD_FILTER: 'builder_platform_interaction-record-filter',
    RECORD_STORE_OPTION: 'builder_platform_interaction-record-store-options',
    RECORD_INPUT_OUTPUT_ASSIGNMENTS:
        'builder_platform_interaction-record-input-output-assignments'
};

const UPDATE_RECORDS_USING_SOBJECT_FLOW_ELEMENT =
        'update_contract_using_sobject',
    UPDATE_RECORDS_USING_FIELDS_FLOW_ELEMENT = 'update_contract_using_fields';

describe('Record Update Editor', () => {
    let recordUpdateNode, recordUpdateComponent, store, uiFlow;
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
        setRules();
        setEntities();
        setSystemVariables();
        setGlobalVariables({ globalVariableTypes: [], globalVariables: [] });
    });
    describe('name and dev name', () => {
        let newLabel, newDevName;
        beforeAll(() => {
            uiFlow = translateFlowToUIModel(
                FLOWS_WITH_UPDATE_RECORDS.USING_SOBJECT
            );
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
        });
        beforeEach(() => {
            recordUpdateNode = getElementForPropertyEditor(
                getElementByDevName(UPDATE_RECORDS_USING_SOBJECT_FLOW_ELEMENT)
            );
            recordUpdateComponent = createComponentForTest(recordUpdateNode);
        });
        it('do not change "dev name" if it already exists after the user modifies the "label"', () => {
            newLabel = 'new label';
            changeInputValue(
                getLabelDescriptionLabelElement(recordUpdateComponent),
                newLabel
            );
            return Promise.resolve().then(() => {
                expect(recordUpdateComponent.node.label.value).toBe(newLabel);
                expect(recordUpdateComponent.node.name.value).toBe(
                    UPDATE_RECORDS_USING_SOBJECT_FLOW_ELEMENT
                );
            });
        });
        it('modify the "dev name"', () => {
            newDevName = 'newDevName';
            changeInputValue(
                getLabelDescriptionNameElement(recordUpdateComponent),
                newDevName
            );
            return Promise.resolve().then(() => {
                expect(recordUpdateComponent.node.name.value).toBe(newDevName);
            });
        });
        it('display error if the "label" is cleared', () => {
            newLabel = '';
            changeInputValue(
                getLabelDescriptionLabelElement(recordUpdateComponent),
                newLabel
            );
            return Promise.resolve().then(() => {
                expect(recordUpdateComponent.node.label.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
        it('display error if the "dev name" is cleared', () => {
            newDevName = '';
            changeInputValue(
                getLabelDescriptionNameElement(recordUpdateComponent),
                newDevName
            );
            return Promise.resolve().then(() => {
                expect(recordUpdateComponent.node.name.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
    });

    describe('Add new element', () => {
        beforeEach(() => {
            recordUpdateNode = getElementForPropertyEditor({
                elementType: ELEMENT_TYPE.RECORD_UPDATE,
                isNewElement: true
            });
            recordUpdateComponent = createComponentForTest(recordUpdateNode);
        });
        describe('Filtering (store options)', () => {
            let storeOptions;
            beforeEach(() => {
                storeOptions = getChildComponent(
                    recordUpdateComponent,
                    SELECTORS.RECORD_STORE_OPTION
                );
            });
            it('should be displayed', () => {
                expect(storeOptions).not.toBeNull();
            });
            it('value should be "firstRecord" (ie: "Use the IDs stored in a record variable or record collection variable")', () => {
                expect(storeOptions.numberOfRecordsToStore).toBe('firstRecord');
            });
        });
        describe('Record Variable or Record Collection Variable picker', () => {
            let recordVariablePicker;
            beforeEach(() => {
                recordVariablePicker = getChildComponent(
                    recordUpdateComponent,
                    SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
                );
            });
            it('should be displayed', () => {
                expect(recordVariablePicker).not.toBeNull();
            });
            it('value should be an empty string', () => {
                expect(recordVariablePicker.value).toBe('');
            });
        });
        describe('default Filter', () => {
            it('should be all (Conditions are Met)', () => {
                const recordStoreElement = getChildComponent(
                    recordUpdateComponent,
                    SELECTORS.RECORD_STORE_OPTION
                );
                recordStoreElement.dispatchEvent(
                    new RecordStoreOptionChangedEvent(false, '', false)
                );
                return resolveRenderCycles(() => {
                    const entityResourcePicker = getEntityResourcePicker(
                        recordUpdateComponent
                    );
                    changeComboboxValue(
                        getEntityResourcePickerChildGroupedComboboxComponent(
                            entityResourcePicker
                        ),
                        'Contract'
                    );
                    return resolveRenderCycles(() => {
                        expect(entityResourcePicker.value).toMatchObject({
                            displayText: 'Contract',
                            value: 'Contract'
                        });
                        const recordFilter = getChildComponent(
                            recordUpdateComponent,
                            SELECTORS.RECORD_FILTER
                        );
                        expect(recordFilter.filterType).toBe(
                            RECORD_FILTER_CRITERIA.ALL
                        );
                    });
                });
            });
        });
    });
    describe('Existing element', () => {
        describe('Working with sObject', () => {
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(
                    FLOWS_WITH_UPDATE_RECORDS.USING_SOBJECT
                );
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                recordUpdateNode = getElementForPropertyEditor(
                    getElementByDevName(
                        UPDATE_RECORDS_USING_SOBJECT_FLOW_ELEMENT
                    )
                );
                recordUpdateComponent = createComponentForTest(
                    recordUpdateNode
                );
            });
            describe('Filtering (store options)', () => {
                let storeOptions;
                beforeEach(() => {
                    storeOptions = getChildComponent(
                        recordUpdateComponent,
                        SELECTORS.RECORD_STORE_OPTION
                    );
                });
                it('should be displayed', () => {
                    expect(storeOptions).not.toBeNull();
                });
                it('value should be "firstRecord" (ie: "Use the IDs stored in a record variable or record collection variable")', () => {
                    expect(storeOptions.numberOfRecordsToStore).toBe(
                        'firstRecord'
                    );
                });
            });
            describe('Record Variable or Record Collection Variable picker', () => {
                let recordVariablePicker;
                beforeEach(() => {
                    recordVariablePicker = getChildComponent(
                        recordUpdateComponent,
                        SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
                    );
                });
                it('should be displayed', () => {
                    expect(recordVariablePicker).not.toBeNull();
                });
                it('Selected value is correctly displayed', () => {
                    expect(recordVariablePicker.value).toBe(
                        recordUpdateNode.inputReference.value
                    );
                });
                it('Should contain "New Resource" entry', () => {
                    const groupedCombobox = getRecordVariablePickerChildGroupedComboboxComponent(
                        recordVariablePicker
                    );
                    return Promise.resolve().then(() => {
                        expectGroupedComboboxItem(
                            groupedCombobox,
                            'FlowBuilderExpressionUtils.newResourceLabel'
                        );
                    });
                });
                it('Should contain all record variables', () => {
                    const comboboxItems = getRecordVariablePickerChildGroupedComboboxComponent(
                        recordVariablePicker
                    ).items;
                    expect(comboboxItems).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                items: expect.arrayContaining([
                                    expect.objectContaining({
                                        text: 'contactToUpdateVar'
                                    }),
                                    expect.objectContaining({
                                        text: 'contractToUpdateVar'
                                    })
                                ])
                            })
                        ])
                    );
                });
            });
        });
        describe('Working with fields', () => {
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(
                    FLOWS_WITH_UPDATE_RECORDS.USING_FIELDS
                );
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                recordUpdateNode = getElementForPropertyEditor(
                    getElementByDevName(
                        UPDATE_RECORDS_USING_FIELDS_FLOW_ELEMENT
                    )
                );
                recordUpdateComponent = createComponentForTest(
                    recordUpdateNode
                );
            });
            describe('Filtering (store options)', () => {
                let storeOptions;
                beforeEach(() => {
                    storeOptions = getChildComponent(
                        recordUpdateComponent,
                        SELECTORS.RECORD_STORE_OPTION
                    );
                });
                it('should be displayed', () => {
                    expect(storeOptions).not.toBeNull();
                });
                it('value should be "allRecords" (ie: "Specify conditions")', () => {
                    expect(storeOptions.numberOfRecordsToStore).toBe(
                        'allRecords'
                    );
                });
            });
            describe('Entity resource picker', () => {
                let entityResourcePicker;
                beforeEach(() => {
                    entityResourcePicker = getEntityResourcePicker(
                        recordUpdateComponent
                    );
                });
                it('should be displayed', () => {
                    expect(entityResourcePicker).not.toBeNull();
                });
                it('selected entity is correctly displayed', () => {
                    expect(entityResourcePicker.value.displayText).toBe(
                        recordUpdateNode.object.value
                    );
                });
                it('only updateable entities available', () => {
                    // see mock-entity.js (updateable = true)
                    const comboboxItems = getEntityResourcePickerChildGroupedComboboxComponent(
                        entityResourcePicker
                    ).items;
                    expect(comboboxItems).toHaveLength(2);
                    expect(comboboxItems).toContainEqual(
                        expect.objectContaining({ displayText: 'Contract' })
                    );
                    expect(comboboxItems).not.toContainEqual(
                        expect.objectContaining({ displayText: 'Case' })
                    );
                });
                describe('Enter invalid value', () => {
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(
                                entityResourcePicker
                            ),
                            'invalidValue'
                        );
                    });
                    it('should NOT display record filters', () => {
                        return Promise.resolve().then(() => {
                            expect(
                                getChildComponent(
                                    recordUpdateComponent,
                                    SELECTORS.RECORD_FILTER
                                )
                            ).toBeNull();
                        });
                    });
                    it('should display invalid entry error', () => {
                        return Promise.resolve().then(() => {
                            expect(
                                recordUpdateComponent.node.object.error
                            ).toBe(
                                FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                            );
                        });
                    });
                });
                describe('Enter new valid value', () => {
                    let filterItems;
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(
                                entityResourcePicker
                            ),
                            'Contact'
                        );
                    });
                    it('should change value and display it', () => {
                        expect(entityResourcePicker.value).toMatchObject({
                            displayText: 'Contact',
                            value: 'Contact'
                        });
                    });
                    it('should NOT display an error', () => {
                        expect(
                            recordUpdateComponent.node.object.error
                        ).toBeNull();
                    });
                    it('should display record filters', () => {
                        expect(
                            getChildComponent(
                                recordUpdateComponent,
                                SELECTORS.RECORD_FILTER
                            )
                        ).not.toBeNull();
                    });
                    it('should display 1 filters item', () => {
                        filterItems = getChildComponent(
                            recordUpdateComponent,
                            SELECTORS.RECORD_FILTER
                        ).filterItems;
                        expect(filterItems).toHaveLength(1);
                    });
                    it('filters item LHS/Operator/RHS', () => {
                        filterItems = getChildComponent(
                            recordUpdateComponent,
                            SELECTORS.RECORD_FILTER
                        ).filterItems;
                        expect(filterItems[0]).toMatchObject(newFilterItem());
                    });
                });
                describe('Remove value (empty string)', () => {
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(
                                entityResourcePicker
                            ),
                            ''
                        );
                    });
                    it('should NOT display record filters', () => {
                        return Promise.resolve().then(() => {
                            expect(
                                getChildComponent(
                                    recordUpdateComponent,
                                    SELECTORS.RECORD_FILTER
                                )
                            ).toBeNull();
                        });
                    });
                    it('should display required value error', () => {
                        return Promise.resolve().then(() => {
                            expect(
                                recordUpdateComponent.node.object.error
                            ).toBe(
                                FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                            );
                        });
                    });
                });
            });
            describe('Record Filter', () => {
                let recordFilter;
                beforeEach(() => {
                    recordFilter = getChildComponent(
                        recordUpdateComponent,
                        SELECTORS.RECORD_FILTER
                    );
                });
                it('should be displayed', () => {
                    expect(recordFilter).not.toBeNull();
                });
                it('filter type', () => {
                    expect(recordFilter.filterType).toBe(
                        RECORD_FILTER_CRITERIA.ALL
                    );
                });
                it('number of filters', () => {
                    expect(recordFilter.filterItems).toHaveLength(2);
                });
                it('filters item LHS/Operator/RHS', () => {
                    expect(recordFilter.filterItems[0]).toMatchObject(
                        newFilterItem(
                            'Contract.BillingCity',
                            'EqualTo',
                            'San Francisco',
                            'String'
                        )
                    );
                    expect(recordFilter.filterItems[1]).toMatchObject(
                        newFilterItem(
                            'Contract.BillingCountry',
                            'EqualTo',
                            'US',
                            'String'
                        )
                    );
                });
                it('operators available for the first filter', () => {
                    const fieldToFerovExpressionBuilders = getFieldToFerovExpressionBuilders(
                        recordFilter
                    );
                    const baseExpressionBuilderComponent = getBaseExpressionBuilder(
                        fieldToFerovExpressionBuilders[0]
                    );
                    const operatorsComboboxComponent = getChildComponent(
                        baseExpressionBuilderComponent,
                        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
                    );
                    expect(operatorsComboboxComponent.options).toHaveLength(6);
                    expect(operatorsComboboxComponent.options).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ value: 'EqualTo' }),
                            expect.objectContaining({ value: 'NotEqualTo' }),
                            expect.objectContaining({ value: 'StartsWith' }),
                            expect.objectContaining({ value: 'Contains' }),
                            expect.objectContaining({ value: 'EndsWith' }),
                            expect.objectContaining({ value: 'IsNull' })
                        ])
                    );
                });
            });
            describe('Input Assignments', () => {
                let inputAssignments;
                let fieldToFerovExpressionBuilder;
                beforeEach(() => {
                    inputAssignments = getChildComponent(
                        recordUpdateComponent,
                        SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS
                    );
                    fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(
                        inputAssignments
                    );
                });
                it('should be displayed', () => {
                    expect(inputAssignments).not.toBeNull();
                });
                it('number of input assignment', () => {
                    expect(fieldToFerovExpressionBuilder).toHaveLength(1);
                });
                it('input assignment item LHS/Operator/RHS', () => {
                    const baseExpressionBuilder = getBaseExpressionBuilder(
                        fieldToFerovExpressionBuilder[0]
                    );
                    expect(baseExpressionBuilder.lhsValue).toBe(
                        'Contract.Name'
                    );
                    expect(baseExpressionBuilder.operatorValue).toBeUndefined();
                    expect(baseExpressionBuilder.rhsValue).toMatchObject({
                        displayText: '{!newNameVar}',
                        text: 'newNameVar'
                    });
                });
            });
        });
    });
});
