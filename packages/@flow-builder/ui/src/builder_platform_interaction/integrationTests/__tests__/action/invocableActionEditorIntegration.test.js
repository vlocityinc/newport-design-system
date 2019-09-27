import { createElement } from 'lwc';
import InvocableActionEditor from 'builder_platform_interaction/invocableActionEditor';
import { resolveRenderCycles } from '../../resolveRenderCycles';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { setRules, getOutputRules } from 'builder_platform_interaction/ruleLib';
import OutputResourcePicker from 'builder_platform_interaction/outputResourcePicker';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { updateFlow } from 'builder_platform_interaction/actions';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import * as flowWithApexAction from 'mock/flows/flowWithApexAction.json';
import { flowWithApexActionSubmitForApproval } from 'mock/flows/flowWithApexActionSubmitForApproval';
import {
    getLabelDescriptionNameElement,
    getLabelDescriptionLabelElement,
    focusoutEvent,
    textInputEvent,
    blurEvent,
    resetState
} from '../../integrationTestUtils';
import {
    auraFetch,
    getAllInvocableActionsForType
} from '../../serverDataTestUtils';
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
    verifyRequiredInputParameter,
    verifyOptionalInputParameterWithValue,
    verifyOptionalInputParameterNoValue,
    verifyOutputParameter,
    getParameter,
    findParameterElement,
    filterParameterElements,
    findIndex,
    getElementGuid
} from '../../baseCalloutEditorTestUtils';
import { mockAllTypesActionParameters, mockActions } from 'mock/calloutData';
import { rules } from 'serverData/RetrieveAllRules/rules.json';
import { submitForApprovalActionParameters } from 'serverData/GetInvocableActionParameters/submitForApprovalActionParameters.json';

const getInvocableActionParameters = invocableActionParameters => params => {
    let invocableActionParametersForAction;
    const invocableActionParametersForType =
        invocableActionParameters[params.actionType];
    if (invocableActionParametersForType) {
        invocableActionParametersForAction =
            invocableActionParametersForType[params.actionName];
    }
    return invocableActionParametersForAction
        ? { data: invocableActionParametersForAction }
        : { error: 'Cannot find invocable action parameters' };
};

const createComponentForTest = (node, { isNewMode = false } = {}) => {
    const el = createElement(
        'builder_platform_interaction-invocable-action-editor',
        { is: InvocableActionEditor }
    );
    Object.assign(el, { node, isNewMode });
    document.body.appendChild(el);
    return el;
};

