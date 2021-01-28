// @ts-nocheck
import { createElement } from 'lwc';
import ScreenChoiceFieldPropertiesEditor from '../screenChoiceFieldPropertiesEditor';
import {
    query,
    createTestScreenField,
    SCREEN_NO_DEF_VALUE,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { PropertyChangedEvent, ScreenEditorEventName } from 'builder_platform_interaction/events';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
const mockEvent = new Event('test');
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn((data) => Object.values(data.elements))
    };
});

jest.mock('builder_platform_interaction/screenEditorCommonUtils', () => {
    return {
        addCurrentValueToEvent: jest.fn(() => mockEvent)
    };
});

jest.mock('builder_platform_interaction/screenComponentVisibilitySection', () =>
    require('builder_platform_interaction_mocks/screenComponentVisibilitySection')
);

jest.mock('builder_platform_interaction/storeUtils', () => {
    const { ELEMENT_TYPE } = require('builder_platform_interaction/flowMetadata');
    return {
        getElementByGuid(guid) {
            let elementType;
            if (guid.includes('RCS')) {
                elementType = ELEMENT_TYPE.RECORD_CHOICE_SET;
            } else if (guid.includes('PICKLIST')) {
                elementType = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
            } else {
                elementType = ELEMENT_TYPE.CHOICE;
            }
            return {
                name: guid,
                choiceText: 'choice text ' + guid,
                guid,
                elementType
            };
        }
    };
});

const SELECTORS = {
    NAME_AND_LABEL_FIELD: 'builder_platform_interaction-label-description',
    REQUIRED_CHECKBOX: 'builder_platform_interaction-screen-property-field[name="isRequired"]',
    DATA_TYPE: 'builder_platform_interaction-data-type-picker',
    DEFAULT_VALUE: 'builder_platform_interaction-screen-property-field[name="defaultValue"]',
    CHOICE_SELECTOR: 'builder_platform_interaction-screen-property-field[name="choice"]',
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]',
    COMPONENT_VISIBILITY: 'builder_platform_interaction-screen-component-visibility-section',
    SCALE: 'builder_platform_interaction-screen-property-field.scale',
    DISPLAY_RADIO_GROUP: 'lightning-radio-group.test-display-radio-group',
    DISPLAY_TYPE_COMBOBOX: 'builder_platform_interaction-screen-property-field.test-display-combobox'
};

const fieldName = 'field1';
const field = createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
    dataType: 'String',
    validation: false,
    helpText: false
});

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-choice-field-properties-editor', {
        is: ScreenChoiceFieldPropertiesEditor
    });

    Object.assign(
        el,
        props || {
            field
        }
    );

    document.body.appendChild(el);

    return el;
};

describe('screen-choice-field-properties-editor for radio field, type String', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                dataType: 'String',
                validation: false,
                helpText: false
            })
        });
    });
    it('Should not have scale input ', async () => {
        await ticks(1);
        const scale = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.SCALE);

        expect(scale).toBeFalsy();
    });
    it('API Name field should be filled in', async () => {
        await ticks(1);
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.devName.value).toBe(fieldName);
    });
    it('Label field should be filled in', async () => {
        await ticks(1);
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField).toBeDefined();
        expect(nameAndLabelField.label.value).toBe(fieldName);
    });
    it('Default value field is not present', async () => {
        await ticks(1);
        const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(renderedDefaultValueField).toBeNull();
    });
    it('Required checkbox is present and not checked', async () => {
        await ticks(1);
        const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
        expect(renderedRequiredCheckbox).toBeDefined();
        expect(renderedRequiredCheckbox.value).toBeFalsy();
    });
    it('Datatype drop down is set to required', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.required).toBeTruthy();
    });
    it('Datatype drop down and set', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.value).toBeDefined();
        expect(dataTypeDropDown.value.dataType).toBe('TextBox');
    });
    it('Help text is present and filled in', async () => {
        await ticks(1);
        const helpTextField = query(screenChoiceFieldPropEditor, SELECTORS.HELP_TEXT);
        expect(helpTextField).toBeDefined();
        expect(helpTextField.value.value).toBe('Screen field field1 help text');
    });
});

