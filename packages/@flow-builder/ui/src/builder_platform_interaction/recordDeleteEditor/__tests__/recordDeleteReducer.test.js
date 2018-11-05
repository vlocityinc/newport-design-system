import {recordDeleteReducer} from '../recordDeleteReducer';
import {AddRecordFilterEvent, UpdateRecordFilterEvent, DeleteRecordFilterEvent, PropertyChangedEvent} from "builder_platform_interaction/events";
import {EXPRESSION_PROPERTY_TYPE} from "builder_platform_interaction/expressionUtils";
import { NUMBER_RECORDS_TO_STORE } from "builder_platform_interaction/recordEditorLib";

const INPUT_REFERENCE_PROPERTY_NAME = 'inputReference', OBJECT_PROPERTY_NAME = 'object', FILTERS_PROPERTY_NAME = 'filters',
    NUMBER_OF_RECORDS_PROPERTY_NAME = 'numberRecordsToStore', MOCK_GUID = '724cafc2-7744-4e46-8eaa-f2df29539d1d';

const recordDeleteUsingSobjectState = () => {
    return {
        description : {value: '', error: null},
        elementType : 'RECORD_DELETE',
        guid : MOCK_GUID,
        isCanvasElement : true,
        label : {value: 'recordDeleteWithSObject', error: null},
        locationX : 358,
        locationY : 227,
        name : {value: 'record_delete_with_sobject', error: null},
        processMetadataValues: [],
        [INPUT_REFERENCE_PROPERTY_NAME]: {value: 'VARIABLE_6', error: null}
    };
},
recordDeleteUsingFieldsState = () => {
    return {
        description : {value: '', error: null},
        elementType : 'RECORD_DELETE',
        guid : MOCK_GUID,
        isCanvasElement : true,
        label : {value: 'recordDeleteWithFields', error: null},
        locationX : 358,
        locationY : 227,
        name : {value: 'record_delete_with_fields', error: null},
        filters: [{
            leftHandSide: {value: "Account.BillingAddress", error: null},
            operator: {value: "EqualTo", error: null},
            rightHandSide: {value: "my address", error: null},
            rightHandSideDataType: {value: "String", error: null},
            rowIndex: MOCK_GUID
        }],
        [OBJECT_PROPERTY_NAME] : {value: 'account', error: null}
    };
};

