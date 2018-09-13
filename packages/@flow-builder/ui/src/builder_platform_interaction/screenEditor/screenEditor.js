import { LightningElement, api, track, unwrap } from 'lwc';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { isScreen, getAllScreenFieldTypes, getExtensionFieldTypes, processScreenExtensionTypes, processRequiredParamsForExtensionsInScreen } from 'builder_platform_interaction/screenEditorUtils';
import { screenReducer } from './screenReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { invokeModal } from 'builder_platform_interaction/builderUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

/**
 * Screen editor container and template (3-col layout) for palette, canvas and property editor
 */
export default class ScreenEditor extends LightningElement {
    @track screen;
    @track selectedNode;
    @track selectedItemGuid;

    @track screenFieldTypes;
    @track extensionTypes;

    labels = LABELS;

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
    set node(newValue) {
        this.processScreenExtensions(unwrap(newValue) || {});
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.screen;
    }

    /**
     * public api function to run the rules from assignment validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        processRequiredParamsForExtensionsInScreen(unwrap(this.screen));
        this.screen = screenReducer(this.screen, event);
        const errors = getErrorsFromHydratedElement(this.screen);
        return errors;
    }

    /**
     * Returns the selected node in the editor (added for testing)
     * @returns {object} - The selected node
     */
    @api getSelectedNode() {
        return this.selectedNode;
    }

    /**
     * Retrieves the description for all extension screen fields and adds all required input parameters that are not present to those fields
     * (this should never happen as this would mean the flow is invalid, but it is a good check)
     * Triggers processPaletteExtensions
     * @param {Screen} newScreen - The screen to process
     */
    processScreenExtensions(newScreen) {
        processRequiredParamsForExtensionsInScreen(newScreen, (data) => {
            if (data.error) {
                throw data.error;
            } else {
                this.screen = data.screen;
                this.setSelectedNode(this.screen);
                this.processPaletteExtensions();
            }
        });
    }

    /**
     * Retrieves a list of available extensions (LCs) to add to the palette
     */
    processPaletteExtensions() {
        // Get all screen field types
        this.screenFieldTypes = getAllScreenFieldTypes();
        getExtensionFieldTypes().then(data => {
            this.extensionTypes = data;
            this.screen = processScreenExtensionTypes(unwrap(this.screen));
        }).catch(error => {
            throw error;
        });
    }

    /**
     * Sets the selected node in the editor to the value provided
     * @param {object} value - The new selected node
     * @param {string} property - The property to select in the canvas in case the selected node is the screen (this would be either the header or the footer)
     */
    setSelectedNode(value, property) {
        this.selectedNode = value;
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
        invokeModal({
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
    };

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
    };

    /**
     * Handler for the deselect screen element event, sets the selected node to the screen and clears the selection in the canvas
     */
    handleDeselectScreenElement = (/* event */) => {
        this.setSelectedNode(this.screen);
        this.selectedItemGuid = null;
    };

    /**
     * Handles reordering a list of the screen fields
     * @param {efvent} event - reorderListEvent
     */
    handleReorder = (event) => {
        this.screen = screenReducer(this.screen, event);
        event.stopPropagation();
    };
}