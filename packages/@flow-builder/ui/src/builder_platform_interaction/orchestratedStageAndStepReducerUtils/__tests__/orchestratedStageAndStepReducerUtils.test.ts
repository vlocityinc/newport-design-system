// @ts-nocheck
import {
    mergeParameters,
    PARAMETER_PROPERTY,
    removeUnsetParameters,
    updateParameterItem
} from 'builder_platform_interaction/orchestratedStageAndStepReducerUtils';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';

const mockMultiParamPropertiesObject = {
    [PARAMETER_PROPERTY.INPUT]: [
        {
            name: { value: 'actionInput__stepDescription' },
            value: { value: 'step description' },
            rowIndex: 'step_actionInput__stepDescriptionGuid'
        },
        {
            name: { value: 'actionInput__stepLabel' },
            value: { value: 'step_label' },
            rowIndex: 'step_actionInput__stepLabelGuid'
        }
    ],
    [PARAMETER_PROPERTY.ENTRY_INPUT]: [
        {
            name: { value: 'actionInput__stepDescription' },
            value: { value: 'step description' },
            rowIndex: 'entry_actionInput__stepDescriptionGuid'
        },
        {
            name: { value: 'actionInput__stepLabel' },
            value: { value: 'step_label' },
            rowIndex: 'entry_actionInput__stepLabelGuid'
        }
    ],
    [PARAMETER_PROPERTY.EXIT_INPUT]: [
        {
            name: { value: 'actionInput__stepDescription' },
            value: { value: 'step description' },
            rowIndex: 'exit_actionInput__stepDescriptionGuid'
        },
        {
            name: { value: 'actionInput__stepLabel' },
            value: { value: 'step_label' },
            rowIndex: 'exit_actionInput__stepLabelGuid'
        }
    ]
};

let originalState;
let updateParams;

