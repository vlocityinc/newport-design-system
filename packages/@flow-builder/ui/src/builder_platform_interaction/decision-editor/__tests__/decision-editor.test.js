import {createElement} from 'engine';
import DecisionEditor from 'builder_platform_interaction-decision-editor';
import {
    DeleteOutcomeEvent,
} from 'builder_platform_interaction-events';

const mockNewState = {
    outcomes: [{
        guid: 'outcome 3',
        label: { value: ''},
        conditionLogic: { value: ''},
        conditions: []
    }]
};

jest.mock('../decision-reducer', () => {
    return {
        decisionReducer: jest.fn(() => {
            return mockNewState;
        })
    };
});

const selectors = {
    outcome: 'builder_platform_interaction-outcome',
};

const decisionWithTwoOutcomes = {
    label: {value: 'Test Name of the Decision'},
    name: {value: 'Test Dev Name'},
    guid: {value: 'decision1'},
    outcomes: [
        {
            guid: 'outcome1',
            label: { value: ''},
            conditionLogic: { value: ''},
            conditions: []
        },
        {
            guid: 'outcome2',
            label: { value: ''},
            conditionLogic: { value: ''},
            conditions: []
        },
    ]
};

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-decision-editor', {
        is: DecisionEditor
    });

    el.node = node;

    document.body.appendChild(el);

    return el;
};

describe('Decision Editor', () => {
    describe('handleDeleteOutcome', () => {
        it('calls the reducer with the passed in action', () => {
            const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);
            return Promise.resolve().then(() => {
                const deleteOutcomeEvent = new DeleteOutcomeEvent('outcomeGuid');

                const outcome = decisionEditor.querySelector(selectors.outcome);
                outcome.dispatchEvent(deleteOutcomeEvent);

                expect(decisionEditor.node).toEqual(mockNewState);
            });
        });

        // TODO: Figure out rendering issue (outcome is not being re-rendered)
        // it('sets the first outcome as active', () => {
        //     const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);
        //
        //     return Promise.resolve().then(() => {
        //         const deleteOutcomeEvent = new DeleteOutcomeEvent('outcomeGuid');
        //
        //         const outcomeElement = decisionEditor.querySelector(selectors.outcome);
        //         outcomeElement.dispatchEvent(deleteOutcomeEvent);
        //     }).then(() => {
        //         const outcomeElement = decisionEditor.querySelector(selectors.outcome);
        //         debugger;
        //         expect(outcomeElement.outcome).toEqual(mockNewState.outcomes[0]);
        //     });
        // });
    });
});