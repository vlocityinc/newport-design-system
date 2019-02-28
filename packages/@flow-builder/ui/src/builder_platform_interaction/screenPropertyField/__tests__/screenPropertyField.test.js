import { createElement } from 'lwc';
import ScreenPropertyField from "../screenPropertyField";
import { getShadowRoot } from 'lwc-test-utils';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import FerovResourcePicker from 'builder_platform_interaction/ferovResourcePicker';

jest.mock('builder_platform_interaction/outputResourcePicker', () => require('builder_platform_interaction_mocks/outputResourcePicker'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        getRulesForElementType: jest.fn().mockImplementation(() => []).mockName('getRulesForElementType'),
        RULE_TYPES: actual.RULE_TYPES,
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
    };
});

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
const TEXT_AREA_SELECTOR = 'builder_platform_interaction-resourced-textarea';
const INPUT_SELECTOR = 'lightning-input';
const RICH_TEXT = 'lightning-input-rich-text';

describe('screen-property-field', () => {
    it('long string renders text area field type', () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'long_string',
        });
        return Promise.resolve().then(() => {
            const elem = getShadowRoot(screenPropertyFieldElement).querySelector(TEXT_AREA_SELECTOR);
            expect(elem).toBeDefined();
        });
    });
    it('rich string field renders rich input field type', () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'rich_string',
        });
        return Promise.resolve().then(() => {
            const elem = getShadowRoot(screenPropertyFieldElement).querySelector(RICH_TEXT);
            expect(elem).toBeDefined();
        });
    });
    it('number field renders input field type', () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: fieldName,
            type: 'number',
        });
        return Promise.resolve().then(() => {
            const elem = getShadowRoot(screenPropertyFieldElement).querySelector(INPUT_SELECTOR);
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
            const elem = getShadowRoot(screenPropertyFieldElement).querySelector(INPUT_SELECTOR);
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
            const elem = getShadowRoot(screenPropertyFieldElement).querySelector(INPUT_SELECTOR);
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
            const elem = getShadowRoot(screenPropertyFieldElement).querySelector(INPUT_SELECTOR);
            expect(elem).toBeDefined();
            expect(elem.fieldLevelHelp).toBe(helpValue);
        });
    });

    it('calls getRulesForElementType to fetch rules for resource picker', () => {
        createComponentUnderTest({
            name: fieldName,
            type: 'string',
            allowResourcesForParameter: true,
            resourcePickerConfig: {}
        });
        return Promise.resolve().then(() => {
            expect(getRulesForElementType).toHaveBeenCalledWith(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.SCREEN);
        });
    });

    it('sets rules on resource picker', () => {
        const mockRules = ['foo'];
        getRulesForElementType.mockReturnValueOnce(mockRules);
        const screenPropertyField = createComponentUnderTest({
            name: fieldName,
            type: 'string',
            allowResourcesForParameter: true,
            resourcePickerConfig: {}
        });
        return Promise.resolve().then(() => {
            const picker = getShadowRoot(screenPropertyField).querySelector(FerovResourcePicker.SELECTOR);
            expect(picker.rules).toEqual(mockRules);
        });
    });
});
