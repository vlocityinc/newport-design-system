export const comboboxConfig = {
    menuData: [
        {
            label: 'SObject Variables',
            items: [
                {
                    type: 'option-card',
                    text: 'FirstName',
                    iconName: 'standard:account',
                    subText: 'First Name',
                    value: 'MyAccount.FirstName'
                },
                {
                    type: 'option-card',
                    text: 'LastName',
                    iconName: 'standard:account',
                    subText: 'Last Name',
                    value: 'MyAccount.LastName'
                },
                {
                    type: 'option-card',
                    text: 'AnnualRevenue',
                    iconName: 'standard:account',
                    subText: 'Annual Revenue',
                    value: 'MyAccount.AnnualRevenue'
                },
            ]
        },
        {
            label: 'Variables',
            items: [
                {
                    type: 'option-card',
                    text: 'MyName',
                    iconName: 'utility:text_color',
                    subText: 'String',
                    value: '{!MyVar1}'
                },
                {
                    type: 'option-card',
                    text: 'MyNumber2',
                    iconName: 'utility:number',
                    subText: 'Number',
                    value: '{!MyNumber2}'
                },
                {
                    type: 'option-card',
                    text: 'StartDateVar',
                    iconName: 'utility:date',
                    subText: 'Date',
                    value: '{!StartDateVar}'
                },
                {
                    type: 'option-card',
                    text: 'Is Applicable?',
                    iconName: 'utility:boolean',
                    subText: 'Date',
                    value: '{!MyBooleanVar}'
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