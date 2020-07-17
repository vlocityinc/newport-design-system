// @ts-nocheck
import {
    createAssignment,
    createAssignmentWithConnectors,
    createDuplicateAssignment,
    createAssignmentMetadataObject
} from '../assignment';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const defaultAssignmentElement = {
    elementType: ELEMENT_TYPE.ASSIGNMENT,
    description: '',
    name: '',
    guid: 'testGUID',
    label: '',
    maxConnections: 1,
    locationX: 0,
    locationY: 0,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0,
    assignmentItems: [
        {
            leftHandSide: '',
            operator: '',
            rightHandSide: '',
            rightHandSideDataType: '',
            rowIndex: 'testGUID'
        }
    ]
};

const testAssignmentElement = {
    elementType: ELEMENT_TYPE.ASSIGNMENT,
    description: 'testElementDesc',
    name: 'assignment1',
    guid: 'testGUID',
    label: 'assignment1label',
    maxConnections: 1,
    locationX: 10,
    locationY: 10,
    isCanvasElement: true,
    config: {
        isSelected: false
    },
    connectorCount: 0,
    assignmentItems: [
        {
            leftHandSide: 'foo',
            operator: 'Equals',
            rightHandSide: 'bar',
            rightHandSideDataType: 'String',
            rowIndex: 'testGUID'
        }
    ]
};

const testAssignmentMetadataElement = {
    description: 'testElementDesc',
    name: 'assignment1',
    label: 'assignment1label',
    locationX: 10,
    locationY: 10,
    assignmentItems: [
        {
            assignToReference: 'foo',
            operator: 'Equals',
            value: {
                stringValue: 'bar'
            }
        }
    ]
};

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return 'testGUID';
        })
    };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        shouldUseAutoLayoutCanvas: jest.fn()
    };
});

describe('Assignment Element Factory', () => {
    describe('createAssignment Function', () => {
        it('returns a new assignment element object with default values when no arguments are passed', () => {
            const result = createAssignment();
            expect(result).toMatchObject(defaultAssignmentElement);
        });
        it('copies an assignment element object if one is passed in', () => {
            const result = createAssignment(testAssignmentElement);
            expect(result).toMatchObject(testAssignmentElement);
        });
    });

    describe('createAssignmentWithConnectors Function', () => {
        it('returns new assignment element & connector using connector from base assignment object', () => {
            const { connectors } = createAssignmentWithConnectors({
                connector: { targetReference: 'foo' }
            });
            const target = connectors[0].target;
            expect(target).toBe('foo');
        });
    });

    describe('createDuplicateAssignment Function', () => {
        it('returns new duplicated assignment element with new name and guid', () => {
            const assignment = {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                name: 'assignment1',
                assignmentItems: [
                    {
                        leftHandSide: 'foo',
                        operator: 'Equals',
                        rightHandSide: 'bar',
                        rightHandSideDataType: 'String',
                        rowIndex: 'testGUID'
                    }
                ]
            };
            const newName = 'dupeName';
            const newGuid = 'dupeGuid';
            const { duplicatedElement } = createDuplicateAssignment(assignment, newGuid, newName);
            expect(duplicatedElement).toEqual(
                expect.objectContaining(Object.assign(assignment, { name: newName, guid: newGuid }))
            );
        });
    });

    describe('createAssignmentMetadataObject Function', () => {
        it('returns a new assignment metadata object from a store assignment object', () => {
            const result = createAssignmentMetadataObject(testAssignmentElement);
            expect(result).toMatchObject(testAssignmentMetadataElement);
        });
    });
});
