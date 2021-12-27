import { checkboxChangeEvent, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import InvocableActionEditor from 'builder_platform_interaction/invocableActionEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { createElement } from 'lwc';
import * as scheduleTriggeredFlow from 'mock/flows/scheduleTriggeredFlow.json';
import { actionPostToChatter } from 'mock/storeDataScheduleTriggered';
import {
    getAdvancedAccordionOutputDiv,
    getBaseCalloutElement,
    getManuallyAssignVariablesCheckboxFromAcc,
    getManuallyAssignVariablesCheckboxInputElementFromAcc,
    getOutputParameterItemsFromAcc,
    VALIDATION_ERROR_MESSAGES,
    verifyOutputParameter
} from '../baseCalloutEditorTestUtils';
import { resetState, setupStateForFlow } from '../integrationTestUtils';
import { getLabelDescriptionElement, LabelDescriptionComponentTest } from '../labelDescriptionTestUtils';

jest.mock('builder_platform_interaction/editor', () => {
    return Object.assign({}, { launchSubflow: jest.fn() });
});

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
        await setupStateForFlow(scheduleTriggeredFlow);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(() => {
        actionNode = getElementForPropertyEditor(actionPostToChatter);
        coreActionElement = createComponentForTest(actionNode);
    });
    describe('name and dev name', () => {
        let labelDescription: LabelDescriptionComponentTest;
        beforeEach(() => {
            labelDescription = new LabelDescriptionComponentTest(
                getLabelDescriptionElement(getBaseCalloutElement(coreActionElement))
            );
        });
        it('does not change devName if it already exists after the user modifies the name', async () => {
            const newLabel = 'new label';
            await labelDescription.setLabel(newLabel);
            expect(coreActionElement.node.label.value).toBe(newLabel);
            expect(coreActionElement.node.name.value).toBe('postToChatter');
        });
        it('modifies the dev name', async () => {
            const newDevName = 'newName';
            await labelDescription.setName(newDevName);
            expect(coreActionElement.node.name.value).toBe(newDevName);
        });
        it('displays error if name is cleared', async () => {
            const newLabel = '';
            await labelDescription.setLabel(newLabel);
            expect(coreActionElement.node.label.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
        it('displays error if devName is cleared', async () => {
            const newDevName = '';
            await labelDescription.setName(newDevName);
            expect(coreActionElement.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
        });
    });
    describe('autolaunched flow with an action', () => {
        it('should display "Manually Assign Variables" checkbox', () => {
            const checkboxComponent = getManuallyAssignVariablesCheckboxFromAcc(coreActionElement);
            expect(checkboxComponent).not.toBeNull();
        });
        it('should have "Manually Assign Variables" unchecked', () => {
            const inputElement = getManuallyAssignVariablesCheckboxInputElementFromAcc(coreActionElement);
            expect(inputElement).toBeDefined();
            expect(inputElement.type).toBe('checkbox');
            expect(inputElement.checked).toBe(false);
        });
        it('should not have the output parameter displayed', () => {
            const parameterListOutputDiv = getAdvancedAccordionOutputDiv(coreActionElement);
            expect(parameterListOutputDiv).toBeNull();
        });
        describe('modify from automatic to manually assign variables', () => {
            beforeEach(async () => {
                const advancedOptionCheckbox = getManuallyAssignVariablesCheckboxInputElementFromAcc(coreActionElement);
                advancedOptionCheckbox.dispatchEvent(checkboxChangeEvent(true));
                await ticks(50);
            });
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
            });
        });
    });
});
