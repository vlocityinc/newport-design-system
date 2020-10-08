// @ts-nocheck
import { createElement } from 'lwc';
import FlcButtonMenu from 'builder_platform_interaction/flcButtonMenu';
import { ToggleMenuEvent } from 'builder_platform_interaction/flcEvents';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const startMetadata = {
    canHaveFaultConnector: false,
    elementType: 'Start',
    icon: 'standard:start',
    iconShape: ICON_SHAPE.CIRCLE,
    label: 'Start',
    section: null,
    type: ElementType.START,
    value: 'Start'
};

const screenMetadata = {
    canHaveFaultConnector: false,
    elementType: 'Screen',
    icon: 'standard:screen',
    label: 'Screen',
    section: null,
    type: ElementType.DEFAULT,
    value: 'Screen'
};

const decisionMetadata = {
    canHaveFaultConnector: false,
    elementType: 'Decision',
    icon: 'standard:decision',
    iconShape: ICON_SHAPE.DIAMOND,
    label: 'Decision',
    section: null,
    type: ElementType.BRANCH,
    value: 'Decision'
};

const customComponentMetadata = {
    canHaveFaultConnector: false,
    elementType: 'SteppedStage',
    icon: 'standard:screen',
    label: 'Decision',
    section: null,
    type: ElementType.DEFAULT,
    value: 'SteppedStage',
    dynamicNodeComponent: 'builder_platform_interaction/steppedStageNode'
};

const endMetadata = {
    canHaveFaultConnector: false,
    elementType: 'End',
    icon: 'standard:end',
    iconShape: ICON_SHAPE.CIRCLE,
    label: 'End',
    section: null,
    type: ElementType.END,
    value: 'End'
};

const createComponentUnderTest = (metadata = screenMetadata, isNodeGettingDeleted = false, isSelectionMode = false) => {
    const el = createElement('builder_platform_interaction-flc-button-menu', {
        is: FlcButtonMenu
    });
    el.elementMetadata = metadata;
    el.isNodeGettingDeleted = isNodeGettingDeleted;
    el.isSelectionMode = isSelectionMode;
    el.connectionInfo = {};
    document.body.appendChild(el);
    return el;
};

const selectors = {
    defaultTriggerContainer: '.default-container.slds-p-around_xx-small',
    diamondTriggerContainer: '.default-container.rotate-icon-container.slds-p-around_xx-small',
    customComponentTriggerContainer: '.slds-p-around_xx-small',
    triggerButton: 'button',
    circularTriggerButton: '.circular-icon',
    toBeDeletedButton: '.node-to-be-deleted',
    endElement: '.is-end-element',
    nodeInSelectionMode: '.node-in-selection-mode'
};

describe('the button menu', () => {
    it('renders the component ', () => {
        const buttonMenu = createComponentUnderTest();
        expect(buttonMenu).not.toBeNull();
    });

    it('Renders a default trigger container', () => {
        const triggerContainer = createComponentUnderTest().shadowRoot.querySelector(selectors.defaultTriggerContainer);
        expect(triggerContainer).not.toBeNull();
    });

    it('Renders a diamond trigger container when iconShape in metadata is diamond', () => {
        const triggerContainer = createComponentUnderTest(decisionMetadata).shadowRoot.querySelector(
            selectors.defaultTriggerContainer
        );
        expect(triggerContainer).not.toBeNull();
    });

    it('Renders a trigger container for a custom node component', () => {
        const triggerContainer = createComponentUnderTest(customComponentMetadata).shadowRoot.querySelector(
            selectors.customComponentTriggerContainer
        );
        expect(triggerContainer).not.toBeNull();
    });

    it('Renders a button ', () => {
        const button = createComponentUnderTest().shadowRoot.querySelector(selectors.triggerButton);
        expect(button).not.toBeNull();
    });

    it('should add "node-to-be-deleted" class when isNodeGettingDeleted is true', () => {
        const cmp = createComponentUnderTest(screenMetadata, true);
        const button = cmp.shadowRoot.querySelector(selectors.toBeDeletedButton);
        expect(button).not.toBeNull();
    });

    it('should add "circular-icon" class when iconShape is circle in the metadata', () => {
        const button = createComponentUnderTest(startMetadata).shadowRoot.querySelector(
            selectors.circularTriggerButton
        );
        expect(button).not.toBeNull();
    });

    it('should add "is-end-element" class when type is end in the metadata', () => {
        const button = createComponentUnderTest(endMetadata).shadowRoot.querySelector(selectors.endElement);
        expect(button).not.toBeNull();
    });

    it('should add "node-in-selection-mode" class when in selection mode', () => {
        const button = createComponentUnderTest(screenMetadata, false, true).shadowRoot.querySelector(
            selectors.nodeInSelectionMode
        );
        expect(button).not.toBeNull();
    });

    it('should dispatch the toggleMenu event if we are NOT in selection mode', () => {
        const cmp = createComponentUnderTest();
        const button = cmp.shadowRoot.querySelector(selectors.triggerButton);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.click();
        expect(callback).toHaveBeenCalled();
    });

    it('pressing the enter key should dispatch the toggleMenu event if we are NOT in selection mode', () => {
        const cmp = createComponentUnderTest();
        const button = cmp.shadowRoot.querySelector(selectors.triggerButton);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.focus();
        cmp.keyboardInteractions.execute('entercommand');
        expect(callback).toHaveBeenCalled();
    });

    it('pressing the enter key should not dispatch the toggleMenu event if we are in selection mode', () => {
        const cmp = createComponentUnderTest(screenMetadata, false, true);
        const button = cmp.shadowRoot.querySelector(selectors.triggerButton);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.focus();
        cmp.keyboardInteractions.execute('entercommand');
        expect(callback).not.toHaveBeenCalled();
    });

    it('should not dispatch the toggleMenu event if we are in selection mode', () => {
        const cmp = createComponentUnderTest(screenMetadata, false, true);
        const button = cmp.shadowRoot.querySelector(selectors.triggerButton);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.click();
        expect(callback).not.toHaveBeenCalled();
    });

    it('Regular element should have tabindex equal to 0', () => {
        const button = createComponentUnderTest(screenMetadata).shadowRoot.querySelector(selectors.triggerButton);
        expect(button.tabIndex).toEqual(0);
    });

    it('End element should have tabindex equal to -1', () => {
        const button = createComponentUnderTest(endMetadata).shadowRoot.querySelector(selectors.endElement);
        expect(button.tabIndex).toEqual(-1);
    });

    it('In Selection Mode regular element should have tabindex equal to -1', () => {
        const button = createComponentUnderTest(screenMetadata, false, true).shadowRoot.querySelector(
            selectors.triggerButton
        );
        expect(button.tabIndex).toEqual(-1);
    });

    it('In Selection Mode end element should have tabindex equal to -1', () => {
        const button = createComponentUnderTest(endMetadata, false, true).shadowRoot.querySelector(
            selectors.endElement
        );
        expect(button.tabIndex).toEqual(-1);
    });
});
