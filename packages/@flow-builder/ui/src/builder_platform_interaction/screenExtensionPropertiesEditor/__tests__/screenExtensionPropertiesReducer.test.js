// @ts-nocheck
import {
    screenExtensionPropertiesEventReducer,
    screenExtensionPropertiesPropsToStateReducer
} from '../screenExtensionPropertiesReducer';
import { UseAdvancedOptionsSelectionChangedEvent } from 'builder_platform_interaction/events';
import {
    createScreenFieldWithDynamicTypes,
    createFlowExtensionWithDynamicTypes
} from './screenExtensionDynamicTypesMocks';
import { deepCopy } from 'builder_platform_interaction/storeLib';

const selectAdvancedModeEvent = new UseAdvancedOptionsSelectionChangedEvent(false);
const selectManualModeEvent = new UseAdvancedOptionsSelectionChangedEvent(true);

describe('Screen extension properties reducer', () => {
    describe('event reducer', () => {
        describe('useAdvancedOptionsSelectionChanged', () => {
            describe('storeOutputAutomatically update', () => {
                const initialState = {
                    outputParameters: []
                };
                const props = {
                    extensionDescription: {
                        outputParameters: []
                    }
                };

                test('storeOutputAutomatically is false use advanced option true', () => {
                    const state = screenExtensionPropertiesEventReducer(
                        Object.assign({}, initialState, {
                            storeOutputAutomatically: false
                        }),
                        props,
                        selectManualModeEvent
                    );
                    expect(state.storeOutputAutomatically).toBe(false);
                });

                test('storeOutputAutomatically is false use advanced option false', () => {
                    const state = screenExtensionPropertiesEventReducer(
                        Object.assign({}, initialState, {
                            storeOutputAutomatically: false
                        }),
                        props,
                        selectAdvancedModeEvent
                    );
                    expect(state.storeOutputAutomatically).toBe(true);
                });

                test('storeOutputAutomatically is true use advanced option true', () => {
                    const state = screenExtensionPropertiesEventReducer(
                        Object.assign({}, initialState, {
                            storeOutputAutomatically: true
                        }),
                        props,
                        selectManualModeEvent
                    );
                    expect(state.storeOutputAutomatically).toBe(false);
                });

                test('storeOutputAutomatically is true use advanced option false', () => {
                    const state = screenExtensionPropertiesEventReducer(
                        Object.assign({}, initialState, {
                            storeOutputAutomatically: true
                        }),
                        props,
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
                    name: {
                        value: DESCRIPTOR_PARAMETERS[0].apiName,
                        error: null
                    },
                    value: { value: '{!var1}', error: null },
                    valueDataType: 'reference'
                }
            ];
            const extensionDescription = {
                outputParameters: deepCopy(DESCRIPTOR_PARAMETERS)
            };
            const outputParameters = {
                attribute: deepCopy(OUTPUT_PARAMETERS_ATTRIBUTE),
                key: DESCRIPTOR_PARAMETERS[0].apiName
            };
            const props = {
                extensionDescription
            };
            it('reset output parameter when advanced option false', () => {
                const state = screenExtensionPropertiesEventReducer(
                    { outputParameters },
                    props,
                    selectAdvancedModeEvent
                );
                expect(state.outputParameters[0].attribute).not.toBeDefined();
            });
            it('does not reset output parameter when advanced option true', () => {
                const state = screenExtensionPropertiesEventReducer({ outputParameters }, props, selectManualModeEvent);

                expect(state.outputParameters).toEqual(outputParameters);
            });
        });
    });

    describe('props to state reducer', () => {
        const INITIAL_STATE = {
            inputParameters: null,
            outputParameters: null,
            dynamicTypeMappings: [],
            storeOutputAutomatically: undefined
        };

        it('populates new state', () => {
            const state = {
                inputParameters: null,
                outputParameters: null,
                dynamicTypeMappings: [],
                storeOutputAutomatically: undefined
            };
            const props = {
                field: createScreenFieldWithDynamicTypes(),
                extensionDescription: createFlowExtensionWithDynamicTypes()
            };
            const newState = screenExtensionPropertiesPropsToStateReducer(state, props);
            expect(newState).toMatchObject({
                dynamicTypeMappings: [
                    {
                        comboboxConfig: {
                            allowSObjectFields: false,
                            disabled: false,
                            enableFieldDrilldown: false,
                            errorMessage: null,
                            fieldLevelHelp: 'This is the first object',
                            label: 'First sobject',
                            literalsAllowed: false,
                            placeholder: undefined,
                            required: true,
                            type: 'SObject',
                            variant: 'standard'
                        },
                        name: 'T',
                        rowIndex: expect.anything(),
                        value: 'Asset'
                    },
                    {
                        comboboxConfig: {
                            allowSObjectFields: false,
                            disabled: false,
                            enableFieldDrilldown: false,
                            errorMessage: null,
                            fieldLevelHelp: 'This is the second object',
                            label: 'Second sobject',
                            literalsAllowed: false,
                            placeholder: undefined,
                            required: true,
                            type: 'SObject',
                            variant: 'standard'
                        },
                        name: 'S',
                        rowIndex: expect.anything(),
                        value: ''
                    }
                ],
                inputParameters: [
                    {
                        attribute: undefined,
                        descriptor: {
                            apiName: 'selectedRecordA',
                            dataType: 'sobject',
                            description: 'The A object to process',
                            hasDefaultValue: false,
                            isInput: true,
                            isOutput: false,
                            isRequired: false,
                            label: 'Selected Record A',
                            maxOccurs: 1,
                            subtype: 'Asset'
                        },
                        disabled: false,
                        key: 'selectedRecordA'
                    },
                    {
                        attribute: undefined,
                        descriptor: {
                            apiName: 'selectedRecordB',
                            dataType: 'sobject',
                            description: 'The B object to process',
                            hasDefaultValue: false,
                            isInput: true,
                            isOutput: false,
                            isRequired: false,
                            label: 'Selected Record B',
                            maxOccurs: 1,
                            subtype: '{S}'
                        },
                        disabled: false,
                        key: 'selectedRecordB'
                    }
                ],
                outputParameters: [
                    {
                        attribute: undefined,
                        descriptor: {
                            apiName: 'computeA',
                            dataType: 'string',
                            description: 'Result of the first object procecssing',
                            hasDefaultValue: false,
                            isInput: false,
                            isOutput: true,
                            isRequired: false,
                            label: 'Compute result A',
                            maxOccurs: 1
                        },
                        disabled: false,
                        key: 'computeA'
                    }
                ],
                storeOutputAutomatically: true
            });
        });

        it('clears state when no props', () => {
            const state = {
                inputParameters: [
                    {
                        attribute: {},
                        rowIndex: 'abc321'
                    }
                ],
                outputParameters: [
                    {
                        attribute: {},
                        rowIndex: 'abc123'
                    }
                ],
                dynamicTypeMappings: [
                    {
                        name: 'T',
                        value: 'V',
                        rowIndex: 'abc',
                        comboboxConfig: {}
                    }
                ],
                storeOutputAutomatically: true
            };
            let newState = screenExtensionPropertiesPropsToStateReducer(state, {});
            expect(newState).toMatchObject(INITIAL_STATE);
            newState = screenExtensionPropertiesPropsToStateReducer(state, {
                field: {
                    name: 'abc'
                }
            });
            expect(newState).toMatchObject(INITIAL_STATE);
            newState = screenExtensionPropertiesPropsToStateReducer(state, {
                extensionDescription: {
                    name: 'def'
                }
            });
            expect(newState).toMatchObject(INITIAL_STATE);
        });
    });
});
