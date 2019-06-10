import { createElement } from 'lwc';
import ProcessTypesVerticalNavigation from '../processTypesVerticalNavigation';
import {
    ALL_PROCESS_TYPE,
    PROCESS_TYPES_ICONS,
    PROCESS_TYPE_DEFAULT_ICON
} from 'builder_platform_interaction/processTypeLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ProcessTypeSelectedEvent } from 'builder_platform_interaction/events';
import {
    MOCK_PROCESS_TYPES,
    MOCK_ALL_PROCESS_TYPES
} from 'mock/processTypesData';

const createComponentUnderTest = (processTypes = MOCK_ALL_PROCESS_TYPES) => {
    const el = createElement(
        'builder_platform_interaction-process-types-vertical-navigation',
        { is: ProcessTypesVerticalNavigation }
    );
    Object.assign(el, { processTypes });
    document.body.appendChild(el);
    return el;
};

const createComponentUnderTestWithFeaturedTypesOnly = createComponentUnderTest.bind(
    null,
    MOCK_PROCESS_TYPES.FEATURED
);

const SELECTORS = {
    VERTICAL_NAVIGATION_ITEM_ICON: 'lightning-vertical-navigation-item-icon',
    VERTICAL_NAVIGATION_ITEM_ICON_ANCHOR: 'a'
};

const getAllVerticalNavigationItemIcons = processTypesVerticalNavigation =>
    processTypesVerticalNavigation.shadowRoot.querySelectorAll(
        SELECTORS.VERTICAL_NAVIGATION_ITEM_ICON
    );
const getProcessTypeAnchor = processTypesVerticalNavigationItemIcon =>
    processTypesVerticalNavigationItemIcon.shadowRoot.querySelector(
        SELECTORS.VERTICAL_NAVIGATION_ITEM_ICON_ANCHOR
    );

describe('process-types-vertical-navigation ', () => {
    let processTypesVerticalNavigation;
    beforeEach(() => {
        processTypesVerticalNavigation = createComponentUnderTest();
    });
    describe('Process types details', () => {
        test('by default "all" entry selected', () => {
            expect(processTypesVerticalNavigation.selectedProcessType).toBe(
                ALL_PROCESS_TYPE.name
            );
        });

        test('number of "featured" process types', () => {
            expect(
                processTypesVerticalNavigation.featuredProcessTypes
            ).toHaveLength(MOCK_PROCESS_TYPES.FEATURED.length + 1); // 'ALL' entry included
        });

        test('number of "other" process types', () => {
            expect(
                processTypesVerticalNavigation.otherProcessTypes
            ).toHaveLength(MOCK_PROCESS_TYPES.OTHERS.length);
        });

        test('"All" entry in first place (among featured process types) (API)', () => {
            expect(
                processTypesVerticalNavigation.featuredProcessTypes[0]
            ).toMatchObject({ name: ALL_PROCESS_TYPE.name });
        });

        test('details of "featured" process types ("all" included) (API)', () => {
            expect(processTypesVerticalNavigation.featuredProcessTypes).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        label: 'FlowBuilderProcessTypesVerticalNavigation.all',
                        name: ALL_PROCESS_TYPE.name,
                        iconName: PROCESS_TYPES_ICONS.FEATURED.get(
                            ALL_PROCESS_TYPE.name
                        )
                    }),
                    expect.objectContaining({
                        label: 'Autolaunched Flow',
                        name: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                        iconName: PROCESS_TYPES_ICONS.FEATURED.get(
                            FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                        )
                    }),
                    expect.objectContaining({
                        label: 'Screen Flow',
                        name: FLOW_PROCESS_TYPE.FLOW,
                        iconName: PROCESS_TYPES_ICONS.FEATURED.get(
                            FLOW_PROCESS_TYPE.FLOW
                        )
                    })
                ])
            );
        });

        test('details of "other" process types (API)', () => {
            expect(processTypesVerticalNavigation.otherProcessTypes).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        label: 'Checkout Flow',
                        name: FLOW_PROCESS_TYPE.CHECKOUT_FLOW,
                        iconName: PROCESS_TYPES_ICONS.OTHERS.get(
                            FLOW_PROCESS_TYPE.CHECKOUT_FLOW
                        )
                    }),
                    expect.objectContaining({
                        label: 'Contact Request Flow',
                        name: FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW,
                        iconName: PROCESS_TYPES_ICONS.OTHERS.get(
                            FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW
                        )
                    }),
                    expect.objectContaining({
                        label: 'Embedded Appointment Management Flow',
                        name: FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB,
                        iconName: PROCESS_TYPES_ICONS.OTHERS.get(
                            FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB
                        )
                    }),
                    expect.objectContaining({
                        label: 'Field Service Mobile Flow',
                        name: FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE,
                        iconName: PROCESS_TYPES_ICONS.OTHERS.get(
                            FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE
                        )
                    }),
                    expect.objectContaining({
                        label: 'User Provisioning Flow',
                        name: FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW,
                        iconName: PROCESS_TYPES_ICONS.OTHERS.get(
                            FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW
                        )
                    }),
                    expect.objectContaining({
                        label: 'Well no icon yet',
                        name: 'WeDoNotKnowYou',
                        iconName: PROCESS_TYPE_DEFAULT_ICON
                    })
                ])
            );
        });

        test('process types name', () => {
            const processTypesVerticalNavigationItemIcons = getAllVerticalNavigationItemIcons(
                processTypesVerticalNavigation
            );
            const joinedProcessTypesNames = Array.from(
                processTypesVerticalNavigationItemIcons
            )
                .map(itemIcon => {
                    return itemIcon.name;
                })
                .join('');
            expect(joinedProcessTypesNames).toBe(
                ALL_PROCESS_TYPE.name +
                    MOCK_ALL_PROCESS_TYPES.map(processType => {
                        return processType.name;
                    }).join('')
            );
        });

        test('process types icon name', () => {
            const processTypesVerticalNavigationItemIcons = getAllVerticalNavigationItemIcons(
                processTypesVerticalNavigation
            );
            const joinedProcessTypesIconNames = Array.from(
                processTypesVerticalNavigationItemIcons
            )
                .map(itemIcon => {
                    return itemIcon.shadowRoot.querySelector('lightning-icon')
                        .iconName;
                })
                .join('');
            const expectedJoinedIconNames = `${PROCESS_TYPE_DEFAULT_ICON}utility:magicwandutility:desktoputility:cartutility:contact_requestutility:insert_tag_fieldutility:phone_portraitutility:user${PROCESS_TYPE_DEFAULT_ICON}`;
            expect(joinedProcessTypesIconNames).toBe(expectedJoinedIconNames);
        });
    });

    describe('Events', () => {
        test('should fire "ProcessTypeSelectedEvent" when selecting a process type with process type name', async () => {
            const eventCallback = jest.fn();
            processTypesVerticalNavigation.addEventListener(
                ProcessTypeSelectedEvent.EVENT_NAME,
                eventCallback
            );
            const processTypesVerticalNavigationItemIcon = getAllVerticalNavigationItemIcons(
                processTypesVerticalNavigation
            )[1];
            const autolaunchedFlowAnchor = getProcessTypeAnchor(
                processTypesVerticalNavigationItemIcon
            );
            autolaunchedFlowAnchor.dispatchEvent(new Event('click'));
            await Promise.resolve();
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({
                name: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
            });
        });
    });
});

