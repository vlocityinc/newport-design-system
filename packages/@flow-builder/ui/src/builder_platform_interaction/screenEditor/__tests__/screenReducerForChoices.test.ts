// @ts-nocheck
import {
    createTestScreen,
    createTestScreenField,
    SCREEN_NO_DEF_VALUE
} from 'builder_platform_interaction/builderTestUtils';
import { screenReducer } from '../screenReducer';
import { createChoice } from 'builder_platform_interaction/elementFactory';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

import { ScreenEditorEventName } from 'builder_platform_interaction/events';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const SCREEN_NAME = 'TestScreen1';
const MOCK_PICKLIST_CHOICE_SET_PREFIX = 'picklistChoiceSet';
const MOCK_PICKLIST_CHOICE_SET_ELEMENT_TYPE = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
const MOCK_CHOICE_ELEMENT_TYPE = ELEMENT_TYPE.CHOICE;
const MOCK_STRING_FLOW_DATE_TYPE = FLOW_DATA_TYPE.STRING;

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid(guid) {
            const elementType = guid.startsWith(MOCK_PICKLIST_CHOICE_SET_PREFIX)
                ? MOCK_PICKLIST_CHOICE_SET_ELEMENT_TYPE
                : MOCK_CHOICE_ELEMENT_TYPE;
            return {
                dataType: MOCK_STRING_FLOW_DATE_TYPE.value,
                elementType,
                guid,
                isCanvasElement: false,
                isCollection: false,
                name: guid
            };
        },
        isDevNameInStore: jest.fn()
    };
});

it('change choice screen field by changing the 1st choice', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const screen = createTestScreen(SCREEN_NAME, []);
    const newChoice = createChoice({ name: 'newChoice' });
    screen.fields = [field];

    // Change first choice
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: 'error1' },
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The first choice should be changed, the rest should be the same.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.error).toBe('error1');
    expect(newScreen.fields[0].choiceReferences[1]).toBe(field.choiceReferences[1]);
    expect(newScreen.fields[0].choiceReferences[2]).toBe(field.choiceReferences[2]);
});

it('change choice screen field by changing the last choice', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const screen = createTestScreen(SCREEN_NAME, []);
    const newChoice = createChoice({ name: 'newChoice' });
    screen.fields = [field];

    // Change last choice
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null },
            position: 2
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The last choice should be changed, the rest should be the same.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0]).toBe(field.choiceReferences[0]);
    expect(newScreen.fields[0].choiceReferences[1]).toBe(field.choiceReferences[1]);
    expect(newScreen.fields[0].choiceReferences[2].choiceReference.value).toBe(newChoice.name);
});

it('defaultValue is cleared when corresponding choice is changed and we only have static choices', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    field.choiceReferences.push({
        choiceReference: { value: 'choice2', error: null }
    });
    field.defaultValue = { value: 'choice1', error: null };
    screen.fields.push(field);

    // Change choice which is current default value
    const newChoice = createChoice({ name: 'newChoice' });
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null },
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The default value should be cleared, along with the choice change.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].defaultValue.value).toBeNull();
});

it('defaultValue should not be cleared when unrelated choice is changed and we only have static choices', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    field.choiceReferences.push({
        choiceReference: { value: 'choice2', error: null }
    });
    field.defaultValue = { value: 'choice1', error: null };
    screen.fields.push(field);

    // Change choice which is current default value
    const newChoice = createChoice({ name: 'newChoice' });
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null },
            position: 1
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The default value should not be cleared, along with the choice change.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[1].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].defaultValue.value).toBe('choice1');
});

it('defaultValue is not cleared when a choice is changed and we have have at least one dynamic choice set', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    field.choiceReferences.push({
        choiceReference: { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null }
    });
    field.defaultValue = { value: 'test', error: null };
    screen.fields.push(field);

    // Change choice which is current default value
    const newChoice = createChoice({ name: 'newChoice' });
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null },
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The default value should not be cleared, along with the choice change.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].defaultValue.value).toBe('test');
});

