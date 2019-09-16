import { createElement } from 'lwc';
import BaseExpressionBuilder from '../baseExpressionBuilder.js';
import {
    RowContentsChangedEvent,
    ComboboxStateChangedEvent
} from 'builder_platform_interaction/events';
import {
    getElementByGuid,
    numberVariable,
    stringVariable,
    dateVariable,
    currencyVariable,
    assignmentElement,
    accountSObjectVariable
} from 'mock/storeData';
import * as rulesMock from 'builder_platform_interaction/ruleLib';
import * as expressionUtilsMock from 'builder_platform_interaction/expressionUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { dateCollectionParam, dateParam } from 'mock/ruleService';
import {
    FLOW_DATA_TYPE,
    FEROV_DATA_TYPE
} from 'builder_platform_interaction/dataTypeLib';
import {
    GLOBAL_CONSTANTS,
    setSystemVariables
} from 'builder_platform_interaction/systemLib';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';
import { systemVariablesForFlow as systemVariables } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

function createComponentForTest(props) {
    const el = createElement(
        'builder_platform_interaction-base-expression-builder',
        { is: BaseExpressionBuilder }
    );
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

function createDefaultFerToFerovComponentForTest(
    hideOperator = false,
    rhsIsFer = false
) {
    const expressionBuilder = createComponentForTest({
        containerElement: ELEMENT_TYPE.ASSIGNMENT,
        rules: [],
        lhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(
            numberVariable
        ),
        lhsParam: rulesMock.elementToParam(numberVariable),
        lhsIsField: false,
        lhsFields: null,
        lhsActivePicklistValues: null,
        showLhsAsFieldReference: true,
        rhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(
            numberVariable
        ),
        rhsIsField: false,
        rhsFields: null,
        rhsLiteralsAllowed: true,
        rhsIsFer
    });
    if (hideOperator) {
        expressionBuilder.hideOperator = true;
        expressionBuilder.operatorIconName = 'utility:assignment';
    } else {
        expressionBuilder.operatorValue = rulesMock.RULE_OPERATOR.ADD;
    }
    return expressionBuilder;
}

function createMockEmptyRHSExpression(lhsGuid) {
    const variable = getElementByGuid(lhsGuid);
    const expressionBuilder = createComponentForTest({
        lhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(
            variable
        ),
        lhsParam: rulesMock.elementToParam(variable),
        lhsIsField: false,
        lhsFields: null,
        lhsActivePicklistValues: null,
        showLhsAsFieldReference: true,
        operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
        rhsValue: '',
        rhsIsField: false,
        rhsFields: null,
        rhsLiteralsAllowed: true
    });
    return expressionBuilder;
}

let ourCBChangeEvent;

const newCBValue = numberVariable.guid;

const lightningCBChangeEvent = new CustomEvent('change', {
    detail: {
        value: newCBValue
    }
});

const CBreturnItem = {
    value: numberVariable.guid,
    displayText: addCurlyBraces(numberVariable.name)
};

function getComboboxElements(expressionBuilder) {
    return expressionBuilder.shadowRoot.querySelectorAll(
        'builder_platform_interaction-combobox'
    );
}

function getLightningCombobox(expressionBuilder) {
    return expressionBuilder.shadowRoot.querySelector('lightning-combobox');
}

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        getLHSTypes: jest.fn(),
        getOperators: jest.fn().mockImplementation(() => {
            return ['Assign', 'Add'];
        }),
        getRHSTypes: jest.fn(),
        getDataType: actual.getDataType,
        transformOperatorsForCombobox: jest.fn().mockImplementation(values =>
            values.map(value => ({ label: 'some label', value }))
        ),
        elementToParam: actual.elementToParam,
        isCollectionRequired: jest
            .fn()
            .mockReturnValue(false)
            .mockName('isCollectionRequired'),
        RULE_OPERATOR: actual.RULE_OPERATOR,
        PARAM_PROPERTY: actual.PARAM_PROPERTY
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = require.requireActual(
        '../../expressionUtils/expressionUtils.js'
    );
    return {
        getStoreElements: actual.getStoreElements,
        getElementsForMenuData: jest.fn().mockReturnValue([]),
        filterAndMutateMenuData: jest.fn().mockReturnValue([]),
        EXPRESSION_PROPERTY_TYPE: actual.EXPRESSION_PROPERTY_TYPE,
        getResourceByUniqueIdentifier: actual.getResourceByUniqueIdentifier,
        isElementAllowed: jest.fn().mockImplementation(() => false),
        sanitizeGuid: require.requireActual(
            '../../dataMutationLib/dataMutationLib.js'
        ).sanitizeGuid,
        filterFieldsForChosenElement: actual.filterFieldsForChosenElement,
        OPERATOR_DISPLAY_OPTION: actual.OPERATOR_DISPLAY_OPTION,
        getFerovDataTypeForValidId: actual.getFerovDataTypeForValidId,
        mutateFlowResourceToComboboxShape:
            actual.mutateFlowResourceToComboboxShape,
        mutateFieldToComboboxShape: actual.mutateFieldToComboboxShape,
        LHS_DISPLAY_OPTION: actual.LHS_DISPLAY_OPTION,
        getSecondLevelItems: actual.getSecondLevelItems
    };
});

