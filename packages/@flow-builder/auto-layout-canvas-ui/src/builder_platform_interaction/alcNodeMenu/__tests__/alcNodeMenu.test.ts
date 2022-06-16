// @ts-nocheck
import cutAllPathsComboboxLabel from '@salesforce/label/AlcNodeContextualMenu.cutAllPathsComboboxLabel';
import deleteAllPathsComboboxLabel from '@salesforce/label/AlcNodeContextualMenu.deleteAllPathsComboboxLabel';
import {
    ClearHighlightedPathEvent,
    CloseMenuEvent,
    DeleteBranchElementEvent,
    HighlightPathsToDeleteOrCutEvent
} from 'builder_platform_interaction/alcEvents';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import {
    createComponent,
    getDetailPassedToEvent,
    keydownEvent,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import {
    CopySingleElementEvent,
    CutElementsEvent,
    DeleteElementEvent,
    EditElementEvent,
    OpenSubflowEvent
} from 'builder_platform_interaction/events';
import { commands, Keys } from 'builder_platform_interaction/sharedUtils';
import type { LightningElement } from 'lwc';
import { ELEMENT_ACTION_CONFIG } from '../alcNodeMenuConfig';
import { LABELS } from '../alcNodeMenuLabels';

const { ArrowDown, ArrowUp, EscapeCommand, SpaceCommand, EnterCommand } = commands;

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const dummySimpleElement = {
    guid: 'simpleElementGuid',
    section: 'Dummy_Section',
    icon: 'standard:lightning_component',
    description: 'Dummy Description',
    label: 'Dummy_Label',
    value: 'Dummy_Value',
    elementType: 'Dummy_ElementType',
    type: NodeType.DEFAULT
};
const dummyLoopElement = {
    guid: 'loopElementGuid',
    section: 'Dummy_Section',
    icon: 'standard:lightning_component',
    description: 'Dummy Description',
    label: 'Dummy_Label',
    value: 'Dummy_Value',
    elementType: 'Dummy_ElementType',
    type: NodeType.LOOP
};
const dummyBranchElement = {
    guid: 'branchElementGuid',
    section: 'Dummy_Section',
    icon: 'standard:lightning_component',
    description: 'Dummy Description',
    label: 'outcome1',
    value: 'Dummy_Value',
    elementType: 'Decision',
    type: NodeType.BRANCH,
    defaultConnectorLabel: 'Default Outcome',
    childReferences: [
        {
            childReference: 'branchElementGuid'
        }
    ]
};

const conditionOptionsForDelete = [
    {
        label: deleteAllPathsComboboxLabel,
        value: 'NO_PATH'
    },
    {
        label: 'outcome1',
        value: 'branchElementGuid'
    },
    {
        label: 'Default Outcome',
        value: 'DEFAULT_PATH'
    }
];

const conditionOptionsForCut = [
    {
        label: cutAllPathsComboboxLabel,
        value: 'NO_PATH'
    },
    {
        label: 'outcome1',
        value: 'branchElementGuid'
    },
    {
        label: 'Default Outcome',
        value: 'DEFAULT_PATH'
    }
];

const dummySubflowElement = {
    guid: 'subflowElementGuid',
    section: 'Dummy_Section',
    icon: 'standard:lightning_component',
    description: 'Dummy Description',
    label: 'Dummy_Label',
    value: 'Dummy_Value',
    elementType: 'Subflow',
    type: NodeType.DEFAULT
};

const selectors = {
    header: '[slot="header"]',
    headerLabel: '.test-header-label',
    headerDescription: '.test-header-description',
    menuActionList: '.slds-dropdown__divst',
    menuActionRow: '.slds-dropdown__item',
    menuActionRowMenuItem: 'a[role="menuitem"]',
    menuActionRowIcon: 'lightning-icon',
    menuActionRowLabel: '.slds-media__body',
    backButton: '.back-button',
    footer: '[slot="footer"]'
};

const createComponentUnderTest = async (
    elementMetadata: {
        guid: UI.Guid;
        section?: string;
        icon?: string;
        description?: string;
        label?: string;
        value?: string;
        elementType?: string;
        type?: NodeType;
    },
    conditionOptions?: { label: string; value: string }[]
) =>
    createComponent('builder_platform_interaction-alc-node-menu', {
        flowModel: { [elementMetadata.guid]: elementMetadata },
        conditionOptions,
        elementMetadata,
        guid: elementMetadata.guid
    });

const getBackButton = (menu: LightningElement) => menu.shadowRoot.querySelector(selectors.backButton);
const getConditionPickerCombobox = (menu: LightningElement) =>
    menu.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX);
