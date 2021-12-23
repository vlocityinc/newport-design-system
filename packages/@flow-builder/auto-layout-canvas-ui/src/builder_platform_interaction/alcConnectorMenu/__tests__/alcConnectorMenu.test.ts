// @ts-nocheck
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { AddElementEvent } from 'builder_platform_interaction/events';
import {
    CloseMenuEvent,
    MoveFocusToConnectorEvent,
    GoToPathEvent,
    PasteOnCanvasEvent,
    DeleteGoToConnectionEvent
} from 'builder_platform_interaction/alcEvents';
import {
    configureMenu,
    PASTE_ACTION,
    GOTO_ACTION,
    GOTO_DELETE_ACTION,
    GOTO_REROUTE_ACTION
} from '../alcConnectorMenuConfig';

import { commands } from 'builder_platform_interaction/sharedUtils';
import { removeDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

const { EnterCommand, SpaceCommand, ArrowDown, ArrowUp, EscapeCommand, TabCommand } = commands;

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

jest.mock('../alcConnectorMenuConfig', () => {
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
                            },
                            {
                                description: 'Palette promoted action',
                                elementType: 'Action',
                                actionType: 'TestActionType',
                                actionName: 'TestActionName',
                                actionIsStandard: true,
                                guid: 2,
                                icon: 'standard:action',
                                iconContainerClass: 'slds-media__figure slds-listbox__option-icon',
                                iconClass: '',
                                iconSize: 'small',
                                iconVariant: '',
                                label: 'Action',
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
        MERGE_PATH_ACTION: 'mergePath',
        GOTO_ACTION: 'goTo',
        GOTO_DELETE_ACTION: 'goToDelete',
        GOTO_REROUTE_ACTION: 'goToReroute'
    };
});

const selectors = {
    listboxItem: '.slds-listbox__item',
    listboxItemDiv: 'div[role="option"]',
    decisionIconSpan: '.rotate-icon-container.slds-icon-standard-decision',
    decisionIcon: '.rotate-icon-svg',
    endIcon: '.background-red.end-element-svg'
};

const defaultOptions = {
    source: {}
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-alc-connector-menu', defaultOptions, overrideOptions);
};

