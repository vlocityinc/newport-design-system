import { createElement } from 'lwc';
import RecordDeleteEditor from 'builder_platform_interaction/recordDeleteEditor';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    expectGroupedComboboxItem,
    getChildComponent,
    getEntityResourcePicker,
    getRecordVariablePickerChildGroupedComboboxComponent,
    getEntityResourcePickerChildGroupedComboboxComponent,
    newFilterItem,
    changeComboboxValue,
    changeInputValue,
    getBaseExpressionBuilder,
    getFieldToFerovExpressionBuilders,
    resetState,
    setupStateForProcessType
} from '../integrationTestUtils';
import { getLabelDescriptionLabelElement, getLabelDescriptionNameElement } from '../labelDescriptionTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { updateFlow } from 'builder_platform_interaction/actions';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import * as FLOWS_WITH_DELETE_RECORDS from 'mock/flows/flowWithDeleteRecords';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import {
    loadOnProcessTypeChange,
    loadOnStart,
    initializeLoader,
    clearLoader
} from 'builder_platform_interaction/preloadLib';
import { initializeAuraFetch } from '../serverDataTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { selectGroupedComboboxItemBy } from '../comboboxTestUtils';
import { SELECTORS, getResourceGroupedCombobox } from './cludEditorTestUtils';

const createComponentForTest = (node, mode, processType) => {
    const el = createElement('builder_platform_interaction-record-delete-editor', { is: RecordDeleteEditor });
    Object.assign(el, { node, processType, mode });
    document.body.appendChild(el);
    return el;
};

const DELETE_RECORDS_USING_SOBJECT_FLOW_ELEMENT = 'delete_acccount_using_sobject';
const DELETE_RECORDS_USING_FIELDS_FLOW_ELEMENT = 'delete_acccount_using_fields';

