// @ts-nocheck
/**
 * Used by recordLookupVariableAndFieldMapping and record lookup editor to indicate that the variableandfieldmapping value has changed.
 */
const eventName = 'variableandfieldmappingchanged';

export class VariableAndFieldMappingChangedEvent extends Event {
    /**
     * @param {String} the selected value of variableAndFieldMapping, can be manual, automatic, manuallySelectFields
     */
    constructor(variableAndFieldMapping) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
        this.detail = {
            variableAndFieldMapping
        };
    }

    static EVENT_NAME = eventName;
}
