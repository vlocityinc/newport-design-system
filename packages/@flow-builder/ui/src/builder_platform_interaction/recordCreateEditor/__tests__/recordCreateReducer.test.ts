// @ts-nocheck
import { recordCreateReducer } from '../recordCreateReducer';
import { recordCreateValidation } from '../recordCreateValidation';

import {
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    PropertyChangedEvent,
    RecordStoreOptionChangedEvent,
    UpdateRecordFieldAssignmentEvent,
    ManuallyAssignVariablesChangedEvent
} from 'builder_platform_interaction/events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const recordCreateUsingFieldsManualWithIdState = {
    assignRecordIdToReference: { value: '3454058d-0e62-4a85-bebe-2718a776c14e', error: null },
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    getFirstRecordOnly: true,
    guid: '9eb3fb86-af70-4117-8b77-8aa17e1e3005',
    inputAssignments: [
        {
            leftHandSide: { value: 'Account.BillingCountry', error: null },
            rightHandSide: { value: 'myCountry', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            rightHandSideGuid: { value: '1443cafc2-7744-4e46-8eaa-f2df29539d1d', error: null },
            rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d1d'
        }
    ],
    isCanvasElement: true,
    locationX: 358,
    locationY: 227,
    label: { value: 'testRecordCreateFieldsManualWithId', error: null },
    name: { value: 'testRecordCreateFieldsManualWithId', error: null },
    object: { value: 'account', error: null },
    inputReference: { value: '', error: null },
    storeOutputAutomatically: false
};
const recordCreateUsingFieldsManualWithoutIdState = {
    ...recordCreateUsingFieldsManualWithIdState,
    assignRecordIdToReference: { value: '', error: null },
    label: { value: 'testRecordCreateFieldsManualWithoutId', error: null },
    name: { value: 'testRecordCreateFieldsManualWithoutId', error: null }
};
const recordCreateUsingFieldsAutoState = {
    assignRecordIdToReference: { value: '', error: null },
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    getFirstRecordOnly: true,
    guid: '9eb3fb86-af70-4117-8b77-8aa17e1e3005',
    inputAssignments: [
        {
            leftHandSide: { value: 'Account.BillingCountry', error: null },
            rightHandSide: { value: 'myCountry', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            rightHandSideGuid: { value: '1443cafc2-7744-4e46-8eaa-f2df29539d1d', error: null },
            rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d1d'
        }
    ],
    isCanvasElement: true,
    label: { value: 'testRecordCreateFieldsManual', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testRecordCreateFieldsManual', error: null },
    object: { value: 'account', error: null },
    wayToStoreFields: WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES,
    storeOutputAutomatically: true
};
const recordCreateUsingSObjectFirstRecordState = {
    assignRecordIdToReference: { value: '', error: null },
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    getFirstRecordOnly: true,
    guid: '2773cc7c-78f6-46c9-ae34-a8ed20a4b2a7',
    inputReference: { value: '8884058d-0e62-4a85-bebe-2718a776c14e', error: null },
    isCanvasElement: true,
    locationX: 358,
    locationY: 227,
    label: { value: 'testRecordCreateSObjectFirstRecord', error: null },
    name: { value: 'testRecordCreateSObjectFirstRecord', error: null },
    processMetadataValues: [],
    wayToStoreFields: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE,
    storeOutputAutomatically: false
};
const recordCreateUsingSObjectCollectionState = {
    ...recordCreateUsingSObjectFirstRecordState,
    getFirstRecordOnly: false,
    label: { value: 'testRecordCreateSObjectCollection', error: null },
    name: { value: 'testRecordCreateSObjectCollection', error: null }
};
const updateAssignmentEvent = (side, newValue = '', index = 0) => ({
    type: UpdateRecordFieldAssignmentEvent.EVENT_NAME,
    detail: {
        index,
        value: { [side]: { value: newValue, error: null } }
    }
});

const propertyChangedEvent = (propertyName, value, error, originalValue) => {
    return new PropertyChangedEvent(propertyName, value, error, null, originalValue);
};
describe('record-create-reducer', () => {
    describe('using sObject', () => {
        let originalState;
        describe('first Record', () => {
            beforeAll(() => {
                originalState = recordCreateUsingSObjectFirstRecordState;
            });
            describe('update property action', () => {
                let propChangedEvent;
                const propertyName = 'inputReference';
                describe('on "inputReference"', () => {
                    describe('valid "inputReference"', () => {
                        beforeAll(() => {
                            propChangedEvent = new PropertyChangedEvent(
                                propertyName,
                                '9994058d-0e62-4a85-bebe-2718a776c14e',
                                null,
                                null,
                                originalState.inputReference.value
                            );
                        });
                        it('updates property itself', () => {
                            propChangedEvent.detail.ignoreValidate = true;
                            const newState = recordCreateReducer(originalState, propChangedEvent);
                            expect(newState).not.toBe(originalState);
                            expect(newState.inputReference).toEqual({
                                value: '9994058d-0e62-4a85-bebe-2718a776c14e',
                                error: null
                            });
                        });
                        it('same "inputReference" no changes', () => {
                            propChangedEvent.detail.ignoreValidate = true;
                            propChangedEvent.detail.oldValue = '9994058d-0e62-4a85-bebe-2718a776c14e';
                            const newState = recordCreateReducer(originalState, propChangedEvent);
                            expect(newState).toEqual({
                                ...originalState,
                                inputReference: { value: propChangedEvent.detail.oldValue, error: null }
                            });
                        });
                    });
                    it('fetch the error from the action instead of rerunning validation', () => {
                        propChangedEvent = new PropertyChangedEvent(
                            propertyName,
                            'notValidSobject',
                            'You have entered an invalid value.',
                            null,
                            originalState.inputReference.value
                        );
                        propChangedEvent.detail.ignoreValidate = true;
                        const newState = recordCreateReducer(originalState, propChangedEvent);
                        expect(newState).not.toBe(originalState);
                        expect(newState.inputReference).toEqual({
                            value: 'notValidSobject',
                            error: 'You have entered an invalid value.'
                        });
                    });
                });
            });
            describe('numberRecordsToStore', () => {
                it('should left the original state unmodified', () => {
                    const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                        true,
                        WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                    );
                    const newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent, true);
                    expect(newState).toBe(originalState);
                });
                describe('from First Record to All Records', () => {
                    let newState;
                    beforeAll(() => {
                        const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                            false,
                            WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                        );
                        newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent);
                    });
                    it('should update "getFirstRecordOnly"', () => {
                        expect(newState.getFirstRecordOnly).toBe(false);
                    });
                    it('should reset "object"', () => {
                        expect(newState.object.value).toBe('');
                    });
                    it('should reset "inputAssignments"', () => {
                        expect(newState.inputAssignments).toHaveLength(1);
                        expect(newState.inputAssignments[0].leftHandSide.value).toBe('');
                    });
                    it('should reset "inputReference"', () => {
                        expect(newState.inputReference).toEqual({ value: '', error: null });
                    });
                });
            });
            it('ignores unknown events', () => {
                const event = {
                    type: 'unknown event',
                    detail: {
                        propertyName: 'label',
                        value: 'newlabel',
                        error: null
                    }
                };
                const resultObj = recordCreateReducer(originalState, event);
                expect(resultObj).toBe(originalState);
            });
            describe('"validateAll" event type', () => {
                recordCreateValidation.validateAll = jest.fn();
                recordCreateReducer({}, { type: 'VALIDATE_ALL' });
                expect(recordCreateValidation.validateAll).toBeCalled();
            });
        });
        describe('all Records', () => {
            beforeAll(() => {
                originalState = recordCreateUsingSObjectCollectionState;
            });
            describe('update property action', () => {
                let propChangedEvent;
                const propertyName = 'inputReference';
                describe('on "inputReference"', () => {
                    describe('valid "inputReference"', () => {
                        beforeAll(() => {
                            propChangedEvent = new PropertyChangedEvent(
                                propertyName,
                                '9994058d-0e62-4a85-bebe-2718a776c14e',
                                null,
                                null,
                                originalState.inputReference.value
                            );
                        });
                        it('updates property itself', () => {
                            propChangedEvent.detail.ignoreValidate = true;
                            const newState = recordCreateReducer(originalState, propChangedEvent);
                            expect(newState).not.toBe(originalState);
                            expect(newState.inputReference).toEqual({
                                value: '9994058d-0e62-4a85-bebe-2718a776c14e',
                                error: null
                            });
                        });
                        it('same "inputReference" no changes', () => {
                            propChangedEvent.detail.ignoreValidate = true;
                            propChangedEvent.detail.oldValue = '9994058d-0e62-4a85-bebe-2718a776c14e';
                            const newState = recordCreateReducer(originalState, propChangedEvent);
                            expect(newState).toEqual({
                                ...originalState,
                                inputReference: { value: propChangedEvent.detail.oldValue, error: null }
                            });
                        });
                    });
                    it('fetch the error from the action instead of rerunning validation', () => {
                        propChangedEvent = new PropertyChangedEvent(
                            propertyName,
                            'notValidSobject',
                            'You have entered an invalid value.',
                            null,
                            originalState.inputReference.value
                        );
                        propChangedEvent.detail.ignoreValidate = true;
                        const newState = recordCreateReducer(originalState, propChangedEvent);
                        expect(newState).not.toBe(originalState);
                        expect(newState.inputReference).toEqual({
                            value: 'notValidSobject',
                            error: 'You have entered an invalid value.'
                        });
                    });
                });
            });
            describe('numberRecordsToStore', () => {
                describe('from All Records to First Record', () => {
                    let newState;
                    beforeAll(() => {
                        const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                            true,
                            WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                        );
                        newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent);
                    });
                    it('should update "getFirstRecordOnly"', () => {
                        expect(newState.getFirstRecordOnly).toBe(true);
                    });
                    it('should reset "object"', () => {
                        expect(newState.object.value).toBe('');
                    });
                    it('should reset "inputAssignments"', () => {
                        expect(newState.inputAssignments).toHaveLength(1);
                        expect(newState.inputAssignments[0].leftHandSide.value).toBe('');
                    });
                    it('should reset "inputReference"', () => {
                        expect(newState.inputReference).toEqual({ value: '', error: null });
                    });
                });
            });
            it('ignores unknown events', () => {
                const event = {
                    type: 'unknown event',
                    detail: {
                        propertyName: 'label',
                        value: 'newlabel',
                        error: null
                    }
                };
                const resultObj = recordCreateReducer(originalState, event);
                expect(resultObj).toBe(originalState);
            });
        });
    });
    describe('using fields', () => {
        let originalState;
        describe('manual', () => {
            describe('with id', () => {
                beforeAll(() => {
                    originalState = recordCreateUsingFieldsManualWithIdState;
                });
                describe('update property action', () => {
                    let newState;
                    describe('valid "object"', () => {
                        let propChangedEvent;
                        it('updates the object property', () => {
                            propChangedEvent = propertyChangedEvent('object', 'USER', null, originalState.object.value);
                            propChangedEvent.detail.ignoreValidate = true;
                            newState = recordCreateReducer(originalState, propChangedEvent);
                            expect(newState).not.toBe(originalState);
                            expect(newState.object).toEqual({
                                value: 'USER',
                                error: null
                            });
                        });
                        it('should reset "inputAssignments"', () => {
                            expect(newState.inputAssignments).toEqual([
                                {
                                    leftHandSide: { error: null, value: '' },
                                    rightHandSide: { error: null, value: '' },
                                    rightHandSideDataType: { error: null, value: '' },
                                    rowIndex: expect.any(String)
                                }
                            ]);
                        });
                        it('should reset "assignRecordIdToReference"', () => {
                            expect(newState.assignRecordIdToReference).toEqual({
                                error: null,
                                value: ''
                            });
                        });
                        it('same "object" no changes', () => {
                            propChangedEvent.detail.ignoreValidate = true;
                            propChangedEvent.detail.oldValue = 'USER';
                            newState = recordCreateReducer(originalState, propChangedEvent);
                            expect(newState).toEqual({
                                ...originalState,
                                object: { value: propChangedEvent.detail.oldValue, error: null }
                            });
                        });
                    });
                    it('not a valid Object: fetch the error from the action instead of rerunning validation', () => {
                        const propChangedEvent = propertyChangedEvent(
                            'object',
                            'notValidSobject',
                            'You have entered an invalid value.',
                            originalState.object.value
                        );
                        propChangedEvent.detail.ignoreValidate = true;
                        newState = recordCreateReducer(originalState, propChangedEvent);
                        expect(newState).not.toBe(originalState);
                        expect(newState.object).toEqual({
                            value: 'notValidSobject',
                            error: 'You have entered an invalid value.'
                        });
                    });
                });
                describe('inputAssignments', () => {
                    it('add an assignment item', () => {
                        const event = {
                            type: AddRecordFieldAssignmentEvent.EVENT_NAME
                        };
                        const newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(2);
                        expect(newState).not.toBe(originalState);
                    });
                    it('delete an assignment item', () => {
                        const event = {
                            type: DeleteRecordFieldAssignmentEvent.EVENT_NAME,
                            detail: {
                                index: 0
                            }
                        };
                        const newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(0);
                        expect(newState).not.toBe(originalState);
                    });
                    it('update the left hand side of an assignment item', () => {
                        const event = updateAssignmentEvent(
                            EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
                            'Account.Description'
                        );
                        const newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(1);
                        expect(newState.inputAssignments[0].leftHandSide.value).toBe('Account.Description');
                        expect(newState).not.toBe(originalState);
                    });
                    describe('update the left hand side of an assignment item', () => {
                        it('with an empty value when the right hand side has a value', () => {
                            const event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE);
                            const newState = recordCreateReducer(originalState, event);
                            expect(newState.inputAssignments).toHaveLength(1);
                            expect(newState.inputAssignments[0].leftHandSide.value).toBe('Account.BillingCountry');
                            expect(newState).not.toBe(originalState);
                        });
                        it('with an empty value when the right hand side does not have a value', () => {
                            // Remove Right Hand Side value first
                            let event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE);
                            let newState = recordCreateReducer(originalState, event);

                            // Remove Left Hand Side after
                            event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE);
                            newState = recordCreateReducer(newState, event);
                            expect(newState.inputAssignments).toHaveLength(1);
                            expect(newState.inputAssignments[0].leftHandSide.value).toBe('');
                            expect(newState).not.toBe(originalState);
                        });
                    });
                });
                describe('numberRecordsToStore', () => {
                    describe('from First Record to All Records', () => {
                        let newState;
                        beforeAll(() => {
                            const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                                false,
                                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                            );
                            newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent);
                        });
                        it('should set "getFirstRecordOnly"', () => {
                            expect(newState.getFirstRecordOnly).toBe(false);
                        });
                        it('should reset "assignRecordIdToReference"', () => {
                            expect(newState.assignRecordIdToReference.value).toBe('');
                        });
                        it('should reset "object"', () => {
                            expect(newState.object.value).toBe('');
                        });
                        it('should reset "inputAssignments"', () => {
                            expect(newState.inputAssignments).toHaveLength(1);
                            expect(newState.inputAssignments[0].leftHandSide.value).toBe('');
                        });
                        it('should reset "wayToStoreFields"', () => {
                            expect(newState.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        });
                        it('should NOT reset "storeOutputAutomatically"', () => {
                            expect(newState.storeOutputAutomatically).toBe(originalState.storeOutputAutomatically);
                        });
                    });
                });
                describe('wayToStoreFields', () => {
                    describe('from SEPARATE_VARIABLES to SOBJECT_VARIABLE', () => {
                        let newState;
                        beforeAll(() => {
                            originalState = recordCreateUsingFieldsManualWithIdState;
                            const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                                true,
                                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                            );
                            newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent);
                        });
                        it('should reset "inputReference"', () => {
                            expect(newState.inputReference).toEqual({
                                value: '',
                                error: null
                            });
                        });
                        it('should set "wayToStoreFields"', () => {
                            expect(newState.wayToStoreFields).toEqual(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        });
                        it('should reset "object"', () => {
                            expect(newState.object).toEqual({
                                value: '',
                                error: null
                            });
                        });
                        it('should reset "assignRecordIdToReference"', () => {
                            expect(newState.assignRecordIdToReference).toEqual({
                                value: '',
                                error: null
                            });
                        });
                        it('should reset "inputAssignments"', () => {
                            expect(newState.inputAssignments).toEqual([
                                {
                                    leftHandSide: { error: null, value: '' },
                                    rightHandSide: { error: null, value: '' },
                                    rightHandSideDataType: { error: null, value: '' },
                                    rowIndex: expect.any(String)
                                }
                            ]);
                        });
                        it('should NOT reset "storeOutputAutomatically"', () => {
                            expect(newState.storeOutputAutomatically).toBe(originalState.storeOutputAutomatically);
                        });
                    });
                });
                describe('uncheck use Advanced Options', () => {
                    let newState;
                    beforeAll(() => {
                        originalState = recordCreateUsingFieldsManualWithIdState;
                        const changeFromAutomaticToAdvancedModeEvent = {
                            type: ManuallyAssignVariablesChangedEvent.EVENT_NAME,
                            detail: {
                                useAdvancedOptions: false
                            }
                        };
                        newState = recordCreateReducer(originalState, changeFromAutomaticToAdvancedModeEvent);
                    });
                    it('new state different than original one', () => {
                        expect(newState).not.toBe(originalState);
                    });
                    it('should reset "assignRecordIdToReference"', () => {
                        expect(newState.assignRecordIdToReference).toEqual({
                            value: '',
                            error: null
                        });
                    });
                    it('should set "storeOutputAutomatically" to true', () => {
                        expect(newState.storeOutputAutomatically).toBe(true);
                    });
                });
            });
            describe('without id', () => {
                let newState;
                const isAutomaticOutputHandlingSupported = true;
                beforeAll(() => {
                    originalState = recordCreateUsingFieldsManualWithoutIdState;
                });
                describe('update property action', () => {
                    let propChangedEvent;
                    describe('valid object', () => {
                        it('updates the object property', () => {
                            propChangedEvent = propertyChangedEvent('object', 'USER', null, originalState.object.value);
                            propChangedEvent.detail.ignoreValidate = true;
                            newState = recordCreateReducer(
                                originalState,
                                propChangedEvent,
                                isAutomaticOutputHandlingSupported
                            );
                            expect(newState).not.toBe(originalState);
                            expect(newState.object).toEqual({ value: 'USER', error: null });
                        });
                        it('should reset "inputAssignments"', () => {
                            expect(newState.inputAssignments).toEqual([
                                {
                                    leftHandSide: { error: null, value: '' },
                                    rightHandSide: { error: null, value: '' },
                                    rightHandSideDataType: { error: null, value: '' },
                                    rowIndex: expect.any(String)
                                }
                            ]);
                        });
                        it('should set "storeOutputAutomatically" to "isAutomaticOutputHandlingSupported" value', () => {
                            expect(newState.storeOutputAutomatically).toEqual(isAutomaticOutputHandlingSupported);
                        });
                        it('same "object" no changes', () => {
                            propChangedEvent.detail.ignoreValidate = true;
                            propChangedEvent.detail.oldValue = 'USER';
                            newState = recordCreateReducer(originalState, propChangedEvent);
                            expect(newState).toEqual({
                                ...originalState,
                                object: { value: propChangedEvent.detail.oldValue, error: null }
                            });
                        });
                    });
                    it('not a valid Object: fetch the error from the action instead of rerunning validation', () => {
                        propChangedEvent = propertyChangedEvent(
                            'object',
                            'notValidSobject',
                            'You have entered an invalid value.',
                            originalState.object.value
                        );
                        propChangedEvent.detail.ignoreValidate = true;
                        newState = recordCreateReducer(originalState, propChangedEvent);
                        expect(newState).not.toBe(originalState);
                        expect(newState.object).toEqual({
                            value: 'notValidSobject',
                            error: 'You have entered an invalid value.'
                        });
                    });
                });
                describe('inputAssignments', () => {
                    it('add an assignment item', () => {
                        const event = {
                            type: AddRecordFieldAssignmentEvent.EVENT_NAME
                        };
                        newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(2);
                        expect(newState).not.toBe(originalState);
                    });
                    it('delete an assignment item', () => {
                        const event = {
                            type: DeleteRecordFieldAssignmentEvent.EVENT_NAME,
                            detail: {
                                index: 0
                            }
                        };
                        newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(0);
                        expect(newState).not.toBe(originalState);
                    });
                    it('update the left hand side of an assignment item', () => {
                        const event = updateAssignmentEvent(
                            EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
                            'Account.Description'
                        );
                        newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(1);
                        expect(newState.inputAssignments[0].leftHandSide.value).toBe('Account.Description');
                        expect(newState).not.toBe(originalState);
                    });
                    describe('update the left hand side of an assignment item', () => {
                        it('with an empty value when the right hand side has a value', () => {
                            const event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE);
                            newState = recordCreateReducer(originalState, event);
                            expect(newState.inputAssignments).toHaveLength(1);
                            expect(newState.inputAssignments[0].leftHandSide.value).toBe('Account.BillingCountry');
                            expect(newState).not.toBe(originalState);
                        });
                        it('with an empty value when the right hand side does not have a value', () => {
                            // Remove Right Hand Side value first
                            let event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE);
                            newState = recordCreateReducer(originalState, event);

                            // Remove Left Hand Side after
                            event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE);
                            newState = recordCreateReducer(newState, event);
                            expect(newState.inputAssignments).toHaveLength(1);
                            expect(newState.inputAssignments[0].leftHandSide.value).toBe('');
                            expect(newState).not.toBe(originalState);
                        });
                    });
                });
                describe('numberRecordsToStore', () => {
                    describe('from First Record to All Records', () => {
                        beforeAll(() => {
                            const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                                false,
                                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                            );
                            newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent);
                        });
                        it('should update "getFirstRecordOnly"', () => {
                            expect(newState.getFirstRecordOnly).toBe(false);
                        });
                        it('should reset "wayToStoreFields"', () => {
                            expect(newState.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        });
                        it('should NOT reset "storeOutputAutomatically"', () => {
                            expect(newState.storeOutputAutomatically).toBe(originalState.storeOutputAutomatically);
                        });
                        it('should reset "object"', () => {
                            expect(newState.object).toEqual({ value: '', error: null });
                        });
                    });
                });
                describe('wayToStoreFields', () => {
                    describe('from SEPARATE_VARIABLES to SOBJECT_VARIABLE', () => {
                        beforeAll(() => {
                            const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                                true,
                                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                            );
                            newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent);
                        });
                        it('should reset "assignRecordIdToReference"', () => {
                            expect(newState.assignRecordIdToReference).toEqual({
                                value: '',
                                error: null
                            });
                        });
                        it('should update "wayToStoreFields"', () => {
                            expect(newState.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        });
                        it('should reset "inputAssignments"', () => {
                            expect(newState.inputAssignments).toEqual([
                                {
                                    leftHandSide: { error: null, value: '' },
                                    rightHandSide: { error: null, value: '' },
                                    rightHandSideDataType: { error: null, value: '' },
                                    rowIndex: expect.any(String)
                                }
                            ]);
                        });
                        it('should NOT reset "storeOutputAutomatically"', () => {
                            expect(newState.storeOutputAutomatically).toBe(originalState.storeOutputAutomatically);
                        });
                    });
                });
                describe('uncheck use Advanced Options', () => {
                    beforeAll(() => {
                        const changeFromAutomaticToAdvancedModeEvent = {
                            type: ManuallyAssignVariablesChangedEvent.EVENT_NAME,
                            detail: {
                                useAdvancedOptions: false
                            }
                        };
                        newState = recordCreateReducer(originalState, changeFromAutomaticToAdvancedModeEvent);
                    });
                    it('new state different than original one', () => {
                        expect(newState).not.toBe(originalState);
                    });
                    it('should set "storeOutputAutomatically" to true', () => {
                        expect(newState.storeOutputAutomatically).toBe(true);
                    });
                });
            });
            describe('automatic', () => {
                beforeAll(() => {
                    originalState = recordCreateUsingFieldsAutoState;
                });
                describe('update property action', () => {
                    let newState, propChangedEvent;
                    const isAutomaticOutputHandlingSupported = true;
                    describe('on "object"', () => {
                        beforeAll(() => {
                            propChangedEvent = new PropertyChangedEvent(
                                'object',
                                'USER',
                                null,
                                originalState.object.value
                            );
                            newState = recordCreateReducer(
                                originalState,
                                propChangedEvent,
                                isAutomaticOutputHandlingSupported
                            );
                        });
                        describe('valid object', () => {
                            it('updates the object property', () => {
                                expect(newState).not.toBe(originalState);
                                expect(newState.object).toEqual({ value: 'USER', error: null });
                            });
                            it('should NOT reset "wayToStoreFields"', () => {
                                expect(newState.wayToStoreFields).toBe(originalState.wayToStoreFields);
                            });
                            it('should set "storeOutputAutomatically" to "isAutomaticOutputHandlingSupported" value', () => {
                                expect(newState.storeOutputAutomatically).toBe(isAutomaticOutputHandlingSupported);
                            });
                            it('should reset "inputAssignments"', () => {
                                expect(newState.inputAssignments).toEqual([
                                    {
                                        leftHandSide: { error: null, value: '' },
                                        rightHandSide: { error: null, value: '' },
                                        rightHandSideDataType: { error: null, value: '' },
                                        rowIndex: expect.any(String)
                                    }
                                ]);
                            });
                            describe('same object', () => {
                                beforeAll(() => {
                                    propChangedEvent.detail.oldValue = 'USER';
                                    newState = recordCreateReducer(
                                        originalState,
                                        propChangedEvent,
                                        isAutomaticOutputHandlingSupported
                                    );
                                });
                                it('does not reset "inputAssignments"', () => {
                                    expect(newState.inputAssignments).toBe(originalState.inputAssignments);
                                });
                                it('does not reset "storeOutputAutomatically"', () => {
                                    expect(newState.storeOutputAutomatically).toBe(
                                        originalState.storeOutputAutomatically
                                    );
                                });
                            });
                        });
                        it('not a valid Object: fetch the error from the action instead of rerunning validation', () => {
                            propChangedEvent = propertyChangedEvent(
                                'object',
                                'notValidSobject',
                                'You have entered an invalid value.'
                            );
                            propChangedEvent.detail.ignoreValidate = true;
                            newState = recordCreateReducer(originalState, propChangedEvent);
                            expect(newState).not.toBe(originalState);
                            expect(newState.object).toEqual({
                                value: 'notValidSobject',
                                error: 'You have entered an invalid value.'
                            });
                        });
                    });
                });
                describe('inputAssignments', () => {
                    it('add an assignment item', () => {
                        const event = {
                            type: AddRecordFieldAssignmentEvent.EVENT_NAME
                        };
                        const newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(2);
                        expect(newState).not.toBe(originalState);
                    });
                    it('delete an assignment item', () => {
                        const event = {
                            type: DeleteRecordFieldAssignmentEvent.EVENT_NAME,
                            detail: {
                                index: 0
                            }
                        };
                        const newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(0);
                        expect(newState).not.toBe(originalState);
                    });
                    it('update the left hand side of an assignment item', () => {
                        const event = updateAssignmentEvent(
                            EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
                            'Account.Description'
                        );
                        const newState = recordCreateReducer(originalState, event);
                        expect(newState.inputAssignments).toHaveLength(1);
                        expect(newState.inputAssignments[0].leftHandSide.value).toBe('Account.Description');
                        expect(newState).not.toBe(originalState);
                    });
                    describe('update the left hand side of an assignment item', () => {
                        it('with an empty value when the right hand side has a value', () => {
                            const event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE);
                            const newState = recordCreateReducer(originalState, event);
                            expect(newState.inputAssignments).toHaveLength(1);
                            expect(newState.inputAssignments[0].leftHandSide.value).toBe('Account.BillingCountry');
                            expect(newState).not.toBe(originalState);
                        });
                        it('with an empty value when the right hand side does not have a value', () => {
                            // Remove Right Hand Side value first
                            let event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE);
                            let newState = recordCreateReducer(originalState, event);

                            // Remove Left Hand Side after
                            event = updateAssignmentEvent(EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE);
                            newState = recordCreateReducer(newState, event);
                            expect(newState.inputAssignments).toHaveLength(1);
                            expect(newState.inputAssignments[0].leftHandSide.value).toBe('');
                            expect(newState).not.toBe(originalState);
                        });
                    });
                });
                describe('numberRecordsToStore', () => {
                    describe('from First Record to All Records', () => {
                        let newState;
                        beforeAll(() => {
                            const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                                false,
                                WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
                            );
                            newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent, true);
                        });
                        it('should update "getFirstRecordOnly"', () => {
                            expect(newState.getFirstRecordOnly).toBe(false);
                        });
                        it('should reset "wayToStoreFields""', () => {
                            expect(newState.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        });
                        it('should reset "object"', () => {
                            expect(newState.object).toEqual({ value: '', error: null });
                        });
                        it('should reset "inputAssignments"', () => {
                            expect(newState.inputAssignments).toEqual([
                                {
                                    leftHandSide: { error: null, value: '' },
                                    rightHandSide: { error: null, value: '' },
                                    rightHandSideDataType: { error: null, value: '' },
                                    rowIndex: expect.any(String)
                                }
                            ]);
                        });
                        it('should NOT reset "storeOutputAutomatically"', () => {
                            expect(newState.storeOutputAutomatically).toBe(originalState.storeOutputAutomatically);
                        });
                    });
                });
                describe('wayToStoreFields', () => {
                    describe('from SEPARATE_VARIABLES to SOBJECT_VARIABLE', () => {
                        let newState;
                        beforeAll(() => {
                            const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                                true,
                                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                            );
                            newState = recordCreateReducer(originalState, recordStoreOptionChangedEvent, true);
                        });
                        it('should reset "object"', () => {
                            expect(newState.object).toEqual({
                                value: '',
                                error: null
                            });
                        });
                        it('should reset "assignRecordIdToReference"', () => {
                            expect(newState.assignRecordIdToReference).toEqual({
                                value: '',
                                error: null
                            });
                        });
                        it('should reset "inputAssignments"', () => {
                            expect(newState.inputAssignments).toEqual([
                                {
                                    leftHandSide: { error: null, value: '' },
                                    rightHandSide: { error: null, value: '' },
                                    rightHandSideDataType: { error: null, value: '' },
                                    rowIndex: expect.any(String)
                                }
                            ]);
                        });
                        it('should NOT reset "storeOutputAutomatically"', () => {
                            expect(newState.storeOutputAutomatically).toBe(originalState.storeOutputAutomatically);
                        });
                    });
                });
                describe('check use Advanced Options', () => {
                    let newState;
                    beforeAll(() => {
                        const changeFromAutomaticToAdvancedModeEvent = new ManuallyAssignVariablesChangedEvent(true);
                        newState = recordCreateReducer(originalState, changeFromAutomaticToAdvancedModeEvent, true);
                    });
                    it('new state different than original one', () => {
                        expect(newState).not.toBe(originalState);
                    });
                    it('should reset "assignRecordIdToReference"', () => {
                        expect(newState.assignRecordIdToReference).toEqual({
                            value: '',
                            error: null
                        });
                    });
                    it('should set "storeOutputAutomatically" to false', () => {
                        expect(newState.storeOutputAutomatically).toBe(false);
                    });
                });
            });
        });
    });
});
