import { createElement } from 'lwc';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import FilterConditionList from '../filterConditionList';
import { LABELS } from '../filterConditionListLabels';
import { deepQuerySelector, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import {
    AddConditionEvent,
    UpdateConditionEvent,
    DeleteConditionEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import {
    cachePropertiesForClass,
    getPropertiesForClass,
    setApexClasses
} from 'builder_platform_interaction/apexTypeLib';
import { APEX_SORT_COMPATIBLE_TYPES } from 'builder_platform_interaction/sortEditorLib';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';

jest.mock('builder_platform_interaction/ferToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/ferToFerovExpressionBuilder')
);

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

let mockAccountFieldsPromise = Promise.resolve(accountFields);
jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => mockAccountFieldsPromise),
    getEntity: jest.fn().mockImplementation((entityName) => mockEntities.find(({ apiName }) => apiName === entityName))
}));

const selectors = {
    conditionList: INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST,
    conditionCombobox: LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_CONDITION_COMBOBOX,
    lightningInput: LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT,
    fieldExpressionBuilder: INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER,
    ferExpressionBuilder: INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER
};

const conditionLogicOptions = [
    {
        value: CONDITION_LOGIC.AND,
        label: LABELS.andConditionLogicLabel
    },
    {
        value: CONDITION_LOGIC.OR,
        label: LABELS.orConditionLogicLabel
    },
    {
        value: CONDITION_LOGIC.CUSTOM_LOGIC,
        label: LABELS.customLogicLabel
    },
    {
        value: 'formula_evaluates_to_true',
        label: LABELS.formulaOptionLabel
    }
];

const mockSObjectConditions = [
    {
        operator: { value: 'EqualTo', error: null },
        leftHandSide: { value: 'Account.AccountSource', error: null },
        rightHandSide: { value: 'web', error: null },
        rightHandSideDataType: { value: 'picklist', error: null },
        rowIndex: 'sc1'
    }
];

const mockApexTypeConditions = [
    {
        operator: { value: 'Contains', error: null },
        leftHandSide: { value: 'name', error: null },
        rightHandSide: { value: 'test', error: null },
        rightHandSideDataType: { value: 'string', error: null },
        rowIndex: 'sc1'
    }
];

const mockPrimitiveConditions = [
    {
        operator: { value: 'StartsWith', error: null },
        leftHandSide: { value: '{!currentItem_input}', error: null },
        rightHandSide: { value: 'foobar', error: null },
        rightHandSideDataType: { value: 'string', error: null },
        rowIndex: 'pc1'
    },
    {
        operator: { value: 'StartsWith', error: null },
        leftHandSide: { value: '{!currentItem_input}', error: null },
        rightHandSide: { value: 'bar', error: null },
        rightHandSideDataType: { value: 'string', error: null },
        rowIndex: 'pc2'
    },
    {
        operator: { value: 'Contains', error: null },
        leftHandSide: { value: '{!currentItem_input}', error: null },
        rightHandSide: { value: 'xyz', error: null },
        rightHandSideDataType: { value: 'string', error: null },
        rowIndex: 'pc3'
    }
];

const sobjectType = { value: 'Account', isSObject: true };
const apexTypeRef = { value: 'ApexComplexTypeTestOne216', isApexClass: true };
const testCustomLogic = '(1 or 2) and 3';

const getConditionLogicCombobox = (filterCmp) =>
    deepQuerySelector(filterCmp, [selectors.conditionList, selectors.conditionCombobox]);

const createComponentUnderTest = (inputs) => {
    const {
        conditionLogic = { value: CONDITION_LOGIC.AND },
        conditions = [],
        sobjectOrApexReference = null,
        formulaExpression = null
    } = inputs;
    const el = createElement('builder_platform_interaction-filter-condition-list', {
        is: FilterConditionList
    });
    Object.assign(el, {
        sobjectOrApexReference,
        elementGuid: { value: '12345', error: null },
        conditionLogic,
        conditions,
        formulaExpression
    });
    setDocumentBodyChildren(el);
    return el;
};

