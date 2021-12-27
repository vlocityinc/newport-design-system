// @ts-nocheck
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import {
    DeleteScheduledPathEvent,
    ListItemInteractionEvent,
    PropertyChangedEvent,
    UpdateNodeEvent
} from 'builder_platform_interaction/events';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';
import ScheduledPathsEditor from 'builder_platform_interaction/scheduledPathsEditor';
import { createElement } from 'lwc';
import { scheduledPathsReducer } from '../scheduledPathsReducer';

let mockNewState;

jest.mock('../scheduledPathsReducer', () => {
    return {
        scheduledPathsReducer: jest.fn(() => {
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

jest.mock('builder_platform_interaction/sharedUtils', () =>
    jest.requireActual('builder_platform_interaction_mocks/sharedUtils')
);

const SELECTORS = {
    ADD_BUTTON: 'builder_platform_interaction-reorderable-vertical-navigation lightning-button-icon',
    IMMEDIATE_SCHEDULED_PATH: '.test-immediate-scheduled-path'
};

let startElementWithTwoScheduledPaths;
let startElementWithOneScheduledPaths;
let startElementWithrunAsyncScheduledPaths;

const IMMEDIATE_SCHEDULED_PATH_ID = 'immediateScheduledPath';

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-scheduled-paths-editor', {
        is: ScheduledPathsEditor
    });

    el.node = node;
    setDocumentBodyChildren(el);

    return el;
};

describe('Scheduled Paths Editor', () => {
    beforeEach(() => {
        startElementWithTwoScheduledPaths = {
            guid: { value: 'startElement' },
            scheduledPaths: [
                {
                    guid: 'scheduledPath1',
                    label: { value: '' },
                    offsetNumber: 1,
                    offsetUnit: { value: TIME_OPTION.DAYS_AFTER, error: null },
                    timeSource: { value: '', error: null }
                },
                {
                    guid: 'scheduledPath2',
                    label: { value: '' },
                    offsetNumber: 2,
                    offsetUnit: { value: TIME_OPTION.DAYS_BEFORE, error: null },
                    timeSource: { value: '', error: null }
                }
            ]
        };

        startElementWithOneScheduledPaths = {
            guid: { value: 'startElement' },
            scheduledPaths: [
                {
                    guid: 'scheduledPath1',
                    label: { value: '' },
                    offsetNumber: 1,
                    offsetUnit: { value: TIME_OPTION.DAYS_AFTER, error: null },
                    timeSource: { value: '', error: null }
                }
            ]
        };

        startElementWithrunAsyncScheduledPaths = {
            guid: { value: 'startElement' },
            scheduledPaths: [
                {
                    guid: 'runAsync',
                    pathType: { value: 'AsyncAfterCommit', error: null },
                    label: { value: 'Run Async', error: null },
                    name: { value: 'Run_Async', error: null },
                    offsetNumber: { value: 0, error: null },
                    offsetUnit: { value: '', error: null },
                    timeSource: { value: '', error: null }
                }
            ]
        };

        mockNewState = {
            guid: { value: 'startElement' },
            scheduledPaths: [
                {
                    guid: 'scheduledPath1',
                    label: { value: '' },
                    offsetNumber: 1,
                    offsetUnit: { value: TIME_OPTION.DAYS_AFTER, error: null },
                    timeSource: { value: '', error: null }
                },
                {
                    guid: 'scheduledPath2',
                    label: { value: '' },
                    offsetNumber: 2,
                    offsetUnit: { value: TIME_OPTION.DAYS_BEFORE, error: null },
                    timeSource: { value: '', error: null }
                }
            ]
        };
    });
    describe('scheduled paths menu', () => {
        describe('array of menu items', () => {
            it('contains all scheduled paths in order including immediate scheduled path at the start', () => {
                expect.assertions(4);
                const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
                const reorderableScheduledPathNav = scheduledPathsEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableScheduledPathNav.menuItems;
                // menu includes the default
                expect(menuItems[0]).toEqual({
                    element: {
                        guid: IMMEDIATE_SCHEDULED_PATH_ID
                    },
                    label: 'FlowBuilderStartEditor.immediateScheduledPathLabel',
                    isDraggable: false
                });
                expect(menuItems).toHaveLength(3);
                expect(menuItems[1].element).toEqual(startElementWithTwoScheduledPaths.scheduledPaths[0]);
                expect(menuItems[2].element).toEqual(startElementWithTwoScheduledPaths.scheduledPaths[1]);
            });
            it('scheduled paths are not draggable', () => {
                const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
                expect.assertions(2);
                const reorderableScheduledPathNav = scheduledPathsEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableScheduledPathNav.menuItems;

                expect(menuItems[0].isDraggable).toBeFalsy();
                expect(menuItems[1].isDraggable).toBeFalsy();
            });
            it('shows an error icon when there is an error in the scheduled path', () => {
                expect.assertions(2);
                const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
                const reorderableScheduledPathNav = scheduledPathsEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableScheduledPathNav.menuItems;

                // We mocked getErrorsFromHydratedElement to always return an error
                // so all non-immediate scheduled paths will show the error
                expect(menuItems[1].hasErrors).toBeTruthy();
                expect(menuItems[2].hasErrors).toBeTruthy();
            });
        });
    });
    describe('handleDeleteScheduledPath', () => {
        it('calls the reducer with the passed in action', async () => {
            expect.assertions(1);
            const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
            const deletescheduledPathEvent = new DeleteScheduledPathEvent('scheduledPath1');
            const scheduledPath = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            scheduledPath.dispatchEvent(deletescheduledPathEvent);
            await ticks(1);
            expect(scheduledPathsEditor.node).toEqual(mockNewState);
        });
        it('sets the first scheduled path as active when there are 3 scheduled paths (including immediate)', async () => {
            expect.assertions(1);
            const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
            const deletescheduledPathEvent = new DeleteScheduledPathEvent('scheduledPath1');
            let scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            mockNewState.scheduledPaths.pop();
            scheduledPathElement.dispatchEvent(deletescheduledPathEvent);
            await ticks(1);
            scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            expect(scheduledPathElement.scheduledPath).toEqual(mockNewState.scheduledPaths[0]);
        });
        it('sets the immediate scheduled path as active when there are 2 scheduled paths (including immediate)', async () => {
            expect.assertions(1);
            const scheduledPathsEditor = createComponentForTest(startElementWithOneScheduledPaths);
            const deletescheduledPathEvent = new DeleteScheduledPathEvent('scheduledPath1');
            const scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            mockNewState.scheduledPaths.pop();
            mockNewState.scheduledPaths.pop();
            scheduledPathElement.dispatchEvent(deletescheduledPathEvent);
            await ticks(1);
            const immediateScheduledPathBody = scheduledPathsEditor.shadowRoot.querySelector(
                SELECTORS.IMMEDIATE_SCHEDULED_PATH
            );
            expect(immediateScheduledPathBody).not.toBe(null);
        });
        it('does not change the active scheduled path if the scheduled path was not deleted', async () => {
            expect.assertions(1);
            const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
            const reorderableScheduledPathNav = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
            );
            reorderableScheduledPathNav.dispatchEvent(
                new ListItemInteractionEvent('scheduledPath2', ListItemInteractionEvent.Type.Select)
            );
            await ticks(1);
            scheduledPathsReducer.mockReturnValueOnce(startElementWithTwoScheduledPaths);
            const deleteScheduledPathEvent = new DeleteScheduledPathEvent('scheduledPath1');
            let scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            scheduledPathElement.dispatchEvent(deleteScheduledPathEvent);
            await ticks(1);
            scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            expect(scheduledPathElement.scheduledPath).toEqual(startElementWithTwoScheduledPaths.scheduledPaths[1]);
        });
        it('dispatches an UpdateNodeEvent when scheduled path is deleted', async () => {
            expect.assertions(1);
            const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
            const updateNodeCallBack = jest.fn();
            scheduledPathsEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);
            const event = new DeleteScheduledPathEvent('scheduledPath2');
            const scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            scheduledPathElement.dispatchEvent(event);
            await ticks(1);
            expect(updateNodeCallBack).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: scheduledPathsEditor.node }
                })
            );
        });

        it('Focus function on the scheduled path is called after deletion', () => {
            const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
            const event = new DeleteScheduledPathEvent('scheduledPath2');
            const scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            scheduledPathElement.focus = jest.fn();
            scheduledPathElement.dispatchEvent(event);
            expect(scheduledPathElement.focus).toHaveBeenCalled();
        });

        it('Focus function on the scheduled path should not be called if the last path is deleted', () => {
            const scheduledPathsEditor = createComponentForTest(startElementWithOneScheduledPaths);
            const event = new DeleteScheduledPathEvent('scheduledPath1');
            const scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            mockNewState.scheduledPaths.pop();
            mockNewState.scheduledPaths.pop();
            scheduledPathElement.focus = jest.fn();
            scheduledPathElement.dispatchEvent(event);
            expect(scheduledPathElement.focus).not.toHaveBeenCalled();
        });

        it('Focus function on the "+" button should be called if the last path is deleted', () => {
            const scheduledPathsEditor = createComponentForTest(startElementWithOneScheduledPaths);
            const event = new DeleteScheduledPathEvent('scheduledPath1');
            const scheduledPathElement = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            mockNewState.scheduledPaths.pop();
            mockNewState.scheduledPaths.pop();
            const addButton = scheduledPathsEditor.shadowRoot.querySelector(SELECTORS.ADD_BUTTON);
            addButton.focus = jest.fn();
            scheduledPathElement.dispatchEvent(event);
            expect(addButton.focus).toHaveBeenCalled();
        });
    });
    describe('handlePropertyChangedEvent', () => {
        it('property changed event dispatches an UpdateNodeEvent', () => {
            expect.assertions(1);
            const scheduledPathEditor = createComponentForTest(startElementWithTwoScheduledPaths);

            const updateNodeCallBack = jest.fn();
            scheduledPathEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);

            const event = new PropertyChangedEvent('offsetNumber', 24, null, 'ABC');
            const scheduledPaths = scheduledPathEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.SCHEDULED_PATH
            );
            scheduledPaths.dispatchEvent(event);
            expect(updateNodeCallBack).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: scheduledPathEditor.node }
                })
            );
        });
    });
    describe('default immediate scheduled path', () => {
        it('default immediate scheduled path is displayed in rhs when selected in left panel', async () => {
            expect.assertions(1);
            const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
            const reorderableOutcomeNav = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
            );
            reorderableOutcomeNav.dispatchEvent(
                new ListItemInteractionEvent(IMMEDIATE_SCHEDULED_PATH_ID, ListItemInteractionEvent.Type.Select)
            );
            await ticks(1);
            const immediateScheduledPathSection = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.ILLUSTRATION
            );
            expect(immediateScheduledPathSection).not.toBeNull();
        });
        it('initial immediate scheduled path does not have an error', () => {
            const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
            const reorderableOutcomeNav = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
            );
            const menuItems = reorderableOutcomeNav.menuItems;

            expect(menuItems[0].hasErrors).toBeFalsy();
        });
    });
    describe('run on success scheduled path', () => {
        it('run on success scheduled path is displayed in rhs when selected in left panel', async () => {
            expect.assertions(1);
            const scheduledPathsEditor = createComponentForTest(startElementWithrunAsyncScheduledPaths);
            const reorderableOutcomeNav = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
            );
            reorderableOutcomeNav.dispatchEvent(
                new CustomEvent('itemselected', {
                    detail: { itemId: 'runAsync' }
                })
            );
            await ticks(1);
            const runAsyncScheduledPathSection = scheduledPathsEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.ILLUSTRATION
            );
            expect(runAsyncScheduledPathSection).not.toBeNull();
        });
    });
});
