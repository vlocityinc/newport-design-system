import {recordLookupReducer} from "../recordLookupReducer";
import {
    AddRecordFilterEvent,
    UpdateRecordFilterEvent,
    DeleteRecordFilterEvent,
    AddRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    PropertyChangedEvent
} from "builder_platform_interaction/events";
import {EXPRESSION_PROPERTY_TYPE} from "builder_platform_interaction/expressionUtils";
import * as store from "mock/storeData";
import { SORT_ORDER, RECORD_FILTER_CRITERIA, NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";

const recordLookupUsingSobjectState = () => {
    return {
        description : { value: '', error: null },
        elementType : 'RECORD_LOOKUP',
        guid : '724cafc2-7744-4e46-8eaa-f2df29539d1e',
        isCanvasElement : true,
        label : { value: 'testRecord', error: null },
        name : { value: 'testRecord', error: null },
        outputReference : { value: store.accountSObjectVariableGuid, error: null},
        sortField : { value:'Name', error:null},
        sortOrder : SORT_ORDER.ASC,
        assignNullValuesIfNoRecordsFound : true,
        queriedFields: [
            {field: {value: 'Id', error: null}, rowIndex: '73cb7e19-9f98-4b59-9fdd-a276f216ddcf'},
            {field: {value: 'BillingAddress', error: null}, rowIndex: '74cb7e19-9f98-4b59-9fdd-a276f216ddcf'}],
        object: { value: 'Account', error: ''},
        filterType: RECORD_FILTER_CRITERIA.ALL,
        filters: [{
            leftHandSide: {value: "Account.BillingAddress", error: null},
            operator: {value: "EqualTo", error: null},
            rightHandSide: {value: "my address", error: null},
            rightHandSideDataType: {value: "String", error: null},
            rowIndex: "71cb7e19-9f98-4b59-9fdd-a276f216ddcf"
        }],
    };
},
recordLookupUsingFieldsState = () => {
    return {
        description : { value: '', error: null },
        elementType : 'RECORD_LOOKUP',
        guid : '724cafc2-7744-4e46-8eaa-f2df29539d1e',
        isCanvasElement : true,
        label : { value: 'testRecord', error: null },
        name : { value: 'testRecord', error: null },
        sortField : { value:'Name', error:null},
        sortOrder : SORT_ORDER.ASC,
        assignNullValuesIfNoRecordsFound : false,
        queriedFields: [
            {field: {value: 'Id', error: null}, rowIndex: '73cb7e19-9f98-4b59-9fdd-a276f216ddcf'},
            {field: {value: 'BillingAddress', error: null}, rowIndex: '74cb7e19-9f98-4b59-9fdd-a276f216ddcf'}],
        object: { value: 'Account', error: ''},
        filterType: RECORD_FILTER_CRITERIA.ALL,
        filters: [{
            leftHandSide: {value: "Account.BillingAddress", error: null},
            operator: {value: "EqualTo", error: null},
            rightHandSide: {value: "my address", error: null},
            rightHandSideDataType: {value: "String", error: null},
            rowIndex: "72cb7e19-9f98-4b59-9fdd-a276f216ddcf"
        }],
        outputAssignments:[{
            leftHandSide: {value: "Account.BillingCity", error: null},
            rightHandSide: {value: "vCity", error: null},
            rowIndex: "71cb7e19-9f98-4b59-9fdd-a276f216ddcf"
        }],
    };
},
recordLookupUsingFieldsStateEmptyOutPutAssignments = () => {
    return {
        description : { value: '', error: null },
        elementType : 'RECORD_LOOKUP',
        guid : '724cafc2-7744-4e46-8eaa-f2df29539d1e',
        isCanvasElement : true,
        label : { value: 'testRecord', error: null },
        name : { value: 'testRecord', error: null },
        sortField : { value:'Name', error:null},
        sortOrder : SORT_ORDER.ASC,
        assignNullValuesIfNoRecordsFound : false,
        queriedFields: [
            {field: {value: 'Id', error: null}, rowIndex: '73cb7e19-9f98-4b59-9fdd-a276f216ddcf'},
            {field: {value: 'BillingAddress', error: null}, rowIndex: '74cb7e19-9f98-4b59-9fdd-a276f216ddcf'}],
        object: { value: 'Account', error: ''},
        filterType: RECORD_FILTER_CRITERIA.ALL,
        filters: [{
            leftHandSide: {value: "Account.BillingAddress", error: null},
            operator: {value: "EqualTo", error: null},
            rightHandSide: {value: "my address", error: null},
            rightHandSideDataType: {value: "String", error: null},
            rowIndex: "72cb7e19-9f98-4b59-9fdd-a276f216ddcf"
        }],
        outputAssignments:[{
            leftHandSide: {value: "", error: "A value is required."},
            rightHandSide: {value: "", error: "A value is required."},
            rowIndex: "71cb7e19-9f98-4b59-9fdd-a276f216ddcf"
        }, {
            leftHandSide: {value: "", error: "A value is required."},
            rightHandSide: {value: "", error: "A value is required."},
            rowIndex: "71cb7e19-9f98-4b59-9fdd-a276f216ddcf"
        }],
    };
};

describe('record-lookup-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = recordLookupUsingSobjectState();
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
                type: AddRecordFilterEvent.EVENT_NAME,
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.filters).toHaveLength(2);
            expect(newState).not.toBe(originalState);
        });
        it('delete a filter item', () => {
            const event = {
                type: DeleteRecordFilterEvent.EVENT_NAME,
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
                type: UpdateRecordFilterEvent.EVENT_NAME,
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
            it('should update "entity name"', () => {
                expect(newState.object.value).toBe('Account History');
                expect(newState).not.toBe(originalState);
            });
            it('should reset "outputReference"', () => {
                expect(newState.outputReference.value).toBe('');
            });
            it('should reset "sortOrder"', () => {
                expect(newState.sortOrder).toBe(SORT_ORDER.NOT_SORTED);
            });
            it('should reset "sortField"', () => {
                expect(newState.sortField.value).toBe('');
            });
            it('should reset "filterType"', () => {
                expect(newState.filterType).toBe(RECORD_FILTER_CRITERIA.NONE);
            });
            it('should reset "filters"', () => {
                expect(newState.filters).toHaveLength(1);
                expect(newState.filters[0].leftHandSide.value).toBe('');
            });
            it('should reset "queriedFields"', () => {
                expect(newState.queriedFields).toHaveLength(2);
                expect(newState.queriedFields[1].field.value).toBe('');
            });
            it('should reset "numberRecordsToStore"', () => {
                expect(newState.numberRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
            });
            it('should reset "wayToStoreFields"', () => {
                expect(newState.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
            });
            it('should reset "assignNullValuesIfNoRecordsFound"', () => {
                expect(newState.assignNullValuesIfNoRecordsFound).toBe(false);
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
                expect(newState.sortOrder).toBe(SORT_ORDER.NOT_SORTED);
                expect(newState).not.toBe(originalState);
            });
            it('should reset sortField error', () => {
                expect(newState.sortField.value).toBe('invalidValue');
                expect(newState.sortField.error).toBeNull();
            });
            it('should not reset filters', () => {
                expect(newState.filters).toHaveLength(1);
                expect(newState.filters[0].leftHandSide.value).toBe('Account.BillingAddress');
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
                expect(newState.filterType).toBe(RECORD_FILTER_CRITERIA.NONE);
                expect(newState).not.toBe(originalState);
            });
            it('should reset filter errors and value', () => {
                expect(newState.filters).toHaveLength(1);
                expect(newState.filters[0].leftHandSide.value).toBe('');
                expect(newState.filters[0].leftHandSide.error).toBeNull();
            });
        });
    });
});

