// @ts-nocheck
import { createElement } from 'lwc';
import ScreenChoiceFieldPropertiesEditor, {
    ChoiceDisplayOptions,
    DISPLAY_TYPE_COMBOBOX_SELECTOR
} from '../screenChoiceFieldPropertiesEditor';
import {
    query,
    createTestScreenField,
    SCREEN_NO_DEF_VALUE,
    ticks,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { PropertyChangedEvent, ScreenEditorEventName } from 'builder_platform_interaction/events';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import * as usebyMock from 'builder_platform_interaction/usedByLib';
import { invokeModal } from 'builder_platform_interaction/builderUtils';

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
            let picklistField;
            if (guid.includes('RCS')) {
                elementType = ELEMENT_TYPE.RECORD_CHOICE_SET;
            } else if (guid.includes('PICKLIST')) {
                elementType = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
                picklistField = 'val1';
                elementType = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
            } else if (guid.includes('altPCS')) {
                elementType = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
                picklistField = 'val2';
                elementType = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
            } else {
                elementType = ELEMENT_TYPE.CHOICE;
            }
            return {
                name: guid,
                choiceText: 'choice text ' + guid,
                guid,
                elementType,
                picklistField
            };
        }
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity(entity) {
            return new Promise((resolve, reject) => {
                resolve(entity);
                reject(entity);
            });
        },
        getEntityFieldWithApiName(entity, field) {
            return {
                activePicklistValues: [field]
            };
        }
    };
});

jest.mock('builder_platform_interaction/usedByLib', () => {
    return {
        usedBy: jest.fn()
    };
});

jest.mock('builder_platform_interaction/builderUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/builderUtils');
    return Object.assign({}, actual, {
        invokeModal: jest.fn()
    });
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
    DISPLAY_TYPE_COMBOBOX: DISPLAY_TYPE_COMBOBOX_SELECTOR
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

    setDocumentBodyChildren(el);

    return el;
};

const getDisplayTypeCombobox = (screenChoiceFieldPropEditor) => {
    return screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_TYPE_COMBOBOX);
};

