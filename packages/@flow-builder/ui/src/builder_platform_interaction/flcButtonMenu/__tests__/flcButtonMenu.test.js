import { createElement } from 'lwc';
import FlcButtonMenu from 'builder_platform_interaction/flcButtonMenu';
import { ticks, blurEvent, focusEvent } from 'builder_platform_interaction/builderTestUtils';
import { ToggleMenuEvent } from 'builder_platform_interaction/events';

// button menu tests

const createComponentUnderTest = (isSelectionMode = false) => {
    const el = createElement('builder_platform_interaction-flc-button-menu', {
        is: FlcButtonMenu
    });
    el.isSelectionMode = isSelectionMode;
    el.connectionInfo = {};
    document.body.appendChild(el);
    return el;
};

describe('the node menu', () => {
    it('renders the component ', () => {
        const menu = createComponentUnderTest();
        expect(menu).toBeDefined();
    });
    it('Renders a button ', () => {
        const menu = createComponentUnderTest().shadowRoot.querySelector('.slds-button');
        expect(menu).toBeDefined();
    });
    it('should call send the blur event ', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const button = cmp.shadowRoot.querySelector('.slds-button');
        const callback = jest.fn();
        cmp.addEventListener('blur', callback);
        button.dispatchEvent(blurEvent);
        expect(callback).toHaveBeenCalled();
    });
    it('should dispatch the toggleMenu event if we are NOT in selection mode', async () => {
        const cmp = createComponentUnderTest(false);
        await ticks(1);
        const button = cmp.shadowRoot.querySelector('.slds-button');
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.click();
        expect(callback).toHaveBeenCalled();
    });
    it('should not dispatch the toggleMenu event if we are in selection mode', async () => {
        const cmp = createComponentUnderTest(true);
        await ticks(1);
        const button = cmp.shadowRoot.querySelector('.slds-button');
        const callback = jest.fn();
        cmp.addEventListener(ToggleMenuEvent.EVENT_NAME, callback);
        button.click();
        expect(callback).not.toHaveBeenCalled();
    });
    it('should send a focus event on focus', async () => {
        const cmp = createComponentUnderTest();
        await ticks(1);
        const button = cmp.shadowRoot.querySelector('.slds-button');
        const callback = jest.fn();
        cmp.addEventListener('focus', callback);
        button.dispatchEvent(focusEvent);
        expect(callback).toHaveBeenCalled();
    });
});
