import {
    getMergeWarning,
    MERGE_VARIABLES_WARNING_TYPE
} from '../subflowVariablesWarnings';

describe('getMergeWarning', () => {
    it('Returns a warning if variable is only in latest version', () => {
        // Given
        const latestVersionVariable = {
            dataType: 'String',
            isCollection: false,
            isInput: true,
            isOutput: false,
            name: 'inputOutput2',
            scale: 0
        };

        // When
        const warning = getMergeWarning(undefined, latestVersionVariable);

        // Then
        expect(warning).toBe(
            MERGE_VARIABLES_WARNING_TYPE.ONLY_AVAILABLE_IN_LATEST
        );
    });
    it('Returns a warning if variable is only in active version', () => {
        // Given
        const activeVersionVariable = {
            dataType: 'String',
            isCollection: false,
            isInput: true,
            isOutput: false,
            name: 'inputOutput2',
            scale: 0
        };

        // When
        const warning = getMergeWarning(activeVersionVariable, undefined);

        // Then
        expect(warning).toBe(
            MERGE_VARIABLES_WARNING_TYPE.ONLY_AVAILABLE_IN_ACTIVE
        );
    });
    it('Returns no warning if variable is both in active and latest with same type', () => {
        // Given
        const activeVersionVariable = {
            dataType: 'String',
            isCollection: false,
            isInput: true,
            isOutput: false,
            name: 'input1',
            scale: 0
        };
        const latestVersionVariable = {
            dataType: 'String',
            isCollection: false,
            isInput: true,
            isOutput: false,
            name: 'input1',
            scale: 0
        };
        // When
        const warning = getMergeWarning(
            activeVersionVariable,
            latestVersionVariable
        );

        // Then
        expect(warning).toBeUndefined();
    });
    it('Returns a warning if variable is both in active and latest but with a different type', () => {
        // Given
        const activeVersionVariable = {
            dataType: 'String',
            isCollection: false,
            isInput: true,
            isOutput: false,
            name: 'input1',
            scale: 0
        };
        const latestVersionVariable = {
            dataType: 'Number',
            isCollection: false,
            isInput: true,
            isOutput: false,
            name: 'input1',
            scale: 0
        };
        // When
        const warning = getMergeWarning(
            activeVersionVariable,
            latestVersionVariable
        );

        // Then
        expect(warning).toBe(MERGE_VARIABLES_WARNING_TYPE.DATA_TYPE_CHANGED);
    });
});
