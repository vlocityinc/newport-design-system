// @ts-nocheck
import { AutoLayoutCanvasMode, ICON_SHAPE } from 'builder_platform_interaction/alcComponentsUtils';
import { CloseMenuEvent, ToggleMenuEvent } from 'builder_platform_interaction/alcEvents';
import { MenuType, NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { keyboardInteractionUtils } from 'builder_platform_interaction_mocks/sharedUtils';
const { Keys } = keyboardInteractionUtils;

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

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

const defaultOptions = {
    elementMetadata: screenMetadata,
    canvasMode: AutoLayoutCanvasMode.DEFAULT,
    operationType: 'delete',
    variant: '',
    source: {},
    hasError: false
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-alc-menu-trigger', defaultOptions, overrideOptions);
};

const selectors = {
    defaultTriggerContainer: '.default-container.slds-p-around_xx-small',
    diamondTriggerContainer: '.default-container.rotate-icon-container.slds-p-around_xx-small',
    roundTriggerContainer: '.default-container.round-container.slds-p-around_xx-small',
    customComponentTriggerContainer: '.slds-p-around_xx-small',
    triggerButton: 'button',
    circularTriggerButton: '.circular-icon',
    toBeDeletedButton: '.node-to-be-deleted',
    toBeCutButton: '.node-to-be-cut',
    endElement: '.is-end-element',
    nodeInSelectionMode: '.node-in-selection-mode',
    hasError: '.has-error',
    assistiveText: '.slds-assistive-text'
};

function assertCallback(callback, isCalled) {
    if (isCalled) {
        expect(callback).toHaveBeenCalled();
    } else {
        expect(callback).not.toHaveBeenCalled();
    }
}

function getButton(cmp) {
    return cmp.shadowRoot.querySelector(selectors.triggerButton);
}

async function assertTriggerFocus(componentOptions, isFocused) {
    const cmp = await createComponentUnderTest(componentOptions);
    const button = getButton(cmp);
    const callback = jest.fn();
    button.addEventListener('focus', callback);
    button.click();
    assertCallback(callback, isFocused);
}

async function assertTriggerKey(componentOptions, key, eventToCheck, isEventTriggered) {
    const cmp = await createComponentUnderTest(componentOptions);
    const button = getButton(cmp);
    const callback = jest.fn();
    cmp.addEventListener(eventToCheck, callback);
    const keyDownEvent = new KeyboardEvent('keydown', { key, bubbles: true });
    button.dispatchEvent(keyDownEvent);
    assertCallback(callback, isEventTriggered);
}

async function assertTriggerClick(componentOptions, isEventTriggered) {
    const cmp = await createComponentUnderTest(componentOptions);
    const button = getButton(cmp);
    const callback = jest.fn();
    cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
    button.click();
    assertCallback(callback, isEventTriggered);
}

describe('AlcMenuTrigger', () => {
    it('renders the component', async () => {
        const menuTrigger = await createComponentUnderTest();
        expect(menuTrigger).not.toBeNull();
    });

    it('Renders a default trigger container', async () => {
        const cmp = await createComponentUnderTest();
        const triggerContainer = cmp.shadowRoot.querySelector(selectors.defaultTriggerContainer);
        expect(triggerContainer).not.toBeNull();
    });

    it('Renders a diamond trigger container when iconShape in metadata is diamond', async () => {
        const cmp = await createComponentUnderTest({
            elementMetadata: decisionMetadata
        });

        const triggerContainer = cmp.shadowRoot.querySelector(selectors.diamondTriggerContainer);
        expect(triggerContainer).not.toBeNull();
    });

    it('Renders a round trigger container when iconShape in metadata is circle', async () => {
        const cmp = await createComponentUnderTest({
            elementMetadata: startMetadata
        });
        const triggerContainer = cmp.shadowRoot.querySelector(selectors.roundTriggerContainer);
        expect(triggerContainer).not.toBeNull();
    });

    it('Renders a trigger container for a custom node component', async () => {
        const cmp = await createComponentUnderTest({
            elementMetadata: customComponentMetadata
        });

        const triggerContainer = cmp.shadowRoot.querySelector(selectors.customComponentTriggerContainer);
        expect(triggerContainer).not.toBeNull();
    });

    it('Renders a button ', async () => {
        const cmp = await createComponentUnderTest();
        const button = cmp.shadowRoot.querySelector(selectors.triggerButton);
        expect(button).not.toBeNull();
    });

    it('should add "node-to-be-deleted" class when in Delete operation type', async () => {
        const cmp = await createComponentUnderTest();
        const button = cmp.shadowRoot.querySelector(selectors.toBeDeletedButton);
        expect(button).not.toBeNull();
    });

    it('should add "node-to-be-cut" class when in Cut operation type', async () => {
        const cmp = await createComponentUnderTest({
            operationType: 'cut'
        });
        const button = cmp.shadowRoot.querySelector(selectors.toBeCutButton);
        expect(button).not.toBeNull();
    });

    it('should add "has-error" class when hasError is specified in node config', async () => {
        const cmp = await createComponentUnderTest({ hasError: true });
        const button = cmp.shadowRoot.querySelector(selectors.hasError);
        expect(button).not.toBeNull();
    });

    it('should add "circular-icon" class when iconShape is circle in the metadata', async () => {
        const cmp = await createComponentUnderTest({ elementMetadata: startMetadata });

        const button = cmp.shadowRoot.querySelector(selectors.circularTriggerButton);
        expect(button).not.toBeNull();
    });

    it('should add "is-end-element" class when type is end in the metadata', async () => {
        const cmp = await createComponentUnderTest({ elementMetadata: endMetadata });
        const button = cmp.shadowRoot.querySelector(selectors.endElement);
        expect(button).not.toBeNull();
    });

    it('should add "node-in-selection-mode" class when in selection mode', async () => {
        const cmp = await createComponentUnderTest({
            canvasMode: AutoLayoutCanvasMode.SELECTION
        });
        const button = cmp.shadowRoot.querySelector(selectors.nodeInSelectionMode);
        expect(button).not.toBeNull();
    });

    it('should dispatch the toggleMenu event if we are NOT in selection mode', async () => {
        const options = {};
        await assertTriggerClick(options, true);
    });

    it('assistive ariaDescribedBy class is present', async () => {
        const cmp = await createComponentUnderTest();
        const assistiveText = cmp.shadowRoot.querySelector(selectors.assistiveText);
        expect(assistiveText).not.toBeNull();
    });

    it('should not dispatch the toggleMenu event if disableEditElements is true', async () => {
        const options = { disableEditElements: true };
        await assertTriggerClick(options, false);
    });

    it('should dispatch the toggleMenu event on click of start element, even if disableEditElements is true', async () => {
        const options = { disableEditElements: true, elementMetadata: startMetadata };
        await assertTriggerClick(options, true);
    });

    it('pressing the enter key should dispatch the toggleMenu event if we are NOT in selection mode', async () => {
        await assertTriggerKey({}, Keys.Enter, ToggleMenuEvent.EVENT_NAME, true);
    });

    it('pressing the enter key should not dispatch the toggleMenuEvent if disableEditElements is true', async () => {
        const options = { disableEditElements: true };
        await assertTriggerKey(options, Keys.Enter, ToggleMenuEvent.EVENT_NAME, false);
    });

    it('pressing the enter key should dispatch the toggleMenuEvent if it is the start element, even if disableEditElements is true', async () => {
        const options = { disableEditElements: true, elementMetadata: startMetadata };
        await assertTriggerKey(options, Keys.Enter, ToggleMenuEvent.EVENT_NAME, true);
    });

    it('pressing the escape key should dispatch the CloseMenuEvent event if the menu is open', async () => {
        const options = { menuOpened: true };
        await assertTriggerKey(options, Keys.Escape, CloseMenuEvent.EVENT_NAME, true);
    });

    it('pressing the enter key should not dispatch the CloseMenuEvent event if we are in selection mode', async () => {
        const options = { canvasMode: AutoLayoutCanvasMode.SELECTION };
        await assertTriggerKey(options, Keys.Enter, ToggleMenuEvent.EVENT_NAME, false);
    });

    it('pressing the enter key on connector "+" should dispatch the toggleMenu event if we are NOT in selection mode', async () => {
        const options = { variant: MenuType.CONNECTOR };
        await assertTriggerKey(options, Keys.Enter, ToggleMenuEvent.EVENT_NAME, true);
    });

    it('should dispatch the CloseMenuEvent when pressing the escape key if menu is opened', async () => {
        await assertTriggerKey({ menuOpened: true }, Keys.Escape, CloseMenuEvent.EVENT_NAME, true);
    });

    it('should not dispatch the CloseMenuEvent when pressing the escape key if menu is not opened', async () => {
        await assertTriggerKey({ menuOpened: false }, Keys.Escape, CloseMenuEvent.EVENT_NAME, false);
    });

    it('should not dispatch the toggleMenu event if we are in selection mode', async () => {
        const options = { canvasMode: AutoLayoutCanvasMode.SELECTION };
        await assertTriggerClick(options, false);
    });

    describe('Focus Management', () => {
        it('Regular element should have tabindex equal to 0', async () => {
            const cmp = await createComponentUnderTest();
            const button = getButton(cmp);
            expect(button.tabIndex).toEqual(0);
        });

        it('End element should have tabindex equal to -1', async () => {
            const cmp = await createComponentUnderTest({ elementMetadata: endMetadata });
            const button = cmp.shadowRoot.querySelector(selectors.endElement);
            expect(button.tabIndex).toEqual(-1);
        });

        it('In Selection Mode regular element should have tabindex equal to -1', async () => {
            const cmp = await createComponentUnderTest({
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const button = getButton(cmp);
            expect(button.tabIndex).toEqual(-1);
        });

        it('In Selection Mode end element should have tabindex equal to -1', async () => {
            const cmp = await createComponentUnderTest({
                elementMetadata: endMetadata,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const button = cmp.shadowRoot.querySelector(selectors.endElement);
            expect(button.tabIndex).toEqual(-1);
        });

        it('Connector "+" should have tabindex equal to 0 in Base Mode', async () => {
            const cmp = await createComponentUnderTest({ variant: MenuType.CONNECTOR });
            const button = getButton(cmp);
            expect(button.tabIndex).toEqual(0);
        });

        it('Connector "+" should have tabindex equal to -1 in Selection Mode', async () => {
            const cmp = await createComponentUnderTest({
                variant: MenuType.CONNECTOR,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const button = getButton(cmp);
            expect(button.tabIndex).toEqual(-1);
        });

        it('Regular element should get focus on click in Base Mode', async () => {
            const options = {};
            await assertTriggerFocus(options, true);
        });

        it('Regular element should not get focus on click in Selection Mode', async () => {
            const options = {
                canvasMode: AutoLayoutCanvasMode.SELECTION
            };
            await assertTriggerFocus(options, false);
        });

        it('Regular element should still get focus in base mode on click when disableEditElements is true', async () => {
            const options = { disableEditElements: true };
            await assertTriggerFocus(options, true);
        });

        it('End element should not get focus on click in Base Mode', async () => {
            const options = { elementMetadata: endMetadata };
            await assertTriggerFocus(options, false);
        });

        it('End element should not get focus on click in Selection Mode', async () => {
            const options = {
                elementMetadata: endMetadata,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            };
            await assertTriggerFocus(options, false);
        });

        it('Connector "+" should get focus on click in Base Mode', async () => {
            const options = { variant: MenuType.CONNECTOR };
            await assertTriggerClick(options, true);
        });
    });
});
