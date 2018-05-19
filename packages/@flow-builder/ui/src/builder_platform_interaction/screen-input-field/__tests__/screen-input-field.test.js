import { createElement } from 'engine';
import ScreenInputField from 'builder_platform_interaction-screen-input-field';
import {
    hiddenLabel,
    standardLabel
} from 'builder_platform_interaction-screen-editor-utils';


function createComponentForTest(props) {
    const el = createElement('screen-input-wrapper', { is: ScreenInputField });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Currency screen field', () => {
    let inputWrapperCmp;
    beforeAll(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: 'input1',
            required: false,
            typeName: 'Currency'
        });
    });
    it('Type should be number', () => {
        expect(inputWrapperCmp.type).toEqual('number');
    });
    it('Formatter should be set to currency', () => {
        expect(inputWrapperCmp.formatter).toEqual('currency');
    });
    it('Label should be standard', () => {
        expect(inputWrapperCmp.variant).toEqual(standardLabel);
    });
});

describe('Number screen field', () => {
    let inputWrapperCmp;
    beforeAll(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: 'input1',
            required: false,
            typeName: 'Number'
        });
    });
    it('Type should be number', () => {
        expect(inputWrapperCmp.type).toEqual('number');
    });
    it('Formatter should be set to undefined', () => {
        expect(inputWrapperCmp.formatter).toBeUndefined();
    });
    it('Label should be standard', () => {
        expect(inputWrapperCmp.variant).toEqual(standardLabel);
    });
});

describe('Textbox screen field', () => {
    let inputWrapperCmp;
    beforeAll(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: 'input1',
            required: false,
            typeName: 'TextBox'
        });
    });
    it('Type should be null', () => {
        expect(inputWrapperCmp.type).toBeNull();
    });
    it('Formatter should be set to undefined', () => {
        expect(inputWrapperCmp.formatter).toBeUndefined();
    });
    it('Label should be standard', () => {
        expect(inputWrapperCmp.variant).toEqual(standardLabel);
    });
});

describe('Screen input field with no label', () => {
    let inputWrapperCmp;
    beforeAll(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: '',
            required: false,
            typeName: 'Number'
        });
    });
    it('Label should be hidden when it is empty', () => {
        expect(inputWrapperCmp.variant).toEqual(hiddenLabel);
    });
});

describe('Invalid screen type', () => {
    it('Should throw error', () => {
        const componentCreation = () => {
            createComponentForTest({
                value: '',
                label: 'input1',
                required: false,
                typeName: 'foo'
            });
        };
        expect(componentCreation).toThrow();
    });
});

