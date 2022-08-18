import { FocusOutEvent } from 'builder_platform_interaction/alcEvents';
import { removeDocumentBodyChildren, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { ACTION_TYPE, ELEMENT_TYPE, FLOW_ELEMENT_SUBTYPE } from 'builder_platform_interaction/flowMetadata';
import { commands } from 'builder_platform_interaction/sharedUtils';
import StageStepMenu from 'builder_platform_interaction/stageStepMenu';
import { createElement } from 'lwc';

const { EnterCommand, SpaceCommand, ArrowDown, ArrowUp, EscapeCommand, TabCommand } = commands;

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));
jest.mock('builder_platform_interaction/elementConfig', () => {
    const actual = jest.requireActual('builder_platform_interaction/elementConfig');
    const mockSubtypeConfig = require('mock/flows/elementSubtypeConfigMock.json');
    const elementTypeToConfigMap = actual.elementTypeToConfigMap;
    elementTypeToConfigMap.InteractiveStep = mockSubtypeConfig.InteractiveStep;
    elementTypeToConfigMap.BackgroundStep = mockSubtypeConfig.BackgroundStep;
    return Object.assign({}, actual, {
        elementTypeToConfigMap
    });
});
const selectors = {
    menuItemListItem: 'li[role="presentation"]',
    menuItem: 'div[role="menuitem"]'
};

const menuItemSubSelectors = {
    icon: 'lightning-icon',
    label: 'span.slds-listbox__option-text',
    description: 'span.slds-listbox__option-meta'
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-stage-step-menu', {
        is: StageStepMenu
    });
    setDocumentBodyChildren(el);
    return el;
};