describe('record-lookup-reducer - State with sObject', () => {
    let originalState;
    beforeEach(() => {
        originalState = recordLookupUsingSobjectState();
    });
    describe('fetch error', () => {
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
    });

    describe('handle list item events', () => {
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
            it('should update "outputReference" (sobject variable name)', () => {
                expect(newState.outputReference.value).toBe('NewOutputReference');
                expect(newState).not.toBe(originalState);
            });
            it('should reset "queriedFields"', () => {
                expect(newState.queriedFields).toHaveLength(2);
                expect(newState.queriedFields[1].field.value).toBe('');
            });
        });
        describe('update sobject variable with same current value', () => {
            it('should NOT reset "queriedFields"', () => {
                const currentOutputReferenceValue = recordLookupUsingSobjectState().outputReference.value;
                const propChangedEvent = new PropertyChangedEvent('outputReference', currentOutputReferenceValue, null, null, currentOutputReferenceValue);
                const newState = recordLookupReducer(originalState, propChangedEvent);
                expect(newState.queriedFields).toHaveLength(2);
                expect(newState.queriedFields[1].field.value).toBe('BillingAddress');
            });
        });
        describe('update numberRecordsToStore from First Record to All Records', () => {
            let newState;
            beforeAll(() => {
                originalState = recordLookupUsingSobjectState();
                const propertyName = 'numberRecordsToStore';
                const value = NUMBER_RECORDS_TO_STORE.ALL_RECORDS;
                const error = null;
                const propChangedEvent = new PropertyChangedEvent(propertyName, value, error, null, originalState.outputReference.value);
                propChangedEvent.detail.ignoreValidate = true;
                newState = recordLookupReducer(originalState, propChangedEvent);
            });
            it('should reset outputReference', () => {
                expect(newState.outputReference.value).toBe('');
            });
        });
        describe('update numberRecordsToStore from All Records to First Record', () => {
            let newState;
            beforeAll(() => {
                const propertyName = 'numberRecordsToStore';
                const value = NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
                const error = null;
                const propChangedEvent = new PropertyChangedEvent(propertyName, value, error, null, originalState.object.value);
                propChangedEvent.detail.ignoreValidate = true;
                newState = recordLookupReducer(originalState, propChangedEvent);
            });
            it('should reset outputReference', () => {
                expect(newState.outputReference.value).toBe('');
            });
        });
        describe('update wayToStoreFields from sObject to SeparateVariable', () => {
            let newState;
            beforeAll(() => {
                const propertyName = 'wayToStoreFields';
                const value = WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES;
                const error = null;
                const propChangedEvent = new PropertyChangedEvent(propertyName, value, error, null);
                propChangedEvent.detail.ignoreValidate = true;
                newState = recordLookupReducer(originalState, propChangedEvent);
            });
            it('should reset inputReference', () => {
                expect(newState.outputReference.value).toBe('');
            });
            it('should reset queriedFields', () => {
                expect(newState.queriedFields).toHaveLength(2);
                expect(newState.queriedFields[1].field.value).toBe('');
            });
        });
    });
});