describe('connector menu', () => {
    afterEach(() => {
        removeDocumentBodyChildren();
    });
    it('should render the component', async () => {
        const menu = await createComponentUnderTest();
        expect(menu).toBeDefined();
    });

    it('should dispatch close menu event on selecting a menu item ', async () => {
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch add element when paste is not specified ', async () => {
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.designateFocus).toBe(true);
    });

    it('should dispatch add element when paste is not specified using enter command ', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        listItems[0].focus();
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.designateFocus).toBe(true);
    });

    it('should dispatch add element when paste is not specified using space command ', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        listItems[0].focus();
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.designateFocus).toBe(true);
    });

    it('should dispatch add element with actionType, actionName and actionIsStandard properties ', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        listItems[1].focus();
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.actionType).toBe('TestActionType');
        expect(callback.mock.calls[0][0].detail.actionName).toBe('TestActionName');
        expect(callback.mock.calls[0][0].detail.actionIsStandard).toBe(true);
    });

    it('should dispatch PasteOnCanvasEvent event when paste is specified ', async () => {
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
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(PasteOnCanvasEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing enter while focus is on paste should fire the MoveFocusToConnectorEvent', async () => {
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
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        const callback = jest.fn();
        cmp.addEventListener(MoveFocusToConnectorEvent.EVENT_NAME, callback);
        listItems[0].focus();
        cmp.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing enter while focus is on goTo should fire the GoToPathEvent', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:level_down',
                            label: 'Goto another element',
                            elementType: GOTO_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        const callback = jest.fn();
        cmp.addEventListener(GoToPathEvent.EVENT_NAME, callback);
        listItems[0].focus();
        cmp.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing space while focus is on goTo should fire the GoToPathEvent', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:level_down',
                            label: 'Goto another element',
                            elementType: GOTO_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        const callback = jest.fn();
        cmp.addEventListener(GoToPathEvent.EVENT_NAME, callback);
        listItems[0].focus();
        cmp.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing space while focus is on paste should fire the MoveFocusToConnectorEvent', async () => {
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
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        const callback = jest.fn();
        cmp.addEventListener(MoveFocusToConnectorEvent.EVENT_NAME, callback);
        listItems[0].focus();
        cmp.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing tab while focus is on goTo should fire the MoveFocusToConnectorEvent', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:level_down',
                            label: 'Goto another element',
                            elementType: GOTO_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(MoveFocusToConnectorEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(TabCommand.COMMAND_NAME);
        cmp.keyboardInteractions.execute(TabCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing shift + tab while focus is on goTo should fire the MoveFocusToConnectorEvent', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:level_down',
                            label: 'Goto another element',
                            elementType: GOTO_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(MoveFocusToConnectorEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(TabCommand.COMMAND_NAME);
        cmp.keyboardInteractions.execute('shifttabcommand');
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing tab while focus is on paste should fire the MoveFocusToConnectorEvent', async () => {
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
                },
                {
                    guid: 2,
                    heading: '',
                    items: [
                        {
                            guid: 2,
                            icon: 'utility:level_down',
                            label: 'Goto another element',
                            elementType: GOTO_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(MoveFocusToConnectorEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(TabCommand.COMMAND_NAME);
        cmp.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
        cmp.keyboardInteractions.execute(TabCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing shift + tab while focus is on paste should fire the MoveFocusToConnectorEvent', async () => {
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
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.keyboardInteractions.execute(TabCommand.COMMAND_NAME);
        cmp.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
        cmp.addEventListener(MoveFocusToConnectorEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute('shifttabcommand');
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch gotopath event when goto path is specified ', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:level_down',
                            label: 'Goto another element',
                            elementType: GOTO_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(GoToPathEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch DeleteGoToConnectionEvent when goto is deleted', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:delete',
                            label: 'Delete Goto another element',
                            elementType: GOTO_DELETE_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(DeleteGoToConnectionEvent.EVENT_NAME, callback);

        cmp.shadowRoot.querySelector(selectors.listboxItem).click();
        expect(callback).toHaveBeenCalled();
    });

    it('should dispatch gotopath event when reroute goto is clicked', async () => {
        configureMenu.mockReturnValueOnce({
            sections: [
                {
                    guid: 1,
                    heading: '',
                    items: [
                        {
                            guid: 1,
                            icon: 'utility:level_down',
                            label: 'Reroute Goto to another element',
                            elementType: GOTO_REROUTE_ACTION,
                            rowClass: 'slds-listbox__item action-row-line-height'
                        }
                    ],
                    label: 'Action Section'
                }
            ]
        });
        const cmp = await createComponentUnderTest();
        const callback = jest.fn();
        cmp.addEventListener(GoToPathEvent.EVENT_NAME, callback);
        cmp.shadowRoot.querySelector(selectors.listboxItem).click();

        expect(callback.mock.calls[0][0].detail).toEqual({
            source: {},
            isReroute: true
        });
    });

    it('Decision element row span should be present', async () => {
        const cmp = await createComponentUnderTest();
        const decisionElementSpan = cmp.shadowRoot.querySelector(selectors.decisionIconSpan);
        expect(decisionElementSpan).not.toBeNull();
    });

    it('Decision element icon should be present', async () => {
        const cmp = await createComponentUnderTest();
        const decisionElementIcon = cmp.shadowRoot.querySelector(selectors.decisionIcon);
        expect(decisionElementIcon).not.toBeNull();
    });

    it('End element icon should be present', async () => {
        const cmp = await createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon).not.toBeNull();
    });

    it('End element icon should have the right size', async () => {
        const cmp = await createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon.size).toBe('xx-small');
    });

    it('End element icon should have the right variant', async () => {
        const cmp = await createComponentUnderTest();
        const endElementIcon = cmp.shadowRoot.querySelector(selectors.endIcon);
        expect(endElementIcon.variant).toBe('inverse');
    });

    it('Focus should move correctly to the next row on arrow down', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        listItems[0].focus();
        const callback = jest.fn();
        listItems[1].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Focus should move correctly to the previous row on arrow up', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        listItems[1].focus();
        const callback = jest.fn();
        listItems[0].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Focus should move correctly to the first row on arrow down on the last row', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        listItems[listItems.length - 1].focus();
        const callback = jest.fn();
        listItems[0].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Focus should move correctly to the last row on arrow up on the first row', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        listItems[0].focus();
        const callback = jest.fn();
        listItems[listItems.length - 1].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing escape while focus is on a row item should fire the CloseMenuEvent', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        const callback = jest.fn();
        cmp.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
        listItems[0].focus();
        cmp.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing escape while focus is on a row item should fire the MoveFocusToConnectorEvent', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        const callback = jest.fn();
        cmp.addEventListener(MoveFocusToConnectorEvent.EVENT_NAME, callback);
        listItems[0].focus();
        cmp.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });
});
