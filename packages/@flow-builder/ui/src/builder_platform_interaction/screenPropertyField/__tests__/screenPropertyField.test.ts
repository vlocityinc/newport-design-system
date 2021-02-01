// @ts-nocheck
import { createElement } from 'lwc';
import ScreenPropertyField from '../screenPropertyField';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import FerovResourcePicker from 'builder_platform_interaction/ferovResourcePicker';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn((data) => Object.values(data.elements))
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/ruleLib');
    return {
        getRulesForElementType: jest
            .fn()
            .mockImplementation(() => [])
            .mockName('getRulesForElementType'),
        RULE_TYPES: actual.RULE_TYPES,
        PARAM_PROPERTY: actual.PARAM_PROPERTY
    };
});

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-property-field', {
        is: ScreenPropertyField
    });
    if (props) {
        Object.assign(el, props);
    }
    setDocumentBodyChildren(el);
    return el;
};

const FIELD_NAME = 'field1';
const SELECTORS = {
    TEXT_AREA_SELECTOR: 'builder_platform_interaction-resourced-textarea',
    INPUT_SELECTOR: 'lightning-input',
    RICH_TEXT: 'lightning-input-rich-text',
    RESOURCE_RICH_TEXT_EDITOR: 'builder_platform_interaction-resourced-rich-text-editor',
    RICH_TEXT_PLAIN_TEXT_SWITCH: 'builder_platform_interaction-rich-text-plain-text-switch'
};

describe('screen-property-field', () => {
    it('long string renders text area field type without rich text/ plain text switch', async () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: FIELD_NAME,
            type: 'long_string'
        });
        await ticks(1);
        const resourcedTextAreaComponent = screenPropertyFieldElement.shadowRoot.querySelector(
            SELECTORS.TEXT_AREA_SELECTOR
        );
        expect(resourcedTextAreaComponent).not.toBeNull();
        expect(resourcedTextAreaComponent.shadowRoot.querySelector(SELECTORS.RICH_TEXT_PLAIN_TEXT_SWITCH)).toBeNull();
    });
    it('rich string field renders rich input field type rich text/ plain text switch ', async () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: FIELD_NAME,
            type: 'rich_string'
        });
        await ticks(1);
        const richTextComponent = screenPropertyFieldElement.shadowRoot.querySelector(SELECTORS.RICH_TEXT);
        expect(richTextComponent).toBeDefined();
        const resourcedRichTextEditor = screenPropertyFieldElement.shadowRoot.querySelector(
            SELECTORS.RESOURCE_RICH_TEXT_EDITOR
        );
        expect(resourcedRichTextEditor.shadowRoot.querySelector(SELECTORS.RICH_TEXT_PLAIN_TEXT_SWITCH)).toBeNull();
    });
    it('number field renders input field type', async () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: FIELD_NAME,
            type: 'number'
        });
        await ticks(1);
        const elem = screenPropertyFieldElement.shadowRoot.querySelector(SELECTORS.INPUT_SELECTOR);
        expect(elem).toBeDefined();
        expect(elem.type).toBe('number');
    });
    it('boolean field renders input field type', async () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: FIELD_NAME,
            type: 'boolean'
        });
        await ticks(1);
        const elem = screenPropertyFieldElement.shadowRoot.querySelector(SELECTORS.INPUT_SELECTOR);
        expect(elem).toBeDefined();
        expect(elem.type).toBe('checkbox');
    });
    it('string field renders input field type', async () => {
        const screenPropertyFieldElement = createComponentUnderTest({
            name: FIELD_NAME,
            type: 'string'
        });
        await ticks(1);
        const elem = screenPropertyFieldElement.shadowRoot.querySelector(SELECTORS.INPUT_SELECTOR);
        expect(elem).toBeDefined();
        expect(elem.type).toBe('text');
    });
    it('field with help string', async () => {
        const helpValue = 'enter stuff';
        const screenPropertyFieldElement = createComponentUnderTest({
            name: FIELD_NAME,
            type: 'string',
            helpText: helpValue
        });
        await ticks(1);
        const elem = screenPropertyFieldElement.shadowRoot.querySelector(SELECTORS.INPUT_SELECTOR);
        expect(elem).toBeDefined();
        expect(elem.fieldLevelHelp).toBe(helpValue);
    });

    it('calls getRulesForElementType to fetch rules for resource picker', async () => {
        createComponentUnderTest({
            name: FIELD_NAME,
            type: 'string',
            allowResourcesForParameter: true,
            resourcePickerConfig: {}
        });
        await ticks(1);
        expect(getRulesForElementType).toHaveBeenCalledWith(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.SCREEN);
    });

    it('sets rules on resource picker', async () => {
        const mockRules = ['foo'];
        getRulesForElementType.mockReturnValueOnce(mockRules);
        const screenPropertyField = createComponentUnderTest({
            name: FIELD_NAME,
            type: 'string',
            allowResourcesForParameter: true,
            resourcePickerConfig: {}
        });
        await ticks(1);
        const picker = screenPropertyField.shadowRoot.querySelector(FerovResourcePicker.SELECTOR);
        expect(picker.rules).toEqual(mockRules);
    });
});
