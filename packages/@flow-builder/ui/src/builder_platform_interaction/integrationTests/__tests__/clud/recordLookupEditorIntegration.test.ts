import { createElement } from 'lwc';
import RecordLookupEditor from 'builder_platform_interaction/recordLookupEditor';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    getChildComponent,
    changeInputValue,
    changeComboboxValue,
    resetState,
    setupStateForFlow,
    changeLightningRadioGroupValue
} from '../integrationTestUtils';
import { getLabelDescriptionLabelElement, getLabelDescriptionNameElement } from '../labelDescriptionTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { EditElementEvent, AddElementEvent } from 'builder_platform_interaction/events';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    blurEvent,
    textInputEvent,
    changeEvent,
    ticks,
    removePill,
    clickPill
} from 'builder_platform_interaction/builderTestUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import {
    getResourceGroupedCombobox,
    getResourceCombobox,
    getRadioGroups,
    getEntityResourcePicker,
    getRecordStoreOption,
    removePillAndGetGroupedCombobox,
    getRecordFilter,
    getRecordSobjectAndQueryFields,
    getRecordSort,
    getRecordInputOutputAssignments,
    getBaseExpressionBuilderRhsCombobox
} from './cludEditorTestUtils';
import {
    getGroupedComboboxItemBy,
    expectCanBeTraversed,
    expectCannotBeTraversed,
    expectCannotBeSelected
} from '../groupedComboboxTestUtils';
import { getBaseExpressionBuilder } from '../expressionBuilderTestUtils';
import { selectComboboxItemBy, typeMergeFieldInCombobox } from '../comboboxTestUtils';
import {
    getBaseExpressionBuilderByIndex,
    getFieldToFerovExpressionBuilders,
    getFilterConditionLogicCombobox,
    getFilterCustomConditionLogicInput,
    newFilterItem
} from '../recordFilterTestUtils';

const getSObjectOrSObjectCollectionPicker = (recordLookupEditor) =>
    getRecordSobjectAndQueryFields(recordLookupEditor).shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
    );
const getSobjectAndFieldsElement = (recordLookupEditor) =>
    getRecordSobjectAndQueryFields(recordLookupEditor).shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.RECORD_QUERY_FIELDS_COMPONENT
    );

const getAllRecordFieldPickerRows = (recordStoreFieldsComponent) =>
    recordStoreFieldsComponent.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.RECORD_FIELD_PICKER_ROW);

const getEntityResourcePickerComboboxElement = (entityResourcePicker) =>
    deepQuerySelector(entityResourcePicker, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

const getRecordObjectAndQueryFieldResourceGroupedCombobox = (editor) =>
    getResourceGroupedCombobox(getRecordSobjectAndQueryFields(editor));

jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.actionAsResourceText',
    () => {
        return { default: 'Outputs from {0}' };
    },
    { virtual: true }
);
jest.mock('@salesforce/label/FlowBuilderElementLabels.subflowAsResourceText', () => ({ default: 'Outputs from {0}' }), {
    virtual: true
});
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordCreateIdAsResourceText',
    () => ({ default: '{0}Id from {1}' }),
    { virtual: true }
);

jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText',
    () => ({ default: '{0} from {1}' }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.loopAsResourceText',
    () => {
        return { default: 'Current Item from Loop {0}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.lightningComponentScreenFieldAsResourceText',
    () => {
        return { default: '{0}' };
    },
    { virtual: true }
);

const createComponentForTest = (node, mode = EditElementEvent.EVENT_NAME) => {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    Object.assign(el, { node, mode });
    document.body.appendChild(el);
    return el;
};
const SELECTORS = { ABBR: 'abbr' };

describe('Record Lookup Editor', () => {
    let recordLookupNode, recordLookupComponent, sObjectOrSObjectCollectionPicker;
    const expectCanBeTraversedInResourcePicker = async (textValues) => {
        await expectCanBeTraversed(sObjectOrSObjectCollectionPicker, 'text', textValues);
    };
    const expectCannotBeTraversedInResourcePicker = async (textValues) => {
        await expectCannotBeTraversed(sObjectOrSObjectCollectionPicker, 'text', textValues);
    };
    const expectCannotBeSelectedInResourcePicker = async (textValues) => {
        await expectCannotBeSelected(sObjectOrSObjectCollectionPicker, 'text', textValues);
    };
    describe('Flow that supports automatic output', () => {
        beforeAll(async () => {
            await setupStateForFlow(flowWithAllElements);
        });
        afterAll(() => {
            resetState();
        });
        describe('name and dev name', () => {
            let recordLookupElement, newLabel, newDevName;
            beforeAll(() => {
                const element = getElementByDevName('lookupRecordOutputReference');
                recordLookupNode = getElementForPropertyEditor(element);
            });
            beforeEach(() => {
                recordLookupElement = createComponentForTest(recordLookupNode, AddElementEvent.EVENT_NAME);
            });
            it('does not change devName if it already exists after the user modifies the name', async () => {
                newLabel = 'new label';
                const labelInput = getLabelDescriptionLabelElement(recordLookupElement);
                await changeInputValue(labelInput, newLabel);
                expect(recordLookupElement.node.label.value).toBe(newLabel);
                expect(recordLookupElement.node.name.value).toBe('lookupRecordOutputReference');
            });
            it('modifies the dev name', async () => {
                newDevName = 'newName';
                const devNameInput = getLabelDescriptionNameElement(recordLookupElement);
                await changeInputValue(devNameInput, newDevName);
                expect(recordLookupElement.node.name.value).toBe(newDevName);
            });
            it('display error if name is cleared', async () => {
                newLabel = '';
                const labelInput = getLabelDescriptionLabelElement(recordLookupElement);
                await changeInputValue(labelInput, newLabel);
                expect(recordLookupElement.node.label.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
            it('display error if devName is cleared', async () => {
                newDevName = '';
                const devNameInput = getLabelDescriptionNameElement(recordLookupElement);
                await changeInputValue(devNameInput, newDevName);
                expect(recordLookupElement.node.name.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
        describe('Add new element', () => {
            it('entity picker should be empty', () => {
                recordLookupNode = getElementForPropertyEditor({
                    elementType: ELEMENT_TYPE.RECORD_LOOKUP
                });
                const recordLookupElement = createComponentForTest(recordLookupNode, AddElementEvent.EVENT_NAME);
                const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
                expect(entityResourcePicker.value.displayText).toBeUndefined();
            });
        });
        describe('Existing element', () => {
            describe('Working with sObject', () => {
                let getGroupedCombobox;
                beforeAll(() => {
                    const element = getElementByDevName('lookupRecordOutputReference');
                    recordLookupNode = getElementForPropertyEditor(element);
                });
                beforeEach(() => {
                    recordLookupComponent = createComponentForTest(recordLookupNode);
                    getGroupedCombobox = removePillAndGetGroupedCombobox.bind(null, recordLookupComponent, [
                        INTERACTION_COMPONENTS_SELECTORS.RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT
                    ]);
                });
                describe('SObjectOrSObjectCollectionPicker', () => {
                    it('Selected sObject is correctly displayed ', () => {
                        const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordLookupComponent);
                        expect(sObjectPicker.value).toBe(recordLookupComponent.node.outputReference.value);
                    });
                    it('contains "New Resource"', async () => {
                        const groupedCombobox = await removePillAndGetGroupedCombobox(recordLookupComponent, [
                            INTERACTION_COMPONENTS_SELECTORS.RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT
                        ]);
                        expect(
                            getGroupedComboboxItemBy(
                                groupedCombobox,
                                'text',
                                'FlowBuilderExpressionUtils.newResourceLabel'
                            )
                        ).toBeDefined();
                    });

                    it('shows account variables up, no traversal', async () => {
                        sObjectOrSObjectCollectionPicker = await getGroupedCombobox();
                        await expectCannotBeTraversedInResourcePicker(['accountSObjectVariable']);
                    });
                    it('shows variable containing account up, only single account field', async () => {
                        sObjectOrSObjectCollectionPicker = await getGroupedCombobox();
                        await expectCanBeTraversedInResourcePicker(['apexComplexTypeVariable']);
                        await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'acctListField']);
                        await expectCannotBeTraversedInResourcePicker(['apexComplexTypeVariable', 'acct']);
                        await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'name']);
                    });
                    it('does not show non account variable up', async () => {
                        sObjectOrSObjectCollectionPicker = await getGroupedCombobox();
                        await expectCannotBeSelectedInResourcePicker(['caseSObjectVariable']);
                    });
                    it('does not show account collection variable up', async () => {
                        sObjectOrSObjectCollectionPicker = await getGroupedCombobox();
                        await expectCannotBeSelectedInResourcePicker(['accountSObjectCollectionVariable']);
                    });
                    it('should contain elements that contains apex that contains sobject and shows only single sobject fields up. Sobject fields should not be traversable', async () => {
                        sObjectOrSObjectCollectionPicker = await getGroupedCombobox();
                        await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable']);
                        await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable', 'testOne']);
                        await expectCannotBeTraversedInResourcePicker([
                            'apexComplexTypeTwoVariable',
                            'testOne',
                            'acct'
                        ]);
                        await expectCannotBeSelectedInResourcePicker(['apexComplexTypeTwoVariable', 'listOfTestOne']);
                        await expectCannotBeSelectedInResourcePicker(['apexComplexTypeTwoVariable', 'str']);
                    });
                    it('has validation error when manually entering a non account variable', async () => {
                        sObjectOrSObjectCollectionPicker = await getGroupedCombobox();
                        changeComboboxValue(sObjectOrSObjectCollectionPicker, '{!caseSObjectVariable}');
                        await ticks(1);
                        expect(
                            getResourceCombobox(getRecordSobjectAndQueryFields(recordLookupComponent)).errorMessage
                        ).toBe(FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC);
                    });
                });
                describe('pills', () => {
                    let combobox;
                    beforeEach(() => {
                        combobox = getResourceCombobox(recordLookupComponent, [
                            INTERACTION_COMPONENTS_SELECTORS.RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT
                        ]);
                    });
                    it('displays a pill with the selected value', async () => {
                        expect(combobox.hasPill).toBe(true);
                        expect(combobox.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountSObjectVariable'
                        });
                    });
                    it('displays "abbr" element as it is a required field', async () => {
                        const abbrElement = combobox.shadowRoot.querySelector(SELECTORS.ABBR);
                        expect(abbrElement).not.toBeNull();
                    });
                    describe('events', () => {
                        describe('events', () => {
                            it('displays empty combobox and no pill when pill is cleared', async () => {
                                expect(combobox.hasPill).toBe(true);
                                await removePill(combobox);
                                expect(combobox.hasPill).toBe(false);
                                expect(combobox.value).toEqual('');
                            });
                            it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                                expect(combobox.hasPill).toBe(true);
                                await clickPill(combobox);
                                expect(combobox.hasPill).toBe(false);
                                expect(combobox.value.displayText).toEqual('{!accountSObjectVariable}');
                            });
                            describe('typing', () => {
                                describe('errors', () => {
                                    it.each`
                                        sobjectPickerMergefieldValue    | errorMessage
                                        ${'{!accountSObjectVariable2}'} | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                                        ${'{!accountSObjectVariable'}   | ${'FlowBuilderCombobox.genericErrorMessage'}
                                        ${'{!accountSObjectVariable.}'} | ${'FlowBuilderCombobox.genericErrorMessage'}
                                        ${'literalitis'}                | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                                    `(
                                        'When typing "$sobjectPickerMergefieldValue" error message should be: $errorMessage',
                                        async ({ sobjectPickerMergefieldValue, errorMessage }) => {
                                            await removePill(combobox);
                                            await typeMergeFieldInCombobox(combobox, sobjectPickerMergefieldValue);
                                            expect(combobox.hasPill).toBe(false);
                                            expect(combobox.errorMessage).toEqual(errorMessage);
                                        }
                                    );
                                });
                                describe('NO errors', () => {
                                    it.each`
                                        sobjectPickerMergefieldValue                 | expectedPill
                                        ${'{!accountSObjectVariable}'}               | ${{ iconName: 'utility:sobject', label: 'accountSObjectVariable' }}
                                        ${'{!subflowAutomaticOutput.accountOutput}'} | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                                        ${'{!lookupRecordAutomaticOutput}'}          | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                                        ${'{!loopOnAccountAutoOutput}'}              | ${{ iconName: 'utility:sobject', label: 'Current Item from Loop loopOnAccountAutoOutput' }}
                                        ${'{!apexComplexTypeVariable.acct}'}         | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                                    `(
                                        'When typing "$sobjectPickerMergefieldValue" pill should be: $expectedPill',
                                        async ({ sobjectPickerMergefieldValue, expectedPill }) => {
                                            await removePill(combobox);
                                            await typeMergeFieldInCombobox(combobox, sobjectPickerMergefieldValue);
                                            expect(combobox.hasPill).toBe(true);
                                            expect(combobox.pill).toEqual(expectedPill);
                                        }
                                    );
                                });
                            });
                            describe('selecting', () => {
                                it.each`
                                    sobjectPickerValue                                     | expectedPill
                                    ${'accountSObjectVariable'}                            | ${{ iconName: 'utility:sobject', label: 'accountSObjectVariable' }}
                                    ${'apexComplexTypeVariable.acct'}                      | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                                    ${'Outputs from subflowAutomaticOutput.accountOutput'} | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                                    ${'Account from lookupRecordAutomaticOutput'}          | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                                    ${'Current Item from Loop loopOnAccountAutoOutput'}    | ${{ iconName: 'utility:sobject', label: 'Current Item from Loop loopOnAccountAutoOutput' }}
                                `(
                                    'When selecting "$sobjectPickerValue" pill should be: $expectedPill',
                                    async ({ sobjectPickerValue, expectedPill }) => {
                                        await removePill(combobox);
                                        await selectComboboxItemBy(combobox, 'text', sobjectPickerValue.split('.'));
                                        expect(combobox.hasPill).toBe(true);
                                        expect(combobox.pill).toEqual(expectedPill);
                                    }
                                );
                            });
                        });
                    });
                });
                describe('EntityResourcePicker', () => {
                    it('Selected entity is correctly displayed ', () => {
                        const entityResourcePicker = getEntityResourcePicker(recordLookupComponent);
                        expect(entityResourcePicker.value.displayText).toBe(recordLookupComponent.node.object.value);
                    });
                    it('remove selected entity should hide filter, sort, store option and query fields', async () => {
                        const entityResourcePicker = getEntityResourcePicker(recordLookupComponent);
                        const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                        changeComboboxValue(comboboxElement, '');
                        await ticks(1);
                        expect(getRecordSobjectAndQueryFields(recordLookupComponent)).toBeNull();
                        expect(getRecordStoreOption(recordLookupComponent)).toBeNull();
                        expect(getRecordFilter(recordLookupComponent)).toBeNull();
                        expect(getRecordSort(recordLookupComponent)).toBeNull();
                        expect(recordLookupComponent.node.object.error).toBe(
                            FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                        );
                    });
                    it('Enter an invalid value in the entity resource picker should not display other element but should display an error', async () => {
                        const entityResourcePicker = getEntityResourcePicker(recordLookupComponent);
                        const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                        changeComboboxValue(comboboxElement, 'invalidValue');
                        await ticks(1);
                        expect(getRecordSobjectAndQueryFields(recordLookupComponent)).toBeNull();
                        expect(getRecordStoreOption(recordLookupComponent)).toBeNull();
                        expect(getRecordFilter(recordLookupComponent)).toBeNull();
                        expect(getRecordSort(recordLookupComponent)).toBeNull();
                        expect(recordLookupComponent.node.object.error).toBe(
                            FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                        );
                    });
                    it('Enter a valid value in the entity resource picker should not display an error', async () => {
                        const entityResourcePicker = getEntityResourcePicker(recordLookupComponent);
                        const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                        changeComboboxValue(comboboxElement, 'Case');
                        await ticks(1);
                        expect(recordLookupComponent.node.object.error).toBeNull();
                        expect(getRecordSobjectAndQueryFields(recordLookupComponent)).not.toBeNull();
                        expect(getRecordStoreOption(recordLookupComponent)).not.toBeNull();
                        expect(getRecordFilter(recordLookupComponent)).not.toBeNull();
                        expect(getRecordSort(recordLookupComponent)).not.toBeNull();
                    });
                });
                it('Queried fields should be correctly displayed', () => {
                    const queryFieldElement = getSobjectAndFieldsElement(recordLookupComponent);
                    const recordFieldPickerRow = getAllRecordFieldPickerRows(queryFieldElement);
                    expect(recordFieldPickerRow).toHaveLength(2);
                    expect(recordFieldPickerRow[0].value).toBe('Id');
                    expect(recordFieldPickerRow[1].value).toBe('BillingAddress');
                });
                describe('Filter', () => {
                    let recordFilter;
                    beforeEach(() => {
                        recordFilter = getChildComponent(
                            recordLookupComponent,
                            INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER
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
                            newFilterItem('Account.BillingAddress', 'EqualTo', 'San Francisco', 'String')
                        );
                    });
                    describe('Condition logic change to custom', () => {
                        it('Custom condition logic input should be displayed', async () => {
                            getFilterConditionLogicCombobox(recordLookupComponent).dispatchEvent(
                                changeEvent(CONDITION_LOGIC.CUSTOM_LOGIC)
                            );
                            await ticks(1);
                            expect(getFilterCustomConditionLogicInput(recordLookupComponent)).not.toBeNull();
                            expect(getFilterCustomConditionLogicInput(recordLookupComponent).value).toBe('1');
                        });
                    });
                });
                it('sortField and SortOrder should be correctly displayed', () => {
                    const recordSortElement = getRecordSort(recordLookupComponent);
                    expect(recordSortElement.sortOrder).toBe('Asc');
                    expect(recordSortElement.selectedField).toBe('AnnualRevenue');
                });
                it('record store option should have "Only the first record" and "Together in a record variable" selected', () => {
                    const recordStoreElement = getRecordStoreOption(recordLookupComponent);
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('sObjectVariable');
                    expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(true);
                });
            });
            describe('Working with sObject Collection', () => {
                beforeAll(() => {
                    const element = getElementByDevName('getAccountsAutomaticWithFieldsAndFilters');
                    recordLookupNode = getElementForPropertyEditor(element);
                });
                beforeEach(() => {
                    recordLookupComponent = createComponentForTest(recordLookupNode);
                });
                it('record store option should have "All records" selected and the second radio group element should be hidden', async () => {
                    const recordStoreElement = getRecordStoreOption(recordLookupComponent);
                    const radioGroupElements = getRadioGroups(recordStoreElement);
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('allRecords');
                    expect(radioGroupElements).toHaveLength(1);
                });
                describe('SObjectOrSObjectCollectionPicker', () => {
                    it('displays variable vAccountCollection', () => {
                        const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                            recordLookupComponent
                        );
                        expect(sObjectOrSObjectCollectionPickerElement.value).toBe(
                            recordLookupComponent.node.outputReference.value
                        );
                    });
                    it('contains "New Resource"', () => {
                        const groupedCombobox = getRecordObjectAndQueryFieldResourceGroupedCombobox(
                            recordLookupComponent
                        );
                        expect(
                            getGroupedComboboxItemBy(
                                groupedCombobox,
                                'text',
                                'FlowBuilderExpressionUtils.newResourceLabel'
                            )
                        ).toBeDefined();
                    });
                    describe('pills', () => {
                        let combobox;
                        beforeEach(() => {
                            combobox = getResourceCombobox(recordLookupComponent, [
                                INTERACTION_COMPONENTS_SELECTORS.RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT
                            ]);
                        });
                        describe('typing', () => {
                            describe('errors', () => {
                                it.each`
                                    sobjectPickerMergefieldValue                 | errorMessage
                                    ${'{!accountSObjectVariable}'}               | ${'FlowBuilderCombobox.genericErrorMessage'}
                                    ${'{!accountSObjectVariable2}'}              | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                                    ${'{!accountSObjectVariable'}                | ${'FlowBuilderCombobox.genericErrorMessage'}
                                    ${'{!accountSObjectVariable.}'}              | ${'FlowBuilderCombobox.genericErrorMessage'}
                                    ${'{!apexComplexTypeVariable.doesNotExist}'} | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
                                    ${'literalitis'}                             | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                                `(
                                    'When typing "$sobjectPickerMergefieldValue" error message should be: $errorMessage',
                                    async ({ sobjectPickerMergefieldValue, errorMessage }) => {
                                        await typeMergeFieldInCombobox(combobox, sobjectPickerMergefieldValue);
                                        expect(combobox.hasPill).toBe(false);
                                        expect(combobox.errorMessage).toEqual(errorMessage);
                                    }
                                );
                            });
                            describe('NO errors', () => {
                                it.each`
                                    sobjectPickerMergefieldValue                           | expectedPill
                                    ${'{!accountSObjectCollectionVariable}'}               | ${{ iconName: 'utility:sobject', label: 'accountSObjectCollectionVariable' }}
                                    ${'{!subflowAutomaticOutput.accountOutputCollection}'} | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutputCollection' }}
                                    ${'{!apexComplexTypeVariable.acctListField}'}          | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acctListField' }}
                                    ${'{!lookupRecordCollectionAutomaticOutput}'}          | ${{ iconName: 'utility:sobject', label: 'Accounts from lookupRecordCollectionAutomaticOutput' }}
                                `(
                                    'When typing "$sobjectPickerMergefieldValue" pill should be: $expectedPill',
                                    async ({ sobjectPickerMergefieldValue, expectedPill }) => {
                                        await typeMergeFieldInCombobox(combobox, sobjectPickerMergefieldValue);
                                        expect(combobox.hasPill).toBe(true);
                                        expect(combobox.pill).toEqual(expectedPill);
                                    }
                                );
                            });
                        });
                        describe('selecting', () => {
                            it.each`
                                sobjectPickerValue                                       | expectedPill
                                ${'accountSObjectCollectionVariable'}                    | ${{ iconName: 'utility:sobject', label: 'accountSObjectCollectionVariable' }}
                                ${'Accounts from lookupRecordCollectionAutomaticOutput'} | ${{ iconName: 'utility:sobject', label: 'Accounts from lookupRecordCollectionAutomaticOutput' }}
                                ${'apexComplexTypeVariable.acctListField'}               | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acctListField' }}
                            `(
                                'When selecting "$sobjectPickerValue" pill should be: $expectedPill',
                                async ({ sobjectPickerValue, expectedPill }) => {
                                    await selectComboboxItemBy(combobox, 'text', sobjectPickerValue.split('.'));
                                    expect(combobox.hasPill).toBe(true);
                                    expect(combobox.pill).toEqual(expectedPill);
                                }
                            );
                        });
                    });
                });
                describe('Filter logic', () => {
                    describe('Filter logic change from all condition to custom', () => {
                        it('Custom condition logic input should be displayed with AND operator', async () => {
                            getFilterConditionLogicCombobox(recordLookupComponent).dispatchEvent(
                                changeEvent(CONDITION_LOGIC.CUSTOM_LOGIC)
                            );
                            await ticks(1);
                            expect(getFilterCustomConditionLogicInput(recordLookupComponent)).not.toBeNull();
                            expect(getFilterCustomConditionLogicInput(recordLookupComponent).value).toBe('1 AND 2');
                        });
                    });
                    describe('Filter logic change to any condition then custom', () => {
                        it('Custom condition logic input should be displayed with OR operator', async () => {
                            getFilterConditionLogicCombobox(recordLookupComponent).dispatchEvent(
                                changeEvent(CONDITION_LOGIC.OR)
                            );
                            await ticks(1);
                            getFilterConditionLogicCombobox(recordLookupComponent).dispatchEvent(
                                changeEvent(CONDITION_LOGIC.CUSTOM_LOGIC)
                            );
                            await ticks(1);
                            const filterCustomConditionLogic = getFilterCustomConditionLogicInput(
                                recordLookupComponent
                            );
                            expect(filterCustomConditionLogic).not.toBeNull();
                            expect(filterCustomConditionLogic.value).toBe('1 OR 2');
                        });
                    });
                });
            });
            describe('Working with fields', () => {
                beforeEach(() => {
                    const element = getElementByDevName('getAccountSeparateFieldsWithFilters');
                    recordLookupNode = getElementForPropertyEditor(element);
                    recordLookupComponent = createComponentForTest(recordLookupNode);
                });
                it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', () => {
                    const recordStoreElement = getRecordStoreOption(recordLookupComponent);
                    const radioGroupElements = getRadioGroups(recordStoreElement);
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                    expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(false);
                    expect(radioGroupElements).toHaveLength(2);
                });
                it('Selected entity is correctly displayed ', () => {
                    const entityResourcePicker = getEntityResourcePicker(recordLookupComponent);
                    expect(entityResourcePicker.value.displayText).toBe(recordLookupComponent.node.object.value);
                });
                it('remove selected entity should hide filter, sort, store option and query fields', async () => {
                    const entityResourcePicker = getEntityResourcePicker(recordLookupComponent);
                    const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                    comboboxElement.dispatchEvent(textInputEvent(''));
                    comboboxElement.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(getRecordSobjectAndQueryFields(recordLookupComponent)).toBeNull();
                    expect(getRecordStoreOption(recordLookupComponent)).toBeNull();
                    expect(getRecordFilter(recordLookupComponent)).toBeNull();
                    expect(getRecordSort(recordLookupComponent)).toBeNull();
                    expect(recordLookupComponent.node.object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                });
                it('Enter an invalid value in the entity resource picker should not display other element but should display an error', async () => {
                    const entityResourcePicker = getEntityResourcePicker(recordLookupComponent);
                    const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                    comboboxElement.dispatchEvent(textInputEvent('invalidValue'));
                    comboboxElement.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(getRecordSobjectAndQueryFields(recordLookupComponent)).toBeNull();
                    expect(getRecordStoreOption(recordLookupComponent)).toBeNull();
                    expect(getRecordFilter(recordLookupComponent)).toBeNull();
                    expect(getRecordSort(recordLookupComponent)).toBeNull();
                    expect(recordLookupComponent.node.object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                    );
                });
                it('Enter an valid value in the entity resource picker should not display an error', async () => {
                    const entityResourcePicker = getEntityResourcePicker(recordLookupComponent);
                    const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                    comboboxElement.dispatchEvent(textInputEvent('Case'));
                    comboboxElement.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(recordLookupComponent.node.object.error).toBeNull();
                    expect(getRecordSobjectAndQueryFields(recordLookupComponent)).not.toBeNull();
                    expect(getRecordStoreOption(recordLookupComponent)).not.toBeNull();
                    expect(getRecordFilter(recordLookupComponent)).not.toBeNull();
                    expect(getRecordSort(recordLookupComponent)).not.toBeNull();
                });
                it('sortField and SortOrder should be correctly displayed', () => {
                    const recordSortElement = getRecordSort(recordLookupComponent);
                    expect(recordSortElement.sortOrder).toBe('Asc');
                    expect(recordSortElement.selectedField).toBe('Name');
                });
                describe('Filters', () => {
                    let recordFilter, fieldToFerovExpressionBuilders;
                    beforeEach(() => {
                        recordFilter = getRecordFilter(recordLookupComponent);
                        fieldToFerovExpressionBuilders = getFieldToFerovExpressionBuilders(recordFilter);
                    });
                    it('should be displayed', () => {
                        expect(recordFilter).not.toBeNull();
                    });
                    it('number of filters', () => {
                        expect(fieldToFerovExpressionBuilders).toHaveLength(2);
                    });
                    test('LHS/Operator/RHS (with pills) values ', () => {
                        const accountSObjectVariable = getElementByDevName('accountSObjectVariable')!;
                        expect(recordFilter.filterItems[0]).toMatchObject({
                            leftHandSide: {
                                value: 'Account.BillingCity'
                            },
                            operator: {
                                value: 'EqualTo'
                            },
                            rightHandSide: {
                                value: `${accountSObjectVariable.guid}.BillingCity`
                            },
                            rightHandSideDataType: {
                                value: 'reference'
                            }
                        });
                        const baseExpressionBuilderComponent = getBaseExpressionBuilderByIndex(recordFilter);
                        const rhsCombobox = getBaseExpressionBuilderRhsCombobox(baseExpressionBuilderComponent);
                        expect(rhsCombobox.hasPill).toBe(true);
                        expect(rhsCombobox.pill).toEqual({
                            iconName: 'utility:text',
                            label: 'accountSObjectVariable > Billing City'
                        });

                        expect(recordFilter.filterItems[1]).toMatchObject({
                            leftHandSide: {
                                value: 'Account.BillingCountry'
                            },
                            operator: {
                                value: 'EqualTo'
                            },
                            rightHandSide: {
                                value: 'USA'
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
                        expect(operatorsComboboxComponent.options).toHaveLength(6);
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
                    it('does not display LHS/RHS pill as literal values used', () => {
                        const baseExpressionBuilderComponent = getBaseExpressionBuilder(
                            fieldToFerovExpressionBuilders[1]
                        );
                        const [lhsCombobox, rhsCombobox] = baseExpressionBuilderComponent.shadowRoot.querySelectorAll(
                            INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
                        );
                        expect(lhsCombobox.isPillSupported).toBe(true);
                        expect(rhsCombobox.isPillSupported).toBe(true);
                        expect(lhsCombobox.value.displayText).toEqual('BillingCountry');
                        expect(lhsCombobox.pill).toBeNull();
                        expect(rhsCombobox.value).toEqual('USA');
                        expect(rhsCombobox.pill).toBeNull();
                    });
                    it('does display RHS pill when RHS value changed and is no a literal', async () => {
                        const baseExpressionBuilderComponent = getBaseExpressionBuilder(
                            fieldToFerovExpressionBuilders[1]
                        );
                        const [lhsCombobox, rhsCombobox] = baseExpressionBuilderComponent.shadowRoot.querySelectorAll(
                            INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
                        );
                        expect(lhsCombobox.isPillSupported).toBe(true);
                        expect(lhsCombobox.value.displayText).toEqual('BillingCountry');
                        expect(lhsCombobox.pill).toBeNull();
                        await selectComboboxItemBy(rhsCombobox, 'text', ['stringVariable']);
                        expect(rhsCombobox.value.displayText).toEqual('{!stringVariable}');
                        expect(rhsCombobox.pill).toEqual({
                            iconName: 'utility:text',
                            label: 'stringVariable'
                        });
                        expect(rhsCombobox.pillTooltip).toEqual('stringVariable');
                    });
                    describe('Filter logic change to custom', () => {
                        it('Custom condition logic input should be displayed', async () => {
                            getFilterConditionLogicCombobox(recordLookupComponent).dispatchEvent(
                                changeEvent(CONDITION_LOGIC.CUSTOM_LOGIC)
                            );
                            await ticks(1);
                            expect(getFilterCustomConditionLogicInput(recordLookupComponent)).not.toBeNull();
                            expect(getFilterCustomConditionLogicInput(recordLookupComponent).value).toBe('1 AND 2');
                        });
                    });
                });
                describe('Output Assignments', () => {
                    let outputAssignments, fieldToFerovExpressionBuilder;
                    beforeEach(() => {
                        outputAssignments = getRecordInputOutputAssignments(recordLookupComponent);
                        fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(outputAssignments);
                    });
                    it('should be displayed', () => {
                        expect(outputAssignments).not.toBeNull();
                    });
                    it('number of', () => {
                        expect(outputAssignments.inputOutputAssignmentsItems).toHaveLength(1);
                    });
                    it('LHS/Operator/LHS values', () => {
                        const baseExpressionBuilder = getBaseExpressionBuilder(fieldToFerovExpressionBuilder[0]);
                        expect(baseExpressionBuilder.lhsValue).toMatchObject({
                            value: 'Account.BillingCity'
                        });
                        expect(baseExpressionBuilder.operatorValue).toBeUndefined();
                        expect(baseExpressionBuilder.rhsValue).toBe('Los Angeles');
                    });
                });
            });
        });
        describe('Assign to Apex variable', () => {
            describe('Record store options', () => {
                it('is set to All Records for multiple records into an apex variable', () => {
                    const element = getElementByDevName('get_accounts_into_apex_variable');
                    recordLookupNode = getElementForPropertyEditor(element);
                    recordLookupComponent = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);

                    const recordStoreElement = getRecordStoreOption(recordLookupComponent);

                    expect(recordStoreElement.numberOfRecordsToStore).toBe('allRecords');
                });
                it('is set to first record for single record into an apex variable', () => {
                    const element = getElementByDevName('get_account_into_apex_variable');
                    recordLookupNode = getElementForPropertyEditor(element);
                    recordLookupComponent = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);

                    const recordStoreElement = getRecordStoreOption(recordLookupComponent);

                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                });
            });
        });
    });
    // W-7656897
    describe('Flow that does NOT support automatic output', () => {
        beforeAll(async () => {
            await setupStateForFlow(fieldServiceMobileFlow);
        });
        afterAll(() => {
            resetState();
        });
        describe('sObject Or SObject Collection Picker', () => {
            beforeAll(() => {
                const element = getElementByDevName('get_Accounts');
                recordLookupNode = getElementForPropertyEditor(element);
                recordLookupComponent = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
            });
            it('is updated when switching to multiple', async () => {
                // When
                changeLightningRadioGroupValue(
                    getRadioGroups(getRecordStoreOption(recordLookupComponent))[0],
                    'allRecords'
                );

                // Then
                await ticks(1);
                sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordLookupComponent, [
                    INTERACTION_COMPONENTS_SELECTORS.RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT
                ]);
                await expectCannotBeTraversedInResourcePicker(['vAccounts']);
                await expectCannotBeSelectedInResourcePicker(['vMyTestAccount']);
            });
        });
    });
});
