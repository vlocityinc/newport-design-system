// @ts-nocheck
import { createRecordUpdate, createDuplicateRecordUpdate, createRecordUpdateMetadataObject } from '../recordUpdate';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE,
    CONDITION_LOGIC,
    RECORD_UPDATE_WAY_TO_FIND_RECORDS,
    FLOW_TRIGGER_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { DUPLICATE_ELEMENT_XY_OFFSET } from '../base/baseElement';

jest.mock('builder_platform_interaction/storeUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/storeUtils');
    return Object.assign({}, actual, {
        getTriggerType: () => {
            return undefined;
        },
        getStartObject: () => {
            return undefined;
        }
    });
});

expect.extend(deepFindMatchers);

const recordUpdateUsingSobject = {
    name: 'RecordUpdate1',
    description: '',
    inputReference: 'myObject'
};

const recordUpdateUsingFieldsTemplate = () => {
    return {
        name: 'RecordUpdate1',
        description: '',
        object: 'myObject',
        inputAssignments: []
    };
};

const mutatedRecordUpdateUsingSobject = {
    name: 'RecordUpdate1',
    description: '',
    elementType: ELEMENT_TYPE.RECORD_UPDATE,
    inputReference: 'myObject',
    wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE
};

const mutatedRecordUpdateWithFieldsTemplate = () => {
    return {
        name: 'RecordUpdate1',
        description: '',
        object: 'myObject',
        elementType: ELEMENT_TYPE.RECORD_UPDATE,
        wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP
    };
};

const filterWithValueFieldAndOperator = {
    field: 'description',
    value: { stringValue: 'myDescription' },
    operator: 'equals'
};

const filterWithField = {
    field: 'title'
};

const mutatedFilterWithField = {
    leftHandSide: 'myObject.title',
    operator: '',
    rightHandSide: '',
    rightHandSideDataType: ''
};

const mutatedFilterWithValueFieldAndOperator = {
    leftHandSide: 'myObject.description',
    operator: 'equals',
    rightHandSide: 'myDescription',
    rightHandSideDataType: 'String'
};

const inputAssignmentFieldValue = {
    field: 'description',
    value: { stringValue: 'myDescription' }
};

const inputAssignmentField = {
    field: 'title'
};

const inputAssignmentFieldBooleanValue = {
    field: 'isEditable',
    value: { booleanValue: false }
};

const mutatedInputAssignmentFieldValue = {
    leftHandSide: 'myObject.description',
    rightHandSide: 'myDescription',
    rightHandSideDataType: 'String'
};

const mutatedInputAssignmentField = {
    leftHandSide: 'myObject.title',
    rightHandSide: '',
    rightHandSideDataType: ''
};

const mutatedInputAssignmentFieldBooleanValue = {
    leftHandSide: 'myObject.isEditable',
    rightHandSide: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
    rightHandSideDataType: 'Boolean'
};

