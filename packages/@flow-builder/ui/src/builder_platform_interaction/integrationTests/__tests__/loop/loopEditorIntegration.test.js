import { createElement } from 'lwc';
import LoopEditor from 'builder_platform_interaction/loopEditor';
import * as autolaunchedFlow from 'mock/flows/autolaunchedFlow.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { resetState, setupStateForProcessType, translateFlowToUIAndDispatch } from '../integrationTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    ticks,
    blurEvent,
    focusoutEvent,
    textInputEvent
} from 'builder_platform_interaction/builderTestUtils';
import { getLabelDescriptionLabelElement, getLabelDescriptionNameElement } from '../labelDescriptionTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS,
    COLLECTION_VARIABLE: '.test-loop-collection',
    LOOP_VARIABLE: '.test-loop-variable',
    SLDS_SCOPED_NOTIFICATION: '.slds-scoped-notification'
};

/**
 * Error message map for validation of literal value.
 *
 * Note that some of the labels here are not the actual labels, but rather the '<section_name.key_name>'.
 * This is due to the fact that we are importing labels via a Global Value
 * Provider (GVP) and the test runner returns default values for those imports.
 * See the following for more info:
 *
 * http://raptor.sfdc.es/guide/testing-core.html#Handling-GVP-Imports
 */
const VALIDATION_ERROR_MESSAGES = {
    GENERIC: 'FlowBuilderCombobox.genericErrorMessage',
    DATATYPE_MISMATCH: 'FlowBuilderLoopEditor.loopVariableErrorMessage',
    CANNOT_BE_BLANK: 'FlowBuilderValidation.cannotBeBlank'
};

const newLoopElement = {
    locationX: 88,
    locationY: 268,
    elementType: 'Loop',
    isNewElement: true
};

const createComponentForTest = (node, processType = FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW) => {
    const el = createElement('builder_platform_interaction-loop-editor', {
        is: LoopEditor
    });
    Object.assign(el, { node, processType });
    document.body.appendChild(el);
    return el;
};

