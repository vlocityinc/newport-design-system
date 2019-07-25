import { createElement } from 'lwc';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { flowWithGetRecordUsingSObjectSingleAutomatedOutput } from 'mock/flows/flowWithGetRecord';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { reducer } from 'builder_platform_interaction/reducers';
import { updateFlow } from 'builder_platform_interaction/actions';
import AssignmentEditor from 'builder_platform_interaction/assignmentEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { resolveRenderCycles } from '../../resolveRenderCycles';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import {
    setGlobalVariables,
    setSystemVariables
} from 'builder_platform_interaction/systemLib';
import { auraFetch, resetState } from '../../integrationTestUtils';
import {
    setEntities,
    fetchFieldsForEntity
} from 'builder_platform_interaction/sobjectLib';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import {
    globalVariableTypes,
    globalVariables,
    systemVariables
} from 'mock/systemGlobalVars';
import { mockEntities } from 'mock/serverEntityData';
import { mockAccountFields } from 'mock/serverEntityData';
import { setRules } from 'builder_platform_interaction/ruleLib';
import { mockAllRules } from 'mock/ruleService';
import {
    selectEvent,
    expectGroupedComboboxItem,
    getGroupedComboboxItem,
    getGroupedComboboxItemInGroupByDisplayText
} from '../../integrationTestUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

const SELECTORS = {
    LHS_COMBOBOX:
        'builder_platform_interaction-combobox.lhs.slds-col.slds-grow',
    RHS_COMBOBOX: 'builder_platform_interaction-combobox.rhs.slds-col.slds-grow'
};

const createComponentForTest = assignmentElement => {
    const el = createElement('builder_platform_interaction-assignment-editor', {
        is: AssignmentEditor
    });
    Object.assign(el, { assignmentElement });
    document.body.appendChild(el);
    return el;
};

const getComboBox = (assignment, comboSelector) => {
    const ferToFerov = assignment.shadowRoot.querySelector(
        'builder_platform_interaction-fer-to-ferov-expression-builder'
    );

    const baseExpBuilder = ferToFerov.shadowRoot.querySelector(
        'builder_platform_interaction-base-expression-builder'
    );
    const combo = baseExpBuilder.shadowRoot.querySelector(comboSelector);
    return combo.shadowRoot.querySelector('lightning-grouped-combobox');
};

describe('Assignment Editor', () => {
    beforeAll(() => {
        setRules(JSON.stringify(mockAllRules));
        setGlobalVariables({ globalVariableTypes, globalVariables });
        setSystemVariables(systemVariables);
        setEntities(JSON.stringify(mockEntities));
        setAuraFetch(
            auraFetch({
                'c.getFieldsForEntity': () => ({
                    data: mockAccountFields
                })
            })
        );
    });
    afterAll(() => {
        resetState();
    });
    describe('Automated ouput in combobox', () => {
        let store, assignment, assignmentForPropertyEditor;
        beforeAll(() => {
            store = Store.getStore(reducer);
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
            assignment.node = deepCopy(assignmentForPropertyEditor);
            return resolveRenderCycles(() => {
                const lhsCombo = getComboBox(
                    assignment,
                    SELECTORS.LHS_COMBOBOX
                );
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
            assignment.node = deepCopy(assignmentForPropertyEditor);
            return resolveRenderCycles(() => {
                const rhsCombo = getComboBox(
                    assignment,
                    SELECTORS.RHS_COMBOBOX
                );
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
            assignment.node = deepCopy(assignmentForPropertyEditor);
            await fetchFieldsForEntity('Account');
            const lhsCombo = getComboBox(assignment, SELECTORS.LHS_COMBOBOX);
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
            assignment.node = deepCopy(assignmentForPropertyEditor);
            await fetchFieldsForEntity('Account');
            const lhsCombo = getComboBox(assignment, SELECTORS.LHS_COMBOBOX);
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
});
