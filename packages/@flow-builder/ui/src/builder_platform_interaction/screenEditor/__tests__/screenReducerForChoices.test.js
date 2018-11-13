import { createTestScreen, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { screenReducer } from "../screenReducer";
import { createChoice } from "builder_platform_interaction/elementFactory";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { LABELS } from "builder_platform_interaction/validationRules";

import {
    SCREEN_EDITOR_EVENT_NAME
} from "builder_platform_interaction/events";

const SCREEN_NAME = 'TestScreen1';

it('change choice screen field by changing the 1st choice', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', createChoices: true});
    const screen = createTestScreen(SCREEN_NAME, []);
    const newChoice = createChoice({name: 'newChoice'});
    screen.fields = [field];

    // Change first choice
    const event = {
        type: SCREEN_EDITOR_EVENT_NAME.CHOICE_CHANGED,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: 'error1'},
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
    const field = createTestScreenField('radioField1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', createChoices: true});
    const screen = createTestScreen(SCREEN_NAME, []);
    const newChoice = createChoice({name: 'newChoice'});
    screen.fields = [field];

    // Change last choice
    const event = {
        type: SCREEN_EDITOR_EVENT_NAME.CHOICE_CHANGED,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null},
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

it('defaultValue is cleared when corresponding choice is changed', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', validation: false, helpText: false});
    field.choiceReferences = [];
    field.choiceReferences.push({choiceReference: {value: 'choice1', error: null}});
    field.choiceReferences.push({choiceReference: {value: 'choice2', error: null}});
    field.defaultSelectedChoiceReference = {value: 'choice1', error: null};
    screen.fields.push(field);

    // Change choice which is current default value
    const newChoice = createChoice({name: 'newChoice'});
    const event = {
        type: SCREEN_EDITOR_EVENT_NAME.CHOICE_CHANGED,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null},
            position: 0
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The default value should be cleared, along with the choice change.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[0].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].defaultSelectedChoiceReference.value).toBe('');
});

it('defaultValue should not be cleared when unrelated choice is changed', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', validation: false, helpText: false});
    field.choiceReferences = [];
    field.choiceReferences.push({choiceReference: {value: 'choice1', error: null}});
    field.choiceReferences.push({choiceReference: {value: 'choice2', error: null}});
    field.defaultSelectedChoiceReference = {value: 'choice1', error: null};
    screen.fields.push(field);

    // Change choice which is current default value
    const newChoice = createChoice({name: 'newChoice'});
    const event = {
        type: SCREEN_EDITOR_EVENT_NAME.CHOICE_CHANGED,
        detail: {
            screenElement: field,
            newValue: { value: newChoice.name, error: null},
            position: 1
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // The default value should be cleared, along with the choice change.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences[1].choiceReference.value).toBe(newChoice.name);
    expect(newScreen.fields[0].defaultSelectedChoiceReference.value).toBe('choice1');
});

it('add choice to radio screen field', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', createChoices: true});
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Add new choice to the field.
    const event = {
        type: SCREEN_EDITOR_EVENT_NAME.CHOICE_ADDED,
        detail: {
            screenElement: field,
            position: 3
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // New choice is added to the end of the list and it's empty.
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].choiceReferences).toHaveLength(originalNumChoices + 1);
    expect(newScreen.fields[0].choiceReferences[originalNumChoices].choiceReference.value).toBe("");
});

it('Attempt to add choice to invalid position results in an error', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', createChoices: true});
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Badly formed event with invalid position.
    const event = {
        type: SCREEN_EDITOR_EVENT_NAME.CHOICE_ADDED,
        detail: {
            screenElement: field,
            position: 2
        }
    };

    try {
        screenReducer(screen, event, screen.fields[0]);
    } catch (e) {
        expect(e.message).toMatch("Position for new choice is invalid");
    }
});

it('Delete first choice from radio screen field', () => {
    // Create screen with radio screenField and 3 choices
    const field = createTestScreenField('radioField1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', createChoices: true});
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Delete last choice
    const event = {
        type: SCREEN_EDITOR_EVENT_NAME.CHOICE_DELETED,
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
    const field = createTestScreenField('radioField1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', createChoices: true});
    const originalNumChoices = field.choiceReferences.length;
    expect(originalNumChoices).toBe(3);
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [field];

    // Delete last choice
    const event = {
        type: SCREEN_EDITOR_EVENT_NAME.CHOICE_DELETED,
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

it('validate all when choice based field has no choice associated with it', () => {
    const screen = createTestScreen(SCREEN_NAME, []);
    screen.fields = [];
    const field = createTestScreenField('radio1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', validation: false, helpText: false});
    field.choiceReferences = [];
    field.choiceReferences.push({choiceReference: {value: '', error: null}});
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
    const field = createTestScreenField('radio1', 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', validation: false, helpText: false});
    field.choiceReferences = [];
    field.choiceReferences.push({choiceReference: {value: 'choice1', error: null}});
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