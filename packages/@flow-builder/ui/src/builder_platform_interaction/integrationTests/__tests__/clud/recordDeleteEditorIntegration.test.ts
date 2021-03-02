import { createElement } from 'lwc';
import RecordDeleteEditor from 'builder_platform_interaction/recordDeleteEditor';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    getChildComponent,
    resetState,
    translateFlowToUIAndDispatch,
    setupStateForFlow
} from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { EditElementEvent } from 'builder_platform_interaction/events';
import {
    getEntityResourcePickerChildGroupedComboboxComponent,
    getEntityResourcePicker,
    getBaseResourcePickerCombobox,
    removePillAndGetGroupedCombobox,
    getResourceCombobox,
    getRecordStoreOption,
    getSObjectOrSObjectCollectionPicker,
    getRecordFilter,
    getRecordVariablePickerChildComboboxComponent
} from './cludEditorTestUtils';
import {
    changeEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { expectCanBeTraversed, expectCannotBeTraversed, expectCannotBeSelected } from '../groupedComboboxTestUtils';
import {
    getFilterConditionLogicCombobox,
    getFilterCustomConditionLogicInput,
    newFilterItem,
    getFieldToFerovExpressionBuilders
} from '../recordFilterTestUtils';
import { addRecordVariable, deleteVariableWithName } from '../resourceTestUtils';

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

const SELECTORS = { ABBR: 'ABBR' };

const createComponentForTest = (props) => {
    const el = createElement('builder_platform_interaction-record-delete-editor', { is: RecordDeleteEditor });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

const expectCanBeTraversedInResourcePicker = async (textValues, sObjectOrSObjectCollectionPicker) => {
    await expectCanBeTraversed(sObjectOrSObjectCollectionPicker, 'text', textValues);
};
const expectCannotBeTraversedInResourcePicker = async (textValues, sObjectOrSObjectCollectionPicker) => {
    await expectCannotBeTraversed(sObjectOrSObjectCollectionPicker, 'text', textValues);
};
const expectCannotBeSelectedInResourcePicker = async (textValues, sObjectOrSObjectCollectionPicker) => {
    await expectCannotBeSelected(sObjectOrSObjectCollectionPicker, 'text', textValues);
};

describe('Record Delete Editor', () => {
    beforeAll(async () => {
        const store = await setupStateForFlow(flowWithAllElements);
        translateFlowToUIAndDispatch(flowWithAllElements, store);
    });
    afterAll(() => {
        resetState();
    });
    describe('Add new element', () => {
        let recordDeleteComponent;

        beforeEach(() => {
            const recordDeleteNode = getElementForPropertyEditor({
                elementType: ELEMENT_TYPE.RECORD_DELETE,
                isNewElement: true
            });
            recordDeleteComponent = createComponentForTest({ node: recordDeleteNode });
        });
        describe('store options', () => {
            it('"useSobject" should be true', () => {
                expect(recordDeleteComponent.getNode().useSobject).toBe(true);
            });
            it('should be displayed', () => {
                expect(getRecordStoreOption(recordDeleteComponent)).not.toBeNull();
            });
            it('"numberOfRecordsToStore" should be "firstRecord" (ie: "Use the IDs stored in a record variable or record collection variable")', () => {
                expect(getRecordStoreOption(recordDeleteComponent).numberOfRecordsToStore).toBe('firstRecord');
            });
        });
        describe('"SObjectOrSObjectCollectionPicker"', () => {
            let sObjectOrSObjectCollectionPicker;
            beforeEach(() => {
                sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordDeleteComponent);
            });
            it('should be displayed', () => {
                expect(sObjectOrSObjectCollectionPicker).not.toBeNull();
            });
            it('value should be an empty string', () => {
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });
            describe('pills', () => {
                it('should have no pill displayed', () => {
                    const combobox = getRecordVariablePickerChildComboboxComponent(sObjectOrSObjectCollectionPicker);
                    expect(combobox.element.hasPill).toBe(false);
                });
                describe('events', () => {
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = getRecordVariablePickerChildComboboxComponent(
                            sObjectOrSObjectCollectionPicker
                        );
                        await combobox.typeMergeField('{!accountSObjectCollectionVariable}');
                        expect(combobox.element.hasPill).toBe(true);
                        expect(combobox.element.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountSObjectCollectionVariable'
                        });
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" literal value display no pill but error message (once pill has been cleared))', async () => {
                        const combobox = getRecordVariablePickerChildComboboxComponent(
                            sObjectOrSObjectCollectionPicker
                        );
                        await combobox.typeLiteralValue('literalitis');
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.errorMessage).toEqual('FlowBuilderCombobox.genericErrorMessage');
                    });
                    it('select and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = getRecordVariablePickerChildComboboxComponent(
                            sObjectOrSObjectCollectionPicker
                        );
                        await combobox.selectItemBy('text', ['accountSObjectCollectionVariable']);
                        expect(combobox.element.hasPill).toBe(true);
                        expect(combobox.element.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountSObjectCollectionVariable'
                        });
                    });
                });
            });
        });
    });
    describe('Existing element', () => {
        let recordDeleteComponent;
        describe('Using sObject', () => {
            let recordDeleteNode;
            beforeAll(() => {
                const element = getElementByDevName('deleteAccount');
                recordDeleteNode = getElementForPropertyEditor(element);
            });
            beforeEach(() => {
                recordDeleteComponent = createComponentForTest({
                    node: recordDeleteNode,
                    processType: 'Flow',
                    mode: EditElementEvent.EVENT_NAME
                });
            });
            describe('store options', () => {
                it('"useSobject" should be true', () => {
                    expect(recordDeleteComponent.getNode().useSobject).toBe(true);
                });
                it('should be displayed', () => {
                    expect(getRecordStoreOption(recordDeleteComponent)).not.toBeNull();
                });
                it('value should be "firstRecord" (ie: "Use the IDs stored in a record variable or record collection variable")', () => {
                    expect(getRecordStoreOption(recordDeleteComponent).numberOfRecordsToStore).toBe('firstRecord');
                });
            });
            describe('"SObjectOrSObjectCollectionPicker"', () => {
                let sObjectOrSObjectCollectionPicker;
                beforeEach(() => {
                    sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordDeleteComponent);
                });
                it('should be displayed', () => {
                    expect(sObjectOrSObjectCollectionPicker).not.toBeNull();
                });
                it('displays selected value', () => {
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(recordDeleteNode.inputReference.value);
                });
                it('contains "New Resource" entry', async () => {
                    const combobox = getResourceCombobox(recordDeleteComponent);
                    await combobox.removePill();
                    const groupedCombobox = getRecordVariablePickerChildComboboxComponent(
                        sObjectOrSObjectCollectionPicker
                    ).getGroupedCombobox();
                    await ticks(1);
                    expect(
                        groupedCombobox.getItemBy('text', 'FlowBuilderExpressionUtils.newResourceLabel')
                    ).toBeDefined();
                });
                it('contains all record variables', async () => {
                    const combobox = getResourceCombobox(recordDeleteComponent);
                    await combobox.removePill();
                    const comboboxItems = getRecordVariablePickerChildComboboxComponent(
                        sObjectOrSObjectCollectionPicker
                    ).getGroupedCombobox().element.items;
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
                it('contains sobject collection', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordDeleteComponent);
                    await expectCannotBeTraversedInResourcePicker(
                        ['accountSObjectCollectionVariable'],
                        sObjectOrSObjectCollectionPicker
                    );
                });
                it('contains single sobject, no traversal', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordDeleteComponent);
                    await expectCannotBeTraversedInResourcePicker(
                        ['accountSObjectVariable'],
                        sObjectOrSObjectCollectionPicker
                    );
                });
                it('contains apex that only contains a single sobject', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordDeleteComponent);
                    await expectCanBeTraversedInResourcePicker(
                        ['apexContainsOnlyASingleSObjectVariable'],
                        sObjectOrSObjectCollectionPicker
                    );
                });
                it('contains apex that only contains an SObject collection', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordDeleteComponent);
                    await expectCanBeTraversedInResourcePicker(
                        ['apexContainsOnlyAnSObjectCollectionVariable'],
                        sObjectOrSObjectCollectionPicker
                    );
                });
                it('contains complex apex type and shows up only sobject or sobject collection fields', async () => {
                    const recordVariablePicker = await removePillAndGetGroupedCombobox(recordDeleteComponent);
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeVariable'], recordVariablePicker);
                    await expectCannotBeTraversedInResourcePicker(
                        ['apexComplexTypeVariable', 'acct'],
                        recordVariablePicker
                    );
                    await expectCannotBeTraversedInResourcePicker(
                        ['apexComplexTypeVariable', 'acctListField'],
                        recordVariablePicker
                    );
                    await expectCannotBeSelectedInResourcePicker(
                        ['apexComplexTypeVariable', 'name'],
                        recordVariablePicker
                    );
                });
                it('contains elements that contains apex that contains sobject and shows only sobject (single or collection) fields up. Sobject fields should not be traversable', async () => {
                    const recordVariablePicker = await removePillAndGetGroupedCombobox(recordDeleteComponent);
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable'], recordVariablePicker);
                    await expectCanBeTraversedInResourcePicker(
                        ['apexComplexTypeTwoVariable', 'testOne'],
                        recordVariablePicker
                    );
                    await expectCannotBeTraversedInResourcePicker(
                        ['apexComplexTypeTwoVariable', 'testOne', 'acct'],
                        recordVariablePicker
                    );
                    await expectCannotBeTraversedInResourcePicker(
                        ['apexComplexTypeTwoVariable', 'testOne', 'acctListField'],
                        recordVariablePicker
                    );
                    await expectCannotBeSelectedInResourcePicker(
                        ['apexComplexTypeTwoVariable', 'str'],
                        recordVariablePicker
                    );
                });
                it('does not contain element that is not sobject or does not contain sobject', async () => {
                    const recordVariablePicker = await removePillAndGetGroupedCombobox(recordDeleteComponent);
                    await expectCannotBeSelectedInResourcePicker(['apexCarVariable'], recordVariablePicker);
                });
                it('contains only elements that are deletable sobject or contain deletable sobject', async () => {
                    try {
                        addRecordVariable('onlyCreateableRecordVar', 'ProcessExceptionEvent');
                        addRecordVariable('onlyQueryableRecordVar', 'Community');
                        addRecordVariable('updateableAndQueryableRecordVar', 'Organization');
                        addRecordVariable('deletableAndQueryableRecordVar', 'AccountFeed');
                        const resourceCombobox = getResourceCombobox(recordDeleteComponent);
                        await resourceCombobox.removePill();
                        // account is createable, queryable, updateable, deletable
                        await expect(resourceCombobox).canSelectInCombobox('text', ['accountSObjectVariable']);
                        // this record var is only createable
                        await expect(resourceCombobox).not.canSelectInCombobox('text', ['onlyCreateableRecordVar']);
                        // this record var is updateable and queryable
                        await expect(resourceCombobox).not.canSelectInCombobox('text', [
                            'updateableAndQueryableRecordVar'
                        ]);
                        // this record var is only queryable
                        await expect(resourceCombobox).not.canSelectInCombobox('text', ['onlyQueryableRecordVar']);
                        // this record var is queryable and deletable
                        await expect(resourceCombobox).canSelectInCombobox('text', ['deletableAndQueryableRecordVar']);
                    } finally {
                        deleteVariableWithName('onlyCreateableRecordVar');
                        deleteVariableWithName('onlyQueryableRecordVar');
                        deleteVariableWithName('updateableAndQueryableRecordVar');
                        deleteVariableWithName('deletableAndQueryableRecordVar');
                    }
                });
                describe('pills', () => {
                    it('displays a pill with the selected value', async () => {
                        const combobox = getRecordVariablePickerChildComboboxComponent(
                            sObjectOrSObjectCollectionPicker
                        );
                        expect(combobox.element.hasPill).toBe(true);
                        expect(combobox.element.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountSObjectVariable'
                        });
                    });
                    it('displays "abbr" element as it is a required field', async () => {
                        const combobox = getRecordVariablePickerChildComboboxComponent(
                            sObjectOrSObjectCollectionPicker
                        );

                        const abbrElement = combobox.element.shadowRoot!.querySelector(SELECTORS.ABBR);
                        expect(abbrElement).not.toBeNull();
                    });
                    describe('events', () => {
                        it('displays empty combobox and no pill when pill is cleared', async () => {
                            const combobox = getRecordVariablePickerChildComboboxComponent(
                                sObjectOrSObjectCollectionPicker
                            );
                            expect(combobox.element.hasPill).toBe(true);
                            await combobox.removePill();
                            expect(combobox.element.hasPill).toBe(false);
                            expect(combobox.element.value).toEqual('');
                        });
                        it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                            const combobox = getRecordVariablePickerChildComboboxComponent(
                                sObjectOrSObjectCollectionPicker
                            );
                            expect(combobox.element.hasPill).toBe(true);
                            await combobox.clickPill();
                            expect(combobox.element.hasPill).toBe(false);
                            expect(combobox.element.value.displayText).toEqual('{!accountSObjectVariable}');
                        });
                        describe('typing', () => {
                            describe('errors', () => {
                                it.each`
                                    resourcePickerMergefieldValue   | errorMessage
                                    ${'{!accountSObjectVariable2}'} | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                                    ${'{!accountSObjectVariable'}   | ${'FlowBuilderCombobox.genericErrorMessage'}
                                    ${'{!accountSObjectVariable.}'} | ${'FlowBuilderCombobox.genericErrorMessage'}
                                    ${'literalitis'}                | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                                `(
                                    'When typing "$resourcePickerMergefieldValue" error message should be: $errorMessage',
                                    async ({ resourcePickerMergefieldValue, errorMessage }) => {
                                        const combobox = getRecordVariablePickerChildComboboxComponent(
                                            sObjectOrSObjectCollectionPicker
                                        );
                                        await combobox.removePill();
                                        await combobox.typeMergeField(resourcePickerMergefieldValue);
                                        expect(combobox.element.hasPill).toBe(false);
                                        expect(combobox.element.errorMessage).toEqual(errorMessage);
                                    }
                                );
                            });
                            describe('NO errors', () => {
                                it.each`
                                    resourcePickerMergefieldValue                 | expectedPill
                                    ${'{!accountSObjectVariable}'}                | ${{ iconName: 'utility:sobject', label: 'accountSObjectVariable' }}
                                    ${'{!apexComplexTypeVariable.acct}'}          | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                                    ${'{!subflowAutomaticOutput.accountOutput}'}  | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                                    ${'{!lookupRecordAutomaticOutput}'}           | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                                    ${'{!apexCall_anonymous_account}'}            | ${{ iconName: 'utility:sobject', label: 'Account from apexCall_anonymous_account' }}
                                    ${'{!loopOnAccountAutoOutput}'}               | ${{ iconName: 'utility:sobject', label: 'Current Item from Loop loopOnAccountAutoOutput' }}
                                    ${'{!accountSObjectCollectionVariable}'}      | ${{ iconName: 'utility:sobject', label: 'accountSObjectCollectionVariable' }}
                                    ${'{!apexComplexTypeVariable.acct}'}          | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                                    ${'{!lookupRecordCollectionAutomaticOutput}'} | ${{ iconName: 'utility:sobject', label: 'Accounts from lookupRecordCollectionAutomaticOutput' }}
                                    ${'{!apexCall_anonymous_accounts}'}           | ${{ iconName: 'utility:sobject', label: 'Accounts from apexCall_anonymous_accounts' }}
                                `(
                                    'When typing "$resourcePickerMergefieldValue" pill should be: $expectedPill',
                                    async ({ resourcePickerMergefieldValue, expectedPill }) => {
                                        const combobox = getRecordVariablePickerChildComboboxComponent(
                                            sObjectOrSObjectCollectionPicker
                                        );
                                        await combobox.removePill();
                                        await combobox.typeMergeField(resourcePickerMergefieldValue);
                                        expect(combobox.element.hasPill).toBe(true);
                                        expect(combobox.element.pill).toEqual(expectedPill);
                                    }
                                );
                            });
                        });
                        describe('selecting', () => {
                            it.each`
                                resourcePickerValue                                      | expectedPill
                                ${'accountSObjectVariable'}                              | ${{ iconName: 'utility:sobject', label: 'accountSObjectVariable' }}
                                ${'apexComplexTypeVariable.acct'}                        | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                                ${'Outputs from subflowAutomaticOutput.accountOutput'}   | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                                ${'Account from lookupRecordAutomaticOutput'}            | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                                ${'Account from apexCall_anonymous_account'}             | ${{ iconName: 'utility:sobject', label: 'Account from apexCall_anonymous_account' }}
                                ${'Current Item from Loop loopOnAccountAutoOutput'}      | ${{ iconName: 'utility:sobject', label: 'Current Item from Loop loopOnAccountAutoOutput' }}
                                ${'accountSObjectCollectionVariable'}                    | ${{ iconName: 'utility:sobject', label: 'accountSObjectCollectionVariable' }}
                                ${'Accounts from lookupRecordCollectionAutomaticOutput'} | ${{ iconName: 'utility:sobject', label: 'Accounts from lookupRecordCollectionAutomaticOutput' }}
                                ${'Accounts from apexCall_anonymous_accounts'}           | ${{ iconName: 'utility:sobject', label: 'Accounts from apexCall_anonymous_accounts' }}
                                ${'apexComplexTypeVariable.acctListField'}               | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acctListField' }}
                            `(
                                'When selecting "$resourcePickerValue" pill should be: $expectedPill',
                                async ({ resourcePickerValue, expectedPill }) => {
                                    const combobox = getRecordVariablePickerChildComboboxComponent(
                                        sObjectOrSObjectCollectionPicker
                                    );
                                    await combobox.removePill();
                                    await combobox.selectItemBy('text', resourcePickerValue.split('.'));
                                    expect(combobox.element.hasPill).toBe(true);
                                    expect(combobox.element.pill).toEqual(expectedPill);
                                }
                            );
                        });
                    });
                });
            });
        });
        describe('Using fields', () => {
            let recordDeleteNode;
            beforeAll(() => {
                const element = getElementByDevName('deleteAccountWithFilters');
                recordDeleteNode = getElementForPropertyEditor(element);
            });
            beforeEach(() => {
                recordDeleteComponent = createComponentForTest({
                    node: recordDeleteNode,
                    processType: 'Flow',
                    mode: EditElementEvent.EVENT_NAME
                });
            });
            describe('store options', () => {
                it('"useSobject" should be false', () => {
                    expect(recordDeleteComponent.getNode().useSobject).toBe(false);
                });
                it('should be displayed', () => {
                    expect(getRecordStoreOption(recordDeleteComponent)).not.toBeNull();
                });
                it('value should be "allRecords" (ie: "Specify conditions")', () => {
                    expect(getRecordStoreOption(recordDeleteComponent).numberOfRecordsToStore).toBe('allRecords');
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
                it('only deletable entities available', async () => {
                    // see mock-entity.js (deletable = true)
                    // Disable render-incrementally on combobox so groupedCombobox gets full menu data
                    const combobox = getBaseResourcePickerCombobox(entityResourcePicker);
                    combobox.element.renderIncrementally = false;
                    await ticks(1);
                    const comboboxItems = getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker)
                        .element.items;
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
                    beforeEach(async () => {
                        await getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker).type(
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
                    beforeEach(async () => {
                        await getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker).type('Case');
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
                    beforeEach(async () => {
                        await getEntityResourcePickerChildGroupedComboboxComponent(entityResourcePicker).type('');
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
                    recordFilter = getRecordFilter(recordDeleteComponent);
                });
                it('should be displayed', () => {
                    expect(recordFilter).not.toBeNull();
                });
                it('filter type', () => {
                    expect(recordFilter.filterLogic).toMatchObject({ error: null, value: '(1 AND 2) OR 3' });
                });
                it('number of filters', () => {
                    expect(recordFilter.filterItems).toHaveLength(3);
                });
                test('LHS/Operator/RHS (with pills)', async () => {
                    const accountSObjectVariable = getElementByDevName('accountSObjectVariable')!;
                    expect(recordFilter.filterItems[0]).toMatchObject(
                        newFilterItem(
                            'Account.BillingCity',
                            'EqualTo',
                            `${accountSObjectVariable.guid}.BillingCity`,
                            'reference'
                        )
                    );
                    const rhsCombobox = await getFieldToFerovExpressionBuilders(recordFilter)[0].getRhsCombobox();
                    expect(rhsCombobox.element.hasPill).toBe(true);
                    expect(rhsCombobox.element.pill).toEqual({
                        iconName: 'utility:text',
                        label: 'accountSObjectVariable > Billing City'
                    });

                    expect(recordFilter.filterItems[1]).toMatchObject(
                        newFilterItem('Account.BillingCountry', 'EqualTo', 'USA', 'String')
                    );
                });
                it('operators available for the first filter', () => {
                    const operatorsComboboxComponent = getFieldToFerovExpressionBuilders(
                        recordFilter
                    )[0].getOperatorComboboxElement();
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
                    expect(getFilterCustomConditionLogicInput(recordDeleteComponent).value).toBe('(1 AND 2) OR 3');
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
