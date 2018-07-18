import { createElement } from 'engine';
import ScreenInputFieldPropertiesEditor from '../screen-input-field-properties-editor';
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from 'builder_platform_interaction-builder-test-utils';
import { PropertyChangedEvent, ComboboxStateChangedEvent } from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    NAME_FIELD: 'builder_platform_interaction-screen-property-field[name="name"]',
    LABEL_FIELD: 'builder_platform_interaction-combobox',
    SCALE_FIELD: 'builder_platform_interaction-screen-property-field[name="scale"]'
};

const fieldName = 'input1';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-input-field-properties-editor', {
        is: ScreenInputFieldPropertiesEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-input-field-properties-editor for TextBox', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Property changed on name field', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            const callback = jest.fn();
            renderedNameField.addEventListener('propertychanged', callback);
            renderedNameField.dispatchEvent(new PropertyChangedEvent('name', 'new name'));
            expect(callback).toHaveBeenCalled();
        });
    });
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Property changed on label field', () => {
        return Promise.resolve().then(() => {
            const renderedLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.LABEL_FIELD);
            const callback = jest.fn();
            renderedLabelField.addEventListener('comboboxstatechanged', callback);
            renderedLabelField.dispatchEvent(new ComboboxStateChangedEvent({ value: null, displayText: 'New Label' }));
            expect(callback).toHaveBeenCalled();
        });
    });
    // TODO: Things to be tested:
    // default value is displayed
});


describe('screen-input-field-properties-editor for Number', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Number', SCREEN_NO_DEF_VALUE),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Scale field should be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeDefined();
        });
    });

    // TODO: Things to be tested:
    // default value is displayed
});
