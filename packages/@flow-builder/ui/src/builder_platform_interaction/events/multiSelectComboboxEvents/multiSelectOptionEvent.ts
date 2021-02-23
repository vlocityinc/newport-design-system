// @ts-nocheck
/**
 * Used to report on an option being selected to the multiSelectCombobox LWC component
 */
const eventName = 'optionselected';

export class MultiSelectOptionEvent {
    constructor(label = null, isDefault = false, isSelected = false) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                label,
                isDefault,
                isSelected
            }
        });
    }

    static EVENT_NAME = eventName;
}
