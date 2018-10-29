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
        outputAssignments: [{
            leftHandSide: 'lhs',
            rightHandSide: 'rhs'
        }]
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

        describe('update the property for propname object', () => {
            const action = {
                type: PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                payload: {
                    propertyName: 'object',
                    value: 'Account',
                    error: null,
                    doValidateProperty: true
                }
            };
            const resultObj = recordChoiceSetReducer(recordChoiceObject, action);

            it('empty outputAssignment is added', () => {
                expect(resultObj.outputAssignments).toMatchObject(
                    [{
                        'leftHandSide': {'error': null, 'value': ''},
                        'rightHandSide': {'error': null, 'value': ''}
                    }]
                );
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

    describe('for action type AddRecordFieldAssignmentEvent', () => {
        const action = {
            type: 'addrecordfieldassignment',
            payload: {
                index: null,
                value: null
            }
        };
        const resultObj = recordChoiceSetReducer(recordChoiceObject, action);

        it('outputAssignment should be added', () => {
            expect(resultObj.outputAssignments).toHaveLength(2);
        });
    });

    describe('for action type UpdateRecordFieldAssignmentEvent', () => {
        const action = {
            type: 'updaterecordfieldassignment',
            payload: {
                index: 0,
                value: {
                    leftHandSide: 'lhs2',
                    rightHandSide: 'rhs2'
                }
            }
        };
        const resultObj = recordChoiceSetReducer(recordChoiceObject, action);

        it('outputAssignment should be updated', () => {
            expect(resultObj.outputAssignments).toHaveLength(1);
        });
    });

    describe('for action type DeleteRecordFieldAssignmentEvent', () => {
        const action = {
            type: 'deleterecordfieldassignment',
            payload: {
                index: 0
            }
        };
        const resultObj = recordChoiceSetReducer(recordChoiceObject, action);

        it('outputAssignment should be deleted', () => {
            expect(resultObj.outputAssignments).toHaveLength(0);
        });
    });

    describe('for action type AddEmptyOutputAssignment', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.ADD_EMPTY_OUTPUT_ASSIGNMENT,
        };
        const resultObj = recordChoiceSetReducer(recordChoiceObject, action);

        it('outputAssignments should just have a single object', () => {
            expect(resultObj.outputAssignments).toHaveLength(1);
        });

        it('emptyOutputAssignment should be added', () => {
            expect(resultObj.outputAssignments[0]).toMatchObject({
                'leftHandSide': {'error': null, 'value': ''},
                'rightHandSide': {'error': null, 'value': ''}
            });
        });
    });

    describe('for action type UpdateOutputAssignmentsBeforeClose', () => {
        const action = {
            type: PROPERTY_EDITOR_ACTION.UPDATE_OUTPUT_ASSIGNMENTS_BEFORE_CLOSE,
        };

        const recordChoiceObjectTwo = {
            elementType: 'RECORD_CHOICE_SET',
            guid: 'guid_1',
            outputAssignments: [{
                leftHandSide: {error: null, value: 'lhs'},
                rightHandSide: {error: null, value: 'rhs'}
            }, {
                leftHandSide: {error: null, value: null},
                rightHandSide: {error: null, value: null}
            }]
        };

        const resultObj = recordChoiceSetReducer(recordChoiceObjectTwo, action);

        it('outputAssignments should just have a single object', () => {
            expect(resultObj.outputAssignments).toHaveLength(1);
        });

        it('outputAssignment should be have the right value', () => {
            expect(resultObj.outputAssignments[0]).toMatchObject({
                'leftHandSide': {'error': null, 'value': 'lhs'},
                'rightHandSide': {'error': null, 'value': 'rhs'}
            });
        });
    });
});

