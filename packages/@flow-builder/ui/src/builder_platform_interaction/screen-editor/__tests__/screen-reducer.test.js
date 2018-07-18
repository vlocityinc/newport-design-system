import { createTestScreen } from 'builder_platform_interaction-builder-test-utils';
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