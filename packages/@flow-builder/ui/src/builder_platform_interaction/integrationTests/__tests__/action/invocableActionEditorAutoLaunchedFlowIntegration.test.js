import { createElement } from 'lwc';
import InvocableActionEditor from 'builder_platform_interaction/invocableActionEditor';
import { resolveRenderCycles } from '../resolveRenderCycles';
import { setProcessTypeFeature } from 'builder_platform_interaction/systemLib';
import { setRules, getOutputRules } from 'builder_platform_interaction/ruleLib';
import OutputResourcePicker from 'builder_platform_interaction/outputResourcePicker';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { Store } from 'builder_platform_interaction/storeLib';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { flowWithApexActionSubmitForApproval } from 'mock/flows/flowWithApexActionSubmitForApproval';
import {
    ticks,
    focusoutEvent
} from 'builder_platform_interaction/builderTestUtils';
import {
    getLabelDescriptionNameElement,
    getLabelDescriptionLabelElement,
    resetState,
    ToggleOnChangeEvent
} from '../integrationTestUtils';
import {
    VALIDATION_ERROR_MESSAGES,
    getBaseCalloutElement,
    getAutomaticOutputAdvancedOptionCheckbox,
    getAutomaticOutputAdvancedOptionComponent,
    getOutputParameterItems,
    getParameterListOutputDiv,
    verifyOutputParameter
} from '../baseCalloutEditorTestUtils';
import { rules } from 'serverData/RetrieveAllRules/rules.json';
import { actionPostToChatter } from 'mock/storeDataAutolaunched';
import { supportedFeaturesListForAutoLaunchedFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForAutoLaunchedFlow.json';
import { chatterPostActionDetails as mockChatterPostActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';
import { apexTypesForAutolLaunchedFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    const actual = require.requireActual(
        'builder_platform_interaction/invocableActionLib'
    );
    return {
        isAutomaticOutputHandlingSupported:
            actual.isAutomaticOutputHandlingSupported,
        getParametersForInvocableAction: actual.getParametersForInvocableAction,
        fetchDetailsForInvocableAction: jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve(mockChatterPostActionDetails)
            )
    };
});

const createComponentForTest = (node, { isNewMode = false } = {}) => {
    const el = createElement(
        'builder_platform_interaction-invocable-action-editor',
        { is: InvocableActionEditor }
    );
    Object.assign(el, {
        node,
        isNewMode,
        processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
    });
    document.body.appendChild(el);
    return el;
};

describe('Invocable Action Editor', () => {
    let store;
    let actionNode;
    let coreActionElement;
    beforeAll(() => {
        setRules(rules);
        OutputResourcePicker.RULES = getOutputRules();
        store = Store.getStore(reducer);
        setApexClasses(apexTypesForAutolLaunchedFlow);
        fetchDetailsForInvocableAction.mockImplementation(() =>
            Promise.resolve(mockChatterPostActionDetails)
        );
        setProcessTypeFeature(
            FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
            supportedFeaturesListForAutoLaunchedFlow
        );
        const uiFlow = translateFlowToUIModel(
            flowWithApexActionSubmitForApproval
        );
        store.dispatch(updateFlow(uiFlow));
    });
    afterAll(() => {
        resetState();
        setAuraFetch();
        setApexClasses(null);
    });
    describe('name and dev name', () => {
        beforeEach(() => {
            actionNode = getElementForPropertyEditor(actionPostToChatter);
            coreActionElement = createComponentForTest(actionNode);
        });
        it('do not change devName if it already exists after the user modifies the name', () => {
            const newLabel = 'new label';
            coreActionElement = createComponentForTest(actionNode);
            return resolveRenderCycles(() => {
                const labelInput = getLabelDescriptionLabelElement(
                    getBaseCalloutElement(coreActionElement)
                );
                labelInput.value = newLabel;
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(coreActionElement.node.label.value).toBe(newLabel);
                    expect(coreActionElement.node.name.value).toBe(
                        'postToChatter'
                    );
                });
            });
        });
        it('modify the dev name', () => {
            const newDevName = 'newName';
            coreActionElement = createComponentForTest(actionNode);
            return resolveRenderCycles(() => {
                const devNameInput = getLabelDescriptionNameElement(
                    getBaseCalloutElement(coreActionElement)
                );
                devNameInput.value = newDevName;
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(coreActionElement.node.name.value).toBe(newDevName);
                });
            });
        });
        it('display error if name is cleared', () => {
            const newLabel = '';
            coreActionElement = createComponentForTest(actionNode);
            return resolveRenderCycles(() => {
                const labelInput = getLabelDescriptionLabelElement(
                    getBaseCalloutElement(coreActionElement)
                );
                labelInput.value = newLabel;
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(coreActionElement.node.label.error).toBe(
                        VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                });
            });
        });
        it('display error if devName is cleared', () => {
            const newDevName = '';
            coreActionElement = createComponentForTest(actionNode);
            return resolveRenderCycles(() => {
                const devNameInput = getLabelDescriptionNameElement(
                    getBaseCalloutElement(coreActionElement)
                );
                devNameInput.value = newDevName;
                devNameInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(coreActionElement.node.name.error).toBe(
                        VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                    );
                });
            });
        });
    });
    describe('autolaunched flow with an action', () => {
        beforeEach(() => {
            actionNode = getElementForPropertyEditor(actionPostToChatter);
            coreActionElement = createComponentForTest(actionNode);
        });
        it('"useAdvancedOptionsComponent" should be display', () => {
            const advancedOptionComponent = getAutomaticOutputAdvancedOptionComponent(
                coreActionElement
            );
            expect(advancedOptionComponent).not.toBeNull();
        });
        it('"useAdvancedOptionsCheckbox" should be unchecked', () => {
            const advancedOptionCheckbox = getAutomaticOutputAdvancedOptionCheckbox(
                coreActionElement
            );
            expect(advancedOptionCheckbox).toBeDefined();
            expect(advancedOptionCheckbox.type).toBe('checkbox');
            expect(advancedOptionCheckbox.checked).toBe(false);
        });
        it('should have the output parameter displayed', () => {
            const parameterListOutputDiv = getParameterListOutputDiv(
                coreActionElement
            );
            expect(parameterListOutputDiv).toBeNull();
        });
        describe('modify from automatic to advanced', () => {
            beforeEach(async () => {
                const advancedOptionCheckbox = getAutomaticOutputAdvancedOptionCheckbox(
                    coreActionElement
                );
                advancedOptionCheckbox.dispatchEvent(new ToggleOnChangeEvent());
                await ticks(50);
            });
            it('"useAdvancedOptionsCheckbox" should checked', () => {
                const advancedOptionCheckbox = getAutomaticOutputAdvancedOptionCheckbox(
                    coreActionElement
                );
                expect(advancedOptionCheckbox).toBeDefined();
                expect(advancedOptionCheckbox.type).toBe('checkbox');
                expect(advancedOptionCheckbox.checked).toBe(true);
            });
            it('should have the output parameter displayed', () => {
                const outputParameters = getOutputParameterItems(
                    coreActionElement
                );
                expect(outputParameters).toHaveLength(1);
                verifyOutputParameter(
                    outputParameters[0],
                    'Feed Item ID',
                    null
                );
            });
        });
    });
});
