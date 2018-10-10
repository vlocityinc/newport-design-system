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