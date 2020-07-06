// @ts-nocheck
import { createElement } from 'lwc';
import RecordUpdateEditor from 'builder_platform_interaction/recordUpdateEditor';
import { AddElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    getChildComponent,
    changeComboboxValue,
    changeInputValue,
    resetState,
    setupStateForFlow
} from '../integrationTestUtils';
import { getGroupedComboboxItemBy } from '../groupedComboboxTestUtils';
import { getLabelDescriptionLabelElement, getLabelDescriptionNameElement } from '../labelDescriptionTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { RecordStoreOptionChangedEvent } from 'builder_platform_interaction/events';
import { resolveRenderCycles } from '../resolveRenderCycles';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    ticks,
    changeEvent
} from 'builder_platform_interaction/builderTestUtils';
import {
    getRecordVariablePickerChildGroupedComboboxComponent,
    getEntityResourcePickerChildGroupedComboboxComponent,
    getEntityResourcePicker
} from './cludEditorTestUtils';
import { getBaseExpressionBuilder } from '../expressionBuilderTestUtils';
import {
    getFieldToFerovExpressionBuilders,
    getFilterConditionLogicCombobox,
    getFilterCustomConditionLogicInput,
    newFilterItem
} from '../recordFilterTestUtils';

const createComponentForTest = (node, mode) => {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordUpdateEditor });
    Object.assign(el, { node, mode });
    document.body.appendChild(el);
    return el;
};

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