describe('screen-choice-field-properties-editor for multi-select picklist', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.MultiSelectPicklist, SCREEN_NO_DEF_VALUE, {
                validation: false,
                helpText: false
            })
        });
    });
    it('Should not have scale input ', async () => {
        await ticks(1);
        const scale = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.SCALE);

        expect(scale).toBeFalsy();
    });
    it('API Name field should be filled in', async () => {
        await ticks(1);
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.devName.value).toBe(fieldName);
    });
    it('Label field should be filled in', async () => {
        await ticks(1);
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField).toBeDefined();
        expect(nameAndLabelField.label.value).toBe(fieldName);
    });
    it('Default value field is not present', async () => {
        await ticks(1);
        const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(renderedDefaultValueField).toBeNull();
    });
    it('Required checkbox is present and not checked', async () => {
        await ticks(1);
        const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
        expect(renderedRequiredCheckbox).toBeDefined();
        expect(renderedRequiredCheckbox.value).toBeFalsy();
    });
    it('Datatype drop down is set to not required', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.required).toBeFalsy();
    });
    it('Datatype drop down is set to Text', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.value).toBeDefined();
        expect(dataTypeDropDown.value.dataType).toBe('TextBox');
    });
    it('Datatype drop down is disabled', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.typeAndCollectionDisabled).toBeTruthy();
    });
    it('Help text is present and filled in', async () => {
        await ticks(1);
        const helpTextField = query(screenChoiceFieldPropEditor, SELECTORS.HELP_TEXT);
        expect(helpTextField).toBeDefined();
        expect(helpTextField.value.value).toBe('Screen field field1 help text');
    });
});

describe('screen-choice-field-properties-editor for multi-select checkboxes, type Number', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.MultiSelectCheckboxes, SCREEN_NO_DEF_VALUE, {
                dataType: 'Number',
                validation: false,
                helpText: false,
                scale: 1
            })
        });
    });
    it('API Name field should be filled in', async () => {
        await ticks(1);
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.devName.value).toBe(fieldName);
    });
    it('Label field should be filled in', async () => {
        await ticks(1);
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField).toBeDefined();
        expect(nameAndLabelField.label.value).toBe(fieldName);
    });
    it('Default value field is not present', async () => {
        await ticks(1);
        const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(renderedDefaultValueField).toBeNull();
    });
    it('Required checkbox is present and not checked', async () => {
        await ticks(1);
        const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
        expect(renderedRequiredCheckbox).toBeDefined();
        expect(renderedRequiredCheckbox.value).toBeFalsy();
    });
    it('Datatype drop down is set to not required', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.required).toBeFalsy();
    });
    it('Datatype drop down and set', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.value).toBeDefined();
        expect(dataTypeDropDown.value.dataType).toBe('Number');
    });
    it('Help text is present and filled in', async () => {
        await ticks(1);
        const helpTextField = query(screenChoiceFieldPropEditor, SELECTORS.HELP_TEXT);
        expect(helpTextField).toBeDefined();
        expect(helpTextField.value.value).toBe('Screen field field1 help text');
    });
});

describe('screen-choice-field-properties-editor choice selectors', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                dataType: 'String',
                createChoices: true
            })
        });
    });
    it('Should not have scale input ', async () => {
        await ticks(1);
        const scale = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.SCALE);

        expect(scale).toBeFalsy();
    });
    it('Correct number of choice selectors are present', async () => {
        await ticks(1);
        const choiceSelectors = query(screenChoiceFieldPropEditor, SELECTORS.CHOICE_SELECTOR, true);
        expect(choiceSelectors).toBeDefined();
        expect(choiceSelectors).toHaveLength(3);
        expect(choiceSelectors[0].required).toBeTruthy();
        expect(choiceSelectors[0].value.value).toMatch('choice0');
        expect(choiceSelectors[1].value.value).toMatch('choice1');
        expect(choiceSelectors[2].value.value).toMatch('choice2');
    });
    it('Default choice drop down shows all choices associated with the field', async () => {
        await ticks(1);
        const defaultValueProp = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValueProp).toBeDefined();
        /*
        TODO: I need to replace the following with a ferovResourcePicker equivalent

        expect(defaultValueProp.listChoices).toBeDefined();
        expect(defaultValueProp.listChoices).toHaveLength(4);
        expect(defaultValueProp.listChoices[0].value).toMatch('');
        expect(defaultValueProp.listChoices[1].value).toMatch('choice0');
        expect(defaultValueProp.listChoices[2].value).toMatch('choice1');
        expect(defaultValueProp.listChoices[3].value).toMatch('choice2');
        */
    });
});

