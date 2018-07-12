import {recordLookupReducer} from '../record-lookup-reducer';
import {
    AddRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    AddRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction-events';
import {EXPRESSION_PROPERTY_TYPE} from 'builder_platform_interaction-expression-utils';
import * as store from 'mock-store-data';
import { SORT_ORDER, RECORD_FILTER_CRITERIA } from 'builder_platform_interaction-record-editor-lib';

describe('record-lookup-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            description : { value: '', error: null },
            elementType : 'RECORD_LOOKUP',
            guid : 'RECORDLOOKUP_1',
            isCanvasElement : true,
            label : { value: 'testRecord', error: null },
            name : { value: 'testRecord', error: null },
            outputReference : { value: store.accountSObjectVariableGuid, error: null},
            sortField : { value:'Name', error:null},
            sortOrder : { value: SORT_ORDER.ASC, error: null},
            assignNullValuesIfNoRecordsFound : false,
            outputAssignments : [],
            queriedFields: [
                {field: {value: 'Id', error: null}, rowIndex: "RECORDLOOKUPFIELD_1"},
                {field: {value: 'BillingAddress', error: null}, rowIndex: "RECORDLOOKUPFIELD_2"}],
            object: { value: 'Account', error: ''},
            filterType: { error: null, value: RECORD_FILTER_CRITERIA.ALL},
            filters: [{
                leftHandSide: {value: "Account.BillingAddress", error: null},
                operator: {value: "EqualTo", error: null},
                rightHandSide: {value: "my address", error: null},
                rightHandSideDataType: {value: "String", error: null},
                rowIndex: "RECORDLOOKUPFILTERITEM_1"
            }],
        };
    });
    describe('fetch error', () => {
        it('fetch the error from the entity resource picker change event instead of rerunning validation', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'object',
                    value: 'invalidObject',
                    error: 'errorFromChildComponent'
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState).toBeDefined();
            expect(newState).not.toBe(originalState);
            expect(newState.object.error).toBe('errorFromChildComponent');
        });

        it('fetch the error from the sobject variable picker change event instead of rerunning validation', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'outputReference',
                    value: 'invalidObject',
                    error: 'errorFromChildComponent'
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState).toBeDefined();
            expect(newState.outputReference.error).toBe('errorFromChildComponent');
            expect(newState).not.toBe(originalState);
        });

        it('fetch the error from the sort field picker change event instead of rerunning validation', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'sortField',
                    value: 'invalidObject',
                    error: 'errorFromChildComponent'
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState).toBeDefined();
            expect(newState.sortField.error).toBe('errorFromChildComponent');
            expect(newState).not.toBe(originalState);
        });
    });

    describe('handle list item events', () => {
        it('add a filter item', () => {
            const event = {
                type: AddRecordLookupFilterEvent.EVENT_NAME,
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.filters).toHaveLength(2);
            expect(newState).not.toBe(originalState);
        });
        it('delete a filter item', () => {
            const event = {
                type: DeleteRecordLookupFilterEvent.EVENT_NAME,
                detail: {
                    index: 0,
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.filters).toHaveLength(0);
            expect(newState).not.toBe(originalState);
        });

        it('update the left hand side of a filter item', () => {
            const event = {
                type: UpdateRecordLookupFilterEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'Account.Description', error: null}},
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.filters).toHaveLength(1);
            expect(newState.filters[0].leftHandSide.value).toBe('Account.Description');
            expect(newState).not.toBe(originalState);
        });

        it('add a field', () => {
            const event = {
                type: AddRecordLookupFieldEvent.EVENT_NAME,
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.queriedFields).toHaveLength(3);
            expect(newState).not.toBe(originalState);
        });
        it('delete a field', () => {
            const event = {
                type: DeleteRecordLookupFieldEvent.EVENT_NAME,
                detail: {
                    index: 0,
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.queriedFields).toHaveLength(1);
            expect(newState).not.toBe(originalState);
        });

        it('update a field', () => {
            const event = {
                type: UpdateRecordLookupFieldEvent.EVENT_NAME,
                detail: {
                    index: 1,
                    value: 'Description',
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.queriedFields).toHaveLength(2);
            expect(newState.queriedFields[1].field.value).toBe('Description');
            expect(newState).not.toBe(originalState);
        });
        it('delete a field and reset the blank error of the last field', () => {
            const event = {
                type: DeleteRecordLookupFieldEvent.EVENT_NAME,
                detail: {
                    index: 1,
                }
            };
            originalState.queriedFields.push({field: {value: '', error: 'Can not be blank'}, rowIndex: "RECORDLOOKUPFIELD_3"});
            const newState = recordLookupReducer(originalState, event);
            expect(newState.queriedFields).toHaveLength(2);
            expect(newState.queriedFields[1].field.value).toBe('');
            expect(newState.queriedFields[1].field.error).toBeNull();
        });
    });

    describe('handle property changed event', () => {
        describe('update entity name', () => {
            let newState;
            beforeAll(() => {
                const event = {
                    type: PropertyChangedEvent.EVENT_NAME,
                    detail: {
                        propertyName: 'object',
                        value: 'Account History',
                    }
                };
                newState = recordLookupReducer(originalState, event);
            });
            it('should update entity name', () => {
                expect(newState.object.value).toBe('Account History');
                expect(newState).not.toBe(originalState);
            });
            it('should reset outputReference', () => {
                expect(newState.outputReference.value).toBe('');
            });
            it('should reset sortField', () => {
                expect(newState.sortField.value).toBe('');
            });
            it('should reset filters', () => {
                expect(newState.filters).toHaveLength(1);
                expect(newState.filters[0].leftHandSide.value).toBe('');
            });
            it('should reset queriedFields', () => {
                expect(newState.queriedFields).toHaveLength(2);
                expect(newState.queriedFields[1].field.value).toBe('');
            });
        });

        describe('update sobject variable', () => {
            let newState;
            beforeAll(() => {
                const event = {
                    type: PropertyChangedEvent.EVENT_NAME,
                    detail: {
                        propertyName: 'outputReference',
                        value: 'NewOutputReference',
                    }
                };
                newState = recordLookupReducer(originalState, event);
            });
            it('should update sobject variable name', () => {
                expect(newState.outputReference.value).toBe('NewOutputReference');
                expect(newState).not.toBe(originalState);
            });
            it('should reset queriedFields', () => {
                expect(newState.queriedFields).toHaveLength(2);
                expect(newState.queriedFields[1].field.value).toBe('');
            });
        });

        describe('update sortOrder to NotSorted', () => {
            let newState;
            beforeAll(() => {
                const event = {
                    type: PropertyChangedEvent.EVENT_NAME,
                    detail: {
                        propertyName: 'sortOrder',
                        value: SORT_ORDER.NOT_SORTED,
                    }
                };
                originalState.sortField.value = 'invalidValue';
                originalState.sortField.error = 'You have entered an invalid value';
                newState = recordLookupReducer(originalState, event);
            });
            it('should update sortOrder', () => {
                expect(newState.sortOrder.value).toBe(SORT_ORDER.NOT_SORTED);
                expect(newState).not.toBe(originalState);
            });
            it('should reset sortField error', () => {
                expect(newState.sortField.value).toBe('invalidValue');
                expect(newState.sortField.error).toBeNull();
            });
        });

        describe('update filterType to none', () => {
            let newState;
            beforeAll(() => {
                const event = {
                    type: PropertyChangedEvent.EVENT_NAME,
                    detail: {
                        propertyName: 'filterType',
                        value: RECORD_FILTER_CRITERIA.NONE,
                    }
                };
                originalState.filters[0].leftHandSide.value = 'invalidValue';
                originalState.filters[0].leftHandSide.error = 'You have entered an invalid value';
                newState = recordLookupReducer(originalState, event);
            });
            it('should update filterType', () => {
                expect(newState.filterType.value).toBe(RECORD_FILTER_CRITERIA.NONE);
                expect(newState).not.toBe(originalState);
            });
            it('should reset filter errors', () => {
                expect(newState.filters).toHaveLength(1);
                expect(newState.filters[0].leftHandSide.value).toBe('invalidValue');
                expect(newState.filters[0].leftHandSide.error).toBeNull();
            });
        });
    });
});
