import { createElement } from 'lwc';
import SubflowEditor from 'builder_platform_interaction/subflowEditor';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { changeComboboxValue, resetState, setupStateForFlow } from '../integrationTestUtils';
import { getLabelDescriptionElement, LabelDescriptionComponentTest } from '../labelDescriptionTestUtils';
import {
    VALIDATION_ERROR_MESSAGES,
    getBaseCalloutElement,
    getInputParameterItems,
    getOutputParameterItems,
    getInputParameterComboboxElement,
    getOutputParameterComboboxElement,
    getLightningInputToggle,
    getDeleteButton,
    getParameterIcon,
    getWarningIcon,
    getWarningBadge,
    toggleChangeEvent,
    verifyOptionalInputParameterWithValue,
    verifyOptionalInputParameterNoValue,
    verifyOutputParameter,
    getParameter,
    findParameterElement,
    filterParameterElements,
    getElementGuid,
    getManuallyAssignVariablesCheckboxInputElementFromActionEditor,
    getManuallyAssignVariablesCheckboxFromActionEditor
} from '../baseCalloutEditorTestUtils';
import {
    ticks,
    textInputEvent,
    blurEvent,
    checkboxChangeEvent,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { EditElementEvent, AddElementEvent } from 'builder_platform_interaction/events';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';

const createComponentForTest = (node, mode) => {
    const el = createElement('builder_platform_interaction-subflow-editor', {
        is: SubflowEditor
    });
    Object.assign(el, { node, mode });
    setDocumentBodyChildren(el);
    return el;
};

describe('Subflow Editor', () => {
    let subflowNode, subflowElement;
    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
    });
    afterAll(() => {
        resetState();
    });
    describe('Subflow Editor with automatic output', () => {
        describe('use Manually Assign Variables checkbox Component', () => {
            beforeAll(() => {
                const element = getElementByDevName('subflowAutomaticOutput');
                subflowNode = getElementForPropertyEditor(element);
                subflowElement = createComponentForTest(subflowNode, EditElementEvent.EVENT_NAME);
            });
            test('"Manually Assign Variables" should be unchecked', () => {
                const advancedOptionCheckbox = getManuallyAssignVariablesCheckboxInputElementFromActionEditor(
                    subflowElement
                );

                expect(advancedOptionCheckbox).toBeDefined();
                expect(advancedOptionCheckbox.type).toBe('checkbox');
                expect(advancedOptionCheckbox.checked).toBe(false);
            });
            describe('modify from automatic to manual', () => {
                beforeAll(async () => {
                    const inputElement = getManuallyAssignVariablesCheckboxInputElementFromActionEditor(subflowElement);
                    inputElement.dispatchEvent(checkboxChangeEvent(true));
                    await ticks(1);
                });
                test('"Manually Assign Variables" should checked', () => {
                    const inputElement = getManuallyAssignVariablesCheckboxInputElementFromActionEditor(subflowElement);
                    expect(inputElement).toBeDefined();
                    expect(inputElement.type).toBe('checkbox');
                    expect(inputElement.checked).toBe(true);
                });
            });
        });
    });

    describe('Subflow Editor with all types variable and manual output', () => {
        beforeAll(() => {
            const element = getElementByDevName('subflow_with_all_type_variables');
            subflowNode = getElementForPropertyEditor(element);
            subflowElement = createComponentForTest(subflowNode, AddElementEvent.EVENT_NAME);
        });
        describe('name and dev name', () => {
            let labelDescription: LabelDescriptionComponentTest;
            beforeAll(() => {
                labelDescription = new LabelDescriptionComponentTest(
                    getLabelDescriptionElement(getBaseCalloutElement(subflowElement))
                );
            });
            it('does not change devName if it already exists after the user modifies the name', async () => {
                const newLabel = 'new label';
                await labelDescription.setLabel(newLabel);
                expect(subflowElement.node.label.value).toBe(newLabel);
                expect(subflowElement.node.name.value).toBe('subflow_with_all_type_variables');
            });
            it('modifies the dev name', async () => {
                const newDevName = 'newName';
                await labelDescription.setName(newDevName);
                expect(subflowElement.node.name.value).toBe(newDevName);
            });
            it('displays error if name is cleared', async () => {
                const newLabel = '';
                await labelDescription.setLabel(newLabel);
                expect(subflowElement.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
            it('displays error if devName is cleared', async () => {
                const newDevName = '';
                await labelDescription.setName(newDevName);
                expect(subflowElement.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
        });
        describe('input tab', () => {
            describe('valid cases', () => {
                let inputAssignments;
                beforeAll(() => {
                    inputAssignments = getInputParameterItems(subflowElement);
                });
                it('shows all input parameters (sorted)', () => {
                    verifyOptionalInputParameterNoValue(inputAssignments[0], 'inputAccountColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[1], 'inputAccountVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[2], 'inputBoolColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[3], 'inputBoolVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[4], 'inputCurrencyColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[5], 'inputCurrencyVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[6], 'inputDateColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[7], 'inputDateTimeColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[8], 'inputDateTimeVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[9], 'inputDateVar');
                    // inputNotAvailableParam is not available item and will be check in warning cases
                    verifyOptionalInputParameterNoValue(inputAssignments[11], 'inputNumberColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[12], 'inputNumberVar');
                    verifyOptionalInputParameterWithValue(
                        inputAssignments[13],
                        'inputOutputAccountColVar',
                        '{!accountSObjectCollectionVariable}'
                    );
                    verifyOptionalInputParameterWithValue(
                        inputAssignments[14],
                        'inputOutputAccountVar',
                        '{!accountSObjectVariable}'
                    );
                    verifyOptionalInputParameterNoValue(inputAssignments[15], 'inputOutputBoolColVar');
                    verifyOptionalInputParameterWithValue(
                        inputAssignments[16],
                        'inputOutputBoolVar',
                        '{!booleanVariable}'
                    );
                    verifyOptionalInputParameterNoValue(inputAssignments[17], 'inputOutputCurrencyColVar');
                    verifyOptionalInputParameterWithValue(
                        inputAssignments[18],
                        'inputOutputCurrencyVar',
                        '{!currencyVariable}'
                    );
                    verifyOptionalInputParameterNoValue(inputAssignments[19], 'inputOutputDateColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[20], 'inputOutputDateTimeColVar');
                    verifyOptionalInputParameterWithValue(
                        inputAssignments[21],
                        'inputOutputDateTimeVar',
                        '{!dateTimeVariable}'
                    );
                    verifyOptionalInputParameterWithValue(
                        inputAssignments[22],
                        'inputOutputDateVar',
                        '{!dateVariable}'
                    );
                    verifyOptionalInputParameterNoValue(inputAssignments[23], 'inputOutputNumberColVar');
                    // inputOutputNumberVar is duplicated and will be check in warning cases
                    verifyOptionalInputParameterNoValue(inputAssignments[26], 'inputOutputStringColVar');
                    verifyOptionalInputParameterWithValue(
                        inputAssignments[27],
                        'inputOutputStringVar',
                        '{!stringVariable}'
                    );
                    verifyOptionalInputParameterNoValue(inputAssignments[28], 'inputStringColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[29], 'inputStringVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[30], 'latestInputOutputStringColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[31], 'latestInputOutputStringVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[32], 'latestInputStringColVar');
                    verifyOptionalInputParameterNoValue(inputAssignments[33], 'latestInputStringVar');
                });
                it('updates value when setting the litteral string to the String Parameter', () => {
                    const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('any value'));
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputStringVar').value).toEqual({
                        value: 'any value',
                        error: null
                    });
                });
                it('updates value when setting the variable number to the String Parameter', () => {
                    const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputStringVar').value).toEqual({
                        value: getElementGuid('numberVariable'),
                        error: null
                    });
                });
                it('updates value when setting the empty string constant to the String Parameter', () => {
                    const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING))
                    );
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputStringVar').value).toEqual({
                        value: GLOBAL_CONSTANTS.EMPTY_STRING,
                        error: null
                    });
                });
                it('updates value when setting the string collection variable to the String Collection Parameter', () => {
                    const stringColParameterElement = findParameterElement(inputAssignments, 'inputOutputStringColVar');
                    const toggle = getLightningInputToggle(stringColParameterElement);
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    const stringColParameterCombobox = getInputParameterComboboxElement(stringColParameterElement);
                    stringColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    stringColParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputStringColVar').value).toEqual(
                        {
                            value: getElementGuid('stringCollectionVariable1'),
                            error: null
                        }
                    );
                });
                it('updates value when setting the valid number to the Number Parameter', () => {
                    const numberParameterElement = findParameterElement(inputAssignments, 'inputNumberVar');
                    const numberParameterCombobox = getInputParameterComboboxElement(numberParameterElement);
                    changeComboboxValue(numberParameterCombobox, '1234');
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputNumberVar').value).toEqual({
                        value: '1234',
                        error: null
                    });
                });
                it('updates value when setting the dateTime variable to the Date Parameter', () => {
                    const dateParameterElement = findParameterElement(inputAssignments, 'inputOutputDateVar');
                    const dateParameterCombobox = getInputParameterComboboxElement(dateParameterElement);
                    dateParameterCombobox.dispatchEvent(textInputEvent('{!dateTimeVariable}'));
                    dateParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputDateVar').value).toEqual({
                        value: getElementGuid('dateTimeVariable'),
                        error: null
                    });
                });
                it('updates value when setting the global constant to the Boolean Parameter', () => {
                    const booleanParameterElement = findParameterElement(inputAssignments, 'inputOutputBoolVar');
                    const booleanParameterCombobox = getInputParameterComboboxElement(booleanParameterElement);
                    booleanParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE))
                    );
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputOutputBoolVar').value).toEqual({
                        value: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
                        error: null
                    });
                });
                it('updates value when setting the number to the Currency Parameter', () => {
                    const currencyParameterElement = findParameterElement(inputAssignments, 'inputCurrencyVar');
                    const currencyParameterCombobox = getInputParameterComboboxElement(currencyParameterElement);
                    currencyParameterCombobox.dispatchEvent(textInputEvent('1000'));
                    currencyParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputCurrencyVar').value).toEqual({
                        value: '1000',
                        error: null
                    });
                });
                it('updates value when setting the account variable to the Account Parameter', () => {
                    const accountParameterElement = findParameterElement(inputAssignments, 'inputAccountVar');
                    const toggle = getLightningInputToggle(accountParameterElement);
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    const accountParameterCombobox = getInputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputAccountVar').value).toEqual({
                        value: getElementGuid('accountSObjectVariable'),
                        error: null
                    });
                });
                it('updates value when setting the account collection variable to the Account Collection Parameter', () => {
                    const accountParameterElement = findParameterElement(inputAssignments, 'inputAccountColVar');
                    const toggle = getLightningInputToggle(accountParameterElement);
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    const accountParameterCombobox = getInputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectCollectionVariable}'));
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.inputAssignments, 'inputAccountColVar').value).toEqual({
                        value: getElementGuid('accountSObjectCollectionVariable'),
                        error: null
                    });
                });
                it('shows combobox when toggle is set ON', async () => {
                    inputAssignments = getInputParameterItems(subflowElement);
                    const boolParameterElement = findParameterElement(inputAssignments, 'inputBoolColVar');
                    const toggle = getLightningInputToggle(boolParameterElement);
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    await ticks(1);
                    verifyOptionalInputParameterWithValue(boolParameterElement, 'inputBoolColVar', '');
                });
                it('hides combobox when toggle is set OFF', async () => {
                    inputAssignments = getInputParameterItems(subflowElement);
                    const inputBoolElement = findParameterElement(inputAssignments, 'inputOutputBoolVar');
                    const toggle = getLightningInputToggle(inputBoolElement);
                    toggle.dispatchEvent(toggleChangeEvent(false));
                    await ticks(1);
                    verifyOptionalInputParameterNoValue(inputBoolElement, 'inputOutputBoolVar');
                });
                it('preserves value when toggle is set OFF then ON', () => {
                    const accountElement = findParameterElement(inputAssignments, 'inputOutputAccountVar');
                    const toggle = getLightningInputToggle(accountElement);
                    toggle.dispatchEvent(toggleChangeEvent(false));
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    verifyOptionalInputParameterWithValue(
                        accountElement,
                        'inputOutputAccountVar',
                        '{!accountSObjectVariable}'
                    );
                });
            });
            describe('error cases', () => {
                let inputAssignments;
                beforeEach(() => {
                    inputAssignments = getInputParameterItems(subflowElement);
                });
                it('shows the error if entering the string for the Number Parameter', async () => {
                    const numberParameterElement = findParameterElement(inputAssignments, 'inputOutputNumberVar');
                    const numberParameterCombobox = getInputParameterComboboxElement(numberParameterElement);
                    numberParameterCombobox.dispatchEvent(textInputEvent('invalidNumber'));
                    await ticks(1);
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(numberParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.NUMBER_ERROR_MESSAGE);
                });
                it('shows the error if entering the string for the Currency Parameter', async () => {
                    const currencyParameterElement = findParameterElement(inputAssignments, 'inputOutputCurrencyVar');
                    const currencyParameterCombobox = getInputParameterComboboxElement(currencyParameterElement);
                    currencyParameterCombobox.dispatchEvent(textInputEvent('invalidNumber'));
                    await ticks(1);
                    currencyParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(currencyParameterCombobox.validity).toEqual(
                        VALIDATION_ERROR_MESSAGES.CURRENCY_ERROR_MESSAGE
                    );
                });
                it('shows the error if entering the string for the Account Parameter', async () => {
                    const accountParameterElement = findParameterElement(inputAssignments, 'inputOutputAccountVar');
                    const accountParameterCombobox = getInputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('any string'));
                    await ticks(1);
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(accountParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('shows the error if entering the account variable for the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                    await ticks(1);
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the collection variable for the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(inputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    await ticks(1);
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the account variable for the Account Collection Parameter', async () => {
                    const accountColParameterElement = findParameterElement(
                        inputAssignments,
                        'inputOutputAccountColVar'
                    );
                    const sObjectColParameterCombobox = getInputParameterComboboxElement(accountColParameterElement);
                    sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                    await ticks(1);
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the string collection variable for the Account Collection Parameter', async () => {
                    const accountColParameterElement = findParameterElement(
                        inputAssignments,
                        'inputOutputAccountColVar'
                    );
                    const sObjectColParameterCombobox = getInputParameterComboboxElement(accountColParameterElement);
                    sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    await ticks(1);
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the empty string constant for the Boolean Parameter', async () => {
                    const booleanParameterElement = findParameterElement(inputAssignments, 'inputOutputBoolVar');
                    const toggle = getLightningInputToggle(booleanParameterElement);
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    await ticks(1);
                    const booleanParameterCombobox = getInputParameterComboboxElement(booleanParameterElement);
                    booleanParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING))
                    );
                    await ticks(1);
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(booleanParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
            });
            describe('warning cases', () => {
                describe('duplicated parameters', () => {
                    let inputAssignments, numberParameterItems;
                    beforeAll(async () => {
                        subflowElement = createComponentForTest(subflowNode, EditElementEvent.EVENT_NAME);
                        await ticks(1);
                        inputAssignments = getInputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(inputAssignments, 'inputOutputNumberVar');
                    });
                    it('shows duplicated Number Parameter parameters', () => {
                        expect(numberParameterItems).toHaveLength(2);
                        expect(numberParameterItems[0].item.value.value).toEqual(getElementGuid('numberVariable'));
                        expect(numberParameterItems[1].item.value.value).toEqual(getElementGuid('numberVariable'));
                    });
                    it('shows delete button', () => {
                        numberParameterItems.forEach((item) => {
                            const deleteBtn = getDeleteButton(item);
                            expect(deleteBtn.iconName).toEqual('utility:delete');
                        });
                    });
                    it('deletes duplicated parameter and update the row after deleting when clicking the delete button', async () => {
                        // delete the second Number Parameter
                        inputAssignments = getInputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(inputAssignments, 'inputOutputNumberVar');
                        const deleteBtn = getDeleteButton(numberParameterItems[1]);
                        deleteBtn.click();
                        await ticks(1);

                        inputAssignments = getInputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(inputAssignments, 'inputOutputNumberVar');
                        expect(numberParameterItems).toHaveLength(1);
                        verifyOptionalInputParameterWithValue(
                            numberParameterItems[0],
                            'inputOutputNumberVar',
                            '{!numberVariable}'
                        );
                    });
                });
                describe('not available parameters', () => {
                    let notAvailableItem;
                    beforeAll(() => {
                        const inputAssignments = getInputParameterItems(subflowElement);
                        notAvailableItem = findParameterElement(inputAssignments, 'inputNotAvailableParam');
                    });
                    it('shows delete button', () => {
                        const deleteBtn = getDeleteButton(notAvailableItem);
                        expect(deleteBtn.iconName).toEqual('utility:delete');
                    });
                    it('does not show data type icon', () => {
                        const icon = getParameterIcon(notAvailableItem);
                        expect(icon).toBeNull();
                    });
                    it('shows warning icon', () => {
                        const statusIcon = getWarningIcon(notAvailableItem);
                        expect(statusIcon).not.toBeNull();
                        expect(statusIcon.type).toBe('warning');
                        expect(statusIcon.messages).toEqual([
                            {
                                guid: expect.any(String),
                                messages: [
                                    {
                                        guid: expect.any(String),
                                        message: 'FlowBuilderSubflowEditor.warningNotAvailable'
                                    }
                                ],
                                sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                                title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                            }
                        ]);
                    });
                    it('shows warning badge', () => {
                        const badgeCmp = getWarningBadge(notAvailableItem);
                        expect(badgeCmp).not.toBeNull();
                        expect(badgeCmp.label).toEqual('FlowBuilderSubflowEditor.badgeWillCauseErrors');
                        expect(badgeCmp.classList).toContain('slds-theme_warning');
                    });
                });
            });
            describe('variables in active version but not in latest version', () => {
                // inputOutputStringColVar is in active version but isn't in latest version
                it('shows warning icon', () => {
                    const inputAssignments = getInputParameterItems(subflowElement);
                    const stringColElement = findParameterElement(inputAssignments, 'inputOutputStringColVar');
                    const statusIcon = getWarningIcon(stringColElement);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([
                        {
                            guid: expect.any(String),
                            messages: [
                                {
                                    guid: expect.any(String),
                                    message: 'FlowBuilderSubflowEditor.warningActiveOnly'
                                }
                            ],
                            sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                            title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                        }
                    ]);
                });
            });
            describe('variables in latest version but not in active version', () => {
                // latestInputOutputStringColVar is in latest version but isn't in active version
                let stringColElement;
                beforeAll(() => {
                    const inputAssignments = getInputParameterItems(subflowElement);
                    stringColElement = findParameterElement(inputAssignments, 'latestInputOutputStringColVar');
                });
                it('shows warning icon', () => {
                    const statusIcon = getWarningIcon(stringColElement);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([
                        {
                            guid: expect.any(String),
                            messages: [
                                {
                                    guid: expect.any(String),
                                    message: 'FlowBuilderSubflowEditor.warningLatestOnly'
                                }
                            ],
                            sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                            title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                        }
                    ]);
                });
                it('shows warning badge', () => {
                    const badgeCmp = getWarningBadge(stringColElement);
                    expect(badgeCmp).not.toBeNull();
                    expect(badgeCmp.label).toEqual('FlowBuilderSubflowEditor.badgeDebugOnly');
                    expect(badgeCmp.classList).toContain('slds-theme_warning');
                });
            });
            describe('data type changed', () => {
                // inputCurrencyColVar's data type is currency type in active version but is text type in latest version
                it('shows warning icon', () => {
                    const inputAssignments = getInputParameterItems(subflowElement);
                    const currencyColElement = findParameterElement(inputAssignments, 'inputCurrencyColVar');
                    const statusIcon = getWarningIcon(currencyColElement);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([
                        {
                            guid: expect.any(String),
                            messages: [
                                {
                                    guid: expect.any(String),
                                    message: 'FlowBuilderSubflowEditor.warningDataTypeChanged'
                                }
                            ],
                            sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                            title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                        }
                    ]);
                });
            });
        });
        describe('output tab', () => {
            describe('valid cases', () => {
                let outputAssignments;
                beforeAll(() => {
                    outputAssignments = getOutputParameterItems(subflowElement);
                });
                it('shows all output parameters (sorted)', () => {
                    verifyOutputParameter(
                        outputAssignments[0],
                        'inputOutputAccountColVar',
                        '{!accountSObjectCollectionVariable}'
                    );
                    verifyOutputParameter(outputAssignments[1], 'inputOutputAccountVar', '{!accountSObjectVariable}');
                    verifyOutputParameter(outputAssignments[2], 'inputOutputBoolColVar');
                    verifyOutputParameter(outputAssignments[3], 'inputOutputBoolVar', '{!booleanVariable}');
                    verifyOutputParameter(outputAssignments[4], 'inputOutputCurrencyColVar');
                    verifyOutputParameter(outputAssignments[5], 'inputOutputCurrencyVar', '{!currencyVariable}');
                    verifyOutputParameter(outputAssignments[6], 'inputOutputDateColVar');
                    verifyOutputParameter(outputAssignments[7], 'inputOutputDateTimeColVar');
                    verifyOutputParameter(outputAssignments[8], 'inputOutputDateTimeVar', '{!dateTimeVariable}');
                    verifyOutputParameter(outputAssignments[9], 'inputOutputDateVar', '{!dateVariable}');
                    verifyOutputParameter(outputAssignments[10], 'inputOutputNumberColVar');
                    // inputOutputNumberVar is duplicated and will be check in warning cases
                    verifyOutputParameter(
                        outputAssignments[13],
                        'inputOutputStringColVar',
                        '{!stringCollectionVariable1}'
                    );
                    verifyOutputParameter(outputAssignments[14], 'inputOutputStringVar', '{!stringVariable}');
                    verifyOutputParameter(outputAssignments[15], 'latestInputOutputStringColVar');
                    verifyOutputParameter(outputAssignments[16], 'latestInputOutputStringVar');
                    verifyOutputParameter(
                        outputAssignments[17],
                        'latestOutputStringColVar',
                        '{!stringCollectionVariable1}'
                    );
                    verifyOutputParameter(outputAssignments[18], 'latestOutputStringVar', '{!stringVariable}');
                    verifyOutputParameter(outputAssignments[19], 'outputAccountColVar');
                    verifyOutputParameter(outputAssignments[20], 'outputAccountVar');
                    verifyOutputParameter(outputAssignments[21], 'outputBoolColVar');
                    verifyOutputParameter(outputAssignments[22], 'outputBoolVar');
                    verifyOutputParameter(outputAssignments[23], 'outputCurrencyColVar');
                    verifyOutputParameter(outputAssignments[24], 'outputCurrencyVar');
                    verifyOutputParameter(outputAssignments[25], 'outputDateColVar');
                    verifyOutputParameter(outputAssignments[26], 'outputDateTimeColVar');
                    verifyOutputParameter(outputAssignments[27], 'outputDateTimeVar');
                    verifyOutputParameter(outputAssignments[28], 'outputDateVar');
                    // outputNotAvailableParam is not available item and will be check in warning cases
                    verifyOutputParameter(outputAssignments[30], 'outputNumberColVar');
                    verifyOutputParameter(outputAssignments[31], 'outputNumberVar');
                    verifyOutputParameter(outputAssignments[32], 'outputStringColVar');
                    verifyOutputParameter(outputAssignments[33], 'outputStringVar');
                });
                it('updates value when setting the string variable to the String Parameter', () => {
                    const stringParameterElement = findParameterElement(outputAssignments, 'outputStringVar');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!stringVariable}'));
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.outputAssignments, 'outputStringVar').value).toEqual({
                        value: getElementGuid('stringVariable'),
                        error: null
                    });
                });
                it('updates value when setting the string collection variable to the String Collection Parameter', () => {
                    const stringColParameterElement = findParameterElement(outputAssignments, 'outputStringColVar');
                    const stringColParameterCombobox = getOutputParameterComboboxElement(stringColParameterElement);
                    stringColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    stringColParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.outputAssignments, 'outputStringColVar').value).toEqual({
                        value: getElementGuid('stringCollectionVariable1'),
                        error: null
                    });
                });
                it('updates value when setting the number variable to the Number Parameter', () => {
                    const numberParameterElement = findParameterElement(outputAssignments, 'outputNumberVar');
                    const numberParameterCombobox = getOutputParameterComboboxElement(numberParameterElement);
                    numberParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.outputAssignments, 'outputNumberVar').value).toEqual({
                        value: getElementGuid('numberVariable'),
                        error: null
                    });
                });
                it('updates value when setting the number collection variable to the Number Collection Parameter', () => {
                    const numberColParameterElement = findParameterElement(outputAssignments, 'outputNumberColVar');
                    const numberColParameterCombobox = getOutputParameterComboboxElement(numberColParameterElement);
                    numberColParameterCombobox.dispatchEvent(textInputEvent('{!numberCollectionVariable}'));
                    numberColParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.outputAssignments, 'outputNumberColVar').value).toEqual({
                        value: getElementGuid('numberCollectionVariable'),
                        error: null
                    });
                });
                it('updates value when setting the dateTime variable to the Date Parameter', () => {
                    const dateParameterElement = findParameterElement(outputAssignments, 'inputOutputDateVar');
                    const dateParameterCombobox = getOutputParameterComboboxElement(dateParameterElement);
                    dateParameterCombobox.dispatchEvent(textInputEvent('{!dateTimeVariable}'));
                    dateParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.outputAssignments, 'inputOutputDateVar').value).toEqual({
                        value: getElementGuid('dateTimeVariable'),
                        error: null
                    });
                });
                it('updates value when setting the account variable to the Account Parameter', () => {
                    const accountParameterElement = findParameterElement(outputAssignments, 'outputAccountVar');
                    const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.outputAssignments, 'outputAccountVar').value).toEqual({
                        value: getElementGuid('accountSObjectVariable'),
                        error: null
                    });
                });
                it('updates value when setting the account collection variable to the Account Collection Parameter', () => {
                    const accountParameterElement = findParameterElement(outputAssignments, 'outputAccountColVar');
                    const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectCollectionVariable}'));
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(subflowElement.node.outputAssignments, 'outputAccountColVar').value).toEqual({
                        value: getElementGuid('accountSObjectCollectionVariable'),
                        error: null
                    });
                });
            });
            describe('Manually Assign Variables Checkbox Component', () => {
                test('"manuallyAssignVariablesCheckbox" component should be displayed', () => {
                    const component = getManuallyAssignVariablesCheckboxFromActionEditor(subflowElement);
                    expect(component).not.toBeNull();
                });
                test('"Manually Assign Variables" should be checked', () => {
                    const inputElement = getManuallyAssignVariablesCheckboxInputElementFromActionEditor(subflowElement);
                    expect(inputElement).toBeDefined();
                    expect(inputElement.type).toBe('checkbox');
                    expect(inputElement.checked).toBe(true);
                });
            });
            describe('error cases', () => {
                let outputAssignments;
                beforeAll(() => {
                    outputAssignments = getOutputParameterItems(subflowElement);
                });
                it('shows error when setting the litteral string to the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('any value'));
                    await ticks(1);
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                // W-5726771
                it('shows error if entering the empty string constant to the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING))
                    );
                    await ticks(1);
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('shows error if entering the number variable to the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                    await ticks(1);
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the string for the Number Parameter', async () => {
                    const numberParameterElement = findParameterElement(outputAssignments, 'inputOutputNumberVar');
                    const numberParameterCombobox = getOutputParameterComboboxElement(numberParameterElement);
                    numberParameterCombobox.dispatchEvent(textInputEvent('1234'));
                    await ticks(1);
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(numberParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('shows the error if entering the string for the Currency Parameter', async () => {
                    const currencyParameterElement = findParameterElement(outputAssignments, 'inputOutputCurrencyVar');
                    const currencyParameterCombobox = getOutputParameterComboboxElement(currencyParameterElement);
                    currencyParameterCombobox.dispatchEvent(textInputEvent('1000'));
                    await ticks(1);
                    currencyParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(currencyParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                // W-5726771
                it('shows error if entering the global constant to the Boolean Parameter', async () => {
                    const booleanParameterElement = findParameterElement(outputAssignments, 'inputOutputBoolVar');
                    const booleanParameterCombobox = getOutputParameterComboboxElement(booleanParameterElement);
                    booleanParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE))
                    );
                    await ticks(1);
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(booleanParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                // W-5726771
                it('shows the error if entering the empty string constant for the Boolean Parameter', async () => {
                    const booleanParameterElement = findParameterElement(outputAssignments, 'inputOutputBoolVar');
                    const booleanParameterCombobox = getOutputParameterComboboxElement(booleanParameterElement);
                    booleanParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING))
                    );
                    await ticks(1);
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(booleanParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('shows the error if entering the string for the Account Parameter', async () => {
                    const accountParameterElement = findParameterElement(outputAssignments, 'inputOutputAccountVar');
                    const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('any string'));
                    await ticks(1);
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(accountParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('shows the error if entering the account variable for the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                    await ticks(1);
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the collection variable for the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(outputAssignments, 'inputOutputStringVar');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    await ticks(1);
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the account variable for the Account Collection Parameter', async () => {
                    const accountColParameterElement = findParameterElement(
                        outputAssignments,
                        'inputOutputAccountColVar'
                    );
                    const sObjectColParameterCombobox = getOutputParameterComboboxElement(accountColParameterElement);
                    sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                    await ticks(1);
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the string collection variable for the Account Collection Parameter', async () => {
                    const accountColParameterElement = findParameterElement(
                        outputAssignments,
                        'inputOutputAccountColVar'
                    );
                    const sObjectColParameterCombobox = getOutputParameterComboboxElement(accountColParameterElement);
                    sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    await ticks(1);
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    await ticks(1);
                    expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
            });
            describe('warning cases', () => {
                describe('duplicated parameters', () => {
                    let numberParameterItems;
                    beforeAll(async () => {
                        const subflowElement = createComponentForTest(subflowNode, EditElementEvent.EVENT_NAME);
                        await ticks(1);
                        const outputAssignments = getOutputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(outputAssignments, 'inputOutputNumberVar');
                    });
                    it('shows duplicated Number Parameter parameters', () => {
                        expect(numberParameterItems).toHaveLength(2);
                        expect(numberParameterItems[0].item.value.value).toEqual(getElementGuid('numberVariable'));
                        expect(numberParameterItems[1].item.value.value).toEqual(getElementGuid('numberVariable'));
                    });
                    it('shows delete button', () => {
                        numberParameterItems.forEach((item) => {
                            const deleteBtn = getDeleteButton(item);
                            expect(deleteBtn.iconName).toEqual('utility:delete');
                        });
                    });
                    it('deletes duplicated parameter and update the row after deleting when clicking the delete button', async () => {
                        // delete the second Number Parameter
                        const subflowElement = createComponentForTest(subflowNode, EditElementEvent.EVENT_NAME);
                        await ticks(1);
                        let outputAssignments = getOutputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(outputAssignments, 'inputOutputNumberVar');
                        const deleteBtn = getDeleteButton(numberParameterItems[1]);
                        deleteBtn.click();
                        await ticks(1);
                        outputAssignments = getOutputParameterItems(subflowElement);
                        numberParameterItems = filterParameterElements(outputAssignments, 'inputOutputNumberVar');
                        expect(numberParameterItems).toHaveLength(1);
                        verifyOutputParameter(numberParameterItems[0], 'inputOutputNumberVar', '{!numberVariable}');
                    });
                });
                describe('not available parameters', () => {
                    let notAvailableItem;
                    beforeAll(() => {
                        const outputAssignments = getOutputParameterItems(subflowElement);
                        notAvailableItem = findParameterElement(outputAssignments, 'outputNotAvailableParam');
                    });
                    it('shows delete button', () => {
                        const deleteBtn = getDeleteButton(notAvailableItem);
                        expect(deleteBtn.iconName).toEqual('utility:delete');
                    });
                    it('does not show data type icon', () => {
                        const icon = getParameterIcon(notAvailableItem);
                        expect(icon).toBeNull();
                    });
                    it('shows warning icon', () => {
                        const statusIcon = getWarningIcon(notAvailableItem);
                        expect(statusIcon).not.toBeNull();
                        expect(statusIcon.type).toBe('warning');
                        expect(statusIcon.messages).toEqual([
                            {
                                guid: expect.any(String),
                                messages: [
                                    {
                                        guid: expect.any(String),
                                        message: 'FlowBuilderSubflowEditor.warningNotAvailable'
                                    }
                                ],
                                sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                                title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                            }
                        ]);
                    });
                    it('shows warning badge', () => {
                        const badgeCmp = getWarningBadge(notAvailableItem);
                        expect(badgeCmp).not.toBeNull();
                        expect(badgeCmp.label).toEqual('FlowBuilderSubflowEditor.badgeWillCauseErrors');
                        expect(badgeCmp.classList).toContain('slds-theme_warning');
                    });
                });
            });
            describe('variables in active version but not in latest version', () => {
                // inputOutputStringColVar is in active version but isn't in latest version
                it('shows warning icon', () => {
                    const outputAssignments = getOutputParameterItems(subflowElement);
                    const stringColElement = findParameterElement(outputAssignments, 'inputOutputStringColVar');
                    const statusIcon = getWarningIcon(stringColElement);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([
                        {
                            guid: expect.any(String),
                            messages: [
                                {
                                    guid: expect.any(String),
                                    message: 'FlowBuilderSubflowEditor.warningActiveOnly'
                                }
                            ],
                            sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                            title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                        }
                    ]);
                });
            });
            describe('variables in latest version but not in active version', () => {
                // latestInputOutputStringColVar is in latest version but isn't in active version
                let stringColElement;
                beforeAll(() => {
                    const outputAssignments = getOutputParameterItems(subflowElement);
                    stringColElement = findParameterElement(outputAssignments, 'latestInputOutputStringColVar');
                });
                it('shows warning icon', () => {
                    const statusIcon = getWarningIcon(stringColElement);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([
                        {
                            guid: expect.any(String),
                            messages: [
                                {
                                    guid: expect.any(String),
                                    message: 'FlowBuilderSubflowEditor.warningLatestOnly'
                                }
                            ],
                            sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                            title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                        }
                    ]);
                });
                it('shows warning badge', () => {
                    const badgeCmp = getWarningBadge(stringColElement);
                    expect(badgeCmp).not.toBeNull();
                    expect(badgeCmp.label).toEqual('FlowBuilderSubflowEditor.badgeDebugOnly');
                    expect(badgeCmp.classList).toContain('slds-theme_warning');
                });
            });
            describe('data type changed', () => {
                // inputOutputAccountVar's object type is Account in active version but is Case in latest version
                it('shows warning icon', () => {
                    const outputAssignments = getOutputParameterItems(subflowElement);
                    const accountElement = findParameterElement(outputAssignments, 'inputOutputAccountVar');
                    const statusIcon = getWarningIcon(accountElement);
                    expect(statusIcon).not.toBeNull();
                    expect(statusIcon.type).toBe('warning');
                    expect(statusIcon.messages).toEqual([
                        {
                            guid: expect.any(String),
                            messages: [
                                {
                                    guid: expect.any(String),
                                    message: 'FlowBuilderSubflowEditor.warningDataTypeChanged'
                                }
                            ],
                            sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                            title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                        }
                    ]);
                });
            });
        });
    });
});
