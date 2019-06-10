import { loopReducer } from '../loopReducer';
import {
    PropertyChangedEvent,
    LoopCollectionChangedEvent
} from 'builder_platform_interaction/events';

const IAMERRORED = 'IAMERRORED';
const CANNOTBEBLANKERROR = 'FlowBuilderValidation.cannotBeBlank';
const VARIABLE = 'VARIABLE_GUID';

describe('Loop-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            name: { value: 'testLoop', error: null },
            label: { value: 'testLoop', error: null },
            description: { value: 'test description', error: null },
            assignNextValueToReference: { value: 'VARIABLE_1', error: null },
            collectionReference: { value: 'VARIABLE_2', error: null },
            iterationOrder: { value: 'Asc', error: null },
            elementType: 'LOOP',
            guid: '141f916fee-1c6f3-108bf-1ca54-16c041fcba152a7',
            isCanvasElement: true,
            locationX: 789,
            locationY: 123
        };
    });
    describe('handles loopCollectionChangedEvent event', () => {
        it('updates the loop collection value', () => {
            const event = {
                type: LoopCollectionChangedEvent.EVENT_NAME,
                detail: {
                    collectionValue: VARIABLE,
                    collectionError: null,
                    loopVariableValue: null,
                    loopVariableErrorMessage: null
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.collectionReference.value).toEqual(VARIABLE);
            expect(resultObj.collectionReference.error).toEqual(null);
            expect(resultObj.assignNextValueToReference.value).toEqual(null);
            expect(resultObj.assignNextValueToReference.error).toEqual(null);
        });
        it('updates loop collection value, loop collection error', () => {
            const event = {
                type: LoopCollectionChangedEvent.EVENT_NAME,
                detail: {
                    collectionValue: VARIABLE,
                    collectionError: IAMERRORED,
                    loopVariableValue: null,
                    loopVariableErrorMessage: null
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.collectionReference.value).toEqual(VARIABLE);
            expect(resultObj.collectionReference.error).toEqual(IAMERRORED);
            expect(resultObj.assignNextValueToReference.value).toEqual(null);
            expect(resultObj.assignNextValueToReference.error).toEqual(null);
        });
        it('updates loop variable value, loop variable error and adds cannot be blank error for loop collection error', () => {
            const event = {
                type: LoopCollectionChangedEvent.EVENT_NAME,
                detail: {
                    collectionValue: null,
                    collectionError: null,
                    loopVariableValue: VARIABLE,
                    loopVariableErrorMessage: IAMERRORED
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.collectionReference.value).toEqual(null);
            expect(resultObj.collectionReference.error).toEqual(
                CANNOTBEBLANKERROR
            );
            expect(resultObj.assignNextValueToReference.value).toEqual(
                VARIABLE
            );
            expect(resultObj.assignNextValueToReference.error).toEqual(
                IAMERRORED
            );
        });
        it('updates both loop collection value, loop collection error', () => {
            const event = {
                type: LoopCollectionChangedEvent.EVENT_NAME,
                detail: {
                    collectionValue: VARIABLE,
                    collectionError: IAMERRORED,
                    loopVariableValue: null,
                    loopVariableErrorMessage: null
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.collectionReference.value).toEqual(VARIABLE);
            expect(resultObj.collectionReference.error).toEqual(IAMERRORED);
            expect(resultObj.assignNextValueToReference.value).toEqual(null);
            expect(resultObj.assignNextValueToReference.error).toEqual(null);
        });
        it('updates loop collection value, loop collection error, loop variable value and loop variable error', () => {
            const event = {
                type: LoopCollectionChangedEvent.EVENT_NAME,
                detail: {
                    collectionValue: VARIABLE,
                    collectionError: IAMERRORED,
                    loopVariableValue: VARIABLE,
                    loopVariableErrorMessage: IAMERRORED
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.collectionReference.value).toEqual(VARIABLE);
            expect(resultObj.collectionReference.error).toEqual(IAMERRORED);
            expect(resultObj.assignNextValueToReference.value).toEqual(
                VARIABLE
            );
            expect(resultObj.assignNextValueToReference.error).toEqual(
                IAMERRORED
            );
        });
        it('updates cannot be blank error for only loop collection error', () => {
            const event = {
                type: LoopCollectionChangedEvent.EVENT_NAME,
                detail: {
                    collectionValue: null,
                    collectionError: null,
                    loopVariableValue: null,
                    loopVariableErrorMessage: null
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.collectionReference.value).toEqual(null);
            expect(resultObj.collectionReference.error).toEqual(
                CANNOTBEBLANKERROR
            );
            expect(resultObj.assignNextValueToReference.value).toEqual(null);
            expect(resultObj.assignNextValueToReference.error).toEqual(null);
        });
    });
    describe('loopPropertyChanged event', () => {
        it('updates label value', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'label',
                    value: 'newlabel',
                    error: null
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.label.value).toEqual('newlabel');
            expect(resultObj.label.error).toBe(null);
            expect(resultObj).not.toBe(originalState);
        });
        it('updates error from the property change event instead of rerunning validation', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'label',
                    value: 'label',
                    error: 'errorFromChildComponent'
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.label.value).toEqual('label');
            expect(resultObj.label.error).toBe('errorFromChildComponent');
            expect(resultObj).not.toBe(originalState);
        });
        it('updates the iterationOrder property', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'iterationOrder',
                    value: 'Desc',
                    error: null
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.iterationOrder.value).toEqual('Desc');
            expect(resultObj.iterationOrder.error).toBe(null);
            expect(resultObj).not.toBe(originalState);
        });
        it('updates error from the iterationOrder property', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'iterationOrder',
                    value: 'Asc',
                    error: IAMERRORED
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj.iterationOrder.value).toEqual('Asc');
            expect(resultObj.iterationOrder.error).toBe(IAMERRORED);
            expect(resultObj).not.toBe(originalState);
        });
        it('ignores unknown event which do not need to be handled', () => {
            const event = {
                type: 'unknown event',
                detail: {
                    propertyName: 'label',
                    value: 'newlabel',
                    error: null
                }
            };
            const resultObj = loopReducer(originalState, event);
            expect(resultObj).toBe(originalState);
        });
    });
});