const getFilterableFields = (entity: Object) => {
    return Object.values(entity).filter((field) => field.filterable);
};

const getApexClassSortableFields = (apexClassProps: Object) => {
    return Object.values(apexClassProps).filter(
        (property) => !property.isCollection && APEX_SORT_COMPATIBLE_TYPES.includes(property.dataType)
    );
};

describe('filter-condition-list', () => {
    describe('Initial state for SObject input collections', () => {
        let element, fldExpressionBuilders, conditionLogicCombobox;
        beforeAll(() => {
            element = createComponentUnderTest({
                sobjectOrApexReference: sobjectType,
                conditions: mockSObjectConditions
            });
            conditionLogicCombobox = getConditionLogicCombobox(element);
            fldExpressionBuilders = element.shadowRoot.querySelectorAll(selectors.fieldExpressionBuilder);
        });
        beforeEach(() => {
            mockAccountFieldsPromise = Promise.resolve(accountFields);
        });
        it('should contain four conditon logic options', () => {
            expect(conditionLogicCombobox.options).toEqual(conditionLogicOptions);
        });
        it('should have correct labels for condition logic options', () => {
            expect(conditionLogicCombobox.options[0].label).toBe('FlowBuilderConditionList.andConditionLogicLabel');
            expect(conditionLogicCombobox.options[1].label).toBe('FlowBuilderConditionList.orConditionLogicLabel');
            expect(conditionLogicCombobox.options[2].label).toBe('FlowBuilderConditionList.customConditionLogicLabel');
            expect(conditionLogicCombobox.options[3].label).toBe('FlowBuilderFilterEditor.formulaOptionLabel');
        });
        it('condition logic AND should be selected', () => {
            expect(getConditionLogicCombobox(element).value).toBe(CONDITION_LOGIC.AND);
        });
        it('Custom condition logic input should not be displayed', () => {
            const customLogicInput = deepQuerySelector(element, [selectors.conditionList, selectors.lightningInput]);
            expect(customLogicInput).toBeNull();
        });
        it('should contain condition list', () => {
            expect(element.shadowRoot.querySelector(selectors.conditionList)).not.toBeNull();
        });
        it('should contain field expression builders only', () => {
            expect(fldExpressionBuilders).not.toBeNull();
            expect(fldExpressionBuilders).toHaveLength(mockSObjectConditions.length);
            const ferExpressionBuilders = element.shadowRoot.querySelectorAll(selectors.ferExpressionBuilder);
            expect(ferExpressionBuilders).toHaveLength(0);
        });
        it('should have lhs label', () => {
            expect(fldExpressionBuilders[0].lhsLabel).toBe('FlowBuilderFilterEditor.lhsLabel');
        });
        it('should have lhs placeholder text', () => {
            expect(fldExpressionBuilders[0].lhsPlaceholder).toBe('FlowBuilderFilterEditor.lhsPlaceholder');
        });
        it('should have operator label', () => {
            expect(fldExpressionBuilders[0].operatorLabel).toBe('FlowBuilderFilterEditor.operatorLabel');
        });
        it('should have rhs label', () => {
            expect(fldExpressionBuilders[0].rhsLabel).toBe('FlowBuilderFilterEditor.rhsLabel');
        });
        it('populates all filterable fields', () => {
            let actualFields: Object = {},
                expectedFields: Object = {};
            actualFields = element.recordFields;
            expectedFields = getFilterableFields(accountFields);
            // assert api names of received and expected object equal
            const actualApiNames = Object.values(actualFields).map((p) => p.apiName);
            const expectedApiNames = Object.values(expectedFields).map((p) => p.apiName);
            expect(actualApiNames).toEqual(expectedApiNames);
        });
    });

    describe('Initial state for apex defined type input collections', () => {
        let element, apexClassProps;
        beforeAll(() => {
            setApexClasses(apexTypesForFlow);
            cachePropertiesForClass('ApexComplexTypeTestOne216');
            element = createComponentUnderTest({
                sobjectOrApexReference: apexTypeRef,
                conditions: mockApexTypeConditions
            });
            apexClassProps = getPropertiesForClass('ApexComplexTypeTestOne216');
        });
        afterAll(() => {
            setApexClasses(null);
        });
        it('should display field expression builder', () => {
            expect(element.shadowRoot.querySelectorAll(selectors.fieldExpressionBuilder)).toHaveLength(1);
            expect(element.shadowRoot.querySelector(selectors.ferExpressionBuilder)).toBeNull();
        });
        it('populates filterable fields for lhs on initial load', () => {
            let actual: Object = {},
                expected: Object = {};
            actual = element.recordFields;
            expected = getApexClassSortableFields(apexClassProps);
            // compare api names of received and expected object
            actual = Object.values(actual).map((p) => p.apiName);
            expected = Object.values(expected).map((p) => p.apiName);
            expect(actual).toEqual(expected);
        });
    });

    describe('Initial state for primitive type input collections', () => {
        let element, conditionLogicCombobox, ferExpressionBuilders;
        beforeAll(() => {
            element = createComponentUnderTest({
                conditionLogic: { value: testCustomLogic },
                sobjectOrApexReference: { value: 'string', error: null },
                conditions: mockPrimitiveConditions
            });
            conditionLogicCombobox = getConditionLogicCombobox(element);
            ferExpressionBuilders = element.shadowRoot.querySelectorAll(selectors.ferExpressionBuilder);
        });
        it('should contain correct conditon logic options', () => {
            expect(conditionLogicCombobox.options).toEqual(conditionLogicOptions);
        });
        it('"Custom Logic" should be selected ', () => {
            expect(getConditionLogicCombobox(element).value).toBe(CONDITION_LOGIC.CUSTOM_LOGIC);
        });
        it('Custom condition logic input should be displayed', async () => {
            await ticks(1);
            const customLogicInput = deepQuerySelector(element, [selectors.conditionList, selectors.lightningInput]);
            expect(customLogicInput).not.toBeNull();
            expect(customLogicInput.value).toBe(testCustomLogic);
        });
        it('should contain condition list', () => {
            expect(element.shadowRoot.querySelector(selectors.conditionList)).not.toBeNull();
        });
        it('should contain ferov expression builders only', () => {
            expect(ferExpressionBuilders).not.toBeNull();
            expect(ferExpressionBuilders).toHaveLength(mockPrimitiveConditions.length);
            const fldExpressionBuilders = element.shadowRoot.querySelectorAll(selectors.fieldExpressionBuilder);
            expect(fldExpressionBuilders).toHaveLength(0);
        });
        it('should disable input in lhs of expression builder', () => {
            for (let i = 0; i < ferExpressionBuilders.length; i++) {
                expect(ferExpressionBuilders[i].lhsMustBeWritable).toEqual(false);
            }
        });
    });

    describe('Add conditions', () => {
        it('fires addConditionEvent', async () => {
            const element = createComponentUnderTest({ sobjectOrApexReference: sobjectType });
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(AddConditionEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new AddConditionEvent('fakeguid'));
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('Update conditions', () => {
        it('fires updateConditionEvent', async () => {
            const mockCondition = {
                leftValueReference: 'ref',
                leftHandSide: {
                    value: 'foo',
                    error: 'nullstr'
                },
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'updated'
                }
            };
            // create a test element with some conditions in it
            const element = createComponentUnderTest({ sobjectOrApexReference: sobjectType });
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(UpdateConditionEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new UpdateConditionEvent('guid', 0, mockCondition));
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('Delete conditions', () => {
        it('fires deleteConditionEvent', async () => {
            const element = createComponentUnderTest({
                sobjectOrApexReference: sobjectType,
                conditions: mockSObjectConditions
            });
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(DeleteConditionEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new DeleteConditionEvent('guid', 1));
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('Property changed', () => {
        it('fires propertyChangedEvent', async () => {
            const element = createComponentUnderTest({
                sobjectOrApexReference: sobjectType,
                conditions: mockSObjectConditions
            });
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.OR));
            expect(eventCallback).toHaveBeenCalled();
        });
    });
});
