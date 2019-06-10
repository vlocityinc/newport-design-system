import { createElement } from 'lwc';
import ScreenInputField from 'builder_platform_interaction/screenInputField';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    CURRENCY_FORMAT,
    LIGHTNING_INPUT_TYPES,
    LIGHTNING_INPUT_VARIANTS
} from 'builder_platform_interaction/screenEditorUtils';

const SELECTORS = {
    INPUT: 'lightning-input'
};
const testLabel = 'input1';

jest.mock('builder_platform_interaction/systemLib', () => {
    const booleanTrue = '$GlobalConstant.True';
    const booleanFalse = '$GlobalConstant.False';
    return {
        GLOBAL_CONSTANTS: {
            BOOLEAN_TRUE: booleanTrue,
            BOOLEAN_FALSE: booleanFalse
        }
    };
});

function createComponentForTest(props) {
    const el = createElement(
        'builder_platform_interaction-screen-input-field',
        { is: ScreenInputField }
    );
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Currency screen field', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: { value: testLabel, error: null },
            required: false,
            typeName: 'Currency',
            helpText: { value: null, error: null }
        });
    });
    it('Type should be number', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.type).toEqual(LIGHTNING_INPUT_TYPES.NUMBER);
        });
    });
    it('Formatter should be set to currency', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.formatter).toEqual(CURRENCY_FORMAT);
        });
    });
    it('Label should be standard', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });
});

describe('Number screen field', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: { value: testLabel, error: null },
            required: false,
            typeName: 'Number',
            helpText: { value: null, error: null }
        });
    });
    it('Type should be number', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.type).toEqual(LIGHTNING_INPUT_TYPES.NUMBER);
        });
    });
    it('Formatter should be set to undefined', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.formatter).toBeUndefined();
        });
    });
    it('Label should be standard', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });
});

describe('Textbox screen field', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: { value: testLabel, error: null },
            required: false,
            typeName: 'TextBox',
            helpText: { value: null, error: null }
        });
    });
    it('Type should be null', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.type).toBeNull();
        });
    });
    it('Formatter should be set to undefined', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.formatter).toBeUndefined();
        });
    });
    it('Label should be standard', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });
});

describe('Checkbox field with global constant true for its default value', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '$GlobalConstant.True',
            label: { value: testLabel, error: null },
            required: false,
            typeName: 'Checkbox',
            helpText: { value: null, error: null }
        });
    });
    it('Checkbox should be checked', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.checked).toBeTruthy();
        });
    });
});

describe('Checkbox field with global constant false for its default value', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '$GlobalConstant.False',
            label: { value: testLabel, error: null },
            required: false,
            typeName: 'Checkbox',
            helpText: { value: null, error: null }
        });
    });
    it('Checkbox should not be checked', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.checked).toBeFalsy();
        });
    });
});

describe('Checkbox field with reference for its default value', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: 'MyVar1',
            label: { value: testLabel, error: null },
            required: false,
            typeName: 'Checkbox',
            helpText: { value: null, error: null }
        });
    });
    it('Checkbox should not be checked', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.checked).toBeFalsy();
        });
    });
});

describe('Screen input field with no label', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: { value: '', error: null },
            required: false,
            typeName: 'Number',
            helpText: { value: null, error: null }
        });
    });
    it('Label should be shown even when empty because we display a placeholder label', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.variant).toEqual(LIGHTNING_INPUT_VARIANTS.STANDARD);
        });
    });
    it('Label displayed should be a placeholder', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.label).toEqual(
                '[' + LABELS.fieldTypeLabelNumber + ']'
            );
        });
    });
});

describe('Screen input field with empty space only should not be displayed', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: { value: ' ', error: null },
            required: false,
            typeName: 'Number',
            helpText: { value: null, error: null }
        });
    });
    it('Label should be hidden when it is empty', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.variant).toEqual(
                LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN
            );
        });
    });
});

describe('DateTime screen input field', () => {
    let inputWrapperCmp;
    const dateTimeValue = '02/23/2001 12:20';
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: dateTimeValue,
            label: { value: testLabel, error: null },
            typeName: 'DateTime',
            helpText: { value: null, error: null }
        });
    });
    it('Lightning input type should be dateTime', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.type).toEqual(LIGHTNING_INPUT_TYPES.DATE_TIME);
        });
    });
    it('Value should be converted to ISO string format', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.value).toEqual(new Date(dateTimeValue).toISOString());
        });
    });
});

describe('DateTime screen input field with default value set to a reference', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '', // will come as empty string from screenField.js
            label: { value: testLabel, error: null },
            typeName: 'DateTime',
            helpText: { value: null, error: null }
        });
    });
    it('Value should display empty string because it is a merge field', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.value).toEqual('');
        });
    });
});

describe('Date screen input field', () => {
    let inputWrapperCmp;
    const dateValue = '02/23/2001';
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: dateValue,
            label: { value: testLabel, error: null },
            typeName: 'Date',
            helpText: { value: null, error: null }
        });
    });
    it('Lightning input type should be date', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.type).toEqual(LIGHTNING_INPUT_TYPES.DATE);
        });
    });
    it('Value should be converted to ISO string format', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.value).toEqual(new Date(dateValue).toISOString());
        });
    });
});

describe('Date screen input field with default value to set a reference', () => {
    let inputWrapperCmp;
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '', // will come as empty string from screenField.js
            label: { value: testLabel, error: null },
            typeName: 'Date',
            helpText: { value: null, error: null }
        });
    });
    it('Value should display empty string because it is a merge field', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.value).toEqual('');
        });
    });
});

describe('Field with help text', () => {
    let inputWrapperCmp;
    const helpTextValue = 'Enter your name';
    beforeEach(() => {
        inputWrapperCmp = createComponentForTest({
            value: '',
            label: { value: testLabel, error: null },
            helpText: { value: helpTextValue, error: null },
            typeName: 'TextBox'
        });
    });
    it('Help text should be passed through', () => {
        return Promise.resolve().then(() => {
            const input = inputWrapperCmp.shadowRoot.querySelector(
                SELECTORS.INPUT
            );
            expect(input.fieldLevelHelp).toEqual(helpTextValue);
        });
    });
});

describe('Invalid screen type', () => {
    it('Should throw error', () => {
        const componentCreation = () => {
            createComponentForTest({
                value: '',
                label: { value: testLabel, error: null },
                required: false,
                typeName: 'foo'
            });
        };
        expect(componentCreation).toThrow();
    });
});
