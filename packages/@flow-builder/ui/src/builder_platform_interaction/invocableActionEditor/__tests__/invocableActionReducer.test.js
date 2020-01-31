import { invocableActionReducer } from '../invocableActionReducer';
import {
    MERGE_WITH_PARAMETERS,
    REMOVE_UNSET_PARAMETERS,
    MERGE_WARNING_TYPE
} from 'builder_platform_interaction/calloutEditorLib';
import { getParametersForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { chatterPostActionDetails as mockActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';
import {
    UpdateParameterItemEvent,
    DeleteParameterItemEvent,
    UseAdvancedOptionsSelectionChangedEvent,
    DynamicTypeMappingChangeEvent
} from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    const invocableActionLib = require.requireActual('builder_platform_interaction/invocableActionLib');
    return Object.assign({}, invocableActionLib, {
        getParametersForInvocableAction: jest.fn().mockReturnValue([
            {
                name: 'record',
                dataType: 'sobject',
                sobjectType: 'T__record',
                isInput: true
            },
            {
                name: 'record',
                dataType: 'sobject',
                sobjectType: 'U__record',
                isOuput: true
            }
        ])
    });
});

const getParameterItemsWithName = (parameterItems, name) =>
    parameterItems.filter(parameterItem => parameterItem.name === name);

