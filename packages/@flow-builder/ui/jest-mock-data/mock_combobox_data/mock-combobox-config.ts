// @ts-nocheck
export const comboboxInitialConfig = {
    menuData: [
        {
            text: 'New Resource',
            value: '%%NewResource%%',
            iconName: 'utility:add',
            type: 'option-inline'
        },
        {
            label: 'SObject Variables',
            items: [
                {
                    iconSize: 'xx-small',
                    text: 'MyAccount',
                    subText: 'Account',
                    value: 'b4c16f3b-b29c-4f73-a561-442247440fba',
                    displayText: '{!MyAccount}',
                    hasNext: true,
                    iconName: 'utility:sobject',
                    type: 'option-card',
                    dataType: 'SObject',
                    subtype: 'Account'
                },
                {
                    iconSize: 'xx-small',
                    text: 'MyContact',
                    subText: 'Contact',
                    value: 'VAR2',
                    displayText: '{!MyContact}',
                    hasNext: true,
                    iconName: 'utility:sobject',
                    type: 'option-card',
                    dataType: 'SObject',
                    subtype: 'Contact'
                }
            ]
        },
        {
            label: 'Variables',
            items: [
                {
                    iconSize: 'xx-small',
                    text: 'MyName',
                    subText: 'Text',
                    value: 'VAR3',
                    displayText: '{!MyVar1}',
                    hasNext: false,
                    iconName: 'utility:text',
                    type: 'option-card',
                    dataType: 'String',
                    subtype: null
                },
                {
                    iconSize: 'xx-small',
                    text: 'MyNumber2',
                    subText: 'Number',
                    value: 'VAR4',
                    displayText: '{!MyNumber2}',
                    hasNext: false,
                    iconName: 'utility:topic2',
                    type: 'option-card',
                    dataType: 'Number',
                    subtype: null
                },
                {
                    iconSize: 'xx-small',
                    text: 'StartDateVar',
                    subText: 'Date',
                    value: 'VAR5',
                    displayText: '{!StartDateVar}',
                    hasNext: false,
                    iconName: 'utility:event',
                    type: 'option-card',
                    dataType: 'Date',
                    subtype: null
                },
                {
                    iconSize: 'xx-small',
                    text: 'Is Applicable?',
                    subText: 'Boolean',
                    value: 'VAR6',
                    displayText: '{!MyBooleanVar}',
                    hasNext: false,
                    iconName: 'utility:crossfilter',
                    type: 'option-card',
                    dataType: 'Boolean',
                    subtype: null
                }
            ]
        },
        {
            label: 'Global Constants',
            items: [
                {
                    text: '$GlobalConstant.True',
                    subText: 'True',
                    value: '$GlobalConstant.True',
                    displayText: '{!$GlobalConstant.True}',
                    hasNext: false,
                    type: 'option-card',
                    dataType: 'Boolean',
                    subtype: null
                },
                {
                    text: '$GlobalConstant.EmptyString',
                    subText: 'EmptyString',
                    value: '$GlobalConstant.EmptyString',
                    displayText: '{!$GlobalConstant.EmptyString}',
                    hasNext: false,
                    type: 'option-card',
                    dataType: 'String',
                    subtype: null
                }
            ]
        }
    ],
    placeholder: 'placeholderText',
    value: {
        value: 'testGuid',
        displayText: 'testvalue'
    },
    label: 'label',
    type: 'String',
    literalsAllowed: true,
    blockValidation: false,
    enableFieldDrilldown: true,
    disabled: false,
    required: true,
    errorMessage: 'testErrorMessage'
};

const accountVar = comboboxInitialConfig.menuData[1].items[0];

export const secondLevelMenuData = [
    {
        type: 'option-card',
        text: 'CreatedBy',
        subText: 'Created By ID',
        displayText: '{!accountVar.CreatedBy}',
        iconName: 'utility:text',
        iconSize: 'xx-small',
        value: 'b4c16f3b-b29c-4f73-a561-442247440fba.CreatedBy',
        parent: accountVar,
        dataType: 'SObject',
        subtype: 'User',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'xx-small',
        hasNext: true
    },
    {
        type: 'option-card',
        text: 'FirstName',
        iconName: 'standard:account',
        subText: 'First Name',
        value: '{!MyAccount.FirstName}',
        displayText: '{!MyAccount.FirstName}',
        parent: accountVar
    },
    {
        type: 'option-card',
        text: 'LastName',
        iconName: 'standard:account',
        subText: 'Last Name',
        value: '{!MyAccount.LastName}',
        displayText: '{!MyAccount.LastName}',
        parent: accountVar
    },
    {
        type: 'option-card',
        text: 'AnnualRevenue',
        iconName: 'standard:account',
        subText: 'Annual Revenue',
        value: '{!MyAccount.AnnualRevenue}',
        displayText: '{!MyAccount.AnnualRevenue}',
        parent: accountVar
    }
];

const accountCreatedByField = secondLevelMenuData[0];

export const thirdLevelMenuData = [
    {
        type: 'option-card',
        text: 'EmployeeNumber',
        subText: 'Employee Number',
        displayText: '{!accountVar.CreatedBy.EmployeeNumber}',
        iconName: 'utility:text',
        iconSize: 'xx-small',
        value: 'b4c16f3b-b29c-4f73-a561-442247440fba.CreatedBy.EmployeeNumber',
        parent: accountCreatedByField
    }
];
