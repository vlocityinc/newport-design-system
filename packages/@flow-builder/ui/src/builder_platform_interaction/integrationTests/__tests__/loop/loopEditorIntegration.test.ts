import { createElement } from 'lwc';
import LoopEditor from 'builder_platform_interaction/loopEditor';
import * as scheduleTriggeredFlow from 'mock/flows/scheduleTriggeredFlow.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    resetState,
    setupStateForProcessType,
    translateFlowToUIAndDispatch,
    setupStateForFlow
} from '../integrationTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    ticks,
    blurEvent,
    focusoutEvent,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { getLabelDescriptionLabelElement, getLabelDescriptionNameElement } from '../labelDescriptionTestUtils';
import { ComboboxTestComponent } from '../comboboxTestUtils';
import { GroupedComboboxTestComponent } from '../groupedComboboxTestUtils';

jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText',
    () => {
        return { default: '{0} from {1}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.actionAnonymousPrimitiveAsResourceText',
    () => {
        return { default: '{0} from {1}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderDataTypes.collectionDataType',
    () => {
        return { default: '{0} Collection' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderDataTypes.textDataTypeLabel',
    () => {
        return { default: 'Text' };
    },
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
    '@salesforce/label/FlowBuilderElementLabels.subflowAsResourceText',
    () => {
        return { default: 'Outputs from {0}' };
    },
    { virtual: true }
);

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
    isNew: true
};

const createComponentForTest = (node, processType = FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW) => {
    const el = createElement('builder_platform_interaction-loop-editor', {
        is: LoopEditor
    });
    Object.assign(el, { node, processType });
    setDocumentBodyChildren(el);
    return el;
};

const getLoopVariableCombobox = (loopEditor) => {
    const element = deepQuerySelector(loopEditor, [
        SELECTORS.LOOP_VARIABLE,
        SELECTORS.BASE_RESOURCE_PICKER,
        SELECTORS.COMBOBOX
    ]);
    return element == null ? null : new ComboboxTestComponent(element);
};

const getNotificationDiv = (loopEditor) => deepQuerySelector(loopEditor, [SELECTORS.SLDS_SCOPED_NOTIFICATION]);
const getLoopVariableResourcePicker = (loopEditor) => loopEditor.shadowRoot.querySelector(SELECTORS.LOOP_VARIABLE);

const getCollectionVariableCombobox = (loopEditor) => {
    return new ComboboxTestComponent(
        deepQuerySelector(loopEditor, [
            SELECTORS.COLLECTION_VARIABLE,
            SELECTORS.BASE_RESOURCE_PICKER,
            SELECTORS.COMBOBOX
        ])
    );
};

describe('Loop Editor with processType does not support automatic output', () => {
    let loopElementComponent;
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
        loopElementComponent = createComponentForTest(loopNodeEmpty, FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE);
        await ticks(50);
    });
    describe('Adding new element', () => {
        it('loop variable is disabled when creating a new loop', async () => {
            await ticks(50);
            // collection variable is enabled
            const colVariableLightningCombobox = getCollectionVariableCombobox(
                loopElementComponent
            ).getGroupedCombobox();
            expect(colVariableLightningCombobox.element.disabled).toBeFalsy();
            // loop variable is disabled initially when a new loop is
            // created
            const loopVariableLightningCombobox = getLoopVariableCombobox(loopElementComponent)!.getGroupedCombobox();
            expect(loopVariableLightningCombobox.element.disabled).toBeTruthy();
        });
        it('loop variable is enabled after the collection variable is set to a valid value', async () => {
            const vAccounts = getElementByDevName('vAccounts')!;
            const colVariableLightningCombobox = getCollectionVariableCombobox(
                loopElementComponent
            ).getGroupedCombobox();
            await colVariableLightningCombobox.type(`{!${vAccounts.name}}`);
            // loop variable should be enabled now
            const loopVariableLightningCombobox = getLoopVariableCombobox(loopElementComponent)!.getGroupedCombobox();
            expect(loopVariableLightningCombobox.element.disabled).toBeFalsy();
        });
    });
    describe('Existing element', () => {
        let vMyTestAccount;
        let loopVariableLightningCombobox: GroupedComboboxTestComponent;
        let colVariableLightningCombobox: GroupedComboboxTestComponent;
        beforeEach(async () => {
            const element = getElementByDevName('myLoopOnAccount');
            loopNode = getElementForPropertyEditor(element);
            loopElementComponent = createComponentForTest(loopNode);
            await ticks(50);
            vMyTestAccount = getElementByDevName('vMyTestAccount');
            loopVariableLightningCombobox = getLoopVariableCombobox(loopElementComponent)!.getGroupedCombobox();
            colVariableLightningCombobox = getCollectionVariableCombobox(loopElementComponent).getGroupedCombobox();
        });
        it('is correctly loaded, with no error, for an existing loop', () => {
            expect(loopVariableLightningCombobox.element.inputText).toBe(`{!${vMyTestAccount.name}}`);
            expect(loopVariableLightningCombobox.element.validity).toBeFalsy();
        });
        it('it disabled after the collection variable is set to an invalid value', async () => {
            await colVariableLightningCombobox.type('nonExistentVariable');
            // loop variable should be still disabled
            expect(loopVariableLightningCombobox.element.disabled).toBeTruthy();
        });
        it('becomes disabled after the collection variable is set from a valid value to an invalid one', async () => {
            // first check that the loop variable is enabled
            expect(loopVariableLightningCombobox.element.disabled).toBeFalsy();
            await colVariableLightningCombobox.type('nonExistentVariable');
            // loop variable should be disabled now
            expect(loopVariableLightningCombobox.element.disabled).toBeTruthy();
        });
        it('loop variable text box is not displayed', () => {
            expect(loopVariableLightningCombobox).not.toBeNull();
        });
        it('notification info should not be visible', () => {
            expect(getNotificationDiv(loopElementComponent)).toBeNull();
        });
    });
});

describe('Loop Editor with processType supporting automatic output', () => {
    let store;
    let loopNode;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
        translateFlowToUIAndDispatch(scheduleTriggeredFlow, store);
    });
    afterAll(() => {
        resetState();
    });
    describe('name and dev name', () => {
        let loopElementComponent;
        beforeEach(async () => {
            const element = getElementByDevName('loopAccountAutomaticOutput');
            loopNode = getElementForPropertyEditor(element);
            loopElementComponent = createComponentForTest(loopNode);
            await ticks(50);
        });
        it('do not change devName if it already exists after the user modifies the name', async () => {
            const newLabel = 'new label';
            await ticks(50);
            const labelInput = getLabelDescriptionLabelElement(loopElementComponent);
            labelInput.value = newLabel;
            labelInput.dispatchEvent(focusoutEvent);
            await ticks(50);
            expect(loopElementComponent.node.label.value).toBe(newLabel);
        });
        it('modify the dev name', async () => {
            const newDevName = 'newName';
            await ticks(50);
            const devNameInput = getLabelDescriptionNameElement(loopElementComponent);
            devNameInput.value = newDevName;
            devNameInput.dispatchEvent(focusoutEvent);
            await ticks(50);
            expect(loopElementComponent.node.name.value).toBe(newDevName);
        });
        it('displays error if name is cleared', async () => {
            const newLabel = '';
            await ticks(50);
            const labelInput = getLabelDescriptionLabelElement(loopElementComponent);
            labelInput.value = newLabel;
            labelInput.dispatchEvent(focusoutEvent);
            await ticks(50);
            expect(loopElementComponent.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
        it('displays error if devName is cleared', async () => {
            const newDevName = '';
            await ticks(50);
            const devNameInput = getLabelDescriptionNameElement(loopElementComponent);
            devNameInput.value = newDevName;
            devNameInput.dispatchEvent(focusoutEvent);
            await ticks(50);
            expect(loopElementComponent.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
    });
    describe('Add new element - automatic output supported', () => {
        let loopElementComponent;
        beforeEach(async () => {
            const loopNodeEmpty = getElementForPropertyEditor(newLoopElement);
            loopElementComponent = createComponentForTest(loopNodeEmpty);
            await ticks(50);
        });
        it('loop variable is no visible', async () => {
            const loopVariableLightningCombobox = getLoopVariableResourcePicker(loopElementComponent);
            expect(loopVariableLightningCombobox).toBeNull();
        });
        it('notification info should be visible', () => {
            expect(getNotificationDiv(loopElementComponent)).not.toBeNull();
        });
    });
    describe('element from the store - OA', () => {
        let loopElementComponent;
        let loopVariableLightningCombobox: ComboboxTestComponent | null;
        beforeEach(async () => {
            const element = getElementByDevName('loopAccountAutomaticOutput');
            loopNode = getElementForPropertyEditor(element);
            loopElementComponent = createComponentForTest(loopNode);
            await ticks(50);
            loopVariableLightningCombobox = getLoopVariableCombobox(loopElementComponent);
        });
        it('loop variable text box is not displayed', () => {
            expect(loopVariableLightningCombobox).toBeNull();
        });
        it('notification info should be displayed', () => {
            expect(getNotificationDiv(loopElementComponent)).not.toBeNull();
        });
    });
});
describe('Loop with manual output', () => {
    let loopElementComponent, loopNode;
    let loopVariableLightningCombobox: GroupedComboboxTestComponent;
    let colVariableLightningCombobox: GroupedComboboxTestComponent;
    describe('loop on text collection', () => {
        let textCollection, accounts, textVariable;
        beforeAll(async () => {
            await setupStateForFlow(scheduleTriggeredFlow);
        });
        afterAll(() => {
            resetState();
        });
        beforeEach(async () => {
            accounts = getElementByDevName('accounts');
            textCollection = getElementByDevName('textCollection');
            const element = getElementByDevName('loopOnTextCollection');
            loopNode = getElementForPropertyEditor(element);
            loopElementComponent = createComponentForTest(loopNode);
            await ticks(50);
            textVariable = getElementByDevName('textVariable');
            loopVariableLightningCombobox = getLoopVariableCombobox(loopElementComponent)!.getGroupedCombobox();
            colVariableLightningCombobox = getCollectionVariableCombobox(loopElementComponent).getGroupedCombobox();
        });
        describe('loop variable', () => {
            it('is correctly loaded, with no error, for an existing loop', () => {
                expect(loopVariableLightningCombobox.element.inputText).toBe(`{!${textVariable.name}}`);
                expect(loopVariableLightningCombobox.element.validity).toBeFalsy();
            });
            it('it disabled after the collection variable is set to an invalid value', async () => {
                await colVariableLightningCombobox.type('nonExistentVariable');
                // loop variable should be still disabled
                expect(loopVariableLightningCombobox.element.disabled).toBeTruthy();
            });
            it('becomes disabled after the collection variable is set from a valid value to an invalid one', async () => {
                // first check that the loop variable is enabled
                expect(loopVariableLightningCombobox.element.disabled).toBeFalsy();
                await colVariableLightningCombobox.type('nonExistentVariable');
                // loop variable should be disabled now
                expect(loopVariableLightningCombobox.element.disabled).toBeTruthy();
            });
        });
        it('shows an error if the user deletes the value of the variable', async () => {
            await loopVariableLightningCombobox.type('');
            expect(loopVariableLightningCombobox.element.inputText).toBe('');
            expect(loopVariableLightningCombobox.element.validity).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
        it('is correctly loaded, with no error, for an existing loop', () => {
            expect(colVariableLightningCombobox.element.inputText).toBe(`{!${textCollection.name}}`);
            expect(colVariableLightningCombobox.element.validity).toBeFalsy();
        });
        it('shows an error when its data type is different from the data type in the collection variable', async () => {
            await ticks(50);
            // Switch collection variable from a string type variable
            // to a sObject type variable
            await colVariableLightningCombobox.type(`{!${accounts.name}}`);
            // loop variable should keep the previous value but
            // show a data mismatch error
            expect(loopVariableLightningCombobox.element.inputText).toBe(`{!${textVariable.name}}`);
            expect(loopVariableLightningCombobox.element.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);
        });
        it('shows only sObject variables of the same type as the sObject selected in the collection variable', async () => {
            const accountVariable = getElementByDevName('accountVariable')!;
            await colVariableLightningCombobox.type(`{!${accounts.name}}`);

            expect(loopVariableLightningCombobox.element.items).toHaveLength(2);
            expect(loopVariableLightningCombobox.element.items[1].label).toBe(
                'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL'
            );
            expect(loopVariableLightningCombobox.element.items[1].items).toHaveLength(1);
            expect(loopVariableLightningCombobox.element.items[1].items[0]).toMatchObject({
                dataType: 'SObject',
                subtype: 'Account',
                text: accountVariable.name,
                subText: 'Account',
                displayText: `{!${accountVariable.name}}`,
                value: accountVariable.guid
            });
        });
        it('shows only sObject variables of the same type as the sObject selected in the collection variable with traversal', async () => {
            const accountVariable = getElementByDevName('accountVariable')!;
            await colVariableLightningCombobox.type(`{!apexComplexTypeVariable.acctListField}`);

            expect(loopVariableLightningCombobox.element.items).toHaveLength(2);
            expect(loopVariableLightningCombobox.element.items[1].label).toBe(
                'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL'
            );
            expect(loopVariableLightningCombobox.element.items[1].items).toHaveLength(1);
            expect(loopVariableLightningCombobox.element.items[1].items[0]).toMatchObject({
                dataType: 'SObject',
                subtype: 'Account',
                text: accountVariable.name,
                subText: 'Account',
                displayText: `{!${accountVariable.name}}`,
                value: accountVariable.guid
            });
        });
        it('updates the display text after the user changes the value of the variable to another valid value', async () => {
            await colVariableLightningCombobox.type(`{!${textCollection.name}}`);
            expect(colVariableLightningCombobox.element.inputText).toBe(`{!${textCollection.name}}`);
            expect(colVariableLightningCombobox.element.validity).toBeFalsy();
        });
        it('shows only variables of the same type as the collection variable', async () => {
            const stringVariable = getElementByDevName('stringVariable')!;
            // initially the loop variable has only the "New
            // Resource" in the menu data
            expect(loopVariableLightningCombobox.element.items).toHaveLength(2);
            await colVariableLightningCombobox.type(`{!${textCollection.name}}`);
            // loop variable should only show variables with
            // dataType of String
            expect(loopVariableLightningCombobox.element.items).toHaveLength(2);
            expect(loopVariableLightningCombobox.element.items[1].label).toBe(
                'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL'
            );
            expect(loopVariableLightningCombobox.element.items[1].items).toHaveLength(2);
            expect(loopVariableLightningCombobox.element.items[1].items[0]).toMatchObject({
                text: stringVariable.name,
                displayText: `{!${stringVariable.name}}`,
                value: stringVariable.guid
            });
            expect(loopVariableLightningCombobox.element.items[1].items[1]).toMatchObject({
                text: textVariable.name,
                displayText: `{!${textVariable.name}}`,
                value: textVariable.guid
            });
        });
        it('maintains a datatype mismatch error after the user clicks in and out of the box - W-5143108', async () => {
            // Switch collection variable from a string type variable
            // to a sObject type variable
            await colVariableLightningCombobox.type(`{!${accounts.name}}`);
            // loop variable shows a data type mismatch error
            expect(loopVariableLightningCombobox.element.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);

            // The error is still there after the user clicks
            // outside the combobox
            loopVariableLightningCombobox.element.click();
            loopVariableLightningCombobox.element.dispatchEvent(blurEvent);
            await ticks(50);
            expect(loopVariableLightningCombobox.element.validity).toBe(VALIDATION_ERROR_MESSAGES.DATATYPE_MISMATCH);
        });
        it('notification info should not be display', () => {
            expect(getNotificationDiv(loopElementComponent)).toBeNull();
        });
    });
    describe('loop on complex merge field', () => {
        beforeAll(async () => {
            await setupStateForFlow(flowWithAllElements);
        });
        afterAll(() => {
            resetState();
        });
        beforeEach(async () => {
            const element = getElementByDevName('loopOnComplexMergeFieldManualOutput');
            loopNode = getElementForPropertyEditor(element);
            loopElementComponent = createComponentForTest(loopNode);
            await ticks(50);
            loopVariableLightningCombobox = getLoopVariableCombobox(loopElementComponent)!.getGroupedCombobox();
            colVariableLightningCombobox = getCollectionVariableCombobox(loopElementComponent).getGroupedCombobox();
        });
        it('does not show an error if the user click outside of the combobox', async () => {
            loopVariableLightningCombobox.element.dispatchEvent(blurEvent);
            await ticks(50);
            expect(loopVariableLightningCombobox.element.validity).not.toBeDefined();
        });
    });
});
describe('Loop Editor collection variable', () => {
    let loopNode, loopElementComponent;
    let collectionVariableCombobox: ComboboxTestComponent;
    beforeAll(async () => {
        const store = await setupStateForFlow(flowWithAllElements);
        translateFlowToUIAndDispatch(flowWithAllElements, store);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(async () => {
        const element = getElementByDevName('loopOnAccountAutoOutput');
        loopNode = getElementForPropertyEditor(element);
        loopElementComponent = createComponentForTest(loopNode);
        await ticks(50);
        collectionVariableCombobox = getCollectionVariableCombobox(loopElementComponent);
    });
    it.each`
        collection                                               | expectedErrorMessage
        ${'{!apexCall_anonymous_accounts}'}                      | ${null}
        ${'{!apexCall_anonymous_strings}'}                       | ${null}
        ${'{!apexCall_anonymous_apex_collection}'}               | ${'FlowBuilderCombobox.genericErrorMessage'}
        ${'{!apexComplexTypeTwoVariable.testOne.acctListField}'} | ${null}
        ${'{!apexComplexTypeTwoVariable.testOne.acct}'}          | ${'FlowBuilderCombobox.genericErrorMessage'}
        ${'{!apexComplexTypeTwoVariable}'}                       | ${'FlowBuilderCombobox.genericErrorMessage'}
        ${'{!subflowAutomaticOutput.accountOutputCollection}'}   | ${null}
        ${'{!subflowAutomaticOutput.inputOutput2}'}              | ${'FlowBuilderCombobox.genericErrorMessage'}
    `('error for "$collection should be : $expectedErrorMessage', async ({ collection, expectedErrorMessage }) => {
        await collectionVariableCombobox.typeReferenceOrValue(collection);
        expect(collectionVariableCombobox.element.errorMessage).toEqual(expectedErrorMessage);
    });
    it.each`
        collection                                                            | expectedItem
        ${['stringCollectionVariable1']}                                      | ${{ displayText: '{!stringCollectionVariable1}' }}
        ${['accountSObjectCollectionVariable']}                               | ${{ displayText: '{!accountSObjectCollectionVariable}' }}
        ${['apexComplexTypeCollectionVariable']}                              | ${{ displayText: '{!apexComplexTypeCollectionVariable}' }}
        ${['Accounts from apexCall_anonymous_accounts']}                      | ${{ displayText: '{!apexCall_anonymous_accounts}' }}
        ${['Text Collection from apexCall_anonymous_strings']}                | ${{ displayText: '{!apexCall_anonymous_strings}' }}
        ${['apexComplexTypeTwoVariable', 'testOne', 'acctListField']}         | ${{ displayText: '{!apexComplexTypeTwoVariable.testOne.acctListField}' }}
        ${['Outputs from subflowAutomaticOutput', 'accountOutputCollection']} | ${{ displayText: '{!subflowAutomaticOutput.accountOutputCollection}' }}
    `('can select $collection as a collection variable', async ({ collection, expectedItem }) => {
        await expect(collectionVariableCombobox).canSelectInCombobox('text', collection);
        expect(collectionVariableCombobox.element.value).toMatchObject(expectedItem);
    });
});