const originalState = {
    actionName: { value: 'chatterPost', error: null },
    actionType: { value: 'chatterPost', error: null },
    description: { value: 'This is a description', error: null },
    elementType: 'ACTION_CALL',
    guid: '66b95c2c-468d-466b-baaf-5ad964be585e',
    isCanvasElemen: true,
    label: { value: 'Post to Chatter', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'Post_to_Chatter', error: null },
    inputParameters: [
        {
            rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
            name: {
                value: 'subjectNameOrId',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        },
        {
            rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
            name: {
                value: 'text',
                error: null
            },
            value: {
                value: 'This is a message',
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
                error: null
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
                error: null
            },
            valueDataType: 'String'
        }
    ]
};

const outputWithErrorState = {
    actionName: { value: 'chatterPost', error: null },
    actionType: { value: 'chatterPost', error: null },
    description: { value: 'This is a description', error: null },
    elementType: 'ACTION_CALL',
    guid: '66b95c2c-468d-466b-baaf-5ad964be585e',
    isCanvasElemen: true,
    label: { value: 'Post to Chatter', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'Post_to_Chatter', error: null },
    storeOutputAutomatically: false,
    inputParameters: [
        {
            rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
            name: {
                value: 'subjectNameOrId',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
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

const actionWithDynamicallyTypedOutput = {
    actionName: { value: 'chatterPost', error: null },
    actionType: { value: 'chatterPost', error: null },
    dataTypeMappings: [
        {
            rowIndex: 'index1',
            typeName: {
                value: 'T__record',
                error: null
            },
            typeValue: {
                value: 'Account',
                error: null
            }
        },
        {
            rowIndex: 'index2',
            typeName: {
                value: 'U__record',
                error: null
            },
            typeValue: {
                value: 'Case',
                error: null
            }
        }
    ],
    description: { value: 'This is a description', error: null },
    elementType: 'ACTION_CALL',
    guid: '66b95c2c-468d-466b-baaf-5ad964be585e',
    isCanvasElemen: true,
    label: { value: 'Post to Chatter', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'Post_to_Chatter', error: null },
    storeOutputAutomatically: false,
    inputParameters: [
        {
            rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
            name: {
                value: 'record',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        }
    ],
    outputParameters: [
        {
            rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
            name: {
                value: 'record',
                error: null
            },
            value: {
                value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                error: null
            },
            valueDataType: 'reference'
        }
    ]
};

describe('invocable-action-reducer', () => {
    describe('merge parameters', () => {
        let newState;
        beforeEach(() => {
            const event = {
                type: MERGE_WITH_PARAMETERS,
                detail: mockActionDetails.parameters
            };
            newState = invocableActionReducer(originalState, event);
        });
        it('should merge input parameters', () => {
            expect(newState.inputParameters).toHaveLength(5);
        });
        it('should merge output parameters', () => {
            expect(newState.outputParameters).toHaveLength(2);
        });
    });

    describe('remove unset parameters', () => {
        let newState;
        beforeEach(() => {
            // first, merge parameters
            let event = {
                type: MERGE_WITH_PARAMETERS,
                detail: mockActionDetails.parameters
            };
            newState = invocableActionReducer(originalState, event);
            // remove unset parameters
            event = {
                type: REMOVE_UNSET_PARAMETERS
            };
            newState = invocableActionReducer(originalState, event);
        });
        it('should remove unset input parameters', () => {
            expect(newState.inputParameters).toHaveLength(originalState.inputParameters.length);
        });
        it('should remove unset output parameters', () => {
            expect(newState.outputParameters).toHaveLength(originalState.outputParameters.length);
        });
    });

    describe('update parameters', () => {
        it('updates input parameter', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: true,
                    name: 'text',
                    rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
                    value: 'This is a new message',
                    valueDataType: 'String',
                    error: null
                }
            };
            const newState = invocableActionReducer(originalState, event);
            expect(newState.inputParameters).toHaveLength(2);
            expect(newState.inputParameters[1].value.value).toEqual('This is a new message');
        });
        it('updates output parameter', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: false,
                    name: 'feedItemId',
                    rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
                    value: 'feedItemVar',
                    valueDataType: 'reference',
                    error: null
                }
            };
            const newState = invocableActionReducer(originalState, event);
            expect(newState.outputParameters).toHaveLength(2);
            expect(newState.outputParameters[0].value.value).toEqual('feedItemVar');
        });
        it('set then value to null when we assign an empty string', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: false,
                    name: 'feedItemId',
                    rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
                    value: '',
                    valueDataType: 'reference',
                    error: null
                }
            };
            const newState = invocableActionReducer(originalState, event);
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
                detail: mockActionDetails.parameters
            };
            newState = invocableActionReducer(originalState, event);
        });
        it('deletes the duplicate parameter', () => {
            event = new DeleteParameterItemEvent(false, '78g56g57-7843-783b-78h5-785hk64g90g4', 'feedItemId');
            newState = invocableActionReducer(originalState, event);
            expect(newState.outputParameters).toHaveLength(1);
            expect(newState.outputParameters[0].value.value).toEqual('578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f');
        });
        it('removes duplicate warning if there is no more duplicate', () => {
            let duplicateOutputParameters = getParameterItemsWithName(newState.outputParameters, 'feedItemId');
            expect(duplicateOutputParameters[0].warnings).toEqual([MERGE_WARNING_TYPE.DUPLICATE]);
            expect(duplicateOutputParameters[1].warnings).toEqual([MERGE_WARNING_TYPE.DUPLICATE]);
            const rowIndex = duplicateOutputParameters[1].rowIndex;
            event = new DeleteParameterItemEvent(false, rowIndex, 'feedItemId');
            newState = invocableActionReducer(newState, event);
            duplicateOutputParameters = getParameterItemsWithName(newState.outputParameters, 'feedItemId');
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
                    name: 'subjectNameOrId',
                    rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
                    value: 'invalid value',
                    valueDataType: 'reference',
                    error: 'Entered an invalid value'
                }
            };
            const newState = invocableActionReducer(originalState, event);
            expect(newState).not.toBe(originalState);
            expect(newState.inputParameters).toHaveLength(2);
            expect(newState.inputParameters[0].value.value).toEqual('invalid value');
            expect(newState.inputParameters[0].value.error).toEqual('Entered an invalid value');
        });
        it('fetch the error from output parameter', () => {
            const event = {
                type: UpdateParameterItemEvent.EVENT_NAME,
                detail: {
                    isInput: false,
                    name: 'feedItemId',
                    rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
                    value: 'invalid value',
                    valueDataType: 'reference',
                    error: 'Entered an invalid value'
                }
            };
            const newState = invocableActionReducer(originalState, event);
            expect(newState).not.toBe(originalState);
            expect(newState.outputParameters).toHaveLength(2);
            expect(newState.outputParameters[0].value.value).toEqual('invalid value');
            expect(newState.outputParameters[0].value.error).toEqual('Entered an invalid value');
        });
    });
    describe('Automatic output handling', () => {
        let newState, event;
        beforeEach(() => {
            event = new UseAdvancedOptionsSelectionChangedEvent(false);
            newState = invocableActionReducer(outputWithErrorState, event);
        });
        it('Remove errors on UseAdvancedOptionsSelectionChangedEvent', () => {
            expect(newState).not.toBe(outputWithErrorState);
            expect(newState.storeOutputAutomatically).toBe(true);
            expect(newState.outputParameters[0].value).not.toBeDefined();
        });
    });
    describe('data type mappings', () => {
        let newState;
        beforeEach(() => {
            const event = {
                type: DynamicTypeMappingChangeEvent.EVENT_NAME,
                detail: {
                    typeName: 'T__record',
                    typeValue: 'Contact',
                    error: null,
                    rowIndex: 'index1'
                }
            };
            newState = invocableActionReducer(actionWithDynamicallyTypedOutput, event);
        });
        it('updates data type mapping and clears relevant invocable action parameters', () => {
            const dataTypeMappings = [
                {
                    typeName: {
                        value: 'T__record',
                        error: null
                    },
                    typeValue: {
                        value: 'Contact',
                        error: null
                    }
                },
                {
                    typeName: {
                        value: 'U__record',
                        error: null
                    },
                    typeValue: {
                        value: 'Case',
                        error: null
                    }
                }
            ];
            expect(newState.dataTypeMappings).toMatchObject(dataTypeMappings);
            expect(newState.inputParameters).toMatchObject([
                {
                    name: {
                        value: 'record',
                        error: null
                    },
                    value: {
                        value: '',
                        error: null
                    }
                }
            ]);
            expect(newState.outputParameters).toMatchObject([
                {
                    name: {
                        value: 'record',
                        error: null
                    },
                    value: {
                        value: '578b0f58-afd1-4ddb-9d7e-fdfe6ab5703f',
                        error: null
                    }
                }
            ]);
            expect(getParametersForInvocableAction).toBeCalledWith({
                actionName: actionWithDynamicallyTypedOutput.actionName,
                actionType: actionWithDynamicallyTypedOutput.actionType
            });
        });
    });
});
