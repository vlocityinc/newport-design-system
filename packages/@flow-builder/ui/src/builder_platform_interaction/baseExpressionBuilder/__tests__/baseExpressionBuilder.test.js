import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
// Importing using relative path here to ensure that we get the actual component and not the mocked version
import BaseExpressionBuilder from "../baseExpressionBuilder.js";
import { RowContentsChangedEvent, ComboboxStateChangedEvent } from "builder_platform_interaction/events";
import { numberVariableGuid, numberVariableDevName, stringVariableGuid,
    dateVariableGuid, currencyVariableGuid, assignmentElementGuid, accountSObjectVariableGuid, elements } from "mock/storeData";
import * as rulesMock from "builder_platform_interaction/ruleLib";
import * as expressionUtilsMock from "builder_platform_interaction/expressionUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { mockAccountFields, mockAccountFieldWithPicklist } from "mock/serverEntityData";
import { dateCollectionParam, dateParam } from "mock/ruleService";
import { FLOW_DATA_TYPE, FEROV_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { GLOBAL_CONSTANTS, setSystemVariables } from "builder_platform_interaction/systemLib";
import { addCurlyBraces } from "builder_platform_interaction/commonUtils";
import { systemVariables } from "mock/systemGlobalVars";
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-base-expression-builder', { is: BaseExpressionBuilder });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
}

const numberVariable = elements[numberVariableGuid];

function createDefaultFerToFerovComponentForTest(hideOperator = false, rhsIsFer = false) {
    const expressionBuilder = createComponentForTest({
        containerElement: ELEMENT_TYPE.ASSIGNMENT,
        rules: [],
        lhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(numberVariable),
        lhsParam: rulesMock.elementToParam(numberVariable),
        lhsIsField: false,
        lhsFields: null,
        lhsActivePicklistValues: null,
        showLhsAsFieldReference: true,
        rhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(numberVariable),
        rhsIsField: false,
        rhsFields: null,
        rhsLiteralsAllowed: true,
        rhsIsFer,
    });
    if (hideOperator) {
        expressionBuilder.hideOperator = true;
    } else {
        expressionBuilder.operatorValue = rulesMock.RULE_OPERATOR.ADD;
    }
    return expressionBuilder;
}

function createMockEmptyRHSExpression(lhsGuid) {
    const variable = elements[lhsGuid];
    const expressionBuilder = createComponentForTest({
        lhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(variable),
        lhsParam: rulesMock.elementToParam(variable),
        lhsIsField: false,
        lhsFields: null,
        lhsActivePicklistValues: null,
        showLhsAsFieldReference: true,
        operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
        rhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(numberVariable),
        rhsIsField: false,
        rhsFields: null,
        rhsLiteralsAllowed: true,
    });
    return expressionBuilder;
}

let ourCBChangeEvent;

const newCBValue = numberVariableGuid;

const lightningCBChangeEvent = new CustomEvent('change', {
    detail: {
        value: newCBValue
    }
});

const CBreturnItem = {
    value: elements[numberVariableGuid].guid,
    displayText: addCurlyBraces(elements[numberVariableGuid].name),
};

function getComboboxElements(expressionBuilder) {
    return getShadowRoot(expressionBuilder).querySelectorAll("builder_platform_interaction-combobox");
}

