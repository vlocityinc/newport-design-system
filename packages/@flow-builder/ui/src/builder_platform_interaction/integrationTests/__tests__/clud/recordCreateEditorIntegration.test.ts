import { createElement } from 'lwc';
import RecordCreateEditor from 'builder_platform_interaction/recordCreateEditor';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    setupStateForProcessType,
    resetState,
    translateFlowToUIAndDispatch,
    setupStateForFlow
} from '../integrationTestUtils';
import { getElementForPropertyEditor, getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import * as autoLaunchedFlowScheduled from 'mock/flows/autoLaunchedFlowScheduled.json';
import { ELEMENT_TYPE, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ticks, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { expectCanBeTraversed, expectCannotBeTraversed, expectCannotBeSelected } from '../groupedComboboxTestUtils';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { addRecordVariable, deleteVariableWithName } from '../resourceTestUtils';
import { RecordCreateEditorComponentTest } from '../recordCreateEditorTestUtils';
import { RecordInputOutputAssignmentsComponentTest } from '../recordInputOutputAssignmentsTestUtils';

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'Flow';

const createComponentForTest = (node: {}, processType = MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE) => {
    const el = createElement('builder_platform_interaction-record-create-editor', { is: RecordCreateEditor });
    Object.assign(el, { node, processType });
    setDocumentBodyChildren(el);
    return new RecordCreateEditorComponentTest(el);
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
    let recordCreateElement: RecordCreateEditorComponentTest;
    let store;
    const expectCannotBeTraversedInResourcePicker = async (textValues) => {
        const sObjectOrSObjectCollectionPicker = recordCreateElement.getSObjectOrSObjectCollectionPicker()!;
        await expectCannotBeTraversed(
            sObjectOrSObjectCollectionPicker.getCombobox().getGroupedCombobox(),
            'text',
            textValues
        );
    };
    const expectCannotBeSelectedInResourcePicker = async (textValues) => {
        const sObjectOrSObjectCollectionPicker = recordCreateElement.getSObjectOrSObjectCollectionPicker()!;
        await expectCannotBeSelected(
            sObjectOrSObjectCollectionPicker.getCombobox().getGroupedCombobox(),
            'text',
            textValues
        );
    };
    describe('Working in auto launched flow', () => {
        beforeAll(async () => {
            store = await setupStateForProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
            translateFlowToUIAndDispatch(autoLaunchedFlowScheduled, store);
        });
        afterAll(() => {
            resetState();
        });
        describe('name and dev name', () => {
            const getRecordCreateElementNode = () => recordCreateElement.element.node as any;
            beforeEach(() => {
                const element = getElementByDevName('Create_Record_Using_SObject');
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
            });
            it('do not change devName if it already exists after the user modifies the name', async () => {
                const newLabel = 'new label';
                await recordCreateElement.getLabelDescription().setLabel(newLabel);
                expect(getRecordCreateElementNode().label.value).toBe(newLabel);
                expect(getRecordCreateElementNode().name.value).toBe('Create_Record_Using_SObject');
            });
            it('modify the dev name', async () => {
                const newDevName = 'newName';
                await recordCreateElement.getLabelDescription().setName(newDevName);
                expect(getRecordCreateElementNode().name.value).toBe(newDevName);
            });
            it('displays error if name is cleared', async () => {
                const newLabel = '';
                await recordCreateElement.getLabelDescription().setLabel(newLabel);
                expect(getRecordCreateElementNode().label.error).toBe(
                    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
            it('displays error if devName is cleared', async () => {
                const newDevName = '';
                await recordCreateElement.getLabelDescription().setName(newDevName);
                expect(getRecordCreateElementNode().name.error).toBe(
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
                const sObjectOrSObjectCollectionPickerElement = recordCreateElement.getSObjectOrSObjectCollectionPicker();
                expect(sObjectOrSObjectCollectionPickerElement!.element.value).toBe('');
            });
            it('should not display a pill for the "sobjectOrSobjectCollectionPicker"', () => {
                const sObjectOrSObjectCollectionPickerCombobox = recordCreateElement.getSObjectOrSObjectCollectionPicker();
                expect(sObjectOrSObjectCollectionPickerCombobox!.getCombobox().element.hasPill).toBe(false);
            });
            // W-7118031
            it('does NOT display "A value is required." error message for "sobjectOrSobjectCollectionPicker" ("record selection")', () => {
                const sObjectOrSObjectCollectionPickerElement = recordCreateElement.getSObjectOrSObjectCollectionPicker();
                expect(sObjectOrSObjectCollectionPickerElement!.element.errorMessage).toBeNull();
            });
            it('record Store Option should have firstRecord and sObjectVariable selected', () => {
                const recordStoreElement = recordCreateElement.getRecordStoreOptionElement();
                const radioGroupElements = recordCreateElement.getRecordStoreOptionRadioGroupElements();
                expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                expect(recordStoreElement.wayToStoreFields).toBe('sObjectVariable');
                expect(radioGroupElements).toHaveLength(2);
            });
            it('typing and blur with "sobjectOrSobjectCollectionPicker" literal value display error message and no pill)', async () => {
                const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                await combobox.typeLiteralValue('iamaliteral');
                expect(combobox.element.hasPill).toBe(false);
                expect(combobox.element.errorMessage).toEqual('FlowBuilderCombobox.genericErrorMessage');
            });
            it('typing and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill)', async () => {
                const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                await combobox.typeMergeField('{!accountVariable}');
                expect(combobox.element.hasPill).toBe(true);
                expect(combobox.element.pill).toEqual({ iconName: 'utility:sobject', label: 'accountVariable' });
            });
        });
        describe('Existing element', () => {
            describe('Working with sObject', () => {
                beforeEach(() => {
                    const element = getElementByDevName('Create_Record_Using_SObject');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it('store option should have sObjectVariable and firstRecord selected', () => {
                    const recordStoreElement = recordCreateElement.getRecordStoreOptionElement();
                    const radioGroupElements = recordCreateElement.getRecordStoreOptionRadioGroupElements();
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('sObjectVariable');
                    expect(radioGroupElements).toHaveLength(2);
                });
                it('displays selected "inputReference" (sObject)', () => {
                    const sObjectPicker = recordCreateElement.getSObjectOrSObjectCollectionPicker()!;
                    expect(sObjectPicker.element.value).toBe(
                        (recordCreateElement.element.node as any).inputReference.value
                    );
                });
                it('displays selected "inputReference" (sObject) pill', () => {
                    const sObjectOrSObjectCollectionPickerCombobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                    expect(sObjectOrSObjectCollectionPickerCombobox.element.hasPill).toBe(true);
                    expect(sObjectOrSObjectCollectionPickerCombobox.element.pill).toEqual({
                        iconName: 'utility:sobject',
                        label: 'accountVariable'
                    });
                });
                it('sObject Or SObject Collection Picker should contain "New Resource"', async () => {
                    const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                    await combobox.removePill();
                    expect(
                        combobox.getGroupedCombobox().getItemBy('text', 'FlowBuilderExpressionUtils.newResourceLabel')
                    ).toBeDefined();
                });
                describe('pills', () => {
                    it('displays empty combobox and no pill when pill is cleared', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(combobox.element.hasPill).toBe(true);
                        await combobox.removePill();
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.value).toEqual('');
                    });
                    it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(combobox.element.hasPill).toBe(true);
                        await combobox.clickPill();
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.value.displayText).toEqual('{!accountVariable}');
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        await combobox.removePill();
                        await combobox.typeMergeField('{!accountVariable}');
                        expect(combobox.element.hasPill).toBe(true);
                        expect(combobox.element.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountVariable'
                        });
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" literal value display no pill but error message (once pill has been cleared))', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        await combobox.removePill();
                        await combobox.typeLiteralValue('literalitis');
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.errorMessage).toEqual('FlowBuilderCombobox.genericErrorMessage');
                    });
                    it('select and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        await combobox.removePill();
                        await combobox.selectItemBy('text', ['accountVariable']);
                        expect(combobox.element.hasPill).toBe(true);
                        expect(combobox.element.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountVariable'
                        });
                    });
                });
            });
            describe('Working with sObject Collection', () => {
                beforeEach(() => {
                    const element = getElementByDevName('Create_Record_Using_SObject_Collection');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it('record store option should have "All records" selected and the second radio group element should be hidden', () => {
                    const recordStoreElement = recordCreateElement.getRecordStoreOptionElement();
                    const radioGroupElements = recordCreateElement.getRecordStoreOptionRadioGroupElements();
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('allRecords');
                    expect(radioGroupElements).toHaveLength(1);
                });
                it('"inputReference" value should be "vAccountCollection"', () => {
                    const sObjectOrSObjectCollectionPickerElement = recordCreateElement.getSObjectOrSObjectCollectionPicker()!;
                    expect(sObjectOrSObjectCollectionPickerElement.element.value).toBe(
                        (recordCreateElement.element.node as any).inputReference.value
                    );
                });
                it('displays selected "inputReference" (sObjectCollection) pill', () => {
                    const sObjectOrSObjectCollectionPickerCombobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                    expect(sObjectOrSObjectCollectionPickerCombobox.element.hasPill).toBe(true);
                    expect(sObjectOrSObjectCollectionPickerCombobox.element.pill).toEqual({
                        iconName: 'utility:sobject',
                        label: 'accounts'
                    });
                });
                it('sObject Or SObject Collection Picker should contain "New Resource"', async () => {
                    const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                    await combobox.removePill();
                    expect(
                        combobox.getGroupedCombobox().getItemBy('text', 'FlowBuilderExpressionUtils.newResourceLabel')
                    ).toBeDefined();
                });
                describe('pills', () => {
                    it('displays empty combobox and no pill when pill is cleared', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(combobox.element.hasPill).toBe(true);
                        await combobox.removePill();
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.value).toEqual('');
                    });
                    it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(combobox.element.hasPill).toBe(true);
                        await combobox.clickPill();
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.value.displayText).toEqual('{!accounts}');
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        await combobox.removePill();
                        await combobox.typeMergeField('{!accounts}');
                        expect(combobox.element.hasPill).toBe(true);
                        expect(combobox.element.pill).toEqual({ iconName: 'utility:sobject', label: 'accounts' });
                    });
                    it('typing and blur with "sobjectOrSobjectCollectionPicker" literal value display no pill but error message (once pill has been cleared))', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        await combobox.removePill();
                        await combobox.typeLiteralValue('literalitis');
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.errorMessage).toEqual('FlowBuilderCombobox.genericErrorMessage');
                    });
                    it('select and blur with "sobjectOrSobjectCollectionPicker" sobject variable display pill (once pill has been cleared))', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        await combobox.removePill();
                        await combobox.selectItemBy('text', ['accounts']);
                        expect(combobox.element.hasPill).toBe(true);
                        expect(combobox.element.pill).toEqual({ iconName: 'utility:sobject', label: 'accounts' });
                    });
                });
            });
            describe('Working with fields', () => {
                beforeEach(async () => {
                    const element = getElementByDevName('Create_Record_using_Fields');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                    // needed (to be set at 4) otherwise "Should only display creatable fields" fails (nothing shows up in the fields)
                    await ticks(4);
                });
                it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', () => {
                    const recordStoreElement = recordCreateElement.getRecordStoreOptionElement();
                    const radioGroupElements = recordCreateElement.getRecordStoreOptionRadioGroupElements();
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                    expect(radioGroupElements).toHaveLength(2);
                });
                it('entity Resource picker should display the entity', () => {
                    const entityResourcePicker = recordCreateElement.getEntityResourcePicker()!;
                    expect(entityResourcePicker.element.value.value).toBe(
                        (recordCreateElement.element.node as any).object.value
                    );
                });
                it('assigns Record Id To Reference should have a value', () => {
                    const outputResource = recordCreateElement.getOutputResourcePicker()!;
                    expect(outputResource.element.value.value).toBe(
                        (recordCreateElement.element.node as any).assignRecordIdToReference.value
                    );
                });
                it('manually assign variables checkbox component should not be visible', () => {
                    const checkbox = recordCreateElement.getManuallyAssignVariablesCheckboxElement();
                    expect(checkbox).toBeNull();
                });
                it('removing the entity should hide input assignment but store option element should remained', async () => {
                    const entityResourcePicker = recordCreateElement.getEntityResourcePicker()!;
                    const comboboxElement = entityResourcePicker.getCombobox();
                    await comboboxElement.typeLiteralValue('');
                    expect((recordCreateElement.element.node as any).object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                    expect(recordCreateElement.getFieldsAssignments()).toBeNull();
                    const recordStoreElement = recordCreateElement.getRecordStoreOptionElement();
                    const radioGroupElements = recordCreateElement.getRecordStoreOptionRadioGroupElements();
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                    expect(radioGroupElements).toHaveLength(2);
                });
                it('enter an invalid value in the entity resource picker should not display other element but should display an error', async () => {
                    await recordCreateElement.selectEntity('invalidValue');
                    expect(recordCreateElement.getFieldsAssignments()).toBeNull();
                    expect(recordCreateElement.getOutputResourcePicker()).toBeNull();
                    expect((recordCreateElement.element.node as any).object.error).toBe(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
                    );
                });
                it('enter a valid value in the entity resource picker should not display an error', async () => {
                    await recordCreateElement.selectEntity('Case');
                    expect((recordCreateElement.element.node as any).object.error).toBeNull();
                    expect(recordCreateElement.getFieldsAssignments()).not.toBeNull();
                    expect(recordCreateElement.getOutputResourcePicker()).not.toBeNull();
                });
                describe('Input Assignments', () => {
                    let inputAssignments: RecordInputOutputAssignmentsComponentTest;
                    beforeEach(() => {
                        inputAssignments = recordCreateElement.getFieldsAssignments()!;
                    });
                    test('input Assignments should be visible and correctly displayed (with pill for RHS)', async () => {
                        const fieldToFerovExpressionBuilders = inputAssignments.getFieldToFerovExpressionBuilders();
                        expect(fieldToFerovExpressionBuilders).toHaveLength(2);
                        let expressionBuilder = fieldToFerovExpressionBuilders[0];
                        let baseExpressionBuilder = expressionBuilder.getBaseExpressionBuilderElement();
                        expect(baseExpressionBuilder.lhsValue).toMatchObject({
                            value: 'Account.BillingCity',
                            dataType: 'String',
                            displayText: 'BillingCity'
                        });
                        expect(baseExpressionBuilder.operatorValue).toBeUndefined();
                        expect(baseExpressionBuilder.rhsValue).toMatchObject({
                            category: 'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                            dataType: 'String',
                            displayText: '{!stringVariable}',
                            hasNext: false,
                            iconName: 'utility:text',
                            iconSize: 'xx-small',
                            subtype: null,
                            subText: 'FlowBuilderDataTypes.textDataTypeLabel',
                            text: 'stringVariable',
                            type: 'option-card'
                        });

                        let rhsCombobox = await expressionBuilder.getRhsCombobox();
                        expect(rhsCombobox.element.hasPill).toBe(true);
                        expect(rhsCombobox.element.pill).toEqual({
                            iconName: 'utility:text',
                            label: 'stringVariable'
                        });

                        expressionBuilder = fieldToFerovExpressionBuilders[1];
                        baseExpressionBuilder = expressionBuilder.getBaseExpressionBuilderElement();
                        expect(baseExpressionBuilder.lhsValue).toMatchObject({
                            dataType: 'String',
                            displayText: 'Name',
                            value: 'Account.Name'
                        });
                        expect(baseExpressionBuilder.operatorValue).toBeUndefined();
                        expect(baseExpressionBuilder.rhsValue).toMatchObject({
                            category: 'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                            dataType: 'String',
                            displayText: '{!textVariable}',
                            hasNext: false,
                            iconName: 'utility:text',
                            iconSize: 'xx-small',
                            subtype: null,
                            subText: 'FlowBuilderDataTypes.textDataTypeLabel',
                            text: 'textVariable',
                            type: 'option-card'
                        });
                        rhsCombobox = await expressionBuilder.getRhsCombobox();
                        expect(rhsCombobox.element.hasPill).toBe(true);
                        expect(rhsCombobox.element.pill).toEqual({
                            iconName: 'utility:text',
                            label: 'textVariable'
                        });
                    });
                    it('Removing the selected field should not change the value if the RHS has a value', async () => {
                        const combobox = await inputAssignments.getFieldToFerovExpressionBuilders()[0].getLhsCombobox();
                        await combobox.typeLiteralValue('');
                        expect(inputAssignments.getFieldToFerovExpressionBuilders()).toHaveLength(2);
                        expect(
                            inputAssignments.getFieldToFerovExpressionBuilders()[0].getBaseExpressionBuilderElement()
                                .lhsValue
                        ).toMatchObject({
                            dataType: 'String',
                            displayText: 'BillingCity',
                            value: 'Account.BillingCity'
                        });
                    });
                    it('Should only display creatable fields', async () => {
                        const combobox = await inputAssignments.getFieldToFerovExpressionBuilders()[0].getLhsCombobox();
                        // Type is creatable
                        expect(combobox.getItems()).toEqual(
                            expect.arrayContaining([
                                expect.objectContaining({
                                    text: 'Type'
                                })
                            ])
                        );
                        // CreatedById is not creatable
                        expect(combobox.getItems()).toEqual(
                            expect.not.arrayContaining([
                                expect.objectContaining({
                                    text: 'CreatedById'
                                })
                            ])
                        );
                    });
                    it('Should display no fields once all creatable fields have been selected', async () => {
                        await recordCreateElement.selectEntity('Feed Item');
                        inputAssignments = recordCreateElement.getFieldsAssignments()!;
                        const feedItemFieldsArray: { creatable; apiName }[] = Object.values(feedItemFields);
                        const creatableFields = feedItemFieldsArray
                            .filter((field) => field.creatable)
                            .map((field) => field.apiName);
                        expect(creatableFields.length).toBeGreaterThan(15);
                        expect(creatableFields).toHaveLength(20);

                        for (let i = 0; i < creatableFields.length; i++) {
                            const creatableField = creatableFields[i];
                            const inputOutputAssignments = inputAssignments;
                            const fieldToFerovExpressionBuilders = inputOutputAssignments.getFieldToFerovExpressionBuilders();
                            // eslint-disable-next-line no-await-in-loop
                            const lhsCombobox = await fieldToFerovExpressionBuilders[i].getLhsCombobox();
                            expect(lhsCombobox.getItems()).toHaveLength(creatableFields.length - i);
                            // eslint-disable-next-line no-await-in-loop
                            await lhsCombobox.selectItemBy('displayText', [creatableField]);
                            // eslint-disable-next-line no-await-in-loop
                            await inputOutputAssignments.clickAddFieldButton();
                        }
                        const fieldToFerovExpressionBuilders = inputAssignments.getFieldToFerovExpressionBuilders();
                        const fieldToFerovExpressionBuilder = fieldToFerovExpressionBuilders[creatableFields.length];
                        const lhsCombobox = await fieldToFerovExpressionBuilder.getLhsCombobox();
                        expect(lhsCombobox.getItems()).toHaveLength(0);
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
                const recordStoreElement = recordCreateElement.getRecordStoreOptionElement();
                const radioGroupElements = recordCreateElement.getRecordStoreOptionRadioGroupElements();
                expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                expect(radioGroupElements).toHaveLength(2);
            });
            it('assigns Record Id To Reference should not be displayed', () => {
                const outputResource = recordCreateElement.getOutputResourcePicker();
                expect(outputResource).toBeNull();
            });
            it('"manuallyAssignVariablesCheckbox" should be visible', () => {
                const checkbox = recordCreateElement.getManuallyAssignVariablesCheckboxElement();
                expect(checkbox).not.toBeNull();
            });
            it('"manuallyAssignVariablesCheckbox" should be unchecked', () => {
                const checkbox = recordCreateElement.getManuallyAssignVariablesCheckboxElement();
                expect(checkbox).not.toBeNull();
                expect(recordCreateElement.isManuallyAssignVariables()).toBe(false);
            });
        });
        describe('sObject Or SObject Collection Picker', () => {
            const expectCanBeTraversedInResourcePicker = async (textValues) => {
                await expectCanBeTraversed(
                    recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.getGroupedCombobox(),
                    'text',
                    textValues
                );
            };
            describe('create from single value', () => {
                beforeEach(() => {
                    const element = getElementByDevName('createFromAnAccount');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(recordCreateNode);
                });
                it('should contain single sobject elements, and no traversal', async () => {
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCannotBeTraversedInResourcePicker(['accountSObjectVariable']);
                    await expectCannotBeSelectedInResourcePicker(['accountSObjectCollectionVariable']);
                });
                it('should contain elements that contains sobject and shows only single sobject fields up. Sobject fields should not be traversable', async () => {
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeVariable']);
                    await expectCannotBeTraversedInResourcePicker(['apexComplexTypeVariable', 'acct']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'acctListField']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'name']);
                });
                it('should contain elements that contains apex that contains sobject and shows only single sobject fields up. Sobject fields should not be traversable', async () => {
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable']);
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeTwoVariable', 'testOne']);
                    await expectCannotBeTraversedInResourcePicker(['apexComplexTypeTwoVariable', 'testOne', 'acct']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeTwoVariable', 'listOfTestOne']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeTwoVariable', 'str']);
                });
                it('should not contain elements that are not sobject or contain no sobject', async () => {
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCannotBeSelectedInResourcePicker(['apexCarVariable']);
                });
                it('should not contain elements that contains only a collection of sobject', async () => {
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCannotBeSelectedInResourcePicker(['apexContainsOnlyAnSObjectCollectionVariable']);
                });
                it('should throw validation error if selecting a non SObject from the combobox', async () => {
                    const combobox = recordCreateElement.getSObjectOrSObjectCollectionPicker()!.getCombobox();
                    await combobox.removePill();
                    await combobox.getGroupedCombobox().type('{!apexComplexTypeVariable}');
                    expect(
                        recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.element.errorMessage
                    ).toBe(FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.MERGE_FIELD_INVALID_DATA_TYPE);
                });
                it('should throw validation error if manually entering an SObject collection', async () => {
                    const combobox = recordCreateElement.getSObjectOrSObjectCollectionPicker()!.getCombobox();
                    await combobox.removePill();
                    await combobox.getGroupedCombobox().type('{!accountSObjectCollectionVariable}');
                    expect(
                        recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.element.errorMessage
                    ).toBe(FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('should only contain elements that are creatable sobject or contain creatable sobject', async () => {
                    try {
                        addRecordVariable('onlyCreateableRecordVar', 'ProcessExceptionEvent');
                        addRecordVariable('onlyQueryableRecordVar', 'Community');
                        addRecordVariable('updateableAndQueryableRecordVar', 'Organization');
                        addRecordVariable('deletableAndQueryableRecordVar', 'AccountFeed');
                        const resourceCombobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        await resourceCombobox.removePill();
                        // account is createable, queryable, updateable, deletable
                        await expect(resourceCombobox).canSelectInCombobox('text', ['accountSObjectVariable']);
                        // this record var is only createable
                        await expect(resourceCombobox).canSelectInCombobox('text', ['onlyCreateableRecordVar']);
                        // this record var is updateable and queryable
                        await expect(resourceCombobox).not.canSelectInCombobox('text', [
                            'updateableAndQueryableRecordVar'
                        ]);
                        // this record var is only queryable
                        await expect(resourceCombobox).not.canSelectInCombobox('text', ['onlyQueryableRecordVar']);
                        // this record var is queryable and deletable
                        await expect(resourceCombobox).not.canSelectInCombobox('text', [
                            'deletableAndQueryableRecordVar'
                        ]);
                    } finally {
                        deleteVariableWithName('onlyCreateableRecordVar');
                        deleteVariableWithName('onlyQueryableRecordVar');
                        deleteVariableWithName('updateableAndQueryableRecordVar');
                        deleteVariableWithName('deletableAndQueryableRecordVar');
                    }
                });
                describe('pills', () => {
                    it('displays selected "inputReference" (sObject) pill', () => {
                        const sObjectOrSObjectCollectionPickerCombobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(sObjectOrSObjectCollectionPickerCombobox.element.hasPill).toBe(true);
                        expect(sObjectOrSObjectCollectionPickerCombobox.element.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountSObjectVariable'
                        });
                    });
                    it('displays empty combobox and no pill when pill is cleared', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(combobox.element.hasPill).toBe(true);
                        await combobox.removePill();
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.value).toEqual('');
                    });
                    it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
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
                                    const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                                    await combobox.removePill();
                                    await combobox.typeMergeField(resourcePickerMergefieldValue);
                                    expect(combobox.element.hasPill).toBe(false);
                                    expect(combobox.element.errorMessage).toEqual(errorMessage);
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
                                    const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
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
                                const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                                await combobox.removePill();

                                await combobox.selectItemBy('text', resourcePickerValue.split('.'));
                                expect(combobox.element.hasPill).toBe(true);
                                expect(combobox.element.pill).toEqual(expectedPill);
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
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCannotBeTraversedInResourcePicker(['accountSObjectCollectionVariable']);
                    await expectCannotBeSelectedInResourcePicker(['accountSObjectVariable']);
                });
                it('should contain elements that contains sobject and shows only sobject collection fields up.', async () => {
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCanBeTraversedInResourcePicker(['apexComplexTypeVariable']);
                    await expectCannotBeTraversedInResourcePicker(['apexComplexTypeVariable', 'acctListField']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'acct']);
                    await expectCannotBeSelectedInResourcePicker(['apexComplexTypeVariable', 'name']);
                });
                it('should not contain elements that are not sobject or contain no sobject', async () => {
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCannotBeSelectedInResourcePicker(['apexCarVariable']);
                });
                it('should not contain elements that contains only a single sobject', async () => {
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                    await expectCannotBeSelectedInResourcePicker(['apexContainsOnlyASingleSObjectVariable']);
                });
                describe('pills', () => {
                    it('displays selected "inputReference" (sObjectCollection) pill', () => {
                        const sObjectOrSObjectCollectionPickerCombobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(sObjectOrSObjectCollectionPickerCombobox.element.hasPill).toBe(true);
                        expect(sObjectOrSObjectCollectionPickerCombobox.element.pill).toEqual({
                            iconName: 'utility:sobject',
                            label: 'accountSObjectCollectionVariable'
                        });
                    });
                    it('displays empty combobox and no pill when pill is cleared', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(combobox.element.hasPill).toBe(true);
                        await combobox.removePill();
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.value).toEqual('');
                    });
                    it('switches to mergeField notation when clicking on "sobjectOrSobjectCollectionPicker" pill', async () => {
                        const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
                        expect(combobox.element.hasPill).toBe(true);
                        await combobox.clickPill();
                        expect(combobox.element.hasPill).toBe(false);
                        expect(combobox.element.value.displayText).toEqual('{!accountSObjectCollectionVariable}');
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
                                    const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
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
                                ${'{!accountSObjectCollectionVariable}'}      | ${{ iconName: 'utility:sobject', label: 'accountSObjectCollectionVariable' }}
                                ${'{!apexComplexTypeVariable.acctListField}'} | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acctListField' }}
                                ${'{!lookupRecordCollectionAutomaticOutput}'} | ${{ iconName: 'utility:sobject', label: 'Accounts from lookupRecordCollectionAutomaticOutput' }}
                                ${'{!apexCall_anonymous_accounts}'}           | ${{ iconName: 'utility:sobject', label: 'Accounts from apexCall_anonymous_accounts' }}
                            `(
                                'When typing "$resourcePickerMergefieldValue" pill should be: $expectedPill',
                                async ({ resourcePickerMergefieldValue, expectedPill }) => {
                                    const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
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
                            ${'accountSObjectCollectionVariable'}                    | ${{ iconName: 'utility:sobject', label: 'accountSObjectCollectionVariable' }}
                            ${'apexComplexTypeVariable.acctListField'}               | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acctListField' }}
                            ${'Accounts from lookupRecordCollectionAutomaticOutput'} | ${{ iconName: 'utility:sobject', label: 'Accounts from lookupRecordCollectionAutomaticOutput' }}
                            ${'Accounts from apexCall_anonymous_accounts'}           | ${{ iconName: 'utility:sobject', label: 'Accounts from apexCall_anonymous_accounts' }}
                        `(
                            'When selecting "$resourcePickerValue" pill should be: $expectedPill',
                            async ({ resourcePickerValue, expectedPill }) => {
                                const combobox = recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!;
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
        describe('Record store option', () => {
            it('sets record option number to allRecords when using several level of traversal', () => {
                const element = getElementByDevName('create_multiple_from_apex_two_level_traversal');
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode);
                const recordStoreElement = recordCreateElement.getRecordStoreOptionElement();
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
                const outputResourcePickerCombobox = recordCreateElement.getOutputResourcePicker()!.getCombobox();
                expect(outputResourcePickerCombobox.element.hasPill).toBe(true);
                expect(outputResourcePickerCombobox.element.pill).toEqual({
                    iconName: 'utility:text',
                    label: 'vAccountIdFromCreate'
                });
            });
            it('can select string field from apex class to store id', async () => {
                // When
                const outputResourcePickerCombobox = recordCreateElement.getOutputResourcePicker()!.getCombobox();
                await outputResourcePickerCombobox.removePill();
                const selectedItem = await outputResourcePickerCombobox.selectItemBy('text', [
                    'apexComplexTypeVariable',
                    'name'
                ]);

                // Then
                const expectedGuid = getElementByDevName('apexComplexTypeVariable')!.guid;
                expect(selectedItem).toMatchObject({
                    displayText: '{!apexComplexTypeVariable.name}',
                    value: `${expectedGuid}.name`
                });

                expect(outputResourcePickerCombobox.element.errorMessage).toBeNull();
                expect((recordCreateElement.element.node as any).assignRecordIdToReference.value).toBe(
                    `${expectedGuid}.name`
                );
            });
            it('cannot select account field from apex class to store id', async () => {
                // When
                const outputResourcePickerCombobox = recordCreateElement.getOutputResourcePicker()!.getCombobox();
                await outputResourcePickerCombobox.removePill();
                const selectedItem = await outputResourcePickerCombobox.selectItemBy(
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
                    const outputResourcePickerCombobox = recordCreateElement.getOutputResourcePicker()!.getCombobox();
                    await outputResourcePickerCombobox.removePill();

                    await outputResourcePickerCombobox.typeReferenceOrValue(outputResourcePickerDisplayText);
                    expect(outputResourcePickerCombobox.element.hasPill).toBe(!expectedErrorMessage);
                    expect(outputResourcePickerCombobox.element.errorMessage).toEqual(expectedErrorMessage);
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
                                const outputResourcePickerCombobox = recordCreateElement
                                    .getOutputResourcePicker()!
                                    .getCombobox();
                                await outputResourcePickerCombobox.removePill();
                                await outputResourcePickerCombobox.typeMergeField(resourcePickerMergefieldValue);
                                expect(outputResourcePickerCombobox.element.hasPill).toBe(false);
                                expect(outputResourcePickerCombobox.element.errorMessage).toEqual(errorMessage);
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
                                const outputResourcePickerCombobox = recordCreateElement
                                    .getOutputResourcePicker()!
                                    .getCombobox();
                                await outputResourcePickerCombobox.removePill();

                                await outputResourcePickerCombobox.typeMergeField(outputResourcePickerMergefieldValue);
                                expect(outputResourcePickerCombobox.element.hasPill).toBe(true);
                                expect(outputResourcePickerCombobox.element.pill).toEqual(expectedPill);
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
                            const outputResourcePickerCombobox = recordCreateElement
                                .getOutputResourcePicker()!
                                .getCombobox();
                            await outputResourcePickerCombobox.removePill();

                            await outputResourcePickerCombobox.selectItemBy(
                                'text',
                                outputResourcePickerValue.split('.')
                            );
                            expect(outputResourcePickerCombobox.element.hasPill).toBe(true);
                            expect(outputResourcePickerCombobox.element.pill).toEqual(expectedPill);
                        }
                    );
                });
            });
            describe('Translate to store UI element', () => {
                // W-9564315
                it('correctly translate to store UI element when there is a variable with same name than created object type', async () => {
                    // Given
                    // there is a variable with name 'Account'
                    recordCreateNode = getElementForPropertyEditor({
                        locationX: 10,
                        locationY: 10,
                        elementType: ELEMENT_TYPE.RECORD_CREATE
                    });
                    recordCreateElement = createComponentForTest(recordCreateNode);
                    await recordCreateElement.getLabelDescription().setName('createAccountTest');
                    await recordCreateElement.clickUseSeparateVariables();
                    await recordCreateElement.selectEntity('Account');
                    const expressionBuilder = recordCreateElement
                        .getFieldsAssignments()!
                        .getFieldToFerovExpressionBuilders()[0];
                    const lhsCombobox = await expressionBuilder.getLhsCombobox();
                    await lhsCombobox.selectItemBy('displayText', ['Name']);
                    const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                    await rhsCombobox.typeLiteralValue('the name');

                    // When
                    const elementForStore = getElementForStore(recordCreateElement.element.node);

                    // Then
                    expect(elementForStore.inputAssignments[0].leftHandSide).toBe('Account.Name');
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
                    recordCreateElement.clickCreateMultipleRecords();
                    await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
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
                        const outputResourcePickerCombobox = recordCreateElement
                            .getOutputResourcePicker()!
                            .getCombobox();
                        await outputResourcePickerCombobox.removePill();

                        await outputResourcePickerCombobox.typeReferenceOrValue(outputResourcePickerDisplayText);
                        expect(outputResourcePickerCombobox.element.errorMessage).toEqual(expectedErrorMessage);
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
                await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                await expectCannotBeTraversedInResourcePicker(['accountSObjectVariable']);
            });
            it('should contain $Record, and no traversal', async () => {
                await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                await expectCannotBeTraversedInResourcePicker(['$Record']);
                await expectCannotBeSelectedInResourcePicker(['$Record__Prior']);
            });
            it('should not contain $Record Prior, and no traversal', async () => {
                await recordCreateElement.getSObjectOrSObjectCollectionPickerCombobox()!.removePill();
                await expectCannotBeSelectedInResourcePicker(['$Record__Prior']);
            });
        });
    });
});
