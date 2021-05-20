// @ts-nocheck
import { createElement } from 'lwc';
import ProcessTypesVerticalNavigation from '../processTypesVerticalNavigation';
import { ALL_PROCESS_TYPE } from 'builder_platform_interaction/processTypeLib';
import { ProcessTypeSelectedEvent } from 'builder_platform_interaction/events';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { processTypes } from 'serverData/GetProcessTypes/processTypes.json';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-process-types-vertical-navigation', {
        is: ProcessTypesVerticalNavigation
    });
    Object.assign(el, { processTypes });
    setDocumentBodyChildren(el);
    return el;
};

const SELECTORS = {
    VERTICAL_NAVIGATION_ITEM_ICON: 'lightning-vertical-navigation-item-icon',
    VERTICAL_NAVIGATION_ITEM_ICON_ANCHOR: 'a'
};

const getAllVerticalNavigationItemIcons = (processTypesVerticalNavigation) =>
    processTypesVerticalNavigation.shadowRoot.querySelectorAll(SELECTORS.VERTICAL_NAVIGATION_ITEM_ICON);

describe('process-types-vertical-navigation ', () => {
    let processTypesVerticalNavigation;
    beforeEach(() => {
        processTypesVerticalNavigation = createComponentUnderTest();
    });
    describe('Process types details', () => {
        test('by default "all" entry selected', () => {
            expect(processTypesVerticalNavigation.selectedProcessType).toBe(ALL_PROCESS_TYPE.name);
        });

        test('number of process types', () => {
            expect(processTypesVerticalNavigation.items).toHaveLength(processTypes.length + 1); // 'ALL' entry included
        });

        test('"All" entry in first place (among process types) (API)', () => {
            expect(processTypesVerticalNavigation.items[0]).toMatchObject({
                name: ALL_PROCESS_TYPE.name
            });
        });
    });

    describe('Events', () => {
        test('should fire "ProcessTypeSelectedEvent" when selecting a process type with process type name', async () => {
            const eventCallback = jest.fn();
            processTypesVerticalNavigation.addEventListener(ProcessTypeSelectedEvent.EVENT_NAME, eventCallback);
            const processTypesVerticalNavigationItemIcon = getAllVerticalNavigationItemIcons(
                processTypesVerticalNavigation
            )[1];

            processTypesVerticalNavigationItemIcon.dispatchEvent(
                new CustomEvent('select', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        name: processTypesVerticalNavigationItemIcon.name
                    }
                })
            );
            await Promise.resolve();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({
                name: processTypesVerticalNavigationItemIcon.name
            });
        });
    });
});
