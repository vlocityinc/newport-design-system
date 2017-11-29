import { Element } from "engine";

/**
 * Toolbar component for flow builder.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class Toolbar extends Element {
    /**
     * Event handler for click event on save button.
     * It dispatches an event named save which can be handled by parent component
     * @param {object} event - Save button click event
     */
    handleSave(event) {
        event.preventDefault();
        const saveEvent = new CustomEvent("save");
        this.dispatchEvent(saveEvent);
    }
}