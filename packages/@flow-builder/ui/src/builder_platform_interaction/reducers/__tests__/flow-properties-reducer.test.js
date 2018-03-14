import reducer from '../flow-properties-reducer';
import { UPDATE_FLOW, UPDATE_PROPERTIES  } from 'builder_platform_interaction-actions';

const oldProperties = {
    name: 'ass1',
    label: 'assignment 1',
    description: 'desc 1'
};
const newProperties = {
    org: 'salesforce'
};

describe('flow-properties-reducer', () => {
    it('with state set to undefined & action type set to empty should return empty object', () => {
        expect(reducer(undefined, {})).toEqual({});
    });

    it('with state set to defined & action type set to empty should return the current state object', () => {
        const newPropertiesState = reducer(oldProperties, {});
        expect(newPropertiesState).toEqual(oldProperties);
    });

    it('with state set to defined & action type set to UPDATE_PROPERTIES should return the new state with updated properties', () => {
        const newPropertiesState = reducer(oldProperties, {type: UPDATE_PROPERTIES, payload: {properties: newProperties }});
        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.name).toEqual(oldProperties.name);
        expect(newPropertiesState.label).toEqual(oldProperties.label);
        expect(newPropertiesState.description).toEqual(oldProperties.description);
        expect(newPropertiesState.org).toEqual(newProperties.org);
    });

    it('with state set to undefined & action type set to UPDATE_PROPERTIES should return the new state with the new properties', () => {
        const newPropertiesState = reducer(undefined, {type: UPDATE_PROPERTIES, payload: {properties: newProperties }});
        expect(newPropertiesState).toEqual(newProperties);
    });

    it('with state set to defined & action type set to UPDATE_FLOW should return the new state with the updated flow properties', () => {
        const newPropertiesState = reducer(oldProperties, {type: UPDATE_FLOW, payload: {properties: newProperties }});
        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.name).toEqual(oldProperties.name);
        expect(newPropertiesState.label).toEqual(oldProperties.label);
        expect(newPropertiesState.description).toEqual(oldProperties.description);
        expect(newPropertiesState.org).toEqual(newProperties.org);
    });

    it('with state set to undefined & action type set to UPDATE_FLOW should return the new state with the new flow properties', () => {
        const newPropertiesState = reducer(undefined, {type: UPDATE_FLOW, payload: {properties: newProperties }});
        expect(newPropertiesState).toEqual(newProperties);
    });
});