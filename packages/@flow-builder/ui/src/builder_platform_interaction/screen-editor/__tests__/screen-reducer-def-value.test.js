import { createTestScreenField, createTestScreenWithFields, SCREEN_NULL_DEF_VALUE } from 'builder_platform_interaction-builder-test-utils';
import { screenReducer } from '../screen-reducer';

import {
    PropertyChangedEvent,
} from 'builder_platform_interaction-events';

export const REFERENCE_VALUES = {
    STRING_1: {value:'{!String1}', valueGuid: 'GUID_String_1', isReference: true},
    STRING_2: {value:'{!String2}', valueGuid: 'GUID_String_2', isReference: true},
    NUMBER_3: {value:'{!Number3}', valueGuid: 'GUID_Number_3', isReference: true},
};

jest.mock('builder_platform_interaction-store-utils', () => {
    return {
        getElementByGuid(guid) {
            if (guid.startsWith('GUID_')) {
                const groups = (/GUID_([a-zA-Z]*)_(\d)/g).exec(guid);
                return {
                    dataType: groups[1],
                    elementType: "VARIABLE",
                    guid,
                    isCanvasElement:false,
                    isCollection:false,
                    name: groups[1] + groups[2]
                };
            }

            return null;
        }
    };
});


function testDefaultValue(valueBefore, valueAfter) {
    // Determine defaultValue to use (reference, stringValue or null)
    if (valueBefore.isReference) {
        valueBefore.defaultValue = {elementReference: valueBefore.valueGuid};
    } else if (valueBefore.value) {
        valueBefore.defaultValue = {stringValue: valueBefore.value};
    } else {
        valueBefore.defaultValue = SCREEN_NULL_DEF_VALUE;
    }

    // Create textfield with default value and a screen containing that field
    const field = createTestScreenField('textfield1', 'TextBox', valueBefore.defaultValue, {hydrateValues: false});
    const screen = createTestScreenWithFields('TestScreen1', [field]);

    // Make sure everything went fine creating the screen
    expect(screen).toBeDefined();
    expect(screen.fields[0].defaultValue.value).toBe(valueBefore.value);
    if (valueBefore.isReference) {
        expect(screen.fields[0].defaultValueDataType).toBe('reference');
        expect(screen.fields[0].defaultValueGuid).toBe(valueBefore.valueGuid);
    } else {
        if (valueBefore.value) {
            expect(screen.fields[0].defaultValueDataType).toBe('String');
        } else {
            expect(screen.fields[0].defaultValueDataType).toBeUndefined();
        }

        expect(screen.fields[0].defaultValueGuid).toBeUndefined();
    }

    // Create event for the reducer to process and call the reducer
    const event = {
        type: PropertyChangedEvent.EVENT_NAME,
        detail: {
            propertyName: 'defaultValue',
            value: valueAfter.value,
            error: null,
            guid: (valueAfter.isReference ? valueAfter.valueGuid : null),
            oldValue: screen.fields[0].defaultValue
        }
    };
    const newScreen = screenReducer(screen, event, screen.fields[0]);

    // Make sure everything went well
    expect(newScreen).toBeDefined();
    expect(newScreen.fields[0].defaultValue.value).toBe(valueAfter.value);
    if (valueAfter.isReference) {
        expect(newScreen.fields[0].defaultValueDataType).toBe('reference');
        expect(newScreen.fields[0].defaultValueGuid).toBe(valueAfter.valueGuid);
    } else {
        if (valueAfter.value) {
            expect(newScreen.fields[0].defaultValueDataType).toBe('String');
        } else {
            expect(newScreen.fields[0].defaultValueDataType).toBeUndefined();
        }

        expect(newScreen.fields[0].defaultValueGuid).toBeUndefined();
    }
}

describe('screen reducer change screen field default value', () => {
    it('from literal to literal', () => {
        testDefaultValue({value:'BEFORE', isReference: false}, {value:'AFTER', isReference:false});
    });

    it('from literal to null', () => {
        testDefaultValue({value:'BEFORE', isReference: false}, {value:null, isReference:false});
    });

    it('from null to literal', () => {
        testDefaultValue({value:null, isReference: false}, {value:'AFTER', isReference:false});
    });

    it('from literal to reference', () => {
        testDefaultValue({value:'BEFORE', isReference: false}, REFERENCE_VALUES.STRING_1);
    });

    it('from reference to reference', () => {
        testDefaultValue(REFERENCE_VALUES.STRING_1, REFERENCE_VALUES.STRING_2);
    });

    it('from reference to reference with a different type', () => {
        testDefaultValue(REFERENCE_VALUES.STRING_1, REFERENCE_VALUES.NUMBER_3);
    });

    it('from reference to null', () => {
        testDefaultValue(REFERENCE_VALUES.STRING_1, {value:null, isReference:false});
    });

    it('from null to reference', () => {
        testDefaultValue({value:null, isReference:false}, REFERENCE_VALUES.STRING_1);
    });

    it('from reference to literal', () => {
        testDefaultValue(REFERENCE_VALUES.STRING_1, {value:'BEFORE', isReference: false});
    });
});