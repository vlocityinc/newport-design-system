export const comboboxInitialConfig = {
    menuData: [
        {
            displayText: 'New Resource',
            text: 'New Resource',
            value: '%%NewResource%%',
            iconName: 'utility:add',
            type: 'option-inline'
        },
        {
            label: 'SObject Variables',
            items: [
                {
                    iconAlternativeText: 'SObject',
                    iconSize: 'xx-small',
                    text: 'MyAccount',
                    rightIconName: 'utility:chevronright',
                    rightIconSize: 'xx-small',
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
                    iconAlternativeText: 'SObject',
                    iconSize: 'xx-small',
                    text: 'MyContact',
                    rightIconName: 'utility:chevronright',
                    rightIconSize: 'xx-small',
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
                    iconAlternativeText: 'String',
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
                    iconAlternativeText: 'Number',
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
                    iconAlternativeText: 'Date',
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
                    iconAlternativeText: 'Boolean',
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
                    iconAlternativeText: 'Boolean',
                    iconName: 'utility:crossfilter',
                    iconSize: 'xx-small',
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
                    iconAlternativeText: 'String',
                    iconName: 'utility:text',
                    iconSize: 'xx-small',
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
export const [mockAccountVar]: any = comboboxInitialConfig.menuData[1].items;
export const secondLevelMenuData = [
    {
        type: 'option-card',
        text: 'CreatedBy',
        subText: 'Created By ID',
        displayText: '{!MyAccount.CreatedBy}',
        iconAlternativeText: undefined,
        iconName: undefined,
        iconSize: 'xx-small',
        isCollection: false,
        value: 'b4c16f3b-b29c-4f73-a561-442247440fba.CreatedBy',
        parent: mockAccountVar,
        dataType: 'SObject',
        subtype: 'User',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'xx-small',
        hasNext: true
    },
    {
        dataType: 'Currency',
        type: 'option-card',
        text: 'AnnualRevenue',
        iconAlternativeText: 'Currency',
        iconName: 'utility:currency',
        iconSize: 'xx-small',
        subText: 'Annual Revenue',
        subtype: undefined,
        value: 'b4c16f3b-b29c-4f73-a561-442247440fba.AnnualRevenue',
        displayText: '{!MyAccount.AnnualRevenue}',
        parent: mockAccountVar
    }
];

const accountCreatedByField = secondLevelMenuData[0];

export const thirdLevelMenuData = [
    {
        dataType: 'String',
        type: 'option-card',
        text: 'EmployeeNumber',
        subText: 'Employee Number',
        subtype: undefined,
        displayText: '{!MyAccount.CreatedBy.EmployeeNumber}',
        iconAlternativeText: 'String',
        iconName: 'utility:text',
        iconSize: 'xx-small',
        isCollection: undefined,
        value: 'b4c16f3b-b29c-4f73-a561-442247440fba.CreatedBy.EmployeeNumber',
        parent: accountCreatedByField
    }
];
export const mockSObjectFieldFourthLevelComboboxItem = {
    text: [
        {
            highlight: true,
            text: 'AboutMe'
        }
    ],
    subText: [
        {
            highlight: false,
            text: 'About Me'
        }
    ],
    displayText: '{!myAccount.CreatedBy.Manager.AboutMe}',
    iconAlternativeText: 'String',
    iconName: 'utility:text',
    iconSize: 'xx-small',
    isCollection: undefined,
    value: '44aa5706-a115-48ed-9b42-27ab178150b6.CreatedBy.Manager.AboutMe',
    parent: {
        iconAlternativeText: undefined,
        iconName: undefined,
        iconSize: 'xx-small',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'xx-small',
        type: 'option-card',
        text: 'Manager',
        subText: 'Manager ID',
        displayText: '{!myAccount.CreatedBy.Manager}',
        value: '44aa5706-a115-48ed-9b42-27ab178150b6.CreatedBy.Manager',
        parent: accountCreatedByField,
        dataType: 'SObject',
        subtype: 'User',
        isCollection: false,
        hasNext: true
    },
    dataType: 'String',
    textNoHighlight: 'AboutMe',
    subTextNoHighlight: 'About Me'
};
export const mockGlobalConstantEmptyStringComboboxItem = {
    text: [
        {
            highlight: true,
            text: '$GlobalConstant.EmptyString'
        }
    ],
    value: '$GlobalConstant.EmptyString',
    displayText: '{!$GlobalConstant.EmptyString}',
    subText: [
        {
            highlight: false,
            text: 'Equivalent to empty string (not null)'
        }
    ],
    subtype: null,
    hasNext: false,
    iconAlternativeText: 'String',
    iconName: 'utility:text',
    iconSize: 'xx-small',
    dataType: 'String',
    type: 'option-card'
};
export const mockGlobalVariableFlowCurrentDateComboboxItem = {
    text: [
        {
            highlight: true,
            text: 'CurrentDate'
        }
    ],
    subText: [
        {
            highlight: false,
            text: 'Date'
        }
    ],
    displayText: '{!$Flow.CurrentDate}',
    iconAlternativeText: 'Date',
    iconSize: 'xx-small',
    iconName: 'utility:event',
    type: 'option-card',
    value: '$Flow.CurrentDate',
    parent: {
        dataType: undefined,
        iconAlternativeText: 'Global variable',
        iconSize: 'xx-small',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'xx-small',
        subText: undefined,
        value: '$Flow',
        subtype: '$Flow',
        text: '$Flow',
        displayText: '{!$Flow}',
        type: 'option-card',
        hasNext: true,
        iconName: 'utility:system_and_global_variable'
    },
    dataType: 'Date',
    subtype: 'Flow',
    isCollection: false
};
export const mockApexDefinedVariable = {
    text: 'vApexComplexTypeTestOne216',
    value: '9444cfb2-70bc-411d-a466-cd0a9b3e1388',
    displayText: '{!vApexComplexTypeTestOne216}',
    subText: 'Apex-Defined',
    iconAlternativeText: 'Apex',
    iconName: 'utility:apex',
    iconSize: 'xx-small',
    rightIconName: 'utility:chevronright',
    rightIconSize: 'xx-small',
    type: 'option-card',
    dataType: 'Apex',
    subtype: 'ApexComplexTypeTestOne216',
    hasNext: true
};
export const mockApexFieldSecondLevelComboboxItem = {
    text: 'booleanField',
    type: 'option-card',
    subText: 'Boolean',
    subtype: undefined,
    displayText: '{!vApexComplexTypeTestOne216.booleanField}',
    iconAlternativeText: 'Boolean',
    iconName: 'utility:crossfilter',
    iconSize: 'xx-small',
    value: '9444cfb2-70bc-411d-a466-cd0a9b3e1388.booleanField',
    parent: mockApexDefinedVariable,
    dataType: 'Boolean',
    isCollection: false
};
export const mockApexSObjectEntitySecondLevelComboboxItem = {
    text: 'acct',
    type: 'option-card',
    subText: 'Record',
    displayText: '{!vApexComplexTypeTestOne216.acct}',
    iconAlternativeText: 'SObject',
    iconName: 'utility:sobject',
    iconSize: 'xx-small',
    value: '27059a62-ddd9-4978-ac06-f3dc18313c35.acct',
    parent: mockApexDefinedVariable,
    rightIconName: 'utility:chevronright',
    rightIconSize: 'xx-small',
    dataType: 'SObject',
    subtype: 'Account',
    isCollection: false,
    hasNext: true
};
export const mockApexFieldThirdLevelComboboxItem = {
    text: [
        {
            highlight: true,
            text: 'AnnualRevenue'
        }
    ],
    subText: [
        {
            highlight: false,
            text: 'Annual Revenue'
        }
    ],
    subtype: undefined,
    type: 'option-card',
    displayText: '{!vApexComplexTypeTestOne216.acct.AnnualRevenue}',
    iconAlternativeText: 'Currency',
    iconName: 'utility:currency',
    iconSize: 'xx-small',
    isCollection: undefined,
    value: '27059a62-ddd9-4978-ac06-f3dc18313c35.acct.AnnualRevenue',
    parent: {
        text: 'acct',
        subText: 'Record',
        displayText: '{!vApexComplexTypeTestOne216.acct}',
        iconName: 'utility:sobject',
        value: '27059a62-ddd9-4978-ac06-f3dc18313c35.acct',
        parent: mockApexDefinedVariable,
        dataType: 'SObject',
        subtype: 'Account',
        isCollection: false
    },
    dataType: 'Currency',
    textNoHighlight: 'AnnualRevenue',
    subTextNoHighlight: 'Annual Revenue'
};
const mockFeedItemVariable = {
    text: 'feedItemVariable',
    value: '5a00fe66-6b3e-4314-823d-2ddf3d15159c',
    displayText: '{!feedItemVariable}',
    subText: 'FeedItem',
    hasNext: true,
    iconAlternativeText: 'SObject',
    iconName: 'utility:sobject',
    iconSize: 'xx-small',
    rightIconName: 'utility:chevronright',
    rightIconSize: 'xx-small',
    dataType: 'SObject',
    subtype: 'FeedItem',
    type: 'option-card'
};
export const mockPolymorphicSObjectEntitySecondLevelComboboxItem = {
    iconAlternativeText: undefined,
    iconName: undefined,
    iconSize: 'xx-small',
    rightIconName: 'utility:chevronright',
    rightIconSize: 'xx-small',
    type: 'option-card',
    text: 'CreatedBy (User)',
    subText: 'Created By ID',
    displayText: '{!feedItemVariable.CreatedBy:User}',
    value: '5a00fe66-6b3e-4314-823d-2ddf3d15159c.CreatedBy:User',
    parent: mockFeedItemVariable,
    dataType: 'SObject',
    subtype: 'User',
    isCollection: false,
    hasNext: true
};
export const mockPolymorphicSObjectFieldThirdLevelComboboxItem = {
    isCollection: undefined,
    type: 'option-card',

    text: [
        {
            highlight: true,
            text: 'AboutMe'
        }
    ],
    subText: [
        {
            highlight: false,
            text: 'About Me'
        }
    ],
    subtype: undefined,
    displayText: '{!feedItemVariable.CreatedBy:User.AboutMe}',
    iconAlternativeText: 'String',
    iconName: 'utility:text',
    iconSize: 'xx-small',
    value: '5a00fe66-6b3e-4314-823d-2ddf3d15159c.CreatedBy:User.AboutMe',
    parent: mockPolymorphicSObjectEntitySecondLevelComboboxItem,
    dataType: 'String',
    textNoHighlight: 'AboutMe',
    subTextNoHighlight: 'About Me'
};
export const mockPolymorphicSObjectFieldThirdLevelMultiSubTextComboboxItem = {
    isCollection: undefined,
    subtype: undefined,
    type: 'option-card',
    text: [
        {
            highlight: true,
            text: 'Name'
        }
    ],
    subText: [
        {
            highlight: false,
            text: 'Full '
        },
        {
            highlight: true,
            text: 'Name'
        }
    ],
    displayText: '{!vFeedItem.CreatedBy:User.Name}',
    iconAlternativeText: 'String',
    iconName: 'utility:text',
    iconSize: 'xx-small',
    value: '30d2d542-eba9-4b66-9e8e-20515f7dd3ce.CreatedBy:User.Name',
    parent: mockPolymorphicSObjectEntitySecondLevelComboboxItem,
    dataType: 'String',
    textNoHighlight: 'Name',
    subTextNoHighlight: 'Full Name'
};

export const mockEmailScreenFieldAutoSecondLevelFieldComboboxItem = {
    type: 'option-card',
    text: [
        {
            highlight: true,
            text: 'readonly'
        }
    ],
    subText: [
        {
            highlight: false,
            text: 'Read Only'
        }
    ],
    subtype: undefined,
    displayText: '{!emailScreenFieldAutomaticOutput.readonly}',
    iconAlternativeText: 'Boolean',
    iconName: 'utility:crossfilter',
    iconSize: 'xx-small',
    value: '6de8888c-22c7-4bf8-8308-4a25ae107e30.readonly',
    parent: {
        text: 'emailScreenFieldAutomaticOutput',
        value: '6de8888c-22c7-4bf8-8308-4a25ae107e30',
        displayText: '{!emailScreenFieldAutomaticOutput}',
        subText: 'Email',
        hasNext: true,
        iconAlternativeText: 'Screen component',
        iconName: 'utility:connected_apps',
        iconSize: 'xx-small',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'xx-small',
        type: 'option-card',
        dataType: 'LightningComponentOutput',
        subtype: null
    },
    dataType: 'Boolean',
    isCollection: false,
    textNoHighlight: 'readonly',
    subTextNoHighlight: 'Read Only'
};

export const mockApexCallApexClassOutputSecondLevelComboboxItem = {
    type: 'option-card',
    text: 'car',
    subText: 'car',
    displayText: '{!apexCall_Car_automatic_output.car}',
    iconAlternativeText: 'Apex',
    iconName: 'utility:apex',
    iconSize: 'xx-small',
    rightIconName: 'utility:chevronright',
    rightIconSize: 'xx-small',
    value: '047e8f53-5716-401f-bb4a-bce1c4ffb724.car',
    parent: {
        text: [
            {
                highlight: false,
                text: 'Outputs from apexCall_'
            },
            {
                highlight: true,
                text: 'Car'
            },
            {
                highlight: false,
                text: '_automatic_output'
            }
        ],
        value: '047e8f53-5716-401f-bb4a-bce1c4ffb724',
        displayText: '{!apexCall_Car_automatic_output}',
        subText: [
            {
                highlight: false,
                text: 'apexCall '
            },
            {
                highlight: true,
                text: 'Car'
            },
            {
                highlight: false,
                text: ' automatic output'
            }
        ],
        hasNext: true,
        iconAlternativeText: 'ActionOutput',
        iconName: 'utility:fallback',
        iconSize: 'xx-small',
        rightIconName: 'utility:chevronright',
        rightIconSize: 'xx-small',
        type: 'option-card',
        dataType: 'ActionOutput',
        subtype: null,
        textNoHighlight: 'Outputs from apexCall_Car_automatic_output',
        subTextNoHighlight: 'apexCall Car automatic output'
    },
    dataType: 'Apex',
    subtype: 'Car',
    isCollection: false,
    hasNext: true
};
