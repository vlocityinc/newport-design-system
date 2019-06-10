import { stageReducer } from '../stageReducer';
import {
    createAction,
    PROPERTY_EDITOR_ACTION
} from 'builder_platform_interaction/actions';

describe('Stage-Reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            stageOrder: 2,
            name: {
                value: 'Stage_Dev_Name',
                error: null
            },
            label: {
                value: 'Stage_Label',
                error: null
            },
            description: {
                value: 'Stage_Description',
                error: null
            },
            processMetadataValues: [],
            elementType: 'STAGE',
            guid: 'STAGE_11',
            isCanvasElement: false,
            isActive: false
        };
    });
    describe('UPDATE_ELEMENT_PROPERTY action', () => {
        it('updates stageOrder properties', () => {
            const propertyName = 'stageOrder';
            const value = '4';
            const error = null;
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                { propertyName, value, error }
            );
            const newState = stageReducer(originalState, action);
            expect(newState.stageOrder.value).toEqual('4');
            expect(newState.stageOrder.error).toBe(null);
            expect(newState).not.toBe(originalState);
        });
        it('updates description properties', () => {
            const propertyName = 'description';
            const value = 'test description';
            const error = null;
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                { propertyName, value, error }
            );
            const newState = stageReducer(originalState, action);
            expect(newState.description.value).toEqual(value);
            expect(newState.description.error).toBe(null);
            expect(newState).not.toBe(originalState);
        });
        it('updates api name properties', () => {
            const propertyName = 'devName';
            const value = 'test name';
            const error = null;
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                { propertyName, value, error }
            );
            const newState = stageReducer(originalState, action);
            expect(newState.devName.value).toEqual(value);
            expect(newState.devName.error).toBe(null);
            expect(newState).not.toBe(originalState);
        });
        it('updates label properties', () => {
            const propertyName = 'label';
            const value = 'test label';
            const error = null;
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                { propertyName, value, error }
            );
            const newState = stageReducer(originalState, action);
            expect(newState.label.value).toEqual(value);
            expect(newState.label.error).toBe(null);
            expect(newState).not.toBe(originalState);
        });
    });
    describe('UPDATE_ELEMENT_VALUE action', () => {
        it('updates active by default value', () => {
            const propertyName = 'isActive';
            const value = true;
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_VALUE,
                { propertyName, value }
            );
            const newState = stageReducer(originalState, action);
            expect(newState.isActive).toEqual(true);
            expect(newState).not.toBe(originalState);
        });
    });
    it('ignores unknown events', () => {
        const event = {
            type: 'unknown event',
            detail: {
                propertyName: 'stageOrder',
                value: '5',
                error: null
            }
        };
        const resultObj = stageReducer(originalState, event);
        expect(resultObj).toBe(originalState);
    });
});
