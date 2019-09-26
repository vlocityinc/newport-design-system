import { apexPluginReducer } from '../apexPluginReducer';
import {
    MERGE_WITH_PARAMETERS,
    REMOVE_UNSET_PARAMETERS,
    MERGE_WARNING_TYPE
} from 'builder_platform_interaction/calloutEditorLib';
import { mockApexPluginParameters } from 'mock/calloutData';
import {
    UpdateParameterItemEvent,
    DeleteParameterItemEvent,
    UseAdvancedOptionsSelectionChangedEvent
} from 'builder_platform_interaction/events';

const getParameterItemsWithName = (parameterItems, name) =>
    parameterItems.filter(parameterItem => parameterItem.name === name);
const originalState = {
    apexClass: { value: 'flowchat', error: null },
    description: { value: '', error: null },
    elementType: 'APEX_PLUGIN_CALL',
    guid: '6b35c757-1d0f-442e-acb6-6ac8f098ea1f',
    isCanvasElemen: true,
    label: { value: 'flowchat', error: null },
    locationX: 5,
    locationY: 165,
    name: { value: 'flowchat', error: null },
    inputParameters: [
        {
            rowIndex: '2067b573-86d6-4bd7-b906-8fc01a7e889a',
            name: {
                value: 'Name',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        },
        {
            rowIndex: 'd58427c8-7db3-458c-b698-a2de1ed3f2f0',
            name: {
                value: 'Phone',
                error: null
            },
            value: {
                value: '0123456789',
                error: null
            },
            valueDataType: 'String'
        }
    ],
    outputParameters: [
        {
            rowIndex: '41d02758-f34f-4207-9bf2-42e2c9930100',
            name: {
                value: 'AccountId',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        },
        {
            rowIndex: '36h89634-h4k5-4698-0k78-2867b56d4j4d',
            name: {
                value: 'AccountId',
                error: null
            },
            value: {
                value: 'My account Id',
                error: null
            },
            valueDataType: 'String'
        }
    ]
};

const outputWithErrorState = {
    apexClass: { value: 'flowchat', error: null },
    description: { value: '', error: null },
    elementType: 'APEX_PLUGIN_CALL',
    guid: '6b35c757-1d0f-442e-acb6-6ac8f098ea1f',
    isCanvasElemen: true,
    label: { value: 'flowchat', error: null },
    locationX: 5,
    locationY: 165,
    name: { value: 'flowchat', error: null },
    storeOutputAutomatically: false,
    inputParameters: [
        {
            rowIndex: '2067b573-86d6-4bd7-b906-8fc01a7e889a',
            name: {
                value: 'Name',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        },
        {
            rowIndex: 'd58427c8-7db3-458c-b698-a2de1ed3f2f0',
            name: {
                value: 'Phone',
                error: null
            },
            value: {
                value: '0123456789',
                error: null
            },
            valueDataType: 'String'
        }
    ],
    outputParameters: [
        {
            rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
            name: {
                value: 'feedItemId',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: 'Invalid value'
            },
            valueDataType: 'reference'
        },
        {
            rowIndex: '78g56g57-7843-783b-78h5-785hk64g90g4',
            name: {
                value: 'feedItemId',
                error: null
            },
            value: {
                value: 'My feed Id',
                error: 'Invalid value'
            },
            valueDataType: 'String'
        }
    ]
};

describe('apex-plugin-reducer', () => {
    describe('merge parameters', () => {
        let newState;
        beforeEach(() => {
            const event = {
                type: MERGE_WITH_PARAMETERS,
                detail: mockApexPluginParameters
            };
            newState = apexPluginReducer(originalState, event);
        });
        it('should merge input parameters', () => {
            expect(newState.inputParameters).toHaveLength(4);
        });
        it('should merge output parameters', () => {
            expect(newState.outputParameters).toHaveLength(3);
        });
    });

    describe('remove unset parameters', () => {
        let newState;
        beforeEach(() => {
            // first, merge parameters
            let event = {
                type: MERGE_WITH_PARAMETERS,
                detail: mockApexPluginParameters
            };
            newState = apexPluginReducer(originalState, event);
            // remove unset parameters
            event = {
                type: REMOVE_UNSET_PARAMETERS
            };
            newState = apexPluginReducer(originalState, event);
        });
        it('should remove unset input parameters', () => {
            expect(newState.inputParameters).toHaveLength(
                originalState.inputParameters.length
            );
        });
        it('should remove unset output parameters', () => {
            expect(newState.outputParameters).toHaveLength(
                originalState.outputParameters.length
            );
        });
    });

    describe('update parameters', () => {
        it('updates input parameter', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: true,
                    name: 'Phone',
                    rowIndex: 'd58427c8-7db3-458c-b698-a2de1ed3f2f0',
                    value: 'newPhoneNumber',
                    valueDataType: 'String',
                    error: null
                }
            };
            const newState = apexPluginReducer(originalState, event);
            expect(newState.inputParameters).toHaveLength(2);
            expect(newState.inputParameters[1].value.value).toEqual(
                'newPhoneNumber'
            );
        });
        it('updates output parameter', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: false,
                    name: 'AccountId',
                    rowIndex: '41d02758-f34f-4207-9bf2-42e2c9930100',
                    value: 'accountIdVar',
                    valueDataType: 'reference',
                    error: null
                }
            };
            const newState = apexPluginReducer(originalState, event);
            expect(newState.outputParameters).toHaveLength(2);
            expect(newState.outputParameters[0].value.value).toEqual(
                'accountIdVar'
            );
        });
        it('set then value to null when we assign an empty string', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: false,
                    name: 'AccountId',
                    rowIndex: '41d02758-f34f-4207-9bf2-42e2c9930100',
                    value: '',
                    valueDataType: 'reference',
                    error: null
                }
            };
            const newState = apexPluginReducer(originalState, event);
            expect(newState.outputParameters).toHaveLength(2);
            expect(newState.outputParameters[0].value.value).toBeNull();
        });
    });

    describe('delete parameter', () => {
        let newState, event;
        beforeEach(() => {
            // first, merge parameters
            event = {
                type: MERGE_WITH_PARAMETERS,
                detail: mockApexPluginParameters
            };
            newState = apexPluginReducer(originalState, event);
        });
        it('deletes the duplicate parameter', () => {
            event = new DeleteParameterItemEvent(
                false,
                '36h89634-h4k5-4698-0k78-2867b56d4j4d',
                'AccountId'
            );
            newState = apexPluginReducer(originalState, event);
            expect(newState.outputParameters).toHaveLength(1);
            expect(newState.outputParameters[0].value.value).toEqual(
                '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f'
            );
        });
        it('removes duplicate warning if there is no more duplicate', () => {
            let duplicateOutputParameters = getParameterItemsWithName(
                newState.outputParameters,
                'AccountId'
            );
            expect(duplicateOutputParameters[0].warnings).toEqual([
                MERGE_WARNING_TYPE.DUPLICATE
            ]);
            expect(duplicateOutputParameters[1].warnings).toEqual([
                MERGE_WARNING_TYPE.DUPLICATE
            ]);
            const rowIndex = duplicateOutputParameters[1].rowIndex;
            event = new DeleteParameterItemEvent(false, rowIndex, 'AccountId');
            newState = apexPluginReducer(newState, event);
            duplicateOutputParameters = getParameterItemsWithName(
                newState.outputParameters,
                'AccountId'
            );
            expect(duplicateOutputParameters).toHaveLength(1);
            expect(duplicateOutputParameters[0].warnings).toEqual([]);
        });
    });

    describe('fetch error', () => {
        it('fetch the error from the input parameter', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: true,
                    name: 'Name',
                    rowIndex: '2067b573-86d6-4bd7-b906-8fc01a7e889a',
                    value: 'invalid value',
                    valueDataType: 'reference',
                    error: 'Entered an invalid value'
                }
            };
            const newState = apexPluginReducer(originalState, event);
            expect(newState).not.toBe(originalState);
            expect(newState.inputParameters).toHaveLength(2);
            expect(newState.inputParameters[0].value.value).toEqual(
                'invalid value'
            );
            expect(newState.inputParameters[0].value.error).toEqual(
                'Entered an invalid value'
            );
        });
        it('fetch the error from output parameter', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: false,
                    name: 'AccountId',
                    rowIndex: '41d02758-f34f-4207-9bf2-42e2c9930100',
                    value: 'invalid value',
                    valueDataType: 'reference',
                    error: 'Entered an invalid value'
                }
            };
            const newState = apexPluginReducer(originalState, event);
            expect(newState).not.toBe(originalState);
            expect(newState.outputParameters).toHaveLength(2);
            expect(newState.outputParameters[0].value.value).toEqual(
                'invalid value'
            );
            expect(newState.outputParameters[0].value.error).toEqual(
                'Entered an invalid value'
            );
        });
    });
    describe('Automatic output handling', () => {
        let newState, event;
        beforeEach(() => {
            event = new UseAdvancedOptionsSelectionChangedEvent(false);
            newState = apexPluginReducer(outputWithErrorState, event);
        });
        it('Remove errors on UseAdvancedOptionsSelectionChangedEvent', () => {
            expect(newState).not.toBe(outputWithErrorState);
            expect(newState.storeOutputAutomatically).toBe(true);
            expect(newState.outputParameters[0].value).not.toBeDefined();
            expect(newState.outputParameters[1].value).not.toBeDefined();
        });
    });
});
