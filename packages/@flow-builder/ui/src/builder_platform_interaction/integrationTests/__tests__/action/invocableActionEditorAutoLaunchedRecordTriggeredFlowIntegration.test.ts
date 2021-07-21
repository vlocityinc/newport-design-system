import { createElement } from 'lwc';
import InvocableActionEditor from 'builder_platform_interaction/invocableActionEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { setupStateForFlow, resetState, changeComboboxValue } from '../integrationTestUtils';
import {
    getManuallyAssignVariablesCheckboxInputElementFromAcc,
    getOutputParameterComboboxElement,
    getOutputParameterItemsFromAcc,
    VALIDATION_ERROR_MESSAGES,
    verifyOutputParameter
} from '../baseCalloutEditorTestUtils';
import { actionPostToChatter } from 'mock/storeDataRecordTriggered';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-invocable-action-editor', { is: InvocableActionEditor });
    Object.assign(el, {
        node,
        processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
    });
    setDocumentBodyChildren(el);
    return el;
};

describe('Invocable Action Editor', () => {
    let actionNode;
    let coreActionElement;
    beforeAll(async () => {
        await setupStateForFlow(recordTriggeredFlow);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(async () => {
        actionNode = getElementForPropertyEditor(actionPostToChatter);
        coreActionElement = createComponentForTest(actionNode);
        await ticks();
    });
    describe('autolaunched flow with an action', () => {
        it('should have "Manually Assign Variables" checked', () => {
            const inputElement = getManuallyAssignVariablesCheckboxInputElementFromAcc(coreActionElement);
            expect(inputElement).toBeDefined();
            expect(inputElement.type).toBe('checkbox');
            expect(inputElement.checked).toBe(true);
        });
        it('should have the output parameter displayed', () => {
            const outputParameters = getOutputParameterItemsFromAcc(coreActionElement);
            expect(outputParameters).toHaveLength(1);
            verifyOutputParameter(outputParameters[0], 'Feed Item ID', null);
            console.log(outputParameters[0]);
        });
        it.each`
            outputResourcePickerDisplayText | expectedErrorMessage
            ${'{!$Record.Name}'}            | ${undefined}
            ${'{!$Record__Prior}'}          | ${VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE}
            ${'{!$Record__Prior.Name}'}     | ${VALIDATION_ERROR_MESSAGES.GENERIC}
        `(
            'When typing "$outputResourcePickerDisplayText" error should be: $expectedErrorMessage',
            async ({ outputResourcePickerDisplayText, expectedErrorMessage }) => {
                const outputParameter = getOutputParameterItemsFromAcc(coreActionElement)[0];
                const combobox = getOutputParameterComboboxElement(outputParameter);
                await changeComboboxValue(combobox, outputResourcePickerDisplayText);
                expect(combobox.validity).toEqual(expectedErrorMessage);
            }
        );
    });
});
