import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { recordChoiceSetReducer } from '../recordChoiceSetReducer';
describe('Record Choice Set Reducer', () => {
    const recordChoiceObject = {
        elementType: 'RECORD_CHOICE_SET',
        guid: 'guid_1',
        name: {
            value: 'recordChoice1',
            error: null
        },
        description: {
            value: 'This is record choice',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        dataType: {
            value: 'Text',
            error: null
        },
        filterType: {
            value: 'none',
            error: null
        },
        sortField: {
            value: 'AccountSource',
            error: null
        },
        sortOrder: {
            value: 'Asc',
            error: null
        },
        limit: {
            value: '',
            error: null
        },
        filters: [],
    };
    describe('for action type update element property', () => {
        it('update the property', () => {
            const action = {
                type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                payload: {
                    propertyName: 'name',
                    value: 'recChoice',
                    error: null,
                    doValidateProperty: true
                }
            };
            const resultObj = recordChoiceSetReducer(recordChoiceObject, action);
            expect(resultObj.name).toEqual({
                value: 'recChoice',
                error: null
            });
        });
        describe('update the property for propname filtertype', () => {
            const action = {
                type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                payload: {
                    propertyName: 'filterType',
                    value: 'none',
                    error: null,
                    doValidateProperty: true
                }
            };
            const resultObj = recordChoiceSetReducer(recordChoiceObject, action);
            it('filterType is set to none', () => {
                expect(resultObj.filterType).toEqual({
                    value: 'none',
                    error: null
                });
            });
            it('filters should be set to empty array', () => {
                expect(resultObj.filters).toHaveLength(0);
            });
        });
    });
    describe('for action type add filter item', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.ADD_FILTER_ITEM,
        };
        const resultObj = recordChoiceSetReducer(recordChoiceObject, action);
        it('filters should have length 1', () => {
            expect(resultObj.filters).toHaveLength(1);
        });
    });
    describe('for action type update filter item', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_FILTER_ITEM,
            payload: {
                index: 0,
                value: {
                    leftHandSide: {value: 'test', error: null},
                    operator: {value: '', error: null},
                    rightHandSide: {value: '', error: null},
                    rightHandSideDataType: {value: '', error: null}
                }
            }
        };
        const resultObj = recordChoiceSetReducer(recordChoiceObject, action);
        it('lhs should be updated', () => {
            expect(resultObj.filters[0].leftHandSide.value).toBe('test');
        });
    });
    describe('for action type delete filter item', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.DELETE_FILTER_ITEM,
            payload: {
                index: 0
            }
        };
        const resultObj = recordChoiceSetReducer(recordChoiceObject, action);
        it('filter should be deleted and filters length should be set to 0', () => {
            expect(resultObj.filters).toHaveLength(0);
        });
    });
});