describe('OrchestratedStageAndStepReducerUtils', () => {
    beforeEach(() => {
        originalState = {
            [PARAMETER_PROPERTY.INPUT]: [],
            [PARAMETER_PROPERTY.ENTRY_INPUT]: [],
            [PARAMETER_PROPERTY.EXIT_INPUT]: []
        };
        updateParams = [
            { name: 'ip1', isInput: true },
            { name: 'ip2', isInput: true }
        ];
    });
    describe('mergeParameters', () => {
        it('only updates step parameters', () => {
            // Act
            const newState = mergeParameters(originalState, updateParams, ORCHESTRATED_ACTION_CATEGORY.STEP);

            // Assert
            expect(newState.inputParameters.length).toStrictEqual(2);
            expect(newState.entryActionInputParameters.length).toStrictEqual(0);
            expect(newState.exitActionInputParameters.length).toStrictEqual(0);
        });

        it('only updates entry parameters', () => {
            // Act
            const newState = mergeParameters(originalState, updateParams, ORCHESTRATED_ACTION_CATEGORY.ENTRY);

            // Assert
            expect(newState.inputParameters.length).toStrictEqual(0);
            expect(newState.entryActionInputParameters.length).toStrictEqual(2);
            expect(newState.exitActionInputParameters.length).toStrictEqual(0);
        });

        it('only updates exit parameters', () => {
            // Act
            const newState = mergeParameters(originalState, updateParams, ORCHESTRATED_ACTION_CATEGORY.EXIT);

            // Assert
            expect(newState.inputParameters.length).toStrictEqual(0);
            expect(newState.entryActionInputParameters.length).toStrictEqual(0);
            expect(newState.exitActionInputParameters.length).toStrictEqual(2);
        });
    });

    describe('updateParameterItem', () => {
        it('updates a parameter for the inputParameters property', () => {
            const newParamVal = 'new description';
            const updatedParam = updateProperties(mockMultiParamPropertiesObject[PARAMETER_PROPERTY.INPUT][0], {
                value: newParamVal
            });

            const newState = updateParameterItem(mockMultiParamPropertiesObject, updatedParam);

            expect(newState[PARAMETER_PROPERTY.INPUT][0].value.value).toStrictEqual(newParamVal);
        });

        it('updates a parameter for the entryActionInputParameters property', () => {
            const newParamVal = 'new description';
            const updatedParam = updateProperties(mockMultiParamPropertiesObject[PARAMETER_PROPERTY.ENTRY_INPUT][0], {
                value: newParamVal
            });

            const newState = updateParameterItem(mockMultiParamPropertiesObject, updatedParam);

            expect(newState[PARAMETER_PROPERTY.ENTRY_INPUT][0].value.value).toStrictEqual(newParamVal);
        });

        it('updates a parameter for the exitActionInputParameters property', () => {
            const newParamVal = 'new description';
            const updatedParam = updateProperties(mockMultiParamPropertiesObject[PARAMETER_PROPERTY.EXIT_INPUT][0], {
                value: newParamVal
            });

            const newState = updateParameterItem(mockMultiParamPropertiesObject, updatedParam);

            expect(newState[PARAMETER_PROPERTY.EXIT_INPUT][0].value.value).toStrictEqual(newParamVal);
        });

        it('returns the original state when the rowIndex is not found in the configured list', () => {
            const param = {
                name: { value: 'actionInput__stepDescription' },
                value: { value: 'step description' },
                rowIndex: 'other_actionInput__stepDescriptionGuid'
            };

            const newState = updateParameterItem(mockMultiParamPropertiesObject, param);

            expect(newState).toBe(mockMultiParamPropertiesObject);
        });
    });

    describe('removeUnsetParameters', () => {
        it('removes from input parameters', () => {
            const unsetParam = updateProperties(
                mockMultiParamPropertiesObject[PARAMETER_PROPERTY.INPUT][0].value.value,
                null
            );
            const updatePropValue = {
                [PARAMETER_PROPERTY.INPUT]: [unsetParam, mockMultiParamPropertiesObject[PARAMETER_PROPERTY.INPUT][1]]
            };
            const stateWithUnsetParam = updateProperties(mockMultiParamPropertiesObject, updatePropValue);

            const newState = removeUnsetParameters(
                stateWithUnsetParam,
                stateWithUnsetParam[PARAMETER_PROPERTY.INPUT][0].rowIndex
            );

            expect(newState[PARAMETER_PROPERTY.INPUT].length).toStrictEqual(1);
            expect(newState[PARAMETER_PROPERTY.ENTRY_INPUT].length).toStrictEqual(2);
            expect(newState[PARAMETER_PROPERTY.EXIT_INPUT].length).toStrictEqual(2);
        });

        it('removes from entry input parameters', () => {
            const unsetParam = updateProperties(
                mockMultiParamPropertiesObject[PARAMETER_PROPERTY.ENTRY_INPUT][0].value.value,
                null
            );
            const updatePropValue = {
                [PARAMETER_PROPERTY.ENTRY_INPUT]: [
                    unsetParam,
                    mockMultiParamPropertiesObject[PARAMETER_PROPERTY.ENTRY_INPUT][1]
                ]
            };
            const stateWithUnsetParam = updateProperties(mockMultiParamPropertiesObject, updatePropValue);

            const newState = removeUnsetParameters(
                stateWithUnsetParam,
                stateWithUnsetParam[PARAMETER_PROPERTY.ENTRY_INPUT][0].rowIndex
            );

            expect(newState[PARAMETER_PROPERTY.INPUT].length).toStrictEqual(2);
            expect(newState[PARAMETER_PROPERTY.ENTRY_INPUT].length).toStrictEqual(1);
            expect(newState[PARAMETER_PROPERTY.EXIT_INPUT].length).toStrictEqual(2);
        });

        it('removes from exit input parameters', () => {
            const unsetParam = updateProperties(
                mockMultiParamPropertiesObject[PARAMETER_PROPERTY.EXIT_INPUT][0].value.value,
                null
            );
            const updatePropValue = {
                [PARAMETER_PROPERTY.EXIT_INPUT]: [
                    unsetParam,
                    mockMultiParamPropertiesObject[PARAMETER_PROPERTY.EXIT_INPUT][1]
                ]
            };
            const stateWithUnsetParam = updateProperties(mockMultiParamPropertiesObject, updatePropValue);

            const newState = removeUnsetParameters(
                stateWithUnsetParam,
                stateWithUnsetParam[PARAMETER_PROPERTY.EXIT_INPUT][0].rowIndex
            );

            expect(newState[PARAMETER_PROPERTY.INPUT].length).toStrictEqual(2);
            expect(newState[PARAMETER_PROPERTY.ENTRY_INPUT].length).toStrictEqual(2);
            expect(newState[PARAMETER_PROPERTY.EXIT_INPUT].length).toStrictEqual(1);
        });

        it('returns original state when called with other rowIndex', () => {
            const unsetParam = updateProperties(
                mockMultiParamPropertiesObject[PARAMETER_PROPERTY.EXIT_INPUT][0].value.value,
                null
            );
            const updatePropValue = {
                [PARAMETER_PROPERTY.EXIT_INPUT]: [
                    unsetParam,
                    mockMultiParamPropertiesObject[PARAMETER_PROPERTY.EXIT_INPUT][1]
                ]
            };
            const stateWithUnsetParam = updateProperties(mockMultiParamPropertiesObject, updatePropValue);
            const newState = removeUnsetParameters(stateWithUnsetParam, 'invalid_row_index');
            expect(newState).toBe(stateWithUnsetParam);
        });
    });
});
