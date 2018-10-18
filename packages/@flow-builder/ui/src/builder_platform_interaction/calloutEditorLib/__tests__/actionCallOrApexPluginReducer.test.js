import { updateParameterItem, mergeWithInputOutputParameters, removeUnsetParameters } from '../calloutEditorLib';
import { mockActionParameters } from 'mock/calloutData';

describe('action-call-and-apex-plugin-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
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
            newState = mergeWithInputOutputParameters(originalState, mockActionParameters);
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
            newState = mergeWithInputOutputParameters(originalState, mockActionParameters);
            // remove unset parameters
            newState = removeUnsetParameters(originalState);
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
            const param = {
                    isInput: true,
                    name: 'text',
                    rowIndex: '84b6d19d-718f-452d-9803-fe97a263f76c',
                    value: 'This is a new message',
                    valueDataType: 'String',
                    error: null,
            };
            const newState = updateParameterItem(originalState, param);
            expect(newState.inputParameters).toHaveLength(2);
            expect(newState.inputParameters[1].value.value).toEqual('This is a new message');
        });
        it('updates output parameter', () => {
            const param = {
                    isInput: false,
                    name: 'feedItemId',
                    rowIndex: 'a27f10fb-5858-474c-8f87-0fc38a5c7ebf',
                    value: 'feedItemVar',
                    valueDataType: 'reference',
                    error: null,
            };
            const newState = updateParameterItem(originalState, param);
            expect(newState.outputParameters).toHaveLength(1);
            expect(newState.outputParameters[0].value.value).toEqual('feedItemVar');
        });
    });
});
