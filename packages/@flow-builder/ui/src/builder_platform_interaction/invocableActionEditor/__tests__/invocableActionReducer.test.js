import { invocableActionReducer } from "../invocableActionReducer";
import { MERGE_WITH_PARAMETERS, REMOVE_UNSET_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';
import { mockActionParameters } from "mock/calloutData";
import {
    UpdateParameterItemEvent,
} from "builder_platform_interaction/events";

describe('invocable-action-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            actionName: {value: 'chatterPost', error: null},
            actionType: {value: 'chatterPost', error: null},
            description : {value: 'This is a description', error: null},
            elementType : 'ACTION_CALL',
            guid : '66b95c2c-468d-466b-baaf-5ad964be585e',
            isCanvasElemen : true,
            label : {value: 'Post to Chatter', error: null},
            locationX : 358,
            locationY : 227,
            name : {value: 'Post_to_Chatter', error: null},
            inputParameters : [
                {
                    rowIndex: '58d8bd82-1977-4cf3-a5a7-f629347fa0e8',
                    name: {
                      value: 'subjectNameOrId',
                      error: null
                    },
                    value: {
                      value: 'textVar',
                      error: null
                    },
                    valueDataType: 'reference',
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
                    valueDataType: 'String',
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
                        value: 'textVar',
                        error: null
                    },
                    valueDataType: 'reference',
                }
            ]
        };
    });

    describe('merge parameters', () => {
        let newState;
        beforeEach(() => {
            const event = {
                    type: MERGE_WITH_PARAMETERS,
                    detail: mockActionParameters
                };
                newState = invocableActionReducer(originalState, event);
        });
        it('should merge input parameters', () => {
            expect(newState.inputParameters).toHaveLength(mockActionParameters.filter(parameter => parameter.isInput === true).length);
        });
        it('should merge output parameters', () => {
            expect(newState.outputParameters).toHaveLength(mockActionParameters.filter(parameter => parameter.isOutput === true).length);
        });
    });

    describe('remove unset parameters', () => {
        let newState;
        beforeEach(() => {
            // first, merge parameters
            let event = {
                    type: MERGE_WITH_PARAMETERS,
                    detail: mockActionParameters
                };
            newState = invocableActionReducer(originalState, event);
            // remove unset parameters
            event = {
                    type:REMOVE_UNSET_PARAMETERS,
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
                    error: null,
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
                    error: null,
                }
            };
            const newState = invocableActionReducer(originalState, event);
            expect(newState.outputParameters).toHaveLength(1);
            expect(newState.outputParameters[0].value.value).toEqual('feedItemVar');
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
                    error: 'Entered an invalid value',
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
                    error: 'Entered an invalid value',
                }
            };
            const newState = invocableActionReducer(originalState, event);
            expect(newState).not.toBe(originalState);
            expect(newState.outputParameters).toHaveLength(1);
            expect(newState.outputParameters[0].value.value).toEqual('invalid value');
            expect(newState.outputParameters[0].value.error).toEqual('Entered an invalid value');
        });
    });
});
