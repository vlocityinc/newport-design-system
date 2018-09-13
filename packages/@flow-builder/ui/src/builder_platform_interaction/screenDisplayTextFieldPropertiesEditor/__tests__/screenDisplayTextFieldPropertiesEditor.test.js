import { createElement } from 'lwc';
import ScreenDisplayTextFieldPropertiesEditor from "../screenDisplayTextFieldPropertiesEditor";
import { query, createTestScreenField } from "builder_platform_interaction/builderTestUtils";
import { PropertyChangedEvent } from "builder_platform_interaction/events";

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});


const SELECTORS = {
    NAME_FIELD: 'builder_platform_interaction-screen-property-field[name="name"]',
    VALUE_FIELD: 'builder_platform_interaction-screen-property-field[name="fieldText"]'
};

const fieldName = 'display1';
const displayValue = 'Display This Please';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-display-text-field-properties-editor', {
        is: ScreenDisplayTextFieldPropertiesEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-display-text-field-properties-editor', () => {
    let screenDisplayTextFieldPropEditor;
    beforeEach(() => {
        screenDisplayTextFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'DisplayText', displayValue)
        });
    });
    it('Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenDisplayTextFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenDisplayTextFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Name field should be filled in with the display text field name', () => {
        return Promise.resolve().then(() => {
            const rederedNameField = query(screenDisplayTextFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(rederedNameField.value.value).toBe(fieldName);
        });
    });
    it('Value of display field is rendered in the input field', () => {
        return Promise.resolve().then(() => {
            const rederedValueField = query(screenDisplayTextFieldPropEditor, SELECTORS.VALUE_FIELD);
            expect(rederedValueField.value.value).toBe(displayValue);
        });
    });
    it('Property changed on name field', () => {
        return Promise.resolve().then(() => {
            const rederedNameField = query(screenDisplayTextFieldPropEditor, SELECTORS.NAME_FIELD);
            const callback = jest.fn();
            rederedNameField.addEventListener('propertychanged', callback);
            rederedNameField.dispatchEvent(new PropertyChangedEvent('name', 'new name'));
            expect(callback).toHaveBeenCalled();
        });
    });
    it('Property changed on display field', () => {
        return Promise.resolve().then(() => {
            const renderedValueField = query(screenDisplayTextFieldPropEditor, SELECTORS.VALUE_FIELD);
            const callback = jest.fn();
            renderedValueField.addEventListener('propertychanged', callback);
            renderedValueField.dispatchEvent(new PropertyChangedEvent('fieldText', 'changed display text'));
            expect(callback).toHaveBeenCalled();
        });
    });
});
