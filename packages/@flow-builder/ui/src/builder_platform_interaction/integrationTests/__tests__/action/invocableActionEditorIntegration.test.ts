import { createElement } from 'lwc';
import InvocableActionEditor from 'builder_platform_interaction/invocableActionEditor';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import {
    ticks,
    focusoutEvent,
    textInputEvent,
    blurEvent,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { resetState, setupStateForFlow } from '../integrationTestUtils';
import { getLabelDescriptionNameElement, getLabelDescriptionLabelElement } from '../labelDescriptionTestUtils';
import {
    VALIDATION_ERROR_MESSAGES,
    getBaseCalloutElement,
    getInputParameterItems,
    getOutputParameterItemsFromAcc,
    getInputParameterComboboxElement,
    getOutputParameterComboboxElement,
    getLightningInputToggle,
    getDeleteButton,
    getParameterIcon,
    getWarningIcon,
    getWarningBadge,
    toggleChangeEvent,
    verifyRequiredInputParameter,
    verifyOptionalInputParameterWithValue,
    verifyOptionalInputParameterNoValue,
    verifyOutputParameter,
    getParameter,
    findParameterElement,
    filterParameterElements,
    findIndex,
    getElementGuid
} from '../baseCalloutEditorTestUtils';

const createComponentForTest = (node, { isNewMode = false } = {}) => {
    const el = createElement('builder_platform_interaction-invocable-action-editor', { is: InvocableActionEditor });
    Object.assign(el, { node, isNewMode });
    setDocumentBodyChildren(el);
    return el;
};

describe('Invocable Action Editor', () => {
    let actionNode;
    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
    });
    afterAll(() => {
        resetState();
    });
    describe('Flow with an apex action with all types', () => {
        let coreActionElement;
        beforeEach(() => {
            const element = getElementByDevName('allTypesApexAction');
            actionNode = getElementForPropertyEditor(element);
        });
        describe('name and dev name', () => {
            beforeEach(() => {
                coreActionElement = createComponentForTest(actionNode, {
                    isNewMode: true
                });
            });
            it('does not change devName if it already exists after the user modifies the name', async () => {
                const newLabel = 'new label';
                const labelInput = getLabelDescriptionLabelElement(getBaseCalloutElement(coreActionElement));
                labelInput.value = newLabel;
                labelInput.dispatchEvent(focusoutEvent);
                await ticks();
                expect(coreActionElement.node.label.value).toBe(newLabel);
                expect(coreActionElement.node.name.value).toBe('allTypesApexAction');
            });
            it('modifies the dev name', async () => {
                const newDevName = 'newName';
                const devNameInput = getLabelDescriptionNameElement(getBaseCalloutElement(coreActionElement));
                devNameInput.value = newDevName;
                devNameInput.dispatchEvent(focusoutEvent);
                await ticks();
                expect(coreActionElement.node.name.value).toBe(newDevName);
            });
            it('displays error if name is cleared', async () => {
                const newLabel = '';
                const labelInput = getLabelDescriptionLabelElement(getBaseCalloutElement(coreActionElement));
                labelInput.value = newLabel;
                labelInput.dispatchEvent(focusoutEvent);
                await ticks();
                expect(coreActionElement.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
            it('displays error if devName is cleared', async () => {
                const newDevName = '';
                const devNameInput = getLabelDescriptionNameElement(getBaseCalloutElement(coreActionElement));
                devNameInput.value = newDevName;
                devNameInput.dispatchEvent(focusoutEvent);
                await ticks();
                expect(coreActionElement.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
        });
        describe('input div', () => {
            describe('valid cases', () => {
                let inputParameters;
                beforeEach(async () => {
                    coreActionElement = createComponentForTest(actionNode);
                    await ticks();
                    inputParameters = getInputParameterItems(coreActionElement);
                });
                it('shows all input parameters', () => {
                    // required parameters: Account Parameter and String Parameter
                    verifyRequiredInputParameter(inputParameters[0], 'Account Parameter', '{!accountSObjectVariable}');
                    verifyRequiredInputParameter(inputParameters[1], 'Id Parameter', '{!stringVariable}');
                    verifyRequiredInputParameter(inputParameters[2], 'String Parameter', '{!stringVariable}');
                    // optional parameters: Account Collection Parameter (no value),
                    // Date Collection Parameter (no value), Date Parameter (no
                    // value), Number Collection Parameter (no value), Number
                    // Parameter (with value), String Collection Parameter (no
                    // value)
                    verifyOptionalInputParameterNoValue(inputParameters[3], 'Account Collection Parameter');
                    verifyOptionalInputParameterNoValue(inputParameters[4], 'Boolean Collection Parameter');
                    verifyOptionalInputParameterNoValue(inputParameters[5], 'Boolean Parameter');
                    verifyOptionalInputParameterNoValue(inputParameters[6], 'Date Collection Parameter');
                    verifyOptionalInputParameterNoValue(inputParameters[7], 'Date Parameter');
                    verifyOptionalInputParameterNoValue(inputParameters[8], 'Number Collection Parameter');
                    verifyOptionalInputParameterWithValue(inputParameters[9], 'Number Parameter', '{!numberVariable}');
                    verifyOptionalInputParameterNoValue(inputParameters[10], 'String Collection Parameter');
                });
                it('updates value when setting the litteral string to the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    await ticks();
                    stringParameterCombobox.dispatchEvent(textInputEvent('any value'));
                    await ticks();
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(coreActionElement.node.inputParameters, 'stringParam').value).toEqual({
                        value: 'any value',
                        error: null
                    });
                });
                it('updates value when setting the variable number to the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                    await ticks();
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(getParameter(coreActionElement.node.inputParameters, 'stringParam').value).toEqual({
                        value: getElementGuid('numberVariable'),
                        error: null
                    });
                });
                it('updates value when setting the empty string constant to the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    await ticks();
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING))
                    );
                    await ticks();
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(coreActionElement.node.inputParameters, 'stringParam').value).toEqual({
                        value: GLOBAL_CONSTANTS.EMPTY_STRING,
                        error: null
                    });
                });
                it('updates value when setting the valid number to the Number Parameter', async () => {
                    const numberParameterElement = findParameterElement(inputParameters, 'numberParam');
                    const numberParameterCombobox = getInputParameterComboboxElement(numberParameterElement);
                    await ticks();
                    numberParameterCombobox.dispatchEvent(textInputEvent('1234'));
                    await ticks();
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    expect(getParameter(coreActionElement.node.inputParameters, 'numberParam').value).toEqual({
                        value: '1234',
                        error: null
                    });
                });
                it('updates value when setting the date variable to the Date Parameter', async () => {
                    const dateParameterElement = findParameterElement(inputParameters, 'dateParam');
                    const toggle = getLightningInputToggle(dateParameterElement);
                    await ticks();
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    const dateParameterCombobox = getInputParameterComboboxElement(dateParameterElement);
                    dateParameterCombobox.dispatchEvent(textInputEvent('{!dateVariable}'));
                    await ticks();
                    dateParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(getParameter(coreActionElement.node.inputParameters, 'dateParam').value).toEqual({
                        value: getElementGuid('dateVariable'),
                        error: null
                    });
                });
                it('updates value when setting the global constant to the Boolean Parameter', async () => {
                    const booleanParameterElement = findParameterElement(inputParameters, 'booleanParam');
                    const toggle = getLightningInputToggle(booleanParameterElement);
                    await ticks();
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    await ticks();
                    const booleanParameterCombobox = getInputParameterComboboxElement(booleanParameterElement);
                    booleanParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE))
                    );
                    await ticks();
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(getParameter(coreActionElement.node.inputParameters, 'booleanParam').value).toEqual({
                        value: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
                        error: null
                    });
                });
                it('shows combobox when toggle is active', async () => {
                    const accountColParameterElement = findParameterElement(inputParameters, 'accountColParam');
                    const toggle = getLightningInputToggle(accountColParameterElement);
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    await ticks();
                    verifyOptionalInputParameterWithValue(
                        accountColParameterElement,
                        'Account Collection Parameter',
                        ''
                    );
                });
                it('hides combobox when toggle is deactive', async () => {
                    const numberParamElement = findParameterElement(inputParameters, 'numberParam');
                    const toggle = getLightningInputToggle(numberParamElement);
                    toggle.dispatchEvent(toggleChangeEvent(false));
                    await ticks();
                    verifyOptionalInputParameterNoValue(numberParamElement, 'Number Parameter');
                });
                it('preserves value when toggle is reactive', async () => {
                    const numberParamElement = findParameterElement(inputParameters, 'numberParam');
                    const toggle = getLightningInputToggle(numberParamElement);
                    toggle.dispatchEvent(toggleChangeEvent(false));
                    await ticks();
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    await ticks();
                    verifyOptionalInputParameterWithValue(numberParamElement, 'Number Parameter', '{!numberVariable}');
                });
            });
            describe('error cases', () => {
                let inputParameters;
                beforeEach(async () => {
                    coreActionElement = createComponentForTest(actionNode);
                    await ticks();
                    inputParameters = getInputParameterItems(coreActionElement);
                });
                it('shows the error if clearing the value of required input parameter', async () => {
                    const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent(''));
                    await ticks();
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
                });
                it('shows the error if entering the string for the Number Parameter', async () => {
                    const numberParameterElement = findParameterElement(inputParameters, 'numberParam');
                    const numberParameterCombobox = getInputParameterComboboxElement(numberParameterElement);
                    numberParameterCombobox.dispatchEvent(textInputEvent('invalidNumber'));
                    await ticks();
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(numberParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.NUMBER_ERROR_MESSAGE);
                });
                it('shows the error if entering the string for the Account Parameter', async () => {
                    const accountParameterElement = findParameterElement(inputParameters, 'accountParam');
                    const accountParameterCombobox = getInputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('any string'));
                    await ticks();
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(accountParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('shows the error if entering the collection variable for the String Parameter', async () => {
                    const stringParameterElement = findParameterElement(inputParameters, 'stringParam');
                    const stringParameterCombobox = getInputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    await ticks();
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the string collection variable for the Account Collection Parameter', async () => {
                    const accountColParameterElement = findParameterElement(inputParameters, 'accountColParam');
                    const toggle = getLightningInputToggle(accountColParameterElement);
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    await ticks();
                    const sObjectColParameterCombobox = getInputParameterComboboxElement(accountColParameterElement);
                    sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    await ticks();
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the empty string constant for the Boolean Parameter', async () => {
                    const booleanParameterElement = findParameterElement(inputParameters, 'booleanParam');
                    const toggle = getLightningInputToggle(booleanParameterElement);
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    await ticks();
                    const booleanParameterCombobox = getInputParameterComboboxElement(booleanParameterElement);
                    booleanParameterCombobox.dispatchEvent(
                        textInputEvent(addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING))
                    );
                    await ticks();
                    booleanParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(booleanParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
            });
            describe('warning cases', () => {
                describe('duplicated parameters', () => {
                    const duplicatedNumberParam = {
                        rowIndex: '1385gj76-8954-0j89-87d4-7934b8u45l09',
                        name: { value: 'numberParam', error: null },
                        value: { value: '123', error: null },
                        valueDataType: 'number'
                    };
                    let inputParameters, numberParameterItems;
                    beforeEach(async () => {
                        if (findIndex(actionNode.inputParameters, duplicatedNumberParam.rowIndex) === -1) {
                            actionNode.inputParameters.push(duplicatedNumberParam);
                        }
                        coreActionElement = createComponentForTest(actionNode);
                        await ticks();
                        inputParameters = getInputParameterItems(coreActionElement);
                        numberParameterItems = filterParameterElements(inputParameters, 'numberParam');
                    });
                    afterEach(() => {
                        const index = findIndex(actionNode.inputParameters, duplicatedNumberParam.rowIndex);
                        if (index !== -1) {
                            actionNode.inputParameters.splice(index, 1);
                        }
                    });
                    it('shows duplicated Number Parameter parameters', () => {
                        expect(numberParameterItems).toHaveLength(2);
                    });
                    it('shows delete button', () => {
                        numberParameterItems.forEach((item) => {
                            const deleteBtn = getDeleteButton(item);
                            expect(deleteBtn.iconName).toEqual('utility:delete');
                        });
                    });
                    it('deletes duplicated parameter and update the row after deleting when clicking the delete button', async () => {
                        // delete the second Number Parameter
                        const deleteBtn = getDeleteButton(numberParameterItems[1]);
                        deleteBtn.click();
                        await ticks();
                        inputParameters = getInputParameterItems(coreActionElement);
                        numberParameterItems = filterParameterElements(inputParameters, 'numberParam');
                        expect(numberParameterItems).toHaveLength(1);
                        verifyOptionalInputParameterWithValue(
                            numberParameterItems[0],
                            'Number Parameter',
                            '{!numberVariable}'
                        );
                    });
                });
                describe('not available parameters', () => {
                    const notAvailableParam = {
                        rowIndex: '1385gj76-8954-0j89-87d4-7934b8u45l09',
                        name: { value: 'notAvailableParam', error: null },
                        value: { value: '123', error: null },
                        valueDataType: 'number'
                    };
                    let notAvailableItem;
                    beforeEach(async () => {
                        if (findIndex(actionNode.inputParameters, notAvailableParam.rowIndex) === -1) {
                            actionNode.inputParameters.push(notAvailableParam);
                        }
                        const coreActionElement = createComponentForTest(actionNode);
                        await ticks();
                        const inputParameters = getInputParameterItems(coreActionElement);
                        notAvailableItem = findParameterElement(inputParameters, 'notAvailableParam');
                    });
                    afterEach(() => {
                        const index = findIndex(actionNode.inputParameters, notAvailableParam.rowIndex);
                        if (index !== -1) {
                            actionNode.inputParameters.splice(index, 1);
                        }
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
                                        message: 'FlowBuilderInvocableActionEditor.warningNotAvailable'
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
                        expect(badgeCmp.label).toEqual('FlowBuilderInvocableActionEditor.badgeWillCauseErrors');
                        expect(badgeCmp.classList).toContain('slds-theme_warning');
                    });
                });
            });
        });
        describe('output div', () => {
            describe('valid cases', () => {
                let outputParameters;
                beforeEach(async () => {
                    coreActionElement = createComponentForTest(actionNode);
                    await ticks();
                    outputParameters = getOutputParameterItemsFromAcc(coreActionElement);
                });
                it('shows all output parameters', () => {
                    // output parameters: Output Account Parameter, Output Account
                    // Collection Parameter, Output Date Collection Parameter,
                    // Output Date Parameter, Output Number Collection Parameter,
                    // Output Number Parameter, Output String Collection Parameter,
                    // Output String Parameter
                    verifyOutputParameter(outputParameters[0], 'Output Account Collection Parameter', null);
                    verifyOutputParameter(outputParameters[1], 'Output Account Parameter', null);
                    verifyOutputParameter(outputParameters[2], 'Output Date Collection Parameter', null);
                    verifyOutputParameter(outputParameters[3], 'Output Date Parameter', null);
                    verifyOutputParameter(outputParameters[4], 'Output Number Collection Parameter', null);
                    verifyOutputParameter(outputParameters[5], 'Output Number Parameter', '{!numberVariable}');
                    verifyOutputParameter(outputParameters[6], 'Output String Collection Parameter', null);
                    verifyOutputParameter(outputParameters[7], 'Output String Parameter', '{!stringVariable}');
                });
                it('updates value when setting the string variable to the Output String Parameter', async () => {
                    const stringParameterElement = findParameterElement(outputParameters, 'outputStringParam');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!stringVariable}'));
                    await ticks();
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(getParameter(coreActionElement.node.outputParameters, 'outputStringParam').value).toEqual({
                        value: getElementGuid('stringVariable'),
                        error: null
                    });
                });
                it('updates value when setting the number variable to the Output Number Parameter', async () => {
                    const numberParameterElement = findParameterElement(outputParameters, 'outputNumberParam');
                    const numberParameterCombobox = getOutputParameterComboboxElement(numberParameterElement);
                    numberParameterCombobox.dispatchEvent(textInputEvent('{!numberVariable}'));
                    await ticks();
                    numberParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(getParameter(coreActionElement.node.outputParameters, 'outputNumberParam').value).toEqual({
                        value: getElementGuid('numberVariable'),
                        error: null
                    });
                });
                it('updates value when setting the account variable to the Output Account Parameter', async () => {
                    const accountParameterElement = findParameterElement(outputParameters, 'outputAccountParam');
                    const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectVariable}'));
                    await ticks();
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(getParameter(coreActionElement.node.outputParameters, 'outputAccountParam').value).toEqual({
                        value: getElementGuid('accountSObjectVariable'),
                        error: null
                    });
                });
                it('updates value when setting the account collection variable to the Output Account Collection Parameter', async () => {
                    const accountColParameterElement = findParameterElement(outputParameters, 'outputAccountColParam');
                    const accountColParameterCombobox = getOutputParameterComboboxElement(accountColParameterElement);
                    accountColParameterCombobox.dispatchEvent(textInputEvent('{!accountSObjectCollectionVariable}'));
                    await ticks();
                    accountColParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(
                        getParameter(coreActionElement.node.outputParameters, 'outputAccountColParam').value
                    ).toEqual({
                        value: getElementGuid('accountSObjectCollectionVariable'),
                        error: null
                    });
                });
            });
            describe('error cases', () => {
                let outputParameters;
                beforeEach(async () => {
                    const coreActionElement = createComponentForTest(actionNode);
                    await ticks();
                    outputParameters = getOutputParameterItemsFromAcc(coreActionElement);
                });
                it('shows the error if entering the litteral string for the Output String Parameter', async () => {
                    const stringParameterElement = findParameterElement(outputParameters, 'outputStringParam');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('any string'));
                    await ticks();
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.GENERIC);
                });
                it('shows the error if entering the string variable for the Output Account Parameter', async () => {
                    const accountParameterElement = findParameterElement(outputParameters, 'outputAccountParam');
                    const accountParameterCombobox = getOutputParameterComboboxElement(accountParameterElement);
                    accountParameterCombobox.dispatchEvent(textInputEvent('{!stringVariable}'));
                    await ticks();
                    accountParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(accountParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the collection variable for the Output String Parameter', async () => {
                    const stringParameterElement = findParameterElement(outputParameters, 'outputStringParam');
                    const stringParameterCombobox = getOutputParameterComboboxElement(stringParameterElement);
                    stringParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    await ticks();
                    stringParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(stringParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
                it('shows the error if entering the string collection variable for the Output Account Collection Parameter', async () => {
                    const accountColParameterElement = findParameterElement(outputParameters, 'outputAccountColParam');
                    const sObjectColParameterCombobox = getOutputParameterComboboxElement(accountColParameterElement);
                    sObjectColParameterCombobox.dispatchEvent(textInputEvent('{!stringCollectionVariable1}'));
                    await ticks();
                    sObjectColParameterCombobox.dispatchEvent(blurEvent);
                    await ticks();
                    expect(sObjectColParameterCombobox.validity).toEqual(VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE);
                });
            });
            describe('warning cases', () => {
                describe('duplicated parameters', () => {
                    const duplicatedNumberParam = {
                        rowIndex: '1385gj76-8954-0j89-87d4-7934b8u45l09',
                        name: { value: 'outputNumberParam', error: null },
                        value: { value: '123', error: null },
                        valueDataType: 'number'
                    };
                    let outputParameters, numberParameterItems;
                    beforeEach(async () => {
                        if (findIndex(actionNode.outputParameters, duplicatedNumberParam.rowIndex) === -1) {
                            actionNode.outputParameters.push(duplicatedNumberParam);
                        }
                        coreActionElement = createComponentForTest(actionNode);
                        await ticks();
                        outputParameters = getOutputParameterItemsFromAcc(coreActionElement);
                        numberParameterItems = filterParameterElements(outputParameters, 'outputNumberParam');
                    });
                    afterEach(() => {
                        const index = findIndex(actionNode.outputParameters, duplicatedNumberParam.rowIndex);
                        if (index !== -1) {
                            actionNode.outputParameters.splice(index, 1);
                        }
                    });
                    it('shows duplicated Number Parameter parameters', () => {
                        expect(numberParameterItems).toHaveLength(2);
                    });
                    it('shows delete button', () => {
                        numberParameterItems.forEach((item) => {
                            const deleteBtn = getDeleteButton(item);
                            expect(deleteBtn.iconName).toEqual('utility:delete');
                        });
                    });
                    it('deletes duplicated parameter and update the row after deleting when clicking the delete button', async () => {
                        // delete the second Number Parameter
                        const deleteBtn = getDeleteButton(numberParameterItems[1]);
                        deleteBtn.click();
                        await ticks();
                        outputParameters = getOutputParameterItemsFromAcc(coreActionElement);
                        numberParameterItems = filterParameterElements(outputParameters, 'outputNumberParam');
                        expect(numberParameterItems).toHaveLength(1);
                        verifyOutputParameter(numberParameterItems[0], 'Output Number Parameter', '{!numberVariable}');
                    });
                });
                describe('not available parameters', () => {
                    const notAvailableParam = {
                        rowIndex: '1385gj76-8954-0j89-87d4-7934b8u45l09',
                        name: { value: 'notAvailableParam', error: null },
                        value: { value: '123', error: null },
                        valueDataType: 'number'
                    };
                    let notAvailableItem;
                    beforeEach(async () => {
                        if (findIndex(actionNode.inputParameters, notAvailableParam.rowIndex) === -1) {
                            actionNode.outputParameters.push(notAvailableParam);
                        }
                        const coreActionElement = createComponentForTest(actionNode);
                        await ticks();
                        const outputParameters = getOutputParameterItemsFromAcc(coreActionElement);
                        notAvailableItem = findParameterElement(outputParameters, 'notAvailableParam');
                    });
                    afterEach(() => {
                        const index = findIndex(actionNode.outputParameters, notAvailableParam.rowIndex);
                        if (index !== -1) {
                            actionNode.outputParameters.splice(index, 1);
                        }
                    });
                    it('shows delete button', () => {
                        const deleteBtn = getDeleteButton(notAvailableItem);
                        expect(deleteBtn.iconName).toEqual('utility:delete');
                    });
                    it('does not show data type icon', () => {
                        const parameterIcon = getParameterIcon(notAvailableItem);
                        expect(parameterIcon).toBeNull();
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
                                        message: 'FlowBuilderInvocableActionEditor.warningNotAvailable'
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
                        expect(badgeCmp.label).toEqual('FlowBuilderInvocableActionEditor.badgeWillCauseErrors');
                        expect(badgeCmp.classList).toContain('slds-theme_warning');
                    });
                });
            });
        });
    });
    describe('Flow with an action that has a text collection input parameter set to a text collection variable', () => {
        beforeEach(() => {
            const element = getElementByDevName('submitForApproval');
            actionNode = getElementForPropertyEditor(element);
        });
        it('has no error for this input parameter', async () => {
            // See W-5715080
            const propertyEditor = createComponentForTest(actionNode);
            await ticks(50);
            const errors = propertyEditor.validate();
            expect(errors).toEqual([]);
        });
    });
});