const getVisualDisplayRadioGroup = (screenChoiceFieldPropEditor) => {
    return screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_RADIO_GROUP);
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
    it('Should not have scale input ', () => {
        const scale = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.SCALE);

        expect(scale).toBeFalsy();
    });
    it('API Name field should be filled in', () => {
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.devName.value).toBe(fieldName);
    });
    it('Label field should be filled in', () => {
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField).toBeDefined();
        expect(nameAndLabelField.label.value).toBe(fieldName);
    });
    it('Default value field is not present', () => {
        const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(renderedDefaultValueField).toBeNull();
    });
    it('Required checkbox is present and not checked', () => {
        const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
        expect(renderedRequiredCheckbox).toBeDefined();
        expect(renderedRequiredCheckbox.value).toBeFalsy();
    });
    it('Datatype drop down is set to required', () => {
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.required).toBeTruthy();
    });
    it('Datatype drop down and set', () => {
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.value).toBeDefined();
        expect(dataTypeDropDown.value.dataType).toBe('TextBox');
    });
    it('Help text is present and filled in', () => {
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
    it('Should not have scale input ', () => {
        const scale = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.SCALE);

        expect(scale).toBeFalsy();
    });
    it('API Name field should be filled in', () => {
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.devName.value).toBe(fieldName);
    });
    it('Label field should be filled in', () => {
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField).toBeDefined();
        expect(nameAndLabelField.label.value).toBe(fieldName);
    });
    it('Default value field is not present', () => {
        const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(renderedDefaultValueField).toBeNull();
    });
    it('Required checkbox is present and not checked', () => {
        const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
        expect(renderedRequiredCheckbox).toBeDefined();
        expect(renderedRequiredCheckbox.value).toBeFalsy();
    });
    it('Datatype drop down is set to not required', () => {
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.required).toBeFalsy();
    });
    it('Datatype drop down is set to Text', () => {
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.value).toBeDefined();
        expect(dataTypeDropDown.value.dataType).toBe('TextBox');
    });
    it('Datatype drop down is disabled', () => {
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.typeAndCollectionDisabled).toBeTruthy();
    });
    it('Help text is present and filled in', () => {
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
    it('API Name field should be filled in', () => {
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField.devName.value).toBe(fieldName);
    });
    it('Label field should be filled in', () => {
        const nameAndLabelField = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
        expect(nameAndLabelField).toBeDefined();
        expect(nameAndLabelField.label.value).toBe(fieldName);
    });
    it('Default value field is not present', () => {
        const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(renderedDefaultValueField).toBeNull();
    });
    it('Required checkbox is present and not checked', () => {
        const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
        expect(renderedRequiredCheckbox).toBeDefined();
        expect(renderedRequiredCheckbox.value).toBeFalsy();
    });
    it('Datatype drop down is set to not required', () => {
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.required).toBeFalsy();
    });
    it('Datatype drop down and set', () => {
        const dataTypeDropDown = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE);
        expect(dataTypeDropDown).toBeDefined();
        expect(dataTypeDropDown.value).toBeDefined();
        expect(dataTypeDropDown.value.dataType).toBe('Number');
    });
    it('Help text is present and filled in', () => {
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
    it('Should not have scale input ', () => {
        const scale = screenChoiceFieldPropEditor.shadowRoot.querySelector(SELECTORS.SCALE);

        expect(scale).toBeFalsy();
    });
    it('Correct number of choice selectors are present', () => {
        const choiceSelectors = query(screenChoiceFieldPropEditor, SELECTORS.CHOICE_SELECTOR, true);
        expect(choiceSelectors).toBeDefined();
        expect(choiceSelectors).toHaveLength(3);
        expect(choiceSelectors[0].required).toBeTruthy();
        expect(choiceSelectors[0].value.value).toMatch('choice0');
        expect(choiceSelectors[1].value.value).toMatch('choice1');
        expect(choiceSelectors[2].value.value).toMatch('choice2');
    });
    it('Does not fire choice changed event when the choice has not changed', async () => {
        const propChangedEvent = new PropertyChangedEvent(
            null,
            null,
            null,
            screenChoiceFieldPropEditor.field.choiceReferences[0].choiceReference.value,
            null,
            0,
            null
        );
        const renderedChoiceSelector = query(screenChoiceFieldPropEditor, SELECTORS.CHOICE_SELECTOR);

        const choiceChangedSpy = jest.fn();
        window.addEventListener(ScreenEditorEventName.ChoiceChanged, choiceChangedSpy);
        renderedChoiceSelector.dispatchEvent(propChangedEvent);
        await ticks(1);
        window.removeEventListener(ScreenEditorEventName.ChoiceChanged, choiceChangedSpy);
        expect(choiceChangedSpy).not.toHaveBeenCalled();
    });
    it('Fires a choice changed event when the error on a choice has changed', async () => {
        const propChangedEvent = new PropertyChangedEvent(
            null,
            null,
            'some new error',
            screenChoiceFieldPropEditor.field.choiceReferences[0].choiceReference.value,
            null,
            0,
            null
        );
        const renderedChoiceSelector = query(screenChoiceFieldPropEditor, SELECTORS.CHOICE_SELECTOR);

        const choiceChangedSpy = jest.fn();
        window.addEventListener(ScreenEditorEventName.ChoiceChanged, choiceChangedSpy);
        renderedChoiceSelector.dispatchEvent(propChangedEvent);
        await ticks(1);
        window.removeEventListener(ScreenEditorEventName.ChoiceChanged, choiceChangedSpy);
        expect(choiceChangedSpy).toHaveBeenCalled();
    });
});

describe('Default value for choice based field with static choices only', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        // Create a radio field with 3 choices, plus a placeholder, which indicates that
        // the user wants to add another choice, but hasn't set it yet.
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
            dataType: FLOW_DATA_TYPE.STRING.value,
            createChoices: true
        });
        testField.choiceReferences.push({
            choiceReference: { value: '', error: null }
        });
        testField.defaultValue = 'choice1';
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('Default value is set to the string literal value specified in the screen field data', () => {
        const defaultValue = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValue).toBeDefined();
        expect(defaultValue.value).toBeDefined();
        expect(defaultValue.value).toEqual('choice1');
    });
    it('Default value ferov resource picker shows all static choices associated with the field', () => {
        const defaultValueProp = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValueProp).toBeDefined();
        const ferovResourcePicker = query(defaultValueProp, INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER);
        expect(ferovResourcePicker.elementConfig.choices).toBeTruthy();
        expect(ferovResourcePicker.elementConfig.staticChoiceGuids).toHaveLength(3);
        expect(ferovResourcePicker.elementConfig.staticChoiceGuids[0]).toMatch('choice0');
        expect(ferovResourcePicker.elementConfig.staticChoiceGuids[1]).toMatch('choice1');
        expect(ferovResourcePicker.elementConfig.staticChoiceGuids[2]).toMatch('choice2');
    });
});