const getLoopVariableComboboxElement = loopEditor => {
    return deepQuerySelector(loopEditor, [
        SELECTORS.LOOP_VARIABLE,
        SELECTORS.BASE_RESOURCE_PICKER,
        SELECTORS.INTERACTION_COMBOBOX,
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

const getNotificationDiv = loopEditor => {
    return deepQuerySelector(loopEditor, [SELECTORS.SLDS_SCOPED_NOTIFICATION]);
};

const getLoopVariableResourcePicker = loopEditor => {
    return loopEditor.shadowRoot.querySelector(SELECTORS.LOOP_VARIABLE);
};

const getCollectionVariableComboboxElement = loopEditor => {
    return deepQuerySelector(loopEditor, [
        SELECTORS.COLLECTION_VARIABLE,
        SELECTORS.BASE_RESOURCE_PICKER,
        SELECTORS.INTERACTION_COMBOBOX,
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

describe('Loop Editor with processType does not support automatic output', () => {
    let loopElement;
    let store;
    let loopNode;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE);
        translateFlowToUIAndDispatch(fieldServiceMobileFlow, store);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(async () => {
        const loopNodeEmpty = getElementForPropertyEditor(newLoopElement);
        loopElement = createComponentForTest(loopNodeEmpty, FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE);
        await ticks(50);
    });
    describe('Adding new element', () => {
        it('loop variable is disabled when creating a new loop', async () => {
            await ticks(50);
            // collection variable is enabled
            const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
            expect(colVariableLightningCombobox.disabled).toBeFalsy();
            // loop variable is disabled initially when a new loop is
            // created
            const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
            expect(loopVariableLightningCombobox.disabled).toBeTruthy();
        });
        it('loop variable is enabled after the collection variable is set to a valid value', async () => {
            const vAccounts = getElementByDevName('vAccounts');
            const colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
            colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + vAccounts.name + '}'));
            await ticks(50);
            colVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            // loop variable should be enabled now
            const loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
            expect(loopVariableLightningCombobox.disabled).toBeFalsy();
        });
    });
    describe('Existing element', () => {
        let vMyTestAccount, loopVariableLightningCombobox, colVariableLightningCombobox;
        beforeEach(async () => {
            const element = getElementByDevName('myLoopOnAccount');
            loopNode = getElementForPropertyEditor(element);
            loopElement = createComponentForTest(loopNode);
            await ticks(50);
            vMyTestAccount = getElementByDevName('vMyTestAccount');
            loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
            colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
        });
        it('is correctly loaded, with no error, for an existing loop', () => {
            expect(loopVariableLightningCombobox.inputText).toBe('{!' + vMyTestAccount.name + '}');
            expect(loopVariableLightningCombobox.validity).toBeFalsy();
        });
        it('it disabled after the collection variable is set to an invalid value', async () => {
            colVariableLightningCombobox.dispatchEvent(textInputEvent('nonExistentVariable'));
            colVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            // loop variable should be still disabled
            loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
            expect(loopVariableLightningCombobox.disabled).toBeTruthy();
        });
        it('becomes disabled after the collection variable is set from a valid value to an invalid one', async () => {
            // first check that the loop variable is enabled
            expect(loopVariableLightningCombobox.disabled).toBeFalsy();
            colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
            colVariableLightningCombobox.dispatchEvent(textInputEvent('nonExistentVariable'));
            colVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            // loop variable should be disabled now
            expect(loopVariableLightningCombobox.disabled).toBeTruthy();
        });
        it('loop variable text box is not displayed', () => {
            expect(loopVariableLightningCombobox).not.toBeNull();
        });
        it('notification info should not be visible', () => {
            expect(getNotificationDiv(loopElement)).toBeNull();
        });
    });
});

describe('Loop Editor with processType supporting automatic output', () => {
    let store;
    let loopNode;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
        translateFlowToUIAndDispatch(autolaunchedFlow, store);
    });
    afterAll(() => {
        resetState();
    });
    describe('name and dev name', () => {
        let loopElement;
        beforeEach(async () => {
            const element = getElementByDevName('loopAccountAutomaticOutput');
            loopNode = getElementForPropertyEditor(element);
            loopElement = createComponentForTest(loopNode);
            await ticks(50);
        });
        it('do not change devName if it already exists after the user modifies the name', async () => {
            const newLabel = 'new label';
            await ticks(50);
            const labelInput = getLabelDescriptionLabelElement(loopElement);
            labelInput.value = newLabel;
            labelInput.dispatchEvent(focusoutEvent);
            await ticks(50);
            expect(loopElement.node.label.value).toBe(newLabel);
        });
        it('modify the dev name', async () => {
            const newDevName = 'newName';
            await ticks(50);
            const devNameInput = getLabelDescriptionNameElement(loopElement);
            devNameInput.value = newDevName;
            devNameInput.dispatchEvent(focusoutEvent);
            await ticks(50);
            expect(loopElement.node.name.value).toBe(newDevName);
        });
        it('displays error if name is cleared', async () => {
            const newLabel = '';
            await ticks(50);
            const labelInput = getLabelDescriptionLabelElement(loopElement);
            labelInput.value = newLabel;
            labelInput.dispatchEvent(focusoutEvent);
            await ticks(50);
            expect(loopElement.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
        it('displays error if devName is cleared', async () => {
            const newDevName = '';
            await ticks(50);
            const devNameInput = getLabelDescriptionNameElement(loopElement);
            devNameInput.value = newDevName;
            devNameInput.dispatchEvent(focusoutEvent);
            await ticks(50);
            expect(loopElement.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
    });
    describe('Add new element - automatic output supported', () => {
        let loopElement;
        beforeEach(async () => {
            const loopNodeEmpty = getElementForPropertyEditor(newLoopElement);
            loopElement = createComponentForTest(loopNodeEmpty);
            await ticks(50);
        });
        it('loop variable is no visible', async () => {
            const loopVariableLightningCombobox = getLoopVariableResourcePicker(loopElement);
            expect(loopVariableLightningCombobox).toBeNull();
        });
        it('notification info should be visible', () => {
            expect(getNotificationDiv(loopElement)).not.toBeNull();
        });
    });
    describe('element from the store - exist before', () => {
        let loopElement,
            textVariable,
            loopVariableLightningCombobox,
            colVariableLightningCombobox,
            accounts,
            textCollection;
        beforeEach(async () => {
            accounts = getElementByDevName('accounts');
            textCollection = getElementByDevName('textCollection');
            const element = getElementByDevName('loopOnTextCollection');
            loopNode = getElementForPropertyEditor(element);
            loopElement = createComponentForTest(loopNode);
            await ticks(50);
            textVariable = getElementByDevName('textVariable');
            loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
            colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
        });
        describe('loop variable', () => {
            it('is correctly loaded, with no error, for an existing loop', () => {
                expect(loopVariableLightningCombobox.inputText).toBe('{!' + textVariable.name + '}');
                expect(loopVariableLightningCombobox.validity).toBeFalsy();
            });
            it('it disabled after the collection variable is set to an invalid value', async () => {
                colVariableLightningCombobox.dispatchEvent(textInputEvent('nonExistentVariable'));
                colVariableLightningCombobox.dispatchEvent(blurEvent);
                await ticks(50);
                // loop variable should be still disabled
                loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
                expect(loopVariableLightningCombobox.disabled).toBeTruthy();
            });
            it('becomes disabled after the collection variable is set from a valid value to an invalid one', async () => {
                // first check that the loop variable is enabled
                expect(loopVariableLightningCombobox.disabled).toBeFalsy();
                colVariableLightningCombobox = getCollectionVariableComboboxElement(loopElement);
                colVariableLightningCombobox.dispatchEvent(textInputEvent('nonExistentVariable'));
                colVariableLightningCombobox.dispatchEvent(blurEvent);
                await ticks(50);
                // loop variable should be disabled now
                expect(loopVariableLightningCombobox.disabled).toBeTruthy();
            });
        });
        it('shows an error if the user deletes the value of the variable', async () => {
            loopVariableLightningCombobox.dispatchEvent(textInputEvent(''));
            await ticks(50);
            loopVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            expect(loopVariableLightningCombobox.inputText).toBe('');
            expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
        it('is correctly loaded, with no error, for an existing loop', () => {
            expect(colVariableLightningCombobox.inputText).toBe('{!' + textCollection.name + '}');
            expect(colVariableLightningCombobox.validity).toBeFalsy();
        });
        it('shows an error when its data type is different from the data type in the collection variable', async () => {
            await ticks(50);
            // Switch collection variable from a string type variable
            // to a sObject type variable
            colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + accounts.name + '}'));
            await ticks(50);
            colVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            // loop variable should keep the previous value but
            // show a data mismatch error
            expect(loopVariableLightningCombobox.inputText).toBe('{!' + textVariable.name + '}');
            expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);
        });
        it('shows only sObject variables of the same type as the sObject selected in the collection variable', async () => {
            const accountVariable = getElementByDevName('accountVariable');
            colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + accounts.name + '}'));
            await ticks(50);
            colVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);

            expect(loopVariableLightningCombobox.items).toHaveLength(3);
            expect(loopVariableLightningCombobox.items[1].label).toBe('FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL');
            expect(loopVariableLightningCombobox.items[1].items).toHaveLength(3);
            expect(loopVariableLightningCombobox.items[1].items[0]).toMatchObject({
                dataType: 'SObject',
                subtype: 'Account',
                text: accountVariable.name,
                subText: 'Account',
                displayText: `{!${accountVariable.name}}`,
                value: accountVariable.guid
            });
        });
        it('updates the display text after the user changes the value of the variable to another valid value', async () => {
            colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + textCollection.name + '}'));
            await ticks(50);
            colVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            expect(colVariableLightningCombobox.inputText).toBe('{!' + textCollection.name + '}');
            expect(colVariableLightningCombobox.validity).toBeFalsy();
        });
        it('shows only variables of the same type as the collection variable', async () => {
            const stringVariable = getElementByDevName('stringVariable');
            // initially the loop variable has only the "New
            // Resource" in the menu data
            expect(loopVariableLightningCombobox.items).toHaveLength(2);
            colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + textCollection.name + '}'));
            colVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            // loop variable should only show variables with
            // dataType of String
            expect(loopVariableLightningCombobox.items).toHaveLength(2);
            expect(loopVariableLightningCombobox.items[1].label).toBe('FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL');
            expect(loopVariableLightningCombobox.items[1].items).toHaveLength(2);
            expect(loopVariableLightningCombobox.items[1].items[0]).toMatchObject({
                text: stringVariable.name,
                displayText: '{!' + stringVariable.name + '}',
                value: stringVariable.guid
            });
            expect(loopVariableLightningCombobox.items[1].items[1]).toMatchObject({
                text: textVariable.name,
                displayText: '{!' + textVariable.name + '}',
                value: textVariable.guid
            });
        });
        it('maintains a datatype mismatch error after the user clicks in and out of the box - W-5143108', async () => {
            // Switch collection variable from a string type variable
            // to a sObject type variable
            colVariableLightningCombobox.dispatchEvent(textInputEvent('{!' + accounts.name + '}'));
            colVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            // loop variable shows a data type mismatch error
            expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);

            // The error is still there after the user clicks
            // outside the combobox
            loopVariableLightningCombobox.click();
            loopVariableLightningCombobox.dispatchEvent(blurEvent);
            await ticks(50);
            expect(loopVariableLightningCombobox.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);
        });
        it('notification info should not be display', () => {
            expect(getNotificationDiv(loopElement)).toBeNull();
        });
    });
    describe('element from the store - OA', () => {
        let loopElement, loopVariableLightningCombobox;
        beforeEach(async () => {
            const element = getElementByDevName('loopAccountAutomaticOutput');
            loopNode = getElementForPropertyEditor(element);
            loopElement = createComponentForTest(loopNode);
            await ticks(50);
            loopVariableLightningCombobox = getLoopVariableComboboxElement(loopElement);
        });
        it('loop variable text box is not displayed', () => {
            expect(loopVariableLightningCombobox).toBeNull();
        });
        it('notification info should be display', () => {
            expect(getNotificationDiv(loopElement)).not.toBeNull();
        });
    });
});
