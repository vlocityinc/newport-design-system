export const mockActionParameters = [
    {
        dataType: 'reference',
        isInput: true,
        isOutput: false,
        isRequired: false,
        label: 'Community Id',
        maxOccurs: 1,
        name: 'communityId',
        description: 'Optional. Valid only if Salesforce Communities is enabled. Required if posting to a user or Chatter group that belongs to a Salesforce Community.'
    },
    {
        dataType: 'string',
        isInput: true,
        isOutput: false,
        isRequired: true,
        label: 'Target Name or ID',
        maxOccurs: 1,
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
        name: 'text',
        description: 'Required. Body of the Chatter post.'
    },
    {
        dataType: 'reference',
        isInput: false,
        isOutput: true,
        isRequired: false,
        label: 'Feed Item ID',
        maxOccurs: 1,
        name: 'feedItemId',
        description: 'The ID of the new Chatter feed item.'
    }
];