describe('DefaultValue options based on choice type', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
            dataType: 'String',
            createChoices: true
        });
        testField.choiceReferences[0] = {
            choiceReference: { value: 'choice-RCS', error: null }
        };
        testField.choiceReferences[1] = {
            choiceReference: { value: 'choice1', error: null }
        };
        testField.choiceReferences[2] = {
            choiceReference: { value: 'choice-PICKLIST', error: null }
        };
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('DefaultValue drop down does not include record or picklist choice sets', async () => {
        await ticks(1);
        const defaultValueProp = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValueProp).toBeDefined();
        /*
        TODO: I need to replace the following with a ferovResourcePicker equivalent

        expect(defaultValueProp.listChoices).toBeDefined();
        expect(defaultValueProp.listChoices).toHaveLength(2);
        expect(defaultValueProp.listChoices[0].value).toMatch('');
        expect(defaultValueProp.listChoices[1].value).toMatch('choice1');
        */
    });
    it('does not fire choice changed event when the choice does not change', async () => {
        const propChangedEvent = new PropertyChangedEvent(
            null,
            null,
            null,
            screenChoiceFieldPropEditor.field.choiceReferences[0].choiceReference.value,
            null,
            0,
            null
        );
        const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.CHOICE_SELECTOR);

        const choiceChangedSpy = jest.fn();
        window.addEventListener(ScreenEditorEventName.ChoiceChanged, choiceChangedSpy);
        renderedDefaultValueField.dispatchEvent(propChangedEvent);
        await ticks(1);
        window.removeEventListener(ScreenEditorEventName.ChoiceChanged, choiceChangedSpy);
        expect(choiceChangedSpy).not.toHaveBeenCalled();
    });
    it('fires a choice changed event when the choice error does change', async () => {
        const propChangedEvent = new PropertyChangedEvent(
            null,
            null,
            'some new error',
            screenChoiceFieldPropEditor.field.choiceReferences[0].choiceReference.value,
            null,
            0,
            null
        );
        const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.CHOICE_SELECTOR);

        const choiceChangedSpy = jest.fn();
        window.addEventListener(ScreenEditorEventName.ChoiceChanged, choiceChangedSpy);
        renderedDefaultValueField.dispatchEvent(propChangedEvent);
        await ticks(1);
        window.removeEventListener(ScreenEditorEventName.ChoiceChanged, choiceChangedSpy);
        expect(choiceChangedSpy).toHaveBeenCalled();
    });
});

describe('defaultValue combobox for choice based field', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        // Create a radio field with 3 choices, plus a placeholder, which indicates that
        // the user wants to add another choice, but hasn't set it yet.
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
            dataType: 'String',
            createChoices: true
        });
        testField.choiceReferences.push({
            choiceReference: { value: '', error: null }
        });
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('Default choice drop down shows only the configured choices', async () => {
        await ticks(1);
        const defaultValueProp = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValueProp).toBeDefined();
        /*
        TODO: I need to replace the following with a ferovResourcePicker equivalent

        expect(defaultValueProp.listChoices).toBeDefined();
        expect(defaultValueProp.listChoices).toHaveLength(4);
        expect(defaultValueProp.listChoices[0].value).toMatch('');
        expect(defaultValueProp.listChoices[1].value).toMatch('choice0');
        expect(defaultValueProp.listChoices[2].value).toMatch('choice1');
        expect(defaultValueProp.listChoices[3].value).toMatch('choice2');
        */
    });
});

describe('screen-choice-field-properties-editor defaultValue', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
            dataType: 'String',
            createChoices: true
        });
        testField.defaultValue = 'choice1';
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('When default value is set', async () => {
        await ticks(1);
        const defaultValue = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValue).toBeDefined();
        expect(defaultValue.value).toBeDefined();
        expect(defaultValue.value).toEqual('choice1');
        /*
        TODO: I need to replace the following with a ferovResourcePicker equivalent

        expect(defaultValue.listChoices).toHaveLength(4);
        */
    });
});

describe('screen-choice-field-properties-editor for field that is set to required', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
                required: true
            })
        });
    });
    it('Required checkbox is present and checked', async () => {
        await ticks(1);
        const requiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
        expect(requiredCheckbox).toBeDefined();
        expect(requiredCheckbox.value).toBeTruthy();
    });
});

describe('screen-choice-field-properties-editor with help text', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE)
        });
    });
    it('Help text is displayed', async () => {
        await ticks(1);
        const helpTextField = query(screenChoiceFieldPropEditor, SELECTORS.HELP_TEXT);
        expect(helpTextField).toBeDefined();
        expect(helpTextField.value.value).toBe('Screen field field1 help text');
    });
});

describe('screen-choice-field-properties-editor for existing field', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE)
        });
    });
    it('DataType drop down is disabled', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.typeAndCollectionDisabled).toBeTruthy();
    });
});

