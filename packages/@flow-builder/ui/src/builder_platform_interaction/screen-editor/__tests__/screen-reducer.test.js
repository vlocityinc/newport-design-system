import { createTestScreen, createTestScreenField } from 'builder_platform_interaction-builder-test-utils';
import { screenReducer } from '../screen-reducer';

import {
    PropertyChangedEvent,
    ReorderListEvent,
    createScreenElementDeletedEvent,
    createAddScreenFieldEvent
} from 'builder_platform_interaction-events';

const SCREEN_NAME = 'TestScreen1';

describe('screen reducer', () => {
    it('updates the label', () => {
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const screen = createTestScreen(SCREEN_NAME);
        const newScreen = screenReducer(screen, event, screen);
        expect(newScreen).toBeDefined();
        expect(newScreen.label.value).toEqual('newlabel');
        expect(newScreen).not.toBe(screen);
    });

    it('change screen field property', () => {
        const newDisplayText = 'new display text';
        const screen = createTestScreen(SCREEN_NAME, ['displayText']);
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'fieldText',
                value: newDisplayText,
                error: null,
                guid: screen.fields[0].guid,
                oldValue: screen.fields[0].fieldText
            }
        };
        const newScreen = screenReducer(screen, event, screen.fields[0]);

        // The changed property should be updated, but the unchanged property should be the same.
        expect(newScreen).toBeDefined();
        expect(newScreen.fields[0].fieldText.value).toBe(newDisplayText);
        expect(newScreen.fields[0].name.value).toBe(screen.fields[0].name.value);
    });

    it('change screen field validation error message when there is none before', () => {
        const newErrorMessage = 'error1';
        const screen = createTestScreen(SCREEN_NAME, ['displayText']);
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'validationRule.errorMessage',
                value: newErrorMessage,
                error: null,
                guid: screen.fields[0].guid,
                oldValue: undefined
            }
        };
        const newScreen = screenReducer(screen, event, screen.fields[0]);

        // The changed property should be updated and not hydrated since it wasn't set before.
        expect(newScreen).toBeDefined();
        expect(newScreen.fields[0].validationRule.errorMessage).toBe(newErrorMessage);
    });

    it('change screen field validation error message when field has one set already', () => {
        // Field and screen setup
        const oldErrorMessage = 'error1';
        const newErrorMessage = 'error2';
        const screen = createTestScreen(SCREEN_NAME, null);
        screen.fields = [];
        const field = createTestScreenField('Screenfield1', 'DisplayText', 'Display this');
        field.validationRule = {
            errorMessage: {value: oldErrorMessage, error: null},
            formulaExpression: {value: '{Screenfield1} != null', error: null}};
        screen.fields.push(field);

        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'validationRule.errorMessage',
                value: newErrorMessage,
                error: null,
                guid: screen.fields[0].guid,
                oldValue: screen.fields[0].validationRule.errorMessage
            }
        };
        const newScreen = screenReducer(screen, event, screen.fields[0]);

        // The changed property should be updated and hydrated since it was hydrated before.
        expect(newScreen).toBeDefined();
        expect(newScreen.fields[0].validationRule.errorMessage.value).toBe(newErrorMessage);
    });

    it('change screen field validation rule formula expression when there is none before', () => {
        const newFormula = '{Screenfield1} != null';
        const screen = createTestScreen(SCREEN_NAME, ['displayText']);
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'validationRule.formulaExpression',
                value: newFormula,
                error: null,
                guid: screen.fields[0].guid,
                oldValue: undefined
            }
        };
        const newScreen = screenReducer(screen, event, screen.fields[0]);

        // The changed property should be updated and not hydrated since it wasn't set before.
        expect(newScreen).toBeDefined();
        expect(newScreen.fields[0].validationRule.formulaExpression).toBe(newFormula);
    });

    it('change screen field validation rule formula expression when field has one set already', () => {
        // Field and screen setup
        const oldFormula = '{Screenfield1} == null';
        const newFormula = '{Screenfield1} != null';
        const screen = createTestScreen(SCREEN_NAME, null);
        screen.fields = [];
        const field = createTestScreenField('Screenfield1', 'DisplayText', 'Display this');
        field.validationRule = {
            errorMessage: {value: 'some error', error: null},
            formulaExpression: {value: oldFormula, error: null}};
        screen.fields.push(field);

        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'validationRule.formulaExpression',
                value: newFormula,
                error: null,
                guid: screen.fields[0].guid,
                oldValue: screen.fields[0].validationRule.formulaExpression
            }
        };
        const newScreen = screenReducer(screen, event, screen.fields[0]);

        // The changed property should be updated and hydrated since it was hydrated before.
        expect(newScreen).toBeDefined();
        expect(newScreen.fields[0].validationRule.formulaExpression.value).toBe(newFormula);
    });

    it('fetches the error from the property change event instead of rerunning validation', () => {
        const event = {
            type: PropertyChangedEvent.EVENT_NAME,
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: 'errorFromChildComponent'
            }
        };
        const screen = createTestScreen(SCREEN_NAME);
        const newScreen = screenReducer(screen, event, screen);
        expect(newScreen).toBeDefined();
        expect(newScreen.label.error).toBe('errorFromChildComponent');
        expect(newScreen).not.toBe(screen);
    });

    it('ignores unknown events', () => {
        const screen = createTestScreen(SCREEN_NAME);
        const newScreen = screenReducer(screen, new Event('unknown'));
        expect(newScreen).toBeDefined();
        expect(newScreen.label.value).toBe(SCREEN_NAME);
        expect(newScreen).toBe(screen);
    });

    it('inserts a field at a specific position', () => {
        const fieldType = 'Currency';
        const screen = createTestScreen(SCREEN_NAME, null);
        const event = createAddScreenFieldEvent(fieldType, 5);
        const newScreen = screenReducer(screen, event);
        expect(newScreen.fields).toHaveLength(screen.fields.length + 1);
        expect(newScreen.fields[5].type.name).toBe(fieldType);
    });

    it('adds a field at the end of the array', () => {
        const fieldType = 'Currency';
        const screen = createTestScreen(SCREEN_NAME, null);
        const event = createAddScreenFieldEvent(fieldType);
        const newScreen = screenReducer(screen, event);
        expect(newScreen.fields).toHaveLength(screen.fields.length + 1);
        expect(newScreen.fields[newScreen.fields.length - 1].type.name).toBe(fieldType);
    });

    it('deletes a screen field', () => {
        const screen = createTestScreen(SCREEN_NAME, null);
        const event = createScreenElementDeletedEvent(screen.fields[0]);

        const newScreen = screenReducer(screen, event);
        expect(newScreen.fields[0]).not.toBe(screen.fields[0]);
        expect(newScreen.fields).toHaveLength(screen.fields.length - 1);
    });

    it('reorders fields', () => {
        const screen = createTestScreen(SCREEN_NAME, null);
        const event = {
            type: ReorderListEvent.EVENT_NAME,
            detail: {
                sourceGuid: screen.fields[0].guid,
                destinationGuid: screen.fields[2].guid
            }
        };

        const newScreen = screenReducer(screen, event);
        expect(screen.fields[0]).toBe(newScreen.fields[2]);
        expect(screen.fields[2]).toBe(newScreen.fields[1]);
        expect(newScreen.fields).toHaveLength(screen.fields.length);
    });

    it('reorders fields when dest and source are the same results in no change', () => {
        const screen = createTestScreen(SCREEN_NAME, null);
        const event = {
            type: ReorderListEvent.EVENT_NAME,
            detail: {
                sourceGuid: screen.fields[0].guid,
                destinationGuid: screen.fields[0].guid
            }
        };

        const newScreen = screenReducer(screen, event);
        expect(newScreen.fields).toEqual(screen.fields);
    });

    it('invalid guid for destination field results in no change', () => {
        const screen = createTestScreen(SCREEN_NAME, null);
        const event = {
            type: ReorderListEvent.EVENT_NAME,
            detail: {
                sourceGuid: screen.fields[0].guid,
                destinationGuid: screen.guid
            }
        };

        const newScreen = screenReducer(screen, event);
        expect(newScreen.fields).toEqual(screen.fields);
    });

    it('invalid guid for source field results in no change', () => {
        const screen = createTestScreen(SCREEN_NAME, null);
        const event = {
            type: ReorderListEvent.EVENT_NAME,
            detail: {
                sourceGuid: screen.guid,
                destinationGuid: screen.fields[0].guid
            }
        };

        const newScreen = screenReducer(screen, event);
        expect(newScreen.fields).toEqual(screen.fields);
    });
});