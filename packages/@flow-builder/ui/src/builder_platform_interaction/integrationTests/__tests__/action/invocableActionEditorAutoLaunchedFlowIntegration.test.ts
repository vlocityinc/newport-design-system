import { createElement } from 'lwc';
import InvocableActionEditor from 'builder_platform_interaction/invocableActionEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { ticks, focusoutEvent, checkboxChangeEvent } from 'builder_platform_interaction/builderTestUtils';
import { setupStateForFlow, resetState } from '../integrationTestUtils';
import { getLabelDescriptionNameElement, getLabelDescriptionLabelElement } from '../labelDescriptionTestUtils';
import {
    VALIDATION_ERROR_MESSAGES,
    getBaseCalloutElement,
    getAutomaticOutputAdvancedOptionCheckboxFromAcc,
    getAutomaticOutputAdvancedOptionComponentFromAcc,
    getOutputParameterItemsFromAcc,
    getAdvancedAccordionOutputDiv,
    verifyOutputParameter
} from '../baseCalloutEditorTestUtils';
import { actionPostToChatter } from 'mock/storeDataScheduleTriggered';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as scheduleTriggeredFlow from 'mock/flows/scheduleTriggeredFlow.json';

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-invocable-action-editor', { is: InvocableActionEditor });
    Object.assign(el, {
        node,
        processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
    });
    document.body.appendChild(el);
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
        it('does not change devName if it already exists after the user modifies the name', async () => {
            const newLabel = 'new label';
            const labelInput = getLabelDescriptionLabelElement(getBaseCalloutElement(coreActionElement));
            labelInput.value = newLabel;
            labelInput.dispatchEvent(focusoutEvent);
            await ticks();
            expect(coreActionElement.node.label.value).toBe(newLabel);
            expect(coreActionElement.node.name.value).toBe('postToChatter');
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
    describe('autolaunched flow with an action', () => {
        it('should display "useAdvancedOptionsComponent"', () => {
            const advancedOptionComponent = getAutomaticOutputAdvancedOptionComponentFromAcc(coreActionElement);
            expect(advancedOptionComponent).not.toBeNull();
        });
        it('should have "useAdvancedOptionsCheckbox" unchecked', () => {
            const advancedOptionCheckbox = getAutomaticOutputAdvancedOptionCheckboxFromAcc(coreActionElement);
            expect(advancedOptionCheckbox).toBeDefined();
            expect(advancedOptionCheckbox.type).toBe('checkbox');
            expect(advancedOptionCheckbox.checked).toBe(false);
        });
        it('should have the output parameter displayed', () => {
            const parameterListOutputDiv = getAdvancedAccordionOutputDiv(coreActionElement);
            expect(parameterListOutputDiv).toBeNull();
        });
        describe('modify from automatic to advanced', () => {
            beforeEach(async () => {
                const advancedOptionCheckbox = getAutomaticOutputAdvancedOptionCheckboxFromAcc(coreActionElement);
                advancedOptionCheckbox.dispatchEvent(checkboxChangeEvent(true));
                await ticks(50);
            });
            it('should have "useAdvancedOptionsCheckbox" checked', () => {
                const advancedOptionCheckbox = getAutomaticOutputAdvancedOptionCheckboxFromAcc(coreActionElement);
                expect(advancedOptionCheckbox).toBeDefined();
                expect(advancedOptionCheckbox.type).toBe('checkbox');
                expect(advancedOptionCheckbox.checked).toBe(true);
            });
            it('should have the output parameter displayed', () => {
                const outputParameters = getOutputParameterItemsFromAcc(coreActionElement);
                expect(outputParameters).toHaveLength(1);
                verifyOutputParameter(outputParameters[0], 'Feed Item ID', null);
            });
        });
    });
});
