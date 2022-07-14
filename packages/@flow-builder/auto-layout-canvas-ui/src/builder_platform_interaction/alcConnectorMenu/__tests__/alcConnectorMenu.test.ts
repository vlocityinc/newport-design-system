// @ts-nocheck
import { setup } from '@sa11y/jest';
import {
    CloseMenuEvent,
    DeleteGoToConnectionEvent,
    GoToPathEvent,
    PasteOnCanvasEvent
} from 'builder_platform_interaction/alcEvents';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { removeDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { commands } from 'builder_platform_interaction/sharedUtils';
import {
    configureMenu,
    GOTO_ACTION,
    GOTO_DELETE_ACTION,
    GOTO_REROUTE_ACTION,
    PASTE_ACTION
} from '../alcConnectorMenuConfig';

const { EnterCommand, SpaceCommand, ArrowDown, ArrowUp, EscapeCommand } = commands;

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
                                guid: 2,
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
                                guid: 3,
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
                        guid: 4,
                        heading: 'Logic',
                        items: [
                            {
                                description: 'Create Decision',
                                elementType: 'Decision',
                                guid: 5,
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
                                guid: 6,
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
    listboxItemDiv: 'div[role="menuitem"]',
    decisionIconSpan: '.rotate-icon-container.slds-icon-standard-decision',
    decisionIcon: '.rotate-icon-svg',
    endIcon: '.background-red.end-element-svg'
};

const changeSearchInput = (cmp, inputChange) => {
    const lightningInput = cmp.shadowRoot.querySelector('lightning-input');
    lightningInput.dispatchEvent(
        new CustomEvent('change', {
            detail: {
                value: inputChange
            }
        })
    );
};

const getAlcMenuTemplate = (cmp) => cmp.shadowRoot.querySelector('builder_platform_interaction-alc-menu-template');

const defaultOptions = {
    source: {},
    metadata: {
        elementTypes: new Set(),
        isLoading: true,
        menuItems: []
    }
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-alc-connector-menu', defaultOptions, overrideOptions);
};

describe('Alc Connector Menu', () => {
    beforeAll(() => {
        setup();
    });

    afterEach(() => {
        removeDocumentBodyChildren();
    });

    it('should render the component', async () => {
        const menu = await createComponentUnderTest();
        expect(menu).toBeDefined();
    });

    it('should be accessible', async () => {
        const cmp = await createComponentUnderTest();
        await expect(cmp).toBeAccessible();
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

    it('should dispatch add element with actionType, actionName and properties ', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);
        listItems[1].setAttribute('tabindex', 0);
        listItems[1].focus();
        const callback = jest.fn();
        cmp.addEventListener(AddElementEvent.EVENT_NAME, callback);
        cmp.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.actionType).toBe('TestActionType');
        expect(callback.mock.calls[0][0].detail.actionName).toBe('TestActionName');
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
        listItems[1].setAttribute('tabindex', '0');
        listItems[1].focus();
        const callback = jest.fn();
        listItems[0].addEventListener('focus', callback);
        cmp.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('Focus should move correctly to the first row on arrow down on the last row', async () => {
        const cmp = await createComponentUnderTest();
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItemDiv);

        listItems[listItems.length - 1].setAttribute('tabindex', '0');
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

    it('should show a spinner when the dataLoading is not complete and there is search input', async () => {
        const cmp = await createComponentUnderTest({
            metadata: {
                elementTypes: new Set(),
                isLoading: true,
                isSearchEnabled: true,
                menuItems: []
            }
        });
        const noInputSpinnerValue = getAlcMenuTemplate(cmp).showSpinner;
        // No input yet so spinner should not show
        expect(noInputSpinnerValue).toBeFalsy();
        changeSearchInput(cmp, 'some input');
        await ticks(3);
        // After putting input spinner should start showing
        const withInputSpinnerValue = getAlcMenuTemplate(cmp).showSpinner;
        expect(withInputSpinnerValue).toBeTruthy();
    });

    it('should not show a spinner when the dataLoading is complete', async () => {
        const cmp = await createComponentUnderTest({
            metadata: {
                elementTypes: new Set(),
                isLoading: false,
                isSearchEnabled: true,
                menuItems: []
            }
        });
        changeSearchInput(cmp, 'some input');
        await ticks(2);
        const spinnerValue = getAlcMenuTemplate(cmp).showSpinner;
        expect(spinnerValue).toBeFalsy();
    });
});
