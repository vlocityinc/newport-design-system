import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { collectionChoiceSetReducer } from '../collectionChoiceSetReducer';

describe('Collection Choice Set Reducer', () => {
    const collectionChoiceObject = {
        elementType: 'COLLECTION_CHOICE_SET',
        guid: 'guid1',
        name: {
            value: 'collectionChoice1',
            error: null
        },
        description: {
            value: 'This is collection choice',
            error: null
        },
        collectionReference: {
            value: '',
            error: null
        },
        dataType: {
            value: 'Text',
            error: null
        },
        displayField: {
            value: null,
            error: null
        },
        valueField: {
            value: '',
            error: null
        }
    };

    describe('for action type update element property', () => {
        it('update the property', () => {
            const action = {
                type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                payload: {
                    propertyName: 'name',
                    value: 'collectionChoice',
                    error: null,
                    doValidateProperty: true
                }
            };
            const resultObj = collectionChoiceSetReducer(collectionChoiceObject, action);

            expect(resultObj.name).toEqual({
                value: 'collectionChoice',
                error: null
            });
        });

        describe('update the property for propname displayField', () => {
            const action = {
                type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                payload: {
                    propertyName: 'displayField',
                    value: 'BillingCity',
                    error: null,
                    doValidateProperty: true
                }
            };
            const resultObj = collectionChoiceSetReducer(collectionChoiceObject, action);

            it('displayField is set to BillingCity', () => {
                expect(resultObj.displayField).toEqual({
                    value: 'BillingCity',
                    error: null
                });
            });
        });
    });
});
