import { createTestScreenField, createTestScreenWithFields, SCREEN_NULL_DEF_VALUE } from 'builder_platform_interaction-builder-test-utils';
import { screenReducer } from '../screen-reducer';
import {PropertyChangedEvent} from 'builder_platform_interaction-events';

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

function testFerovValue(valueBefore, valueAfter, propertyName, screenFieldProvider, fieldProvider, propertyNameProvider, defaultDataType) {
    const dataTypePropName = propertyName + 'DataType';
    const guidPropName = propertyName + 'Guid';

    // Determine value to use (reference, stringValue or null)
    if (valueBefore.isReference) {
        valueBefore.propertyValue = {elementReference: valueBefore.valueGuid};
    } else if (valueBefore.value) {
        valueBefore.propertyValue = {stringValue: valueBefore.value};
    } else {
        valueBefore.propertyValue = SCREEN_NULL_DEF_VALUE;
    }

    // Create screenfield with default value and a screen containing that field
    const screenfield = screenFieldProvider(valueBefore.propertyValue);
    const screen = createTestScreenWithFields('TestScreen1', [screenfield]);
    const field = fieldProvider(screen);

    // Make sure everything went fine creating the screen
    expect(screen).toBeDefined();
    expect(field[propertyName].value).toBe(valueBefore.value);
    if (valueBefore.isReference) {
        expect(field[dataTypePropName]).toBe('reference');
        expect(field[guidPropName]).toBe(valueBefore.valueGuid);
    } else {
        if (valueBefore.value) {
            expect(field[dataTypePropName]).toBe('String');
        } else {
            expect(field[dataTypePropName]).toBeUndefined();
        }

        expect(field[guidPropName]).toBeUndefined();
    }

    // Create event for the reducer to process and call the reducer
    const event = {
        type: PropertyChangedEvent.EVENT_NAME,
        detail: {
            propertyName: propertyNameProvider ? propertyNameProvider(field) : propertyName,
            value: valueAfter.value,
            error: null,
            guid: (valueAfter.isReference ? valueAfter.valueGuid : null),
            oldValue: field[propertyName],
        }
    };

    if (defaultDataType) {
        event.detail.valueDataType = defaultDataType;
    }

    const newScreen = screenReducer(screen, event, screen.fields[0]);
    const newField = fieldProvider(newScreen);

    // Make sure everything went well
    expect(newScreen).toBeDefined();
    expect(newField[propertyName].value).toBe(valueAfter.value);
    if (valueAfter.isReference) {
        expect(newField[dataTypePropName]).toBe('reference');
        expect(newField[guidPropName]).toBe(valueAfter.valueGuid);
    } else {
        if (valueAfter.value) {
            expect(newField[dataTypePropName]).toBe('String');
        } else {
            expect(newField[dataTypePropName]).toBeUndefined();
        }

        expect(newField[guidPropName]).toBeUndefined();
    }
}

function testInputParamValue(valueBefore, valueAfter) {
    const screenFieldProvider = (value) => {
        const config = {hydrateValues: false, helpText: false, validation: false, includeNonMDValues: false};
        const field = createTestScreenField('lcfield1', 'Extension', 'c:fakeCmpName', config);
        field.inputParameters[0].value = value !== SCREEN_NULL_DEF_VALUE ? value : null;
        field.outputParameters[0].assignToReference = 'GUID_String_1';
        return field;
    };

    const fieldProvider = (screen) => {
        return screen.fields[0].inputParameters[0];
    };

    const propertyNameProvider = (field) => {
        return 'input.' + field.name.value;
    };

    testFerovValue(valueBefore, valueAfter, 'value', screenFieldProvider, fieldProvider, propertyNameProvider, 'String');
}

function testDefaultValue(valueBefore, valueAfter) {
    const screenFieldProvider = (value) => {
        return createTestScreenField('textfield1', 'TextBox', value, {hydrateValues: false});
    };

    const fieldProvider = (screen) => {
        return screen.fields[0];
    };

    testFerovValue(valueBefore, valueAfter, 'defaultValue', screenFieldProvider, fieldProvider);
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

describe('screen reducer change LC screen field input parameter value value', () => {
    it('from literal to literal', () => {
        testInputParamValue({value:'BEFORE', isReference: false}, {value:'AFTER', isReference:false});
    });

    it('from literal to null', () => {
        testInputParamValue({value:'BEFORE', isReference: false}, {value:null, isReference:false});
    });

    it('from null to literal', () => {
        testInputParamValue({value:null, isReference: false}, {value:'AFTER', isReference:false});
    });

    it('from literal to reference', () => {
        testInputParamValue({value:'BEFORE', isReference: false}, REFERENCE_VALUES.STRING_1);
    });

    it('from reference to reference', () => {
        testInputParamValue(REFERENCE_VALUES.STRING_1, REFERENCE_VALUES.STRING_2);
    });

    it('from reference to reference with a different type', () => {
        testInputParamValue(REFERENCE_VALUES.STRING_1, REFERENCE_VALUES.NUMBER_3);
    });

    it('from reference to null', () => {
        testInputParamValue(REFERENCE_VALUES.STRING_1, {value:null, isReference:false});
    });

    it('from null to reference', () => {
        testInputParamValue({value:null, isReference:false}, REFERENCE_VALUES.STRING_1);
    });

    it('from reference to literal', () => {
        testInputParamValue(REFERENCE_VALUES.STRING_1, {value:'AFTER', isReference: false});
    });
});