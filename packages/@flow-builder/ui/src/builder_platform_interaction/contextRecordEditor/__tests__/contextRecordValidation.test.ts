// @ts-nocheck
import { createElement } from 'lwc';
import { contextValidation, getRules } from '../contextRecordValidation';
import contextRecordEditor from '../contextRecordEditor';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasBeforeSaveEnabled: jest.fn()
    });
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: actual.getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: actual.EXPRESSION_PROPERTY_TYPE,
        getChildrenItemsPromise: actual.getChildrenItemsPromise,
        filterMatches: actual.filterMatches
    };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn(),
        isExecuteOnlyWhenChangeMatchesConditionsPossible: jest.fn().mockReturnValue(true)
    };
});

const scheduledNewStartElementWithFilters = () => ({
    description: { value: '', error: null },
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: '', error: null },
    name: { value: '', error: null },
    object: { value: 'Account', error: null },
    objectIndex: { value: 'guid', error: null },
    filterLogic: { value: CONDITION_LOGIC.AND, error: null },
    filters: [
        {
            rowIndex: 'a0e8a02d-60fb-4481-8165-10a01fe7031c',
            leftHandSide: { value: 'Account.BillingAddress', error: null },
            operator: { value: 'EqualTo', error: null },
            rightHandSide: { value: 'my address', error: null },
            rightHandSideDataType: { value: 'String', error: null }
        }
    ],
    frequency: { value: 'Once', error: null },
    startDate: undefined,
    startTime: undefined,
    triggerType: { value: FLOW_TRIGGER_TYPE.SCHEDULED, error: null }
});

const beforeSaveNewStartElement = () => ({
    description: { value: '', error: null },
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: '', error: null },
    name: { value: '', error: null },
    object: { value: 'Account', error: null },
    objectIndex: { value: 'guid', error: null },
    filterLogic: { value: CONDITION_LOGIC.NO_CONDITIONS, error: null },
    filters: [],
    frequency: undefined,
    startDate: undefined,
    startTime: undefined,
    recordTriggerType: { value: 'Update', error: null },
    triggerType: { value: FLOW_TRIGGER_TYPE.BEFORE_SAVE, error: null }
});

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-context-record-editor', { is: contextRecordEditor });
    if (node) {
        el.node = node;
    }
    document.body.appendChild(el);
    return el;
}

const validate = node => {
    const rules = getRules(node);
    return getErrorsFromHydratedElement(contextValidation.validateAll(node, rules));
};

describe('Check validations', () => {
    describe('filterLogic with Schedule trigger Type Flow', () => {
        let startElement;
        beforeEach(() => {
            startElement = scheduledNewStartElementWithFilters();
        });
        it('should return an error if filterLogic is empty', () => {
            startElement.filterLogic = { value: '', error: null };
            const editor = createComponentForTest(startElement);
            const errors = validate(editor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('filterLogic');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if filterLogic is blank', () => {
            startElement.filterLogic = { value: '     ', error: null };
            const editor = createComponentForTest(startElement);
            const errors = validate(editor.node);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('filterLogic');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('No filterLogic with DML Trigger Type Flow', () => {
        let startElement;
        beforeEach(() => {
            startElement = beforeSaveNewStartElement();
        });
        it('should not return an error if filterLogic is empty', () => {
            startElement.filterLogic = { value: '', error: null };
            const editor = createComponentForTest(startElement);
            const errors = validate(editor.node);
            expect(errors).toHaveLength(0);
        });
        it('should not return an error if filterLogic is blank', () => {
            startElement.filterLogic = { value: '     ', error: null };
            const editor = createComponentForTest(startElement);
            const errors = validate(editor.node);
            expect(errors).toHaveLength(0);
        });
    });
});