describe('Record Update Editor', () => {
    let recordUpdateNode, recordUpdateComponent;
    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
    });
    afterAll(() => {
        resetState();
    });
    describe('name and dev name', () => {
        beforeEach(() => {
            const element = getElementByDevName('updateSObject');
            recordUpdateNode = getElementForPropertyEditor(element);
            recordUpdateComponent = createComponentForTest(recordUpdateNode, AddElementEvent.EVENT_NAME, 'Flow');
        });
        it('do not change "dev name" if it already exists after the user modifies the "label"', async () => {
            const newLabel = 'new label';
            changeInputValue(getLabelDescriptionLabelElement(recordUpdateComponent), newLabel);
            await ticks(1);
            expect(recordUpdateComponent.node.label.value).toBe(newLabel);
            expect(recordUpdateComponent.node.name.value).toBe(recordUpdateNode.name.value);
        });
        it('modify the "dev name"', async () => {
            const newDevName = 'newDevName';
            changeInputValue(getLabelDescriptionNameElement(recordUpdateComponent), newDevName);
            await ticks(1);
            expect(recordUpdateComponent.node.name.value).toBe(newDevName);
        });
        it('display error if the "label" is cleared', async () => {
            const newLabel = '';
            changeInputValue(getLabelDescriptionLabelElement(recordUpdateComponent), newLabel);
            await ticks(1);
            expect(recordUpdateComponent.node.label.error).toBe(FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
        it('display error if the "dev name" is cleared', async () => {
            const newDevName = '';
            changeInputValue(getLabelDescriptionNameElement(recordUpdateComponent), newDevName);
            await ticks(1);
            expect(recordUpdateComponent.node.name.error).toBe(FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
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
                storeOptions = getChildComponent(recordUpdateComponent, SELECTORS.RECORD_STORE_OPTION);
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
                const recordStoreElement = getChildComponent(recordUpdateComponent, SELECTORS.RECORD_STORE_OPTION);
                recordStoreElement.dispatchEvent(new RecordStoreOptionChangedEvent(false, '', false));
                return resolveRenderCycles(() => {
                    const entityResourcePicker = getEntityResourcePicker(recordUpdateComponent);
                    changeComboboxValue(
                        getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker),
                        'Contract'
                    );
                    return resolveRenderCycles(() => {
                        expect(entityResourcePicker.value).toMatchObject({
                            displayText: 'Contract',
                            value: 'Contract'
                        });
                        const recordFilter = getChildComponent(recordUpdateComponent, SELECTORS.RECORD_FILTER);
                        expect(recordFilter.filterLogic.value).toBe(CONDITION_LOGIC.AND);
                    });
                });
            });
        });
    });
    describe('Existing element', () => {
        describe('Working with sObject', () => {
            beforeEach(() => {
                const element = getElementByDevName('updateSObject');
                recordUpdateNode = getElementForPropertyEditor(element);
                recordUpdateComponent = createComponentForTest(recordUpdateNode, EditElementEvent.EVENT_NAME, 'Flow');
            });
            describe('Filtering (store options)', () => {
                let storeOptions;
                beforeEach(() => {
                    storeOptions = getChildComponent(recordUpdateComponent, SELECTORS.RECORD_STORE_OPTION);
                });
                it('should be displayed', () => {
                    expect(storeOptions).not.toBeNull();
                });
                it('should have numberOfRecordsToStore equal to "firstRecord" (ie: "Use the IDs stored in a record variable or record collection variable")', () => {
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
                it('Selected value is correctly displayed', () => {
                    expect(recordVariablePicker.value).toBe(recordUpdateNode.inputReference.value);
                });
                it('Should contains "New Resource" entry', async () => {
                    const groupedCombobox = getRecordVariablePickerChildGroupedComboboxComponent(recordVariablePicker);
                    await ticks(1);
                    expect(
                        getGroupedComboboxItemBy(groupedCombobox, 'text', 'FlowBuilderExpressionUtils.newResourceLabel')
                    ).toBeDefined();
                });
                it('Should contains all record variables', () => {
                    const comboboxItems = getRecordVariablePickerChildGroupedComboboxComponent(recordVariablePicker)
                        .items;
                    expect(comboboxItems).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                items: expect.arrayContaining([
                                    expect.objectContaining({
                                        text: 'accountSObjectCollectionVariable'
                                    }),
                                    expect.objectContaining({
                                        text: 'caseSObjectCollectionVariable'
                                    })
                                ])
                            })
                        ])
                    );
                });
            });
        });
        describe('Working with fields', () => {
            beforeEach(() => {
                const element = getElementByDevName('updateAccountWithFilter');
                recordUpdateNode = getElementForPropertyEditor(element);
                recordUpdateComponent = createComponentForTest(recordUpdateNode, EditElementEvent.EVENT_NAME, 'Flow');
            });
            describe('Filtering (store options)', () => {
                let storeOptions;
                beforeEach(() => {
                    storeOptions = getChildComponent(recordUpdateComponent, SELECTORS.RECORD_STORE_OPTION);
                });
                it('should be displayed', () => {
                    expect(storeOptions).not.toBeNull();
                });
                it('should have numberOfRecordsToStore be "allRecords" (ie: "Specify conditions")', () => {
                    expect(storeOptions.numberOfRecordsToStore).toBe('allRecords');
                });
            });
            describe('Entity resource picker', () => {
                let entityResourcePicker;
                beforeEach(() => {
                    entityResourcePicker = getEntityResourcePicker(recordUpdateComponent);
                });
                it('should be displayed', () => {
                    expect(entityResourcePicker).not.toBeNull();
                });
                it('should correctly display the selected entity', () => {
                    expect(entityResourcePicker.value.displayText).toBe(recordUpdateNode.object.value);
                });
                it('should have only updateable entities', () => {
                    // see mock-entity.js (updateable = true)
                    const comboboxItems = getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker)
                        .items;
                    expect(comboboxItems).toContainEqual(expect.objectContaining({ displayText: 'Contract' }));
                    expect(comboboxItems).toContainEqual(expect.objectContaining({ displayText: 'Contact' }));
                    expect(comboboxItems).not.toContainEqual(expect.objectContaining({ displayText: 'Account Feed' }));
                    expect(comboboxItems).not.toContainEqual(expect.objectContaining({ displayText: 'Bookmark' }));
                });
                describe('when invalid value is entered', () => {
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker),
                            'invalidValue'
                        );
                    });
                    it('should NOT display record filters', async () => {
                        await ticks(1);
                        expect(getChildComponent(recordUpdateComponent, SELECTORS.RECORD_FILTER)).toBeNull();
                    });
                    it('should display invalid entry error', async () => {
                        await ticks(1);
                        expect(recordUpdateComponent.node.object.error).toBe(
                            FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                        );
                    });
                });
                describe('when fill with a new valid value', () => {
                    let filterItems;
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker),
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
                        expect(recordUpdateComponent.node.object.error).toBeNull();
                    });
                    it('should display record filters', () => {
                        expect(getChildComponent(recordUpdateComponent, SELECTORS.RECORD_FILTER)).not.toBeNull();
                    });
                    it('should display 1 filters item', () => {
                        filterItems = getChildComponent(recordUpdateComponent, SELECTORS.RECORD_FILTER).filterItems;
                        expect(filterItems).toHaveLength(1);
                    });
                    it('should display the filters item LHS/Operator/RHS', () => {
                        filterItems = getChildComponent(recordUpdateComponent, SELECTORS.RECORD_FILTER).filterItems;
                        expect(filterItems[0]).toMatchObject(newFilterItem());
                    });
                });
                describe('when remove value (empty string)', () => {
                    beforeEach(() => {
                        changeComboboxValue(
                            getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker),
                            ''
                        );
                    });
                    it('should NOT display record filters', async () => {
                        await ticks(1);
                        expect(getChildComponent(recordUpdateComponent, SELECTORS.RECORD_FILTER)).toBeNull();
                    });
                    it('should display required value error', async () => {
                        await ticks(1);
                        expect(recordUpdateComponent.node.object.error).toBe(
                            FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                        );
                    });
                });
            });
            describe('Record Filter', () => {
                let recordFilter;
                beforeEach(() => {
                    recordFilter = getChildComponent(recordUpdateComponent, SELECTORS.RECORD_FILTER);
                });
                it('should be displayed', () => {
                    expect(recordFilter).not.toBeNull();
                });
                it('should have filter logic equals to "and"', () => {
                    expect(recordFilter.filterLogic).toMatchObject({ error: null, value: '1 AND 2 OR 3' });
                });
                it('should have a number of filters equals to 2', () => {
                    expect(recordFilter.filterItems).toHaveLength(3);
                });
                it('should display the filters item LHS/Operator/RHS', () => {
                    expect(recordFilter.filterItems[0]).toMatchObject(
                        newFilterItem('Account.BillingCity', 'EqualTo', 'San Francisco', 'String')
                    );
                    expect(recordFilter.filterItems[1]).toMatchObject(
                        newFilterItem('Account.BillingCountry', 'EqualTo', 'USA', 'String')
                    );
                    expect(recordFilter.filterItems[2]).toMatchObject(
                        newFilterItem('Account.Name', 'EqualTo', 'Salesforce', 'String')
                    );
                });
                it('should have the operators available', () => {
                    const fieldToFerovExpressionBuilders = getFieldToFerovExpressionBuilders(recordFilter);
                    const baseExpressionBuilderComponent = getBaseExpressionBuilder(fieldToFerovExpressionBuilders[0]);
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
                describe('When Condition logic change to "and"', () => {
                    it('should not display the custom condition logic input', async () => {
                        getFilterConditionLogicCombobox(recordUpdateComponent).dispatchEvent(
                            changeEvent(CONDITION_LOGIC.AND)
                        );
                        await ticks(1);
                        expect(getFilterCustomConditionLogicInput(recordUpdateComponent)).toBeNull();
                    });
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
                    fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(inputAssignments);
                });
                it('should be displayed', () => {
                    expect(inputAssignments).not.toBeNull();
                });
                it('should display the correct number of input assignment', () => {
                    expect(fieldToFerovExpressionBuilder).toHaveLength(1);
                });
                it('input assignment item LHS/Operator/RHS', () => {
                    const baseExpressionBuilder = getBaseExpressionBuilder(fieldToFerovExpressionBuilder[0]);
                    expect(baseExpressionBuilder.lhsValue).toMatchObject({
                        displayText: 'Name',
                        value: 'Account.Name'
                    });
                    expect(baseExpressionBuilder.operatorValue).toBeUndefined();
                    expect(baseExpressionBuilder.rhsValue).toBe('salesforce');
                });
            });
        });
    });
});
