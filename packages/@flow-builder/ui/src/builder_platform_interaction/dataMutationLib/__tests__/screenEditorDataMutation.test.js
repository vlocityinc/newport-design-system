import { mutateScreen, demutateScreen, mutateScreenField, demutateScreenField } from '../screenEditorDataMutation';
import { createTestScreen, createTestScreenField } from "builder_platform_interaction/builderTestUtils";
import { getScreenFieldType } from "builder_platform_interaction/screenEditorUtils";

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid(guid) {
            if (guid === 'VARIABLE_1') {
                return {
                    dataType: 'Date',
                    elementType: "VARIABLE",
                    guid,
                    isCanvasElement:false,
                    isCollection:false,
                    name: 'dateVar1'
                };
            }

            return null;
        }
    };
});

function checkNotMutated(screen) {
    // Fields
    expect(screen.fields).toHaveLength(8);
    expect(screen.fields[0].dataType).toBe('String');
    expect(screen.fields[1].fieldType).toBe('LargeTextArea');
    expect(screen.fields[2].dataType).toBe('Currency');
    expect(screen.fields[3].dataType).toBe('Number');
    expect(screen.fields[4].dataType).toBe('Date');
    expect(screen.fields[5].fieldType).toBe('PasswordField');
    expect(screen.fields[6].dataType).toBe('Boolean');
    expect(screen.fields[7].fieldType).toBe('DisplayText');

    // Make sure it is not already mutated
    expect(screen.getFieldByGUID).not.toBeDefined();
    expect(screen.getFieldIndex).not.toBeDefined();
    expect(screen.getFieldIndexByGUID).not.toBeDefined();

    // FEROV
    expect(screen.fields[1].defaultValue).toEqual({elementReference: 'VARIABLE_1'});
}

function checkMutated(screen) {
    // Screen functions
    expect(screen.getFieldByGUID).toBeDefined();
    expect(screen.getFieldIndex).toBeDefined();
    expect(screen.getFieldIndexByGUID).toBeDefined();

    expect(screen.getFieldByGUID(screen.fields[3].guid)).toBe(screen.fields[3]);
    expect(screen.getFieldIndex(screen.fields[3])).toBe(3);
    expect(screen.getFieldIndexByGUID(screen.fields[3].guid)).toBe(3);

    // Type added to fields
    for (const field of screen.fields) {
        expect(field.type).toBe(getScreenFieldType(field));
    }

    // FEROV
    expect(screen.fields[1].defaultValue).toEqual('{!dateVar1}');
    expect(screen.fields[1].defaultValueDataType).toEqual('reference');
    expect(screen.fields[1].defaultValueGuid).toEqual('VARIABLE_1');
}

describe('mutateScreen function', () => {
    it('mutates the screen correctly', () => {
        const screen = createTestScreen('Screen Title', null, {mutateScreen: false, hydrateValues: false, includeNonMDValues: false});
        checkNotMutated(screen);
        mutateScreen(screen);
        checkMutated(screen);
    });

    it('demutates the screen correctly', () => {
        const screen = createTestScreen('Screen Title', null, {mutateScreen: true, hydrateValues: false, includeNonMDValues: false});
        checkMutated(screen);
        demutateScreen(screen);
        checkNotMutated(screen);
    });
});

describe('mutateScreenField function', () => {
    it('mutateScreenField function scalar property correctly', () => {
        const screenField = createTestScreenField('field1', 'Number', null, {validation: false, hydrateValues: false});
        screenField.scale = 2;

        const mutatedScreenField = mutateScreenField(screenField);
        expect(mutatedScreenField.scale).toBeDefined();
        expect(mutatedScreenField.scale).toBe('2');

        const demutatedScreenField = demutateScreenField(screenField);
        expect(demutatedScreenField.scale).toBeDefined();
        expect(demutatedScreenField.scale).toBe(2);
    });
});

