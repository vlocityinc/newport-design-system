import { screenExtensionPropertiesReducer } from '../screenExtensionPropertiesReducer';
import { UseAdvancedOptionsSelectionChangedEvent } from 'builder_platform_interaction/events';

const selectAdvancedModeEvent = new UseAdvancedOptionsSelectionChangedEvent(
    false
);
const selectManualModeEvent = new UseAdvancedOptionsSelectionChangedEvent(true);

describe('Screen extension properties reducer', () => {
    describe('useAdvancedOptionsSelectionChanged', () => {
        describe('storeOutputAutomatically update', () => {
            const extensionDescription = {
                outputParameters: []
            };
            let state;
            test('storeOutputAutomatically is false use advanced option true', () => {
                state = {
                    storeOutputAutomatically: false,
                    extensionDescription
                };

                state = screenExtensionPropertiesReducer(
                    state,
                    selectManualModeEvent
                );

                expect(state.storeOutputAutomatically).toBe(false);
            });
            test('storeOutputAutomatically is false use advanced option false', () => {
                state = {
                    storeOutputAutomatically: false,
                    extensionDescription
                };

                state = screenExtensionPropertiesReducer(
                    state,
                    selectAdvancedModeEvent
                );

                expect(state.storeOutputAutomatically).toBe(true);
            });
            test('storeOutputAutomatically is true use advanced option true', () => {
                state = {
                    storeOutputAutomatically: true,
                    extensionDescription
                };

                state = screenExtensionPropertiesReducer(
                    state,
                    selectManualModeEvent
                );

                expect(state.storeOutputAutomatically).toBe(false);
            });
            test('storeOutputAutomatically is true use advanced option false', () => {
                state = {
                    storeOutputAutomatically: true,
                    extensionDescription
                };

                state = screenExtensionPropertiesReducer(
                    state,
                    selectAdvancedModeEvent
                );

                expect(state.storeOutputAutomatically).toBe(true);
            });
        });
    });
    describe('ouput parameters reset', () => {
        const DESCRIPTOR_PARAMETERS = [
            {
                apiName: 'stringAttr',
                dataType: 'string',
                description: 'String Attribute Description',
                hasDefaultValue: false,
                isRequired: true,
                label: undefined,
                isInput: true,
                isOutput: true,
                maxOccurs: 1,
                objectType: undefined
            }
        ];
        const OUTPUT_PARAMETERS_ATTRIBUTE = [
            {
                name: { value: DESCRIPTOR_PARAMETERS[0].apiName, error: null },
                value: { value: '{!var1}', error: null },
                valueDataType: 'reference'
            }
        ];
        const extensionDescription = {
            outputParameters: JSON.parse(JSON.stringify(DESCRIPTOR_PARAMETERS))
        };
        const outputParameters = {
            attribute: JSON.parse(JSON.stringify(OUTPUT_PARAMETERS_ATTRIBUTE)),
            key: DESCRIPTOR_PARAMETERS[0].apiName
        };
        it('reset output parameter when advanced option false', () => {
            const originalState = { extensionDescription, outputParameters };

            const state = screenExtensionPropertiesReducer(
                originalState,
                selectAdvancedModeEvent
            );

            expect(state.outputParameters[0].attribute).not.toBeDefined();
        });
        it('does not reset output parameter when advanced option true', () => {
            const originalState = { extensionDescription };

            const state = screenExtensionPropertiesReducer(
                originalState,
                selectManualModeEvent
            );

            expect(state.extensionDescription).toEqual(
                originalState.extensionDescription
            );
            expect(state.outputParameters).toEqual(
                originalState.outputParameters
            );
        });
    });
});
