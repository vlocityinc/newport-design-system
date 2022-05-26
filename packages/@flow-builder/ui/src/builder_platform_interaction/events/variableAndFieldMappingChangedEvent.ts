/**
 * Used by recordLookupVariableAndFieldMapping and record lookup editor to indicate that the variableandfieldmapping value has changed.
 */

enum VARIABLE_AND_FIELD_MAPPING_VALUES {
    AUTOMATIC = 'automatic',
    AUTOMATIC_WITH_FIELDS = 'manuallySelectFields',
    MANUAL = 'manual'
}

const eventName = 'variableandfieldmappingchanged';

type VariableAndFieldMappingChangedEventDetail = {
    variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES;
};

export class VariableAndFieldMappingChangedEvent extends CustomEvent<VariableAndFieldMappingChangedEventDetail> {
    /**
     * @param {string} variableAndFieldMapping - the selected value of variableAndFieldMapping, can be manual, automatic, manuallySelectFields
     */
    constructor(variableAndFieldMapping) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                variableAndFieldMapping
            }
        });
    }

    static EVENT_NAME = eventName;
}
