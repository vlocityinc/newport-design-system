import { Element, api } from 'engine';

const SAVE = 'save';

const statusIconErrorTitle = 'Resolve Errors';

/**
 * Toolbar component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class Toolbar extends Element {
    @api isSaveDisabled;
    @api errors;

    headerTitleForSummary = statusIconErrorTitle;

    /**
     * Event handler for click event on save button.
     * It dispatches an event named save which can be handled by parent component
     * @param {Object} event - Save button click event
     */
    handleSave(event) {
        event.preventDefault();
        const saveEvent = new CustomEvent(SAVE);
        this.dispatchEvent(saveEvent);
    }
}