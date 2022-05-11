import { NewResourceEvent } from 'builder_platform_interaction/events';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement } from 'lwc';
import { LABELS } from './fieldInputMenuLabels';

const { withKeyboardInteractions } = keyboardInteractionUtils;

export default class FieldInputMenu extends withKeyboardInteractions(LightningElement) {
    labels = LABELS;

    // TODO (W-10397619): This boolean will be updated in Amelie's filter story. Default to true for now.
    showFooter = true;

    // TODO: a11y support will be done as part of another PR
    getKeyboardInteractions() {
        return [];
    }

    handleFooterClick(event) {
        event.preventDefault();
        this.dispatchEvent(new NewResourceEvent(null, false));
    }

    // Mock Data
    sections = [
        {
            key: 'Quick Resources',
            label: 'Flow Elements',
            items: [
                {
                    dataType: undefined,
                    displayText: 'ScreenWithSection',
                    hasNext: true,
                    iconAlternativeText: 'Screen',
                    iconName: 'standard:screen',
                    iconSize: 'small',
                    rightIconName: 'utility:chevronright',
                    rightIconSize: 'x-small',
                    rightIconAlternativeText: 'Chevron Right',
                    subtype: null,
                    label: 'ScreenWithSection',
                    name: 'ScreenWithSection',
                    type: 'option-card',
                    value: '23a963ec-f168-4151-804b-9541689dc879',
                    text: 'ScreenWithSection'
                },
                {
                    dataType: undefined,
                    displayText: 'Decision',
                    hasNext: true,
                    iconAlternativeText: 'Decision',
                    iconName: 'standard:decision',
                    iconSize: 'small',
                    iconShape: 'diamond',
                    rightIconName: 'utility:chevronright',
                    rightIconSize: 'x-small',
                    rightIconAlternativeText: 'Chevron Right',
                    subtype: null,
                    label: 'Decision',
                    name: 'Decision',
                    type: 'option-card',
                    value: 'DecisionGuid',
                    text: 'Decision'
                }
            ]
        },
        {
            key: 'Variables',
            label: 'VARIABLES',
            items: [
                {
                    dataType: 'DateTime',
                    displayText: 'dateTimeVariable',
                    hasNext: false,
                    iconAlternativeText: 'DateTime',
                    iconName: 'utility:date_time',
                    iconSize: 'x-small',
                    rightIconName: '',
                    subtype: null,
                    name: 'dateTimeVariable',
                    type: 'option-card',
                    value: '8c861e30-c3c6-481d-a8b1-f43bc38f10c9',
                    text: 'dateTimeVariable'
                },
                {
                    dataType: 'Date',
                    displayText: 'dateVariable',
                    hasNext: false,
                    iconAlternativeText: 'Date',
                    iconName: 'utility:event',
                    iconSize: 'x-small',
                    rightIconName: '',
                    subtype: null,
                    name: 'dateVariable',
                    type: 'option-card',
                    value: '82ca4cf8-12df-43c4-ab7c-c29a7eb6a020',
                    text: 'dateVariable'
                }
            ]
        },
        {
            key: 'Global Resources',
            label: 'Global Resources',
            items: [
                {
                    description: 'Description for Flow',
                    dataType: undefined,
                    displayText: 'Current Flow',
                    hasNext: true,
                    iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                    iconName: 'utility:system_and_global_variable',
                    iconSize: 'x-small',
                    rightIconName: 'utility:chevronright',
                    rightIconSize: 'x-small',
                    rightIconAlternativeText: 'Chevron Right',
                    subtype: '$Flow',
                    label: 'Current Flow',
                    name: '$Flow',
                    type: 'option-card',
                    value: '$Flow',
                    text: 'Current Flow'
                },
                {
                    description: 'Description for Organization',
                    dataType: undefined,
                    displayText: 'Current Org',
                    hasNext: true,
                    iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                    iconName: 'utility:system_and_global_variable',
                    iconSize: 'x-small',
                    rightIconName: 'utility:chevronright',
                    rightIconSize: 'x-small',
                    rightIconAlternativeText: 'Chevron Right',
                    subtype: '$Organization',
                    label: 'Current Org',
                    name: '$Organization',
                    type: 'option-card',
                    value: '$Organization',
                    text: 'Current Org'
                },
                {
                    dataType: undefined,
                    displayText: 'Current User',
                    hasNext: true,
                    iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                    iconName: 'utility:system_and_global_variable',
                    iconSize: 'x-small',
                    rightIconName: 'utility:chevronright',
                    rightIconSize: 'x-small',
                    rightIconAlternativeText: 'Chevron Right',
                    subtype: '$User',
                    label: 'Current User',
                    name: '$User',
                    type: 'option-card',
                    value: '$User',
                    text: 'Current User'
                }
            ]
        },
        {
            key: 'Global Developer Resources',
            label: 'Global Developer Resources',
            items: [
                {
                    iconSize: 'x-small',
                    iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                    iconName: 'utility:system_and_global_variable',
                    text: 'Case_Details_Stage',
                    value: 'ddd1239d-e746-4e8e-8317-979c8f919a22',
                    displayText: '{!Case_Details_Stage}',
                    hasNext: false,
                    type: 'option-card',
                    subtype: null,
                    textNoHighlight: 'Case_Details_Stage'
                },
                {
                    iconSize: 'x-small',
                    iconAlternativeText: 'FlowBuilderComboboxIconAltText.systemGlobalVariableCategoryIconAltText',
                    iconName: 'utility:system_and_global_variable',
                    text: 'Contact_Details_Stage',
                    value: '0c3362bc-d3f3-49e2-9bcc-c1fbdaa23f71',
                    displayText: '{!Contact_Details_Stage}',
                    hasNext: false,
                    type: 'option-card',
                    subtype: null,
                    textNoHighlight: 'Contact_Details_Stage'
                }
            ]
        }
    ];
}
