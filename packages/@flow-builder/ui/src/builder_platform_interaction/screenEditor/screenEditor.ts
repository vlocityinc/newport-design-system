import { LightningElement, api, track, unwrap } from 'lwc';
import { getErrorsFromHydratedElement, sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import {
    isScreen,
    getAllScreenFieldTypes,
    processScreenExtensionTypes,
    processRequiredParamsForExtensionsInScreen
} from 'builder_platform_interaction/screenEditorUtils';
import { getExtensionFieldTypes } from 'builder_platform_interaction/flowExtensionLib';
import { screenReducer } from './screenReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { invokeModal } from 'builder_platform_interaction/builderUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { usedByStoreAndElementState, invokeUsedByAlertModal } from 'builder_platform_interaction/usedByLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { hidePopover } from 'builder_platform_interaction/builderUtils';
import { setScreenElement } from 'builder_platform_interaction/expressionUtils';
import { getSupportedScreenFieldTypes } from 'builder_platform_interaction/screenFieldTypeLib';
import { getTriggerType } from 'builder_platform_interaction/storeUtils';
import { format } from 'builder_platform_interaction/commonUtils';
import { orgHasFlowBuilderAutomaticFields } from 'builder_platform_interaction/contextLib';
// @ts-ignore
import templateWithAutomaticFieldsDisabled from './screenEditor.html';
// @ts-ignore
import templateWithAutomaticFieldsEnabled from './screenEditorWithTabs.html';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

export enum ScreenEditorTab {
    Components = 'componentsTab',
    Fields = 'fieldsTab'
}

/**
 * Screen editor container and template (3-col layout) for palette, canvas and property editor
 */
export default class ScreenEditor extends LightningElement {
    @track screen;
    @track selectedNode;
    @track selectedItemGuid;

    @track screenFieldTypes;
    @track extensionTypes;
    activeTab = ScreenEditorTab.Components;
    automaticFieldRecordVariableGuid: UI.Guid = '';
    processTypeValue = '';

    labels = LABELS;

    orgHasFlowBuilderAutomaticFields = orgHasFlowBuilderAutomaticFields();

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
        this.hidePopover();
        const event = { type: VALIDATE_ALL };
        processRequiredParamsForExtensionsInScreen(unwrap(this.screen));
        this.screen = screenReducer(this.screen, event);
        this.resetSelectedNode();
        let errors = getErrorsFromHydratedElement(this.screen);
        const screenPropertiesEditorContainer = this.template.querySelector(
            'builder_platform_interaction-screen-properties-editor-container'
        );
        if (screenPropertiesEditorContainer) {
            const customPropertyEditorErrors = screenPropertiesEditorContainer.validate();
            errors = [...errors, ...customPropertyEditorErrors];
        }
        return errors;
    }

    /**
     * Returns the selected node in the editor (added for testing)
     * @returns {object} - The selected node
     */
    @api getSelectedNode() {
        return this.selectedNode;
    }

    @api getSelectedItemGuid() {
        return this.selectedItemGuid;
    }

    renderedCallback() {
        setScreenElement(this.screen);
    }

    disconnectedCallback() {
        setScreenElement(null);
    }

    get flowLabel() {
        return Store.getStore().getCurrentState().properties.label;
    }

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    @api
    editorParams;

    @api
    get processType() {
        return this.processTypeValue;
    }

    set processType(newValue) {
        this.processTypeValue = newValue;
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
     * Retrieves a list of supported screen types and available extensions (LCs) to add to the palette
     */
    processPaletteExtensions() {
        const triggerType = getTriggerType();
        getSupportedScreenFieldTypes(this.processType, triggerType).then((supportedTypes) => {
            if (supportedTypes) {
                this.screenFieldTypes = getAllScreenFieldTypes().filter((type) =>
                    supportedTypes.some((supportedType) => {
                        return supportedType.name === type.name || supportedType.name === type.fieldType;
                    })
                );
            }
        });
        getExtensionFieldTypes(this.processType)
            .then((data) => {
                this.extensionTypes = data;
                this.screen = processScreenExtensionTypes(this.screen);

                // if any screen extension type is missing, show them as error
                if (this.screen.error) {
                    invokeModal({
                        headerData: {
                            headerTitle: LABELS.errorTitle
                        },
                        bodyData: {
                            bodyTextOne: format(LABELS.errorScreenMissingExtension, this.screen.error)
                        },
                        footerData: {
                            buttonOne: {
                                buttonVariant: 'Brand',
                                buttonLabel: LABELS.okayButtonLabel
                            }
                        }
                    });
                    this.screen.error = null;
                }
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Sets the selected node in the editor to the value provided
     * @param {object} value - The new selected node
     * @param {string} property - The property to select in the canvas in case the selected node is the screen (this would be either the header or the footer)
     */
    setSelectedNode(value, property?: string) {
        this.selectedNode = value;
        if (value === this.screen) {
            this.selectedItemGuid = property;
        } else if (value) {
            this.selectedItemGuid = value.guid;
            this.updateActiveTabAndAutomaticFieldRecordVariable(value);
        } else {
            this.selectedItemGuid = null;
        }
    }

    /**
     * Update the active tab and the automatic field record variable
     * @param screenFieldNode
     */
    private updateActiveTabAndAutomaticFieldRecordVariable(screenFieldNode) {
        if (screenFieldNode.fieldType === FlowScreenFieldType.ObjectProvided) {
            this.activeTab = ScreenEditorTab.Fields;
            this.automaticFieldRecordVariableGuid = sanitizeGuid(screenFieldNode.objectFieldReference).guidOrLiteral;
        } else {
            this.activeTab = ScreenEditorTab.Components;
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
        let parent = this.screen;
        if (event.parentGuid && event.parentGuid !== this.screen.guid) {
            parent = this.screen.getFieldByGUID(event.parentGuid);
        }
        const position = Number.isInteger(event.position) ? event.position : parent.fields.length - 1;
        this.setSelectedNode(parent.fields[position]);
    };

    /**
     * Handler for adding a screen field to a container.  The parent container
     * will be set as the selected node
     * @param {event} event - The event
     */
    handleAddScreenFieldToContainerFieldWithParentFocus = (event) => {
        this.handleAddScreenField(event);

        if (event.callback) {
            event.callback();
        }

        // Get the updated parent and select it
        const parent = this.screen.getFieldByGUID(event.parentGuid);
        this.setSelectedNode(parent);
    };

    /**
     * Handler for the delete screen element event. Invokes the delete confirmation modal.
     * @param {event} event - The event
     */
    handleDeleteScreenElement = (event) => {
        const state = this.screen;
        const parent =
            event.parentGuid && event.parentGuid !== this.screen.guid
                ? this.screen.getFieldByGUID(event.parentGuid)
                : this.screen;
        const usedElements = usedByStoreAndElementState(
            event.detail.screenElement.guid,
            parent.guid,
            this.getAllScreenFields(state.fields)
        );
        if (usedElements && usedElements.length > 0) {
            invokeUsedByAlertModal(usedElements, [event.detail.screenElement.guid], ELEMENT_TYPE.SCREEN_FIELD);
        } else {
            const deleteCallBack = () => {
                this.screen = screenReducer(this.screen, event);
                this.handleDeselectScreenElement();

                if (event.callback) {
                    event.callback();
                }
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
                        buttonVariant: 'destructive',
                        buttonLabel: LABELS.deleteAlternativeText,
                        buttonCallback: deleteCallBack
                    }
                }
            });
        }
    };

    /**
     * Get all the fields from the screen state fields.
     * @param {Array} fields screen state fields
     * @returns {Array} all the screen fields
     */
    getAllScreenFields(fields) {
        let allFields: any[] = [];
        fields.forEach((field) => {
            allFields = [...allFields, ...this.flattenScreenFields(field)];
        });
        return [...fields, ...allFields];
    }

    /**
     * Recursively flatten the screen field elements.
     * @param {Object} screenField
     * @returns {Array} all the screen fields after the flatten
     */
    flattenScreenFields(screenField) {
        if (!screenField) {
            return [];
        }
        const allFields: any[] = [];
        const fields = screenField.fields;
        if (fields) {
            fields.forEach((field) => {
                allFields.push(field);
                allFields.push(...this.flattenScreenFields(field));
            });
        }
        return allFields;
    }

    /**
     * Handler for screen state changed events
     * @param {event} event - The event
     */
    handleScreenStateChanged = (event) => {
        this.screen = screenReducer(this.screen, event, this.selectedNode);
        this.resetSelectedNode();
    };

    /**
     * Resets the selected node to ensure re-rendering
     */
    resetSelectedNode = () => {
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
        this.hidePopover();
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
        this.hidePopover();
        this.setSelectedNode(this.screen);
        this.selectedItemGuid = null;
    };

    /**
     * Handles reordering a list of the screen fields
     * @param {event} event - reorderListEvent
     */
    handleMoveScreenElement = (event) => {
        this.screen = screenReducer(this.screen, event);
        event.stopPropagation();
        // selected parent node (like Section) must be updated when a field is dragged into parent
        this.resetSelectedNode();
    };

    handleColumnWidthChanged = (event) => {
        this.screen = screenReducer(this.screen, event);
        event.stopPropagation();

        // Get the updated parent and select it
        const section = this.screen.getFieldByGUID(event.sectionGuid);
        this.setSelectedNode(section);
    };

    /**
     * Hide the popover on actions that results in it losing focus
     */
    hidePopover() {
        hidePopover({ closedBy: 'closeOnClickOut' });
    }

    render() {
        return this.orgHasFlowBuilderAutomaticFields
            ? templateWithAutomaticFieldsEnabled
            : templateWithAutomaticFieldsDisabled;
    }
}
