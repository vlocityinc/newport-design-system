export const comboboxInitialConfig = {
    menuData: [
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
        }
    ],
    placeholder: 'placeholderText',
    value: 'testvalue',
    label: 'label',
    type: 'String',
    disabled: false,
    required: true,
    errorMessage: 'testErrorMessage',
};


export const secondLevelMenuData =
[
    {
        items: [
            {
                type: 'option-card',
                text: 'FirstName',
                iconName: 'standard:account',
                subText: 'First Name',
                value: '{!MyAccount.FirstName}'
            },
            {
                type: 'option-card',
                text: 'LastName',
                iconName: 'standard:account',
                subText: 'Last Name',
                value: '{!MyAccount.LastName}'
            },
            {
                type: 'option-card',
                text: 'AnnualRevenue',
                iconName: 'standard:account',
                subText: 'Annual Revenue',
                value: '{!MyAccount.AnnualRevenue}'
            },
        ]
    }
];