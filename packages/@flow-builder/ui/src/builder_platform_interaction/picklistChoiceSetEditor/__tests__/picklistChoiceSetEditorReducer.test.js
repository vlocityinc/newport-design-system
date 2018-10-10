import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { picklistChoiceSetReducer } from '../picklistChoiceSetReducer';

describe('Picklist Choice Set Reducer', () => {
    const picklistChoiceSetObject = {
        elementType: {
            value: 'CHOICE',
            error: null
        },
        guid: {
            value: 'guid_1',
            error: null
        },
        name: {
            value: 'pChoice_',
            error: null
        },
        description: {
            value: 'Desc',
            error: null
        },
        picklistObject: {
            value: null,
            error: null
        },
        dataType: {
            value: null,
            error: null
        },
        picklistField: {
            value: null,
            error: null
        },
        sortOrder: {
            value: 'Asc',
            error: null
        }
    };

    it('Updates the property value of type string correctly', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            payload: {
                propertyName: 'name',
                value: 'pChoice',
                error: null,
                doValidateProperty: true
            }
        };
        const resultObj = picklistChoiceSetReducer(picklistChoiceSetObject, action);
        expect(resultObj.name).toEqual({
            value: 'pChoice',
            error: null
        });
    });

    it('Updates the property value of type null correctly', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            payload: {
                propertyName: 'description',
                value: null,
                error: null,
                doValidateProperty: true
            }
        };
        const resultObj = picklistChoiceSetReducer(picklistChoiceSetObject, action);
        expect(resultObj.description).toEqual({
            value: null,
            error: null
        });
    });

    it('Updates undefined property value correctly', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            payload: {
                propertyName: 'picklistObject',
                value: undefined,
                error: null,
                doValidateProperty: true
            }
        };
        const resultObj = picklistChoiceSetReducer(picklistChoiceSetObject, action);
        expect(resultObj.picklistObject).toBeUndefined();
    });

    it('Updating error to null if doValidateProperty is false', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            payload: {
                propertyName: 'dataType',
                value: null,
                error: 'Enter a valid value',
                doValidateProperty: false
            }
        };
        const resultObj = picklistChoiceSetReducer(picklistChoiceSetObject, action);
        expect(resultObj.dataType).toEqual({
            value: null,
            error: null
        });
    });
});