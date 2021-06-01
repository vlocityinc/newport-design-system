// @ts-nocheck
import { createElement } from 'lwc';
import AlcMenuTrigger from 'builder_platform_interaction/alcMenuTrigger';
import { ToggleMenuEvent, CloseMenuEvent, TabOnMenuTriggerEvent } from 'builder_platform_interaction/alcEvents';
import { ICON_SHAPE, AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';
import { CanvasMouseUpEvent } from 'builder_platform_interaction/events';

const startMetadata = {
    canHaveFaultConnector: false,
    elementType: 'Start',
    icon: 'standard:start',
    iconShape: ICON_SHAPE.CIRCLE,
    label: 'Start',
    section: null,
    type: NodeType.START,
    value: 'Start'
};

const screenMetadata = {
    canHaveFaultConnector: false,
    elementType: 'Screen',
    icon: 'standard:screen',
    label: 'Screen',
    section: null,
    type: NodeType.DEFAULT,
    value: 'Screen'
};

const decisionMetadata = {
    canHaveFaultConnector: false,
    elementType: 'Decision',
    icon: 'standard:decision',
    iconShape: ICON_SHAPE.DIAMOND,
    label: 'Decision',
    section: null,
    type: NodeType.BRANCH,
    value: 'Decision'
};

const customComponentMetadata = {
    canHaveFaultConnector: false,
    elementType: 'OrchestratedStage',
    icon: 'standard:screen',
    label: 'Decision',
    section: null,
    type: NodeType.DEFAULT,
    value: 'OrchestratedStage',
    dynamicNodeComponent: 'builder_platform_interaction/orchestratedStageNode'
};

const endMetadata = {
    canHaveFaultConnector: false,
    elementType: 'End',
    icon: 'standard:end',
    iconShape: ICON_SHAPE.CIRCLE,
    label: 'End',
    section: null,
    type: NodeType.END,
    value: 'End'
};

const createComponentUnderTest = (
    metadata = screenMetadata,
    variant = '',
    connectionInfo = {},
    isNodeGettingDeleted = false,
    canvasMode = AutoLayoutCanvasMode.DEFAULT,
    hasError = false
) => {
    const el = createElement('builder_platform_interaction-alc-menu-trigger', {
        is: AlcMenuTrigger
    });
    el.elementMetadata = metadata;
    el.isNodeGettingDeleted = isNodeGettingDeleted;
    el.canvasMode = canvasMode;
    el.variant = variant;
    el.connectionInfo = connectionInfo;
    el.hasError = hasError;
    setDocumentBodyChildren(el);
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
    nodeInSelectionMode: '.node-in-selection-mode',
    hasError: '.has-error'
};

describe('the menu trigger', () => {
    it('renders the component ', () => {
        const menuTrigger = createComponentUnderTest();
        expect(menuTrigger).not.toBeNull();
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
        const cmp = createComponentUnderTest(screenMetadata, undefined, undefined, true);
        const button = cmp.shadowRoot.querySelector(selectors.toBeDeletedButton);
        expect(button).not.toBeNull();
    });

    it('should add "has-error" class when hasError is specified in node config', () => {
        const cmp = createComponentUnderTest(screenMetadata, undefined, undefined, true, undefined, true);
        const button = cmp.shadowRoot.querySelector(selectors.hasError);
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
        const button = createComponentUnderTest(
            screenMetadata,
            undefined,
            undefined,
            false,
            AutoLayoutCanvasMode.SELECTION
        ).shadowRoot.querySelector(selectors.nodeInSelectionMode);
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
        const container = cmp.shadowRoot.querySelector(selectors.defaultTriggerContainer);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        container.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        container.dispatchEvent(keyDownEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('pressing the escape key should dispatch the CloseMenuEvent event if the menu is open', () => {
        const cmp = createComponentUnderTest();
        const container = cmp.shadowRoot.querySelector(selectors.defaultTriggerContainer);
        const callback = jest.fn();
        cmp.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
        cmp.menuOpened = true;
        container.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        container.dispatchEvent(keyDownEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('pressing the enter key should not dispatch the CloseMenuEvent event if we are in selection mode', () => {
        const cmp = createComponentUnderTest(screenMetadata, undefined, undefined, false, true);
        const button = cmp.shadowRoot.querySelector(selectors.triggerButton);
        const callback = jest.fn();
        cmp.addEventListener(CloseMenuEvent.EVENT_NAME, callback);
        button.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        cmp.dispatchEvent(keyDownEvent);
        expect(callback).not.toHaveBeenCalled();
    });

    it('pressing the enter key on connector "+" should dispatch the toggleMenu event if we are NOT in selection mode', () => {
        const cmp = createComponentUnderTest(undefined, 'connector', {});
        const container = cmp.shadowRoot.querySelector('div');
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        container.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        container.dispatchEvent(keyDownEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('should not dispatch the toggleMenu event if we are in selection mode', () => {
        const cmp = createComponentUnderTest(
            screenMetadata,
            undefined,
            undefined,
            false,
            AutoLayoutCanvasMode.SELECTION
        );
        const button = cmp.shadowRoot.querySelector(selectors.triggerButton);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.click();
        expect(callback).not.toHaveBeenCalled();
    });

    it('pressing tab on trigger button should dispatch TabOnMenuTriggerEvent if the menu is open', () => {
        const cmp = createComponentUnderTest();
        const container = cmp.shadowRoot.querySelector(selectors.defaultTriggerContainer);
        const callback = jest.fn();
        cmp.addEventListener(TabOnMenuTriggerEvent.EVENT_NAME, callback);
        cmp.menuOpened = true;
        container.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'Tab' });
        container.dispatchEvent(keyDownEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('pressing shift + tab on trigger button should dispatch TabOnMenuTriggerEvent if the menu is open', () => {
        const cmp = createComponentUnderTest();
        const container = cmp.shadowRoot.querySelector(selectors.defaultTriggerContainer);
        const callback = jest.fn();
        cmp.addEventListener(TabOnMenuTriggerEvent.EVENT_NAME, callback);
        cmp.menuOpened = true;
        container.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        container.dispatchEvent(keyDownEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('pressing tab button should dispatch CanvasMouseUpEvent', () => {
        const cmp = createComponentUnderTest();
        const container = cmp.shadowRoot.querySelector(selectors.defaultTriggerContainer);
        const callback = jest.fn();
        cmp.addEventListener(CanvasMouseUpEvent.EVENT_NAME, callback);
        container.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'Tab' });
        container.dispatchEvent(keyDownEvent);
        expect(callback).toHaveBeenCalled();
    });

    describe('Focus Management', () => {
        it('Regular element should have tabindex equal to 0', () => {
            const button = createComponentUnderTest(screenMetadata).shadowRoot.querySelector(selectors.triggerButton);
            expect(button.tabIndex).toEqual(0);
        });

        it('End element should have tabindex equal to -1', () => {
            const button = createComponentUnderTest(endMetadata).shadowRoot.querySelector(selectors.endElement);
            expect(button.tabIndex).toEqual(-1);
        });

        it('In Selection Mode regular element should have tabindex equal to -1', () => {
            const button = createComponentUnderTest(
                screenMetadata,
                undefined,
                undefined,
                false,
                AutoLayoutCanvasMode.SELECTION
            ).shadowRoot.querySelector(selectors.triggerButton);
            expect(button.tabIndex).toEqual(-1);
        });

        it('In Selection Mode end element should have tabindex equal to -1', () => {
            const button = createComponentUnderTest(
                endMetadata,
                undefined,
                undefined,
                false,
                AutoLayoutCanvasMode.SELECTION
            ).shadowRoot.querySelector(selectors.endElement);
            expect(button.tabIndex).toEqual(-1);
        });

        it('Connector "+" should have tabindex equal to 0 in Base Mode', () => {
            const button = createComponentUnderTest(undefined, 'connector', {}).shadowRoot.querySelector(
                selectors.triggerButton
            );
            expect(button.tabIndex).toEqual(0);
        });

        it('Connector "+" should have tabindex equal to -1 in Selection Mode', () => {
            const button = createComponentUnderTest(
                undefined,
                'connector',
                {},
                false,
                AutoLayoutCanvasMode.SELECTION
            ).shadowRoot.querySelector(selectors.triggerButton);
            expect(button.tabIndex).toEqual(-1);
        });

        it('Regular element should get focus on click in Base Mode', () => {
            const button = createComponentUnderTest(screenMetadata).shadowRoot.querySelector(selectors.triggerButton);
            const callback = jest.fn();
            button.addEventListener('focus', callback);
            button.click();
            expect(callback).toHaveBeenCalled();
        });

        it('Regular element should not get focus on click in Selection Mode', () => {
            const button = createComponentUnderTest(
                screenMetadata,
                undefined,
                undefined,
                false,
                AutoLayoutCanvasMode.SELECTION
            ).shadowRoot.querySelector(selectors.triggerButton);
            const callback = jest.fn();
            button.addEventListener('focus', callback);
            button.click();
            expect(callback).not.toHaveBeenCalled();
        });

        it('End element should not get focus on click in Base Mode', () => {
            const button = createComponentUnderTest(endMetadata).shadowRoot.querySelector(selectors.endElement);
            const callback = jest.fn();
            button.addEventListener('focus', callback);
            button.click();
            expect(callback).not.toHaveBeenCalled();
        });

        it('End element should not get focus on click in Selection Mode', () => {
            const button = createComponentUnderTest(
                endMetadata,
                undefined,
                undefined,
                false,
                true
            ).shadowRoot.querySelector(selectors.endElement);
            const callback = jest.fn();
            button.addEventListener('focus', callback);
            button.click();
            expect(callback).not.toHaveBeenCalled();
        });

        it('Connector "+" should get focus on click in Base Mode', () => {
            const button = createComponentUnderTest(undefined, 'connector', {}).shadowRoot.querySelector(
                selectors.triggerButton
            );
            const callback = jest.fn();
            button.addEventListener('focus', callback);
            button.click();
            expect(callback).toHaveBeenCalled();
        });
    });
});