describe('record-lookup-reducer - State with Fields', () => {
    let originalState;
    beforeEach(() => {
        originalState = recordLookupUsingFieldsState();
    });
    describe('handle list item events', () => {
        it('add an assignment item', () => {
            const event = {
                type: AddRecordFieldAssignmentEvent.EVENT_NAME,
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.outputAssignments).toHaveLength(2);
            expect(newState).not.toBe(originalState);
        });
        it('delete an assignment item', () => {
            const event = {
                type: DeleteRecordFieldAssignmentEvent.EVENT_NAME,
                detail: {
                    index: 0,
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.outputAssignments).toHaveLength(0);
            expect(newState).not.toBe(originalState);
        });
        it('update the left hand side of an assignment item', () => {
            const event = {
                type: UpdateRecordFieldAssignmentEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'Account.Description', error: null}},
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.outputAssignments).toHaveLength(1);
            expect(newState.outputAssignments[0].leftHandSide.value).toBe('Account.Description');
            expect(newState).not.toBe(originalState);
        });
    });
});

describe('record-lookup-reducer - State with Fields and errors', () => {
    let originalState;
    beforeEach(() => {
        originalState = recordLookupUsingFieldsStateEmptyOutPutAssignments();
    });
    describe('handle list item events', () => {
        describe('delete an assignment item', () => {
           it('Should reset the error if only one output assignment left and its value is ""', () => {
              const event = {
                type: DeleteRecordFieldAssignmentEvent.EVENT_NAME,
                detail: {
                    index: 0,
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.outputAssignments).toHaveLength(1);
            expect(newState.outputAssignments[0]).toMatchObject({
                leftHandSide: {value: '', error: null},
                rightHandSide: {value: '', error: null}
            });
           });
        });
    });
});

describe('record-lookup-reducer - State with errors', () => {
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
            sortOrder : SORT_ORDER.ASC,
            assignNullValuesIfNoRecordsFound : false,
            outputAssignments : [],
            queriedFields: [
                {field: {value: 'Id', error: null}, rowIndex: '76cb7e19-9f98-4b59-9fdd-a276f216ddcf'},
                {field: {value: 'BillingAddress', error: null}, rowIndex: '77cb7e19-9f98-4b59-9fdd-a276f216ddcf'},
                {field: {value: 'BillingAddress', error: "DuplicateValue"}, rowIndex: '78cb7e19-9f98-4b59-9fdd-a276f216ddcf'}],
            object: { value: 'Account', error: ''},
            filterType: RECORD_FILTER_CRITERIA.NONE,
            filters: [{ }],
        };
    });
    describe('handle list item events', () => {
        it('delete a duplicate field', () => {
            const event = {
                type: DeleteRecordLookupFieldEvent.EVENT_NAME,
                detail: {
                    index: 1,
                }
            };
            const newState = recordLookupReducer(originalState, event);
            expect(newState.queriedFields).toHaveLength(2);
            expect(newState).not.toBe(originalState);
            expect(newState.queriedFields[1].field.error).toBeNull();
        });
    });
});
