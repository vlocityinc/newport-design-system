import {
    mutateAssignment,
    deMutateAssignment
} from '../assignmentEditorDataMutation';
import { FEROV_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";

jest.mock('builder_platform_interaction-store-lib', () => {
    return {
        generateGuid: () => {
            return 'GUID';
        }
    };
});

describe('mutateAssignment function', () => {
    it('should mutate assignment with assignmentItems', () => {
        const assignment = {
            label: 'abc',
            assignmentItems: [
                {
                    assignToReference: 'var1',
                    operator: 'assign',
                    value: { stringValue: 'abc' }
                },
                {
                    assignToReference: 'var2',
                    operator: 'assign',
                    value: { stringValue: 'abc' }
                }
            ]
        };
        mutateAssignment(assignment);
        expect(assignment).toEqual({
            label: 'abc',
            assignmentItems: [
                {
                    rowIndex: 'GUID',
                    leftHandSide: 'var1',
                    operator: 'assign',
                    rightHandSide: 'abc',
                    rightHandSideDataType: FEROV_DATA_TYPE.STRING
                },
                {
                    rowIndex: 'GUID',
                    leftHandSide: 'var2',
                    operator: 'assign',
                    rightHandSide: 'abc',
                    rightHandSideDataType: FEROV_DATA_TYPE.STRING
                }
            ]
        });
    });

    it('should mutate assignment with no assignmentItems', () => {
        const assignment = {
            label: 'abc'
        };
        mutateAssignment(assignment);
        expect(assignment).toEqual({
            label: 'abc'
        });
    });

    it('should not blow up mutating an assignment with empty assignmentItems', () => {
        const assignment = {
            label: 'abc',
            assignmentItems: []
        };
        mutateAssignment(assignment);
        expect(assignment).toEqual({
            label: 'abc',
            assignmentItems: []
        });
    });

    it('should not blow up mutating an assignment with null assignmentItems', () => {
        const assignment = {
            label: 'abc',
            assignmentItems: null
        };
        mutateAssignment(assignment);
        expect(assignment).toEqual({
            label: 'abc',
            assignmentItems: null
        });
    });
});

describe('deMutateAssignment function', () => {
    it('should demutate assignment with assignmentItems', () => {
        const assignment = {
            label: 'abc',
            assignmentItems: [
                {
                    leftHandSide: 'var1',
                    operator: 'assign',
                    rightHandSide: 'abc',
                    rightHandSideDataType: FEROV_DATA_TYPE.STRING
                },
                {
                    leftHandSide: 'var2',
                    operator: 'assign',
                    rightHandSide: 'abc',
                    rightHandSideDataType: FEROV_DATA_TYPE.STRING
                }
            ]
        };
        deMutateAssignment(assignment);
        expect(assignment).toEqual({
            label: 'abc',
            assignmentItems: [
                {
                    assignToReference: 'var1',
                    operator: 'assign',
                    value: { stringValue: 'abc' }
                },
                {
                    assignToReference: 'var2',
                    operator: 'assign',
                    value: { stringValue: 'abc' }
                }
            ]
        });
    });

    it('should demutate assignment with no assignmentItems', () => {
        const assignment = {
            label: 'abc'
        };
        deMutateAssignment(assignment);
        expect(assignment).toEqual({
            label: 'abc'
        });
    });

    it('should not blow up demutating an assignment with empty assignmentItems', () => {
        const assignment = {
            label: 'abc',
            assignmentItems: [{}]
        };
        deMutateAssignment(assignment);
        expect(assignment).toEqual({
            label: 'abc',
            assignmentItems: [{}]
        });
    });
});
