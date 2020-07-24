// @ts-nocheck
/**
 * To test when we need specific global variable field types like multipicklist
 */

export const mockGlobalVariablesWithMultiPicklistField = {
    globalVariableTypes: [
        {
            durableId: 'Flow-$Organization',
            fieldsToNull: [],
            label: 'Organization',
            name: '$Organization'
        }
    ],
    globalVariables: [
        {
            datatype: 'String',
            label: 'Country',
            name: 'Country',
            type: {
                fieldsToNull: [],
                name: '$Organization'
            }
        },
        {
            datatype: 'Multipicklist',
            durableId: 'Flow-$Organization-MP__c',
            fieldsToNull: [],
            label: 'MP',
            name: 'MP__c',
            type: {
                fieldsToNull: [],
                name: '$Organization'
            }
        }
    ]
};
