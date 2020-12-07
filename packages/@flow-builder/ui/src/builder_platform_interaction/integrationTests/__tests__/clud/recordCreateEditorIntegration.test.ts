import { createElement } from 'lwc';
import RecordCreateEditor from 'builder_platform_interaction/recordCreateEditor';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    changeComboboxValue,
    setupStateForProcessType,
    resetState,
    translateFlowToUIAndDispatch,
    changeLightningRadioGroupValue,
    setupStateForFlow
} from '../integrationTestUtils';
import { getLabelDescriptionLabelElement, getLabelDescriptionNameElement } from '../labelDescriptionTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import {
    flowWithCreateRecordUsingSObject,
    flowWithCreateRecordUsingSObjectCollection,
    flowWithCreateRecordUsingFields
} from 'mock/flows/flowWithCreateRecord';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import { ELEMENT_TYPE, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    getAdvancedOptionCheckbox,
    getUseAdvancedOptionComponent,
    deepQuerySelector,
    focusoutEvent,
    clickEvent,
    ticks,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    removePill,
    clickPill
} from 'builder_platform_interaction/builderTestUtils';
import { getLhsCombobox, getBaseExpressionBuilder } from '../expressionBuilderTestUtils';
import {
    selectComboboxItemBy,
    getComboboxItems,
    typeReferenceOrValueInCombobox,
    typeMergeFieldInCombobox,
    typeLiteralValueInCombobox
} from '../comboboxTestUtils';
import {
    getGroupedComboboxItemBy,
    expectCanBeTraversed,
    expectCannotBeTraversed,
    expectCannotBeSelected
} from '../groupedComboboxTestUtils';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import {
    getResourceGroupedCombobox,
    getResourceCombobox,
    getOutputResourcePicker,
    getRadioGroups,
    getEntityResourcePicker,
    getOutputBaseResourcePickerCombobox,
    removePillAndGetGroupedCombobox,
    getBaseExpressionBuilderRhsCombobox
} from './cludEditorTestUtils';
import { getFieldToFerovExpressionBuilders } from '../recordFilterTestUtils';

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'Flow';

const getSObjectOrSObjectCollectionPicker = (recordEditor) =>
    recordEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);
const getRecordStoreOption = (recordEditor) =>
    recordEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION);
const getInputOutputAssignments = (recordEditor) =>
    recordEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);
