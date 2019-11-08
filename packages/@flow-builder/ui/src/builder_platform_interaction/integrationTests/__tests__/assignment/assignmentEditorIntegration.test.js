import { createElement } from 'lwc';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { flowWithGetRecordUsingSObjectSingleAutomatedOutput } from 'mock/flows/flowWithGetRecord';
import { flowWithCreateRecordAutomatedOutput } from 'mock/flows/flowWithCreateRecord';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { reducer } from 'builder_platform_interaction/reducers';
import { updateFlow } from 'builder_platform_interaction/actions';
import AssignmentEditor from 'builder_platform_interaction/assignmentEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { resolveRenderCycles } from '../../resolveRenderCycles';
import {
    setGlobalVariables,
    setSystemVariables
} from 'builder_platform_interaction/systemLib';
import { resetState } from '../../integrationTestUtils';
import { auraFetch, getFieldsForEntity } from '../../serverDataTestUtils';
import {
    setEntities,
    fetchFieldsForEntity
} from 'builder_platform_interaction/sobjectLib';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { systemVariablesForFlow } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import { globalVariablesForFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForFlow.json';
import { allEntities } from 'serverData/GetEntities/allEntities.json';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { userFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { setRules } from 'builder_platform_interaction/ruleLib';
import { rules } from 'serverData/RetrieveAllRules/rules.json';
import {
    selectEvent,
    expectGroupedComboboxItem,
    getGroupedComboboxItem,
    getGroupedComboboxItemInGroupByDisplayText,
    expectGroupedComboboxItemInGroup,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from '../../integrationTestUtils';
import {
    ticks,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import {
    EXPRESSION_BUILDER_SELECTORS,
    validateExpression
} from '../../expressionBuilderTestUtils';

const createComponentForTest = assignmentElement => {
    const el = createElement('builder_platform_interaction-assignment-editor', {
        is: AssignmentEditor
    });
    Object.assign(el, { node: assignmentElement });
    document.body.appendChild(el);
    return el;
};

const getFerToFerovExpressionBuilder = assignment => {
    return deepQuerySelector(assignment, [
        INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER
    ]);
};

const getLHSGroupedCombobox = assignment => {
    return deepQuerySelector(assignment, [
        INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.LHS_COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

const getRHSGroupedCombobox = assignment => {
    return deepQuerySelector(assignment, [
        INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.RHS_COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

describe('Assignment Editor', () => {
    let store;
    beforeAll(() => {
        store = Store.getStore(reducer);
        setRules(rules);
        setGlobalVariables(globalVariablesForFlow);
        setSystemVariables(systemVariablesForFlow);
        setEntities(allEntities);
        setAuraFetch(
            auraFetch({
                'c.getFieldsForEntity': getFieldsForEntity({
                    Account: accountFields,
                    User: userFields,
                    FeedItem: feedItemFields
                })
            })
        );
    });
    afterAll(() => {
        resetState();
    });
    describe('"Get Records" Automated ouput in combobox', () => {
        let assignment, assignmentForPropertyEditor;
        beforeAll(() => {
            const uiFlow = translateFlowToUIModel(
                flowWithGetRecordUsingSObjectSingleAutomatedOutput
            );
            store.dispatch(updateFlow(uiFlow));
        });
        beforeEach(() => {
            const assignmentElement = getElementByDevName('assignment');
            assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
        });
        it('shows up automated output from Get Record in LHS', () => {
            return resolveRenderCycles(() => {
                const lhsCombo = getLHSGroupedCombobox(assignment);
                expect(
                    getGroupedComboboxItemInGroupByDisplayText(
                        lhsCombo,
                        'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                        '{!Get_single_record_automatic_output}'
                    )
                ).toBeDefined();
            });
        });
        it('shows up automated output from Get Record in RHS', () => {
            return resolveRenderCycles(() => {
                const rhsCombo = getRHSGroupedCombobox(assignment);
                expect(
                    getGroupedComboboxItemInGroupByDisplayText(
                        rhsCombo,
                        'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                        '{!Get_single_record_automatic_output}'
                    )
                ).toBeDefined();
            });
        });
        it('shows up record field when automated output from Get Record selected', async () => {
            await fetchFieldsForEntity('Account');
            const lhsCombo = getLHSGroupedCombobox(assignment);
            const automatedOutputFromGetRecord = getGroupedComboboxItemInGroupByDisplayText(
                lhsCombo,
                'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                '{!Get_single_record_automatic_output}'
            );
            lhsCombo.dispatchEvent(
                selectEvent(automatedOutputFromGetRecord.value)
            );
            await ticks();
            expectGroupedComboboxItem(lhsCombo, 'Name');
        });
        it('can select automated output from Get Record field', async () => {
            await fetchFieldsForEntity('Account');
            const lhsCombo = getLHSGroupedCombobox(assignment);
            const automatedOutputFromGetRecord = getGroupedComboboxItemInGroupByDisplayText(
                lhsCombo,
                'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                '{!Get_single_record_automatic_output}'
            );
            lhsCombo.dispatchEvent(
                selectEvent(automatedOutputFromGetRecord.value)
            );
            await ticks();
            const automatedOutputFromGetRecordNameField = getGroupedComboboxItem(
                lhsCombo,
                'Name'
            );

            lhsCombo.dispatchEvent(
                selectEvent(automatedOutputFromGetRecordNameField.value)
            );
            await ticks();

            expect(lhsCombo.value).toEqual(
                '{!Get_single_record_automatic_output.Name}'
            );
        });
    });
    describe('"Create Records" Automated ouput in combobox', () => {
        let assignment, assignmentForPropertyEditor;
        const recordCreateInAutomaticModeMergeFieldName = addCurlyBraces(
            flowWithCreateRecordAutomatedOutput.metadata.recordCreates[0].name
        );
        beforeAll(() => {
            const uiFlow = translateFlowToUIModel(
                flowWithCreateRecordAutomatedOutput
            );
            store.dispatch(updateFlow(uiFlow));
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assignment');
            assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
            await ticks();
        });
        it('shows up automated output from Create Record in LHS under "variables" section with correct "displayText" and "subtext"', () => {
            const lhsCombo = getLHSGroupedCombobox(assignment);
            expect(
                getGroupedComboboxItemInGroupByDisplayText(
                    lhsCombo,
                    'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                    recordCreateInAutomaticModeMergeFieldName
                )
            ).toBeDefined();
            expectGroupedComboboxItemInGroup(
                lhsCombo,
                'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                'FlowBuilderDataTypes.textDataTypeLabel',
                'subText'
            );
        });
        it('shows up automated output from Create Record in RHS under "variables" section correct "displayText" and "subtext"', () => {
            const rhsCombo = getRHSGroupedCombobox(assignment);
            expect(
                getGroupedComboboxItemInGroupByDisplayText(
                    rhsCombo,
                    'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                    recordCreateInAutomaticModeMergeFieldName
                )
            ).toBeDefined();
            expectGroupedComboboxItemInGroup(
                rhsCombo,
                'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                'FlowBuilderDataTypes.textDataTypeLabel',
                'subText'
            );
        });
    });
    describe('Validation', () => {
        let assignment, expressionBuilder;
        beforeAll(() => {
            const uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assignment1');
            const assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
            await ticks();
            expressionBuilder = getFerToFerovExpressionBuilder(assignment);
        });
        it.each`
            lhs                                            | operator    | rhs                                                     | rhsErrorMessage
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Assign'} | ${'500.0'}                                              | ${undefined}
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Assign'} | ${'not a number'}                                       | ${'FlowBuilderCombobox.numberErrorMessage'}
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Add'}    | ${'{!accountSObjectVariable.Name}'}                     | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            ${'{!numberVariable}'}                         | ${'Assign'} | ${'{!feedItemVariable.Parent:Account.BillingLatitude}'} | ${undefined}
        `(
            'error for "$lhs $operator $rhs" should be : $rhsErrorMessage',
            async ({ lhs, operator, rhs, rhsErrorMessage }) => {
                expect(
                    await validateExpression(expressionBuilder, {
                        lhs,
                        operator,
                        rhs
                    })
                ).toEqual({ rhsErrorMessage });
            }
        );
    });
});
