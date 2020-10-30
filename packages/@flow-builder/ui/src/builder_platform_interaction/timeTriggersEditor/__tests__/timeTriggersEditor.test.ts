// @ts-nocheck
import { createElement } from 'lwc';
import TimeTriggersEditor from 'builder_platform_interaction/timeTriggersEditor';
import { ticks, INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { timeTriggersReducer } from '../timeTriggersReducer';
import { UpdateNodeEvent, PropertyChangedEvent, DeleteTimeTriggerEvent } from 'builder_platform_interaction/events';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';

let mockNewState;

jest.mock('../timeTriggersReducer', () => {
    return {
        timeTriggersReducer: jest.fn(() => {
            return mockNewState;
        })
    };
});

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');
    return {
        pick: actual.pick,
        getErrorsFromHydratedElement: jest.fn(() => {
            return ['some error'];
        }),
        getValueFromHydratedItem: jest.fn(),
        updateProperties: actual.updateProperties
    };
});

const SELECTORS = {
    IMMEDIATE_TIME_TRIGGER: '.test-immediate-time-trigger'
};

let startElementWithTwoTimeTriggers;
let startElementWithOneTimeTriggers;

const IMMEDIATE_TIME_TRIGGER_ID = 'immediateTimeTrigger';

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-time-triggers-editor', {
        is: TimeTriggersEditor
    });

    el.node = node;
    document.body.appendChild(el);

    return el;
};

