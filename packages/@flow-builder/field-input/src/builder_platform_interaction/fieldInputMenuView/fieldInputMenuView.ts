import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement, track } from 'lwc';

const { withKeyboardInteractions } = keyboardInteractionUtils;

/**
 * Abstract super class for Field Input Menu views
 *
 * TODO: add secondary focus interaction
 */
export default abstract class FieldInputMenuView<T> extends withKeyboardInteractions(LightningElement) {
    /* The view sections */
    @track sections: FieldInput.MenuSection[] = [];

    /**
     * Implement in subclasses to update the sections with the data returned by the api
     *
     * @param data - The api data
     */
    abstract updateSectionsWithData(data: T): void;

    /**
     * Updates the view's sections with the data provided from an api
     *
     * @param apiResponse - The api result
     */
    updateSections(apiResponse: WireResponse<T>): void {
        const { error, data } = apiResponse;

        if (error != null) {
            // TODO: fix error handling
            console.log(error);
        }

        if (data != null) {
            this.updateSectionsWithData(data);
        }
    }
}
