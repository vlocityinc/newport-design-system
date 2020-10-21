// @ts-nocheck
import { createElement } from 'lwc';
import TimeTriggersEditor from 'builder_platform_interaction/timeTriggersEditor';

import { ticks } from 'builder_platform_interaction/builderTestUtils';

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
    REORDERABLE_NAV: 'builder_platform_interaction-reorderable-vertical-navigation'
};

let startElementWithTwoTimeTriggers;

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

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-time-triggers-editor', {
        is: TimeTriggersEditor
    });

    el.node = node;
    document.body.appendChild(el);

    return el;
};

describe('Time Triggers Editor', () => {
    describe('time triggers menu', () => {
        describe('array of menu items', () => {
            it('contains all time triggers in order', async () => {
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);

                await ticks(1);
                const reorderableOutcomeNav = timeTriggersEditor.shadowRoot.querySelector(SELECTORS.REORDERABLE_NAV);
                const menuItems = reorderableOutcomeNav.menuItems;

                // menu includes the default
                expect(menuItems).toHaveLength(2);
                expect(menuItems[0].element).toEqual(startElementWithTwoTimeTriggers.timeTriggers[0]);
                expect(menuItems[1].element).toEqual(startElementWithTwoTimeTriggers.timeTriggers[1]);
            });
            it('time triggers are not draggable', async () => {
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);

                await ticks(1);
                const reorderableOutcomeNav = timeTriggersEditor.shadowRoot.querySelector(SELECTORS.REORDERABLE_NAV);
                const menuItems = reorderableOutcomeNav.menuItems;

                expect(menuItems[0].isDraggable).toBeFalsy();
                expect(menuItems[1].isDraggable).toBeFalsy();
            });
            it('shows an error icon when there is an error in the time trigger', async () => {
                const timeTriggersEditor = createComponentForTest(startElementWithTwoTimeTriggers);

                await ticks(1);
                const reorderableOutcomeNav = timeTriggersEditor.shadowRoot.querySelector(SELECTORS.REORDERABLE_NAV);
                const menuItems = reorderableOutcomeNav.menuItems;

                // We mocked getErrorsFromHydratedElement to always return an error
                // so all non-immediate time triggers will show the error
                expect(menuItems[0].hasErrors).toBeTruthy();
                expect(menuItems[1].hasErrors).toBeTruthy();
            });
        });
    });
});