describe('process-types-vertical-navigation only with featured types', () => {
    let processTypesVerticalNavigation;
    beforeEach(() => {
        processTypesVerticalNavigation = createComponentUnderTestWithFeaturedTypesOnly();
    });

    describe('Process types details', () => {
        test('by default "all" entry selected', () => {
            expect(processTypesVerticalNavigation.selectedProcessType).toBe(
                ALL_PROCESS_TYPE.name
            );
        });

        test('number of "featured" process types', () => {
            expect(
                processTypesVerticalNavigation.featuredProcessTypes
            ).toHaveLength(MOCK_PROCESS_TYPES.FEATURED.length + 1); // 'ALL' entry included
        });

        test('number of "other" process types', () => {
            expect(
                processTypesVerticalNavigation.otherProcessTypes
            ).toHaveLength(0);
        });

        test('"All" entry in first place (among featured process types) (API)', () => {
            expect(
                processTypesVerticalNavigation.featuredProcessTypes[0]
            ).toMatchObject({ name: ALL_PROCESS_TYPE.name });
        });

        test('details of "featured" process types ("all" included) (API)', () => {
            expect(processTypesVerticalNavigation.featuredProcessTypes).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        label: 'FlowBuilderProcessTypesVerticalNavigation.all',
                        name: ALL_PROCESS_TYPE.name,
                        iconName: PROCESS_TYPES_ICONS.FEATURED.get(
                            ALL_PROCESS_TYPE.name
                        )
                    }),
                    expect.objectContaining({
                        label: 'Autolaunched Flow',
                        name: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                        iconName: PROCESS_TYPES_ICONS.FEATURED.get(
                            FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                        )
                    }),
                    expect.objectContaining({
                        label: 'Screen Flow',
                        name: FLOW_PROCESS_TYPE.FLOW,
                        iconName: PROCESS_TYPES_ICONS.FEATURED.get(
                            FLOW_PROCESS_TYPE.FLOW
                        )
                    })
                ])
            );
        });
    });
});