const getMenuActionRowMenuItems = (menu: LightningElement) =>
    menu.shadowRoot.querySelectorAll(selectors.menuActionRowMenuItem);
const getHeader = (menu: LightningElement) => menu.shadowRoot.querySelector(selectors.header);
const getFooter = (menu: LightningElement) => menu.shadowRoot.querySelector(selectors.footer);
const getFooterButton = (footer: LightningElement) =>
    footer.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON);
const getMenuActionRows = (menu: LightningElement) => menu.shadowRoot.querySelectorAll(selectors.menuActionRow);

const assertFocusIsMovedOnArrowDown = (cmp: LightningElement, fromIndex: number) => {
    const listItems = getMenuActionRowMenuItems(cmp);
    cmp.getListKeyboardInteraction().setActiveElement(listItems[fromIndex]);

    listItems[(fromIndex + 1) % listItems.length].addEventListener('focus', callback);

    cmp.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
    expect(callback).toHaveBeenCalled();
};

const assertFocusIsMovedOnArrowUp = (cmp: LightningElement, fromIndex: number) => {
    const listItems = getMenuActionRowMenuItems(cmp);
    cmp.getListKeyboardInteraction().setActiveElement(listItems[fromIndex]);

    const nextIndex = fromIndex === 0 ? listItems.length - 1 : fromIndex - 1;
    listItems[nextIndex].addEventListener('focus', callback);

    cmp.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
    expect(callback).toHaveBeenCalled();
};

const callback = jest.fn();