describe('Invocable Action Editor', () => {
    let store;
    let actionNode;
    beforeAll(() => {
        setRules(rules);
        OutputResourcePicker.RULES = getOutputRules();
        store = Store.getStore(reducer);
    });
    afterAll(() => {
        resetState();
    });
    describe('Flow with an apex action with all types', () => {
        beforeAll(() => {
            setAuraFetch(
                auraFetch({
                    'c.getAllInvocableActionsForType': getAllInvocableActionsForType(
                        { [FLOW_PROCESS_TYPE.FLOW]: mockActions }
                    ),
                    'c.getInvocableActionParameters': getInvocableActionParameters(
                        {
                            apex: {
                                AllTypesApexAction: mockAllTypesActionParameters
                            }
                        }
                    )
                })
            );
            const uiFlow = translateFlowToUIModel(flowWithApexAction);
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            setAuraFetch();
        });
        beforeEach(() => {
            const element = getElementByDevName('allTypesApexAction');
            actionNode = getElementForPropertyEditor(element);
        });
        describe('name and dev name', () => {
            it('do not change devName if it already exists after the user modifies the name', () => {
                const newLabel = 'new label';
                const coreActionElement = createComponentForTest(actionNode);
                return resolveRenderCycles(() => {
                    const labelInput = getLabelDescriptionLabelElement(
                        getBaseCalloutElement(coreActionElement)
                    );
                    labelInput.value = newLabel;
                    labelInput.dispatchEvent(focusoutEvent);
                    return resolveRenderCycles(() => {
                        expect(coreActionElement.node.label.value).toBe(
                            newLabel
                        );
                        expect(coreActionElement.node.name.value).toBe(
                            'allTypesApexAction'
                        );
                    });
                });
            });
            it('modify the dev name', () => {
                const newDevName = 'newName';
                const coreActionElement = createComponentForTest(actionNode);
                return resolveRenderCycles(() => {
                    const devNameInput = getLabelDescriptionNameElement(
                        getBaseCalloutElement(coreActionElement)
                    );
                    devNameInput.value = newDevName;
                    devNameInput.dispatchEvent(focusoutEvent);
                    return resolveRenderCycles(() => {
                        expect(coreActionElement.node.name.value).toBe(
                            newDevName
                        );
                    });
                });
            });
            it('display error if name is cleared', () => {
                const newLabel = '';
                const coreActionElement = createComponentForTest(actionNode);
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
                const coreActionElement = createComponentForTest(actionNode);
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
        describe('input div', () => {
            describe('valid cases', () => {
                let coreActionElement, inputParameters;
                beforeEach(() => {
                    coreActionElement = createComponentForTest(actionNode);
                    return resolveRenderCycles(() => {
                        inputParameters = getInputParameterItems(
                            coreActionElement
                        );
                    });
                });
                it('show all input parameters', () => {
                    // required parameters: Account Parameter and String Parameter
                    verifyRequiredInputParameter(
                        inputParameters[0],
                        'Account Parameter',
                        '{!accountSObjectVariable}'
                    );
                    verifyRequiredInputParameter(
                        inputParameters[1],
                        'Id Parameter',
                        '{!stringVariable}'
                    );
                    verifyRequiredInputParameter(
                        inputParameters[2],
                        'String Parameter',
                        '{!stringVariable}'
                    );
                    // optional parameters: Account Collection Parameter (no value),
                    // Date Collection Parameter (no value), Date Parameter (no
                    // value), Number Collection Parameter (no value), Number
                    // Parameter (with value), String Collection Parameter (no
                    // value)
                    verifyOptionalInputParameterNoValue(
                        inputParameters[3],
                        'Account Collection Parameter'
                    );
                    verifyOptionalInputParameterNoValue(
                        inputParameters[4],
                        'Boolean Collection Parameter'
                    );
                    verifyOptionalInputParameterNoValue(
                        inputParameters[5],
                        'Boolean Parameter'
                    );
                    verifyOptionalInputParameterNoValue(
                        inputParameters[6],
                        'Date Collection Parameter'
                    );
                    verifyOptionalInputParameterNoValue(
                        inputParameters[7],
                        'Date Parameter'
                    );
                    verifyOptionalInputParameterNoValue(
                        inputParameters[8],
                        'Number Collection Parameter'
                    );
                    verifyOptionalInputParameterWithValue(
                        inputParameters[9],
                        'Number Parameter',
                        '{!numberVariable}'
                    );
                    verifyOptionalInputParameterNoValue(
                        inputParameters[10],
                        'String Collection Parameter'
                    );
                });
                it('update value when setting the litteral string to the String Parameter', () => {
                    const stringParameterElement = findParameterElement(
                        inputParameters,
                        'stringParam'
                    );
                    const stringParameterCombobox = getInputParameterComboboxElement(
                        stringParameterElement
                    );
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent('any value')
                    );
                    return resolveRenderCycles(() => {
                        stringParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                getParameter(
                                    coreActionElement.node.inputParameters,
                                    'stringParam'
                                ).value
                            ).toEqual({ value: 'any value', error: null });
                        });
                    });
                });
                it('update value when setting the variable number to the String Parameter', () => {
                    const stringParameterElement = findParameterElement(
                        inputParameters,
                        'stringParam'
                    );
                    const stringParameterCombobox = getInputParameterComboboxElement(
                        stringParameterElement
                    );
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent('{!numberVariable}')
                    );
                    return resolveRenderCycles(() => {
                        stringParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                getParameter(
                                    coreActionElement.node.inputParameters,
                                    'stringParam'
                                ).value
                            ).toEqual({
                                value: getElementGuid('numberVariable'),
                                error: null
                            });
                        });
                    });
                });
                it('update value when setting the empty string constant to the String Parameter', () => {
                    const stringParameterElement = findParameterElement(
                        inputParameters,
                        'stringParam'
                    );
                    const stringParameterCombobox = getInputParameterComboboxElement(
                        stringParameterElement
                    );
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent(
                            addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING)
                        )
                    );
                    return resolveRenderCycles(() => {
                        stringParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                getParameter(
                                    coreActionElement.node.inputParameters,
                                    'stringParam'
                                ).value
                            ).toEqual({
                                value: GLOBAL_CONSTANTS.EMPTY_STRING,
                                error: null
                            });
                        });
                    });
                });
                it('update value when setting the valid number to the Number Parameter', () => {
                    const numberParameterElement = findParameterElement(
                        inputParameters,
                        'numberParam'
                    );
                    const numberParameterCombobox = getInputParameterComboboxElement(
                        numberParameterElement
                    );
                    numberParameterCombobox.dispatchEvent(
                        textInputEvent('1234')
                    );
                    return resolveRenderCycles(() => {
                        numberParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                getParameter(
                                    coreActionElement.node.inputParameters,
                                    'numberParam'
                                ).value
                            ).toEqual({ value: '1234', error: null });
                        });
                    });
                });
                it('update value when setting the date variable to the Date Parameter', () => {
                    const dateParameterElement = findParameterElement(
                        inputParameters,
                        'dateParam'
                    );
                    const toggle = getLightningInputToggle(
                        dateParameterElement
                    );
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    return resolveRenderCycles(() => {
                        const dateParameterCombobox = getInputParameterComboboxElement(
                            dateParameterElement
                        );
                        dateParameterCombobox.dispatchEvent(
                            textInputEvent('{!dateVariable}')
                        );
                        return resolveRenderCycles(() => {
                            dateParameterCombobox.dispatchEvent(blurEvent);
                            return resolveRenderCycles(() => {
                                expect(
                                    getParameter(
                                        coreActionElement.node.inputParameters,
                                        'dateParam'
                                    ).value
                                ).toEqual({
                                    value: getElementGuid('dateVariable'),
                                    error: null
                                });
                            });
                        });
                    });
                });
                it('update value when setting the global constant to the Boolean Parameter', () => {
                    const booleanParameterElement = findParameterElement(
                        inputParameters,
                        'booleanParam'
                    );
                    const toggle = getLightningInputToggle(
                        booleanParameterElement
                    );
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    return resolveRenderCycles(() => {
                        const booleanParameterCombobox = getInputParameterComboboxElement(
                            booleanParameterElement
                        );
                        booleanParameterCombobox.dispatchEvent(
                            textInputEvent(
                                addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE)
                            )
                        );
                        return resolveRenderCycles(() => {
                            booleanParameterCombobox.dispatchEvent(blurEvent);
                            return resolveRenderCycles(() => {
                                expect(
                                    getParameter(
                                        coreActionElement.node.inputParameters,
                                        'booleanParam'
                                    ).value
                                ).toEqual({
                                    value: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
                                    error: null
                                });
                            });
                        });
                    });
                });
                it('show combobox when toggle is active', () => {
                    const accountColParameterElement = findParameterElement(
                        inputParameters,
                        'accountColParam'
                    );
                    const toggle = getLightningInputToggle(
                        accountColParameterElement
                    );
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    return resolveRenderCycles(() => {
                        verifyOptionalInputParameterWithValue(
                            accountColParameterElement,
                            'Account Collection Parameter',
                            ''
                        );
                    });
                });
                it('hide combobox when toggle is deactive', () => {
                    const numberParamElement = findParameterElement(
                        inputParameters,
                        'numberParam'
                    );
                    const toggle = getLightningInputToggle(numberParamElement);
                    toggle.dispatchEvent(toggleChangeEvent(false));
                    return resolveRenderCycles(() => {
                        verifyOptionalInputParameterNoValue(
                            numberParamElement,
                            'Number Parameter'
                        );
                    });
                });
                it('preserve value when toggle is reactive', () => {
                    const numberParamElement = findParameterElement(
                        inputParameters,
                        'numberParam'
                    );
                    const toggle = getLightningInputToggle(numberParamElement);
                    toggle.dispatchEvent(toggleChangeEvent(false));
                    return resolveRenderCycles(() => {
                        toggle.dispatchEvent(toggleChangeEvent(true));
                        return resolveRenderCycles(() => {
                            verifyOptionalInputParameterWithValue(
                                numberParamElement,
                                'Number Parameter',
                                '{!numberVariable}'
                            );
                        });
                    });
                });
            });
            describe('error cases', () => {
                let inputParameters;
                beforeEach(() => {
                    const coreActionElement = createComponentForTest(
                        actionNode
                    );
                    return resolveRenderCycles(() => {
                        inputParameters = getInputParameterItems(
                            coreActionElement
                        );
                    });
                });
                it('show the error if clearing the value of required input parameter', () => {
                    const stringParameterElement = findParameterElement(
                        inputParameters,
                        'stringParam'
                    );
                    const stringParameterCombobox = getInputParameterComboboxElement(
                        stringParameterElement
                    );
                    stringParameterCombobox.dispatchEvent(textInputEvent(''));
                    return resolveRenderCycles(() => {
                        stringParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(stringParameterCombobox.validity).toEqual(
                                VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                            );
                        });
                    });
                });
                it('show the error if entering the string for the Number Parameter', () => {
                    const numberParameterElement = findParameterElement(
                        inputParameters,
                        'numberParam'
                    );
                    const numberParameterCombobox = getInputParameterComboboxElement(
                        numberParameterElement
                    );
                    numberParameterCombobox.dispatchEvent(
                        textInputEvent('invalidNumber')
                    );
                    return resolveRenderCycles(() => {
                        numberParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(numberParameterCombobox.validity).toEqual(
                                VALIDATION_ERROR_MESSAGES.NUMBER_ERROR_MESSAGE
                            );
                        });
                    });
                });
                it('show the error if entering the string for the Account Parameter', () => {
                    const accountParameterElement = findParameterElement(
                        inputParameters,
                        'accountParam'
                    );
                    const accountParameterCombobox = getInputParameterComboboxElement(
                        accountParameterElement
                    );
                    accountParameterCombobox.dispatchEvent(
                        textInputEvent('any string')
                    );
                    return resolveRenderCycles(() => {
                        accountParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(accountParameterCombobox.validity).toEqual(
                                VALIDATION_ERROR_MESSAGES.GENERIC
                            );
                        });
                    });
                });
                it('show the error if entering the collection variable for the String Parameter', () => {
                    const stringParameterElement = findParameterElement(
                        inputParameters,
                        'stringParam'
                    );
                    const stringParameterCombobox = getInputParameterComboboxElement(
                        stringParameterElement
                    );
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent('{!stringCollectionVariable}')
                    );
                    return resolveRenderCycles(() => {
                        stringParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(stringParameterCombobox.validity).toEqual(
                                VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE
                            );
                        });
                    });
                });
                it('show the error if entering the string collection variable for the Account Collection Parameter', () => {
                    const accountColParameterElement = findParameterElement(
                        inputParameters,
                        'accountColParam'
                    );
                    const toggle = getLightningInputToggle(
                        accountColParameterElement
                    );
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    return resolveRenderCycles(() => {
                        const sObjectColParameterCombobox = getInputParameterComboboxElement(
                            accountColParameterElement
                        );
                        sObjectColParameterCombobox.dispatchEvent(
                            textInputEvent('{!stringCollectionVariable}')
                        );
                        return resolveRenderCycles(() => {
                            sObjectColParameterCombobox.dispatchEvent(
                                blurEvent
                            );
                            return resolveRenderCycles(() => {
                                expect(
                                    sObjectColParameterCombobox.validity
                                ).toEqual(
                                    VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE
                                );
                            });
                        });
                    });
                });
                it('show the error if entering the empty string constant for the Boolean Parameter', () => {
                    const booleanParameterElement = findParameterElement(
                        inputParameters,
                        'booleanParam'
                    );
                    const toggle = getLightningInputToggle(
                        booleanParameterElement
                    );
                    toggle.dispatchEvent(toggleChangeEvent(true));
                    return resolveRenderCycles(() => {
                        const booleanParameterCombobox = getInputParameterComboboxElement(
                            booleanParameterElement
                        );
                        booleanParameterCombobox.dispatchEvent(
                            textInputEvent(
                                addCurlyBraces(GLOBAL_CONSTANTS.EMPTY_STRING)
                            )
                        );
                        return resolveRenderCycles(() => {
                            booleanParameterCombobox.dispatchEvent(blurEvent);
                            return resolveRenderCycles(() => {
                                expect(
                                    booleanParameterCombobox.validity
                                ).toEqual(
                                    VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE
                                );
                            });
                        });
                    });
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
                    let coreActionElement,
                        inputParameters,
                        numberParameterItems;
                    beforeEach(() => {
                        if (
                            findIndex(
                                actionNode.inputParameters,
                                duplicatedNumberParam.rowIndex
                            ) === -1
                        ) {
                            actionNode.inputParameters.push(
                                duplicatedNumberParam
                            );
                        }
                        coreActionElement = createComponentForTest(actionNode);
                        return resolveRenderCycles(() => {
                            inputParameters = getInputParameterItems(
                                coreActionElement
                            );
                            numberParameterItems = filterParameterElements(
                                inputParameters,
                                'numberParam'
                            );
                        });
                    });
                    afterEach(() => {
                        const index = findIndex(
                            actionNode.inputParameters,
                            duplicatedNumberParam.rowIndex
                        );
                        if (index !== -1) {
                            actionNode.inputParameters.splice(index, 1);
                        }
                    });
                    it('show duplicated Number Parameter parameters', () => {
                        expect(numberParameterItems).toHaveLength(2);
                    });
                    it('show delete button', () => {
                        numberParameterItems.forEach(item => {
                            const deleteBtn = getDeleteButton(item);
                            expect(deleteBtn.iconName).toEqual(
                                'utility:delete'
                            );
                        });
                    });
                    it('delete duplicated parameter and update the row after deleting when clicking the delete button', () => {
                        // delete the second Number Parameter
                        const deleteBtn = getDeleteButton(
                            numberParameterItems[1]
                        );
                        deleteBtn.click();
                        return resolveRenderCycles(() => {
                            inputParameters = getInputParameterItems(
                                coreActionElement
                            );
                            numberParameterItems = filterParameterElements(
                                inputParameters,
                                'numberParam'
                            );
                            expect(numberParameterItems).toHaveLength(1);
                            verifyOptionalInputParameterWithValue(
                                numberParameterItems[0],
                                'Number Parameter',
                                '{!numberVariable}'
                            );
                        });
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
                    beforeEach(() => {
                        if (
                            findIndex(
                                actionNode.inputParameters,
                                notAvailableParam.rowIndex
                            ) === -1
                        ) {
                            actionNode.inputParameters.push(notAvailableParam);
                        }
                        const coreActionElement = createComponentForTest(
                            actionNode
                        );
                        return resolveRenderCycles(() => {
                            const inputParameters = getInputParameterItems(
                                coreActionElement
                            );
                            notAvailableItem = findParameterElement(
                                inputParameters,
                                'notAvailableParam'
                            );
                        });
                    });
                    afterEach(() => {
                        const index = findIndex(
                            actionNode.inputParameters,
                            notAvailableParam.rowIndex
                        );
                        if (index !== -1) {
                            actionNode.inputParameters.splice(index, 1);
                        }
                    });
                    it('show delete button', () => {
                        const deleteBtn = getDeleteButton(notAvailableItem);
                        expect(deleteBtn.iconName).toEqual('utility:delete');
                    });
                    it('do not show data type icon', () => {
                        const icon = getParameterIcon(notAvailableItem);
                        expect(icon).toBeNull();
                    });
                    it('show warning icon', () => {
                        const statusIcon = getWarningIcon(notAvailableItem);
                        expect(statusIcon).not.toBeNull();
                        expect(statusIcon.type).toBe('warning');
                        expect(statusIcon.messages).toEqual([
                            {
                                guid: expect.any(String),
                                messages: [
                                    {
                                        guid: expect.any(String),
                                        message:
                                            'FlowBuilderInvocableActionEditor.warningNotAvailable'
                                    }
                                ],
                                sectionInfo:
                                    'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                                title:
                                    'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                            }
                        ]);
                    });
                    it('show warning badge', () => {
                        const badgeCmp = getWarningBadge(notAvailableItem);
                        expect(badgeCmp).not.toBeNull();
                        expect(badgeCmp.label).toEqual(
                            'FlowBuilderInvocableActionEditor.badgeWillCauseErrors'
                        );
                        expect(badgeCmp.classList).toContain(
                            'slds-theme_warning'
                        );
                    });
                });
            });
        });
        describe('output div', () => {
            describe('valid cases', () => {
                let coreActionElement, outputParameters;
                beforeEach(() => {
                    coreActionElement = createComponentForTest(actionNode);
                    return resolveRenderCycles(() => {
                        outputParameters = getOutputParameterItems(
                            coreActionElement
                        );
                    });
                });
                it('show all output parameters', () => {
                    // output parameters: Output Account Parameter, Output Account
                    // Collection Parameter, Output Date Collection Parameter,
                    // Output Date Parameter, Output Number Collection Parameter,
                    // Output Number Parameter, Output String Collection Parameter,
                    // Output String Parameter
                    verifyOutputParameter(
                        outputParameters[0],
                        'Output Account Collection Parameter',
                        null
                    );
                    verifyOutputParameter(
                        outputParameters[1],
                        'Output Account Parameter',
                        null
                    );
                    verifyOutputParameter(
                        outputParameters[2],
                        'Output Date Collection Parameter',
                        null
                    );
                    verifyOutputParameter(
                        outputParameters[3],
                        'Output Date Parameter',
                        null
                    );
                    verifyOutputParameter(
                        outputParameters[4],
                        'Output Number Collection Parameter',
                        null
                    );
                    verifyOutputParameter(
                        outputParameters[5],
                        'Output Number Parameter',
                        '{!numberVariable}'
                    );
                    verifyOutputParameter(
                        outputParameters[6],
                        'Output String Collection Parameter',
                        null
                    );
                    verifyOutputParameter(
                        outputParameters[7],
                        'Output String Parameter',
                        '{!stringVariable}'
                    );
                });
                it('update value when setting the string variable to the Output String Parameter', () => {
                    const stringParameterElement = findParameterElement(
                        outputParameters,
                        'outputStringParam'
                    );
                    const stringParameterCombobox = getOutputParameterComboboxElement(
                        stringParameterElement
                    );
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent('{!stringVariable}')
                    );
                    return resolveRenderCycles(() => {
                        stringParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                getParameter(
                                    coreActionElement.node.outputParameters,
                                    'outputStringParam'
                                ).value
                            ).toEqual({
                                value: getElementGuid('stringVariable'),
                                error: null
                            });
                        });
                    });
                });
                it('update value when setting the number variable to the Output Number Parameter', () => {
                    const numberParameterElement = findParameterElement(
                        outputParameters,
                        'outputNumberParam'
                    );
                    const numberParameterCombobox = getOutputParameterComboboxElement(
                        numberParameterElement
                    );
                    numberParameterCombobox.dispatchEvent(
                        textInputEvent('{!numberVariable}')
                    );
                    return resolveRenderCycles(() => {
                        numberParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                getParameter(
                                    coreActionElement.node.outputParameters,
                                    'outputNumberParam'
                                ).value
                            ).toEqual({
                                value: getElementGuid('numberVariable'),
                                error: null
                            });
                        });
                    });
                });
                it('update value when setting the account variable to the Output Account Parameter', () => {
                    const accountParameterElement = findParameterElement(
                        outputParameters,
                        'outputAccountParam'
                    );
                    const accountParameterCombobox = getOutputParameterComboboxElement(
                        accountParameterElement
                    );
                    accountParameterCombobox.dispatchEvent(
                        textInputEvent('{!accountSObjectVariable}')
                    );
                    return resolveRenderCycles(() => {
                        accountParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                getParameter(
                                    coreActionElement.node.outputParameters,
                                    'outputAccountParam'
                                ).value
                            ).toEqual({
                                value: getElementGuid('accountSObjectVariable'),
                                error: null
                            });
                        });
                    });
                });
                it('update value when setting the account collection variable to the Output Account Collection Parameter', () => {
                    const accountColParameterElement = findParameterElement(
                        outputParameters,
                        'outputAccountColParam'
                    );
                    const accountColParameterCombobox = getOutputParameterComboboxElement(
                        accountColParameterElement
                    );
                    accountColParameterCombobox.dispatchEvent(
                        textInputEvent('{!accountSObjectCollectionVariable}')
                    );
                    return resolveRenderCycles(() => {
                        accountColParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                getParameter(
                                    coreActionElement.node.outputParameters,
                                    'outputAccountColParam'
                                ).value
                            ).toEqual({
                                value: getElementGuid(
                                    'accountSObjectCollectionVariable'
                                ),
                                error: null
                            });
                        });
                    });
                });
            });
            describe('error cases', () => {
                let outputParameters;
                beforeEach(() => {
                    const coreActionElement = createComponentForTest(
                        actionNode
                    );
                    return resolveRenderCycles(() => {
                        outputParameters = getOutputParameterItems(
                            coreActionElement
                        );
                    });
                });
                it('show the error if entering the litteral string for the Output String Parameter', () => {
                    const stringParameterElement = findParameterElement(
                        outputParameters,
                        'outputStringParam'
                    );
                    const stringParameterCombobox = getOutputParameterComboboxElement(
                        stringParameterElement
                    );
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent('any string')
                    );
                    return resolveRenderCycles(() => {
                        stringParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(stringParameterCombobox.validity).toEqual(
                                VALIDATION_ERROR_MESSAGES.GENERIC
                            );
                        });
                    });
                });
                it('show the error if entering the string variable for the Output Account Parameter', () => {
                    const accountParameterElement = findParameterElement(
                        outputParameters,
                        'outputAccountParam'
                    );
                    const accountParameterCombobox = getOutputParameterComboboxElement(
                        accountParameterElement
                    );
                    accountParameterCombobox.dispatchEvent(
                        textInputEvent('{!stringVariable}')
                    );
                    return resolveRenderCycles(() => {
                        accountParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(accountParameterCombobox.validity).toEqual(
                                VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE
                            );
                        });
                    });
                });
                it('show the error if entering the collection variable for the Output String Parameter', () => {
                    const stringParameterElement = findParameterElement(
                        outputParameters,
                        'outputStringParam'
                    );
                    const stringParameterCombobox = getOutputParameterComboboxElement(
                        stringParameterElement
                    );
                    stringParameterCombobox.dispatchEvent(
                        textInputEvent('{!stringCollectionVariable}')
                    );
                    return resolveRenderCycles(() => {
                        stringParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(stringParameterCombobox.validity).toEqual(
                                VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE
                            );
                        });
                    });
                });
                it('show the error if entering the string collection variable for the Output Account Collection Parameter', () => {
                    const accountColParameterElement = findParameterElement(
                        outputParameters,
                        'outputAccountColParam'
                    );
                    const sObjectColParameterCombobox = getOutputParameterComboboxElement(
                        accountColParameterElement
                    );
                    sObjectColParameterCombobox.dispatchEvent(
                        textInputEvent('{!stringCollectionVariable}')
                    );
                    return resolveRenderCycles(() => {
                        sObjectColParameterCombobox.dispatchEvent(blurEvent);
                        return resolveRenderCycles(() => {
                            expect(
                                sObjectColParameterCombobox.validity
                            ).toEqual(
                                VALIDATION_ERROR_MESSAGES.INVALID_DATA_TYPE
                            );
                        });
                    });
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
                    let coreActionElement,
                        outputParameters,
                        numberParameterItems;
                    beforeEach(() => {
                        if (
                            findIndex(
                                actionNode.outputParameters,
                                duplicatedNumberParam.rowIndex
                            ) === -1
                        ) {
                            actionNode.outputParameters.push(
                                duplicatedNumberParam
                            );
                        }
                        coreActionElement = createComponentForTest(actionNode);
                        return resolveRenderCycles(() => {
                            outputParameters = getOutputParameterItems(
                                coreActionElement
                            );
                            numberParameterItems = filterParameterElements(
                                outputParameters,
                                'outputNumberParam'
                            );
                        });
                    });
                    afterEach(() => {
                        const index = findIndex(
                            actionNode.outputParameters,
                            duplicatedNumberParam.rowIndex
                        );
                        if (index !== -1) {
                            actionNode.outputParameters.splice(index, 1);
                        }
                    });
                    it('show duplicated Number Parameter parameters', () => {
                        expect(numberParameterItems).toHaveLength(2);
                    });
                    it('show delete button', () => {
                        numberParameterItems.forEach(item => {
                            const deleteBtn = getDeleteButton(item);
                            expect(deleteBtn.iconName).toEqual(
                                'utility:delete'
                            );
                        });
                    });
                    it('delete duplicated parameter and update the row after deleting when clicking the delete button', () => {
                        // delete the second Number Parameter
                        const deleteBtn = getDeleteButton(
                            numberParameterItems[1]
                        );
                        deleteBtn.click();
                        return resolveRenderCycles(() => {
                            outputParameters = getOutputParameterItems(
                                coreActionElement
                            );
                            numberParameterItems = filterParameterElements(
                                outputParameters,
                                'outputNumberParam'
                            );
                            expect(numberParameterItems).toHaveLength(1);
                            verifyOutputParameter(
                                numberParameterItems[0],
                                'Output Number Parameter',
                                '{!numberVariable}'
                            );
                        });
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
                    beforeEach(() => {
                        if (
                            findIndex(
                                actionNode.inputParameters,
                                notAvailableParam.rowIndex
                            ) === -1
                        ) {
                            actionNode.outputParameters.push(notAvailableParam);
                        }
                        const coreActionElement = createComponentForTest(
                            actionNode
                        );
                        return resolveRenderCycles(() => {
                            const outputParameters = getOutputParameterItems(
                                coreActionElement
                            );
                            notAvailableItem = findParameterElement(
                                outputParameters,
                                'notAvailableParam'
                            );
                        });
                    });
                    afterEach(() => {
                        const index = findIndex(
                            actionNode.outputParameters,
                            notAvailableParam.rowIndex
                        );
                        if (index !== -1) {
                            actionNode.outputParameters.splice(index, 1);
                        }
                    });
                    it('show delete button', () => {
                        const deleteBtn = getDeleteButton(notAvailableItem);
                        expect(deleteBtn.iconName).toEqual('utility:delete');
                    });
                    it('do not show data type icon', () => {
                        const parameterIcon = getParameterIcon(
                            notAvailableItem
                        );
                        expect(parameterIcon).toBeNull();
                    });
                    it('show warning icon', () => {
                        const statusIcon = getWarningIcon(notAvailableItem);
                        expect(statusIcon).not.toBeNull();
                        expect(statusIcon.type).toBe('warning');
                        expect(statusIcon.messages).toEqual([
                            {
                                guid: expect.any(String),
                                messages: [
                                    {
                                        guid: expect.any(String),
                                        message:
                                            'FlowBuilderInvocableActionEditor.warningNotAvailable'
                                    }
                                ],
                                sectionInfo:
                                    'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                                title:
                                    'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle'
                            }
                        ]);
                    });
                    it('show warning badge', () => {
                        const badgeCmp = getWarningBadge(notAvailableItem);
                        expect(badgeCmp).not.toBeNull();
                        expect(badgeCmp.label).toEqual(
                            'FlowBuilderInvocableActionEditor.badgeWillCauseErrors'
                        );
                        expect(badgeCmp.classList).toContain(
                            'slds-theme_warning'
                        );
                    });
                });
            });
        });
    });
    describe('Flow with an action that has a text collection input parameter set to a text collection variable', () => {
        beforeAll(() => {
            setAuraFetch(
                auraFetch({
                    'c.getAllInvocableActionsForType': () => ({
                        data: mockActions
                    }),
                    'c.getInvocableActionParameters': getInvocableActionParameters(
                        {
                            submit: {
                                submit: submitForApprovalActionParameters
                            }
                        }
                    )
                })
            );
            const uiFlow = translateFlowToUIModel(
                flowWithApexActionSubmitForApproval
            );
            store.dispatch(updateFlow(uiFlow));
        });
        afterAll(() => {
            setAuraFetch();
        });
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