describe('recordUpdate Mutation', () => {
    describe('recordUpdate function using sObject', () => {
        it('returns a new record update object when no argument is passed; wayToFindRecords should be set to SOBJECT_REFERENCE by default', () => {
            const mutatedResult = {
                name: '',
                description: '',
                elementType: ELEMENT_TYPE.RECORD_UPDATE,
                wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE
            };
            const actualResult = createRecordUpdate();
            expect(actualResult).toMatchObject(mutatedResult);
        });
        it('returns a new record update object with same value and the numberRecordsToStore calculated from the inputReference', () => {
            const actualResult = createRecordUpdate(recordUpdateUsingSobject);
            expect(actualResult).toMatchObject(mutatedRecordUpdateUsingSobject);
        });
        it('has dataType of boolean', () => {
            const actualResult = createRecordUpdate(recordUpdateUsingSobject);
            expect(actualResult.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
        });
        it('has no common mutable object with subflow metadata passed as parameter', () => {
            const actualResult = createRecordUpdate(recordUpdateUsingSobject);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordUpdateUsingSobject);
        });
    });
    describe('createRecordUpdate function for triggering record', () => {
        describe('we expect wayToFindRecords to be triggeringRecord', () => {
            const inputRecordUpdate = {
                name: 'RecordUpdate1',
                description: '',
                inputReference: ''
            };
            const mutatedRecordUpdate = {
                name: 'RecordUpdate1',
                description: '',
                elementType: ELEMENT_TYPE.RECORD_UPDATE,
                wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD
            };
            it.each`
                triggerType                        | startObject
                ${FLOW_TRIGGER_TYPE.BEFORE_SAVE}   | ${'defined'}
                ${FLOW_TRIGGER_TYPE.AFTER_SAVE}    | ${'defined'}
                ${FLOW_TRIGGER_TYPE.BEFORE_DELETE} | ${'defined'}
                ${FLOW_TRIGGER_TYPE.SCHEDULED}     | ${'defined'}
                ${FLOW_TRIGGER_TYPE.BEFORE_SAVE}   | ${undefined}
            `('should be triggeringRecord for $triggerType and $startObject', async ({ triggerType, startObject }) => {
                const factoriedRecordUpdate = createRecordUpdate(inputRecordUpdate, triggerType, startObject);
                expect(factoriedRecordUpdate).toMatchObject(mutatedRecordUpdate);
            });
        });
        describe('we expect wayToFindRecords to not be triggeringRecord', () => {
            const inputRecordUpdate = {
                name: 'RecordUpdate1',
                inputReference: ''
            };
            const mutatedRecordUpdate = {
                name: 'RecordUpdate1',
                elementType: ELEMENT_TYPE.RECORD_UPDATE,
                wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE
            };
            it.each`
                triggerType  | startObject
                ${undefined} | ${'defined'}
                ${undefined} | ${undefined}
            `(
                'should not be triggeringRecord for $triggerType and $startObject',
                async ({ triggerType, startObject }) => {
                    const factoriedRecordUpdate = createRecordUpdate(inputRecordUpdate, triggerType, startObject);
                    expect(factoriedRecordUpdate).toMatchObject(mutatedRecordUpdate);
                }
            );
        });
        it('should be sobject reference if its triggerRecord with no triggerType', () => {
            const inputRecordUpdate = {
                name: 'RecordUpdate1',
                description: '',
                inputReference: '',
                wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD
            };
            const mutatedRecordUpdate = {
                name: 'RecordUpdate1',
                description: '',
                elementType: ELEMENT_TYPE.RECORD_UPDATE,
                wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE
            };
            const factoriedRecordUpdate = createRecordUpdate(inputRecordUpdate, undefined);
            expect(factoriedRecordUpdate).toMatchObject(mutatedRecordUpdate);
        });
    });
    describe('recordUpdate function for context record ($Record)', () => {
        it('has wayToFindRecords set to sobjectReference, when input assignments are empty', () => {
            const recordUpdateUsingContextRecord = {
                name: 'RecordUpdate1',
                description: '',
                filters: [],
                inputAssignments: [],
                inputReference: '$Record'
            };
            const mutatedRecordUpdate = {
                name: 'RecordUpdate1',
                description: '',
                filters: [
                    {
                        leftHandSide: '',
                        operator: '',
                        rightHandSide: '',
                        rightHandSideDataType: ''
                    }
                ],
                inputAssignments: [
                    {
                        leftHandSide: '',
                        rightHandSide: '',
                        rightHandSideDataType: ''
                    }
                ],
                inputReference: '$Record',
                elementType: ELEMENT_TYPE.RECORD_UPDATE,
                wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE
            };
            const factoriedRecordUpdate = createRecordUpdate(
                recordUpdateUsingContextRecord,
                FLOW_TRIGGER_TYPE.AFTER_SAVE
            );
            expect(factoriedRecordUpdate).toMatchObject(mutatedRecordUpdate);
        });
        it('has wayToFindRecords set to triggeringRecord, when input assignments are populated', () => {
            const recordUpdateUsingContextRecord = {
                name: 'RecordUpdate1',
                description: '',
                inputAssignments: [
                    {
                        field: 'description',
                        value: { stringValue: 'myDescription' }
                    }
                ],
                inputReference: '$Record'
            };
            const mutatedRecordUpdate = {
                name: 'RecordUpdate1',
                description: '',
                inputAssignments: [
                    {
                        leftHandSide: '.description',
                        rightHandSide: 'myDescription',
                        rightHandSideDataType: 'String'
                    }
                ],
                inputReference: '$Record',
                elementType: ELEMENT_TYPE.RECORD_UPDATE,
                wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD
            };
            const factoriedRecordUpdate = createRecordUpdate(
                recordUpdateUsingContextRecord,
                FLOW_TRIGGER_TYPE.AFTER_SAVE
            );
            expect(factoriedRecordUpdate).toMatchObject(mutatedRecordUpdate);
        });
    });
    describe('recordUpdate function using Fields', () => {
        let recordUpdateUsingFields;
        let mutatedRecordUpdateWithFields;
        beforeEach(() => {
            recordUpdateUsingFields = recordUpdateUsingFieldsTemplate();
            mutatedRecordUpdateWithFields = mutatedRecordUpdateWithFieldsTemplate();
        });
        it('filter with value should return same with calculated wayToFindRecords', () => {
            recordUpdateUsingFields.filters = [filterWithValueFieldAndOperator];
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.filters = [mutatedFilterWithValueFieldAndOperator];
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('filter with and without value should return same with calculated wayToFindRecords', () => {
            recordUpdateUsingFields.filters = [filterWithValueFieldAndOperator, filterWithField];
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.filters = [mutatedFilterWithValueFieldAndOperator, mutatedFilterWithField];
            mutatedRecordUpdateWithFields.filterLogic = CONDITION_LOGIC.AND;
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('Empty filter and filterLogic is undefined should return filterLogic = "no_conditions"', () => {
            recordUpdateUsingFields.filters = [];
            recordUpdateUsingFields.filterLogic = undefined;
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            expect(actualResult.filterLogic).toBe(CONDITION_LOGIC.NO_CONDITIONS);
        });
        it('inputAssignments with value should return the expression (RHS/LHS)', () => {
            recordUpdateUsingFields.inputAssignments = [inputAssignmentFieldValue];
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.inputAssignments = [mutatedInputAssignmentFieldValue];
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('inputAssignments with multiple values should return the expression (RHS/LHS)', () => {
            recordUpdateUsingFields.inputAssignments = [
                inputAssignmentFieldValue,
                inputAssignmentField,
                inputAssignmentFieldBooleanValue
            ];
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.inputAssignments = [
                mutatedInputAssignmentFieldValue,
                mutatedInputAssignmentField,
                mutatedInputAssignmentFieldBooleanValue
            ];
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('has dataType of boolean', () => {
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            expect(actualResult.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
        });
    });
});

describe('createDuplicateRecordUpdate function', () => {
    const originalRecordUpdate = {
        guid: 'originalGuid',
        name: 'originalName',
        label: 'label',
        elementType: ELEMENT_TYPE.RECORD_UPDATE,
        locationX: 100,
        locationY: 100,
        config: {
            isSelectd: true,
            isHighlighted: false
        },
        connectorCount: 1,
        maxConnections: 2,
        availableConnections: [
            {
                type: CONNECTOR_TYPE.FAULT
            }
        ]
    };
    const { duplicatedElement } = createDuplicateRecordUpdate(originalRecordUpdate, 'duplicatedGuid', 'duplicatedName');

    it('has the new guid', () => {
        expect(duplicatedElement.guid).toEqual('duplicatedGuid');
    });
    it('has the new name', () => {
        expect(duplicatedElement.name).toEqual('duplicatedName');
    });
    it('has the updated locationX', () => {
        expect(duplicatedElement.locationX).toEqual(originalRecordUpdate.locationX + DUPLICATE_ELEMENT_XY_OFFSET);
    });
    it('has the updated locationY', () => {
        expect(duplicatedElement.locationY).toEqual(originalRecordUpdate.locationY + DUPLICATE_ELEMENT_XY_OFFSET);
    });
    it('has isSelected set to true', () => {
        expect(duplicatedElement.config.isSelected).toBeTruthy();
    });
    it('has isHighlighted set to false', () => {
        expect(duplicatedElement.config.isHighlighted).toBeFalsy();
    });
    it('has connectorCount set to 0', () => {
        expect(duplicatedElement.connectorCount).toEqual(0);
    });
    it('has maxConnections set to 2', () => {
        expect(duplicatedElement.maxConnections).toEqual(2);
    });
    it('has the right elementType', () => {
        expect(duplicatedElement.elementType).toEqual(ELEMENT_TYPE.RECORD_UPDATE);
    });
    it('has default availableConnections', () => {
        expect(duplicatedElement.availableConnections).toEqual([
            {
                type: CONNECTOR_TYPE.REGULAR
            },
            {
                type: CONNECTOR_TYPE.FAULT
            }
        ]);
    });
});

describe('recordUpdate Demutation', () => {
    describe('recordUpdate function using sObject', () => {
        it('demutate record update using sObject', () => {
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateUsingSobject);
            expect(actualResult).toMatchObject(recordUpdateUsingSobject);
        });
    });
    describe('recordUpdate function using Fields', () => {
        let recordUpdateUsingFields;
        let mutatedRecordUpdateWithFields;
        beforeEach(() => {
            recordUpdateUsingFields = recordUpdateUsingFieldsTemplate();
            mutatedRecordUpdateWithFields = mutatedRecordUpdateWithFieldsTemplate();
        });
        it('should throw error if no "mutatedRecordUpdate" passed', () => {
            expect(() => createRecordUpdateMetadataObject(null)).toThrowError('recordUpdate is not defined');
        });
        it('demutated filter with value', () => {
            mutatedRecordUpdateWithFields.filters = [mutatedFilterWithValueFieldAndOperator];
            mutatedRecordUpdateWithFields.filterLogic = CONDITION_LOGIC.AND;
            recordUpdateUsingFields.filters = [filterWithValueFieldAndOperator];
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateWithFields);
            expect(actualResult).toMatchObject(recordUpdateUsingFields);
        });
        it('reset filters if "filterLogic" equals no conditions', () => {
            mutatedRecordUpdateWithFields = {
                filters: [mutatedFilterWithValueFieldAndOperator],
                filterLogic: CONDITION_LOGIC.NO_CONDITIONS,
                wayToFindRecords: RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP
            };
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateWithFields);
            expect(actualResult.filters).toHaveLength(0);
        });
        it('if "filterLogic" equals no conditions, filter logic should be undefined', () => {
            mutatedRecordUpdateWithFields = {
                filters: [mutatedFilterWithValueFieldAndOperator],
                filterLogic: CONDITION_LOGIC.NO_CONDITIONS
            };
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateWithFields);
            expect(actualResult.filterLogic).toBeUndefined();
        });
        it('demutate 1 filter with value and 1 filter without value', () => {
            mutatedRecordUpdateWithFields.filters = [mutatedFilterWithValueFieldAndOperator, mutatedFilterWithField];
            mutatedRecordUpdateWithFields.filterLogic = CONDITION_LOGIC.AND;
            recordUpdateUsingFields.filters = [filterWithValueFieldAndOperator, filterWithField];
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateWithFields);
            expect(actualResult).toMatchObject(recordUpdateUsingFields);
        });
        it('demutate inputAssignments with value', () => {
            mutatedRecordUpdateWithFields.inputAssignments = [mutatedInputAssignmentFieldValue];
            recordUpdateUsingFields.inputAssignments = [inputAssignmentFieldValue];
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateWithFields);
            expect(actualResult).toMatchObject(recordUpdateUsingFields);
        });
        it('demutate inputAssignments with multiple values', () => {
            mutatedRecordUpdateWithFields.inputAssignments = [
                mutatedInputAssignmentFieldValue,
                mutatedInputAssignmentField,
                mutatedInputAssignmentFieldBooleanValue
            ];
            recordUpdateUsingFields.inputAssignments = [
                inputAssignmentFieldValue,
                inputAssignmentField,
                inputAssignmentFieldBooleanValue
            ];
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateWithFields);
            expect(actualResult).toMatchObject(recordUpdateUsingFields);
        });
    });
});