describe('Stage Step Menu', () => {
    let stageStepMenuElement;

    beforeEach(() => {
        stageStepMenuElement = createComponentUnderTest();
    });

    afterEach(() => {
        removeDocumentBodyChildren();
    });

    it('should render the component', () => {
        expect(stageStepMenuElement).toBeDefined();
    });

    it('should have the correct menu configuration', () => {
        const menuListItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItemListItem);

        const sortedStepSubtypeKeys = Object.keys(elementTypeToConfigMap)
            .filter((key) => {
                const config = elementTypeToConfigMap[key];
                const isStepSubtype = config.isElementSubtype && config.elementType === ELEMENT_TYPE.STAGE_STEP;
                return isStepSubtype;
            })
            .sort();

        expect(menuListItems.length).toEqual(sortedStepSubtypeKeys.length);

        for (let i = 0; i < menuListItems.length; i++) {
            const item = menuListItems[i];
            const { labels, nodeConfig, elementSubtype } = elementTypeToConfigMap[sortedStepSubtypeKeys[i]];
            const { singular } = labels!;
            const { description, iconName, iconBackgroundColor } = nodeConfig;

            expect(item.getAttribute('element-subtype')).toEqual(elementSubtype);

            const icon = item.querySelector(menuItemSubSelectors.icon);
            expect(icon.iconName).toEqual(iconName);
            expect(icon.classList).toContain(iconBackgroundColor);

            const labelNode = item.querySelector(menuItemSubSelectors.label);
            const descriptionNode = item.querySelector(menuItemSubSelectors.description);

            expect(labelNode.textContent).toEqual(singular);
            expect(descriptionNode.textContent).toEqual(description);
        }
    });

    it('should create an Background Step when the Background Step button is clicked', () => {
        const callback = jest.fn();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[0].click();
        expect(callback.mock.calls[0][0].detail).toEqual({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            elementSubtype: FLOW_ELEMENT_SUBTYPE.BackgroundStep,
            actionType: ACTION_TYPE.STEP_BACKGROUND,
            parent: undefined,
            designateFocus: true
        });
    });

    it('should create a Background Step when Enter key is pressed while focus is on the Background Step button', () => {
        const callback = jest.fn();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[0].focus();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        stageStepMenuElement.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
        expect(callback.mock.calls[0][0].detail).toEqual({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            elementSubtype: FLOW_ELEMENT_SUBTYPE.BackgroundStep,
            actionType: ACTION_TYPE.STEP_BACKGROUND,
            parent: undefined,
            designateFocus: true
        });
    });

    it('should create a Background Step when Space key is pressed while focus is on the Background Step button', () => {
        const callback = jest.fn();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[0].focus();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        stageStepMenuElement.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
        expect(callback.mock.calls[0][0].detail).toEqual({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            elementSubtype: FLOW_ELEMENT_SUBTYPE.BackgroundStep,
            actionType: ACTION_TYPE.STEP_BACKGROUND,
            parent: undefined,
            designateFocus: true
        });
    });

    it('should create an Interactive Step when the Interactive Step button is clicked', () => {
        const callback = jest.fn();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[1].click();
        expect(callback.mock.calls[0][0].detail).toEqual({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            elementSubtype: FLOW_ELEMENT_SUBTYPE.InteractiveStep,
            actionType: ACTION_TYPE.STEP_INTERACTIVE,
            parent: undefined,
            designateFocus: true
        });
    });

    it('should create an Interactive Step when Enter key is pressed while focus is on the Interactive Step button', () => {
        const callback = jest.fn();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[1].setAttribute('tabindex', '0');
        listItems[1].focus();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        stageStepMenuElement.keyboardInteractions.execute(EnterCommand.COMMAND_NAME);
        expect(callback.mock.calls[0][0].detail).toEqual({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            elementSubtype: FLOW_ELEMENT_SUBTYPE.InteractiveStep,
            actionType: ACTION_TYPE.STEP_INTERACTIVE,
            parent: undefined,
            designateFocus: true
        });
    });

    it('should create an Interactive Step when Space key is pressed while focus is on the Interactive Step button', () => {
        const callback = jest.fn();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[1].setAttribute('tabindex', '0');
        listItems[1].focus();
        stageStepMenuElement.addEventListener(AddElementEvent.EVENT_NAME, callback);
        stageStepMenuElement.keyboardInteractions.execute(SpaceCommand.COMMAND_NAME);
        expect(callback.mock.calls[0][0].detail).toEqual({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            elementSubtype: FLOW_ELEMENT_SUBTYPE.InteractiveStep,
            actionType: ACTION_TYPE.STEP_INTERACTIVE,
            parent: undefined,
            designateFocus: true
        });
    });

    it('focus should move correctly to the next row on arrow down', () => {
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[0].focus();
        const callback = jest.fn();
        listItems[1].addEventListener('focus', callback);
        stageStepMenuElement.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('focus should move correctly to the previous row on arrow up', () => {
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[1].setAttribute('tabindex', '0');
        listItems[1].focus();
        const callback = jest.fn();
        listItems[0].addEventListener('focus', callback);
        stageStepMenuElement.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('focus should move correctly to the first row on arrow down on the last row', () => {
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[listItems.length - 1].setAttribute('tabindex', '0');
        listItems[listItems.length - 1].focus();
        const callback = jest.fn();
        listItems[0].addEventListener('focus', callback);
        stageStepMenuElement.keyboardInteractions.execute(ArrowDown.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('focus should move correctly to the last row on arrow up on the first row', () => {
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        listItems[0].focus();
        const callback = jest.fn();
        listItems[listItems.length - 1].addEventListener('focus', callback);
        stageStepMenuElement.keyboardInteractions.execute(ArrowUp.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('pressing escape while focus is on a row item should fire the FocusOutEvent', () => {
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        const callback = jest.fn();
        stageStepMenuElement.addEventListener(FocusOutEvent.EVENT_NAME, callback);
        listItems[0].focus();
        stageStepMenuElement.keyboardInteractions.execute(EscapeCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });

    it('pressing tab while focus is on a row item should fire the FocusOutEvent', () => {
        const listItems = stageStepMenuElement.shadowRoot.querySelectorAll(selectors.menuItem);
        const callback = jest.fn();
        stageStepMenuElement.addEventListener(FocusOutEvent.EVENT_NAME, callback);
        listItems[0].focus();
        stageStepMenuElement.keyboardInteractions.execute(TabCommand.COMMAND_NAME);
        expect(callback).toHaveBeenCalled();
    });
});
