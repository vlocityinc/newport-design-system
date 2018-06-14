import { createElement } from 'engine';
import  ScreenPropertyField  from '../screen-property-field';


const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-property-field', {
        is: ScreenPropertyField
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

const fieldName = 'field1';
const TEX_AREA_SELECTOR = 'lightning-textarea';
const INPUT_SELECTOR = 'lightning-input';
const RICH_TEXT = 'lightning-input-rich-text';

describe('screen-property-field', () => {
    it('long string renders text area field type', () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'long_string',
        });
        return Promise.resolve().then(() => {
            const elem = screenPropertyFieldElement.querySelector(TEX_AREA_SELECTOR);
            expect(elem).toBeDefined();
        });
    });
    it('rich string field renders rich input field type', () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'rich_string',
        });
        return Promise.resolve().then(() => {
            const elem = screenPropertyFieldElement.querySelector(RICH_TEXT);
            expect(elem).toBeDefined();
        });
    });
    it('number field renders input field type', () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'number',
        });
        return Promise.resolve().then(() => {
            const elem = screenPropertyFieldElement.querySelector(INPUT_SELECTOR);
            expect(elem).toBeDefined();
            expect(elem.type).toBe('number');
        });
    });
    it('boolean field renders input field type', () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'boolean',
        });
        return Promise.resolve().then(() => {
            const elem = screenPropertyFieldElement.querySelector(INPUT_SELECTOR);
            expect(elem).toBeDefined();
            expect(elem.type).toBe('checkbox');
        });
    });
    it('string field renders input field type', () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'string',
        });
        return Promise.resolve().then(() => {
            const elem = screenPropertyFieldElement.querySelector(INPUT_SELECTOR);
            expect(elem).toBeDefined();
            expect(elem.type).toBe('text');
        });
    });
    it('field with help string', () => {
        const helpValue = 'enter stuff';
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'string',
            helpText: helpValue
        });
        return Promise.resolve().then(() => {
            const elem = screenPropertyFieldElement.querySelector(INPUT_SELECTOR);
            expect(elem).toBeDefined();
            expect(elem.fieldLevelHelp).toBe(helpValue);
        });
    });
});