const getEntityResourcePickerComboboxElement = (entityResourcePicker) =>
    deepQuerySelector(entityResourcePicker, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
const getExpressionBuilderComboboxElement = (expressionBuilder) =>
    deepQuerySelector(expressionBuilder, [
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

const createComponentForTest = (node: {}, processType = MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE) => {
    const el = createElement('builder_platform_interaction-record-create-editor', { is: RecordCreateEditor });
    Object.assign(el, { node, processType });
    document.body.appendChild(el);
    return el;
};

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

describe('Record Create Editor', () => {
    let recordCreateNode;
    let recordCreateElement;
    let store;
    let sObjectOrSObjectCollectionPicker;
    const expectCannotBeTraversedInResourcePicker = async (textValues) => {
        await expectCannotBeTraversed(sObjectOrSObjectCollectionPicker, 'text', textValues);
    };
    const expectCannotBeSelectedInResourcePicker = async (textValues) => {
        await expectCannotBeSelected(sObjectOrSObjectCollectionPicker, 'text', textValues);
    };
    describe('Working in auto launched flow', () => {
        beforeAll(async () => {
            store = await setupStateForProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
        });
        afterAll(() => {
            resetState();
        });
        describe('name and dev name', () => {
            beforeAll(() => {
                translateFlowToUIAndDispatch(flowWithCreateRecordUsingSObject, store);
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName('Create_Record_Using_SObject');
                recordCreateNode = getElementForPropertyEditor(element);
            });
            it('do not change devName if it already exists after the user modifies the name', async () => {
                const newLabel = 'new label';
                recordCreateElement = createComponentForTest(recordCreateNode);
                const labelInput = getLabelDescriptionLabelElement(recordCreateElement);
                labelInput.value = newLabel;
                labelInput.dispatchEvent(focusoutEvent);
                await ticks(1);
                expect(recordCreateElement.node.label.value).toBe(newLabel);
                expect(recordCreateElement.node.name.value).toBe('Create_Record_Using_SObject');
            });
            it('modify the dev name', async () => {
                const newDevName = 'newName';
                recordCreateElement = createComponentForTest(recordCreateNode);
                const devNameInput = getLabelDescriptionNameElement(recordCreateElement);
                devNameInput.value = newDevName;
                devNameInput.dispatchEvent(focusoutEvent);
                await ticks(1);
                expect(recordCreateElement.node.name.value).toBe(newDevName);
            });
            it('displays error if name is cleared', async () => {
                const newLabel = '';
                recordCreateElement = createComponentForTest(recordCreateNode);
                const labelInput = getLabelDescriptionLabelElement(recordCreateElement);
                labelInput.value = newLabel;
                labelInput.dispatchEvent(focusoutEvent);
                await ticks(1);
                expect(recordCreateElement.node.label.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
            it('displays error if devName is cleared', async () => {
                const newDevName = '';
                recordCreateElement = createComponentForTest(recordCreateNode);
                const devNameInput = getLabelDescriptionNameElement(recordCreateElement);
                devNameInput.value = newDevName;
                devNameInput.dispatchEvent(focusoutEvent);
                await ticks(1);
                expect(recordCreateElement.node.name.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
        describe('Add new element', () => {
            beforeAll(() => {
                recordCreateNode = getElementForPropertyEditor({
                    locationX: 10,
                    locationY: 10,
                    elementType: ELEMENT_TYPE.RECORD_CREATE
                });
                recordCreateElement = createComponentForTest(recordCreateNode);
            });
            it('"sobjectOrSobjectCollectionPicker" should be empty', () => {
                const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                    recordCreateElement
                );
                expect(sObjectOrSObjectCollectionPickerElement.value).toBe('');
            });
            it('should not display a pill for the "sobjectOrSobjectCollectionPicker"', () => {
                const sObjectOrSObjectCollectionPickerCombobox = getResourceCombobox(recordCreateElement);
                expect(sObjectOrSObjectCollectionPickerCombobox.hasPill).toBe(false);
            });
            // W-7118031
            it('does NOT display "A value is required." error message for "sobjectOrSobjectCollectionPicker" ("record selection")', () => {
                const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                    recordCreateElement
                );
                expect(sObjectOrSObjectCollectionPickerElement.errorMessage).toBeNull();
            });
            it('record Store Option should have firstRecord and sObjectVariable selected', () => {
                const recordStoreElement = getRecordStoreOption(recordCreateElement);
                const radioGroupElements = getRadioGroups(recordStoreElement);
                expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                expect(recordStoreElement.wayToStoreFields).toBe('sObjectVariable');
                expect(radioGroupElements).toHaveLength(2);
            });
            it('typing and blur with "sobjectOrSobjectCollectionPicker" literal value display error message and no pill)', async () => {
                const combobox = await getResourceCombobox(recordCreateElement);
                await typeLiteralValueInCombobox(combobox, 'iamaliteral');
                expect(combobox.hasPill).toBe(false);
                expect(combobox.errorMessage).toEqual('FlowBuilderCombobox.genericErrorMessage');
            });
            it('typing and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill)', async () => {
                const combobox = await getResourceCombobox(recordCreateElement);
                await typeMergeFieldInCombobox(combobox, '{!vAccount}');
                expect(combobox.hasPill).toBe(true);
                expect(combobox.pill).toEqual({ iconName: 'utility:sobject', label: 'vAccount' });
            });
        });
        describe('Existing element', () => {
            describe('Working with sObject', () => {
                beforeAll(() => {
                    translateFlowToUIAndDispatch(flowWithCreateRecordUsingSObject, store);
                });
                afterAll(() => {
                    store.dispatch({ type: 'INIT' });
                });
                beforeEach(() => {
                    const element = getElementByDevName('Create_Record_Using_SObject');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it('store option should have sObjectVariable and firstRecord selected', () => {
                    const recordStoreElement = getRecordStoreOption(recordCreateElement);
                    const radioGroupElements = getRadioGroups(recordStoreElement);
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('sObjectVariable');
                    expect(radioGroupElements).toHaveLength(2);
                });
                it('displays selected "inputReference" (sObject)', () => {
                    const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordCreateElement);
                    expect(sObjectPicker.value).toBe(recordCreateElement.node.inputReference.value);
                });
                it('displays selected "inputReference" (sObject) pill', () => {
                    const sObjectOrSObjectCollectionPickerCombobox = getResourceCombobox(recordCreateElement);
                    expect(sObjectOrSObjectCollectionPickerCombobox.hasPill).toBe(true);
                    expect(sObjectOrSObjectCollectionPickerCombobox.pill).toEqual({
                        iconName: 'utility:sobject',
                        label: 'vAccount'
                    });
                });
                it('sObject Or SObject Collection Picker should contain "New Resource"', async () => {
                    const combobox = getResourceCombobox(recordCreateElement);
                    await removePill(combobox);
                    const groupedCombobox = getResourceGroupedCombobox(recordCreateElement);
                    await ticks(1);
                    expect(
                        getGroupedComboboxItemBy(groupedCombobox, 'text', 'FlowBuilderExpressionUtils.newResourceLabel')
                    ).toBeDefined();
                });
                describe('pills', () => {
                    it('displays empty combobox and no pill when pill is cleared', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        expect(combobox.hasPill).toBe(true);
                        await removePill(combobox);
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.value).toEqual('');
                    });
                    it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        expect(combobox.hasPill).toBe(true);
                        await clickPill(combobox);
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.value.displayText).toEqual('{!vAccount}');
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        await removePill(combobox);
                        await typeMergeFieldInCombobox(combobox, '{!vAccount}');
                        expect(combobox.hasPill).toBe(true);
                        expect(combobox.pill).toEqual({ iconName: 'utility:sobject', label: 'vAccount' });
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" literal value display no pill but error message (once pill has been cleared))', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        await removePill(combobox);
                        await typeLiteralValueInCombobox(combobox, 'literalitis');
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.errorMessage).toEqual('FlowBuilderCombobox.genericErrorMessage');
                    });
                    it('select and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        await removePill(combobox);
                        await selectComboboxItemBy(combobox, 'text', ['vAccount']);
                        expect(combobox.hasPill).toBe(true);
                        expect(combobox.pill).toEqual({ iconName: 'utility:sobject', label: 'vAccount' });
                    });
                });
            });
            describe('Working with sObject Collection', () => {
                beforeAll(() => {
                    translateFlowToUIAndDispatch(flowWithCreateRecordUsingSObjectCollection, store);
                });
                afterAll(() => {
                    store.dispatch({ type: 'INIT' });
                });
                beforeEach(() => {
                    const element = getElementByDevName('Create_Record_Using_SObject_Collection');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it('record store option should have "All records" selected and the second radio group element should be hidden', () => {
                    const recordStoreElement = getRecordStoreOption(recordCreateElement);
                    const radioGroupElements = getRadioGroups(recordStoreElement);
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('allRecords');
                    expect(radioGroupElements).toHaveLength(1);
                });
                it('"inputReference" value should be "vAccountCollection"', () => {
                    const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                        recordCreateElement
                    );
                    expect(sObjectOrSObjectCollectionPickerElement.value).toBe(
                        recordCreateElement.node.inputReference.value
                    );
                });
                it('displays selected "inputReference" (sObjectCollection) pill', () => {
                    const sObjectOrSObjectCollectionPickerCombobox = getResourceCombobox(recordCreateElement);
                    expect(sObjectOrSObjectCollectionPickerCombobox.hasPill).toBe(true);
                    expect(sObjectOrSObjectCollectionPickerCombobox.pill).toEqual({
                        iconName: 'utility:sobject',
                        label: 'vAccounts'
                    });
                });
                it('sObject Or SObject Collection Picker should contain "New Resource"', async () => {
                    const combobox = getResourceCombobox(recordCreateElement);
                    await removePill(combobox);
                    const groupedCombobox = getResourceGroupedCombobox(recordCreateElement);
                    expect(
                        getGroupedComboboxItemBy(groupedCombobox, 'text', 'FlowBuilderExpressionUtils.newResourceLabel')
                    ).toBeDefined();
                });
                describe('pills', () => {
                    it('displays empty combobox and no pill when pill is cleared', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        expect(combobox.hasPill).toBe(true);
                        await removePill(combobox);
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.value).toEqual('');
                    });
                    it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        expect(combobox.hasPill).toBe(true);
                        await clickPill(combobox);
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.value.displayText).toEqual('{!vAccounts}');
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        await removePill(combobox);
                        await typeMergeFieldInCombobox(combobox, '{!vAccounts}');
                        expect(combobox.hasPill).toBe(true);
                        expect(combobox.pill).toEqual({ iconName: 'utility:sobject', label: 'vAccounts' });
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" literal value display no pill but error message (once pill has been cleared))', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        await removePill(combobox);
                        await typeLiteralValueInCombobox(combobox, 'literalitis');
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.errorMessage).toEqual('FlowBuilderCombobox.genericErrorMessage');
                    });
                    it('select and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        await removePill(combobox);
                        await selectComboboxItemBy(combobox, 'text', ['vAccounts']);
                        expect(combobox.hasPill).toBe(true);
                        expect(combobox.pill).toEqual({ iconName: 'utility:sobject', label: 'vAccounts' });
                    });
                });
            });
            describe('Working with fields', () => {
                const selectEntity = async (apiName) => {
                    const entityResourcePicker = getEntityResourcePicker(recordCreateElement);
                    const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                    changeComboboxValue(comboboxElement, apiName);
                    await ticks(50);
                };
                const clickAddFieldButton = async () => {
                    const inputAssignments = getInputOutputAssignments(recordCreateElement);
                    const addFieldButton = deepQuerySelector(inputAssignments, [
                        INTERACTION_COMPONENTS_SELECTORS.LIST,
                        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON
                    ]);
                    addFieldButton.dispatchEvent(clickEvent());
                    await ticks(50);
                };
                beforeAll(() => {
                    translateFlowToUIAndDispatch(flowWithCreateRecordUsingFields, store);
                });
                afterAll(() => {
                    resetState();
                });
                beforeEach(async () => {
                    const element = getElementByDevName('Create_Record_using_Fields');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                    await ticks(50);
                });
                it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', async () => {
                    const recordStoreElement = getRecordStoreOption(recordCreateElement);
                    const radioGroupElements = getRadioGroups(recordStoreElement);
                    await ticks(1);
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                    expect(radioGroupElements).toHaveLength(2);
                });
                it('entity Resource picker should display the entity', () => {
                    const entityResourcePicker = getEntityResourcePicker(recordCreateElement);
                    expect(entityResourcePicker.value.value).toBe(recordCreateElement.node.object.value);
                });
                it('assigns Record Id To Reference should have a value', () => {
                    const outputResource = getOutputResourcePicker(recordCreateElement);
                    expect(outputResource.value.value).toBe(recordCreateElement.node.assignRecordIdToReference.value);
                });
                it('use advanced checkbox component should not be visible', () => {
                    const useAdvancedOptionCheckBox = getUseAdvancedOptionComponent(recordCreateElement);
                    expect(useAdvancedOptionCheckBox).toBeNull();
                });
                it('removing the entity should hide input assignment but store option element should remained', async () => {
                    const entityResourcePicker = getEntityResourcePicker(recordCreateElement);
                    const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                    changeComboboxValue(comboboxElement, '');
                    await ticks(1);
                    expect(recordCreateElement.node.object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                    expect(getInputOutputAssignments(recordCreateElement)).toBeNull();
                    const recordStoreElement = getRecordStoreOption(recordCreateElement);
                    const radioGroupElements = getRadioGroups(recordStoreElement);
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                    expect(radioGroupElements).toHaveLength(2);
                });
                it('enter an invalid value in the entity resource picker should not display other element but should display an error', async () => {
                    await selectEntity('invalidValue');
                    expect(getInputOutputAssignments(recordCreateElement)).toBeNull();
                    expect(getOutputResourcePicker(recordCreateElement)).toBeNull();
                    expect(recordCreateElement.node.object.error).toBe(FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('enter a valid value in the entity resource picker should not display an error', async () => {
                    await selectEntity('Case');
                    expect(recordCreateElement.node.object.error).toBeNull();
                    expect(getInputOutputAssignments(recordCreateElement)).not.toBeNull();
                    expect(getOutputResourcePicker(recordCreateElement)).not.toBeNull();
                });
                describe('Input Assignments', () => {
                    let inputAssignments;
                    beforeEach(() => {
                        inputAssignments = getInputOutputAssignments(recordCreateElement);
                    });
                    test('input Assignments should be visible and correctly displayed (with pill for RHS)', () => {
                        const fieldToFerovExpressionBuilders = getFieldToFerovExpressionBuilders(inputAssignments);
                        expect(fieldToFerovExpressionBuilders).toHaveLength(2);
                        let baseExpressionBuilder = getBaseExpressionBuilder(fieldToFerovExpressionBuilders[0]);
                        expect(baseExpressionBuilder.lhsValue).toMatchObject({
                            value: 'Account.BillingCity',
                            dataType: 'String',
                            displayText: 'BillingCity'
                        });
                        expect(baseExpressionBuilder.operatorValue).toBeUndefined();
                        expect(baseExpressionBuilder.rhsValue).toMatchObject({
                            category: 'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
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

                        let rhsCombobox = getBaseExpressionBuilderRhsCombobox(baseExpressionBuilder);
                        expect(rhsCombobox.hasPill).toBe(true);
                        expect(rhsCombobox.pill).toEqual({
                            iconName: 'utility:text',
                            label: 'vBillingCity'
                        });

                        baseExpressionBuilder = getBaseExpressionBuilder(fieldToFerovExpressionBuilders[1]);
                        expect(baseExpressionBuilder.lhsValue).toMatchObject({
                            dataType: 'String',
                            displayText: 'Name',
                            value: 'Account.Name'
                        });
                        expect(baseExpressionBuilder.operatorValue).toBeUndefined();
                        expect(baseExpressionBuilder.rhsValue).toMatchObject({
                            category: 'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
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
                        rhsCombobox = getBaseExpressionBuilderRhsCombobox(baseExpressionBuilder);
                        expect(rhsCombobox.hasPill).toBe(true);
                        expect(rhsCombobox.pill).toEqual({
                            iconName: 'utility:text',
                            label: 'vName'
                        });
                    });
                    it('Removing the selected field should not change the value if the RHS has a value', async () => {
                        let baseExpressionBuilder = getBaseExpressionBuilder(
                            getFieldToFerovExpressionBuilders(inputAssignments)[0]
                        );
                        const combobox = getExpressionBuilderComboboxElement(baseExpressionBuilder);
                        changeComboboxValue(combobox, '');
                        await ticks(1);
                        expect(getFieldToFerovExpressionBuilders(inputAssignments)).toHaveLength(2);
                        baseExpressionBuilder = getBaseExpressionBuilder(
                            getFieldToFerovExpressionBuilders(inputAssignments)[0]
                        );
                        expect(baseExpressionBuilder.lhsValue).toMatchObject({
                            dataType: 'String',
                            displayText: 'BillingCity',
                            value: 'Account.BillingCity'
                        });
                    });
                    it('Should only display creatable fields', async () => {
                        const baseExpressionBuilder = getBaseExpressionBuilder(
                            getFieldToFerovExpressionBuilders(inputAssignments)[0]
                        );
                        const combobox = getExpressionBuilderComboboxElement(baseExpressionBuilder);
                        // Type is creatable
                        expect(combobox.items).toEqual(
                            expect.arrayContaining([
                                expect.objectContaining({
                                    text: 'Type'
                                })
                            ])
                        );
                        // CreatedById is not creatable
                        expect(combobox.items).toEqual(
                            expect.not.arrayContaining([
                                expect.objectContaining({
                                    text: 'CreatedById'
                                })
                            ])
                        );
                    });
                    it('Should display no fields once all creatable fields have been selected', async () => {
                        await selectEntity('Feed Item');
                        inputAssignments = getInputOutputAssignments(recordCreateElement);
                        const feedItemFieldsArray: { creatable; apiName }[] = Object.values(feedItemFields);
                        const creatableFields = feedItemFieldsArray
                            .filter((field) => field.creatable)
                            .map((field) => field.apiName);
                        expect(creatableFields.length).toBeGreaterThan(15);
                        expect(creatableFields).toHaveLength(20);

                        // workaround for no-await-in-loop
                        let promise = Promise.resolve();
                        for (let i = 0; i < creatableFields.length; i++) {
                            // workaround for no-loop-func
                            const creatableFieldsLength = creatableFields.length;
                            const creatableField = creatableFields[i];
                            const inputOutputAssignments = inputAssignments;
                            promise = promise.then(async () => {
                                const fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(
                                    inputOutputAssignments
                                );
                                const lhsCombobox = await getLhsCombobox(fieldToFerovExpressionBuilder[i]);
                                expect(getComboboxItems(lhsCombobox)).toHaveLength(creatableFieldsLength - i);
                                return selectComboboxItemBy(lhsCombobox, 'displayText', [creatableField]).then(() =>
                                    clickAddFieldButton()
                                );
                            });
                        }
                        await promise;
                        const fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(inputAssignments);
                        const lhsCombobox = await getLhsCombobox(fieldToFerovExpressionBuilder[creatableFields.length]);
                        expect(getComboboxItems(lhsCombobox)).toHaveLength(0);
                    });
                });
            });
        });
    });
    describe('Working with screen flow', () => {
        beforeAll(async () => {
            store = await setupStateForFlow(flowWithAllElements);
            translateFlowToUIAndDispatch(flowWithAllElements, store);
        });
        afterAll(() => {
            resetState();
        });
        describe('Working with automatic output handling', () => {
            beforeAll(() => {
                const element = getElementByDevName('createAccountWithAutomaticOutput');
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
            });
            it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', () => {
                const recordStoreElement = getRecordStoreOption(recordCreateElement);
                const radioGroupElements = getRadioGroups(recordStoreElement);
                expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                expect(radioGroupElements).toHaveLength(2);
            });
            it('assigns Record Id To Reference should not be displayed', () => {
                const outputResource = getOutputResourcePicker(recordCreateElement);
                expect(outputResource).toBeNull();
            });
            it('"useAdvancedOptionsCheckbox" should be visible', () => {
                const useAdvancedOptionCheckBox = getUseAdvancedOptionComponent(recordCreateElement);
                expect(useAdvancedOptionCheckBox).not.toBeNull();
            });
            it('"useAdvancedOptionsCheckbox" should be unchecked', () => {
                const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordCreateElement);
                expect(advancedOptionCheckbox).toBeDefined();
                expect(advancedOptionCheckbox.type).toBe('checkbox');
                expect(advancedOptionCheckbox.checked).toBe(false);
            });
        });
        describe('sObject Or SObject Collection Picker', () => {
            const expectCanBeTraversedInResourcePicker = async (textValues) => {
                await expectCanBeTraversed(sObjectOrSObjectCollectionPicker, 'text', textValues);
            };
            describe('create from single value', () => {
                beforeEach(() => {
                    const element = getElementByDevName('createFromAnAccount');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it('should contain single sobject elements, and no traversal', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCannotBeTraversedInResourcePicker(['accountSObjectVariable']);
                    await expectCannotBeSelectedInResourcePicker(['accountSObjectCollectionVariable']);
                });
                it('should contain elements that contains sobject and shows only single sobject fields up. Sobject fields should not be traversable', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeVariable']);
                    await expectCannotBeTraversedInResourcePicker(['apexComplexTypeVariable', 'acct']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'acctListField']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'name']);
                });
                it('should contain elements that contains apex that contains sobject and shows only single sobject fields up. Sobject fields should not be traversable', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable']);
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable', 'testOne']);
                    await expectCannotBeTraversedInResourcePicker(['apexComplexTypeTwoVariable', 'testOne', 'acct']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeTwoVariable', 'listOfTestOne']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeTwoVariable', 'str']);
                });
                it('should not contain elements that are not sobject or contain no sobject', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCannotBeSelectedInResourcePicker(['apexCarVariable']);
                });
                it('should not contain elements that contains only a collection of sobject', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCannotBeSelectedInResourcePicker(['apexContainsOnlyAnSObjectCollectionVariable']);
                });
                it('should throw validation error if selecting a non SObject from the combobox', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    changeComboboxValue(sObjectOrSObjectCollectionPicker, '{!apexComplexTypeVariable}');

                    expect(getResourceCombobox(recordCreateElement).errorMessage).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.MERGE_FIELD_INVALID_DATA_TYPE
                    );
                });
                it('should throw validation error if manually entering an SObject collection', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    changeComboboxValue(sObjectOrSObjectCollectionPicker, '{!accountSObjectCollectionVariable}');

                    expect(getResourceCombobox(recordCreateElement).errorMessage).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                    );
                });
                describe('pills', () => {
                    it('displays selected "inputReference" (sObject) pill', () => {
                        const sObjectOrSObjectCollectionPickerCombobox = getResourceCombobox(recordCreateElement);
                        expect(sObjectOrSObjectCollectionPickerCombobox.hasPill).toBe(true);
                        expect(sObjectOrSObjectCollectionPickerCombobox.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountSObjectVariable'
                        });
                    });
                    it('displays empty combobox and no pill when pill is cleared', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        expect(combobox.hasPill).toBe(true);
                        await removePill(combobox);
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.value).toEqual('');
                    });
                    it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        expect(combobox.hasPill).toBe(true);
                        await clickPill(combobox);
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.value.displayText).toEqual('{!accountSObjectVariable}');
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
                                    const combobox = await getResourceCombobox(recordCreateElement);
                                    await removePill(combobox);
                                    await typeMergeFieldInCombobox(combobox, resourcePickerMergefieldValue);
                                    expect(combobox.hasPill).toBe(false);
                                    expect(combobox.errorMessage).toEqual(errorMessage);
                                }
                            );
                        });
                        describe('NO errors', () => {
                            it.each`
                                resourcePickerMergefieldValue                | expectedPill
                                ${'{!accountSObjectVariable}'}               | ${{ iconName: 'utility:sobject', label: 'accountSObjectVariable' }}
                                ${'{!apexComplexTypeVariable.acct}'}         | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                                ${'{!subflowAutomaticOutput.accountOutput}'} | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                                ${'{!lookupRecordAutomaticOutput}'}          | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                                ${'{!apexCall_anonymous_account}'}           | ${{ iconName: 'utility:sobject', label: 'Account from apexCall_anonymous_account' }}
                                ${'{!loopOnAccountAutoOutput}'}              | ${{ iconName: 'utility:sobject', label: 'Current Item from Loop loopOnAccountAutoOutput' }}
                            `(
                                'When typing "$resourcePickerMergefieldValue" pill should be: $expectedPill',
                                async ({ resourcePickerMergefieldValue, expectedPill }) => {
                                    const combobox = await getResourceCombobox(recordCreateElement);
                                    await removePill(combobox);

                                    await typeMergeFieldInCombobox(combobox, resourcePickerMergefieldValue);
                                    expect(combobox.hasPill).toBe(true);
                                    expect(combobox.pill).toEqual(expectedPill);
                                }
                            );
                        });
                    });
                    describe('selecting', () => {
                        it.each`
                            resourcePickerValue                                    | expectedPill
                            ${'accountSObjectVariable'}                            | ${{ iconName: 'utility:sobject', label: 'accountSObjectVariable' }}
                            ${'apexComplexTypeVariable.acct'}                      | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                            ${'Outputs from subflowAutomaticOutput.accountOutput'} | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                            ${'Account from lookupRecordAutomaticOutput'}          | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                            ${'Account from apexCall_anonymous_account'}           | ${{ iconName: 'utility:sobject', label: 'Account from apexCall_anonymous_account' }}
                            ${'Current Item from Loop loopOnAccountAutoOutput'}    | ${{ iconName: 'utility:sobject', label: 'Current Item from Loop loopOnAccountAutoOutput' }}
                        `(
                            'When selecting "$resourcePickerValue" pill should be: $expectedPill',
                            async ({ resourcePickerValue, expectedPill }) => {
                                const combobox = await getResourceCombobox(recordCreateElement);
                                await removePill(combobox);

                                await selectComboboxItemBy(combobox, 'text', resourcePickerValue.split('.'));
                                expect(combobox.hasPill).toBe(true);
                                expect(combobox.pill).toEqual(expectedPill);
                            }
                        );
                    });
                });
            });
            describe('create from collection', () => {
                beforeEach(() => {
                    const element = getElementByDevName('createFromMultipleAccounts');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it('should contain sobject collection elements, and no traversal', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCannotBeTraversedInResourcePicker(['accountSObjectCollectionVariable']);
                    await expectCannotBeSelectedInResourcePicker(['accountSObjectVariable']);
                });
                it('should contain elements that contains sobject and shows only sobject collection fields up.', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeVariable']);
                    await expectCannotBeTraversedInResourcePicker(['apexComplexTypeVariable', 'acctListField']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'acct']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'name']);
                });
                it('should not contain elements that are not sobject or contain no sobject', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCannotBeSelectedInResourcePicker(['apexCarVariable']);
                });
                it('should not contain elements that contains only a single sobject', async () => {
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    await expectCannotBeSelectedInResourcePicker(['apexContainsOnlyASingleSObjectVariable']);
                });
                describe('pills', () => {
                    it('displays selected "inputReference" (sObjectCollection) pill', () => {
                        const sObjectOrSObjectCollectionPickerCombobox = getResourceCombobox(recordCreateElement);
                        expect(sObjectOrSObjectCollectionPickerCombobox.hasPill).toBe(true);
                        expect(sObjectOrSObjectCollectionPickerCombobox.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountSObjectCollectionVariable'
                        });
                    });
                    it('displays empty combobox and no pill when pill is cleared', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        expect(combobox.hasPill).toBe(true);
                        await removePill(combobox);
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.value).toEqual('');
                    });
                    it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                        const combobox = await getResourceCombobox(recordCreateElement);
                        expect(combobox.hasPill).toBe(true);
                        await clickPill(combobox);
                        expect(combobox.hasPill).toBe(false);
                        expect(combobox.value.displayText).toEqual('{!accountSObjectCollectionVariable}');
                    });
                    describe('typing', () => {
                        describe('errors', () => {
                            it.each`
                                resourcePickerMergefieldValue             | errorMessage
                                ${'{!accountSObjectCollectionVariable2}'} | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                                ${'{!accountSObjectCollectionVariable'}   | ${'FlowBuilderCombobox.genericErrorMessage'}
                                ${'{!accountSObjectCollectionVariable.}'} | ${'FlowBuilderCombobox.genericErrorMessage'}
                                ${'literalitis'}                          | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                            `(
                                'When typing "$resourcePickerMergefieldValue" error message should be: $errorMessage',
                                async ({ resourcePickerMergefieldValue, errorMessage }) => {
                                    const combobox = await getResourceCombobox(recordCreateElement);
                                    await removePill(combobox);
                                    await typeMergeFieldInCombobox(combobox, resourcePickerMergefieldValue);
                                    expect(combobox.hasPill).toBe(false);
                                    expect(combobox.errorMessage).toEqual(errorMessage);
                                }
                            );
                        });
                        describe('NO errors', () => {
                            it.each`
                                resourcePickerMergefieldValue                 | expectedPill
                                ${'{!accountSObjectCollectionVariable}'}      | ${{ iconName: 'utility:sobject', label: 'accountSObjectCollectionVariable' }}
                                ${'{!apexComplexTypeVariable.acctListField}'} | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acctListField' }}
                                ${'{!lookupRecordCollectionAutomaticOutput}'} | ${{ iconName: 'utility:sobject', label: 'Accounts from lookupRecordCollectionAutomaticOutput' }}
                                ${'{!apexCall_anonymous_accounts}'}           | ${{ iconName: 'utility:sobject', label: 'Accounts from apexCall_anonymous_accounts' }}
                            `(
                                'When typing "$resourcePickerMergefieldValue" pill should be: $expectedPill',
                                async ({ resourcePickerMergefieldValue, expectedPill }) => {
                                    const combobox = await getResourceCombobox(recordCreateElement);
                                    await removePill(combobox);
                                    await typeMergeFieldInCombobox(combobox, resourcePickerMergefieldValue);
                                    expect(combobox.hasPill).toBe(true);
                                    expect(combobox.pill).toEqual(expectedPill);
                                }
                            );
                        });
                    });
                    describe('selecting', () => {
                        it.each`
                            resourcePickerValue                                      | expectedPill
                            ${'accountSObjectCollectionVariable'}                    | ${{ iconName: 'utility:sobject', label: 'accountSObjectCollectionVariable' }}
                            ${'apexComplexTypeVariable.acctListField'}               | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acctListField' }}
                            ${'Accounts from lookupRecordCollectionAutomaticOutput'} | ${{ iconName: 'utility:sobject', label: 'Accounts from lookupRecordCollectionAutomaticOutput' }}
                            ${'Accounts from apexCall_anonymous_accounts'}           | ${{ iconName: 'utility:sobject', label: 'Accounts from apexCall_anonymous_accounts' }}
                        `(
                            'When selecting "$resourcePickerValue" pill should be: $expectedPill',
                            async ({ resourcePickerValue, expectedPill }) => {
                                const combobox = await getResourceCombobox(recordCreateElement);
                                await removePill(combobox);

                                await selectComboboxItemBy(combobox, 'text', resourcePickerValue.split('.'));
                                expect(combobox.hasPill).toBe(true);
                                expect(combobox.pill).toEqual(expectedPill);
                            }
                        );
                    });
                });
            });
        });
        describe('Record store option', () => {
            it('sets record option number to allRecords when using several level of traversal', () => {
                const element = getElementByDevName('create_multiple_from_apex_two_level_traversal');
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
                const recordStoreElement = getRecordStoreOption(recordCreateElement);
                expect(recordStoreElement.numberOfRecordsToStore).toBe('allRecords');
            });
        });
        describe('Working with manual output handling', () => {
            beforeEach(() => {
                const element = getElementByDevName('createAccountWithAdvancedOptions');
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
            });
            it('displays "outputResourcePicker" in pill mode', () => {
                const outputResourcePickerCombobox = getOutputBaseResourcePickerCombobox(recordCreateElement);
                expect(outputResourcePickerCombobox.hasPill).toBe(true);
                expect(outputResourcePickerCombobox.pill).toEqual({
                    iconName: 'utility:text',
                    label: 'vAccountIdFromCreate'
                });
            });
            it('can select string field from apex class to store id', async () => {
                // When
                const outputResourcePickerCombobox = getOutputBaseResourcePickerCombobox(recordCreateElement);
                await removePill(outputResourcePickerCombobox);
                const selectedItem = await selectComboboxItemBy(outputResourcePickerCombobox, 'text', [
                    'apexComplexTypeVariable',
                    'name'
                ]);

                // Then
                const expectedGuid = getElementByDevName('apexComplexTypeVariable')!.guid;
                expect(selectedItem).toMatchObject({
                    displayText: '{!apexComplexTypeVariable.name}',
                    value: `${expectedGuid}.name`
                });

                expect(outputResourcePickerCombobox.errorMessage).toBeNull();
                expect(recordCreateElement.node.assignRecordIdToReference.value).toBe(`${expectedGuid}.name`);
            });
            it('cannot select account field from apex class to store id', async () => {
                // When
                const outputResourcePickerCombobox = getOutputBaseResourcePickerCombobox(recordCreateElement);
                await removePill(outputResourcePickerCombobox);
                const selectedItem = await selectComboboxItemBy(
                    outputResourcePickerCombobox,
                    'text',
                    ['apexComplexTypeVariable', 'acct'],
                    { blur: true }
                );

                // Then
                expect(selectedItem).toBeUndefined();
            });
            it.each`
                outputResourcePickerDisplayText               | expectedErrorMessage
                ${'{!apexComplexTypeVariable.name}'}          | ${null}
                ${'{!apexComplexTypeVariable.acct}'}          | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                ${'{!apexComplexTypeVariable.acct.}'}         | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                ${'{!apexComplexTypeVariable.doesNotExist}'}  | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
                ${'{!apexComplexTypeVariable.doesNotExist.}'} | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
            `(
                'When typing "$outputResourcePickerDisplayText" error should be: $expectedErrorMessage',
                async ({ outputResourcePickerDisplayText, expectedErrorMessage }) => {
                    const outputResourcePickerCombobox = getOutputBaseResourcePickerCombobox(recordCreateElement);
                    await removePill(outputResourcePickerCombobox);

                    await typeReferenceOrValueInCombobox(outputResourcePickerCombobox, outputResourcePickerDisplayText);
                    expect(outputResourcePickerCombobox.hasPill).toBe(!expectedErrorMessage);
                    expect(outputResourcePickerCombobox.errorMessage).toEqual(expectedErrorMessage);
                }
            );
            describe('pills', () => {
                describe('typing', () => {
                    describe('errors', () => {
                        it.each`
                            resourcePickerMergefieldValue                | errorMessage
                            ${'{!accountSObjectVariable}'}               | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                            ${'{!accountSObjectVariable2}'}              | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                            ${'{!accountSObjectVariable'}                | ${'FlowBuilderCombobox.genericErrorMessage'}
                            ${'{!accountSObjectVariable.}'}              | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                            ${'{!apexComplexTypeVariable.acct}'}         | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                            ${'{!apexComplexTypeVariable.doesNotExist}'} | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
                            ${'literalitis'}                             | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                        `(
                            'When typing "$resourcePickerMergefieldValue" error message should be: $errorMessage',
                            async ({ resourcePickerMergefieldValue, errorMessage }) => {
                                const outputResourcePickerCombobox = getOutputBaseResourcePickerCombobox(
                                    recordCreateElement
                                );
                                await removePill(outputResourcePickerCombobox);
                                await typeMergeFieldInCombobox(
                                    outputResourcePickerCombobox,
                                    resourcePickerMergefieldValue
                                );
                                expect(outputResourcePickerCombobox.hasPill).toBe(false);
                                expect(outputResourcePickerCombobox.errorMessage).toEqual(errorMessage);
                            }
                        );
                    });
                    describe('NO errors', () => {
                        it.each`
                            outputResourcePickerMergefieldValue             | expectedPill
                            ${'{!stringVariable}'}                          | ${{ iconName: 'utility:text', label: 'stringVariable' }}
                            ${'{!accountSObjectVariable.name}'}             | ${{ iconName: 'utility:text', label: 'accountSObjectVariable > Account Name' }}
                            ${'{!apexComplexTypeVariable.name}'}            | ${{ iconName: 'utility:text', label: 'apexComplexTypeVariable > name' }}
                            ${'{!subflowAutomaticOutput.output1}'}          | ${{ iconName: 'utility:text', label: 'Outputs from subflowAutomaticOutput > output1' }}
                            ${'{!lookupRecordAutomaticOutput.BillingCity}'} | ${{ iconName: 'utility:text', label: 'Account from lookupRecordAutomaticOutput > Billing City' }}
                            ${'{!Address.addressLabel}'}                    | ${{ iconName: 'utility:text', label: 'Address > Label' }}
                            ${'{!loopOnAccountAutoOutput.Name}'}            | ${{ iconName: 'utility:text', label: 'Current Item from Loop loopOnAccountAutoOutput > Account Name' }}
                        `(
                            'When typing "$outputResourcePickerMergefieldValue" pill should be: $expectedPill',
                            async ({ outputResourcePickerMergefieldValue, expectedPill }) => {
                                const outputResourcePickerCombobox = getOutputBaseResourcePickerCombobox(
                                    recordCreateElement
                                );
                                await removePill(outputResourcePickerCombobox);

                                await typeMergeFieldInCombobox(
                                    outputResourcePickerCombobox,
                                    outputResourcePickerMergefieldValue
                                );
                                expect(outputResourcePickerCombobox.hasPill).toBe(true);
                                expect(outputResourcePickerCombobox.pill).toEqual(expectedPill);
                            }
                        );
                    });
                });
                describe('selecting', () => {
                    it.each`
                        outputResourcePickerValue                                  | expectedPill
                        ${'stringVariable'}                                        | ${{ iconName: 'utility:text', label: 'stringVariable' }}
                        ${'accountSObjectVariable.Name'}                           | ${{ iconName: 'utility:text', label: 'accountSObjectVariable > Account Name' }}
                        ${'apexComplexTypeVariable.name'}                          | ${{ iconName: 'utility:text', label: 'apexComplexTypeVariable > name' }}
                        ${'Outputs from subflowAutomaticOutput.output1'}           | ${{ iconName: 'utility:text', label: 'Outputs from subflowAutomaticOutput > output1' }}
                        ${'Account from lookupRecordAutomaticOutput.BillingCity'}  | ${{ iconName: 'utility:text', label: 'Account from lookupRecordAutomaticOutput > Billing City' }}
                        ${'Address.addressLabel'}                                  | ${{ iconName: 'utility:text', label: 'Address > Label' }}
                        ${'Current Item from Loop loopOnTextCollectionAutoOutput'} | ${{ iconName: 'utility:text', label: 'Current Item from Loop loopOnTextCollectionAutoOutput' }}
                    `(
                        'When selecting "$outputResourcePickerValue" pill should be: $expectedPill',
                        async ({ outputResourcePickerValue, expectedPill }) => {
                            const outputResourcePickerCombobox = getOutputBaseResourcePickerCombobox(
                                recordCreateElement
                            );
                            await removePill(outputResourcePickerCombobox);

                            await selectComboboxItemBy(
                                outputResourcePickerCombobox,
                                'text',
                                outputResourcePickerValue.split('.')
                            );
                            expect(outputResourcePickerCombobox.hasPill).toBe(true);
                            expect(outputResourcePickerCombobox.pill).toEqual(expectedPill);
                        }
                    );
                });
            });
        });
        // W-7656897
        describe('flow which does not support automatic output', () => {
            beforeAll(async () => {
                translateFlowToUIAndDispatch(fieldServiceMobileFlow, store);
            });
            afterAll(() => {
                resetState();
            });
            describe('sObject Or SObject Collection Picker', () => {
                beforeAll(() => {
                    const element = getElementByDevName('create_account_from_variable');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it('is updated when switching to multiple', async () => {
                    // When
                    changeLightningRadioGroupValue(
                        getRadioGroups(getRecordStoreOption(recordCreateElement))[0],
                        'allRecords'
                    );
                    sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                    // Then
                    await expectCannotBeTraversedInResourcePicker(['vAccounts']);
                    await expectCannotBeSelectedInResourcePicker(['vMyTestAccount']);
                });
            });
        });
    });
    describe('Working with flow with record triggered flow', () => {
        beforeAll(async () => {
            await setupStateForFlow(recordTriggeredFlow);
        });
        afterAll(() => {
            resetState();
        });
        describe('Working with flow with $Record prior value', () => {
            describe('Manual output handling', () => {
                beforeEach(() => {
                    const element = getElementByDevName('create_account_manual_output');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it.each`
                    outputResourcePickerDisplayText     | expectedErrorMessage
                    ${'{!accountSObjectVariable.Name}'} | ${null}
                    ${'{!stringVariable}'}              | ${null}
                    ${'{!$Record.Name}'}                | ${null}
                    ${'{!$Record__Prior}'}              | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                    ${'{!$Record__Prior.Name}'}         | ${'FlowBuilderCombobox.genericErrorMessage'}
                `(
                    'When typing "$outputResourcePickerDisplayText" error should be: $expectedErrorMessage',
                    async ({ outputResourcePickerDisplayText, expectedErrorMessage }) => {
                        const outputResourcePickerCombobox = getOutputBaseResourcePickerCombobox(recordCreateElement);
                        await removePill(outputResourcePickerCombobox);

                        await typeReferenceOrValueInCombobox(
                            outputResourcePickerCombobox,
                            outputResourcePickerDisplayText
                        );
                        expect(outputResourcePickerCombobox.errorMessage).toEqual(expectedErrorMessage);
                    }
                );
            });
        });
        describe('Sobject resource picker', () => {
            beforeEach(() => {
                const element = getElementByDevName('create_account_from_an_account');
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
            });
            it('should contain single sobject elements, and no traversal', async () => {
                sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                await expectCannotBeTraversedInResourcePicker(['accountSObjectVariable']);
            });
            it('should contain $Record, and no traversal', async () => {
                sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                await expectCannotBeTraversedInResourcePicker(['$Record']);
                await expectCannotBeSelectedInResourcePicker(['$Record__Prior']);
            });
            it('should not contain $Record Prior, and no traversal', async () => {
                sObjectOrSObjectCollectionPicker = await removePillAndGetGroupedCombobox(recordCreateElement);
                await expectCannotBeSelectedInResourcePicker(['$Record__Prior']);
            });
        });
    });
});
