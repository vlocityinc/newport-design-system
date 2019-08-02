import { createElement } from 'lwc';
import FerToFerovExpressionBuilder from 'builder_platform_interaction/ferToFerovExpressionBuilder';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import {
    setRules,
    getRulesForElementType,
    RULE_TYPES
} from 'builder_platform_interaction/ruleLib';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import * as selectorsMock from 'builder_platform_interaction/selectors';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as store from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const SELECTORS = {
    BASE_EXPRESSION_BUILDER:
        'builder_platform_interaction-base-expression-builder',
    COMBOBOX: 'builder_platform_interaction-combobox'
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: () => mockAccountFields
    };
});

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        writableElementsSelector: jest.fn()
    };
});

const createComponentForTest = expression => {
    const el = createElement(
        'builder_platform_interaction-fer-to-ferov-expression-builder',
        {
            is: FerToFerovExpressionBuilder
        }
    );
    el.containerElement = ELEMENT_TYPE.ASSIGNMENT;
    el.rules = getRulesForElementType(
        RULE_TYPES.ASSIGNMENT,
        ELEMENT_TYPE.ASSIGNMENT
    );
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
    '               "collection":false,' +
    '               "canBeSobjectField":"CanBe",' +
    '               "mustBeElements":["VARIABLE"]' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '   }]';

let populatedRHSSObjectFieldExpression;
let ferToFerovExpressionBuilder;

beforeEach(() => {
    selectorsMock.writableElementsSelector.mockReturnValue([
        store.elements[store.stringVariableGuid]
    ]);
    setRules(mockSingleAssignmentRule);
    populatedRHSSObjectFieldExpression = {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            value: store.stringVariableGuid,
            error: null
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: 'Assign',
            error: null
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: store.accountSObjectVariableGuid + '.Description',
            error: null
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
            value: 'reference',
            error: null
        }
    };
    ferToFerovExpressionBuilder = createComponentForTest(
        populatedRHSSObjectFieldExpression
    );
});

const describeSkip = describe.skip;
describeSkip('Expression Builder', () => {
    it('should populate rhs menu data when there is an sobject variable field reference in rhs', () => {
        const baseExpressionBuilder = ferToFerovExpressionBuilder.shadowRoot.querySelector(
            SELECTORS.BASE_EXPRESSION_BUILDER
        );
        const rhsCombobox = baseExpressionBuilder.shadowRoot.querySelectorAll(
            SELECTORS.COMBOBOX
        )[1];
        expect(rhsCombobox.menuData.length).toBeGreaterThan(0);
        expect(rhsCombobox.menuData[0].value).toBe(
            store.accountSObjectVariableGuid + '.Description'
        );
    });
});