describe('screen-choice-field-properties-editor for new field', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE);
        testField.isNewField = true;
        testField.dataType = null;
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('DataType drop down is enabled', async () => {
        await ticks(1);
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.typeAndCollectionDisabled).toBeFalsy();
    });
});

describe('screen-choise-field-properties-editor component visibility', () => {
    let screenChoiseFieldPropEditor;
    beforeEach(() => {
        screenChoiseFieldPropEditor = createComponentUnderTest();
    });

    it('section is present', async () => {
        await ticks(1);
        const componentVisibilitySection = query(screenChoiseFieldPropEditor, SELECTORS.COMPONENT_VISIBILITY);
        expect(componentVisibilitySection).not.toBeNull();
    });
});
describe('scale input', () => {
    it('Scale field should be present with number field', async () => {
        const a = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {
                dataType: 'Number',
                validation: false,
                helpText: false
            })
        });
        await ticks(1);
        const renderedScaleField = query(a, SELECTORS.SCALE);
        expect(renderedScaleField).toBeTruthy();
    });
    it('should dispatch the correct event with number field ', async () => {
        const propChangedEvent = new PropertyChangedEvent(null, null, 'some new error', 2, null, 0, null);
        const a = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {
                dataType: 'Number',
                validation: false,
                helpText: false
            })
        });
        const renderedScaleField = query(a, SELECTORS.SCALE);
        renderedScaleField.dispatchEvent(propChangedEvent);
        const spy = addCurrentValueToEvent;
        await ticks(1);
        expect(spy).toHaveBeenCalled();
    });
    it('Scale field should not be present with string field and corresponding fn should not be dispatched', async () => {
        const a = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {
                dataType: 'String',
                validation: false,
                helpText: false
            })
        });
        await ticks(1);
        const spy = addCurrentValueToEvent;
        const renderedScaleField = query(a, SELECTORS.SCALE);
        expect(renderedScaleField).not.toBeTruthy();
        expect(spy).not.toHaveBeenCalled();
    });
});
describe('Screen choice visual display configuration', () => {
    it('For picklist screen field, single select and picklist should be selected in configuration', async () => {
        const screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.DropdownBox, SCREEN_NO_DEF_VALUE)
        });
        const displayRadioGroup = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_RADIO_GROUP);
        const displayTypeCombobox = screenChoiceFieldPropEditor.shadowRoot.querySelector(
            SELECTORS.DISPLAY_TYPE_COMBOBOX
        );
        expect(displayRadioGroup.value).toEqual('SingleSelect');
        expect(displayTypeCombobox.value).toEqual(FlowScreenFieldType.DropdownBox);
    });
    it('For radio buttons screen field, single select and radio buttons should be selected in configuration', () => {
        const screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE)
        });
        const displayRadioGroup = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_RADIO_GROUP);
        const displayTypeCombobox = screenChoiceFieldPropEditor.shadowRoot.querySelector(
            SELECTORS.DISPLAY_TYPE_COMBOBOX
        );
        expect(displayRadioGroup.value).toEqual('SingleSelect');
        expect(displayTypeCombobox.value).toEqual(FlowScreenFieldType.RadioButtons);
    });
    it('For Multi-Select Picklist screen field, multi select and multi-select picklist should be selected in configuration', () => {
        const screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.MultiSelectPicklist, SCREEN_NO_DEF_VALUE)
        });
        const displayRadioGroup = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_RADIO_GROUP);
        const displayTypeCombobox = screenChoiceFieldPropEditor.shadowRoot.querySelector(
            SELECTORS.DISPLAY_TYPE_COMBOBOX
        );
        expect(displayRadioGroup.value).toEqual('MultiSelect');
        expect(displayTypeCombobox.value).toEqual(FlowScreenFieldType.MultiSelectPicklist);
    });
    it('For Checkbox Group screen field, multi select and Checkbox Group should be selected in configuration', () => {
        const screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.MultiSelectCheckboxes, SCREEN_NO_DEF_VALUE)
        });
        const displayRadioGroup = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_RADIO_GROUP);
        const displayTypeCombobox = screenChoiceFieldPropEditor.shadowRoot.querySelector(
            SELECTORS.DISPLAY_TYPE_COMBOBOX
        );
        expect(displayRadioGroup.value).toEqual('MultiSelect');
        expect(displayTypeCombobox.value).toEqual(FlowScreenFieldType.MultiSelectCheckboxes);
    });
});
