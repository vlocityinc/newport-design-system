import { createRecordUpdate, createDuplicateRecordUpdate, createRecordUpdateMetadataObject } from '../recordUpdate';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { DUPLICATE_ELEMENT_XY_OFFSET } from '../base/baseElement';

expect.extend(deepFindMatchers);

const recordUpdateUsingSobject = {
    name: 'RecordUpdate1',
    description: '',
    inputReference: 'myObject',
};

const recordUpdateUsingFieldsTemplate = () => {
    return {name: 'RecordUpdate1',
        description: '',
        object: 'myObject',
        inputAssignments: []};
};

const mutatedRecordUpdateUsingSobject = {
    name: 'RecordUpdate1',
    description: '',
    elementType: ELEMENT_TYPE.RECORD_UPDATE,
    inputReference: 'myObject',
    useSobject: true
};

const mutatedRecordUpdateWithFieldsTemplate = () => {
    return { name: 'RecordUpdate1',
    description: '',
    object: 'myObject',
    elementType: ELEMENT_TYPE.RECORD_UPDATE,
    useSobject: false};
};

const filterWithValueFieldAndOperator = {
    field: 'description',
    value:{ stringValue: 'myDescription' },
    operator:'equals'
};

const filterWithField = {
    field: 'title'
};

const mutatedFilterWithField = {
    leftHandSide: 'myObject.title',
    operator: '',
    rightHandSide: '',
    rightHandSideDataType: '',
};

const mutatedFilterWithValueFieldAndOperator = {
    leftHandSide: 'myObject.description',
    operator: 'equals',
    rightHandSide: 'myDescription',
    rightHandSideDataType: 'String',
};

const inputAssignmentFieldValue = {
    field: 'description',
    value:{ stringValue: 'myDescription' }
};

const inputAssignmentField = {
    field: 'title',
};

const inputAssignmentFieldBooleanValue = {
    field: 'isEditable',
    value:{ booleanValue: false }
};

const mutatedInputAssignmentFieldValue = {
    leftHandSide: 'myObject.description',
    rightHandSide: 'myDescription',
    rightHandSideDataType: 'String',
};

const mutatedInputAssignmentField = {
    leftHandSide: 'myObject.title',
    rightHandSide: '',
    rightHandSideDataType: '',
};

const mutatedInputAssignmentFieldBooleanValue = {
    leftHandSide: 'myObject.isEditable',
    rightHandSide: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
    rightHandSideDataType: 'Boolean',
};

describe('recordUpdate Mutation', () => {
    describe('recordUpdate function using sObject', () => {
        it('returns a new record update object when no argument is passed; numberRecordsToStore should be set to FIRSt_RECORD by default', () => {
            const mutatedResult = {
                name: '',
                description: '',
                elementType: ELEMENT_TYPE.RECORD_UPDATE,
                useSobject: true
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
    describe('recordUpdate function using Fields', () => {
        let recordUpdateUsingFields;
        let mutatedRecordUpdateWithFields;
        beforeEach(() => {
            recordUpdateUsingFields = recordUpdateUsingFieldsTemplate();
            mutatedRecordUpdateWithFields = mutatedRecordUpdateWithFieldsTemplate();
        });
        it('filter with value should return same with calculated numberRecordsToStore', () => {
            recordUpdateUsingFields.filters = [filterWithValueFieldAndOperator];
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.filters = [mutatedFilterWithValueFieldAndOperator];
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('filter with and without value should return same with calculated numberRecordsToStore', () => {
            recordUpdateUsingFields.filters = [filterWithValueFieldAndOperator, filterWithField];
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.filters = [mutatedFilterWithValueFieldAndOperator, mutatedFilterWithField];
            mutatedRecordUpdateWithFields.filterType = RECORD_FILTER_CRITERIA.ALL;
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('default filtering mode for a new update element is all', () => {
            recordUpdateUsingFields.isNewElement = true;
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.filterType = RECORD_FILTER_CRITERIA.ALL;
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('inputAssignments with value should return the expression (RHS/LHS)', () => {
            recordUpdateUsingFields.inputAssignments = [inputAssignmentFieldValue];
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.inputAssignments = [mutatedInputAssignmentFieldValue];
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('inputAssignments with multiple values should return the expression (RHS/LHS)', () => {
            recordUpdateUsingFields.inputAssignments = [inputAssignmentFieldValue, inputAssignmentField, inputAssignmentFieldBooleanValue];
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            mutatedRecordUpdateWithFields.inputAssignments = [mutatedInputAssignmentFieldValue, mutatedInputAssignmentField, mutatedInputAssignmentFieldBooleanValue];
            expect(actualResult).toMatchObject(mutatedRecordUpdateWithFields);
        });
        it('has dataType of boolean', () => {
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            expect(actualResult.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
        });
        it('has no common mutable object with record update metadata passed as parameter', () => {
            const actualResult = createRecordUpdate(recordUpdateUsingFields);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordUpdateUsingFields);
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
        expect(duplicatedElement.availableConnections).toEqual([{
            type: CONNECTOR_TYPE.REGULAR
        }, {
            type: CONNECTOR_TYPE.FAULT
        }]);
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
        it('demutated filter with value', () => {
            mutatedRecordUpdateWithFields.filters = [mutatedFilterWithValueFieldAndOperator];
            mutatedRecordUpdateWithFields.filterType = RECORD_FILTER_CRITERIA.ALL;
            recordUpdateUsingFields.filters = [filterWithValueFieldAndOperator];
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateWithFields);
            expect(actualResult).toMatchObject(recordUpdateUsingFields);
        });
        it('demutate 1 filter with value and 1 filter without value', () => {
            mutatedRecordUpdateWithFields.filters = [mutatedFilterWithValueFieldAndOperator, mutatedFilterWithField];
            mutatedRecordUpdateWithFields.filterType = RECORD_FILTER_CRITERIA.ALL;
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
            mutatedRecordUpdateWithFields.inputAssignments = [mutatedInputAssignmentFieldValue, mutatedInputAssignmentField, mutatedInputAssignmentFieldBooleanValue];
            recordUpdateUsingFields.inputAssignments = [inputAssignmentFieldValue, inputAssignmentField, inputAssignmentFieldBooleanValue];
            const actualResult = createRecordUpdateMetadataObject(mutatedRecordUpdateWithFields);
            expect(actualResult).toMatchObject(recordUpdateUsingFields);
        });
    });
});