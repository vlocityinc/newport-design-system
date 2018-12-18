export const mockActionParameters = [
    {
        dataType: 'reference',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Community Id',
        maxOccurs: 1,
        name: 'communityId',
        sobjectType: null,
        description: 'Optional. Valid only if Salesforce Communities is enabled. Required if posting to a user or Chatter group that belongs to a Salesforce Community.'
    },
    {
        dataType: 'string',
        isInput: true,
        isOutput: false,
        isRequired: true,
        label: 'Target Name or ID',
        maxOccurs: 1,
        sobjectType: null,
        name: 'subjectNameOrId',
        description: 'Required. The user, Chatter group, or record whose feed you want to post to.'
    },
    {
        dataType: 'string',
        isInput: true,
        isOutput: false,
        isRequired: true,
        label: 'Message',
        maxOccurs: 1,
        sobjectType: null,
        name: 'text',
        description: 'Required. Body of the Chatter post.'
    },
    {
        dataType: 'sobject',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Account',
        maxOccurs: 1,
        sobjectType: 'Account',
        name: 'account',
        description: 'Optional. Account sobject'
    },
    {
        dataType: 'sobject',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Account List',
        maxOccurs: 2000,
        sobjectType: 'Account',
        name: 'accountList',
        description: 'Optional. Account sobject collection'
    },
    {
        dataType: 'reference',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Feed Item ID',
        maxOccurs: 1,
        sobjectType: null,
        name: 'feedItemId',
        description: 'The ID of the new Chatter feed item.'
    }
];

export const mockAllTypesActionParameters = [
    {
        dataType: 'string',
        isInput: true,
        isOutput: false,
        isRequired: true,
        label: 'String Parameter',
        maxOccurs: 1,
        sobjectType: null,
        name: 'stringParam',
        description: 'Required String Parameter.'
    },
    {
        dataType: 'string',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'String Collection Parameter',
        maxOccurs: 5,
        sobjectType: null,
        name: 'stringColParam',
        description: 'Optional String Collection Parameter.'
    },
    {
        dataType: 'sobject',
        isInput: true,
        isOutput: false,
        isRequired: true,
        label: 'Account Parameter',
        maxOccurs: 1,
        sobjectType: 'Account',
        name: 'accountParam',
        description: 'Required Account Parameter.'
    },
    {
        dataType: 'sobject',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Account Collection Parameter',
        maxOccurs: 2000,
        name: 'accountColParam',
        sobjectType: 'Account',
        description: 'Optional Account Collection Parameter.'
    },
    {
        dataType: 'int',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Number Parameter',
        maxOccurs: 1,
        sobjectType: null,
        name: 'numberParam',
        description: 'Optional Number Parameter.'
    },
    {
        dataType: 'int',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Number Collection Parameter',
        maxOccurs: 2000,
        sobjectType: null,
        name: 'numberColParam',
        description: 'Optional Number Collection Parameter.'
    },
    {
        dataType: 'date',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Date Parameter',
        maxOccurs: 1,
        sobjectType: null,
        name: 'dateParam',
        description: 'Optional Date Parameter.'
    },
    {
        dataType: 'date',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Date Collection Parameter',
        maxOccurs: 2000,
        sobjectType: null,
        name: 'dateColParam',
        description: 'Optional Date Collection Parameter.'
    },
    {
        dataType: 'boolean',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Boolean Parameter',
        maxOccurs: 1,
        sobjectType: null,
        name: 'booleanParam',
        description: 'Optional Boolean Parameter.'
    },
    {
        dataType: 'boolean',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Boolean Collection Parameter',
        maxOccurs: 2000,
        sobjectType: null,
        name: 'booleanColParam',
        description: 'Optional Boolean Collection Parameter.'
    },
    {
        dataType: 'id',
        isInput: true,
        isOutput: false,
        isRequired: true,
        label: 'Id Parameter',
        maxOccurs: 1,
        sobjectType: null,
        name: 'idParam',
        description: 'Required Id Parameter.'
    },
    {
        dataType: 'string',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Output String Parameter',
        maxOccurs: 1,
        sobjectType: null,
        name: 'outputStringParam',
        description: 'Output String Parameter.'
    },
    {
        dataType: 'string',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Output String Collection Parameter',
        maxOccurs: 5,
        sobjectType: null,
        name: 'outputStringColParam',
        description: 'Output String Collection Parameter.'
    },
    {
        dataType: 'sobject',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Output Account Parameter',
        maxOccurs: 1,
        sobjectType: 'Account',
        name: 'outputAccountParam',
        description: 'Output Account Parameter.'
    },
    {
        dataType: 'sobject',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Output Account Collection Parameter',
        maxOccurs: 2000,
        name: 'outputAccountColParam',
        sobjectType: 'Account',
        description: 'Output Account Collection Parameter.'
    },
    {
        dataType: 'int',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Output Number Parameter',
        maxOccurs: 1,
        sobjectType: null,
        name: 'outputNumberParam',
        description: 'Output Number Parameter.'
    },
    {
        dataType: 'int',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Output Number Collection Parameter',
        maxOccurs: 2000,
        sobjectType: null,
        name: 'outputNumberColParam',
        description: 'Output Number Collection Parameter.'
    },
    {
        dataType: 'date',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Output Date Parameter',
        maxOccurs: 1,
        sobjectType: null,
        name: 'outputDateParam',
        description: 'Output Date Parameter.'
    },
    {
        dataType: 'date',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Output Date Collection Parameter',
        maxOccurs: 2000,
        sobjectType: null,
        name: 'outputDateColParam',
        description: 'Output Date Collection Parameter.'
    },
];