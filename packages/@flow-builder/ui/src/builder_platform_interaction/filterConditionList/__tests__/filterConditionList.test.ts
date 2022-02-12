import {
    cachePropertiesForClass,
    getPropertiesForClass,
    setApexClasses
} from 'builder_platform_interaction/apexTypeLib';
import {
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import {
    AddConditionEvent,
    DeleteConditionEvent,
    PropertyChangedEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction/events';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { APEX_SORT_COMPATIBLE_TYPES } from 'builder_platform_interaction/sortEditorLib';
import { createElement } from 'lwc';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import FilterConditionList from '../filterConditionList';
import { LABELS } from '../filterConditionListLabels';
const { format } = commonUtils;

jest.mock('builder_platform_interaction/ferToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/ferToFerovExpressionBuilder')
);

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
// sobject filterable field
let mockAccountFieldsPromise = Promise.resolve(accountFields);
jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => mockAccountFieldsPromise),
    getEntity: jest.fn().mockImplementation((entityName) => mockEntities.find(({ apiName }) => apiName === entityName))
}));
// resourced text area
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
// mock orgHasFlowFormulaBuilder
const mockedContextLib = require('builder_platform_interaction_mocks/contextLib');
jest.mock('builder_platform_interaction/contextLib', () => require('builder_platform_interaction_mocks/contextLib'));
// mock getProcessType, getTriggerType, getRecordTriggerType
jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getProcessType: jest.fn(),
        getTriggerType: jest.fn(),
        getRecordTriggerType: jest.fn()
    };
});

const selectors = {
    conditionList: INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST,
    conditionCombobox: LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_CONDITION_COMBOBOX,
    lightningInput: LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT,
    fieldExpressionBuilder: INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER,
    ferExpressionBuilder: INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER,
    resourcedTextArea: INTERACTION_COMPONENTS_SELECTORS.RESOURCED_TEXTAREA,
    fieldPicker: INTERACTION_COMPONENTS_SELECTORS.FIELD_PICKER,
    formulaBuilder: INTERACTION_COMPONENTS_SELECTORS.FORMULA_BUILDER
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
        value: CONDITION_LOGIC.FORMULA,
        label: LABELS.formulaOptionLabel
    }
];

const mockSObjectConditions = [
    {
        operator: { value: 'EqualTo', error: null },
        leftHandSide: { value: 'currentItem_filterInput.AccountSource', error: null },
        rightHandSide: { value: 'web', error: null },
        rightHandSideDataType: { value: 'picklist', error: null },
        rowIndex: 'sc1'
    }
];

