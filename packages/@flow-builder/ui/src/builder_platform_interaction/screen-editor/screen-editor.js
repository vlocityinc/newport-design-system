import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { isScreen } from 'builder_platform_interaction-screen-editor-utils';
import { screenReducer } from './screen-reducer';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { showConfirmationDialog } from 'builder_platform_interaction-builder-utils';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

/**
 * Screen editor container and template (3-col layout) for palette, canvas and property editor
 */
export default class ScreenEditor extends Element {
    @track screen;
    @track selectedNode;

    /**
     * Screen node getter
     * @returns {object} The screen
     */
    @api get node() {
        return this.screen;
    }

    /**
     * Screen node setter, sets the value and initializes the selectedNode
     * @param {object} newValue - The new screen
     */
    @api set node(newValue) {
        this.screen = newValue || {};
        this.setSelectedNode(this.screen);
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.screen);
    }

    /**
     * public api function to run the rules from assignment validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.screen = screenReducer(this.screen, event);
        return getErrorsFromHydratedElement(this.screen);
    }

    /**
     * Returns the selected node in the editor (added for testing)
     * @returns {object} - The selected node
     */
    @api getSelectedNode() {
        return this.selectedNode;
    }

    /**
     * Sets the selected node in the editor to the value provided
     * @param {object} value - The new selected node
     */
    setSelectedNode(value) {
        this.selectedNode = unwrap(value); // Unwrapping to get rid of the double proxy warning message (Property "selectedNode" is set to a non-trackable object...)
    }

    /**
     * Handler for the add screen field event
     * @param {event} event - The event
     */
    handleAddScreenField = (event) => {
        // Add the new field to the canvas.
        this.screen = screenReducer(this.screen, event);

        // select the new field on the canvas.
        Promise.resolve().then(() => {
            const position = Number.isInteger(event.position) ? event.position : this.screen.fields.length - 1;
            const canvas = this.template.querySelector('builder_platform_interaction-screen-editor-canvas');
            canvas.selectField(position);
        });
    }

    /**
     * Handler for the delete screen element event. Deletes a screen field or sets the showHeader/showFooter elements to false
     * @param {event} event - The event
     */
    handleDeleteScreenElement = (event) => {
        const element = event.screenElement;
        if (element.guid === this.screen.guid) {
            // TODO W-4971424: Remove this, we shouldn't be able to delete header & footer from canvas
            this.handlePropertyChanged(new PropertyChangedEvent(event.property, false, null, null, true));
        } else {
            const dialogAttributes = {
                title: LABELS.deleteConfirmation,
                bodyText: LABELS.deleteConsequence,
                primaryButton: {
                    actionText: LABELS.cancel,
                    variant: "neutral"
                },
                secondaryButton: {
                    actionText: LABELS.deleteAlternativeText,
                    variant: "destructive"
                }
            };
            showConfirmationDialog(dialogAttributes, () => {
                this.screen = screenReducer(this.screen, event);
                this.handleDeselectScreenElement();
            });
        }
    }

    /**
     * Handler for the property changed event
     * @param {event} event - The event
     */
    handlePropertyChanged = (event) => {
        this.screen = screenReducer(this.screen, event);
        if (isScreen(this.selectedNode)) {
            this.setSelectedNode(this.screen);
        } else {
            this.setSelectedNode(this.screen.getFieldByGUID(this.selectedNode.guid));
        }
    }

    /**
     * Handler for the select screen element event
     * @param {event} event - The event
     */
    handleSelectScreenElement = (event) => {
        const elem = event.screenElement;
        if (elem && elem.guid !== this.screen.guid) {
            this.setSelectedNode(this.screen.getFieldByGUID(elem.guid));
        } else {
            this.setSelectedNode(this.screen);
        }
    }

    /**
     * Handler for the deselect screen element event, sets the selected node to the screen and clears the selection in the canvas
     */
    handleDeselectScreenElement = (/* event */) => {
        this.setSelectedNode(this.screen);
        this.template.querySelector('builder_platform_interaction-screen-editor-canvas').clearSelection();
    }

    /**
     * Handles reordering a list of the screen fields
     * @param {efvent} event - reorderListEvent
     */
    handleReorder(event) {
        this.screen = screenReducer(this.screen, event);
        event.stopPropagation();
    }
}