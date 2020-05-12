// @ts-nocheck
import { createElement } from 'lwc';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import AssignmentEditor from 'builder_platform_interaction/assignmentEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setupStateForFlow, resetState } from '../integrationTestUtils';
import { ticks, INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { getLhsCombobox, getRhsCombobox } from '../expressionBuilderTestUtils';
import { getGroupedComboboxFromCombobox } from '../comboboxTestUtils';
import { updateElement } from 'builder_platform_interaction/actions';
import { createRecordLookup } from 'builder_platform_interaction/elementFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';

const createComponentForTest = assignmentElement => {
    const el = createElement('builder_platform_interaction-assignment-editor', {
        is: AssignmentEditor
    });
    Object.assign(el, { node: assignmentElement });
    document.body.appendChild(el);
    return el;
};

const getFerToFerovExpressionBuilder = (assignment, n = 0) => {
    return assignment.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER)[n];
};

describe('Assignment Editor - Validation on done', () => {
    let storeInstance, assignment;
    describe('Type changed : Get Records automatic changed from "Only the first record" to "All records"', () => {
        const updateGetFirstRecordOnly = (getRecordsDevName, getFirstRecordOnly) => {
            let getRecordsElement = getElementByDevName(getRecordsDevName);
            getRecordsElement = createRecordLookup(Object.assign(getRecordsElement, { getFirstRecordOnly }));
            storeInstance.dispatch(updateElement(getRecordsElement));
        };
        beforeAll(async () => {
            storeInstance = await setupStateForFlow(flowWithAllElements);
            updateGetFirstRecordOnly('lookupRecordAutomaticOutput', false);
        });
        afterAll(() => {
            resetState();
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assign_W_7251820');
            const assignmentForPropertyEditor = getElementForPropertyEditor(assignmentElement);
            assignment = createComponentForTest(assignmentForPropertyEditor);
            await ticks();
            assignment.validate();
        });
        it('should display an error on LHS for "{!lookupRecordAutomaticOutput.accountNumber} Equals {!accountSObjectVariable.AccountNumber}"', () => {
            const expressionBuilder = getFerToFerovExpressionBuilder(assignment, 0);
            const lhsCombobox = getLhsCombobox(expressionBuilder);
            expect(lhsCombobox.errorMessage).toBe('FlowBuilderMergeFieldValidation.resourceCannotBeUsedAsMergeField');
        });
        it('text should still be {!lookupRecordAutomaticOutput.accountNumber} on LHS after validation', () => {
            // see W-7251820
            const expressionBuilder = getFerToFerovExpressionBuilder(assignment, 0);
            const lhsCombobox = getLhsCombobox(expressionBuilder);
            const lhsGroupedCombobox = getGroupedComboboxFromCombobox(lhsCombobox);
            expect(lhsGroupedCombobox.value).toBe('{!lookupRecordAutomaticOutput.AccountNumber}');
        });
        it('should display an error on RHS for "{!lookupRecordAutomaticOutput} Equals {!accountSObjectVariable}"', () => {
            const expressionBuilder = getFerToFerovExpressionBuilder(assignment, 1);
            const rhsCombobox = getRhsCombobox(expressionBuilder);
            expect(rhsCombobox.errorMessage).toBe('FlowBuilderMergeFieldValidation.invalidDataType');
        });
        it('text should still be {!accountSObjectVariable} on RHS after validation', () => {
            // see W-7251820
            const expressionBuilder = getFerToFerovExpressionBuilder(assignment, 1);
            const rhsCombobox = getRhsCombobox(expressionBuilder);
            const rhsGroupedCombobox = getGroupedComboboxFromCombobox(rhsCombobox);
            expect(rhsGroupedCombobox.value).toBe('{!accountSObjectVariable}');
        });
    });
});