describe('Node Menu', () => {
    let menu: LightningElement;
    describe('Base Node Menu', () => {
        beforeEach(async () => {
            menu = await createComponentUnderTest(dummySimpleElement);
        });

        it('renders the element action contextual menu', () => {
            expect(menu).toBeDefined();
        });

        it('Should have the correct label in the header', () => {
            const headerLabel = getHeader(menu).querySelector(selectors.headerLabel);
            expect(headerLabel.textContent).toEqual(dummySimpleElement.label);
        });

        it('Should have the correct description in the header', () => {
            const headerDescription = getHeader(menu).querySelector(selectors.headerDescription);
            expect(headerDescription.textContent).toEqual(dummySimpleElement.description);
        });

        test('Focus should move correctly to the next row on arrow down', () => {
            assertFocusIsMovedOnArrowDown(menu, 0);
        });

        test('Focus should move correctly to the previous row on arrow up', () => {
            assertFocusIsMovedOnArrowUp(menu, 1);
        });

        test('Focus should move correctly to the first row on arrow down on the last row', () => {
            const listItems = getMenuActionRowMenuItems(menu);
            assertFocusIsMovedOnArrowDown(menu, listItems.length - 1);
        });

        test('Focus should move correctly to the last row on arrow up on the first row', () => {
            assertFocusIsMovedOnArrowUp(menu, 0);
        });

        test('Pressing escape while focus is on menu item fires the CloseMenuEvent with proper arguments', () => {
            const listItems = getMenuActionRowMenuItems(menu);
            listItems[0].focus();
            menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
            menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
            expect(getDetailPassedToEvent(callback)).toEqual({ restoreFocus: true });
        });
    });

    describe('Element Action Node Menu for a Simple Element', () => {
        beforeEach(async () => {
            menu = await createComponentUnderTest(dummySimpleElement);
        });

        describe('Copy Row', () => {
            let copyRow: LightningElement;
            beforeEach(() => {
                copyRow = getMenuActionRows(menu)[0];
            });
            describe('Clicking', () => {
                test('Clicking on the Copy Action dispatches the CopySingleElementEvent with proper arguments', () => {
                    menu.addEventListener(CopySingleElementEvent.EVENT_NAME, callback);
                    copyRow.click();
                    expect(getDetailPassedToEvent(callback)).toEqual({ elementGuid: 'simpleElementGuid' });
                });

                test('Clicking on the Copy Action dispatches the close menu event with proper arguments', () => {
                    menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                    copyRow.click();
                    expect(getDetailPassedToEvent(callback)).toEqual({ restoreFocus: true });
                });

                test('The copy row icon should have the right icon-name', () => {
                    const copyIcon = copyRow.querySelector(selectors.menuActionRowIcon);
                    expect(copyIcon.iconName).toBe(ELEMENT_ACTION_CONFIG.COPY_ACTION.icon);
                });

                test('The copy row should have the right label', () => {
                    const copyRowLabel = copyRow.querySelector(selectors.menuActionRowLabel);
                    expect(copyRowLabel.textContent).toBe(ELEMENT_ACTION_CONFIG.COPY_ACTION.label);
                });
            });

            describe('Keyboard commands', () => {
                beforeEach(() => {
                    const listItems: LightningElement[] = getMenuActionRowMenuItems(menu);
                    listItems[0].focus();
                });

                test('Pressing enter on the Copy Action dispatches the CopySingleElementEvent with proper arguments', () => {
                    menu.addEventListener(CopySingleElementEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        elementGuid: 'simpleElementGuid'
                    });
                });

                test('Pressing enter on the Copy Action dispatches the close menu event with proper arguments', () => {
                    menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        restoreFocus: true
                    });
                });

                test('Pressing space on the Copy Action dispatches the CopySingleElementEvent with proper arguments', () => {
                    menu.addEventListener(CopySingleElementEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        elementGuid: 'simpleElementGuid'
                    });
                });

                test('Pressing space on the Copy Action dispatches the close menu event with proper arguments', () => {
                    menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        restoreFocus: true
                    });
                });
            });
        });

        describe('Delete Row', () => {
            let deleteRow: LightningElement;
            beforeEach(() => {
                deleteRow = getMenuActionRows(menu)[2];
            });

            describe('Clicking', () => {
                test('Clicking on the Delete Action dispatches the DeleteElementEvent', () => {
                    menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
                    deleteRow.click();
                    expect(callback).toHaveBeenCalled();
                });

                test('Clicking the Delete Action should dispatch DeleteElementEvent with right details', () => {
                    menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
                    deleteRow.click();
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        selectedElementGUID: [dummySimpleElement.guid],
                        selectedElementType: dummySimpleElement.elementType
                    });
                });

                test('Clicking the Delete Action for Loop should dispatch DeleteElementEvent with right details', async () => {
                    menu = await createComponentUnderTest(dummyLoopElement);
                    menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
                    deleteRow = getMenuActionRows(menu)[2];
                    deleteRow.click();
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        selectedElementGUID: [dummyLoopElement.guid],
                        selectedElementType: dummyLoopElement.elementType,
                        childIndexToKeep: 0
                    });
                });

                test('Clicking on the Delete Action dispatches the close menu event with proper arguments', () => {
                    menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                    deleteRow.click();
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        restoreFocus: false
                    });
                });

                test('The delete row icon should have the right icon-name and variant', () => {
                    const deleteIcon = deleteRow.querySelector(selectors.menuActionRowIcon);
                    expect(deleteIcon).toMatchObject({
                        iconName: ELEMENT_ACTION_CONFIG.DELETE_ACTION.icon,
                        variant: ELEMENT_ACTION_CONFIG.DELETE_ACTION.iconVariant
                    });
                });

                test('The delete row should have the right label', () => {
                    const deleteRowLabel = deleteRow.querySelector(selectors.menuActionRowLabel);
                    expect(deleteRowLabel.textContent).toBe(ELEMENT_ACTION_CONFIG.DELETE_ACTION.label);
                });
            });

            describe('Keyboard Commands', () => {
                beforeEach(() => {
                    const listItems = getMenuActionRowMenuItems(menu);
                    listItems[2].focus();
                });
                test('Pressing enter on the Delete Action dispatches the DeleteElementEvent', () => {
                    menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
                    expect(callback).toHaveBeenCalled();
                });

                test('Pressing enter on the Delete Action should dispatch DeleteElementEvent with right details', () => {
                    menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        selectedElementGUID: [dummySimpleElement.guid],
                        selectedElementType: dummySimpleElement.elementType
                    });
                });

                test('Pressing enter on the Delete Action dispatches the close menu event', () => {
                    menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
                    expect(callback).toHaveBeenCalled();
                });

                test('Pressing space on the Delete Action dispatches the DeleteElementEvent with proper arguments', () => {
                    menu.addEventListener(DeleteElementEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        selectedElementGUID: [dummySimpleElement.guid],
                        selectedElementType: dummySimpleElement.elementType
                    });
                });

                test('Pressing space on the Delete Action dispatches the close menu event with proper arguments', () => {
                    menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        restoreFocus: false
                    });
                });
            });
        });

        describe('Cut Row', () => {
            let cutRow: LightningElement;

            beforeEach(() => {
                cutRow = getMenuActionRows(menu)[1];
            });

            describe('Clicking', () => {
                test('Clicking on the Cut Action dispatches the CutElementsEvent', () => {
                    menu.addEventListener(CutElementsEvent.EVENT_NAME, callback);
                    cutRow.click();
                    expect(callback).toHaveBeenCalled();
                });

                test('Clicking the Cut Action should dispatch CutElementsEvent with right details', () => {
                    menu.addEventListener(CutElementsEvent.EVENT_NAME, callback);
                    cutRow.click();
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        guids: [dummySimpleElement.guid]
                    });
                });

                test('The cut row icon should have the right icon-name and variant', () => {
                    const cutIcon = cutRow.querySelector(selectors.menuActionRowIcon);
                    expect(cutIcon).toMatchObject({
                        iconName: ELEMENT_ACTION_CONFIG.CUT_ACTION.icon,
                        variant: ELEMENT_ACTION_CONFIG.CUT_ACTION.iconVariant
                    });
                });

                test('The cut row should have the right label', () => {
                    const cutRowLabel = cutRow.querySelector(selectors.menuActionRowLabel);
                    expect(cutRowLabel.textContent).toBe(ELEMENT_ACTION_CONFIG.CUT_ACTION.label);
                });
            });

            describe('Keyboard Commands', () => {
                beforeEach(() => {
                    const listItems = getMenuActionRowMenuItems(menu);
                    listItems[1].focus();
                });
                test('Pressing enter on the Cut Action dispatches the CutElementsEvent', () => {
                    menu.addEventListener(CutElementsEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
                    expect(callback).toHaveBeenCalled();
                });

                test('Pressing enter on the Cut Action should dispatch CutElementsEvent with right details', () => {
                    menu.addEventListener(CutElementsEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        guids: [dummySimpleElement.guid]
                    });
                });

                test('Pressing space on the Cut Action dispatches the CutElementsEvent with proper arguments', () => {
                    menu.addEventListener(CutElementsEvent.EVENT_NAME, callback);
                    menu.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
                    expect(getDetailPassedToEvent(callback)).toEqual({
                        guids: [dummySimpleElement.guid]
                    });
                });
            });
        });

        describe('Footer area for Simple Element', () => {
            let footer: LightningElement;
            let editButton: LightningElement;

            beforeEach(() => {
                footer = getFooter(menu);
                editButton = getFooterButton(footer);
            });

            it('Should have a footer area', () => {
                expect(footer).not.toBeNull();
            });

            it('Should have edit button in the Footer', () => {
                expect(editButton).not.toBeNull();
            });

            test.each`
                elementAttributeName | configPropertyKey
                ${'label'}           | ${'buttonTextLabel'}
                ${'title'}           | ${'buttonTextTitle'}
                ${'variant'}         | ${'buttonVariant'}
            `(
                'Edit button "$elementAttributeName" should be as set in the config',
                ({ elementAttributeName, configPropertyKey }) => {
                    expect(editButton[elementAttributeName]).toBe(
                        ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION[configPropertyKey]
                    );
                }
            );

            test('Clicking the Edit Button should dispatch EditElementEvent with proper arguments', () => {
                menu.addEventListener(EditElementEvent.EVENT_NAME, callback);
                editButton.click();
                expect(getDetailPassedToEvent(callback)).toEqual({
                    canvasElementGUID: dummySimpleElement.guid,
                    mode: EditElementEvent.EVENT_NAME,
                    designateFocus: true
                });
            });

            test('Clicking the Edit Button should dispatch CloseMenuEvent with proper arguments', () => {
                menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                editButton.click();
                expect(getDetailPassedToEvent(callback)).toEqual({
                    restoreFocus: true
                });
            });

            test('Pressing escape while focus is on the edit button fires the CloseMenuEvent with proper arguments', () => {
                menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                editButton.focus();
                menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
                expect(getDetailPassedToEvent(callback)).toEqual({
                    restoreFocus: true
                });
            });

            test('Pressing escape while focus is on the edit button should not fire the EditElementEvent', () => {
                menu.addEventListener(EditElementEvent.EVENT_NAME, callback);
                editButton.focus();
                menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
                expect(callback).not.toHaveBeenCalled();
            });

            test('once focus is set to the edit footer button, enter key down should dispatch "EditElementEvent" with proper arguments', () => {
                menu.addEventListener(EditElementEvent.EVENT_NAME, callback);
                menu.getListKeyboardInteraction().setActiveElement(editButton);
                editButton.dispatchEvent(keydownEvent(Keys.Enter));
                expect(getDetailPassedToEvent(callback)).toEqual({
                    canvasElementGUID: dummySimpleElement.guid,
                    mode: EditElementEvent.EVENT_NAME,
                    designateFocus: true
                });
            });
        });
    });

    describe('Element Action Node Menu for a Branch Element for delete menu mode', () => {
        const highlightPathCallback = jest.fn();
        const closeMenuCallback = jest.fn();

        beforeEach(async () => {
            menu = await createComponentUnderTest(dummyBranchElement, conditionOptionsForDelete);
            menu.addEventListener(HighlightPathsToDeleteOrCutEvent.EVENT_NAME, highlightPathCallback);
            menu.addEventListener(CloseMenuEvent.EVENT_NAME, closeMenuCallback);

            const thirdMenuItem = getMenuActionRowMenuItems(menu)[2];
            menu.getListKeyboardInteraction().setActiveElement(thirdMenuItem);
            thirdMenuItem.click();
        });

        test('Clicking the Delete Action should dispatch HighlightPathsToDeleteOrCutEvent', () => {
            expect(highlightPathCallback).toHaveBeenCalled();
        });

        test('HighlightPathsToDeleteOrCutEvent should be dispatched with the right details', () => {
            expect(getDetailPassedToEvent(highlightPathCallback)).toEqual({
                childIndexToKeep: undefined,
                elementGuid: dummyBranchElement.guid,
                operationType: 'delete'
            });
        });

        test('Clicking the Delete Action should not dispatch CloseMenuEvent', () => {
            expect(closeMenuCallback).not.toHaveBeenCalled();
        });

        test('Clicking on the Delete Action should reveal the back button', () => {
            const backButton = getBackButton(menu);
            expect(backButton).not.toBeNull();
        });

        test('Back button should have the right alternativeText, icon name, title, variant', () => {
            const backButton = getBackButton(menu);
            expect(backButton).toMatchObject({
                alternativeText: LABELS.backButtonAlternativeText,
                iconName: 'utility:back',
                title: LABELS.backButtonTitle,
                variant: 'bare'
            });
        });

        test('Clicking on the Back Button should dispatch ClearHighlightedPathEvent with proper arguments', () => {
            const backButton = getBackButton(menu);
            const clearHighlightedPathCallback = jest.fn();
            menu.addEventListener(ClearHighlightedPathEvent.EVENT_NAME, clearHighlightedPathCallback);
            backButton.click();
            expect(clearHighlightedPathCallback).toHaveBeenCalled();
        });

        test('Clicking on the Back Button should go back to base menu and reveal the list of action rows', async () => {
            const backButton = getBackButton(menu);
            await backButton.click();
            const actionList = menu.shadowRoot.querySelector(selectors.menuActionList);
            expect(actionList).not.toBeNull();
        });

        test('Clicking on the Back Button should go back to base footer', async () => {
            const backButton = getBackButton(menu);
            await backButton.click();
            const editButton = getFooterButton(getFooter(menu));
            expect(editButton.label).toBe(ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonTextLabel);
        });

        test('Pressing escape while focus is on the Back Button fires the CloseMenuEvent with proper arguments', () => {
            const backButton = getBackButton(menu);
            menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
            backButton.focus();
            menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
            expect(getDetailPassedToEvent(callback)).toEqual({ restoreFocus: true });
        });

        test('Pressing escape while focus is on the combobox fires the CloseMenuEvent with proper arguments', () => {
            const combobox = getConditionPickerCombobox(menu);
            menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
            combobox.focus();
            menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
            expect(getDetailPassedToEvent(callback)).toEqual({ restoreFocus: true });
        });

        test('Clicking on the Delete Action should reveal the path picking combobox', () => {
            const connectorCombobox = getConditionPickerCombobox(menu);
            expect(connectorCombobox).not.toBeNull();
        });

        test('connectors combobox label, options, value should be correctly set', () => {
            const connectorCombobox = getConditionPickerCombobox(menu);
            expect(connectorCombobox).toMatchObject({
                label: LABELS.cutOrDeleteBranchElementComboboxLabel,
                options: conditionOptionsForDelete,
                value: conditionOptionsForDelete[0].value
            });
        });

        describe('Footer area for Branch Element', () => {
            let footer: LightningElement;
            let deleteButton: LightningElement;

            beforeEach(() => {
                footer = getFooter(menu);
                deleteButton = getFooterButton(footer);
            });

            it('Should have a footer area', () => {
                expect(footer).not.toBeNull();
            });

            it('Should have delete button in the Footer', () => {
                expect(deleteButton).not.toBeNull();
            });

            test.each`
                elementAttributeName | configPropertyKey
                ${'label'}           | ${'buttonTextLabel'}
                ${'title'}           | ${'buttonTextTitle'}
                ${'iconName'}        | ${'buttonIcon'}
                ${'iconPosition'}    | ${'buttonIconPosition'}
                ${'variant'}         | ${'buttonVariant'}
            `(
                'Delete button "$elementAttributeName" should be as set in the config',
                ({
                    elementAttributeName,
                    configPropertyKey
                }: {
                    elementAttributeName: string;
                    configPropertyKey: string;
                }) => {
                    expect(deleteButton[elementAttributeName]).toBe(
                        ELEMENT_ACTION_CONFIG.DELETE_BRANCH_ELEMENT_ACTION[configPropertyKey]
                    );
                }
            );

            test('Clicking the Delete Button should dispatch DeleteBranchElementEvent with right details', () => {
                menu.addEventListener(DeleteBranchElementEvent.EVENT_NAME, callback);
                deleteButton.click();
                expect(getDetailPassedToEvent(callback)).toEqual({
                    selectedElementGUID: [dummyBranchElement.guid],
                    selectedElementType: dummyBranchElement.elementType,
                    childIndexToKeep: undefined
                });
            });

            test('once focus is set to the delete footer button, enter key down should dispatch "DeleteBranchElementEvent" with proper arguments', () => {
                menu.addEventListener(DeleteBranchElementEvent.EVENT_NAME, callback);
                menu.getListKeyboardInteraction().setActiveElement(deleteButton);
                deleteButton.dispatchEvent(keydownEvent(Keys.Enter));
                expect(getDetailPassedToEvent(callback)).toEqual({
                    selectedElementGUID: [dummyBranchElement.guid],
                    selectedElementType: dummyBranchElement.elementType,
                    childIndexToKeep: undefined
                });
            });

            test('Pressing escape while focus is on the Delete Button fires the CloseMenuEvent with proper arguments', () => {
                menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                deleteButton.focus();
                menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
                expect(getDetailPassedToEvent(callback)).toEqual({
                    restoreFocus: true
                });
            });

            test('Pressing escape while focus is on the Delete Button does not fire the DeleteElementEvent', () => {
                menu.addEventListener(DeleteBranchElementEvent.EVENT_NAME, callback);
                deleteButton.focus();
                menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
                expect(callback).not.toHaveBeenCalled();
            });

            test('Clicking the Delete Button should dispatch CloseMenuEvent', () => {
                menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                deleteButton.click();
                expect(callback).toHaveBeenCalled();
            });
        });
    });

    describe('Element Action Node Menu for a Branch Element for cut menu mode', () => {
        const highlightPathCallback = jest.fn();
        const closeMenuCallback = jest.fn();

        beforeEach(async () => {
            menu = await createComponentUnderTest(dummyBranchElement, conditionOptionsForCut);
            menu.addEventListener(HighlightPathsToDeleteOrCutEvent.EVENT_NAME, highlightPathCallback);
            menu.addEventListener(CloseMenuEvent.EVENT_NAME, closeMenuCallback);

            const secondMenuItem = getMenuActionRowMenuItems(menu)[1];
            menu.getListKeyboardInteraction().setActiveElement(secondMenuItem);
            secondMenuItem.click();
        });

        test('Clicking the Cut Action should dispatch HighlightPathsToDeleteOrCutEvent', () => {
            expect(highlightPathCallback).toHaveBeenCalled();
        });

        test('HighlightPathsToDeleteOrCutEvent should be dispatched with the right details', () => {
            expect(getDetailPassedToEvent(highlightPathCallback)).toEqual({
                childIndexToKeep: undefined,
                elementGuid: dummyBranchElement.guid,
                operationType: 'cut'
            });
        });

        test('Clicking the Cut Action should not dispatch CloseMenuEvent', () => {
            expect(closeMenuCallback).not.toHaveBeenCalled();
        });

        test('Clicking on the Cut Action should reveal the back button', () => {
            const backButton = getBackButton(menu);
            expect(backButton).not.toBeNull();
        });

        test('Back button should have the right alternativeText, icon name, title, variant', () => {
            const backButton = getBackButton(menu);
            expect(backButton).toMatchObject({
                alternativeText: LABELS.backButtonAlternativeText,
                iconName: 'utility:back',
                title: LABELS.backButtonTitle,
                variant: 'bare'
            });
        });

        test('Clicking on the Back Button should dispatch ClearHighlightedPathEvent with proper arguments', () => {
            const backButton = getBackButton(menu);
            const clearHighlightedPathCallback = jest.fn();
            menu.addEventListener(ClearHighlightedPathEvent.EVENT_NAME, clearHighlightedPathCallback);
            backButton.click();
            expect(clearHighlightedPathCallback).toHaveBeenCalled();
        });

        test('Clicking on the Back Button should go back to base menu and reveal the list of action rows', async () => {
            const backButton = getBackButton(menu);
            await backButton.click();
            const actionList = menu.shadowRoot.querySelector(selectors.menuActionList);
            expect(actionList).not.toBeNull();
        });

        test('Clicking on the Back Button should go back to base footer', async () => {
            const backButton = getBackButton(menu);
            await backButton.click();
            const editButton = getFooterButton(getFooter(menu));
            expect(editButton.label).toBe(ELEMENT_ACTION_CONFIG.EDIT_DETAILS_ACTION.buttonTextLabel);
        });

        test('Pressing escape while focus is on the Back Button fires the CloseMenuEvent with proper arguments', () => {
            const backButton = getBackButton(menu);
            menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
            backButton.focus();
            menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
            expect(getDetailPassedToEvent(callback)).toEqual({ restoreFocus: true });
        });

        test('Pressing escape while focus is on the combobox fires the CloseMenuEvent with proper arguments', () => {
            const combobox = getConditionPickerCombobox(menu);
            menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
            combobox.focus();
            menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
            expect(getDetailPassedToEvent(callback)).toEqual({ restoreFocus: true });
        });

        test('Clicking on the Cut Action should reveal the path picking combobox', () => {
            const connectorCombobox = getConditionPickerCombobox(menu);
            expect(connectorCombobox).not.toBeNull();
        });

        test('connectors combobox label, options, value should be correctly set', () => {
            const connectorCombobox = getConditionPickerCombobox(menu);
            expect(connectorCombobox).toMatchObject({
                label: LABELS.cutOrDeleteBranchElementComboboxLabel,
                options: conditionOptionsForCut,
                value: conditionOptionsForCut[0].value
            });
        });

        describe('Footer area for Branch Element', () => {
            let footer: LightningElement;
            let cutButton: LightningElement;

            beforeEach(() => {
                footer = getFooter(menu);
                cutButton = getFooterButton(footer);
            });

            it('Should have a footer area', () => {
                expect(footer).not.toBeNull();
            });

            it('Should have cut button in the Footer', () => {
                expect(cutButton).not.toBeNull();
            });

            test.each`
                elementAttributeName | configPropertyKey
                ${'label'}           | ${'buttonTextLabel'}
                ${'title'}           | ${'buttonTextTitle'}
                ${'iconName'}        | ${'buttonIcon'}
                ${'iconPosition'}    | ${'buttonIconPosition'}
                ${'variant'}         | ${'buttonVariant'}
            `(
                'Cut button "$elementAttributeName" should be as set in the config',
                ({
                    elementAttributeName,
                    configPropertyKey
                }: {
                    elementAttributeName: string;
                    configPropertyKey: string;
                }) => {
                    expect(cutButton[elementAttributeName]).toBe(
                        ELEMENT_ACTION_CONFIG.CUT_BRANCH_ELEMENT_ACTION[configPropertyKey]
                    );
                }
            );

            test('Clicking the Cut Button should dispatch CutElementsEvent with right details', () => {
                menu.addEventListener(CutElementsEvent.EVENT_NAME, callback);
                cutButton.click();
                expect(getDetailPassedToEvent(callback)).toEqual({
                    guids: [dummyBranchElement.guid],
                    childIndexToKeep: undefined,
                    parentGUID: undefined
                });
            });

            test('once focus is set to the cut footer button, enter key down should dispatch "CutElementsEvent" with proper arguments', () => {
                menu.addEventListener(CutElementsEvent.EVENT_NAME, callback);
                menu.getListKeyboardInteraction().setActiveElement(cutButton);
                cutButton.dispatchEvent(keydownEvent(Keys.Enter));
                expect(getDetailPassedToEvent(callback)).toEqual({
                    guids: [dummyBranchElement.guid],
                    childIndexToKeep: undefined,
                    parentGUID: undefined
                });
            });

            test('Pressing escape while focus is on the Cut Button fires the CloseMenuEvent with proper arguments', () => {
                menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                cutButton.focus();
                menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
                expect(getDetailPassedToEvent(callback)).toEqual({
                    restoreFocus: true
                });
            });

            test('Pressing escape while focus is on the Cut Button does not fire the CutElementsEvent', () => {
                menu.addEventListener(CutElementsEvent.EVENT_NAME, callback);
                cutButton.focus();
                menu.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
                expect(callback).not.toHaveBeenCalled();
            });

            test('Clicking the Cut Button should dispatch CloseMenuEvent', () => {
                menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
                cutButton.click();
                expect(callback).toHaveBeenCalled();
            });
        });
    });

    describe('Subflow Node Menu', () => {
        let openFlowRow: LightningElement;
        beforeEach(async () => {
            menu = await createComponentUnderTest(dummySubflowElement);
            menu.flowModel = {
                subflowElementGuid: {
                    flowName: 'Dummy Subflow'
                }
            };
            openFlowRow = getMenuActionRows(menu)[3];
        });

        it('Should have the open subflow row item', () => {
            expect(openFlowRow).toBeDefined();
        });

        test('Clicking on the Open Subflow row item should dispatch the OpenSubflowEvent', () => {
            menu.addEventListener(OpenSubflowEvent.EVENT_NAME, callback);
            openFlowRow.click();
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: {
                        flowName: menu.flowModel.subflowElementGuid.flowName
                    }
                })
            );
        });

        test('Clicking on the Open Subflow row dispatches the close menu event with proper arguments', () => {
            menu.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
            openFlowRow.click();
            expect(getDetailPassedToEvent(callback)).toEqual({ restoreFocus: true });
        });

        test('The Open Subflow row icon should have the right icon-name', () => {
            const openSubflowIcon = openFlowRow.querySelector(selectors.menuActionRowIcon);
            expect(openSubflowIcon.iconName).toBe(ELEMENT_ACTION_CONFIG.OPEN_SUBFLOW_ACTION.icon);
        });

        test('The Open Subflow row should have the right label', () => {
            const openSubflowLabel = openFlowRow.querySelector(selectors.menuActionRowLabel);
            expect(openSubflowLabel.textContent).toBe(ELEMENT_ACTION_CONFIG.OPEN_SUBFLOW_ACTION.label);
        });
    });
});
