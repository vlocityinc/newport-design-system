import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { isScreen, getAllScreenFieldTypes, getExtensionFieldTypes, processScreenExtensionTypes } from 'builder_platform_interaction-screen-editor-utils';
import { screenReducer } from './screen-reducer';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { invokeAlertModal } from 'builder_platform_interaction-builder-utils';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

/**
 * Screen editor container and template (3-col layout) for palette, canvas and property editor
 */
export default class ScreenEditor extends Element {
    @track screen;
    @track selectedNode;
    @track selectedItemGuid;

    @track screenFieldTypes;
    @track extensionTypes;

    constructor() {
        super();

        // Get all screen field types
        this.screenFieldTypes = getAllScreenFieldTypes();
        getExtensionFieldTypes().then(data => {
            this.extensionTypes = data;
            this.node = processScreenExtensionTypes(unwrap(this.screen));
        }).catch(error => {
            throw error;
        });
    }
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
     * @param {string} property - The property to select in the canvas in case the selected node is the screen (this would be either the header or the footer)
     */
    setSelectedNode(value, property) {
        this.selectedNode = unwrap(value); // Unwrapping to get rid of the double proxy warning message (Property "selectedNode" is set to a non-trackable object...)
        if (value === this.screen) {
            this.selectedItemGuid = property;
        } else if (value) {
            this.selectedItemGuid = value.guid;
        } else {
            this.selectedItemGuid = null;
        }
    }

    /**
     * Handler for the add screen field event
     * @param {event} event - The event
     */
    handleAddScreenField = (event) => {
        // Add the new field to the canvas.
        this.screen = screenReducer(this.screen, event);

        // select the new field on the canvas.
        const position = Number.isInteger(event.position) ? event.position : this.screen.fields.length - 1;
        this.setSelectedNode(this.screen.fields[position]);

        // Because this is a new screen field, set this flag, which is used by the property
        // editor to figure out fields that can be set/edited.
        // TODO: W-4947221 - make sure this isn't saved when the flow is saved
        this.screen.fields[position].isNewMode = true;
    }

    /**
     * Handler for the delete screen element event. Invokes the delete confirmation modal.
     * @param {event} event - The event
     */
    handleDeleteScreenElement = (event) => {
        const deleteCallBack = () => {
            this.screen = screenReducer(this.screen, event);
            this.handleDeselectScreenElement();
        };

        // Invoking the delete confirmation modal
        invokeAlertModal({
            headerData: {
                headerTitle: LABELS.deleteConfirmation
            },
            bodyData: {
                bodyTextOne: LABELS.deleteConsequence
            },
            footerData: {
                buttonOne: {
                    buttonLabel: LABELS.cancel
                },
                buttonTwo: {
                    buttonVariant: "destructive",
                    buttonLabel: LABELS.deleteAlternativeText,
                    buttonCallback: deleteCallBack
                }
            }
        });
    };

    /**
     * Handler for the property changed event
     * @param {event} event - The event
     */
    handlePropertyChanged = (event) => {
        this.screen = screenReducer(this.screen, event, this.selectedNode);
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
            this.setSelectedNode(this.screen, event.property);
        }
    }

    /**
     * Handler for the deselect screen element event, sets the selected node to the screen and clears the selection in the canvas
     */
    handleDeselectScreenElement = (/* event */) => {
        this.setSelectedNode(this.screen);
        this.selectedItemGuid = null;
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