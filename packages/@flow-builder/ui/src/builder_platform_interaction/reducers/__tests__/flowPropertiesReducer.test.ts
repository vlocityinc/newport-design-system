// @ts-nocheck
import reducer from '../flowPropertiesReducer';
import {
    UPDATE_FLOW,
    UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE,
    UPDATE_IS_AUTO_LAYOUT_CANVAS_PROPERTY,
    UPDATE_PROPERTIES,
    UPDATE_APEX_CLASSES,
    UPDATE_ENTITIES,
    ADD_RESOURCE,
    HIGHLIGHT_ON_CANVAS
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
        expect(newPropertiesState.elementType).toEqual(defaultProperties.elementType);
        expect(newPropertiesState.processType).toEqual(defaultProperties.processType);
    });

    it('with state set to defined & action type set to UPDATE_PROPERTIES should return the new state with updated properties', () => {
        const newPropertiesState = reducer(oldProperties, {
            type: UPDATE_PROPERTIES,
            payload: newProperties
        });
        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.name).toEqual(oldProperties.name);
        expect(newPropertiesState.label).toEqual(oldProperties.label);
        expect(newPropertiesState.description).toEqual(oldProperties.description);
        expect(newPropertiesState.processType).toEqual(newProperties.processType);
        expect(newPropertiesState.org).toEqual(newProperties.org);
        expect(newPropertiesState.hasUnsavedChanges).toBe(true);
    });

    it('with state set to undefined & action type set to UPDATE_PROPERTIES should return the new state with the new properties', () => {
        const newPropertiesState = reducer(undefined, {
            type: UPDATE_PROPERTIES,
            payload: newProperties
        });
        expect(newPropertiesState.org).toEqual(newProperties.org);
        expect(newPropertiesState.elementType).toEqual(defaultProperties.elementType);
        expect(newPropertiesState.processType).toEqual(newProperties.processType);
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
        expect(newPropertiesState.description).toEqual(oldProperties.description);
        expect(newPropertiesState.processType).toEqual(newProperties.processType);
        expect(newPropertiesState.org).toEqual(newProperties.org);
        expect(newPropertiesState.hasUnsavedChanges).toBe(false);
    });

    it('with state set to undefined & action type set to UPDATE_FLOW should return the new state with the new flow properties', () => {
        const newPropertiesState = reducer(undefined, {
            type: UPDATE_FLOW,
            payload: { properties: newProperties }
        });
        expect(newPropertiesState.org).toEqual(newProperties.org);
        expect(newPropertiesState.elementType).toEqual(defaultProperties.elementType);
        expect(newPropertiesState.processType).toEqual(newProperties.processType);
        expect(newPropertiesState.hasUnsavedChanges).toBe(false);
    });

    it('with state set to defined & action type set to UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE should return the new state amd update the hasUnsavedChanges accordingly', () => {
        const updatedHasUnsavedChangesProperty = true;
        const newPropertiesState = reducer(oldProperties, {
            type: UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE,
            payload: { updatedHasUnsavedChangesProperty }
        });
        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.name).toEqual(oldProperties.name);
        expect(newPropertiesState.label).toEqual(oldProperties.label);
        expect(newPropertiesState.description).toEqual(oldProperties.description);
        expect(newPropertiesState.processType).toEqual(oldProperties.processType);
        expect(newPropertiesState.org).toEqual(oldProperties.org);
        expect(newPropertiesState.hasUnsavedChanges).toBe(updatedHasUnsavedChangesProperty);
    });

    it('with state set to defined & action type set to UPDATE_IS_AUTO_LAYOUT_CANVAS_PROPERTY should return the new state amd update the isAutoLayoutCanvas accordingly', () => {
        const isAutoLayoutCanvas = true;
        const newPropertiesState = reducer(oldProperties, {
            type: UPDATE_IS_AUTO_LAYOUT_CANVAS_PROPERTY,
            payload: isAutoLayoutCanvas
        });
        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.name).toEqual(oldProperties.name);
        expect(newPropertiesState.label).toEqual(oldProperties.label);
        expect(newPropertiesState.description).toEqual(oldProperties.description);
        expect(newPropertiesState.processType).toEqual(oldProperties.processType);
        expect(newPropertiesState.org).toEqual(oldProperties.org);
        expect(newPropertiesState.hasUnsavedChanges).toBe(oldProperties.hasUnsavedChanges);
        expect(newPropertiesState.isAutoLayoutCanvas).toBe(isAutoLayoutCanvas);
    });

    test.each([UPDATE_APEX_CLASSES, UPDATE_ENTITIES])('should not set hasUnsavedChanges on %s', (action) => {
        const newState = reducer(
            { a: 'b' },
            {
                type: action,
                payload: { properties: { some: 'thing' } }
            }
        );
        expect(newState.hasUnsavedChanges).toBeUndefined();
    });

    it('Should set hasUnsavedChanges to true for ADD_RESOURCE action', () => {
        const newProperties = {
            isAddingResourceViaLeftPanel: false,
            guid: 'guid1'
        };
        const newPropertiesState = reducer(oldProperties, {
            type: ADD_RESOURCE,
            payload: newProperties
        });

        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.hasUnsavedChanges).toBeTruthy();
    });

    it('Should set lastInlineResourceGuid to original lastInlineResourceGuid when isAddingResourceViaLeftPanel is true for ADD_RESOURCE action', () => {
        oldProperties.lastInlineResourceGuid = null;
        const newProperties = {
            isAddingResourceViaLeftPanel: true,
            guid: 'guid1'
        };
        const newPropertiesState = reducer(oldProperties, {
            type: ADD_RESOURCE,
            payload: newProperties
        });

        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.lastInlineResourceGuid).toBeNull();
    });

    it('Should set lastInlineResourceGuid to the passed guid when isAddingResourceViaLeftPanel is false for ADD_RESOURCE action', () => {
        const newProperties = {
            isAddingResourceViaLeftPanel: false,
            guid: 'guid1'
        };
        const newPropertiesState = reducer(oldProperties, {
            type: ADD_RESOURCE,
            payload: newProperties
        });

        expect(newPropertiesState).not.toBe(oldProperties);
        expect(newPropertiesState.lastInlineResourceGuid).toBe(newProperties.guid);
    });

    it('Should not change the state when HIGHLIGHT_ON_CANVAS action is dispatched', () => {
        const newProperties = {};
        const newPropertiesState = reducer(oldProperties, {
            type: HIGHLIGHT_ON_CANVAS,
            payload: newProperties
        });

        expect(newPropertiesState).toBe(oldProperties);
    });
});