describe('record delete reducer using sObject', () => {
    let originalState;
    beforeAll(() => {
        originalState = recordDeleteUsingSobjectState();
    });
    describe('property changed event', () => {
        test('updates the "inputReference" property', () => {
            const newValue = 'VARIABLE_2', newError = null;
            const propChangedEvent = new PropertyChangedEvent(INPUT_REFERENCE_PROPERTY_NAME, newValue, newError, null,
                    originalState[INPUT_REFERENCE_PROPERTY_NAME].value);
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordDeleteReducer(originalState, propChangedEvent);
            expect(newState).not.toBe(originalState);
            expect(newState[INPUT_REFERENCE_PROPERTY_NAME]).toMatchObject({value: newValue, error: newError});
        });
        test('fetch the error from the event instead of rerunning validation', () => {
            const newValue = 'notValidSobjectVariable', newError = 'You have entered an invalid value.';
            const propChangedEvent = new PropertyChangedEvent(INPUT_REFERENCE_PROPERTY_NAME, newValue, newError, null,
                    originalState[INPUT_REFERENCE_PROPERTY_NAME].value);
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordDeleteReducer(originalState, propChangedEvent);
            expect(newState).not.toBe(originalState);
            expect(newState[INPUT_REFERENCE_PROPERTY_NAME]).toMatchObject({value: newValue, error: newError});
        });
    });
    test('ignores unknown events', () => {
        const event = {
            type: 'unknown event',
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = recordDeleteReducer(originalState, event);
        expect(resultObj).toBe(originalState);
    });
});

describe('record delete reducer using fields', () => {
    let originalState;
    beforeEach(() => {
        originalState = recordDeleteUsingFieldsState();
    });
    describe('property changed event', () => {
        test('updates the "object" property', () => {
            const newValue = 'User', newError = null;
            const propChangedEvent = new PropertyChangedEvent(OBJECT_PROPERTY_NAME, newValue, newError, null, originalState.object.value);
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordDeleteReducer(originalState, propChangedEvent);
            expect(newState).not.toBe(originalState);
            expect(newState[OBJECT_PROPERTY_NAME]).toMatchObject({value: newValue, error: newError});
        });
        test('not a valid "object": fetch the error from the event instead of rerunning validation', () => {
            const newValue = 'notValidSobject';
            const newError = 'You have entered an invalid value.';
            const propChangedEvent = new PropertyChangedEvent(OBJECT_PROPERTY_NAME,
                    newValue, newError, null, originalState[OBJECT_PROPERTY_NAME].value);
            const newState = recordDeleteReducer(originalState, propChangedEvent);
            expect(newState).not.toBe(originalState);
            expect(newState[OBJECT_PROPERTY_NAME]).toMatchObject({value: newValue, error: newError});
        });

        describe('update the "numberRecordsToStore"', () => {
            describe('update "numberRecordsToStore" from "All Records" to "First Record"', () => {
                let newState;
                beforeAll(() => {
                    const newValue = NUMBER_RECORDS_TO_STORE.FIRST_RECORD, newError = null;
                    const propChangedEvent = new PropertyChangedEvent(NUMBER_OF_RECORDS_PROPERTY_NAME,
                            newValue, newError, null);
                    propChangedEvent.detail.ignoreValidate = true;
                    newState = recordDeleteReducer(originalState, propChangedEvent);
                });
                test('should reset "object" property', () => {
                    expect(newState[OBJECT_PROPERTY_NAME].value).toHaveLength(0);
                });
                test('should reset "filters" property', () => {
                    expect(newState[FILTERS_PROPERTY_NAME]).toHaveLength(1);
                    expect(newState[FILTERS_PROPERTY_NAME][0].leftHandSide.value).toHaveLength(0);
                });
            });

            describe('update "numberRecordsToStore" from "First Record" to "All Records"', () => {
                let newState;
                beforeAll(() => {
                    originalState = recordDeleteUsingSobjectState();
                    const newValue = NUMBER_RECORDS_TO_STORE.ALL_RECORDS, newError = null;
                    const propChangedEvent = new PropertyChangedEvent(NUMBER_OF_RECORDS_PROPERTY_NAME,
                            newValue, newError, null);
                    propChangedEvent.detail.ignoreValidate = true;
                    newState = recordDeleteReducer(originalState, propChangedEvent);
                });
                test('should reset "inputReference" property', () => {
                    expect(newState[INPUT_REFERENCE_PROPERTY_NAME].value).toHaveLength(0);
                });
            });
        });
    });

    describe('handle list item events (for filters)', () => {
        it('add filter item', () => {
            const event = {
                type: AddRecordFilterEvent.EVENT_NAME,
            };
            const newState = recordDeleteReducer(originalState, event);
            expect(newState[FILTERS_PROPERTY_NAME]).toHaveLength(2);
            expect(newState).not.toBe(originalState);
        });
        it('delete filter item', () => {
            const event = {
                type: DeleteRecordFilterEvent.EVENT_NAME,
                detail: {
                    index: 0,
                }
            };
            const newState = recordDeleteReducer(originalState, event);
            expect(newState.filters).toHaveLength(0);
            expect(newState).not.toBe(originalState);
        });

        it('update the left hand side of filter item', () => {
            const event = {
                type: UpdateRecordFilterEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'Account.Description', error: null}},
                }
            };
            const newState = recordDeleteReducer(originalState, event);
            expect(newState.filters).toHaveLength(1);
            expect(newState.filters[0].leftHandSide.value).toBe('Account.Description');
            expect(newState).not.toBe(originalState);
        });

        it('update the right hand side of filter item', () => {
            const event = {
                type: UpdateRecordFilterEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: 'my NEW address', error: null}},
                }
            };
            const newState = recordDeleteReducer(originalState, event);
            expect(newState.filters).toHaveLength(1);
            expect(newState.filters[0].rightHandSide.value).toBe('my NEW address');
            expect(newState).not.toBe(originalState);
        });
        it('update the operator of filter item', () => {
            const event = {
                type: UpdateRecordFilterEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {[EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: 'StartsWith', error: null}},
                }
            };
            const newState = recordDeleteReducer(originalState, event);
            expect(newState.filters).toHaveLength(1);
            expect(newState.filters[0].operator.value).toBe('StartsWith');
            expect(newState).not.toBe(originalState);
        });
    });
});