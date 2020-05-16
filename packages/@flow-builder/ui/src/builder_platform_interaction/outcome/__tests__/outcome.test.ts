// @ts-nocheck
import { createElement } from 'lwc';
import Outcome from 'builder_platform_interaction/outcome';
import { DeleteOutcomeEvent } from 'builder_platform_interaction/events';
import { LABELS } from '../outcomeLabels';
import { RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';
import { getConditionsWithPrefixes } from 'builder_platform_interaction/conditionListUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/ferToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/ferToFerovExpressionBuilder')
);

const outcomeWithOneConditional = {
    label: { value: 'Test Name of the Outcome' },
    name: { value: 'Test Dev Name' },
    guid: { value: '123' },
    conditionLogic: { value: '1' },
    conditions: [{ name: 'condition1', rowIndex: 0 }]
};
const outcomeWithThreeConditionals = {
    label: { value: 'Test Name of the Outcome' },
    name: { value: 'Test Dev Name' },
    guid: { value: '123' },
    conditionLogic: { value: '1 and 2' },
    conditions: [
        { name: 'condition1', rowIndex: 0 },
        { name: 'condition2', rowIndex: 1 },
        { name: 'condition3', rowIndex: 2 }
    ]
};

const selectors = {
    conditionList: 'builder_platform_interaction-list',
    row: 'builder_platform_interaction-row',
    labelAndName: 'builder_platform_interaction-label-description',
    button: 'lightning-button',
    conditionLogicComboBox: '.conditionLogic',
    customLogicInput: '.customLogic',
    removeButton: 'lightning-button.removeOutcome',
    ferToFerovExpressionBuilder: 'builder_platform_interaction-fer-to-ferov-expression-builder',
    label: '.label'
};

jest.mock('builder_platform_interaction/conditionListUtils', () => {
    return {
        getConditionsWithPrefixes: jest
            .fn()
            .mockName('getConditionsWithPrefixes')
            .mockReturnValue([]),
        showDeleteCondition: jest.fn().mockName('showDeleteCondition')
    };
});

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-outcome', {
        is: Outcome
    });

    document.body.appendChild(el);

    el.showDelete = true;

    return el;
};

describe('Outcome', () => {
    describe('header section', () => {
        it('has name and api name component', async () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;

            await ticks(1);
            const labelAndNameComponents = element.shadowRoot.querySelectorAll(selectors.labelAndName);
            expect(labelAndNameComponents).toHaveLength(1);
            expect(labelAndNameComponents[0].devName.value).toBe(outcomeWithOneConditional.name.value);
            expect(labelAndNameComponents[0].label.value).toBe(outcomeWithOneConditional.label.value);
        });
        it('has Remove button if show delete is true', async () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;

            await ticks(1);
            const removeButton = element.shadowRoot.querySelectorAll(selectors.removeButton)[0];

            expect(removeButton.label).toBe(LABELS.deleteOutcomeLabel);
            expect(removeButton.title).toBe(LABELS.deleteOutcomeTitle);
        });
        it('has no Remove button if show delete is false', async () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;
            element.showDelete = false;

            await ticks(1);
            const removeButton = element.shadowRoot.querySelector(selectors.removeButton);

            expect(removeButton).toBeNull();
        });
    });

    describe('handleDelete', () => {
        it('fires deleteOutcomeEvent with outcome GUID', async () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithThreeConditionals;

            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(DeleteOutcomeEvent.EVENT_NAME, eventCallback);

            const removeButton = element.shadowRoot.querySelector(selectors.button);
            removeButton.click();

            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    guid: element.outcome.guid
                }
            });
        });
    });

    describe('condition list', () => {
        it('expression builder type should be fer-to-ferov', async () => {
            const element = createComponentUnderTest();
            getConditionsWithPrefixes.mockReturnValueOnce([
                {
                    prefix: 'foo',
                    condition: { rowIndex: 'bar' },
                    conditionLogic: { value: '1' }
                }
            ]);
            element.outcome = outcomeWithOneConditional;

            await ticks(1);
            const expressionBuilder = element.shadowRoot.querySelector(selectors.ferToFerovExpressionBuilder);
            expect(expressionBuilder).not.toBeNull();
        });
        it('has one conditional row per conditional', async () => {
            const element = createComponentUnderTest();
            getConditionsWithPrefixes.mockReturnValue([
                {
                    prefix: 'foo',
                    condition: { rowIndex: 'bar' },
                    conditionLogic: { value: '1' }
                },
                {
                    prefix: 'fizz',
                    condition: { rowIndex: 'buzz' },
                    conditionLogic: { value: '1' }
                },
                {
                    prefix: 'dunder',
                    condition: { rowIndex: 'mifflin' },
                    conditionLogic: { value: '1' }
                }
            ]);
            element.outcome = outcomeWithThreeConditionals;

            await ticks(1);
            const rowsArray = element.shadowRoot.querySelectorAll(selectors.row);
            expect(rowsArray).toHaveLength(3);
        });
        it('passes EqualTo as the default operator', async () => {
            const element = createComponentUnderTest();
            getConditionsWithPrefixes.mockReturnValueOnce([
                {
                    prefix: 'foo',
                    condition: { rowIndex: 'bar' },
                    conditionLogic: { value: '1' }
                }
            ]);
            element.outcome = outcomeWithOneConditional;
            await ticks(1);
            const expressionBuilder = element.shadowRoot.querySelector(selectors.ferToFerovExpressionBuilder);
            expect(expressionBuilder.defaultOperator).toEqual(RULE_OPERATOR.EQUAL_TO);
        });
    });

    describe('label description', () => {
        it("should call input label's focus() when shouldFocus is true", async () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;

            const labelAndNameComponents = element.shadowRoot.querySelectorAll(selectors.labelAndName);
            const inputLabel = labelAndNameComponents[0].shadowRoot.querySelector(selectors.label);
            inputLabel.focus = jest.fn();

            element.shouldFocus = true;

            await ticks(1);
            expect(labelAndNameComponents).toHaveLength(1);
            expect(inputLabel).not.toBeNull();
            expect(inputLabel.focus).toHaveBeenCalled();
        });

        it("should not call input label's focus() when shouldFocus is false", async () => {
            const element = createComponentUnderTest();
            element.outcome = outcomeWithOneConditional;

            const labelAndNameComponents = element.shadowRoot.querySelectorAll(selectors.labelAndName);
            const inputLabel = labelAndNameComponents[0].shadowRoot.querySelector(selectors.label);
            inputLabel.focus = jest.fn();

            element.shouldFocus = false;

            await ticks(1);
            expect(labelAndNameComponents).toHaveLength(1);
            expect(inputLabel).not.toBeNull();
            expect(inputLabel.focus).not.toHaveBeenCalled();
        });
    });
});