const labels = ['lhsLabel', 'operatorLabel', 'rhsLabel'];
const placeholders = [
    'lhsPlaceholder',
    'operatorPlaceholder',
    'rhsPlaceholder'
];

describe('base expression builder', () => {
    beforeAll(() => {
        ourCBChangeEvent = new ComboboxStateChangedEvent(CBreturnItem);
    });
    describe('label sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${labels[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
                    lhsLabel: 'LHS',
                    operatorLabel: 'operator',
                    rhsLabel: 'RHS'
                });
                expect(expressionBuilder[labels[i]]).toBeDefined();
            });
        }
    });

    describe('placeholder sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${placeholders[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
                    lhsPlaceholder: 'LHS',
                    operatorPlaceholder: 'operator',
                    rhsPlaceholder: 'RHS'
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
                lhsDisplayOption:
                    expressionUtilsMock.LHS_DISPLAY_OPTION.NOT_FIELD,
                showLhsAsFieldReference: true,
                lhsMustBeWritable: true
            });
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];

            expect(rulesMock.getLHSTypes).toHaveBeenCalled();
            expect(
                expressionUtilsMock.filterAndMutateMenuData
            ).toHaveBeenCalled();
            expect(lhsCombobox.menuData).toBeDefined();
        });
        it('should not pass allowed param types to lhs combobox', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            expect(lhsCombobox.allowedParamTypes).toBeFalsy();
        });
        it('should pass allowed param types to rhs combobox by default', () => {
            const params = { Date: [dateParam] };
            rulesMock.getRHSTypes.mockReturnValueOnce(params);
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.allowedParamTypes).toMatchObject(params);
        });
        it('should not pass allowed param types to rhs combobox when rhs is fer', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(
                false,
                true
            );
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.allowedParamTypes).toBeFalsy();
        });
        it('should show operator icon if hideOperator is true & icon name is passed', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(
                true
            );

            return Promise.resolve().then(() => {
                expect(
                    expressionBuilder.shadowRoot.querySelector('lightning-icon')
                ).toBeDefined();
                // make sure operator combobox is not present
                expect(
                    expressionBuilder.shadowRoot.querySelector(
                        'lightning-combobox'
                    )
                ).toBeNull();
            });
        });
        it('should pass the default operator if the operator value is not set', () => {
            const defaultOperator = 'someDefaultValue';
            const expressionBuilder = createComponentForTest({
                defaultOperator
            });
            const operatorCombobox = expressionBuilder.shadowRoot.querySelector(
                'lightning-combobox'
            );

            expect(operatorCombobox.value).toEqual(defaultOperator);
        });
        it('should pass the default operator as a menu option when the operator value is not set', () => {
            const defaultOperator = 'someDefaultValue';
            const expressionBuilder = createComponentForTest({
                defaultOperator,
                containerElement: ELEMENT_TYPE.ASSIGNMENT
            });
            const operatorCombobox = expressionBuilder.shadowRoot.querySelector(
                'lightning-combobox'
            );

            expect(operatorCombobox.options).toEqual([
                { label: expect.anything(), value: defaultOperator }
            ]);
        });
    });

    describe('handling value change events from combobox', () => {
        it('should throw RowContentsChangedEvent with new value when LHS value changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .LEFT_HAND_SIDE]: {
                        value: numberVariable.guid,
                        error: null
                    }
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { newValue: expressionUpdates }
                });
            });
        });
        it('should throw RowContentsChangedEvent with new value & error when LHS value changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const error = 'error';
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .LEFT_HAND_SIDE]: {
                        value: CBreturnItem.displayText,
                        error
                    },
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: '',
                        error: null
                    },
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .RIGHT_HAND_SIDE]: { value: '', error: null }
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                const changeEvent = new ComboboxStateChangedEvent(
                    CBreturnItem,
                    CBreturnItem.displayText,
                    error
                );
                lhsCombobox.dispatchEvent(changeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { newValue: expressionUpdates }
                });
            });
        });
        it('should throw RowContentsChangedEvent with new value when operator changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: newCBValue
                    }
                };
                const operatorCombobox = getLightningCombobox(
                    expressionBuilder
                );

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                operatorCombobox.dispatchEvent(lightningCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { newValue: expressionUpdates }
                });
            });
        });
        it('should throw RowContentsChangedEvent with new value when RHS changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const expressionUpdates = {};
                expressionUpdates[
                    expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE
                ] = { value: numberVariable.guid, error: null };
                expressionUpdates[
                    expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE
                ] = { value: FEROV_DATA_TYPE.REFERENCE, error: null };
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                rhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { newValue: expressionUpdates }
                });
            });
        });
        it('should throw RowContentsChangedEvent with new value & error when RHS value changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const error = 'error';
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .RIGHT_HAND_SIDE]: {
                        value: CBreturnItem.displayText,
                        error
                    },
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .RIGHT_HAND_SIDE_DATA_TYPE]: {
                        value: null,
                        error: null
                    }
                };
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                const changeEvent = new ComboboxStateChangedEvent(
                    CBreturnItem,
                    CBreturnItem.displayText,
                    error
                );
                rhsCombobox.dispatchEvent(changeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { newValue: expressionUpdates }
                });
            });
        });
        it('should throw RowContentsChangedEvent with new values when LHS value changes, and operator/RHS become invalid', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            rulesMock.getOperators.mockReturnValueOnce([
                rulesMock.RULE_OPERATOR.ASSIGN
            ]);

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .LEFT_HAND_SIDE]: {
                        value: numberVariable.guid,
                        error: null
                    },
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: '',
                        error: null
                    },
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .RIGHT_HAND_SIDE]: { value: '', error: null }
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { newValue: expressionUpdates }
                });
            });
        });
        it('should throw RowContentsChangedEvent with new values when operator value changes, and RHS becomes invalid', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            expressionUtilsMock.isElementAllowed.mockReturnValueOnce(false);

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: newCBValue,
                        error: null
                    },
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .RIGHT_HAND_SIDE]: { value: '', error: null }
                };
                const operatorCombobox = getLightningCombobox(
                    expressionBuilder
                );

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                operatorCombobox.dispatchEvent(lightningCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { newValue: expressionUpdates }
                });
            });
        });
        it('should throw RowContentsChangedEvent with new values when there is no operator and LHS change invalidates RHS', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(
                true
            );

            rulesMock.getOperators.mockReturnValueOnce([
                rulesMock.RULE_OPERATOR.ASSIGN
            ]);

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .LEFT_HAND_SIDE]: {
                        value: numberVariable.guid,
                        error: null
                    },
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .RIGHT_HAND_SIDE]: { value: '', error: null }
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { newValue: expressionUpdates }
                });
            });
        });
        it('should throw RowContentsChangedEvent with only one value representing RHS when RHS is FER', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(
                true,
                true
            );

            rulesMock.getOperators.mockReturnValueOnce([
                rulesMock.RULE_OPERATOR.ASSIGN
            ]);

            return Promise.resolve().then(() => {
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .RIGHT_HAND_SIDE]: {
                        value: numberVariable.guid,
                        error: null
                    }
                };
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                rhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                const actualUpdates =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(actualUpdates).toMatchObject(expressionUpdates);
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .RIGHT_HAND_SIDE_DATA_TYPE
                    ]
                ).not.toBeDefined();
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .RIGHT_HAND_SIDE_GUID
                    ]
                ).not.toBeDefined();
            });
        });
        it('should add an error if given an LHS that does not exist and no error', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(
                true,
                false
            );

            rulesMock.getOperators.mockReturnValueOnce([
                rulesMock.RULE_OPERATOR.ASSIGN
            ]);

            return Promise.resolve().then(() => {
                const invalidValue = 'invalid';
                const displayText = 'displayText';
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .LEFT_HAND_SIDE]: {
                        value: displayText,
                        error: genericErrorMessage
                    }
                };
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                lhsCombobox.dispatchEvent(
                    new ComboboxStateChangedEvent(
                        {
                            value: invalidValue
                        },
                        displayText
                    )
                );

                expect(eventCallback).toHaveBeenCalled();
                const actualUpdates =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(actualUpdates).toMatchObject(expressionUpdates);
            });
        });
        it('should show the generic error below the LHS if a list of operators is empty', () => {
            rulesMock.getOperators.mockReturnValueOnce([]);
            const expressionBuilder = createComponentForTest({
                containerElement: ELEMENT_TYPE.ASSIGNMENT,
                rules: [],
                lhsValue: 'RepairProcedure__c',
                lhsParam: null,
                lhsIsField: false,
                lhsFields: {},
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true
            });

            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            expect(lhsCombobox.value).toEqual('RepairProcedure__c');
            expect(lhsCombobox.errorMessage).toEqual(genericErrorMessage);
        });
        it('should add an error if given an RHS that does not exist and no error', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest(
                true,
                false
            );

            rulesMock.getOperators.mockReturnValueOnce([
                rulesMock.RULE_OPERATOR.ASSIGN
            ]);

            return Promise.resolve().then(() => {
                const invalidValue = 'invalid';
                const displayText = 'displayText';
                const expressionUpdates = {
                    [expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                        .RIGHT_HAND_SIDE]: {
                        value: displayText,
                        error: genericErrorMessage
                    }
                };
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(
                    RowContentsChangedEvent.EVENT_NAME,
                    eventCallback
                );

                rhsCombobox.dispatchEvent(
                    new ComboboxStateChangedEvent(
                        {
                            value: invalidValue
                        },
                        displayText
                    )
                );

                expect(eventCallback).toHaveBeenCalled();
                const actualUpdates =
                    eventCallback.mock.calls[0][0].detail.newValue;
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
            return Promise.resolve()
                .then(() => {
                    const comboboxes = getComboboxElements(expressionBuilder);
                    const lhsCombobox = comboboxes[0];
                    const operatorCombobox = getLightningCombobox(
                        expressionBuilder
                    );
                    expect(lhsCombobox.value.displayText).toEqual(
                        addCurlyBraces(numberVariable.name)
                    );
                    expect(operatorCombobox.value).toEqual(
                        rulesMock.RULE_OPERATOR.ADD
                    );
                })
                .then(() => {
                    const rhsCombobox = getComboboxElements(
                        expressionBuilder
                    )[1];
                    expect(rhsCombobox.value.displayText).toEqual(
                        addCurlyBraces(numberVariable.name)
                    );
                });
        });
        it('should populate operator menu with the item operator if lhs fields is empty', () => {
            // lhsParam is null if we cannot get this entity field (no access ...)
            const expressionBuilder = createComponentForTest({
                lhsValue: 'RepairProcedure__c.Model__c',
                lhsParam: null,
                lhsIsField: true,
                lhsFields: {},
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true
            });
            return Promise.resolve().then(() => {
                const operatorCombobox = getLightningCombobox(
                    expressionBuilder
                );
                expect(operatorCombobox.value).toEqual(
                    rulesMock.RULE_OPERATOR.ASSIGN
                );
            });
        });
        it('should reset to default operator when LHS value is cleared', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const defaultOperator = 'Assign';
            expressionBuilder.defaultOperator = defaultOperator;

            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(
                RowContentsChangedEvent.EVENT_NAME,
                eventCallback
            );

            const item = {
                value: '',
                displayText: ''
            };
            const comboboxChangeEvent = new ComboboxStateChangedEvent(item);
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            lhsCombobox.dispatchEvent(comboboxChangeEvent);

            return Promise.resolve().then(() => {
                const actualUpdates =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .LEFT_HAND_SIDE
                    ].value
                ).toEqual('');
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR
                    ].value
                ).toEqual(defaultOperator);
            });
        });

        it('should reset to default operator when LHS value is changed, the operator is invalid, and the default operator is valid', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const defaultOperator = 'Assign';
            expressionBuilder.defaultOperator = defaultOperator;
            expressionBuilder.operatorValue = 'SomeRandomOperator';

            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(
                RowContentsChangedEvent.EVENT_NAME,
                eventCallback
            );

            const item = expressionUtilsMock.mutateFlowResourceToComboboxShape(
                stringVariable
            );
            const comboboxChangeEvent = new ComboboxStateChangedEvent(item);
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            lhsCombobox.dispatchEvent(comboboxChangeEvent);

            return Promise.resolve().then(() => {
                const actualUpdates =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .LEFT_HAND_SIDE
                    ].value
                ).toEqual(item.value);
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR
                    ].value
                ).toEqual(defaultOperator);
            });
        });

        it('should clear the operator when LHS value is changed and the default operator is invalid', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const defaultOperator = 'SomeBadOperator';
            expressionBuilder.operatorValue = 'SomeRandomOperator';
            expressionBuilder.defaultOperator = defaultOperator;

            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(
                RowContentsChangedEvent.EVENT_NAME,
                eventCallback
            );

            const item = expressionUtilsMock.mutateFlowResourceToComboboxShape(
                stringVariable
            );
            const comboboxChangeEvent = new ComboboxStateChangedEvent(item);
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            lhsCombobox.dispatchEvent(comboboxChangeEvent);

            return Promise.resolve().then(() => {
                const actualUpdates =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .LEFT_HAND_SIDE
                    ].value
                ).toEqual(item.value);
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR
                    ].value
                ).toEqual('');
            });
        });

        it('should reset to default operator when LHS value is changed and the operator is not valid', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const defaultOperator = 'Assign';
            expressionBuilder.defaultOperator = defaultOperator;
            expressionBuilder.operatorValue = 'SomeRandomOperator';

            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(
                RowContentsChangedEvent.EVENT_NAME,
                eventCallback
            );

            const item = expressionUtilsMock.mutateFlowResourceToComboboxShape(
                stringVariable
            );
            const comboboxChangeEvent = new ComboboxStateChangedEvent(item);
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            lhsCombobox.dispatchEvent(comboboxChangeEvent);
            return Promise.resolve().then(() => {
                const actualUpdates =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .LEFT_HAND_SIDE
                    ].value
                ).toEqual(item.value);
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR
                    ].value
                ).toEqual(defaultOperator);
            });
        });

        it('should not reset the operator when LHS value is changed and the operator is still valid', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const defaultOperator = 'Assign';
            expressionBuilder.defaultOperator = defaultOperator;

            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(
                RowContentsChangedEvent.EVENT_NAME,
                eventCallback
            );

            const item = expressionUtilsMock.mutateFlowResourceToComboboxShape(
                stringVariable
            );
            const comboboxChangeEvent = new ComboboxStateChangedEvent(item);
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            lhsCombobox.dispatchEvent(comboboxChangeEvent);

            return Promise.resolve().then(() => {
                const actualUpdates =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .LEFT_HAND_SIDE
                    ].value
                ).toEqual(item.value);
                expect(
                    actualUpdates[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE.OPERATOR
                    ].value
                ).toEqual(expressionBuilder.operatorValue);
            });
        });
    });
    describe('building expression for picklist values', () => {
        const accountVariable = expressionUtilsMock.mutateFlowResourceToComboboxShape(
            accountSObjectVariable
        );
        const accountField = accountFields.AccountSource;

        const picklistLabel = 'Picklist Values';
        const picklistApiValue = 'AccountSource';
        // for testing picklist menu data we will mock picklist menu items
        expressionUtilsMock.getElementsForMenuData.mockReturnValue([
            { label: picklistLabel, items: [{ value: picklistApiValue }] }
        ]);

        afterAll(() => {
            expressionUtilsMock.getElementsForMenuData.mockClear();
        });

        it('should throw RowContentsChangedEvent with matching picklist item when selecting picklist menu item', () => {
            const expressionBuilder = createComponentForTest({
                lhsValue: expressionUtilsMock.mutateFieldToComboboxShape(
                    accountField,
                    accountVariable,
                    true,
                    true
                ),
                lhsParam: rulesMock.elementToParam(accountField),
                lhsIsField: true,
                lhsFields: accountFields,
                lhsActivePicklistValues: accountField.activePicklistValues,
                showLhsAsFieldReference: true,
                operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true
            });
            const item = {
                value:
                    accountField.activePicklistValues[0].value +
                    '-' +
                    accountField.activePicklistValues[0].label,
                displayText: accountField.activePicklistValues[0].value
            };
            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(
                RowContentsChangedEvent.EVENT_NAME,
                eventCallback
            );
            ourCBChangeEvent = new ComboboxStateChangedEvent(item);
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(ourCBChangeEvent);
            return Promise.resolve().then(() => {
                const newExpression =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(eventCallback).toHaveBeenCalled();
                expect(
                    newExpression[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .RIGHT_HAND_SIDE
                    ].value
                ).toEqual(item.displayText);
                expect(
                    newExpression[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .RIGHT_HAND_SIDE_DATA_TYPE
                    ].value
                ).toEqual(FLOW_DATA_TYPE.STRING.value);
            });
        });
    });
    describe('building expression for global constants', () => {
        it('should throw RowContentsChangedEvent with correct dataType', () => {
            const expressionBuilder = createComponentForTest({
                lhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(
                    numberVariable
                ),
                lhsParam: rulesMock.elementToParam(numberVariable),
                lhsIsField: false,
                lhsFields: null,
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true
            });
            const item = {
                displayText: addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_TRUE),
                value: GLOBAL_CONSTANTS.BOOLEAN_TRUE
            };
            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(
                RowContentsChangedEvent.EVENT_NAME,
                eventCallback
            );
            ourCBChangeEvent = new ComboboxStateChangedEvent(item);
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(ourCBChangeEvent);
            return Promise.resolve().then(() => {
                const newExpression =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(eventCallback).toHaveBeenCalled();
                expect(
                    newExpression[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .RIGHT_HAND_SIDE
                    ].value
                ).toEqual(item.value);
                expect(
                    newExpression[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .RIGHT_HAND_SIDE_DATA_TYPE
                    ].value
                ).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
    describe('building expression for system variable', () => {
        it('should know system variables are "reference"', () => {
            setSystemVariables(systemVariables);
            const strVariable = stringVariable;
            const expressionBuilder = createComponentForTest({
                lhsValue: expressionUtilsMock.mutateFlowResourceToComboboxShape(
                    strVariable
                ),
                lhsParam: rulesMock.elementToParam(strVariable),
                lhsIsField: false,
                lhsFields: null,
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: rulesMock.RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true
            });
            const systemVariable = '$Flow.CurrentRecord';
            const item = {
                displayText: addCurlyBraces(systemVariable),
                value: systemVariable
            };
            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(
                RowContentsChangedEvent.EVENT_NAME,
                eventCallback
            );
            ourCBChangeEvent = new ComboboxStateChangedEvent(item);
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(ourCBChangeEvent);
            return Promise.resolve().then(() => {
                const newExpression =
                    eventCallback.mock.calls[0][0].detail.newValue;
                expect(eventCallback).toHaveBeenCalled();
                expect(
                    newExpression[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .RIGHT_HAND_SIDE
                    ].value
                ).toEqual(item.value);
                expect(
                    newExpression[
                        expressionUtilsMock.EXPRESSION_PROPERTY_TYPE
                            .RIGHT_HAND_SIDE_DATA_TYPE
                    ].value
                ).toEqual(FEROV_DATA_TYPE.REFERENCE);
            });
        });
    });
    describe('RHS literals-allowed can be determined by parent', () => {
        it('rhs literals should not be allowed by default', () => {
            const expressionBuilder = createComponentForTest({
                lhsValue: null,
                lhsParam: null,
                lhsDisplayOption:
                    expressionUtilsMock.LHS_DISPLAY_OPTION.NOT_FIELD,
                lhsFields: null,
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: null,
                rhsValue: null,
                rhsIsField: false,
                rhsFields: null
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeFalsy();
        });
        it('when rhs literals-allowed has been set to true, & rhs can be a scalar, literals should be allowed', () => {
            rulesMock.getRHSTypes.mockReturnValue({ Date: [dateParam] });
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeTruthy();
            rulesMock.getRHSTypes.mockReturnValue();
        });
        it('when rhs literal is allowed by context but RHS must be collection, literals should not be allowed', () => {
            rulesMock.isCollectionRequired.mockReturnValueOnce(true);
            rulesMock.getRHSTypes.mockReturnValue({
                Date: [dateCollectionParam]
            });
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeFalsy();
            rulesMock.getRHSTypes.mockReturnValue();
        });
    });
    describe('Based on LHS/Operator combination...', () => {
        const multipleRHSTypes = {
            String: [
                {
                    paramType: 'Data',
                    mustBeElements: [ELEMENT_TYPE.VARIABLE],
                    dataType: 'String'
                }
            ],
            Number: [
                {
                    paramType: 'Data',
                    mustBeElements: [ELEMENT_TYPE.VARIABLE],
                    dataType: 'Number'
                }
            ],
            Currency: [
                {
                    paramType: 'Data',
                    mustBeElements: [ELEMENT_TYPE.VARIABLE],
                    dataType: 'Currency'
                }
            ],
            Date: [
                {
                    paramType: 'Data',
                    mustBeElements: [ELEMENT_TYPE.VARIABLE],
                    dataType: 'Date'
                }
            ]
        };

        const numberAndCurrencyTypes = {
            Number: [
                {
                    paramType: 'Data',
                    mustBeElements: [ELEMENT_TYPE.VARIABLE],
                    dataType: 'Number'
                }
            ],
            Currency: [
                {
                    paramType: 'Data',
                    mustBeElements: [ELEMENT_TYPE.VARIABLE],
                    dataType: 'Currency'
                }
            ]
        };

        const booleanRHSType = {
            Boolean: [
                {
                    paramType: 'Data',
                    mustBeElements: [ELEMENT_TYPE.VARIABLE],
                    dataType: 'Boolean'
                }
            ]
        };

        beforeAll(() => {
            rulesMock.getRHSTypes.mockReturnValue(multipleRHSTypes);
        });

        afterAll(() => {
            rulesMock.getRHSTypes.mockReturnValue();
        });

        it('RHS datatype should be set to String', () => {
            const expressionBuilder = createMockEmptyRHSExpression(
                stringVariable.guid
            );
            // first promise needed to create the component
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(
                    new ComboboxStateChangedEvent(null, 'foobar')
                );
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(
                        FLOW_DATA_TYPE.STRING.value
                    );
                });
            });
        });

        it('RHS datatype should be set to Number', () => {
            const expressionBuilder = createMockEmptyRHSExpression(
                numberVariable.guid
            );
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(
                    new ComboboxStateChangedEvent(null, '123')
                );
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(
                        FLOW_DATA_TYPE.NUMBER.value
                    );
                });
            });
        });

        it('RHS datatype should be set to Currency', () => {
            const expressionBuilder = createMockEmptyRHSExpression(
                currencyVariable.guid
            );
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(
                    new ComboboxStateChangedEvent(null, '123')
                );
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(
                        FLOW_DATA_TYPE.CURRENCY.value
                    );
                });
            });
        });

        it('RHS datatype should be set to Date', () => {
            const expressionBuilder = createMockEmptyRHSExpression(
                dateVariable.guid
            );

            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(
                    new ComboboxStateChangedEvent(null, '1/1/2018')
                );
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.DATE.value);
                });
            });
        });

        it('RHS datatype should be set to Element', () => {
            rulesMock.getRHSTypes.mockReturnValue(booleanRHSType);
            const expressionBuilder = createMockEmptyRHSExpression(
                assignmentElement.guid,
                true
            );

            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(
                    new ComboboxStateChangedEvent(null, 'true')
                );
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(
                        FLOW_DATA_TYPE.BOOLEAN.value
                    );
                });
            });
        });

        it('RHS datatype should be set to Number regardless of LHS type if options are number and currency', () => {
            rulesMock.getRHSTypes.mockReturnValue(numberAndCurrencyTypes);
            const expressionBuilder = createMockEmptyRHSExpression(
                dateVariable.guid,
                true
            );

            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.NUMBER.value);
            });
        });
    });
});
