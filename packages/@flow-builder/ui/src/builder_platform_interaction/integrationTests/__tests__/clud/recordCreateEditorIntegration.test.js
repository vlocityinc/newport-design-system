import { createElement } from 'lwc';
import RecordCreateEditor from 'builder_platform_interaction/recordCreateEditor';
import { resolveRenderCycles } from '../resolveRenderCycles';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    changeComboboxValue,
    setupStateForProcessType,
    resetState
} from '../integrationTestUtils';
import { getLabelDescriptionLabelElement, getLabelDescriptionNameElement } from '../labelDescriptionTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { EditElementEvent, AddElementEvent } from 'builder_platform_interaction/events';
import { updateFlow } from 'builder_platform_interaction/actions';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import {
    flowWithCreateRecordUsingSObject,
    flowWithCreateRecordUsingSObjectCollection,
    flowWithCreateRecordUsingFields
} from 'mock/flows/flowWithCreateRecord';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    getAdvancedOptionCheckbox,
    getUseAdvancedOptionComponent,
    deepQuerySelector,
    focusoutEvent,
    clickEvent,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getLhsCombobox } from '../expressionBuilderTestUtils';
import { selectComboboxItemBy, getComboboxItems, typeReferenceOrValueInCombobox } from '../comboboxTestUtils';
import { getBaseExpressionBuilder } from '../expressionBuilderTestUtils';
import { selectGroupedComboboxItemBy, getGroupedComboboxItemBy } from '../groupedComboboxTestUtils';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import {
    SELECTORS,
    getResourceGroupedCombobox,
    getResourceCombobox,
    getOutputResourcePickerCombobox,
    getRadioGroups,
    getEntityResourcePicker,
    getFieldToFerovExpressionBuilders
} from './cludEditorTestUtils';

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'Flow';

const VALIDATION_ERROR_MESSAGES = {
    INVALID_DATA_TYPE: 'FlowBuilderMergeFieldValidation.invalidDataType',
    ...FLOW_BUILDER_VALIDATION_ERROR_MESSAGES
};

const getSObjectOrSObjectCollectionPicker = recordEditor => {
    return recordEditor.shadowRoot.querySelector(SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);
};

const getRecordStoreOption = recordEditor => {
    return recordEditor.shadowRoot.querySelector(SELECTORS.RECORD_STORE_OPTION);
};

const getInputOutputAssignments = recordEditor => {
    return recordEditor.shadowRoot.querySelector(SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);
};

