import reducer from '../flowPropertiesReducer';
import {
    UPDATE_FLOW,
    UPDATE_PROPERTIES,
    UPDATE_APEX_CLASSES
} from 'builder_platform_interaction/actions';

const defaultProperties = {
    elementType: 'FLOW_PROPERTIES',
    processType: null
};
const oldProperties = {
    name: 'ass1',
    label: 'assignment 1',
    description: 'desc 1',
    processType: 'ScreenFlow'
};
const newProperties = {
    org: 'salesforce',
    processType: 'OtherProcessType'
};

describe('flow-properties-reducer', () => {
    it('with state set to undefined & action type set to empty should return empty object', () => {
        const newPropertiesState = reducer(undefined, {});
        expect(newPropertiesState.elementType).toEqual(
            defaultProperties.elementType
        );
        expect(newPropertiesState.processType).toEqual(
            defaultProperties.processType
        );
    });

    it('with state set to defined & action type set to UPDATE_PROPERTIES should return the new state with updated properties', () => {
        const newPropertiesState = reducer(oldProperties, {
            type: UPDATE_PROPERTIES,
            payload: newProperties
        });
        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.name).toEqual(oldProperties.name);
        expect(newPropertiesState.label).toEqual(oldProperties.label);
        expect(newPropertiesState.description).toEqual(
            oldProperties.description
        );
        expect(newPropertiesState.processType).toEqual(
            newProperties.processType
        );
        expect(newPropertiesState.org).toEqual(newProperties.org);
        expect(newPropertiesState.hasUnsavedChanges).toBe(true);
    });

    it('with state set to undefined & action type set to UPDATE_PROPERTIES should return the new state with the new properties', () => {
        const newPropertiesState = reducer(undefined, {
            type: UPDATE_PROPERTIES,
            payload: newProperties
        });
        expect(newPropertiesState.org).toEqual(newProperties.org);
        expect(newPropertiesState.elementType).toEqual(
            defaultProperties.elementType
        );
        expect(newPropertiesState.processType).toEqual(
            newProperties.processType
        );
        expect(newPropertiesState.hasUnsavedChanges).toBe(true);
    });

    it('with state set to defined & action type set to UPDATE_FLOW should return the new state with the updated flow properties', () => {
        const newPropertiesState = reducer(oldProperties, {
            type: UPDATE_FLOW,
            payload: { properties: newProperties }
        });
        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.name).toEqual(oldProperties.name);
        expect(newPropertiesState.label).toEqual(oldProperties.label);
        expect(newPropertiesState.description).toEqual(
            oldProperties.description
        );
        expect(newPropertiesState.processType).toEqual(
            newProperties.processType
        );
        expect(newPropertiesState.org).toEqual(newProperties.org);
        expect(newPropertiesState.hasUnsavedChanges).toBe(false);
    });

    it('with state set to undefined & action type set to UPDATE_FLOW should return the new state with the new flow properties', () => {
        const newPropertiesState = reducer(undefined, {
            type: UPDATE_FLOW,
            payload: { properties: newProperties }
        });
        expect(newPropertiesState.org).toEqual(newProperties.org);
        expect(newPropertiesState.elementType).toEqual(
            defaultProperties.elementType
        );
        expect(newPropertiesState.processType).toEqual(
            newProperties.processType
        );
        expect(newPropertiesState.hasUnsavedChanges).toBe(false);
    });

    it('should not set hasUnsavedChanges on UPDATE_APEX_CLASSES', () => {
        const newState = reducer({ a: 'b' }, {
            type: UPDATE_APEX_CLASSES,
            payload: { properties: { some: 'thing' } }
        });
        expect(newState.hasUnsavedChanges).toBeUndefined();
    });
});
