import { createElement } from 'lwc';
import ExpressionBuilder from "builder_platform_interaction/expressionBuilder";
import { getShadowRoot } from 'lwc-test-utils';
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { setRules } from "builder_platform_interaction/ruleLib";
import { mockAccountFields } from "mock/serverEntityData";
import * as selectorsMock from "builder_platform_interaction/selectors";
import * as store from "mock/storeData";

const SELECTORS = {
    COMBOBOX: 'builder_platform_interaction-combobox'
};

jest.mock('builder_platform_interaction-sobject-lib', () => {
    return {
        getFieldsForEntity: (entityName, callback) => {
            callback(mockAccountFields);
        }
    };
});

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        writableElementsSelector: jest.fn()
    };
});

const createComponentForTest = (expression) => {
    const el = createElement('builder_platform_interaction-expression-builder', {
        is: ExpressionBuilder
    });
    el.configuration = {elementType: 'ASSIGNMENT'};
    el.expression = expression;
    document.body.appendChild(el);
    return el;
};

const mockSingleAssignmentRule =
    '[{' +
    '       "ruleType": "assignment",' +
    '       "assignmentOperator":{"value":"Assign"},' +
    '       "comparisonOperator":null,' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":"String",' +
    '           "elementType":null,' +
    '           "collection":false,' +
    '           "canBeSobjectField":"CanBe"' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":"String",' +
    '               "elementType":null,' +
    '               "collection":false,' +
    '               "canBeSobjectField":"CanBe",' +
    '               "canBeElements":["VARIABLE"]' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '   }]';

let populatedRHSSObjectFieldExpression;
let expressionBuilder;

beforeEach(() => {
    selectorsMock.writableElementsSelector.mockReturnValue([store.elements[store.stringVariableGuid]]);
    setRules(mockSingleAssignmentRule);
    populatedRHSSObjectFieldExpression = {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            value: store.stringVariableGuid,
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: 'Assign',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: '{!' + store.accountSObjectVariableDevName + '.Description}',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
            value: 'reference',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID]: {
            value: store.accountSObjectVariableGuid + '.Description',
            error: null,
        }
    };
    expressionBuilder = createComponentForTest(populatedRHSSObjectFieldExpression);
});

describe('Expression Builder', () => {
    it('should populate rhs menu data when there is an sobject variable field reference in rhs', () => {
        const rhsCombobox = getShadowRoot(expressionBuilder).querySelectorAll(SELECTORS.COMBOBOX)[1];
        expect(rhsCombobox.menuData.length).toBeGreaterThan(0);
        expect(rhsCombobox.menuData[0].value).toBe(store.accountSObjectVariableGuid + '.Description');
    });
});