const getEntityResourcePickerComboboxElement = entityResourcePicker => {
    return deepQuerySelector(entityResourcePicker, [
        SELECTORS.BASE_RESOURCE_PICKER,
        SELECTORS.COMBOBOX,
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

const getExpressionBuilderComboboxElement = expressionBuilder => {
    return deepQuerySelector(expressionBuilder, [SELECTORS.INTERACTION_COMBOBOX, SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);
};

const getOutputResourcePicker = recordEditor => {
    return recordEditor.shadowRoot.querySelector(SELECTORS.OUTPUT_RESOURCE_PICKER);
};

const createComponentForTest = (
    node,
    mode = EditElementEvent.EVENT_NAME,
    processType = MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
) => {
    const el = createElement('builder_platform_interaction-record-create-editor', { is: RecordCreateEditor });
    Object.assign(el, { node, processType, mode });
    document.body.appendChild(el);
    return el;
};

describe('Record Create Editor', () => {
    let recordCreateNode;
    let store;
    let uiFlow;
    describe('Working in auto launched flow', () => {
        beforeAll(async () => {
            store = await setupStateForProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
        });
        afterAll(() => {
            resetState();
        });
        describe('name and dev name', () => {
            beforeAll(() => {
                uiFlow = translateFlowToUIModel(flowWithCreateRecordUsingSObject);
                store.dispatch(updateFlow(uiFlow));
            });
            afterAll(() => {
                store.dispatch({ type: 'INIT' });
            });
            beforeEach(() => {
                const element = getElementByDevName('Create_Record_Using_SObject');
                recordCreateNode = getElementForPropertyEditor(element);
            });
            it('do not change devName if it already exists after the user modifies the name', () => {
                const newLabel = 'new label';
                const recordCreateElement = createComponentForTest(recordCreateNode);
                return resolveRenderCycles(() => {
                    const labelInput = getLabelDescriptionLabelElement(recordCreateElement);
                    labelInput.value = newLabel;
                    labelInput.dispatchEvent(focusoutEvent);
                    return resolveRenderCycles(() => {
                        expect(recordCreateElement.node.label.value).toBe(newLabel);
                        expect(recordCreateElement.node.name.value).toBe('Create_Record_Using_SObject');
                    });
                });
            });
            it('modify the dev name', () => {
                const newDevName = 'newName';
                const recordCreateElement = createComponentForTest(recordCreateNode);
                return resolveRenderCycles(() => {
                    const devNameInput = getLabelDescriptionNameElement(recordCreateElement);
                    devNameInput.value = newDevName;
                    devNameInput.dispatchEvent(focusoutEvent);
                    return resolveRenderCycles(() => {
                        expect(recordCreateElement.node.name.value).toBe(newDevName);
                    });
                });
            });
            it('displays error if name is cleared', () => {
                const newLabel = '';
                const recordCreateElement = createComponentForTest(recordCreateNode);
                return resolveRenderCycles(() => {
                    const labelInput = getLabelDescriptionLabelElement(recordCreateElement);
                    labelInput.value = newLabel;
                    labelInput.dispatchEvent(focusoutEvent);
                    return resolveRenderCycles(() => {
                        expect(recordCreateElement.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                    });
                });
            });
            it('displays error if devName is cleared', () => {
                const newDevName = '';
                const recordCreateElement = createComponentForTest(recordCreateNode);
                return resolveRenderCycles(() => {
                    const devNameInput = getLabelDescriptionNameElement(recordCreateElement);
                    devNameInput.value = newDevName;
                    devNameInput.dispatchEvent(focusoutEvent);
                    return resolveRenderCycles(() => {
                        expect(recordCreateElement.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                    });
                });
            });
        });
        describe('Add new element', () => {
            let recordCreateElement;
            beforeEach(() => {
                recordCreateNode = getElementForPropertyEditor({
                    locationX: 10,
                    locationY: 10,
                    elementType: ELEMENT_TYPE.RECORD_CREATE
                });
                recordCreateElement = createComponentForTest(recordCreateNode, AddElementEvent.EVENT_NAME);
            });
            it('all field should be empty', () => {
                const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                    recordCreateElement
                );
                return resolveRenderCycles(() => {
                    expect(sObjectOrSObjectCollectionPickerElement.value).toBe('');
                });
            });
            // W-7118031
            it('Displays NO "A value is required." error message for the sobjectOrSobjectCollectionPicker ("record selection")', () => {
                const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                    recordCreateElement
                );
                return resolveRenderCycles(() => {
                    expect(sObjectOrSObjectCollectionPickerElement.errorMessage).toBeNull();
                });
            });
            it('record Store Option should have firstRecord and sObjectVariable selected', () => {
                const recordStoreElement = getRecordStoreOption(recordCreateElement);
                const radioGroupElements = getRadioGroups(recordStoreElement);
                return resolveRenderCycles(() => {
                    expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                    expect(recordStoreElement.wayToStoreFields).toBe('sObjectVariable');
                    expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(false);
                    expect(radioGroupElements).toHaveLength(2);
                });
            });
        });
        describe('Existing element', () => {
            describe('Working with sObject', () => {
                let recordCreateElement;
                beforeAll(() => {
                    uiFlow = translateFlowToUIModel(flowWithCreateRecordUsingSObject);
                    store.dispatch(updateFlow(uiFlow));
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
                    return resolveRenderCycles(() => {
                        expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                        expect(recordStoreElement.wayToStoreFields).toBe('sObjectVariable');
                        expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(false);
                        expect(radioGroupElements).toHaveLength(2);
                    });
                });
                it('inputReference should be display ', () => {
                    return resolveRenderCycles(() => {
                        const sObJectPicker = getSObjectOrSObjectCollectionPicker(recordCreateElement);
                        expect(sObJectPicker.value).toBe(recordCreateElement.node.inputReference.value);
                    });
                });
                it('sObject Or SObject Collection Picker should contain "New Resource"', () => {
                    const rhsGroupedCombobox = getResourceGroupedCombobox(recordCreateElement);
                    return resolveRenderCycles(() => {
                        expect(
                            getGroupedComboboxItemBy(
                                rhsGroupedCombobox,
                                'text',
                                'FlowBuilderExpressionUtils.newResourceLabel'
                            )
                        ).toBeDefined();
                    });
                });
            });
            describe('Working with sObject Collection', () => {
                let recordCreateElement;
                beforeAll(() => {
                    uiFlow = translateFlowToUIModel(flowWithCreateRecordUsingSObjectCollection);
                    store.dispatch(updateFlow(uiFlow));
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
                    return resolveRenderCycles(() => {
                        expect(recordStoreElement.numberOfRecordsToStore).toBe('allRecords');
                        expect(radioGroupElements).toHaveLength(1);
                    });
                });
                it('input reference should display The variable "vAccountCollection"', () => {
                    const sObjectOrSObjectCollectionPickerElement = getSObjectOrSObjectCollectionPicker(
                        recordCreateElement
                    );
                    return resolveRenderCycles(() => {
                        expect(sObjectOrSObjectCollectionPickerElement.value).toBe(
                            recordCreateElement.node.inputReference.value
                        );
                    });
                });
                it('sObject Or SObject Collection Picker should contain "New Resource"', () => {
                    const rhsGroupedCombobox = getResourceGroupedCombobox(recordCreateElement);
                    return resolveRenderCycles(() => {
                        expect(
                            getGroupedComboboxItemBy(
                                rhsGroupedCombobox,
                                'text',
                                'FlowBuilderExpressionUtils.newResourceLabel'
                            )
                        ).toBeDefined();
                    });
                });
            });
            describe('Working with fields', () => {
                let recordCreateElement;
                const selectEntity = async apiName => {
                    const entityResourcePicker = getEntityResourcePicker(recordCreateElement);
                    const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                    changeComboboxValue(comboboxElement, apiName);
                    await ticks(50);
                };
                const clickAddFieldButton = async () => {
                    const inputAssignments = getInputOutputAssignments(recordCreateElement);
                    const addFieldButton = deepQuerySelector(inputAssignments, [
                        SELECTORS.LIST,
                        SELECTORS.LIGHTNING_BUTTON
                    ]);
                    addFieldButton.dispatchEvent(clickEvent());
                    await ticks(50);
                };
                beforeAll(() => {
                    uiFlow = translateFlowToUIModel(flowWithCreateRecordUsingFields);
                    store.dispatch(updateFlow(uiFlow));
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
                it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', () => {
                    const recordStoreElement = getRecordStoreOption(recordCreateElement);
                    const radioGroupElements = getRadioGroups(recordStoreElement);
                    return resolveRenderCycles(() => {
                        expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                        expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                        expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(false);
                        expect(radioGroupElements).toHaveLength(2);
                    });
                });
                it('entity Resource picker should display the entity', () => {
                    return resolveRenderCycles(() => {
                        const entityResourcePicker = getEntityResourcePicker(recordCreateElement);
                        expect(entityResourcePicker.value.value).toBe(recordCreateElement.node.object.value);
                    });
                });
                it('assigns Record Id To Reference should have a value', () => {
                    return resolveRenderCycles(() => {
                        const outputResource = getOutputResourcePicker(recordCreateElement);

                        expect(outputResource.value.value).toBe(
                            recordCreateElement.node.assignRecordIdToReference.value
                        );
                    });
                });
                it('use advanced checkbox component should not be visible', () => {
                    const useAdvancedOptionCheckBox = getUseAdvancedOptionComponent(recordCreateElement);
                    expect(useAdvancedOptionCheckBox).toBeNull();
                });
                it('removing the entity should hide input assignment but store option element should remained', () => {
                    const entityResourcePicker = getEntityResourcePicker(recordCreateElement);
                    const comboboxElement = getEntityResourcePickerComboboxElement(entityResourcePicker);
                    changeComboboxValue(comboboxElement, '');
                    return resolveRenderCycles(() => {
                        expect(recordCreateElement.node.object.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                        expect(getInputOutputAssignments(recordCreateElement)).toBeNull();
                        const recordStoreElement = getRecordStoreOption(recordCreateElement);
                        const radioGroupElements = getRadioGroups(recordStoreElement);
                        expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                        expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                        expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(false);
                        expect(radioGroupElements).toHaveLength(2);
                    });
                });
                it('enter an invalid value in the entity resource picker should not display other element but should display an error', async () => {
                    await selectEntity('invalidValue');
                    expect(getInputOutputAssignments(recordCreateElement)).toBeNull();
                    expect(getOutputResourcePicker(recordCreateElement)).toBeNull();
                    expect(recordCreateElement.node.object.error).toBe(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('enter an valid value in the entity resource picker should not display an error', async () => {
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
                    it('input Assignments should be visible and correctly displayed', () => {
                        return resolveRenderCycles(() => {
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
                        });
                    });
                    it('Removing the selected field should not change the value if the RHS has a value', () => {
                        let baseExpressionBuilder = getBaseExpressionBuilder(
                            getFieldToFerovExpressionBuilders(inputAssignments)[0]
                        );
                        const combobox = getExpressionBuilderComboboxElement(baseExpressionBuilder);
                        changeComboboxValue(combobox, '');
                        return resolveRenderCycles(() => {
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
                        const creatableFields = Object.values(feedItemFields)
                            .filter(field => field.creatable)
                            .map(field => field.apiName);
                        expect(creatableFields.length).toBeGreaterThan(15);
                        expect(creatableFields).toHaveLength(20);

                        // workaround for no-await-in-loop
                        let promise = Promise.resolve();
                        for (let i = 0; i < creatableFields.length; i++) {
                            // workaround for no-loop-func
                            const creatableFieldsLength = creatableFields.length;
                            const creatableField = creatableFields[i];
                            const inputOutputAssignments = inputAssignments;
                            promise = promise.then(() => {
                                const fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(
                                    inputOutputAssignments
                                );
                                const lhsCombobox = getLhsCombobox(fieldToFerovExpressionBuilder[i]);
                                expect(getComboboxItems(lhsCombobox)).toHaveLength(creatableFieldsLength - i);
                                return selectComboboxItemBy(lhsCombobox, 'displayText', [creatableField]).then(() =>
                                    clickAddFieldButton()
                                );
                            });
                        }
                        await promise;
                        const fieldToFerovExpressionBuilder = getFieldToFerovExpressionBuilders(inputAssignments);
                        const lhsCombobox = getLhsCombobox(fieldToFerovExpressionBuilder[creatableFields.length]);
                        expect(getComboboxItems(lhsCombobox)).toHaveLength(0);
                    });
                });
            });
        });
    });
    describe('Working with Flow', () => {
        let recordCreateElement;
        beforeAll(async () => {
            store = await setupStateForProcessType(FLOW_PROCESS_TYPE.FLOW);
            uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            resetState();
        });
        describe('Working with automatic output handling', () => {
            beforeEach(() => {
                const element = getElementByDevName('createAccountWithAutomaticOutput');
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(
                    recordCreateNode,
                    EditElementEvent.EVENT_NAME,
                    MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                );
            });
            it('record store option should have "Only the first record" and "In separate variables" selected and the second radio group should be visible', () => {
                const recordStoreElement = getRecordStoreOption(recordCreateElement);
                const radioGroupElements = getRadioGroups(recordStoreElement);
                expect(recordStoreElement.numberOfRecordsToStore).toBe('firstRecord');
                expect(recordStoreElement.wayToStoreFields).toBe('separateVariables');
                expect(recordStoreElement.assignNullValuesIfNoRecordsFound).toBe(false);
                expect(radioGroupElements).toHaveLength(2);
            });
            it('assigns Record Id To Reference should not be displayed', () => {
                const outputResource = getOutputResourcePicker(recordCreateElement);
                expect(outputResource).toBeNull();
            });
            it('use advanced checkbox component should be visible', () => {
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
            let sObjectOrSObjectCollectionPicker;
            describe('create from single value', () => {
                beforeEach(() => {
                    const element = getElementByDevName('createFromAnAccount');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(
                        recordCreateNode,
                        EditElementEvent.EVENT_NAME,
                        MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                    );
                    sObjectOrSObjectCollectionPicker = getResourceGroupedCombobox(recordCreateElement);
                });
                it('should contain single sobject elements, and no traversal', async () => {
                    const account = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['accountSObjectVariable'],
                        { blur: false }
                    );

                    expect(account).toBeDefined();
                    expect(account.rightIconName).toBe('');

                    const accountCollection = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['accountSObjectCollectionVariable'],
                        { blur: false }
                    );
                    expect(accountCollection).toBeUndefined();
                });
                it('should contain elements that contains sobject and shows only single sobject fields up. Sobject fields should not be traversable', async () => {
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

                    expect(accountCollectionField).toBeUndefined();

                    const nameField = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexComplexTypeVariable', 'name'],
                        { blur: false }
                    );
                    expect(nameField).toBeUndefined();
                });
                it('should not contain elements that are not sobject or contain no sobject', async () => {
                    const apexCarVariable = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexCarVariable'],
                        { blur: false }
                    );

                    expect(apexCarVariable).toBeUndefined();
                });
                it('should not contain elements that contains only a collection of sobject', async () => {
                    const apexContainsOnlyAnSObjectCollectionVariable = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexContainsOnlyAnSObjectCollectionVariable'],
                        { blur: false }
                    );

                    expect(apexContainsOnlyAnSObjectCollectionVariable).toBeUndefined();
                });
                it('should throw validation error if selecting a non SObject from the combobox', async () => {
                    changeComboboxValue(sObjectOrSObjectCollectionPicker, '{!apexComplexTypeVariable}');

                    expect(getResourceCombobox(recordCreateElement).errorMessage).toBe(
                        VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE
                    );
                });
                it('should throw validation error if manually entering an SObject collection', async () => {
                    changeComboboxValue(sObjectOrSObjectCollectionPicker, '{!accountSObjectCollectionVariable}');

                    expect(getResourceCombobox(recordCreateElement).errorMessage).toBe(
                        VALIDATION_ERROR_MESSAGES.GENERIC
                    );
                });
            });
            describe('create from collection', () => {
                beforeEach(() => {
                    const element = getElementByDevName('createFromMultipleAccounts');
                    recordCreateNode = getElementForPropertyEditor(element);
                    recordCreateElement = createComponentForTest(
                        recordCreateNode,
                        EditElementEvent.EVENT_NAME,
                        MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                    );
                    sObjectOrSObjectCollectionPicker = getResourceGroupedCombobox(recordCreateElement);
                });
                it('should contain sobject collection elements, and no traversal', async () => {
                    const accountCollection = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['accountSObjectCollectionVariable'],
                        { blur: false }
                    );

                    expect(accountCollection).toBeDefined();
                    expect(accountCollection.rightIconName).toBe('');

                    const account = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['accountSObjectVariable'],
                        { blur: false }
                    );

                    expect(account).toBeUndefined();
                });
                it('should contain elements that contains sobject and shows only sobject collection fields up.', async () => {
                    const apexContainsSObject = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexComplexTypeVariable'],
                        { blur: false }
                    );

                    expect(apexContainsSObject).toBeDefined();
                    expect(apexContainsSObject.rightIconName).toBeDefined();

                    const accountCollectionField = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexComplexTypeVariable', 'acctListField'],
                        { blur: false }
                    );
                    expect(accountCollectionField).toBeDefined();
                    expect(accountCollectionField.rightIconName).toBeUndefined();

                    const accountField = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexComplexTypeVariable', 'acct'],
                        { blur: false }
                    );

                    expect(accountField).toBeUndefined();

                    const nameField = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexComplexTypeVariable', 'name'],
                        { blur: false }
                    );
                    expect(nameField).toBeUndefined();
                });
                it('should not contain elements that are not sobject or contain no sobject', async () => {
                    const apexCarVariable = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexCarVariable'],
                        { blur: false }
                    );

                    expect(apexCarVariable).toBeUndefined();
                });
                it('should not contain elements that contains only a single sobject', async () => {
                    const apexContainsOnlyASingleSObjectVariable = await selectGroupedComboboxItemBy(
                        sObjectOrSObjectCollectionPicker,
                        'text',
                        ['apexContainsOnlyASingleSObjectVariable'],
                        { blur: false }
                    );

                    expect(apexContainsOnlyASingleSObjectVariable).toBeUndefined();
                });
            });
        });
        describe('Working with manual output handling', () => {
            let outputResourcePickerCombobox;
            beforeEach(() => {
                const element = getElementByDevName('createAccountWithAdvancedOptions');
                recordCreateNode = getElementForPropertyEditor(element);
                recordCreateElement = createComponentForTest(recordCreateNode, EditElementEvent.EVENT_NAME);
                outputResourcePickerCombobox = getOutputResourcePickerCombobox(
                    getOutputResourcePicker(recordCreateElement)
                );
            });
            it('can select string field from apex class to store id', async () => {
                // When
                const selectedItem = await selectComboboxItemBy(
                    outputResourcePickerCombobox,
                    'text',
                    ['apexComplexTypeVariable', 'name'],
                    { blur: true }
                );

                // Then
                const expectedGuid = getElementByDevName('apexComplexTypeVariable').guid;
                expect(selectedItem).toMatchObject({
                    displayText: '{!apexComplexTypeVariable.name}',
                    value: expectedGuid + '.name'
                });
                expect(outputResourcePickerCombobox.errorMessage).toBeNull();
                expect(recordCreateElement.node.assignRecordIdToReference.value).toBe(expectedGuid + '.name');
            });
            it('cannot select account field from apex class to store id', async () => {
                // When
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
                outputResourcePicker                          | expectedErrorMessage
                ${'{!apexComplexTypeVariable.name}'}          | ${null}
                ${'{!apexComplexTypeVariable.acct}'}          | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                ${'{!apexComplexTypeVariable.acct.}'}         | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                ${'{!apexComplexTypeVariable.doesNotExist}'}  | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
                ${'{!apexComplexTypeVariable.doesNotExist.}'} | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
            `(
                'error for "$outputResourcePicker should be : $expectedErrorMessage and assignRecordIdToReference : $expectedNodeValue',
                async ({ outputResourcePicker, expectedErrorMessage }) => {
                    await typeReferenceOrValueInCombobox(outputResourcePickerCombobox, outputResourcePicker);
                    expect(outputResourcePickerCombobox.errorMessage).toEqual(expectedErrorMessage);
                }
            );
        });
    });
});
