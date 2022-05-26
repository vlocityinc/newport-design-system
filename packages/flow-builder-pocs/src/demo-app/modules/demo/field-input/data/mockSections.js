const mockSections: FieldInput.MenuSection[] = [
    {
        key: 'Quick Resources',
        label: 'Flow Elements',
        items: [
            {
                key: 'ScreenWithSection',
                type: 'Element',
                label: 'ScreenWithSection',
                value: '23a963ec-f168-4151-804b-9541689dc879',
                dataType: undefined,
                subtype: undefined,

                iconAlternativeText: 'Screen',
                iconName: 'standard:screen',
                iconSize: 'small'
            },
            {
                type: 'Element',
                dataType: undefined,

                iconAlternativeText: 'Decision',
                iconName: 'standard:decision',
                iconSize: 'small',
                iconShape: 'diamond',

                label: 'Decision',

                value: 'DecisionGuid',

                key: 'Decision'
            }
        ]
    },
    {
        key: 'Variables',
        label: 'Variables',
        items: [
            {
                type: 'SObject',
                dataType: 'SObject',
                subtype: 'Account',

                iconAlternativeText: 'DateTime',
                iconName: 'utility:date_time',
                iconSize: 'x-small',

                value: 'ba8a8e41-3944-4099-9655-065f054e811f',

                label: 'Current Account',
                key: 'Current Account'
            },
            {
                type: 'Leaf',
                dataType: 'DateTime',

                iconAlternativeText: 'DateTime',
                iconName: 'utility:date_time',
                iconSize: 'x-small',

                value: '8c861e30-c3c6-481d-a8b1-f43bc38f10c9',

                label: 'dateTimeVariable',
                key: 'dateTimeVariable'
            },
            {
                type: 'Leaf',
                dataType: 'Date',

                iconAlternativeText: 'Date',
                iconName: 'utility:event',
                iconSize: 'x-small',

                value: '82ca4cf8-12df-43c4-ab7c-c29a7eb6a020',

                label: 'dateTimeVariable',
                key: 'dateVariable'
            }
        ]
    },
    {
        key: 'Global Resources',
        label: 'Global Resources',
        items: [
            {
                type: 'GlobalResource',
                description: 'Description for Flow',
                dataType: undefined,

                iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                iconName: 'utility:system_and_global_variable',
                iconSize: 'x-small',

                subtype: '$Flow',
                label: 'Current Flow',

                value: '$Flow',

                key: 'Current Flow'
            },
            {
                type: 'GlobalResource',
                description: 'Description for Organization',
                dataType: undefined,

                iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                iconName: 'utility:system_and_global_variable',
                iconSize: 'x-small',

                subtype: '$Organization',
                label: 'Current Org',

                value: '$Organization',

                key: 'Current Org'
            },
            {
                type: 'GlobalResource',
                dataType: undefined,

                iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                iconName: 'utility:system_and_global_variable',
                iconSize: 'x-small',
                subtype: '$User',
                label: 'Current User',

                value: '$User',

                key: 'Current User'
            }
        ]
    },
    {
        key: 'Global Developer Resources',
        label: 'Global Developer Resources',
        items: [
            {
                type: 'Leaf',
                iconSize: 'x-small',
                iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                iconName: 'utility:system_and_global_variable',

                value: 'ddd1239d-e746-4e8e-8317-979c8f919a22',

                label: 'Case_Details_Stage',
                key: 'ddd1239d-e746-4e8e-8317-979c8f919a22'
            },
            {
                type: 'Leaf',
                iconSize: 'x-small',
                iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                iconName: 'utility:system_and_global_variable',

                value: '0c3362bc-d3f3-49e2-9bcc-c1fbdaa23f71',

                label: 'Contact_Details_Stage',
                key: '0c3362bc-d3f3-49e2-9bcc-c1fbdaa23f71'
            }
        ]
    }
];

export default mockSections;
