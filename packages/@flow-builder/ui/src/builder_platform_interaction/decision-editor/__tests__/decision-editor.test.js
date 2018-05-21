import {createElement} from 'engine';
import DecisionEditor from 'builder_platform_interaction-decision-editor';
import { decisionReducer } from '../decision-reducer';
import {
    DeleteOutcomeEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction-events';

const mockNewState = {
    label: {value: 'New Decision'},
    name: {value: 'New Dec Dev Name'},
    guid: {value: 'decision99'},
    defaultConnectorLabel: { value: 'foo'},
    outcomes: [{
        guid: 'outcome 3',
        label: { value: ''},
        name: { value: ''},
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

const SELECTORS = {
    OUTCOME: 'builder_platform_interaction-outcome',
    REORDERABLE_NAV: 'builder_platform_interaction-reorderable-vertical-navigation',
    DEFAULT_OUTCOME: 'builder_platform_interaction-label-description.defaultOutcome'
};

let decisionWithOneOutcome;
let decisionWithTwoOutcomes;

beforeEach(() => {
    decisionWithOneOutcome = {
        label: {value: 'Test Name of the Decision'},
        name: {value: 'Test Dev Name'},
        guid: {value: 'decision2'},
        outcomes: [
            {
                guid: 'outcome1',
                label: { value: ''},
                conditionLogic: { value: ''},
                conditions: []
            }
        ]
    };

    decisionWithTwoOutcomes = {
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
});

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

                const outcome = decisionEditor.querySelector(SELECTORS.OUTCOME);
                outcome.dispatchEvent(deleteOutcomeEvent);

                expect(decisionEditor.node).toEqual(mockNewState);
            });
        });

        // TODO: W-4972558
        // Figure out rendering issue (outcome is not being re-rendered) due to slots
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

    describe('showDeleteOutcome', () => {
        it('is true when more than one outcome is present', () => {
            const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);

            return Promise.resolve().then(() => {
                const outcomeElement = decisionEditor.querySelector(SELECTORS.OUTCOME);
                expect(outcomeElement.showDelete).toBe(true);
            });
        });
        it('is false when only one outcome is present', () => {
            const decisionEditor = createComponentForTest(decisionWithOneOutcome);

            return Promise.resolve().then(() => {
                const outcomeElement = decisionEditor.querySelector(SELECTORS.OUTCOME);
                expect(outcomeElement.showDelete).toBe(false);
            });
        });
    });

    describe('outcome menu', () => {
        describe('array of menu items', () => {
            it('contains all outcomes in order plus default at end', () => {
                const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);

                return Promise.resolve().then(() => {
                    const reorderableOutcomeNav = decisionEditor.querySelector(SELECTORS.REORDERABLE_NAV);
                    const menuItems = reorderableOutcomeNav.menuItems;

                    // menu includes the default
                    expect(menuItems).toHaveLength(3);
                    expect(menuItems[0].element).toEqual(decisionWithTwoOutcomes.outcomes[0]);
                    expect(menuItems[1].element).toEqual(decisionWithTwoOutcomes.outcomes[1]);
                    expect(menuItems[2]).toEqual({
                        element: {},
                        label: '[Default Outcome]',
                        isDraggable: false
                    });
                });
            });
            it('outcomes are draggable', () => {
                const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);

                return Promise.resolve().then(() => {
                    const reorderableOutcomeNav = decisionEditor.querySelector(SELECTORS.REORDERABLE_NAV);
                    const menuItems = reorderableOutcomeNav.menuItems;

                    expect(menuItems[0].isDraggable).toBeTruthy();
                    expect(menuItems[1].isDraggable).toBeTruthy();
                });
            });
            it('default outcome is not draggable', () => {
                const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);

                return Promise.resolve().then(() => {
                    const reorderableOutcomeNav = decisionEditor.querySelector(SELECTORS.REORDERABLE_NAV);
                    const menuItems = reorderableOutcomeNav.menuItems;

                    expect(menuItems[2].isDraggable).toBeFalsy();
                });
            });
        });
    });

    describe('default outcome', () => {
        it('calls the reducer with the passed in action and a propertyName of defaultConnectorLabel', () => {
            const decisionEditor = createComponentForTest(decisionWithOneOutcome);

            // trigger showing of default outcome
            const reorderableOutcomeNav = decisionEditor.querySelector(SELECTORS.REORDERABLE_NAV);
            reorderableOutcomeNav.dispatchEvent(new CustomEvent('itemselected', {
                detail: { itemId: null }
            }));

            return Promise.resolve().then(() => {
                const modifyDefaultOutcomeEvent = new PropertyChangedEvent('name', 'newValue');

                const defaultOutcome = decisionEditor.querySelector(SELECTORS.DEFAULT_OUTCOME);

                defaultOutcome.dispatchEvent(modifyDefaultOutcomeEvent);

                const mockCallParams = decisionReducer.mock.calls[0];
                const decisionReducerEvent = mockCallParams[1];

                expect(mockCallParams[0]).toEqual(decisionWithOneOutcome);

                const expectedReducerEvent = {
                    type: 'propertychanged',
                    detail: {
                        propertyName: 'defaultConnectorLabel',
                        value: modifyDefaultOutcomeEvent.detail.value
                    }
                };

                expect(decisionReducerEvent.type).toEqual(expectedReducerEvent.type);
                expect(decisionReducerEvent.detail.propertyName).toEqual(expectedReducerEvent.detail.propertyName);
                expect(decisionReducerEvent.detail.value).toEqual(expectedReducerEvent.detail.value);
            });
        });
    });
});