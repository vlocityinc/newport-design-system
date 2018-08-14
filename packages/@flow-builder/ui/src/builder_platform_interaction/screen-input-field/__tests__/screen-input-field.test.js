import { createElement } from "lwc";
import ScreenInputField from 'builder_platform_interaction-screen-input-field';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

import {
    CURRENCY_FORMAT,
    LIGHTNING_INPUT_TYPES,
    LIGHTNING_INPUT_VARIANTS
} from 'builder_platform_interaction-screen-editor-utils';
import { getShadowRoot } from 'lwc-test-utils';

const SELECTORS = {
    INPUT : 'lightning-input'
};
const testLabel = 'input1';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-input-field', { is: ScreenInputField });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Currency screen field', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: {value: testLabel, error: null},
            required: false,
            typeName: 'Currency'
        });
    });
    it('Type should be number', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.type).toEqual(LIGHTNING_INPUT_TYPES.NUMBER);
        });
    });
    it('Formatter should be set to currency', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.formatter).toEqual(CURRENCY_FORMAT);
        });
    });
    it('Label should be standard', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });
});

describe('Number screen field', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: {value: testLabel, error: null},
            required: false,
            typeName: 'Number'
        });
    });
    it('Type should be number', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.type).toEqual(LIGHTNING_INPUT_TYPES.NUMBER);
        });
    });
    it('Formatter should be set to undefined', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.formatter).toBeUndefined();
        });
    });
    it('Label should be standard', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });
});

describe('Textbox screen field', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: {value: testLabel, error: null},
            required: false,
            typeName: 'TextBox'
        });
    });
    it('Type should be null', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.type).toBeNull();
        });
    });
    it('Formatter should be set to undefined', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.formatter).toBeUndefined();
        });
    });
    it('Label should be standard', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });
});

describe('Screen input field with no label', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: {value: '', error: null},
            required: false,
            typeName: 'Number'
        });
    });
    it('Label should be shown even when empty because we display a placeholder label', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });
    it('Label displayed should be a placeholder', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.label).toEqual('[' + LABELS.fieldTypeLabelNumber + ']');
        });
    });
});

describe('Screen input field with empty space only should not be displayed', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: {value: ' ', error: null},
            required: false,
            typeName: 'Number'
        });
    });
    it('Label should be hidden when it is empty', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN);
        });
    });
});

describe('DateTime screen input field', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: {value: testLabel, error: null},
            typeName: 'DateTime'
        });
    });
    it('Lightning input type should be number', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.type).toEqual(LIGHTNING_INPUT_TYPES.DATE_TIME);
        });
    });
});

describe('Field with help text', () => {
    let inputWrapperCmp;
    const helpTextValue = 'Enter your name';
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: {value: testLabel, error: null},
            helpText: {value: helpTextValue, error: null},
            typeName: 'TextBox'
        });
    });
    it('Help text should be passed through', () => {
        return Promise.resolve().then(() => {
            const input = getShadowRoot(inputWrapperCmp).querySelector(SELECTORS.INPUT);
            expect(input.fieldLevelHelp).toEqual(helpTextValue);
        });
    });
});

describe('Invalid screen type', () => {
    it('Should throw error', () => {
        const componentCreation = () => {
            createComponentForTest({
                value: '',
                label: {value: testLabel, error: null},
                required: false,
                typeName: 'foo'
            });
        };
        expect(componentCreation).toThrow();
    });
});