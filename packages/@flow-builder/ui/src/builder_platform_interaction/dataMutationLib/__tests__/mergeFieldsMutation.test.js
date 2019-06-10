import {
    mutateTextWithMergeFields,
    demutateTextWithMergeFields
} from '../mergeFieldsMutation';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const ELEMENTS = {
    VARIABLE_1: {
        guid: 'VARIABLE_1',
        name: 'variable1'
    },
    VARIABLE_2: {
        guid: 'VARIABLE_2',
        name: 'variable2'
    }
};

describe('Text with merge fields mutation', () => {
    beforeEach(() => {
        Store.setMockState({ elements: ELEMENTS });
    });
    it('Replaces guid by devName for a merge field inside a template', () => {
        expect(
            mutateTextWithMergeFields('a template with {!VARIABLE_1}')
        ).toEqual('a template with {!variable1}');
    });
    it('Replaces guid by devName for a compound merge field inside a template', () => {
        expect(mutateTextWithMergeFields('{!VARIABLE_1.name}')).toEqual(
            '{!variable1.name}'
        );
    });
    it('Replaces guids by devName for multiple merge fields inside a template', () => {
        expect(
            mutateTextWithMergeFields(' {!VARIABLE_1.name} {!VARIABLE_2.id}')
        ).toEqual(' {!variable1.name} {!variable2.id}');
    });
    it('Ignores unknown elements for merge fields', () => {
        expect(mutateTextWithMergeFields(' {!NOT_A_VARIABLE.a}')).toEqual(
            ' {!NOT_A_VARIABLE.a}'
        );
    });
    it('Replaces guid by devName for cross-object field references', () => {
        expect(
            mutateTextWithMergeFields(
                ' {!VARIABLE_1.objectName1.objectName2.fieldName}'
            )
        ).toEqual(' {!variable1.objectName1.objectName2.fieldName}');
    });
    it('Replaces guid by devName for polymorphic relationships in cross-object field references', () => {
        expect(
            mutateTextWithMergeFields(
                ' {!VARIABLE_1.polymorphicObjectName1:specificObjectName2.fieldName}'
            )
        ).toEqual(
            ' {!variable1.polymorphicObjectName1:specificObjectName2.fieldName}'
        );
    });
    it('Properly handle {!{!', () => {
        expect(mutateTextWithMergeFields(' {!{!VARIABLE_1}}')).toEqual(
            ' {!{!VARIABLE_1}}'
        );
    });
});

describe('Text with merge fields demutation', () => {
    beforeEach(() => {
        Store.setMockState({ elements: ELEMENTS });
    });
    it('Replaces devName by guid for a merge field inside a template', () => {
        expect(demutateTextWithMergeFields('{!variable1}')).toEqual(
            '{!VARIABLE_1}'
        );
    });
    it('Replaces devName by guid, ignoring devName case', () => {
        expect(demutateTextWithMergeFields('{!Variable1.first}')).toEqual(
            '{!VARIABLE_1.first}'
        );
    });
    it('Replaces devName by guid for a compound merge field inside a template', () => {
        expect(demutateTextWithMergeFields('{!variable1.first}')).toEqual(
            '{!VARIABLE_1.first}'
        );
    });
    it('Replaces devNames by guids for multiple merge fields inside a template', () => {
        expect(
            demutateTextWithMergeFields(' {!variable1.a} {!variable2.a}')
        ).toEqual(' {!VARIABLE_1.a} {!VARIABLE_2.a}');
    });
    it('Ignores unknown elements for merge fields', () => {
        expect(demutateTextWithMergeFields(' {!not_a_variable.a}')).toEqual(
            ' {!not_a_variable.a}'
        );
    });
    it('Properly handle {!{!', () => {
        expect(demutateTextWithMergeFields(' {!{!variable1}}')).toEqual(
            ' {!{!variable1}}'
        );
    });
    it('Replaces devName by guid for cross-object field references', () => {
        expect(
            demutateTextWithMergeFields(
                ' {!variable1.objectName1.objectName2.fieldName}'
            )
        ).toEqual(' {!VARIABLE_1.objectName1.objectName2.fieldName}');
    });
    it('Replaces devName by guid for polymorphic relationships in cross-object field references', () => {
        expect(
            demutateTextWithMergeFields(
                ' {!variable1.polymorphicObjectName1:specificObjectName2.fieldName}'
            )
        ).toEqual(
            ' {!VARIABLE_1.polymorphicObjectName1:specificObjectName2.fieldName}'
        );
    });
});