function getLightningCombobox(expressionBuilder) {
    return getShadowRoot(expressionBuilder).querySelector("lightning-combobox");
}

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        getLHSTypes: jest.fn(),
        getOperators: jest.fn().mockImplementation(() => {
            return ['Assign', 'Add'];
        }),
        getRHSTypes: jest.fn(),
        transformOperatorsForCombobox: jest.fn().mockReturnValue([]),
        elementToParam: require.requireActual('builder_platform_interaction/ruleLib').elementToParam,
        isCollectionRequired: jest.fn().mockReturnValue(false).mockName('isCollectionRequired'),
        RULE_OPERATOR: require.requireActual('builder_platform_interaction/ruleLib').RULE_OPERATOR,
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction/ruleLib').PARAM_PROPERTY,
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getStoreElements: require.requireActual('builder_platform_interaction/expressionUtils').getStoreElements,
        getElementsForMenuData: jest.fn().mockReturnValue([]),
        filterAndMutateMenuData: jest.fn().mockReturnValue([]),
        EXPRESSION_PROPERTY_TYPE: require.requireActual('builder_platform_interaction/expressionUtils').EXPRESSION_PROPERTY_TYPE,
        getResourceByUniqueIdentifier: require.requireActual('builder_platform_interaction/expressionUtils').getResourceByUniqueIdentifier,
        isElementAllowed: jest.fn().mockImplementation(() => false),
        sanitizeGuid: require.requireActual('builder_platform_interaction/dataMutationLib').sanitizeGuid,
        filterFieldsForChosenElement: require.requireActual('builder_platform_interaction/expressionUtils').filterFieldsForChosenElement,
        OPERATOR_DISPLAY_OPTION: require.requireActual('builder_platform_interaction/expressionUtils').OPERATOR_DISPLAY_OPTION,
        getFerovDataTypeForValidId: require.requireActual('builder_platform_interaction/expressionUtils').getFerovDataTypeForValidId,
        mutateFlowResourceToComboboxShape: require.requireActual('builder_platform_interaction/expressionUtils').mutateFlowResourceToComboboxShape,
        mutateFieldToComboboxShape: require.requireActual('builder_platform_interaction/expressionUtils').mutateFieldToComboboxShape,
        LHS_DISPLAY_OPTION: require.requireActual('builder_platform_interaction/expressionUtils').LHS_DISPLAY_OPTION,
        getSecondLevelItems: require.requireActual('builder_platform_interaction/expressionUtils').getSecondLevelItems,
    };
});

const labels = ['lhsLabel', 'operatorLabel', 'rhsLabel'];
const placeholders = ['lhsPlaceholder', 'operatorPlaceholder', 'rhsPlaceholder'];

