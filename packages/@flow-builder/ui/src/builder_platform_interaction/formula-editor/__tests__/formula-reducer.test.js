import {formulaReducer} from '../formula-reducer';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';

describe('formula-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            "dataType": {
                "value": "Number",
                "error": null
            },
            "expression": {
                "value": "2+2",
                "error": null
            },
            "name": {
                "value": "myFormula",
                "error": null
            },
            "processMetadataValues": [],
            "scale": 1,
            "elementType": "FORMULA",
            "guid": "FORMULA_11",
            "isCanvasElement": false
        };
    });
    describe('CHANGE_DATA_TYPE action', () => {
        it('updates the dataType and scale properties', () => {
            const dataType = 'Currency';
            const scale = 3;
            const action = createAction(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, { value : { dataType, scale } });
            const newState = formulaReducer(originalState, action);
            expect(newState.dataType.value).toEqual('Currency');
            expect(newState.scale).toEqual(3);
            expect(newState).not.toBe(originalState);
        });
        it('updates scale property to 2 by default', () => {
            const dataType = 'Currency';
            const action = createAction(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, { value : { dataType } });
            const newState = formulaReducer(originalState, action);
            expect(newState.dataType.value).toEqual('Currency');
            expect(newState.scale).toEqual(2);
            expect(newState).not.toBe(originalState);
        });
    });
    describe('UPDATE_ELEMENT_PROPERTY action', () => {
        it('updates the property', () => {
            const propertyName = 'expression';
            const value = '4+4';
            const error = null;
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
            const newState = formulaReducer(originalState, action);
            expect(newState.expression.value).toEqual('4+4');
            expect(newState.expression.error).toBe(null);
            expect(newState).not.toBe(originalState);
        });
        it('fetch the error from the action instead of rerunning validation', () => {
            const propertyName = 'expression';
            const value = '4+A';
            const error = 'Formula is not valid';
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
            const newState = formulaReducer(originalState, action);
            expect(newState.expression.value).toEqual(value);
            expect(newState.expression.error).toBe(error);
            expect(newState).not.toBe(originalState);
        });
    });
    it('ignores unknown events', () => {
        const event = {
            type: 'unknown event',
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = formulaReducer(originalState, event);
        expect(resultObj).toBe(originalState);
    });
});