import { createOutputAssignment, createOutputAssignmentMetadataObject } from '../../base/outputAssignments';

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return 'MOCK_GUID';
        })
    };
});

const mockSobject = 'MOCK_SOBJECT';
const outputAssignmentElementFromServer = {
    assignToReference: 'MOCK_FER',
    field: 'MOCK_FIELD'
};
const outputAssignmentElementAfterFactory = {
    leftHandSide: 'MOCK_SOBJECT.MOCK_FIELD',
    rightHandSide: 'MOCK_FER',
    rowIndex: 'MOCK_GUID'
};

describe('createOutputAssignment function', () => {
    describe('when no params are supplied', () => {
        const result = createOutputAssignment();
        it('has leftHandSide property with value as empty string', () => {
            expect(result.leftHandSide).toBe('');
        });
        it('has rightHandSide property with value as empty string', () => {
            expect(result.rightHandSide).toBe('');
        });
    });
    describe('when an outputAssignment and sObject is supplied in params', () => {
        const result = createOutputAssignment(outputAssignmentElementFromServer, mockSobject);
        it('result object matches the outputAssignmentElementAfterFactory object', () => {
            expect(result).toMatchObject(outputAssignmentElementAfterFactory);
        });
    });
});

describe('createOutputAssignmentMetadataObject function', () => {
    it('when no params are passed throws an error', () => {
        expect(() => {
            createOutputAssignmentMetadataObject();
        }).toThrow();
    });
    describe('when a valid outputAssignment param is passed', () => {
        const result = createOutputAssignmentMetadataObject(outputAssignmentElementAfterFactory);
        it('result object matches the outputAssignmentElementFromServer object', () => {
            expect(result).toMatchObject(outputAssignmentElementFromServer);
        });
    });
});