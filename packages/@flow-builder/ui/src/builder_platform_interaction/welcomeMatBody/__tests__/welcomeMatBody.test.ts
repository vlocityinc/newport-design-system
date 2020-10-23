import { createElement } from 'lwc';
import WelcomeMatBody from 'builder_platform_interaction/welcomeMatBody';

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    const commands = require('builder_platform_interaction/sharedUtils/commands');
    return Object.assign({}, sharedUtils, { commands });
});

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
        const input = welcomeMatBody.shadowRoot.querySelector('input[name="visual-picker-left"]');
        input.click();
        expect(createCallback).toHaveBeenCalled();
        expect(createCallback.mock.calls[0][2]).toBeFalsy();
    });

    it('Clicking on Freeform Visual Picker Tile should fire closeCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const input = welcomeMatBody.shadowRoot.querySelector('input[name="visual-picker-left"]');
        input.click();
        expect(closeCallback).toHaveBeenCalled();
    });

    it('Clicking on Autolayout Visual Picker Tile should fire createCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const input = welcomeMatBody.shadowRoot.querySelector('input[name="visual-picker-right"]');
        input.click();
        expect(createCallback).toHaveBeenCalled();
        expect(createCallback.mock.calls[0][2]).toBeTruthy();
    });

    it('Clicking on Autolayout Visual Picker Tile should fire closeCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const input = welcomeMatBody.shadowRoot.querySelector('input[name="visual-picker-right"]');
        input.click();
        expect(closeCallback).toHaveBeenCalled();
    });

    it('Pressing Enter key when focus is on Freeform Canvas tile should fire createCallback with false as the last param', () => {
        const welcomeMatBody = createComponentUnderTest();
        const input = welcomeMatBody.shadowRoot.querySelector('input[name="visual-picker-left"]');
        input.focus();
        welcomeMatBody.keyboardInteractions.execute('entercommand');
        expect(createCallback).toHaveBeenCalled();
        expect(createCallback.mock.calls[0][2]).toBeFalsy();
    });

    it('Pressing Enter key when focus is on Freeform Canvas tile should fire closeCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const input = welcomeMatBody.shadowRoot.querySelector('input[name="visual-picker-left"]');
        input.focus();
        welcomeMatBody.keyboardInteractions.execute('entercommand');
        expect(closeCallback).toHaveBeenCalled();
    });

    it('Pressing Enter key when focus is on Autolayout Canvas tile should fire createCallback with true as the last param', () => {
        const welcomeMatBody = createComponentUnderTest();
        const input = welcomeMatBody.shadowRoot.querySelector('input[name="visual-picker-right"]');
        input.focus();
        welcomeMatBody.keyboardInteractions.execute('entercommand');
        expect(createCallback).toHaveBeenCalled();
        expect(createCallback.mock.calls[0][2]).toBeTruthy();
    });

    it('Pressing Enter key when focus is on Autolayout Canvas tile should fire closeCallback', () => {
        const welcomeMatBody = createComponentUnderTest();
        const input = welcomeMatBody.shadowRoot.querySelector('input[name="visual-picker-right"]');
        input.focus();
        welcomeMatBody.keyboardInteractions.execute('entercommand');
        expect(closeCallback).toHaveBeenCalled();
    });
});
