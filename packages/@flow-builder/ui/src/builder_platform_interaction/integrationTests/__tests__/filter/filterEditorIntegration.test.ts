import {
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import CollectionProcessorEditor from 'builder_platform_interaction/collectionProcessorEditor';
import { setContext } from 'builder_platform_interaction/contextLib';
import { AddElementEvent, EditElementEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import FerToFerovExpressionBuilder from 'builder_platform_interaction/ferToFerovExpressionBuilder';
import FieldToFerovExpressionBuilder from 'builder_platform_interaction/fieldToFerovExpressionBuilder';
import FilterEditor from 'builder_platform_interaction/filterEditor';
import {
    COLLECTION_PROCESSOR_SUB_TYPE,
    CONDITION_LOGIC,
    ELEMENT_TYPE,
    FLOW_PROCESS_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { createElement } from 'lwc';
import * as recommendationFlow from 'mock/flows/recommendationFlow.json';
import { context } from 'serverData/GetContext/context.json';
import { getToolboxElements } from '../../../editor/editorUtils';
import { ComboboxTestComponent } from '../comboboxTestUtils';
import { ExpressionBuilderComponentTest } from '../expressionBuilderTestUtils';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    getChildComponent,
    resetState,
    setupStateForProcessType,
    translateFlowToUIAndDispatch
} from '../integrationTestUtils';
import { getLabelDescriptionElement, LabelDescriptionComponentTest } from '../labelDescriptionTestUtils';

const processType = FLOW_PROCESS_TYPE.RECOMMENDATION_STRATEGY;
const newCondition = {
    leftHandSide: { value: '', error: null },
    operator: { value: '', error: null },
    rightHandSide: { value: '', error: null },
    rightHandSideDataType: { value: '', error: null }
};

const createCollectionProcessorEditorForTest = (node, processType, mode) => {
    const element = createElement('builder_platform_interaction-collection-processor-editor', {
        is: CollectionProcessorEditor
    });
    Object.assign(element, { node, processType, mode });
    setDocumentBodyChildren(element);
    return element;
};

const createFilterElementForTest = (props?: {}) => {
    const element = createElement('builder_platform_interaction-filter-editor', {
        is: FilterEditor
    });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
    return element;
};

jest.mock('aura', () => {
    return {
        createComponent: jest.fn().mockImplementation(async (cmpName, attr, callback) => {
            const newComponent = {
                getElement: () => createFilterElementForTest({ elementInfo: attr.elementInfo }),
                destroy: () => {}
            };
            callback(newComponent, 'SUCCESS', null);
        }),
        renderComponent: jest.fn((cmp, container) => {
            if (cmp && container && cmp.getElement) {
                container.appendChild(cmp.getElement());
            }
        })
    };
});

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const getCustomPropertyEditor = (collectionProcessorEditor) => {
    return deepQuerySelector(collectionProcessorEditor, [SELECTORS.CUSTOM_PROPERTY_EDITOR]);
};

const getFilterEditor = (collectionProcessorEditor) => {
    return deepQuerySelector(collectionProcessorEditor, [SELECTORS.CUSTOM_PROPERTY_EDITOR, SELECTORS.FILTER_EDITOR]);
};

const getInputCollection = (filterEditor) =>
    deepQuerySelector(filterEditor, [SELECTORS.INPUT_COLLECTION, SELECTORS.FEROV_RESOURCE_PICKER]);

const getCollectionVariableCombobox = (filterEditor) => {
    const cbx = deepQuerySelector(filterEditor, [
        SELECTORS.INPUT_COLLECTION,
        SELECTORS.FEROV_RESOURCE_PICKER,
        SELECTORS.BASE_RESOURCE_PICKER,
        SELECTORS.COMBOBOX
    ]);
    return new ComboboxTestComponent(cbx);
};

const getConditionList = (filterEditor) => {
    return deepQuerySelector(filterEditor, [SELECTORS.FILTER_CONDITION_LIST, SELECTORS.CONDITION_LIST]);
};

// Condition expressions for SObject/Apex input collection
const getFieldExpressionBuilders = (filterEditor) => {
    const filterConditionList = getChildComponent(filterEditor, SELECTORS.FILTER_CONDITION_LIST);
    return Array.from(filterConditionList.shadowRoot.querySelectorAll(SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER)).map(
        (element) => new ExpressionBuilderComponentTest(element as FieldToFerovExpressionBuilder & HTMLElement)
    );
};

// Condition expressions for primitive tpye input collection
const getFerExpressionBuilders = (filterEditor) => {
    const filterConditionList = getChildComponent(filterEditor, SELECTORS.FILTER_CONDITION_LIST);
    return Array.from(filterConditionList.shadowRoot.querySelectorAll(SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER)).map(
        (element) => new ExpressionBuilderComponentTest(element as FerToFerovExpressionBuilder & HTMLElement)
    );
};

const getFilterConditions = (filterEditor) => {
    const filterConditionList = getChildComponent(filterEditor, SELECTORS.FILTER_CONDITION_LIST);
    return filterConditionList.conditions;
};

const getConditionLogicCombobox = (conditionList) => {
    return deepQuerySelector(conditionList, [SELECTORS.LIGHTNING_CONDITION_COMBOBOX]);
};

const addCondition = (filterEditor) => {
    const list = getChildComponent(getConditionList(filterEditor), SELECTORS.LIST);
    const button = list.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON);
    button.click();
};

const getFormulaEditor = (filterEditor) => {
    return deepQuerySelector(filterEditor, [SELECTORS.FILTER_CONDITION_LIST, SELECTORS.RESOURCED_TEXTAREA]);
};

const getFormulaBuilder = (filterEditor) => {
    return deepQuerySelector(filterEditor, [SELECTORS.FILTER_CONDITION_LIST, SELECTORS.FORMULA_BUILDER]);
};

const getFormulaResourcePicker = (formulaBuilder) => {
    return formulaBuilder.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
};

const getFormulaResourceCombobox = (formulaBuilder) => {
    const resourceCombo = deepQuerySelector(formulaBuilder, [
        SELECTORS.FEROV_RESOURCE_PICKER,
        SELECTORS.BASE_RESOURCE_PICKER,
        SELECTORS.COMBOBOX
    ]);
    return new ComboboxTestComponent(resourceCombo);
};

const getFunctionPicker = (formulaBuilder) => {
    return formulaBuilder.shadowRoot.querySelector('formula-function-picker');
};

const getOperatorPicker = (formulaBuilder) => {
    return formulaBuilder.shadowRoot.querySelector('formula-operator-picker');
};

const getSyntaxValidation = (formulaBuilder) => {
    return formulaBuilder.shadowRoot.querySelector('formula-syntax-validation');
};

// Assert two sets of conditions match
const assertConditionsMatch = (actualConditions, expectedConditions) => {
    expect(actualConditions).toHaveLength(expectedConditions.length);
    let index;
    for (index = 0; index < expectedConditions.length; index++) {
        expect(actualConditions[index].leftHandSide.value).toEqual(expectedConditions[index].leftHandSide);
        expect(actualConditions[index].operator.value).toEqual(expectedConditions[index].operator);
        expect(actualConditions[index].rightHandSide.value).toEqual(expectedConditions[index].rightHandSide);
        expect(actualConditions[index].rightHandSideDataType.value).toEqual(
            expectedConditions[index].rightHandSideDataType
        );
    }
};

const newFilterElement = {
    locationX: 50,
    locationY: 100,
    elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
    elementSubtype: COLLECTION_PROCESSOR_SUB_TYPE.FILTER,
    isNew: true
};

const setOrgHasFlowFormulaBuilder = (orgPermStatus) => {
    Object.assign(context, { access: { orgHasFlowFormulaBuilder: orgPermStatus } });
    setContext(context);
};

describe('Filter Editor', () => {
    let store;
    beforeAll(async () => {
        store = await setupStateForProcessType(processType);
        await getToolboxElements(processType, null);
        translateFlowToUIAndDispatch(recommendationFlow, store);
    });
    afterAll(() => {
        resetState();
    });
    describe('New Filter Element', () => {
        let collectionProcessorEditor;
        let filterEditor;
        let labelDescription: LabelDescriptionComponentTest;
        beforeEach(async () => {
            collectionProcessorEditor = createCollectionProcessorEditorForTest(
                getElementForPropertyEditor(newFilterElement),
                processType,
                AddElementEvent.EVENT_NAME
            );
            labelDescription = new LabelDescriptionComponentTest(getLabelDescriptionElement(collectionProcessorEditor));
            await ticks(1);
            filterEditor = getFilterEditor(collectionProcessorEditor);
        });
        it('contains label and dev name fields', () => {
            expect(labelDescription.getLabelElement()).not.toBeNull();
            expect(labelDescription.getNameElement()).not.toBeNull();
        });
        it('allows input for dev name', async () => {
            const devName = 'newFilterNode';
            await labelDescription.setName(devName);
            expect(collectionProcessorEditor.node.name.value).toBe(devName);
        });
        it('allows input for label', async () => {
            const newLabel = 'Label for newFilterNode';
            await labelDescription.setLabel(newLabel);
            expect(collectionProcessorEditor.node.label.value).toBe(newLabel);
        });
        it('contains custom property editor', () => {
            expect(getCustomPropertyEditor(collectionProcessorEditor)).not.toBeNull();
        });
        it('contains filter property editor', () => {
            expect(filterEditor).not.toBeNull();
        });
        it('does not show condition list or formula editor', () => {
            expect(getConditionList(filterEditor)).toBeNull();
            expect(getFormulaEditor(filterEditor)).toBeNull();
        });
        it('has empty input collection field', () => {
            expect(getInputCollection(filterEditor)).not.toBeNull();
            const collectionVariableCombobox = getCollectionVariableCombobox(filterEditor);
            expect(collectionVariableCombobox!.element.value).toBe('');
        });
        it('defaults to filter by conditions when a valid input collection is set', async () => {
            const collectionVariableCombobox = getCollectionVariableCombobox(filterEditor).getGroupedCombobox();
            await collectionVariableCombobox.type('{!outputRecommendations}');
            const conditionList = getConditionList(filterEditor);
            expect(conditionList).not.toBeNull();
            // default condition logic should be AND
            expect(getConditionLogicCombobox(conditionList).value).toBe(CONDITION_LOGIC.AND);
        });
        it('shows error when input collection variable is invalid', async () => {
            const colVarCombobox = getCollectionVariableCombobox(filterEditor).getGroupedCombobox();
            await colVarCombobox.type('{!badVariable}');
            expect(getCollectionVariableCombobox(filterEditor)!.element.errorMessage).toBe(
                FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.GENERIC
            );
        });
        it('shows error when input collection is empty', async () => {
            const colVarCombobox = getCollectionVariableCombobox(filterEditor).getGroupedCombobox();
            await colVarCombobox.type('');
            expect(getCollectionVariableCombobox(filterEditor)!.element.errorMessage).toBe(
                FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
            );
        });
        it('renders formula editor if orgHasFlowFormulaBuilder is off', async () => {
            const collectionVariableCombobox = getCollectionVariableCombobox(filterEditor).getGroupedCombobox();
            await collectionVariableCombobox.type('{!outputRecommendations}');
            const conditionList = getConditionList(filterEditor);
            await getConditionLogicCombobox(conditionList).dispatchEvent(
                new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.FORMULA)
            );
            expect(getFormulaEditor(filterEditor)).not.toBeNull();
            expect(getFormulaBuilder(filterEditor)).toBeNull();
        });
        describe('Formula builder when orgHasFlowFormulaBuilder is on', () => {
            let collectionProcessorEditor, filterEditor;
            beforeAll(async () => {
                setOrgHasFlowFormulaBuilder(true);
                collectionProcessorEditor = createCollectionProcessorEditorForTest(
                    getElementForPropertyEditor(newFilterElement),
                    processType,
                    AddElementEvent.EVENT_NAME
                );
                labelDescription = new LabelDescriptionComponentTest(
                    getLabelDescriptionElement(collectionProcessorEditor)
                );
                await ticks(1);
                filterEditor = getFilterEditor(collectionProcessorEditor);
                const collectionVariableCombobox = getCollectionVariableCombobox(filterEditor).getGroupedCombobox();
                await collectionVariableCombobox.type('{!outputRecommendations}');
                const conditionList = getConditionList(filterEditor);
                await getConditionLogicCombobox(conditionList).dispatchEvent(
                    new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.FORMULA)
                );
            });
            afterAll(() => {
                setOrgHasFlowFormulaBuilder(false);
            });
            it('renders formula builder', () => {
                expect(getFormulaEditor(filterEditor)).toBeNull();
                expect(getFormulaBuilder(filterEditor)).not.toBeNull();
            });
            it('renders pickers for resource, function and operator in formula builder', () => {
                const formulaBuilder = getFormulaBuilder(filterEditor);
                expect(getFormulaResourcePicker(formulaBuilder)).not.toBeNull();
                expect(getFunctionPicker(formulaBuilder)).not.toBeNull();
                expect(getOperatorPicker(formulaBuilder)).not.toBeNull();
                expect(getSyntaxValidation(formulaBuilder)).not.toBeNull();
            });
            it('contains "Record Variables" in resource picker', () => {
                const formulaBuilder = getFormulaBuilder(filterEditor);
                const groupedCombo = getFormulaResourceCombobox(formulaBuilder).getGroupedCombobox();
                expect(
                    groupedCombo.getItemInGroup(
                        'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                        'text',
                        'currentItem_Filter_Get_Accounts_By_Conditions'
                    )
                );
            });
        });
    });
    describe('Existing Filter Element', () => {
        describe('Filter SObject input collection by conditions', () => {
            let elementFromFlow, collectionProcessorEditor;
            let filterEditor;
            beforeEach(async () => {
                elementFromFlow = getElementByDevName('Filter_Get_Accounts_By_Conditions');
                collectionProcessorEditor = createCollectionProcessorEditorForTest(
                    getElementForPropertyEditor(elementFromFlow),
                    processType,
                    EditElementEvent.EVENT_NAME
                );
                await ticks(1);
                filterEditor = getFilterEditor(collectionProcessorEditor);
            });
            it('renders filter editor', () => {
                expect(filterEditor).not.toBeNull();
            });
            it('loads input collection reference', () => {
                expect(getCollectionVariableCombobox(filterEditor).getGroupedCombobox()!.element.value).toBe(
                    '{!Get_Accounts}'
                );
            });
            it('loads condition list', () => {
                expect(getConditionList(filterEditor)).not.toBeNull();
            });
            it('does not render formula editor', () => {
                expect(getFormulaEditor(filterEditor)).toBeNull();
            });
            it('loads condition logic', () => {
                const conditionList = getConditionList(filterEditor);
                expect(getConditionLogicCombobox(conditionList).value).toBe(CONDITION_LOGIC.AND);
            });
            it('has correct number of conditions', () => {
                expect(getFieldExpressionBuilders(filterEditor)).toHaveLength(elementFromFlow.conditions.length);
            });
            it('lhs/operator/rhs values', () => {
                assertConditionsMatch(getFilterConditions(filterEditor), elementFromFlow.conditions);
            });
            it('adds conditions', async () => {
                addCondition(filterEditor);
                await ticks(1);
                expect(getFieldExpressionBuilders(filterEditor)).toHaveLength(elementFromFlow.conditions.length + 1);
                expect(getFilterConditions(filterEditor)[elementFromFlow.conditions.length]).toMatchObject(
                    newCondition
                );
            });
            it('updates conditions', async () => {
                const newRhs = 'foobar';
                const expressionBuilder = getFieldExpressionBuilders(filterEditor)[0];
                const rhs = await expressionBuilder.getRhsCombobox();
                await rhs.typeLiteralValue(newRhs);
                const updatedCondition = getFilterConditions(filterEditor)[0];
                expect(updatedCondition.rightHandSide.value).toBe(newRhs);
            });
            it('deletes conditions', async () => {
                // get delete button next to each row of condition
                const rows = getChildComponent(
                    filterEditor,
                    SELECTORS.FILTER_CONDITION_LIST
                ).shadowRoot.querySelectorAll(SELECTORS.ROW);
                expect(rows).toHaveLength(2);
                const deleteButton0 = rows[0].shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
                const deleteButton1 = rows[1].shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
                expect(deleteButton0.disabled).toBeFalsy();
                await deleteButton0.click();
                expect(getFieldExpressionBuilders(filterEditor)).toHaveLength(elementFromFlow.conditions.length - 1);
                // delete button should be disbled since only one condition is left now
                expect(deleteButton1.disabled).toBeTruthy();
            });
            it('resets conditions when condition logic is set to formula', async () => {
                const conditionList = getConditionList(filterEditor);
                await getConditionLogicCombobox(conditionList).dispatchEvent(
                    new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.FORMULA)
                );
                expect(getConditionLogicCombobox(conditionList).value).toBe(CONDITION_LOGIC.FORMULA);
                expect(getFormulaEditor(filterEditor)).not.toBeNull();
                expect(getFormulaEditor(filterEditor).value.value).toBe('');
                expect(getFilterConditions(filterEditor)).toMatchObject([newCondition]);
            });
            it('does not reset conditions when condition logic is set to other non-formula logic', async () => {
                const conditionList = getConditionList(filterEditor);
                await getConditionLogicCombobox(conditionList).dispatchEvent(
                    new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.OR)
                );
                expect(getFilterConditions(filterEditor)).toHaveLength(elementFromFlow.conditions.length);
                assertConditionsMatch(getFilterConditions(filterEditor), elementFromFlow.conditions);
            });
            it('does not reset conditions when input collection pill is removed', async () => {
                const inputCollectionComboBox = getCollectionVariableCombobox(filterEditor);
                await inputCollectionComboBox.removePill();
                assertConditionsMatch(getFilterConditions(filterEditor), elementFromFlow.conditions);
            });
            it('reset conditions when input collection is changed to a variable with different data type', async () => {
                const inputCollectionComboBox = getCollectionVariableCombobox(filterEditor);
                await inputCollectionComboBox.typeReferenceOrValue('{!outputRecommendations}');
                expect(getFilterConditions(filterEditor)).toHaveLength(1);
                expect(getFilterConditions(filterEditor)).toMatchObject([newCondition]);
            });
        });
        describe('Filter SObject collection by formula', () => {
            const expectedFormula = "BEGINS({!currentItem_Filter_Get_Accounts_By_Formula.Name}, 'Test')";
            let elementFromFlow, collectionProcessorEditor;
            let filterEditor;
            beforeEach(async () => {
                elementFromFlow = getElementByDevName('Filter_Get_Accounts_By_Formula');
                collectionProcessorEditor = createCollectionProcessorEditorForTest(
                    getElementForPropertyEditor(elementFromFlow),
                    processType,
                    EditElementEvent.EVENT_NAME
                );
                await ticks(1);
                filterEditor = getFilterEditor(collectionProcessorEditor);
            });
            it('renders filter editor', () => {
                expect(filterEditor).not.toBeNull();
            });
            it('loads input collection reference', () => {
                expect(getCollectionVariableCombobox(filterEditor).getGroupedCombobox()!.element.value).toBe(
                    '{!Get_Accounts}'
                );
            });
            it('loads formula editor and the formula expression', () => {
                const formulaEditor = getFormulaEditor(filterEditor);
                expect(formulaEditor).not.toBeNull();
                expect(formulaEditor.value.value).toBe(expectedFormula);
            });
            it('changes formula', async () => {
                const newFormula = "CONTAINS({!currentItem_Filter_Get_Accounts_By_Formula.Name}, 'Test')";
                const filterConditionList = getChildComponent(filterEditor, SELECTORS.FILTER_CONDITION_LIST);
                filterConditionList.dispatchEvent(new PropertyChangedEvent('formula', newFormula));
                await ticks();
                expect(getFormulaEditor(filterEditor).value.value).toBe(newFormula);
            });
            it('reset conditions and formula when condition logic is changed', async () => {
                const conditionList = getConditionList(filterEditor);
                await getConditionLogicCombobox(conditionList).dispatchEvent(
                    new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.OR)
                );
                const conditions = getFilterConditions(filterEditor);
                expect(conditions).toHaveLength(1);
                expect(conditions).toMatchObject([newCondition]);
                expect(getFormulaEditor(filterEditor)).toBeNull();
            });
            it('does not render conditions', () => {
                expect(getFieldExpressionBuilders(filterEditor)).toHaveLength(0);
                expect(getFerExpressionBuilders(filterEditor)).toHaveLength(0);
            });
            describe('Formula builder when orgHasFlowFormulaBuilder is on', () => {
                beforeAll(() => {
                    setOrgHasFlowFormulaBuilder(true);
                });
                afterAll(() => {
                    setOrgHasFlowFormulaBuilder(false);
                });
                it('renders formula builder with correct value', () => {
                    expect(getFormulaEditor(filterEditor)).toBeNull();
                    expect(getFormulaBuilder(filterEditor).value.value).toEqual(expectedFormula);
                });
                it('changes formula', async () => {
                    const newFormula = "CONTAINS({!currentItem_Filter_Get_Accounts_By_Formula.Name}, 'Test')";
                    const filterConditionList = getChildComponent(filterEditor, SELECTORS.FILTER_CONDITION_LIST);
                    await filterConditionList.dispatchEvent(new PropertyChangedEvent('formula', newFormula));
                    expect(getFormulaBuilder(filterEditor).value.value).toBe(newFormula);
                });
            });
        });
        describe('Filter Apex type input collection by conditions', () => {
            let elementFromFlow, collectionProcessorEditor;
            let filterEditor;
            beforeEach(async () => {
                elementFromFlow = getElementByDevName('Filter_Apex_collection');
                collectionProcessorEditor = createCollectionProcessorEditorForTest(
                    getElementForPropertyEditor(elementFromFlow),
                    processType,
                    EditElementEvent.EVENT_NAME
                );
                await ticks(1);
                filterEditor = getFilterEditor(collectionProcessorEditor);
            });
            it('renders filter editor', () => {
                expect(filterEditor).not.toBeNull();
            });
            it('loads input collection reference', () => {
                expect(getCollectionVariableCombobox(filterEditor).getGroupedCombobox()!.element.value).toBe(
                    '{!apexCollection}'
                );
            });
            it('loads conditions correctly', () => {
                expect(getFieldExpressionBuilders(filterEditor)).toHaveLength(elementFromFlow.conditions.length);
                assertConditionsMatch(getFilterConditions(filterEditor), elementFromFlow.conditions);
            });
            it('can select filterable apex property', async () => {
                const expressionBuilder = getFieldExpressionBuilders(filterEditor)[0];
                const lhs = await expressionBuilder.getLhsCombobox();
                expect(lhs).canSelectInCombobox('text', ['myString']);
            });
            it('reports error when lhs value is set to unknown property', async () => {
                const expressionBuilder = getFieldExpressionBuilders(filterEditor)[0];
                const lhs = await expressionBuilder.getLhsCombobox();
                await lhs.typeMergeField('{!currentItem_Filter_Apex_collection.dummyProp}');
                expect(getFilterConditions(filterEditor)[0].leftHandSide.error).toBe(
                    'FlowBuilderMergeFieldValidation.unknownRecordField'
                );
            });
            it('does not reset conditions when condition logic is changed to custom logic', async () => {
                const conditionList = getConditionList(filterEditor);
                await getConditionLogicCombobox(conditionList).dispatchEvent(
                    new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.CUSTOM_LOGIC)
                );
                assertConditionsMatch(getFilterConditions(filterEditor), elementFromFlow.conditions);
            });
            it('reset conditions when condition logic is changed to formula', async () => {
                const conditionList = getConditionList(filterEditor);
                await getConditionLogicCombobox(conditionList).dispatchEvent(
                    new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.FORMULA)
                );
                expect(getFilterConditions(filterEditor)).toHaveLength(1);
                expect(getFilterConditions(filterEditor)).toMatchObject([newCondition]);
                expect(getFormulaEditor(filterEditor)).not.toBeNull();
                expect(getFormulaEditor(filterEditor).value.value).toBe('');
            });
        });
        describe('Filter text collection by conditions', () => {
            let elementFromFlow, collectionProcessorEditor;
            let filterEditor;
            beforeEach(async () => {
                elementFromFlow = getElementByDevName('Filter_text_collection');
                collectionProcessorEditor = createCollectionProcessorEditorForTest(
                    getElementForPropertyEditor(elementFromFlow),
                    processType,
                    EditElementEvent.EVENT_NAME
                );
                await ticks(1);
                filterEditor = getFilterEditor(collectionProcessorEditor);
            });
            it('renders filter editor', () => {
                expect(filterEditor).not.toBeNull();
            });
            it('loads input collection reference', () => {
                expect(getCollectionVariableCombobox(filterEditor).getGroupedCombobox()!.element.value).toBe(
                    '{!vTextCollection}'
                );
            });
            it('loads conditions', () => {
                assertConditionsMatch(getFilterConditions(filterEditor), elementFromFlow.conditions);
            });
            it('populates lhs value correctly', () => {
                const conditions = getFilterConditions(filterEditor);
                // lhs value is set to loop variable for all conditions
                conditions.forEach((cond) => {
                    expect(cond.leftHandSide.value).toBe(elementFromFlow.assignNextValueToReference);
                });
            });
            it('lhs combobox disabled', async () => {
                const builders = getFerExpressionBuilders(filterEditor);
                expect(builders).toHaveLength(elementFromFlow.conditions.length);
                const lhs = await builders[0].getLhsCombobox();
                expect(lhs.element.disabled).toBeTruthy();
            });
            it('changes operator value', async () => {
                const newOp = 'StartsWith';
                const builder = getFerExpressionBuilders(filterEditor)[0];
                await builder.selectOperator(newOp);
                expect(getFilterConditions(filterEditor)[0].operator.value).toBe(newOp);
            });
            it('reports error when rhs value is set to an invalid resource', async () => {
                const builder = getFerExpressionBuilders(filterEditor)[0];
                const rhs = await builder.getRhsCombobox();
                // attempt to set rhs to a collection variable, which violates operator rules
                await rhs.typeMergeField('{!outputRecommendations}');
                expect(rhs.element!.errorMessage).toBe('FlowBuilderMergeFieldValidation.invalidDataType');
            });
            it('lhs is set and disabled for new conditions', async () => {
                addCondition(filterEditor);
                await ticks(1);
                expect(getFilterConditions(filterEditor)).toHaveLength(elementFromFlow.conditions.length + 1);
                expect(getFilterConditions(filterEditor)[elementFromFlow.conditions.length].leftHandSide.value).toBe(
                    elementFromFlow.assignNextValueToReference
                );
                const lhs = await getFerExpressionBuilders(filterEditor)[
                    elementFromFlow.conditions.length
                ].getLhsCombobox();
                expect(lhs.element.disabled).toBeTruthy();
            });
        });
        describe('Validate on Done', () => {
            let elementFromFlow, collectionProcessorEditor;
            beforeEach(async () => {
                elementFromFlow = getElementByDevName('Filter_Get_Accounts_By_Formula');
            });
            it('reports no error', async () => {
                collectionProcessorEditor = createCollectionProcessorEditorForTest(
                    getElementForPropertyEditor(elementFromFlow),
                    processType,
                    EditElementEvent.EVENT_NAME
                );
                await ticks(1);
                const errors = collectionProcessorEditor.validate();
                expect(errors).toHaveLength(0);
            });
            it('reports error on formula', async () => {
                const elementForEditor = getElementForPropertyEditor(elementFromFlow);
                const expectedError = 'invalid formula';
                elementForEditor.formula.error = expectedError;
                const collectionProcessorEditor = createCollectionProcessorEditorForTest(
                    elementForEditor,
                    processType,
                    EditElementEvent.EVENT_NAME
                );
                await ticks(1);
                const errors = collectionProcessorEditor.validate();
                expect(errors).toHaveLength(1);
                expect(errors).toEqual([{ errorString: expectedError, key: 'formula' }]);
            });
        });
    });
});
