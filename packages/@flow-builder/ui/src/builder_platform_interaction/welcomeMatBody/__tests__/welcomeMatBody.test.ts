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
    it('Clicking on footer button in Freeform Tile should fire createCallback with false as the last param', () => {
        const welcomeMatBody = createComponentUnderTest();
        const footer = welcomeMatBody.shadowRoot.querySelectorAll('footer')[0];
        footer.click();
        expect(createCallback).toHaveBeenCalled();
        expect(createCallback.mock.calls[0][2]).toBeFalsy();
    });

    it('Clicking on footer button in Freeform Tile should fire closeCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const footer = welcomeMatBody.shadowRoot.querySelectorAll('footer')[0];
        footer.click();
        expect(closeCallback).toHaveBeenCalled();
    });

    it('Clicking on footer button in Autolayout Tile should fire createCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const footer = welcomeMatBody.shadowRoot.querySelectorAll('footer')[1];
        footer.click();
        expect(createCallback).toHaveBeenCalled();
        expect(createCallback.mock.calls[0][2]).toBeTruthy();
    });

    it('Clicking on footer button in Autolayout Tile should fire closeCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const footer = welcomeMatBody.shadowRoot.querySelectorAll('footer')[1];
        footer.click();
        expect(closeCallback).toHaveBeenCalled();
    });
});