describe('Record Delete Editor', () => {
    let recordDeleteNode, recordDeleteComponent, store, uiFlow;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.FLOW);
    });
    afterAll(() => {
        resetState();
    });
    describe('name and dev name', () => {
        let newLabel, newDevName;
        beforeAll(() => {
            uiFlow = translateFlowToUIModel(FLOWS_WITH_DELETE_RECORDS.USING_SOBJECT);
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
        });
        beforeEach(() => {
            recordDeleteNode = getElementForPropertyEditor(
                getElementByDevName(DELETE_RECORDS_USING_SOBJECT_FLOW_ELEMENT)
            );
            recordDeleteComponent = createComponentForTest(recordDeleteNode);
        });
        it('do not change "dev name" if it already exists after the user modifies the "label"', () => {
            newLabel = 'new label';
            changeInputValue(getLabelDescriptionLabelElement(recordDeleteComponent), newLabel);
            return Promise.resolve().then(() => {
                expect(recordDeleteComponent.node.label.value).toBe(newLabel);
                expect(recordDeleteComponent.node.name.value).toBe(DELETE_RECORDS_USING_SOBJECT_FLOW_ELEMENT);
            });
        });
        it('modify the "dev name"', () => {
            newDevName = 'newDevName';
            changeInputValue(getLabelDescriptionNameElement(recordDeleteComponent), newDevName);
            return Promise.resolve().then(() => {
                expect(recordDeleteComponent.node.name.value).toBe(newDevName);
            });
        });
        it('display error if the "label" is cleared', () => {
            newLabel = '';
            changeInputValue(getLabelDescriptionLabelElement(recordDeleteComponent), newLabel);
            return Promise.resolve().then(() => {
                expect(recordDeleteComponent.node.label.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
        it('display error if the "dev name" is cleared', () => {
            newDevName = '';
            changeInputValue(getLabelDescriptionNameElement(recordDeleteComponent), newDevName);
            return Promise.resolve().then(() => {
                expect(recordDeleteComponent.node.name.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
    });

    describe('Add new element', () => {
        beforeEach(() => {
            recordDeleteNode = getElementForPropertyEditor({
                elementType: ELEMENT_TYPE.RECORD_DELETE,
                isNewElement: true
            });
            recordDeleteComponent = createComponentForTest(recordDeleteNode);
        });
        describe('Filtering (store options)', () => {
            let storeOptions;
            beforeEach(() => {
                storeOptions = getChildComponent(recordDeleteComponent, SELECTORS.RECORD_STORE_OPTION);
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
                    recordDeleteComponent,
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
    });
    describe('Existing element', () => {
        describe('Working with sObject', () => {
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(FLOWS_WITH_DELETE_RECORDS.USING_SOBJECT);
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                recordDeleteNode = getElementForPropertyEditor(
                    getElementByDevName(DELETE_RECORDS_USING_SOBJECT_FLOW_ELEMENT)
                );
                recordDeleteComponent = createComponentForTest(recordDeleteNode);
            });
            describe('Filtering (store options)', () => {
                let storeOptions;
                beforeEach(() => {
                    storeOptions = getChildComponent(recordDeleteComponent, SELECTORS.RECORD_STORE_OPTION);
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
                        recordDeleteComponent,
                        SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
                    );
                });
                it('should be displayed', () => {
                    expect(recordVariablePicker).not.toBeNull();
                });
                it('Selected value is correctly displayed', () => {
                    expect(recordVariablePicker.value).toBe(recordDeleteNode.inputReference.value);
                });
                it('Should contain "New Resource" entry', () => {
                    const groupedCombobox = getRecordVariablePickerChildGroupedComboboxComponent(recordVariablePicker);
                    return Promise.resolve().then(() => {
                        expectGroupedComboboxItem(groupedCombobox, 'FlowBuilderExpressionUtils.newResourceLabel');
                    });
                });
                it('Should contain all record variables', () => {
                    const comboboxItems = getRecordVariablePickerChildGroupedComboboxComponent(recordVariablePicker)
                        .items;
                    expect(comboboxItems).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                items: expect.arrayContaining([
                                    expect.objectContaining({
                                        text: 'vAccount'
                                    }),
                                    expect.objectContaining({ text: 'vCase' })
                                ])
                            })
                        ])
                    );
                });
            });
        });
        describe('Working with fields', () => {
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(FLOWS_WITH_DELETE_RECORDS.USING_FIELDS);
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                recordDeleteNode = getElementForPropertyEditor(
                    getElementByDevName(DELETE_RECORDS_USING_FIELDS_FLOW_ELEMENT)
                );
                recordDeleteComponent = createComponentForTest(recordDeleteNode);
            });
            describe('Filtering (store options)', () => {
                let storeOptions;
                beforeEach(() => {
                    storeOptions = getChildComponent(recordDeleteComponent, SELECTORS.RECORD_STORE_OPTION);
                });
                it('should be displayed', () => {
                    expect(storeOptions).not.toBeNull();
                });
                it('value should be "allRecords" (ie: "Specify conditions")', () => {
                    expect(storeOptions.numberOfRecordsToStore).toBe('allRecords');
                });
            });
            describe('Entity resource picker', () => {
                let entityResourcePicker;
                beforeEach(() => {
                    entityResourcePicker = getEntityResourcePicker(recordDeleteComponent);
                });
                it('should be displayed', () => {
                    expect(entityResourcePicker).not.toBeNull();
                });
                it('selected entity is correctly displayed', () => {
                    expect(entityResourcePicker.value.displayText).toBe(recordDeleteNode.object.value);
                });
                it('only deleteable entities available', () => {
                    // see mock-entity.js (deletable = true)
                    const comboboxItems = getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker)
                        .items;
                    expect(comboboxItems).toContainEqual(expect.objectContaining({ displayText: 'Account' }));
                    expect(comboboxItems).toContainEqual(expect.objectContaining({ displayText: 'Case' }));
                    expect(comboboxItems).not.toContainEqual(
                        expect.objectContaining({
                            displayText: '(Local) Oauth Token'
                        })
                    );
                    expect(comboboxItems).not.toContainEqual(
                        expect.objectContaining({
                            displayText: 'Apex Page Info'
                        })
                    );
                });
                describe('Enter invalid value', () => {
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker),
                            'invalidValue'
                        );
                    });
                    it('should NOT display record filters', () => {
                        return Promise.resolve().then(() => {
                            expect(getChildComponent(recordDeleteComponent, SELECTORS.RECORD_FILTER)).toBeNull();
                        });
                    });
                    it('should display invalid entry error', () => {
                        return Promise.resolve().then(() => {
                            expect(recordDeleteComponent.node.object.error).toBe(
                                FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                            );
                        });
                    });
                });
                describe('Enter new valid value', () => {
                    let filterItems;
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker),
                            'Case'
                        );
                    });
                    it('should change value and display it', () => {
                        expect(entityResourcePicker.value).toMatchObject({
                            displayText: 'Case',
                            value: 'Case'
                        });
                    });
                    it('should NOT display an error', () => {
                        expect(recordDeleteComponent.node.object.error).toBeNull();
                    });
                    it('should display record filters', () => {
                        expect(getChildComponent(recordDeleteComponent, SELECTORS.RECORD_FILTER)).not.toBeNull();
                    });
                    it('should display 1 filters item', () => {
                        filterItems = getChildComponent(recordDeleteComponent, SELECTORS.RECORD_FILTER).filterItems;
                        expect(filterItems).toHaveLength(1);
                    });
                    it('filters item LHS/Operator/RHS', () => {
                        filterItems = getChildComponent(recordDeleteComponent, SELECTORS.RECORD_FILTER).filterItems;
                        expect(filterItems[0]).toMatchObject(newFilterItem());
                    });
                });
                describe('Remove value (empty string)', () => {
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker),
                            ''
                        );
                    });
                    it('should NOT display record filters', () => {
                        return Promise.resolve().then(() => {
                            expect(getChildComponent(recordDeleteComponent, SELECTORS.RECORD_FILTER)).toBeNull();
                        });
                    });
                    it('should display required value error', () => {
                        return Promise.resolve().then(() => {
                            expect(recordDeleteComponent.node.object.error).toBe(
                                FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                            );
                        });
                    });
                });
            });
            describe('Record Filter', () => {
                let recordFilter;
                beforeEach(() => {
                    recordFilter = getChildComponent(recordDeleteComponent, SELECTORS.RECORD_FILTER);
                });
                it('should be displayed', () => {
                    expect(recordFilter).not.toBeNull();
                });
                it('filter type', () => {
                    expect(recordFilter.filterType).toBe('all');
                });
                it('number of filters', () => {
                    expect(recordFilter.filterItems).toHaveLength(2);
                });
                it('filters item LHS/Operator/RHS', () => {
                    expect(recordFilter.filterItems[0]).toMatchObject(
                        newFilterItem('Account.BillingCity', 'EqualTo', 'Paris', 'String')
                    );
                    expect(recordFilter.filterItems[1]).toMatchObject(
                        newFilterItem('Account.BillingCountry', 'EqualTo', 'France', 'String')
                    );
                });
                it('operators available for the first filter', () => {
                    const fieldToFerovExpressionBuilderComponents = getFieldToFerovExpressionBuilders(recordFilter);
                    const baseExpressionBuilderComponent = getBaseExpressionBuilder(
                        fieldToFerovExpressionBuilderComponents[0]
                    );
                    const operatorsComboboxComponent = getChildComponent(
                        baseExpressionBuilderComponent,
                        SELECTORS.LIGHTNING_COMBOBOX
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
        });
    });
    describe('sObject Or SObject Collection Picker', () => {
        let recordDeleteElement, sObjectOrSObjectCollectionPicker;
        beforeAll(async () => {
            store = Store.getStore(reducer);
            initializeAuraFetch();
            clearLoader();
            initializeLoader(store);
            loadOnStart();
            uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
            await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.FLOW);
            setApexClasses(apexTypesForFlow);
        });
        afterAll(() => {
            resetState();
        });
        beforeEach(() => {
            const element = getElementByDevName('deleteAccount');
            recordDeleteNode = getElementForPropertyEditor(element);
            recordDeleteElement = createComponentForTest(recordDeleteNode, EditElementEvent.EVENT_NAME, 'Flow');
            sObjectOrSObjectCollectionPicker = getResourceGroupedCombobox(recordDeleteElement);
        });
        it('contains sobject collection', async () => {
            const accountCollection = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['accountSObjectCollectionVariable'],
                { blur: false }
            );
            expect(accountCollection).toBeDefined();
        });
        it('contains single sobject, no traversal', async () => {
            const account = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['accountSObjectVariable'],
                { blur: false }
            );

            expect(account).toBeDefined();
            expect(account.rightIconName).toBe('');
        });
        it('contains apex that only contains a single sobject', async () => {
            const apexContainsOnlyASingleSObjectVariable = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['apexContainsOnlyASingleSObjectVariable'],
                { blur: false }
            );

            expect(apexContainsOnlyASingleSObjectVariable).toBeDefined();
        });
        it('contains apex that only contains an SObject collection', async () => {
            const apexContainsOnlyAnSObjectCollectionVariable = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['apexContainsOnlyAnSObjectCollectionVariable'],
                { blur: false }
            );

            expect(apexContainsOnlyAnSObjectCollectionVariable).toBeDefined();
        });
        it('contains complex apex type and shows up only sobject or sobject collection fields', async () => {
            const apexContainsSObject = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['apexComplexTypeVariable'],
                { blur: false }
            );

            expect(apexContainsSObject).toBeDefined();
            expect(apexContainsSObject.rightIconName).toBeDefined();

            const accountField = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['apexComplexTypeVariable', 'acct'],
                { blur: false }
            );

            expect(accountField).toBeDefined();
            expect(accountField.rightIconName).toBeUndefined();

            const accountCollectionField = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['apexComplexTypeVariable', 'acctListField'],
                { blur: false }
            );

            expect(accountCollectionField).toBeDefined();

            const nameField = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['apexComplexTypeVariable', 'name'],
                { blur: false }
            );
            expect(nameField).toBeUndefined();
        });
        it('does not contain element that is not sobject or does not contain sobject', async () => {
            const apexCarVariable = await selectGroupedComboboxItemBy(
                sObjectOrSObjectCollectionPicker,
                'text',
                ['apexCarVariable'],
                { blur: false }
            );

            expect(apexCarVariable).toBeUndefined();
        });
    });
});
