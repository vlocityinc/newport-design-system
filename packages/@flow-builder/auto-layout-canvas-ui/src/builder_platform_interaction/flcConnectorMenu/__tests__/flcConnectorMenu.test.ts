// @ts-nocheck
import { createElement } from 'lwc';
import FlcConnectorMenu from 'builder_platform_interaction/flcConnectorMenu';
import { ticks } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { CloseMenuEvent } from 'builder_platform_interaction/flcEvents';
import { configureMenu, PASTE_ACTION, MERGE_PATH_ACTION } from '../flcConnectorMenuConfig';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { commands } from 'builder_platform_interaction/sharedUtils';

const { EnterCommand, SpaceCommand, ArrowDown, ArrowUp, EscapeCommand } = commands;

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    const sharedcommands = require('builder_platform_interaction/sharedUtils/commands');
    return Object.assign({}, sharedUtils, { commands: sharedcommands });
});

const metaData = [
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:screen',
        label: 'Screen',
        value: 'Screen',
        elementType: 'Screen',
        description: 'Collect information from'
    },
    {
        section: 'Logic',
        type: 'branch',
        icon: 'standard:decision',
        iconShape: ICON_SHAPE.DIAMOND,
        label: 'Decision',
        value: 'Decision',
        elementType: 'Decision',
        description: 'Create Decision'
    },
    {
        section: 'Logic',
        type: 'end',
        icon: 'utility:stop',
        iconBackgroundColor: 'background-red',
        iconShape: ICON_SHAPE.CIRCLE,
        label: 'End',
        value: 'End',
        elementType: 'End',
        description: 'Create End'
    }
];

jest.mock('../flcConnectorMenuConfig', () => {
    return {
        configureMenu: jest.fn(() => {
            return {
                sections: [
                    {
                        guid: 1,
                        heading: 'Interaction',
                        items: [
                            {
                                description: 'Collect information from',
                                elementType: 'Screen',
                                guid: 1,
                                icon: 'standard:screen',
                                iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
                                iconClass: '',
                                iconSize: 'small',
                                iconVariant: '',
                                label: 'Screen',
                                rowClass: 'slds-listbox__item'
                            }
                        ],
                        label: 'Interaction'
                    },
                    {
                        guid: 2,
                        heading: 'Logic',
                        items: [
                            {
                                description: 'Create Decision',
                                elementType: 'Decision',
                                guid: 1,
                                icon: 'standard:decision',
                                iconContainerClass:
                                    'slds-media__figure slds-listbox__option-icon rotate-icon-container slds-icon-standard-decision',
                                iconClass: ' rotate-icon-svg',
                                iconSize: 'small',
                                iconVariant: '',
                                label: 'Decision',
                                rowClass: 'slds-listbox__item'
                            },
                            {
                                description: 'Create End',
                                elementType: 'End',
                                guid: 2,
                                icon: 'utility:stop',
                                iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
                                iconClass: 'background-red end-element-svg',
                                iconSize: 'xx-small',
                                iconVariant: 'inverse',
                                label: 'End',
                                rowClass: 'slds-listbox__item'
                            }
                        ],
                        label: 'Logic'
                    }
                ]
            };
        }),
        PASTE_ACTION: 'Paste',
        MERGE_PATH_ACTION: 'mergePath'
    };
});

const selectors = {
    listboxItem: '.slds-listbox__item',
    listboxItemDiv: 'div[role="option"]',
    decisionIconSpan: '.rotate-icon-container.slds-icon-standard-decision',
    decisionIcon: '.rotate-icon-svg',
    endIcon: '.background-red.end-element-svg'
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-flc-connector-menu', {
        is: FlcConnectorMenu
    });
    el.elementsMetadata = metaData;
    document.body.appendChild(el);
    return el;
};

describe('connector menu', () => {
    it('should render the component', () => {
        const menu = createComponentUnderTest();
        expect(menu).toBeDefined();
    });

    it('should dispatch close menu event on selecting a menu item ', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const callback = jest.fn();
        cmp.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch add element when paste is not specified ', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch add element when paste is not specified using enter command ', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const listItems = Array.from(cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv)) as any;
        listItems[0].focus();
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch add element when paste is not specified using space command ', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const listItems = Array.from(cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv)) as any;
        listItems[0].focus();
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch paste event when paste is specified ', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:paste',
                            label: 'Paste copied element(s)',
                            elementType: PASTE_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = createComponentUnderTest();
        await ticks(1);
        const callback = jest.fn();
        cmp.addEventListener('paste', callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch merge path event when merge path is specified ', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:merge',
                            label: 'Merge with existing path',
                            elementType: MERGE_PATH_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = createComponentUnderTest();
        await ticks(1);
        const callback = jest.fn();
        cmp.addEventListener('mergewithexistingpath', callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('Decision element row span should be present', () => {
        const cmp = createComponentUnderTest();
        const decisionElementSpan = cmp.shadowRoot.querySelector(selectors.decisionIconSpan);
        expect(decisionElementSpan).not.toBeNull();
    });

    it('Decision element icon should be present', () => {
        const cmp = createComponentUnderTest();
        const decisionElementIcon = cmp.shadowRoot.querySelector(selectors.decisionIcon);
        expect(decisionElementIcon).not.toBeNull();
    });

    it('End element icon should be present', () => {
        const cmp = createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon).not.toBeNull();
    });

    it('End element icon should have the right size', () => {
        const cmp = createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon.size).toBe('xx-small');
    });

    it('End element icon should have the right variant', () => {
        const cmp = createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon.variant).toBe('inverse');
    });

    it('Focus should move correctly to the next row on arrow down', () => {
        const cmp = createComponentUnderTest();
        const listItems = Array.from(cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv)) as any;
        listItems[0].focus();
        const callback = jest.fn();
        listItems[1].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Focus should move correctly to the previous row on arrow up', () => {
        const cmp = createComponentUnderTest();
        const listItems = Array.from(cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv)) as any;
        listItems[1].focus();
        const callback = jest.fn();
        listItems[0].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Focus should move correctly to the first row on arrow down on the last row', () => {
        const cmp = createComponentUnderTest();
        const listItems = Array.from(cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv)) as any;
        listItems[listItems.length - 1].focus();
        const callback = jest.fn();
        listItems[0].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Focus should move correctly to the last row on arrow up on the first row', () => {
        const cmp = createComponentUnderTest();
        const listItems = Array.from(cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv)) as any;
        listItems[0].focus();
        const callback = jest.fn();
        listItems[listItems.length - 1].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing escape while focus is on a row item should fire the CloseMenuEvent', () => {
        const cmp = createComponentUnderTest();
        const listItems = Array.from(cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv)) as any;
        const callback = jest.fn();
        cmp.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
        listItems[0].focus();
        cmp.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });
});