const mockApexTypeConditions = [
    {
        operator: { value: 'Contains', error: null },
        leftHandSide: { value: 'currentItem_filterInput.name', error: null },
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

const getFieldExpressionBuilders = (filterCmp) =>
    filterCmp.shadowRoot.querySelectorAll(selectors.fieldExpressionBuilder);

const getFerExpressionBuilders = (filterCmp) => filterCmp.shadowRoot.querySelectorAll(selectors.ferExpressionBuilder);

const getResourcedTextArea = (filterCmp) => filterCmp.shadowRoot.querySelector(selectors.resourcedTextArea);

const getFormulaBuilder = (filterCmp) => filterCmp.shadowRoot.querySelector(selectors.formulaBuilder);

const createComponentUnderTest = (inputs) => {
    const {
        conditionLogic = { value: CONDITION_LOGIC.AND },
        conditions = [],
        sobjectOrApexReference = null,
        formula = null
    } = inputs;
    const el = createElement('builder_platform_interaction-filter-condition-list', {
        is: FilterConditionList
    });
    Object.assign(el, {
        sobjectOrApexReference,
        elementGuid: { value: '12345', error: null },
        conditionLogic,
        conditions,
        formula
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
            fldExpressionBuilders = getFieldExpressionBuilders(element);
        });
        beforeEach(() => {
            mockAccountFieldsPromise = Promise.resolve(accountFields);
        });
        it('should contain four conditon logic options', () => {
            expect(conditionLogicCombobox.options).toEqual(conditionLogicOptions);
        });
        it('should have filter conditions header label', () => {
            expect(conditionLogicCombobox.label).toBe('FlowBuilderFilterEditor.filterConditionsHeader');
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
            expect(fldExpressionBuilders).toHaveLength(mockSObjectConditions.length);
            const ferExpressionBuilders = getFerExpressionBuilders(element);
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
            actualFields = fldExpressionBuilders[0].lhsFields;
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
            expect(getFieldExpressionBuilders(element)).toHaveLength(1);
            expect(getFerExpressionBuilders(element)).toHaveLength(0);
        });
        it('should not display formula editor', () => {
            expect(getResourcedTextArea(element)).toBeNull();
        });
        it('populates filterable fields for lhs on initial load', () => {
            let actual: Object = {},
                expected: Object = {};
            const expressionBuilders = element.shadowRoot.querySelectorAll(selectors.fieldExpressionBuilder);
            actual = expressionBuilders[0].lhsFields;
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
                sobjectOrApexReference: { value: 'string', isSObject: false, isApex: false, error: null },
                collectionReferenceDisplayText: 'primitiveCollection',
                conditions: mockPrimitiveConditions
            });
            conditionLogicCombobox = getConditionLogicCombobox(element);
            ferExpressionBuilders = getFerExpressionBuilders(element);
        });
        it('should contain correct conditon logic options', () => {
            expect(conditionLogicCombobox.options).toEqual(conditionLogicOptions);
        });
        it('"Custom Logic" should be selected ', () => {
            expect(conditionLogicCombobox.value).toBe(CONDITION_LOGIC.CUSTOM_LOGIC);
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
            expect(ferExpressionBuilders).toHaveLength(mockPrimitiveConditions.length);
            expect(getFieldExpressionBuilders(element)).toHaveLength(0);
        });
        it('should disable input in lhs of expression builder', () => {
            for (let i = 0; i < ferExpressionBuilders.length; i++) {
                expect(ferExpressionBuilders[i].lhsDisabled).toEqual(true);
            }
        });
        it('should display formatted text in lhs', () => {
            for (let i = 0; i < ferExpressionBuilders.length; i++) {
                expect(ferExpressionBuilders[i].expression.leftHandSide.value).toBe(
                    mockPrimitiveConditions[i].leftHandSide.value
                );
                expect(ferExpressionBuilders[i].lhsFormattedDisplayText).toEqual(
                    format('FlowBuilderFilterEditor.primtiveLhsPlaceholder', 'primitiveCollection')
                );
            }
        });
        it('should not display formula editor', () => {
            expect(getResourcedTextArea(element)).toBeNull();
        });
    });
    /**
     * Condition Event handlers
     */
    describe('Add conditions', () => {
        it('fires addConditionEvent', async () => {
            const element = createComponentUnderTest({ sobjectOrApexReference: sobjectType });
            const eventCallback = jest.fn();
            element.addEventListener(AddConditionEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new AddConditionEvent('fakeguid'));
            await ticks(1);
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
            const eventCallback = jest.fn();
            element.addEventListener(UpdateConditionEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new UpdateConditionEvent('guid', 0, mockCondition));
            await ticks(1);
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('Delete conditions', () => {
        it('fires deleteConditionEvent', async () => {
            const element = createComponentUnderTest({
                sobjectOrApexReference: sobjectType,
                conditions: mockSObjectConditions
            });
            const eventCallback = jest.fn();
            element.addEventListener(DeleteConditionEvent.EVENT_NAME, eventCallback);
            const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
            conditionList.dispatchEvent(new DeleteConditionEvent('guid', 1));
            await ticks(1);
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('Condition logic changed', () => {
        describe('when orgHasFlowFormulaBuilder is false', () => {
            let element;
            beforeAll(() => {
                element = createComponentUnderTest({
                    sobjectOrApexReference: sobjectType,
                    conditions: mockSObjectConditions
                });
            });
            it('fires propertyChangedEvent for conditionLogic', async () => {
                await ticks(1);
                const eventCallback = jest.fn();
                element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
                const conditionList = element.shadowRoot.querySelector(selectors.conditionList);
                conditionList.dispatchEvent(new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.OR));
                await ticks(1);
                expect(eventCallback).toHaveBeenCalled();
            });
            it('fires propertyChangedEvent when switching to condition logic formula', async () => {
                const eventCallback = jest.fn();
                element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
                const logicComboBox = getConditionLogicCombobox(element);
                logicComboBox.dispatchEvent(new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.FORMULA));
                await ticks(1);
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        guid: element.parentGuid,
                        propertyName: 'conditionLogic',
                        value: CONDITION_LOGIC.FORMULA,
                        error: null
                    }
                });
            });
            it('should show resourced text area when switching to condition logic formula', async () => {
                const logicComboBox = getConditionLogicCombobox(element);
                logicComboBox.dispatchEvent(new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.FORMULA));
                await ticks(1);
                expect(getResourcedTextArea(element)).not.toBeNull();
                expect(getFormulaBuilder(element)).toBeNull();
            });
            it('fires propertyChangedEvent when formula expression value changed in resourced textarea', async () => {
                const formulaCondition = createComponentUnderTest({
                    sobjectOrApexReference: sobjectType,
                    conditionLogic: { value: CONDITION_LOGIC.FORMULA },
                    formula: { value: '10 > 0', error: null }
                });
                const eventCallback = jest.fn();
                formulaCondition.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
                const textArea = getResourcedTextArea(formulaCondition);
                textArea.dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: '1 > 0' }
                    })
                );
                await ticks(1);
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        guid: formulaCondition.parentGuid,
                        propertyName: 'formula',
                        value: '1 > 0',
                        error: null
                    }
                });
            });
        });
        describe('when orgHasFlowFormulaBuilder is true', () => {
            beforeAll(() => {
                mockedContextLib.orgHasFlowFormulaBuilder = jest.fn().mockReturnValue(true);
            });
            afterAll(() => {
                mockedContextLib.orgHasFlowFormulaBuilder = jest.fn().mockReturnValue(false);
            });
            it('should show formula builder when switching to condition logic formula', async () => {
                const element = createComponentUnderTest({
                    sobjectOrApexReference: sobjectType,
                    conditions: mockSObjectConditions
                });
                const logicComboBox = getConditionLogicCombobox(element);
                logicComboBox.dispatchEvent(new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.FORMULA));
                await ticks(1);
                expect(getFormulaBuilder(element)).not.toBeNull();
                expect(getResourcedTextArea(element)).toBeNull();
            });
            it('fires propertyChangedEvent when formula expression value changed in formula builder', async () => {
                const formulaCondition = createComponentUnderTest({
                    sobjectOrApexReference: sobjectType,
                    conditionLogic: { value: CONDITION_LOGIC.FORMULA },
                    formula: { value: '10 > 0', error: null }
                });
                const eventCallback = jest.fn();
                formulaCondition.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
                const formulaBuilder = getFormulaBuilder(formulaCondition);
                formulaBuilder.dispatchEvent(
                    new CustomEvent('change', {
                        detail: { value: '1 > 0' }
                    })
                );
                await ticks(1);
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        guid: formulaCondition.parentGuid,
                        propertyName: 'formula',
                        value: '1 > 0',
                        error: null
                    }
                });
            });
        });
    });

    /**
     * Formula expression editor
     */
    describe('Formula expression editor', () => {
        describe('when orgHasFlowFormulaBuilder is false', () => {
            let element;
            beforeAll(() => {
                element = createComponentUnderTest({
                    conditionLogic: { value: CONDITION_LOGIC.FORMULA },
                    sobjectOrApexReference: sobjectType,
                    formula: { value: '10 > 11', error: null }
                });
            });
            it('should have formula logic selected in the combobox', () => {
                expect(getConditionLogicCombobox(element).value).toBe(CONDITION_LOGIC.FORMULA);
            });
            it('should display label "formula evaluates to true" in the combobox', () => {
                expect(getConditionLogicCombobox(element).label).toBe('FlowBuilderFilterEditor.filterConditionsHeader');
            });
            it('should display resourced text area', () => {
                const textArea = getResourcedTextArea(element);
                expect(textArea).not.toBeNull();
                expect(textArea.value.value).toBe('10 > 11');
                expect(getFormulaBuilder(element)).toBeNull();
            });
            it('should not display any expression builder', () => {
                expect(getFerExpressionBuilders(element)).toHaveLength(0);
                expect(getFieldExpressionBuilders(element)).toHaveLength(0);
            });
        });
        describe('when orgHasFlowFormulaBuilder is true', () => {
            beforeAll(() => {
                mockedContextLib.orgHasFlowFormulaBuilder = jest.fn().mockReturnValue(true);
            });
            afterAll(() => {
                mockedContextLib.orgHasFlowFormulaBuilder = jest.fn().mockReturnValue(false);
            });
            it('should display formula builder when orgHasFlowFormulaBuilder is true', () => {
                const element = createComponentUnderTest({
                    conditionLogic: { value: CONDITION_LOGIC.FORMULA },
                    sobjectOrApexReference: sobjectType,
                    formula: { value: '10 > 11', error: null }
                });
                const formulaBuilder = getFormulaBuilder(element);
                expect(formulaBuilder.value.value).toBe('10 > 11');
                expect(getResourcedTextArea(element)).toBeNull();
            });
        });
    });
});