describe('base expression builder', () => {
    beforeEach(() => {
        ourCBChangeEvent = new ComboboxStateChangedEvent(CBreturnItem);
    });
    describe('label sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${labels[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
                    lhsLabel: "LHS",
                    operatorLabel: "operator",
                    rhsLabel: "RHS"
                });
                expect(expressionBuilder[labels[i]]).toBeDefined();
            });
        }
    });

    describe('placeholder sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${placeholders[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
                    lhsPlaceholder: "LHS",
                    operatorPlaceholder: "operator",
                    rhsPlaceholder: "RHS"
                });
                expect(expressionBuilder[placeholders[i]]).toBeDefined();
            });
        }
    });

    describe('basic set up', () => {
        it('should set lhs menu data based on container element', () => {
            const expressionBuilder = createComponentForTest({
                rules: [],
                containerElement: ELEMENT_TYPE.ASSIGNMENT,
                lhsFields: null,
                lhsDisplayOption: expressionUtilsMock.LHS_DISPLAY_OPTION.NOT_FIELD,
                showLhsAsFieldReference: true,
            });
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];

            expect(rulesMock.getLHSTypes).toHaveBeenCalled();
            expect(expressionUtilsMock.filterAndMutateMenuData).toHaveBeenCalled();
            expect(lhsCombobox.menuData).toBeDefined();
        });
    });

    describe('handling value change events from combobox', () => {
        it('should throw RowContentsChangedEvent with new value when LHS value changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const expressionUpdates = {[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: numberVariableGuid, error: null}};
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: expressionUpdates}});
            });
        });
        it('should throw RowContentsChangedEvent with new value & error when LHS value changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const error = 'error';
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: CBreturnItem.displayText, error},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: '', error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: '', error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {value: '', error: null},
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                const changeEvent = new ComboboxStateChangedEvent(CBreturnItem, CBreturnItem.displayText, error);
                lhsCombobox.dispatchEvent(changeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: expressionUpdates}});
            });
        });
        it('should throw RowContentsChangedEvent with new value when operator changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            return Promise.resolve().then(() => {
                const expressionUpdates = {[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: newCBValue}};
                const operatorCombobox = getLightningCombobox(expressionBuilder);

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                operatorCombobox.dispatchEvent(lightningCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: expressionUpdates}});
            });
        });
        it('should throw RowContentsChangedEvent with new value when RHS changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const expressionUpdates = {};
                expressionUpdates[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = {value: addCurlyBraces(numberVariableDevName), error: null};
                expressionUpdates[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE] = {value: FEROV_DATA_TYPE.REFERENCE, error: null};
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                rhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: expressionUpdates}});
            });
        });
        it('should throw RowContentsChangedEvent with new value & error when RHS value changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const error = 'error';
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: CBreturnItem.displayText, error},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {value: null, error: null},
                };
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                const changeEvent = new ComboboxStateChangedEvent(CBreturnItem, CBreturnItem.displayText, error);
                rhsCombobox.dispatchEvent(changeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: expressionUpdates}});
            });
        });
        it('should throw RowContentsChangedEvent with new values when LHS value changes, and operator/RHS become invalid', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            rulesMock.getOperators.mockReturnValueOnce([rulesMock.RULE_OPERATOR.ASSIGN]);

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: numberVariableGuid, error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: '', error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: '', error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {value: '', error: null},
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: expressionUpdates}});
            });
        });
        it('should throw RowContentsChangedEvent with new values when operator value changes, and RHS becomes invalid', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            expressionUtilsMock.isElementAllowed.mockReturnValueOnce(false);

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: newCBValue, error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: '', error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {value: '', error: null},
                };
                const operatorCombobox = getLightningCombobox(expressionBuilder);

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                operatorCombobox.dispatchEvent(lightningCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: expressionUpdates}});
            });
        });
        it('should throw RowContentsChangedEvent with new values when there is no operator and LHS change invalidates RHS', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(true);

            rulesMock.getOperators.mockReturnValueOnce([rulesMock.RULE_OPERATOR.ASSIGN]);

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: numberVariableGuid, error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: '', error: null},
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {value: '', error: null},
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: expressionUpdates}});
            });
        });
        it('should throw RowContentsChangedEvent with only one value representing RHS when RHS is FER', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(true, true);

            rulesMock.getOperators.mockReturnValueOnce([rulesMock.RULE_OPERATOR.ASSIGN]);

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: numberVariableGuid, error: null},
                };
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                rhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                const actualUpdates = eventCallback.mock.calls[0][0].detail.newValue;
                expect(actualUpdates).toMatchObject(expressionUpdates);
                expect(actualUpdates[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]).not.toBeDefined();
                expect(actualUpdates[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID]).not.toBeDefined();
            });
        });
        it('should add an error if given an LHS that does not exist and no error', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(true, false);

            rulesMock.getOperators.mockReturnValueOnce([rulesMock.RULE_OPERATOR.ASSIGN]);

            return Promise.resolve().then(() => {
                const invalidValue = 'invalid';
                const displayText = 'displayText';
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: displayText, error: genericErrorMessage},
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                lhsCombobox.dispatchEvent(new ComboboxStateChangedEvent({
                    value: invalidValue,
                }, displayText));

                expect(eventCallback).toHaveBeenCalled();
                const actualUpdates = eventCallback.mock.calls[0][0].detail.newValue;
                expect(actualUpdates).toMatchObject(expressionUpdates);
            });
        });
        it('should add an error if given an RHS that does not exist and no error', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(true, false);

            rulesMock.getOperators.mockReturnValueOnce([rulesMock.RULE_OPERATOR.ASSIGN]);

            return Promise.resolve().then(() => {
                const invalidValue = 'invalid';
                const displayText = 'displayText';
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: displayText, error: genericErrorMessage},
                };
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent({
                    value: invalidValue,
                }, displayText));

                expect(eventCallback).toHaveBeenCalled();
                const actualUpdates = eventCallback.mock.calls[0][0].detail.newValue;
                expect(actualUpdates).toMatchObject(expressionUpdates);
            });
        });
    });
    describe('building expression from existing item', () => {
        it('should populate operator menu if LHS is set', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const operatorCombobox = getLightningCombobox(expressionBuilder);
            expect(rulesMock.getOperators).toHaveBeenCalled();
            expect(operatorCombobox.options).toBeDefined();
        });
        it('should populate rhs menu data', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                expect(rulesMock.getRHSTypes).toHaveBeenCalled();
                expect(rhsCombobox.menuData).toBeDefined();
            });
        });
        it('should populate the expression builder with values from the store', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            return Promise.resolve().then(() => {
                const comboboxes = getComboboxElements(expressionBuilder);
                const lhsCombobox = comboboxes[0];
                const operatorCombobox = getLightningCombobox(expressionBuilder);
                expect(lhsCombobox.value.displayText).toEqual(addCurlyBraces(numberVariableDevName));
                expect(operatorCombobox.value).toEqual(rulesMock.RULE_OPERATOR.ADD);
            }).then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                expect(rhsCombobox.value.displayText).toEqual(addCurlyBraces(numberVariableDevName));
            });
        });
    });
    describe('building expression for picklist values', () => {
        const accountVariable = expressionUtilsMock.mutateFlowResourceToComboboxShape(elements[accountSObjectVariableGuid]);
        const accountField = mockAccountFieldWithPicklist.AccountSource;

        const picklistLabel = 'Picklist Values';
        const picklistApiValue = 'AccountSource';
        // for testing picklist menu data we will mock picklist menu items
        expressionUtilsMock.getElementsForMenuData.mockReturnValue([{label: picklistLabel, items: [{value: picklistApiValue}]}]);

        afterAll(() => {
            expressionUtilsMock.getElementsForMenuData.mockClear();
        });

        it('should throw RowContentsChangedEvent with matching picklist item when selecting picklist menu item', () => {
            const expressionBuilder = createComponentForTest({
                lhsValue: expressionUtilsMock.mutateFieldToComboboxShape(accountField, accountVariable, true, true),
                lhsParam: rulesMock.elementToParam(accountField),
                lhsIsField: true,
                lhsFields: mockAccountFields,
                lhsActivePicklistValues: accountField.picklistValues,
                showLhsAsFieldReference: true,
                operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true,
            });
            const item = {
                value: 'Advertisement',
                displayText: 'Advertisement',
            };
            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);
            ourCBChangeEvent = new ComboboxStateChangedEvent(item);
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(ourCBChangeEvent);
            return Promise.resolve().then(() => {
                const newExpression = eventCallback.mock.calls[0][0].detail.newValue;
                expect(eventCallback).toHaveBeenCalled();
                expect(newExpression[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].value).toEqual(item.value);
                expect(newExpression[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE].value).toEqual(FLOW_DATA_TYPE.STRING.value);
            });
        });
    });
    describe('building expression for global constants', () => {
        it('should throw RowContentsChangedEvent with correct dataType', () => {
            const expressionBuilder = createComponentForTest({
                lhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(numberVariable),
                lhsParam: rulesMock.elementToParam(numberVariable),
                lhsIsField: false,
                lhsFields: null,
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true,
            });
            const item = {
                displayText: addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_TRUE),
                value: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
            };
            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);
            ourCBChangeEvent = new ComboboxStateChangedEvent(item);
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(ourCBChangeEvent);
            return Promise.resolve().then(() => {
                const newExpression = eventCallback.mock.calls[0][0].detail.newValue;
                expect(eventCallback).toHaveBeenCalled();
                expect(newExpression[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].value).toEqual(item.displayText);
                expect(newExpression[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE].value).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
    describe('building expression for system variable', () => {
        it('should know system variables are "reference"', () => {
            setSystemVariables(systemVariables);
            const stringVariable = elements[stringVariableGuid];
            const expressionBuilder = createComponentForTest({
                lhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(stringVariable),
                lhsParam: rulesMock.elementToParam(stringVariable),
                lhsIsField: false,
                lhsFields: null,
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true,
            });
            const systemVariable = '$Flow.CurrentRecord';
            const item = {
                displayText: addCurlyBraces(systemVariable),
                value: systemVariable,
            };
            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);
            ourCBChangeEvent = new ComboboxStateChangedEvent(item);
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(ourCBChangeEvent);
            return Promise.resolve().then(() => {
                const newExpression = eventCallback.mock.calls[0][0].detail.newValue;
                expect(eventCallback).toHaveBeenCalled();
                expect(newExpression[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].value).toEqual(item.displayText);
                expect(newExpression[expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE].value).toEqual(FEROV_DATA_TYPE.REFERENCE);
            });
        });
    });
    describe('RHS literals-allowed can be determined by parent', () => {
        it('rhs literals should not be allowed by default', () => {
            const expressionBuilder = createComponentForTest({
                lhsValue: null,
                lhsParam: null,
                lhsDisplayOption: expressionUtilsMock.LHS_DISPLAY_OPTION.NOT_FIELD,
                lhsFields: null,
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: null,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeFalsy();
        });
        it('when rhs literals-allowed has been set to true, & rhs can be a scalar, literals should be allowed', () => {
            rulesMock.getRHSTypes.mockReturnValue({ 'Date' : [dateParam]});
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeTruthy();
            rulesMock.getRHSTypes.mockReturnValue();
        });
        it('when rhs literal is allowed by context but RHS must be collection, literals should not be allowed', () => {
            rulesMock.isCollectionRequired.mockReturnValueOnce(true);
            rulesMock.getRHSTypes.mockReturnValue({ 'Date' : [dateCollectionParam]});
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeFalsy();
            rulesMock.getRHSTypes.mockReturnValue();
        });
    });
    describe('Based on LHS/Operator combination...', () => {
        const multipleRHSTypes = {
            String: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'String',
            }],
            Number: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'Number',
            }],
            Currency: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'Currency',
            }],
            Date: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'Date',
            }],
        };

        const booleanRHSType = {
            Boolean: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'Boolean',
            }],
        };

        beforeAll(() => {
            rulesMock.getRHSTypes.mockReturnValue(multipleRHSTypes);
        });

        afterAll(() => {
            rulesMock.getRHSTypes.mockReturnValue();
        });

        it('RHS datatype should be set to String', () => {
            const expressionBuilder = createMockEmptyRHSExpression(stringVariableGuid);
            // first promise needed to create the component
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, 'foobar'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.STRING.value);
                });
            });
        });

        it('RHS datatype should be set to Number', () => {
            const expressionBuilder = createMockEmptyRHSExpression(numberVariableGuid);
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '123'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.NUMBER.value);
                });
            });
        });

        it('RHS datatype should be set to Currency', () => {
            const expressionBuilder = createMockEmptyRHSExpression(currencyVariableGuid);
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '123'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.CURRENCY.value);
                });
            });
        });

        it('RHS datatype should be set to Date', () => {
            const expressionBuilder = createMockEmptyRHSExpression(dateVariableGuid);

            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '1/1/2018'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.DATE.value);
                });
            });
        });

        it('RHS datatype should be set to Element', () => {
            rulesMock.getRHSTypes.mockReturnValueOnce(booleanRHSType);
            const expressionBuilder = createMockEmptyRHSExpression(assignmentElementGuid, true);

            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, 'true'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
                });
            });
        });
    });
});
