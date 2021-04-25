// @ts-nocheck
import { createElement } from 'lwc';
import ScheduledPathsEditor from 'builder_platform_interaction/scheduledPathsEditor';
import {
    ticks,
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { scheduledPathsReducer } from '../scheduledPathsReducer';
import { UpdateNodeEvent, PropertyChangedEvent, DeleteScheduledPathEvent } from 'builder_platform_interaction/events';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';

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

const SELECTORS = {
    IMMEDIATE_SCHEDULED_PATH: '.test-immediate-scheduled-path'
};

let startElementWithTwoScheduledPaths;
let startElementWithOneScheduledPaths;

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
            it('contains all scheduled paths in order including immediate scheduled path at the end', () => {
                expect.assertions(4);
                const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
                const reorderableScheduledPathNav = scheduledPathsEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableScheduledPathNav.menuItems;
                // menu includes the default
                expect(menuItems).toHaveLength(3);
                expect(menuItems[0].element).toEqual(startElementWithTwoScheduledPaths.scheduledPaths[0]);
                expect(menuItems[1].element).toEqual(startElementWithTwoScheduledPaths.scheduledPaths[1]);
                expect(menuItems[2]).toEqual({
                    element: {
                        guid: IMMEDIATE_SCHEDULED_PATH_ID
                    },
                    label: 'FlowBuilderStartEditor.immediateScheduledPathLabel',
                    isDraggable: false
                });
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
                expect(menuItems[0].hasErrors).toBeTruthy();
                expect(menuItems[1].hasErrors).toBeTruthy();
            });
        });
    });
    describe('handleDeleteScheduledPath', () => {
        it('calls the reducer with the passed in action', async () => {
            expect.assertions(1);
            const scheduledPathsEditor = createComponentForTest(startElementWithTwoScheduledPaths);
            const deletescheduledPathEvent = new DeleteScheduledPathEvent('scheduledPathGuid');
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
            const deletescheduledPathEvent = new DeleteScheduledPathEvent('scheduledPathGuid');
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
            const deletescheduledPathEvent = new DeleteScheduledPathEvent('scheduledPathGuid');
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
                new CustomEvent('itemselected', {
                    detail: { itemId: 'scheduledPath2' }
                })
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
                new CustomEvent('itemselected', {
                    detail: { itemId: IMMEDIATE_SCHEDULED_PATH_ID }
                })
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

            expect(menuItems[2].hasErrors).toBeFalsy();
        });
    });
});
