export const comboboxInitialConfig = {
    menuData: [
        {
            text: 'New Resource',
            value: '%%NewResource%%',
            iconName: 'utility:add',
            type: 'option-inline',
        },
        {
            label: 'SObject Variables',
            items: [
                {
                    text: 'MyAccount',
                    subText: 'Account',
                    value: 'VAR1',
                    displayText: '{!MyAccount}',
                    hasNext: true,
                    iconName: 'standard:account',
                    type: 'option-card',
                },
                {
                    text: 'MyContact',
                    subText: 'Contact',
                    value: 'VAR2',
                    displayText: '{!MyContact}',
                    hasNext: true,
                    iconName: 'standard:contact',
                    type: 'option-card',
                },
            ]
        },
        {
            label: 'Variables',
            items: [
                {
                    text: 'MyName',
                    subText: 'String',
                    value: 'VAR3',
                    displayText: '{!MyVar1}',
                    hasNext: false,
                    iconName: 'utility:text_color',
                    type: 'option-card',
                },
                {
                    text: 'MyNumber2',
                    subText: 'Number',
                    value: 'VAR4',
                    displayText: '{!MyNumber2}',
                    hasNext: false,
                    iconName: 'utility:number',
                    type: 'option-card',
                },
                {
                    text: 'StartDateVar',
                    subText: 'Date',
                    value: 'VAR5',
                    displayText: '{!StartDateVar}',
                    hasNext: false,
                    iconName: 'utility:date',
                    type: 'option-card',
                },
                {
                    text: 'Is Applicable?',
                    subText: 'Date',
                    value: 'VAR6',
                    displayText: '{!MyBooleanVar}',
                    hasNext: false,
                    iconName: 'utility:boolean',
                    type: 'option-card',
                },
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
                },
                {
                    text: '$GlobalConstant.EmptyString',
                    subText: 'EmptyString',
                    value: '$GlobalConstant.EmptyString',
                    displayText: '{!$GlobalConstant.EmptyString}',
                    hasNext: false,
                    type: 'option-card',
                },
            ]
        }
    ],
    placeholder: 'placeholderText',
    value: {
        value: 'testGuid',
        displayText: 'testvalue',
    },
    label: 'label',
    type: 'String',
    literalsAllowed: true,
    blockValidation: false,
    disabled: false,
    required: true,
    errorMessage: 'testErrorMessage',
};

const accountVar = comboboxInitialConfig.menuData[1].items[0];

export const secondLevelMenuData =
[
    {
        type: 'option-card',
        text: 'FirstName',
        iconName: 'standard:account',
        subText: 'First Name',
        value: '{!MyAccount.FirstName}',
        displayText: '{!MyAccount.FirstName}',
        parent: accountVar,
    },
    {
        type: 'option-card',
        text: 'LastName',
        iconName: 'standard:account',
        subText: 'Last Name',
        value: '{!MyAccount.LastName}',
        displayText: '{!MyAccount.LastName}',
        parent: accountVar,
    },
    {
        type: 'option-card',
        text: 'AnnualRevenue',
        iconName: 'standard:account',
        subText: 'Annual Revenue',
        value: '{!MyAccount.AnnualRevenue}',
        displayText: '{!MyAccount.AnnualRevenue}',
        parent: accountVar,
    },
];