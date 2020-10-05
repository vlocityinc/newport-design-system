import { createElement } from 'lwc';
import RecordDeleteEditor from 'builder_platform_interaction/recordDeleteEditor';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    getChildComponent,
    changeComboboxValue,
    resetState,
    translateFlowToUIAndDispatch,
    setupStateForFlow
} from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { getGroupedComboboxItemBy } from '../groupedComboboxTestUtils';
import {
    getResourceGroupedCombobox,
    getRecordVariablePickerChildGroupedComboboxComponent,
    getEntityResourcePickerChildGroupedComboboxComponent,
    getEntityResourcePicker,
    getBaseResourcePickerCombobox
} from './cludEditorTestUtils';
import { getBaseExpressionBuilder } from '../expressionBuilderTestUtils';
import {
    changeEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { expectCanBeTraversed, expectCannotBeTraversed, expectCannotBeSelected } from '../groupedComboboxTestUtils';
import {
    getFieldToFerovExpressionBuilders,
    getFilterConditionLogicCombobox,
    getFilterCustomConditionLogicInput,
    newFilterItem
} from '../recordFilterTestUtils';

const createComponentForTest = (node, mode?, processType?) => {
    const el = createElement('builder_platform_interaction-record-delete-editor', { is: RecordDeleteEditor });
    Object.assign(el, { node, processType, mode });
    document.body.appendChild(el);
    return el;
};

describe('Record Delete Editor', () => {
    let recordDeleteNode, store;
    beforeAll(async () => {
        store = await setupStateForFlow(flowWithAllElements);
        translateFlowToUIAndDispatch(flowWithAllElements, store);
    });
    afterAll(() => {
        resetState();
    });
    describe('Add new element', () => {
        let recordDeleteComponent;
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
                storeOptions = getChildComponent(
                    recordDeleteComponent,
                    INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION
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
                    recordDeleteComponent,
                    INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
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
    describe('Working with sObject', () => {
        let recordDeleteComponent, sObjectOrSObjectCollectionPicker;
        const expectCanBeTraversedInResourcePicker = async (textValues) => {
            await expectCanBeTraversed(sObjectOrSObjectCollectionPicker, 'text', textValues);
        };
        const expectCannotBeTraversedInResourcePicker = async (textValues) => {
            await expectCannotBeTraversed(sObjectOrSObjectCollectionPicker, 'text', textValues);
        };
        const expectCannotBeSelectedInResourcePicker = async (textValues) => {
            await expectCannotBeSelected(sObjectOrSObjectCollectionPicker, 'text', textValues);
        };
        beforeEach(() => {
            const element = getElementByDevName('deleteAccount');
            recordDeleteNode = getElementForPropertyEditor(element);
            recordDeleteComponent = createComponentForTest(recordDeleteNode, EditElementEvent.EVENT_NAME, 'Flow');
            sObjectOrSObjectCollectionPicker = getResourceGroupedCombobox(recordDeleteComponent);
        });
        it('contains sobject collection', async () => {
            await expectCannotBeTraversedInResourcePicker(['accountSObjectCollectionVariable']);
        });
        it('contains single sobject, no traversal', async () => {
            await expectCannotBeTraversedInResourcePicker(['accountSObjectVariable']);
        });
        it('contains apex that only contains a single sobject', async () => {
            await expectCanBeTraversedInResourcePicker(['apexContainsOnlyASingleSObjectVariable']);
        });
        it('contains apex that only contains an SObject collection', async () => {
            await expectCanBeTraversedInResourcePicker(['apexContainsOnlyAnSObjectCollectionVariable']);
        });
        it('contains complex apex type and shows up only sobject or sobject collection fields', async () => {
            await expectCanBeTraversedInResourcePicker(['apexComplexTypeVariable']);
            await expectCannotBeTraversedInResourcePicker(['apexComplexTypeVariable', 'acct']);
            await expectCannotBeTraversedInResourcePicker(['apexComplexTypeVariable', 'acctListField']);
            await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'name']);
        });
        it('contains elements that contains apex that contains sobject and shows only sobject (single or collection) fields up. Sobject fields should not be traversable', async () => {
            await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable']);
            await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable', 'testOne']);
            await expectCannotBeTraversedInResourcePicker(['apexComplexTypeTwoVariable', 'testOne', 'acct']);
            await expectCannotBeTraversedInResourcePicker(['apexComplexTypeTwoVariable', 'testOne', 'acctListField']);
            await expectCannotBeSelectedInResourcePicker(['apexComplexTypeTwoVariable', 'str']);
        });
        it('does not contain element that is not sobject or does not contain sobject', async () => {
            await expectCannotBeSelectedInResourcePicker(['apexCarVariable']);
        });
    });
    describe('Existing element', () => {
        let recordDeleteComponent;
        describe('Working with sObject', () => {
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName('deleteAccount');
                recordDeleteNode = getElementForPropertyEditor(element);
                recordDeleteComponent = createComponentForTest(recordDeleteNode, EditElementEvent.EVENT_NAME, 'Flow');
            });
            describe('Filtering (store options)', () => {
                let storeOptions;
                beforeEach(() => {
                    storeOptions = getChildComponent(
                        recordDeleteComponent,
                        INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION
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
                        recordDeleteComponent,
                        INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
                    );
                });
                it('should be displayed', () => {
                    expect(recordVariablePicker).not.toBeNull();
                });
                it('Selected value is correctly displayed', () => {
                    expect(recordVariablePicker.value).toBe(recordDeleteNode.inputReference.value);
                });
                it('Should contain "New Resource" entry', async () => {
                    const groupedCombobox = getRecordVariablePickerChildGroupedComboboxComponent(recordVariablePicker);
                    await ticks(1);
                    expect(
                        getGroupedComboboxItemBy(groupedCombobox, 'text', 'FlowBuilderExpressionUtils.newResourceLabel')
                    ).toBeDefined();
                });
                it('Should contain all record variables', () => {
                    const comboboxItems = getRecordVariablePickerChildGroupedComboboxComponent(recordVariablePicker)
                        .items;
                    expect(comboboxItems).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                items: expect.arrayContaining([
                                    expect.objectContaining({
                                        text: 'accountSObjectVariable'
                                    }),
                                    expect.objectContaining({ text: 'accountSObjectVariable' })
                                ])
                            })
                        ])
                    );
                });
            });
        });
        describe('Working with fields', () => {
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName('deleteAccountWithFilters');
                recordDeleteNode = getElementForPropertyEditor(element);
                recordDeleteComponent = createComponentForTest(recordDeleteNode, EditElementEvent.EVENT_NAME, 'Flow');
            });
            describe('Filtering (store options)', () => {
                let storeOptions;
                beforeEach(() => {
                    storeOptions = getChildComponent(
                        recordDeleteComponent,
                        INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION
                    );
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
                it('only deleteable entities available', async () => {
                    // see mock-entity.js (deletable = true)
                    // Disable render-incrementally on combobox so groupedCombobox gets full menu data
                    const combobox = getBaseResourcePickerCombobox(entityResourcePicker);
                    combobox.renderIncrementally = false;
                    await ticks(1);
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
                    it('should NOT display record filters', async () => {
                        await ticks(1);
                        expect(
                            getChildComponent(recordDeleteComponent, INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER)
                        ).toBeNull();
                    });
                    it('should display invalid entry error', async () => {
                        await ticks(1);
                        expect(recordDeleteComponent.node.object.error).toBe(
                            FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                        );
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
                        expect(
                            getChildComponent(recordDeleteComponent, INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER)
                        ).not.toBeNull();
                    });
                    it('should display 1 filters item', () => {
                        filterItems = getChildComponent(
                            recordDeleteComponent,
                            INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER
                        ).filterItems;
                        expect(filterItems).toHaveLength(1);
                    });
                    it('filters item LHS/Operator/RHS', () => {
                        filterItems = getChildComponent(
                            recordDeleteComponent,
                            INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER
                        ).filterItems;
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
                    it('should NOT display record filters', async () => {
                        await ticks(1);
                        expect(
                            getChildComponent(recordDeleteComponent, INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER)
                        ).toBeNull();
                    });
                    it('should display required value error', async () => {
                        await ticks(1);
                        expect(recordDeleteComponent.node.object.error).toBe(
                            FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                        );
                    });
                });
            });
            describe('Record Filter', () => {
                let recordFilter;
                beforeEach(() => {
                    recordFilter = getChildComponent(
                        recordDeleteComponent,
                        INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER
                    );
                });
                it('should be displayed', () => {
                    expect(recordFilter).not.toBeNull();
                });
                it('filter type', () => {
                    expect(recordFilter.filterLogic).toMatchObject({ error: null, value: '1 AND 2 OR 3' });
                });
                it('number of filters', () => {
                    expect(recordFilter.filterItems).toHaveLength(3);
                });
                it('filters item LHS/Operator/RHS', () => {
                    expect(recordFilter.filterItems[0]).toMatchObject(
                        newFilterItem('Account.BillingCity', 'EqualTo', 'San Francisco', 'String')
                    );
                    expect(recordFilter.filterItems[1]).toMatchObject(
                        newFilterItem('Account.BillingCountry', 'EqualTo', 'USA', 'String')
                    );
                });
                it('operators available for the first filter', () => {
                    const fieldToFerovExpressionBuilderComponents = getFieldToFerovExpressionBuilders(recordFilter);
                    const baseExpressionBuilderComponent = getBaseExpressionBuilder(
                        fieldToFerovExpressionBuilderComponents[0]
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
                it('Custom condition logic input should be displayed', () => {
                    expect(getFilterCustomConditionLogicInput(recordDeleteComponent)).not.toBeNull();
                    expect(getFilterCustomConditionLogicInput(recordDeleteComponent).value).toBe('1 AND 2 OR 3');
                });
                describe('Condition logic change', () => {
                    it('Custom condition logic input should not be displayed', async () => {
                        getFilterConditionLogicCombobox(recordDeleteComponent).dispatchEvent(
                            changeEvent(CONDITION_LOGIC.AND)
                        );
                        await ticks(1);
                        expect(getFilterCustomConditionLogicInput(recordDeleteComponent)).toBeNull();
                    });
                });
            });
        });
    });
});
