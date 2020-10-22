// @ts-nocheck
import { createElement } from 'lwc';
import TimeTriggersEditor from 'builder_platform_interaction/timeTriggersEditor';
import { ticks, INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { UpdateNodeEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';

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

let startElementWithTwoTimeTriggers;

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
                    label: { value: '' }
                },
                {
                    guid: 'timeTrigger2',
                    label: { value: '' }
                }
            ]
        };
    });
    describe('time triggers menu', () => {
        describe('array of menu items', () => {
            it('contains all time triggers in order', async () => {
                expect.assertions(3);
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);

                await ticks(1);
                const reorderableOutcomeNav = timeTriggersEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableOutcomeNav.menuItems;

                // menu includes the default
                expect(menuItems).toHaveLength(2);
                expect(menuItems[0].element).toEqual(startElementWithTwoTimeTriggers.timeTriggers[0]);
                expect(menuItems[1].element).toEqual(startElementWithTwoTimeTriggers.timeTriggers[1]);
            });
            it('time triggers are not draggable', async () => {
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);
                expect.assertions(2);

                await ticks(1);
                const reorderableOutcomeNav = timeTriggersEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableOutcomeNav.menuItems;

                expect(menuItems[0].isDraggable).toBeFalsy();
                expect(menuItems[1].isDraggable).toBeFalsy();
            });
            it('shows an error icon when there is an error in the time trigger', async () => {
                expect.assertions(2);
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);

                await ticks(1);
                const reorderableOutcomeNav = timeTriggersEditor.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                const menuItems = reorderableOutcomeNav.menuItems;

                // We mocked getErrorsFromHydratedElement to always return an error
                // so all non-immediate time triggers will show the error
                expect(menuItems[0].hasErrors).toBeTruthy();
                expect(menuItems[1].hasErrors).toBeTruthy();
            });
        });
    });
    describe('handlePropertyChangedEvent', () => {
        it('property changed event dispatches an UpdateNodeEvent', async () => {
            expect.assertions(1);
            const timeTriggerEditor = createComponentForTest(startElementWithTwoTimeTriggers);

            const updateNodeCallBack = jest.fn();
            timeTriggerEditor.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallBack);

            const event = new PropertyChangedEvent('offsetNumber', 24, null, 'ABC');
            const timeTriggers = timeTriggerEditor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.TIME_TRIGGER
            );
            timeTriggers.dispatchEvent(event);
            await ticks(1);
            expect(updateNodeCallBack).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: timeTriggerEditor.node }
                })
            );
        });
    });
});
