import { createElement } from 'engine';
import ScreenTextareaField from 'builder_platform_interaction-screen-textarea-field';
import {
    hiddenLabelVariant,
    standardLabelVariant
} from 'builder_platform_interaction-screen-editor-utils';

const SELECTORS = {
    AREA: 'lightning-textarea'
};

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-textarea-field', { is: ScreenTextareaField });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Textarea display is required', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            label: 'display1',
            required: true
        });
    });
    it('Value should be undefined', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.querySelector(SELECTORS.AREA);
            expect(input.value).toBeUndefined();
        });
    });
    it('Required should be true', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.querySelector(SELECTORS.AREA);
            expect(input.required).toEqual(true);
        });
    });
    it('Label should be standard', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.querySelector(SELECTORS.AREA);
            expect(input.variant).toEqual(standardLabelVariant);
        });
    });
});

describe('Textarea field not required', () => {
    let inputWrapperCmp;
    const defaultValue = 'Default value here';
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            label: 'display1',
            required: false,
            value: defaultValue
        });
    });
    it('Value should be as specified', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.querySelector(SELECTORS.AREA);
            expect(input.value).toEqual(defaultValue);
        });
    });
    it('Required should be false', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.querySelector(SELECTORS.AREA);
            expect(input.required).toEqual(false);
        });
    });
    it('Label should be standard', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.querySelector(SELECTORS.AREA);
            expect(input.variant).toEqual(standardLabelVariant);
        });
    });
});

describe('Screen input field with no label', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: '',
            required: false
        });
    });
    it('Label should be hidden when it is empty', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.querySelector(SELECTORS.AREA);
            expect(input.variant).toEqual(hiddenLabelVariant);
        });
    });
});

describe('Screen input field with empty space only should not be displayed', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: ' ',
            required: false
        });
    });
    it('Label should be hidden when it is empty', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.querySelector(SELECTORS.AREA);
            expect(input.variant).toEqual(hiddenLabelVariant);
        });
    });
});

