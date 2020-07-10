import { createElement } from 'lwc';
import WelcomeMatBody from 'builder_platform_interaction/welcomeMatBody';

const createCallback = jest.fn();
const closeCallback = jest.fn();

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-welcome-mat-body', {
        is: WelcomeMatBody
    });

    el.createCallback = createCallback;
    el.closeCallback = closeCallback;

    document.body.appendChild(el);
    return el;
};

describe('Welcome Mat Body Actions', () => {
    it('Clicking on Freeform Visual Picker Tile should fire createCallback with false as the last param', () => {
        const welcomeMatBody = createComponentUnderTest();
        const tile = welcomeMatBody.shadowRoot.querySelectorAll('.slds-visual-picker')[0];
        tile.click();
        expect(createCallback).toHaveBeenCalled();
        expect(createCallback.mock.calls[0][2]).toBeFalsy();
    });

    it('Clicking on Freeform Visual Picker Tile should fire closeCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const tile = welcomeMatBody.shadowRoot.querySelectorAll('.slds-visual-picker')[0];
        tile.click();
        expect(closeCallback).toHaveBeenCalled();
    });

    it('Clicking on Autolayout Visual Picker Tile should fire createCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const tile = welcomeMatBody.shadowRoot.querySelectorAll('.slds-visual-picker')[1];
        tile.click();
        expect(createCallback).toHaveBeenCalled();
        expect(createCallback.mock.calls[0][2]).toBeTruthy();
    });

    it('Clicking on Autolayout Visual Picker Tile should fire closeCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const tile = welcomeMatBody.shadowRoot.querySelectorAll('.slds-visual-picker')[1];
        tile.click();
        expect(closeCallback).toHaveBeenCalled();
    });
});