describe('Default value for choice based field with a dynamic choice set', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
            dataType: FLOW_DATA_TYPE.NUMBER.value,
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
        testField.defaultValue = 123;
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('Default value is set to the number literal value specified in the screen field data', () => {
        const defaultValue = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValue).toBeDefined();
        expect(defaultValue.value).toBeDefined();
        expect(defaultValue.value).toEqual(123);
    });
    it('Default value ferov resource picker shows all data type compatible resources', () => {
        const defaultValueProp = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValueProp).toBeDefined();
        const ferovResourcePicker = query(defaultValueProp, INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER);
        expect(ferovResourcePicker.comboboxConfig.type).toEqual(FLOW_DATA_TYPE.NUMBER.value);
        expect(ferovResourcePicker.comboboxConfig.literalsAllowed).toBeTruthy();
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
    it('Required checkbox is present and checked', () => {
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
    it('Help text is displayed', () => {
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
    it('DataType drop down is disabled', () => {
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
    it('DataType drop down is enabled', () => {
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

    it('section is present', () => {
        const componentVisibilitySection = query(screenChoiseFieldPropEditor, SELECTORS.COMPONENT_VISIBILITY);
        expect(componentVisibilitySection).not.toBeNull();
    });
});
describe('scale input', () => {
    it('Scale field should be present with number field', () => {
        const a = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {
                dataType: 'Number',
                validation: false,
                helpText: false
            })
        });
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
    it('Scale field should not be present with string field and corresponding fn should not be dispatched', () => {
        const a = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {
                dataType: 'String',
                validation: false,
                helpText: false
            })
        });
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
        expect(getVisualDisplayRadioGroup(screenChoiceFieldPropEditor).value).toEqual(
            ChoiceDisplayOptions.SINGLE_SELECT
        );
        expect(getDisplayTypeCombobox(screenChoiceFieldPropEditor).value).toEqual(FlowScreenFieldType.DropdownBox);
    });
    it('For radio buttons screen field, single select and radio buttons should be selected in configuration', () => {
        const screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE)
        });
        expect(getVisualDisplayRadioGroup(screenChoiceFieldPropEditor).value).toEqual(
            ChoiceDisplayOptions.SINGLE_SELECT
        );
        expect(getDisplayTypeCombobox(screenChoiceFieldPropEditor).value).toEqual(FlowScreenFieldType.RadioButtons);
    });
    it('For Multi-Select Picklist screen field, multi select and multi-select picklist should be selected in configuration', () => {
        const screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.MultiSelectPicklist, SCREEN_NO_DEF_VALUE)
        });
        expect(getVisualDisplayRadioGroup(screenChoiceFieldPropEditor).value).toEqual(
            ChoiceDisplayOptions.MULTI_SELECT
        );
        expect(getDisplayTypeCombobox(screenChoiceFieldPropEditor).value).toEqual(
            FlowScreenFieldType.MultiSelectPicklist
        );
    });
    it('For Checkbox Group screen field, multi select and Checkbox Group should be selected in configuration', () => {
        const screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.MultiSelectCheckboxes, SCREEN_NO_DEF_VALUE)
        });
        expect(getVisualDisplayRadioGroup(screenChoiceFieldPropEditor).value).toEqual(
            ChoiceDisplayOptions.MULTI_SELECT
        );
        expect(getDisplayTypeCombobox(screenChoiceFieldPropEditor).value).toEqual(
            FlowScreenFieldType.MultiSelectCheckboxes
        );
    });
});
describe('Switching visual display type', () => {
    it('Changing visual display dispatches a Choice Display Changed event', () => {
        const screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, FlowScreenFieldType.DropdownBox, SCREEN_NO_DEF_VALUE)
        });
        const choiceDisplayChangedCallback = jest.fn();

        screenChoiceFieldPropEditor.addEventListener(
            ScreenEditorEventName.ChoiceDisplayChanged,
            choiceDisplayChangedCallback
        );
        const event = new PropertyChangedEvent(
            'choiceDisplayType',
            FlowScreenFieldType.RadioButtons,
            null,
            null,
            FlowScreenFieldType.DropdownBox
        );
        getDisplayTypeCombobox(screenChoiceFieldPropEditor).dispatchEvent(event);
        expect(choiceDisplayChangedCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    screenElement: screenChoiceFieldPropEditor.field,
                    newDisplayType: FlowScreenFieldType.RadioButtons
                }
            })
        );
    });
});
describe('screen-choise-field-properties-editor expanded picklist values', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.DropdownBox, SCREEN_NO_DEF_VALUE, {});
        testField.choiceReferences[0] = {
            choiceReference: { value: 'choice-PICKLIST', error: null }
        };
        testField.choiceReferences[1] = {
            choiceReference: { value: 'choice-altPCS', error: null }
        };
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('shows expanded picklist choices in default field for first picklist', () => {
        const defaultValDropDown = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_VALUE);
        expect(defaultValDropDown.activePicklistValues).toEqual(['val1']);
    });
});
describe('screen-choice-field-properties-editor for single select, type Number', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.DropdownBox, SCREEN_NO_DEF_VALUE, {
            dataType: FLOW_DATA_TYPE.NUMBER.value
        });
        testField.choiceReferences[0] = {
            choiceReference: { value: 'choice-1', error: null }
        };
        testField.choiceReferences[1] = {
            choiceReference: { value: 'choice-2', error: null }
        };
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    describe('switching type of choice', () => {
        it('Should display a popup warning if field is used by another element', async () => {
            usebyMock.usedBy.mockReturnValueOnce(['parentGuid', 'someGuid']);
            const visualDisplayTypeCombobox = getDisplayTypeCombobox(screenChoiceFieldPropEditor);
            visualDisplayTypeCombobox.dispatchEvent(
                new PropertyChangedEvent('choiceDisplayType', FlowScreenFieldType.MultiSelectPicklist, null, null, null)
            );
            await ticks(1);
            expect(invokeModal).toBeCalledWith(
                expect.objectContaining({
                    bodyData: {
                        bodyTextOne: 'FlowBuilderScreenEditor.choiceDisplayTypeWarningBody'
                    },
                    footerData: {
                        buttonOne: {
                            buttonLabel: 'FlowBuilderAlertModal.okayButtonLabel'
                        }
                    },
                    headerData: {
                        headerTitle: 'FlowBuilderScreenEditor.choiceDisplayTypeWarningHeader'
                    }
                })
            );
        });
        it('Should NOT display a popup warning if field is NOT used by another element', async () => {
            usebyMock.usedBy.mockReturnValueOnce(['parentGuid']);
            const visualDisplayTypeCombobox = getDisplayTypeCombobox(screenChoiceFieldPropEditor);
            visualDisplayTypeCombobox.dispatchEvent(
                new PropertyChangedEvent('choiceDisplayType', FlowScreenFieldType.MultiSelectPicklist, null, null, null)
            );
            await ticks(1);
            expect(invokeModal).not.toBeCalled();
        });
    });
});
describe('screen-choice-field-properties-editor for single select, type String', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const testField = createTestScreenField(fieldName, FlowScreenFieldType.DropdownBox, SCREEN_NO_DEF_VALUE, {
            dataType: FLOW_DATA_TYPE.STRING.value
        });
        testField.choiceReferences[0] = {
            choiceReference: { value: 'choice-PICKLIST', error: null }
        };
        testField.choiceReferences[1] = {
            choiceReference: { value: 'choice-altPCS', error: null }
        };
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    describe('switching type of choice', () => {
        it('Should NOT display a popup warning if field is used by another element', async () => {
            usebyMock.usedBy.mockReturnValueOnce(['parentGuid', 'someGuid']);
            const visualDisplayTypeCombobox = getDisplayTypeCombobox(screenChoiceFieldPropEditor);
            visualDisplayTypeCombobox.dispatchEvent(
                new PropertyChangedEvent('choiceDisplayType', FlowScreenFieldType.MultiSelectPicklist, null, null, null)
            );
            await ticks(1);
            expect(invokeModal).not.toBeCalled();
        });
        it('Should NOT display a popup warning if field is NOT used by another element', async () => {
            usebyMock.usedBy.mockReturnValueOnce(['parentGuid']);
            const visualDisplayTypeCombobox = getDisplayTypeCombobox(screenChoiceFieldPropEditor);
            visualDisplayTypeCombobox.dispatchEvent(
                new PropertyChangedEvent('choiceDisplayType', FlowScreenFieldType.MultiSelectPicklist, null, null, null)
            );
            await ticks(1);
            expect(invokeModal).not.toBeCalled();
        });
    });
});