it('defaultValue is cleared when a choice is changed and we have no more dynamic choice sets', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    field.choiceReferences.push({
        choiceReference: { value: MOCK_PICKLIST_CHOICE_SET_PREFIX + '1', error: null }
    });
    field.defaultValue = { value: 'test', error: null };
    screen.fields.push(field);

    // Change choice which is current default value
    const newChoice = createChoice({ name: 'newChoice' });
    const event = {
        type: ScreenEditorEventName.ChoiceChanged,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null },
            position: 1
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The default value should be cleared, along with the choice change.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[1].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].defaultValue.value).toBeNull();
});

it('add choice to radio screen field', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Add new choice to the field.
    const event = {
        type: ScreenEditorEventName.ChoiceAdded,
        detail: {
            screenElement: field,
            position: 3
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // New choice is added to the end of the list and it's empty.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences).toHaveLength(originalNumChoices + 1);
    expect(newScreen.fields[0].choiceReferences[originalNumChoices].choiceReference.value).toBe('');
});

it('Attempt to add choice to invalid position results in an error', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Badly formed event with invalid position.
    const event = {
        type: ScreenEditorEventName.ChoiceAdded,
        detail: {
            screenElement: field,
            position: 2
        }
    };

    try {
        screenReducer(screen, event, screen.fields[0]);
    } catch (e) {
        expect(e.message).toMatch('Position for new choice is invalid');
    }
});

it('Delete first choice from radio screen field', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Delete last choice
    const event = {
        type: ScreenEditorEventName.ChoiceDeleted,
        detail: {
            screenElement: field,
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The first choice should be gone and the rest should be moved up.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences).toHaveLength(originalNumChoices - 1);
    expect(newScreen.fields[0].choiceReferences[0]).toBe(field.choiceReferences[1]);
    expect(newScreen.fields[0].choiceReferences[1]).toBe(field.choiceReferences[2]);
});

it('Delete last choice from radio screen field', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Delete last choice
    const event = {
        type: ScreenEditorEventName.ChoiceDeleted,
        detail: {
            screenElement: field,
            position: 2
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The last choice should be gone, the others should be the same.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences).toHaveLength(originalNumChoices - 1);
    expect(newScreen.fields[0].choiceReferences[0]).toBe(field.choiceReferences[0]);
    expect(newScreen.fields[0].choiceReferences[1]).toBe(field.choiceReferences[1]);
});

it('Delete choice from radio screen field when it was the defaultValue and we only have static choices', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    field.defaultValue = { value: 'choice1', error: null };
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Delete the choice that is the defaultValue
    const event = {
        type: ScreenEditorEventName.ChoiceDeleted,
        detail: {
            screenElement: field,
            position: 1
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // DefaultValue should be gone because its corresponding choice was deleted.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].defaultValue.value).toBeNull();
});

it('Deleting choice from radio screen field when it is not the defaultValue and we only have static choices', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        createChoices: true
    });
    field.defaultValue = { value: 'choice1', error: null };
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Delete the choice that is the defaultValue
    const event = {
        type: ScreenEditorEventName.ChoiceDeleted,
        detail: {
            screenElement: field,
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // DefaultValue should be gone because its corresponding choice was deleted.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].defaultValue.value).toBe('choice1');
});

it('validate all when choice based field has no choice associated with it', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: '', error: null }
    });
    screen.fields.push(field);
    const event = {
        type: VALIDATE_ALL,
        detail: {
            type: VALIDATE_ALL
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The screen should now have an error associated with the choice field.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0]).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.error).toBe(LABELS.cannotBeBlank);
});

it('validate all when choice based field has a choice associated with it', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', FlowScreenFieldType.RadioButtons, SCREEN_NO_DEF_VALUE, {
        dataType: FLOW_DATA_TYPE.STRING.value,
        validation: false,
        helpText: false
    });
    field.choiceReferences = [];
    field.choiceReferences.push({
        choiceReference: { value: 'choice1', error: null }
    });
    screen.fields.push(field);
    const event = {
        type: VALIDATE_ALL,
        detail: {
            type: VALIDATE_ALL
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The screen should now have an error associated with the choice field.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0]).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.error).toBeNull();
});
