// @ts-nocheck
export const BUILDER_MODE = {
    EDIT_MODE: 'editMode',
    DEBUG_MODE: 'debugMode',
    TEST_MODE: 'testMode'
};

let builderType;

/**
 * @param value sets the builder type to one of the builder mode values
 */
export function setBuilderType(value) {
    builderType = value;
}

export const getBuilderType = () => builderType;
