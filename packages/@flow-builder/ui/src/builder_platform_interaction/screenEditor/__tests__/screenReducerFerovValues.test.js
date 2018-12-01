import { createTestScreenField, createTestScreenWithFields, SCREEN_NULL_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { screenReducer } from "../screenReducer";
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { createScreenField } from 'builder_platform_interaction/elementFactory';
import { EXTENSION_PARAM_PREFIX } from "builder_platform_interaction/screenEditorUtils";

export const REFERENCE_VALUES = {
    STRING_1: {value:'{!String1}', valueGuid: 'GUID_String_1', isReference: true},
    STRING_2: {value:'{!String2}', valueGuid: 'GUID_String_2', isReference: true},
    NUMBER_3: {value:'{!Number3}', valueGuid: 'GUID_Number_3', isReference: true},
    CHECKBOX_1: {value:'{!Boolean1}', valueGuid: 'GUID_Boolean_1', isReference: true},
};

jest.mock('builder_platform_interaction/storeUtils', () => {
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
        },

        getElementByDevName(name) {
            const type = name.substring(0, name.length - 1);
            const num = name.substring(name.length - 1);
            return {
                dataType:type,
                elementType: "VARIABLE",
                guid: 'GUID_' + type + '_' + num,
                isCanvasElement:false,
                isCollection:false,
                name
            };
        }
    };
});

function testFerovValue(valueBefore, valueAfter, propertyName, screenFieldProvider, fieldProvider, propertyNameProvider, defaultDataType) {
    const dataTypePropName = propertyName + 'DataType';

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
    if (valueBefore.value) {
        expect(field[propertyName].value).toBe(valueBefore.value);
    } else {
        expect(field[propertyName].value).toEqual('');
    }
    if (valueBefore.isReference) {
        expect(field[dataTypePropName]).toBe('reference');
    } else if (valueBefore.value) {
        expect(field[dataTypePropName]).toBe('String');
    } else {
        expect(field[dataTypePropName]).toBeFalsy();
    }

    // Create event for the reducer to process and call the reducer
    const event = {
        type: PropertyChangedEvent.EVENT_NAME,
        detail: {
            propertyName: propertyNameProvider ? propertyNameProvider(field) : propertyName,
            value: {value: valueAfter.value, error: null},
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

    if (valueAfter.shouldBeUndefined) {
        expect(newField).toBeUndefined();
    } else {
        const expectedValue = valueAfter.isReference && !valueAfter.globalConstantDataType ? valueAfter.valueGuid : valueAfter.value;
        expect(newField[propertyName].value).toBe(expectedValue);

        if (valueAfter.isReference && valueAfter.globalConstantDataType) {
            expect(newField[dataTypePropName]).toBe(valueAfter.globalConstantDataType);
        } else if (valueAfter.isReference) {
            expect(newField[dataTypePropName]).toBe('reference');
        } else if (valueAfter.value) {
            expect(newField[dataTypePropName]).toBe('String');
        } else {
            expect(newField[dataTypePropName]).toBeUndefined();
        }
    }
}

function testInputParamValue(valueBefore, valueAfter) {
    const screenFieldProvider = (value) => {
        const config = {hydrateValues: false, helpText: false, validation: false, includeNonMDValues: false};
        const field = createTestScreenField('lcfield1', 'Extension', 'c:fakeCmpName', config);
        field.inputParameters[0].value = value !== SCREEN_NULL_DEF_VALUE ? value : null;
        field.outputParameters[0].value = 'GUID_String_1';
        return createScreenField(field);
    };

    const fieldProvider = (screen) => {
        return screen.fields[0].inputParameters[0];
    };

    const propertyNameProvider = (field) => {
        return EXTENSION_PARAM_PREFIX.INPUT + '.' + field.name.value;
    };

    testFerovValue(valueBefore, valueAfter, 'value', screenFieldProvider, fieldProvider, propertyNameProvider, 'String');
}

function testDefaultValue(valueBefore, valueAfter, fieldType) {
    const screenFieldProvider = (value) => {
        return createTestScreenField('field1', fieldType || 'TextBox', value, {hydrateValues: false});
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

    it('from literal to global constant', () => {
        testDefaultValue({value:'BEFORE', isReference: false}, {value:'$GlobalConstant.EmptyString', isReference:true, globalConstantDataType:'String'});
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

    it('from reference to global constant', () => {
        testDefaultValue(REFERENCE_VALUES.CHECKBOX_1, {value:'$GlobalConstant.True', isReference:true, globalConstantDataType:'Boolean'}, 'Checkbox');
    });

    it('from null to reference', () => {
        testDefaultValue({value:null, isReference:false}, REFERENCE_VALUES.STRING_1);
    });

    it('from null to global constant', () => {
        testDefaultValue({value:null, isReference:false}, {value:'$GlobalConstant.False', isReference:true, globalConstantDataType:'Boolean'}, 'Checkbox');
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
        testInputParamValue({value:'BEFORE', isReference: false}, {value:null, isReference:false, shouldBeUndefined:true}); // LC Atts set to null must be removed from the params list
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
        testInputParamValue(REFERENCE_VALUES.STRING_1, {value:null, isReference:false, shouldBeUndefined:true}); // LC Atts set to null must be removed from the params list
    });

    it('from null to reference', () => {
        testInputParamValue({value:null, isReference:false}, REFERENCE_VALUES.STRING_1);
    });

    it('from reference to literal', () => {
        testInputParamValue(REFERENCE_VALUES.STRING_1, {value:'AFTER', isReference: false});
    });
});