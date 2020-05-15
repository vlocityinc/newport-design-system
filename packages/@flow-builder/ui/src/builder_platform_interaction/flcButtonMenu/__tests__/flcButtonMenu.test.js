// @ts-nocheck
import { createElement } from 'lwc';
import FlcButtonMenu from 'builder_platform_interaction/flcButtonMenu';
import { blurEvent, focusEvent } from 'builder_platform_interaction/builderTestUtils';
import { ToggleMenuEvent } from 'builder_platform_interaction/events';

const createComponentUnderTest = (isNodeGettingDeleted = false, isSelectionMode = false) => {
    const el = createElement('builder_platform_interaction-flc-button-menu', {
        is: FlcButtonMenu
    });
    el.isNodeGettingDeleted = isNodeGettingDeleted;
    el.isSelectionMode = isSelectionMode;
    el.connectionInfo = {};
    document.body.appendChild(el);
    return el;
};

const selectors = {
    button: '.slds-button',
    toBeDeletedButton: '.slds-button.node-to-be-deleted'
};

describe('the button menu', () => {
    it('renders the component ', () => {
        const buttonMenu = createComponentUnderTest();
        expect(buttonMenu).toBeDefined();
    });

    it('Renders a button ', () => {
        const button = createComponentUnderTest().shadowRoot.querySelector(selectors.button);
        expect(button).toBeDefined();
    });

    it('should call send the blur event ', () => {
        const cmp = createComponentUnderTest();
        const button = cmp.shadowRoot.querySelector(selectors.button);
        const callback = jest.fn();
        cmp.addEventListener('blur', callback);
        button.dispatchEvent(blurEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('should add "node-to-be-deleted" class when isNodeGettingDeleted is true', () => {
        const cmp = createComponentUnderTest(true);
        const button = cmp.shadowRoot.querySelector(selectors.toBeDeletedButton);
        expect(button).not.toBeNull();
    });

    /* TODO: This test is flapping for some reason. Commenting it out until we can figure
    out why
    
    it('should dispatch the toggleMenu event if we are NOT in selection mode', () => {
        const cmp = createComponentUnderTest();
        const button = cmp.shadowRoot.querySelector(selectors.button);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.click();
        expect(callback).toHaveBeenCalled();
    });
    */

    it('should not dispatch the toggleMenu event if we are in selection mode', () => {
        const cmp = createComponentUnderTest(false, true);
        const button = cmp.shadowRoot.querySelector(selectors.button);
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.click();
        expect(callback).not.toHaveBeenCalled();
    });

    it('should send a focus event on focus', () => {
        const cmp = createComponentUnderTest();
        const button = cmp.shadowRoot.querySelector(selectors.button);
        const callback = jest.fn();
        cmp.addEventListener('focus', callback);
        button.dispatchEvent(focusEvent);
        expect(callback).toHaveBeenCalled();
    });
});