describe('Time Triggers Editor', () => {
    beforeEach(() => {
        startElementWithTwoTimeTriggers = {
            guid: { value: 'startElement' },
            timeTriggers: [
                {
                    guid: 'timeTrigger1',
                    label: { value: '' },
                    offsetNumber: 1,
                    offsetUnit: { value: TIME_OPTION.DAYS_AFTER, error: null },
                    timeSource: { value: '', error: null }
                },
                {
                    guid: 'timeTrigger2',
                    label: { value: '' },
                    offsetNumber: 2,
                    offsetUnit: { value: TIME_OPTION.DAYS_BEFORE, error: null },
                    timeSource: { value: '', error: null }
                }
            ]
        };

        startElementWithOneTimeTriggers = {
            guid: { value: 'startElement' },
            timeTriggers: [
                {
                    guid: 'timeTrigger1',
                    label: { value: '' },
                    offsetNumber: 1,
                    offsetUnit: { value: TIME_OPTION.DAYS_AFTER, error: null },
                    timeSource: { value: '', error: null }
                }
            ]
        };

        mockNewState = {
            guid: { value: 'startElement' },
            timeTriggers: [
                {
                    guid: 'timeTrigger1',
                    label: { value: '' },
                    offsetNumber: 1,
                    offsetUnit: { value: TIME_OPTION.DAYS_AFTER, error: null },
                    timeSource: { value: '', error: null }
                },
                {
                    guid: 'timeTrigger2',
                    label: { value: '' },
                    offsetNumber: 2,
                    offsetUnit: { value: TIME_OPTION.DAYS_BEFORE, error: null },
                    timeSource: { value: '', error: null }
                }
            ]
        };
    });
    describe('time triggers menu', () => {
        describe('array of menu items', () => {
            it('contains all time triggers in order including immediate time trigger at the end', () => {
                expect.assertions(4);
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
                const reorderableTimeTriggerNav = timeTriggersEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableTimeTriggerNav.menuItems;
                // menu includes the default
                expect(menuItems).toHaveLength(3);
                expect(menuItems[0].element).toEqual(startElementWithTwoTimeTriggers.timeTriggers[0]);
                expect(menuItems[1].element).toEqual(startElementWithTwoTimeTriggers.timeTriggers[1]);
                expect(menuItems[2]).toEqual({
                    element: {
                        guid: IMMEDIATE_TIME_TRIGGER_ID
                    },
                    label: 'FlowBuilderStartEditor.immediateTimeTriggerLabel',
                    isDraggable: false
                });
            });
            it('time triggers are not draggable', () => {
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
                expect.assertions(2);
                const reorderableTimeTriggerNav = timeTriggersEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableTimeTriggerNav.menuItems;

                expect(menuItems[0].isDraggable).toBeFalsy();
                expect(menuItems[1].isDraggable).toBeFalsy();
            });
            it('shows an error icon when there is an error in the time trigger', () => {
                expect.assertions(2);
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
                const reorderableTimeTriggerNav = timeTriggersEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableTimeTriggerNav.menuItems;

                // We mocked getErrorsFromHydratedElement to always return an error
                // so all non-immediate time triggers will show the error
                expect(menuItems[0].hasErrors).toBeTruthy();
                expect(menuItems[1].hasErrors).toBeTruthy();
            });
        });
    });
    describe('handleDeleteTimeTrigger', () => {
        it('calls the reducer with the passed in action', async () => {
            expect.assertions(1);
            const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
            const deletetimeTriggerEvent = new DeleteTimeTriggerEvent('timeTriggerGuid');
            const timeTrigger = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            timeTrigger.dispatchEvent(deletetimeTriggerEvent);
            await ticks(1);
            expect(timeTriggersEditor.node).toEqual(mockNewState);
        });
        it('sets the first time trigger as active when there are 3 time triggers (including immediate)', async () => {
            expect.assertions(1);
            const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
            const deletetimeTriggerEvent = new DeleteTimeTriggerEvent('timeTriggerGuid');
            let timeTriggerElement = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            mockNewState.timeTriggers.pop();
            timeTriggerElement.dispatchEvent(deletetimeTriggerEvent);
            await ticks(1);
            timeTriggerElement = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            expect(timeTriggerElement.timeTrigger).toEqual(mockNewState.timeTriggers[0]);
        });
        it('sets the immediate time trigger as active when there are 2 time triggers (including immediate)', async () => {
            expect.assertions(1);
            const timeTriggersEditor = createComponentForTest(startElementWithOneTimeTriggers);
            const deletetimeTriggerEvent = new DeleteTimeTriggerEvent('timeTriggerGuid');
            const timeTriggerElement = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            mockNewState.timeTriggers.pop();
            mockNewState.timeTriggers.pop();
            timeTriggerElement.dispatchEvent(deletetimeTriggerEvent);
            await ticks(1);
            const immediateTimeTriggerBody = timeTriggersEditor.shadowRoot.querySelector(
                SELECTORS.IMMEDIATE_TIME_TRIGGER
            );
            expect(immediateTimeTriggerBody).not.toBe(null);
        });
        it('does not change the active time trigger if the time trigger was not deleted', async () => {
            expect.assertions(1);
            const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
            const reorderableTimeTriggerNav = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
            );
            reorderableTimeTriggerNav.dispatchEvent(
                new CustomEvent('itemselected', {
                    detail: { itemId: 'timeTrigger2' }
                })
            );
            await ticks(1);
            timeTriggersReducer.mockReturnValueOnce(startElementWithTwoTimeTriggers);
            const deleteTimeTriggerEvent = new DeleteTimeTriggerEvent('timeTrigger1');
            let timeTriggerElement = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            timeTriggerElement.dispatchEvent(deleteTimeTriggerEvent);
            await ticks(1);
            timeTriggerElement = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            expect(timeTriggerElement.timeTrigger).toEqual(startElementWithTwoTimeTriggers.timeTriggers[1]);
        });
        it('dispatches an UpdateNodeEvent when time trigger is deleted', async () => {
            expect.assertions(1);
            const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
            const updateNodeCallBack = jest.fn();
            timeTriggersEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);
            const event = new DeleteTimeTriggerEvent('timeTrigger2');
            const timeTriggerElement = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            timeTriggerElement.dispatchEvent(event);
            await ticks(1);
            expect(updateNodeCallBack).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: timeTriggersEditor.node }
                })
            );
        });
    });
    describe('handlePropertyChangedEvent', () => {
        it('property changed event dispatches an UpdateNodeEvent', () => {
            expect.assertions(1);
            const timeTriggerEditor = createComponentForTest(startElementWithTwoTimeTriggers);

            const updateNodeCallBack = jest.fn();
            timeTriggerEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);

            const event = new PropertyChangedEvent('offsetNumber', 24, null, 'ABC');
            const timeTriggers = timeTriggerEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            timeTriggers.dispatchEvent(event);
            expect(updateNodeCallBack).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: timeTriggerEditor.node }
                })
            );
        });
    });
    describe('default immediate time trigger', () => {
        it('default immediate time trigger is displayed in rhs when selected in left panel', async () => {
            expect.assertions(1);
            const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
            const reorderableOutcomeNav = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
            );
            reorderableOutcomeNav.dispatchEvent(
                new CustomEvent('itemselected', {
                    detail: { itemId: IMMEDIATE_TIME_TRIGGER_ID }
                })
            );
            await ticks(1);
            const immediateTimeTriggerSection = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.ILLUSTRATION
            );
            expect(immediateTimeTriggerSection).not.toBeNull();
        });
        it('initial immediate time trigger does not have an error', () => {
            const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
            const reorderableOutcomeNav = timeTriggersEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
            );
            const menuItems = reorderableOutcomeNav.menuItems;

            expect(menuItems[2].hasErrors).toBeFalsy();
        });
    });
});
