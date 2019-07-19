import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { hydrateIfNecessary } from 'builder_platform_interaction/dataMutationLib';

const EXPANDED_SECTION_NAMES = ['containerOptions'];

/*
 * Screen element property editor
 */
export default class ScreenPropertiesEditor extends LightningElement {
    @api
    screen;
    labels = LABELS;

    get expandedSectionNames() {
        return EXPANDED_SECTION_NAMES;
    }

    // Refire the event including the old value.
    // This function only handles changes from the label-description component, not the rest of the properties
    handlePropertyChanged = event => {
        event.stopPropagation();
        const property = event.detail.propertyName;
        const error = event.detail.error;
        const newValue = hydrateIfNecessary(event.detail.value);
        const currentValue = hydrateIfNecessary(this.screen[property]);
        this.dispatchEvent(
            new PropertyChangedEvent(
                property,
                newValue,
                error,
                null,
                currentValue
            )
        );
    };
}
