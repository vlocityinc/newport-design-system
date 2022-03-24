import {
    hidePopover,
    modalBodyVariant,
    updateLegalNoticesStateAfterDismiss
} from 'builder_platform_interaction/builderUtils';
import { orgHasFlowBuilderAutomaticFields } from 'builder_platform_interaction/contextLib';
import { getErrorsFromHydratedElement, sanitizeGuid } from 'builder_platform_interaction/dataMutationLib';
import {
    createChoiceDisplayChangedEvent,
    createSingleOrMultiChoiceTypeChangedEvent
} from 'builder_platform_interaction/events';
import { setScreenElement } from 'builder_platform_interaction/expressionUtils';
import { ELEMENT_TYPE, FlowScreenFieldType, FLOW_ENVIRONMENT } from 'builder_platform_interaction/flowMetadata';
import { loadFlowExtensionsOnProcessTypeChange } from 'builder_platform_interaction/preloadLib';
import ScreenEditorAutomaticFieldPalette from 'builder_platform_interaction/screenEditorAutomaticFieldPalette';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    ChoiceDisplayOptions,
    getAllScreenFields,
    getAllScreenFieldTypes,
    isRegionContainerField,
    isRegionField,
    isScreen,
    processRequiredParamsForExtensionsInScreen,
    processScreenExtensionTypes,
    processSupportedScreenFieldTypes,
    ScreenFieldName
} from 'builder_platform_interaction/screenEditorUtils';
import { getSupportedScreenFieldTypes } from 'builder_platform_interaction/screenFieldTypeLib';
import { commonUtils, invokeModal } from 'builder_platform_interaction/sharedUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { getEnvironments, getTriggerType } from 'builder_platform_interaction/storeUtils';
import { invokeUsedByAlertModal, usedByStoreAndElementState } from 'builder_platform_interaction/usedByLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { api, LightningElement, track, unwrap } from 'lwc';
import { screenReducer } from './screenReducer';
const { format } = commonUtils;
export enum ScreenEditorTab {
    Components = 'componentsTab',
    Fields = 'fieldsTab'
}

const LEGAL_NOTICE_HEADERS = {
    AUTOMATIC_FIELDS: LABELS.automaticFieldsLegalNoticeHeader
};

const SELECTORS = {
    SCREEN_PROPERTIES_EDITOR_CONTAINER: 'builder_platform_interaction-screen-properties-editor-container',
    SCREEN_EDITOR_CANVAS: 'builder_platform_interaction-screen-editor-canvas'
};

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

    shift = false;
    // this determines that the initial focus is only set once, when we have the screen object
    initialFocusSet = false;

    @track legalNotices: UI.LegalNotice[] = [
        { header: LEGAL_NOTICE_HEADERS.AUTOMATIC_FIELDS, shown: false, dismissed: false }
    ];

    @track
    noticesToLegalPopover: UI.LegalNotice[] = [];

    labels = LABELS;

    orgHasFlowBuilderAutomaticFields = orgHasFlowBuilderAutomaticFields();
    screenEditorContainerCssClass = this.orgHasFlowBuilderAutomaticFields
        ? 'slds-grid screen-editor-container-with-tabs'
        : 'slds-grid screen-editor-container';

    private objectFieldReferenceChanged = false;

    /**
     * Screen node getter
     *
     * @returns {object} The screen
     */
    @api get node() {
        return this.screen;
    }

    /**
     * Screen node setter, sets the value and initializes the selectedNode
     *
     * @param {object} newValue - The new screen
     */
    set node(newValue) {
        this.processScreenExtensions(unwrap(newValue) || {});
    }

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.screen;
    }

    /**
     * public api function to run the rules from assignment validation library
     *
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
     *
     * @returns {object} - The selected node
     */
    @api getSelectedNode() {
        return this.selectedNode;
    }

    @api getSelectedItemGuid() {
        return this.selectedItemGuid;
    }

    renderedCallback() {
        if (this.objectFieldReferenceChanged) {
            this.getAutomaticFieldPalette()?.setRecordVariableAndResetPill(this.automaticFieldRecordVariableGuid);
            this.objectFieldReferenceChanged = false;
        }
        setScreenElement(this.screen);
        if (this.screen && !this.initialFocusSet) {
            this.focus();
            this.initialFocusSet = true;
        }
    }

    getAutomaticFieldPalette() {
        const tabset = this.template.querySelector('lightning-tabset');
        const automaticFieldsTab = tabset?.shadowRoot?.querySelector('slot')?.assignedNodes()[1];
        const automaticFieldPalette = automaticFieldsTab?.shadowRoot
            ?.querySelector('slot')
            ?.assignedNodes()[0]
            ?.querySelector(ScreenEditorAutomaticFieldPalette.SELECTOR);
        return automaticFieldPalette ? (automaticFieldPalette as ScreenEditorAutomaticFieldPalette) : null;
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

    get showLegalNotice() {
        return this.legalNotices.some((notice) => notice.shown && !notice.dismissed);
    }

    // TODO: W-10888798 will refine how we determine which environments allow automaticFields.  This is temp.
    get slackIsEnabled() {
        return getEnvironments()?.includes(FLOW_ENVIRONMENT.SLACK);
    }

    get automaticFieldsEnabled() {
        return this.orgHasFlowBuilderAutomaticFields && !this.slackIsEnabled;
    }

    /**
     * Retrieves the description for all extension screen fields and adds all required input parameters that are not present to those fields
     * (this should never happen as this would mean the flow is invalid, but it is a good check)
     * Triggers processPaletteExtensions
     *
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
        const environments = getEnvironments();
        getSupportedScreenFieldTypes(this.processType, triggerType, environments)
            .then((supportedTypes) => {
                if (supportedTypes) {
                    this.screenFieldTypes = getAllScreenFieldTypes().filter((type) =>
                        supportedTypes.some((supportedType) => {
                            return supportedType.name === type.name || supportedType.name === type.fieldType;
                        })
                    );
                    this.screen = processSupportedScreenFieldTypes(this.screenFieldTypes, this.screen);
                }
            })
            .catch((errorMessage) => {
                throw errorMessage;
            });
        loadFlowExtensionsOnProcessTypeChange(this.processType, environments)
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
                // TODO: Address error handling as part of #W-9494646: https://gus.my.salesforce.com/a07AH000000P9RiYAK
                throw error;
            });
    }

    /**
     * Sets the selected node in the editor to the value provided
     *
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
     *
     * @param screenFieldNode The screenFieldNode
     */
    private updateActiveTabAndAutomaticFieldRecordVariable(screenFieldNode) {
        if (screenFieldNode.fieldType === FlowScreenFieldType.ObjectProvided) {
            this.activeTab = ScreenEditorTab.Fields;
            this.automaticFieldRecordVariableGuid = sanitizeGuid(screenFieldNode.objectFieldReference).guidOrLiteral;
            this.objectFieldReferenceChanged = true;
        } else {
            this.activeTab = ScreenEditorTab.Components;
        }
    }

    /**
     * Handler for the add screen field event
     *
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
     *
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
     *
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
            getAllScreenFields(state.fields)
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
            const element = event.detail.screenElement;
            let title = LABELS.deleteConfirmation;
            let bodyText = LABELS.deleteConsequence;
            if (isRegionContainerField(element)) {
                bodyText = LABELS.deleteSectionConsequence;
            } else if (isRegionField(element)) {
                title = LABELS.deleteColumnConfirmation;
                bodyText = LABELS.deleteColumnConsequence;
            }
            const isAutomaticField = event.detail.screenElement.fieldType === FlowScreenFieldType.ObjectProvided;
            // Invoking the delete confirmation modal
            invokeModal({
                headerData: {
                    headerTitle: isAutomaticField ? LABELS.automaticFieldDeleteConfirmation : title
                },
                bodyData: {
                    bodyVariant: modalBodyVariant.WARNING_ON_CANVAS_MODE_TOGGLE,
                    bodyTextOne: isAutomaticField ? LABELS.automaticFieldDeleteConsequence : bodyText
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
                },
                bodyClass: 'slds-p-around_medium'
            });
        }
    };

    /**
     * Handler for screen state changed events
     *
     * @param {event} event - The event
     */
    handleScreenStateChanged = (event) => {
        this.screen = screenReducer(this.screen, event, this.selectedNode);
        this.resetSelectedNode();
    };

    handleChoiceDisplayChanged = (event) => {
        this.screen = screenReducer(this.screen, event, this.selectedNode);
        this.resetSelectedNode();
    };

    handleSingleOrMultiChoiceTypeChanged = (event) => {
        const singleOrMulti = event.detail.newTypeChoice;
        let newDisplayType;

        newDisplayType =
            singleOrMulti === ChoiceDisplayOptions.SINGLE_SELECT
                ? ScreenFieldName.DropdownBox
                : ScreenFieldName.MultiSelectCheckboxes;

        newDisplayType = this.getNewDisplayTypeOrWarnUser(this.selectedNode, newDisplayType);

        if (newDisplayType) {
            this.screen = screenReducer(this.screen, event, this.selectedNode);
            const displayTypeEvent = createChoiceDisplayChangedEvent(this.selectedNode, newDisplayType);
            this.screen = screenReducer(this.screen, displayTypeEvent, this.selectedNode);
        } else {
            // Set the singleOrMulti choice type back to what it was
            const typeChoiceEvent = createSingleOrMultiChoiceTypeChangedEvent(
                this.selectedNode,
                this.selectedNode.singleOrMultiSelect
            );
            this.screen = screenReducer(this.screen, typeChoiceEvent, this.selectedNode);
        }
        this.resetSelectedNode();
    };

    getNewDisplayTypeOrWarnUser(screenElement, newDisplayType) {
        const usedByElements = usedByStoreAndElementState(
            screenElement.guid,
            this.screen.guid,
            getAllScreenFields(this.screen.fields)
        );
        if (this.isWarningNeeded(usedByElements, screenElement, newDisplayType)) {
            invokeUsedByAlertModal(usedByElements, [screenElement.guid], ELEMENT_TYPE.CHOICE);
            newDisplayType = null;
        }
        return newDisplayType;
    }

    isWarningNeeded(usedByElements, screenElement, newDisplayType) {
        return (
            screenElement.dataType !== 'String' &&
            (screenElement.fieldType === FlowScreenFieldType.DropdownBox ||
                screenElement.fieldType === FlowScreenFieldType.RadioButtons) &&
            (newDisplayType === FlowScreenFieldType.MultiSelectCheckboxes ||
                newDisplayType === FlowScreenFieldType.MultiSelectPicklist) &&
            usedByElements.length > 0
        );
    }

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

    focus() {
        const screenPropertiesEditorContainer = this.template.querySelector(
            SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER
        );
        return screenPropertiesEditorContainer?.focusLabelDescription();
    }

    /**
     * Handler for the select screen element event
     *
     * @param {event} event - The event
     */
    handleSelectScreenElement = (event) => {
        this.hidePopover();
        if (event.detail.fromKeyboard) {
            const screenPropertiesEditorContainer = this.template.querySelector(
                SELECTORS.SCREEN_PROPERTIES_EDITOR_CONTAINER
            );
            if (screenPropertiesEditorContainer) {
                if (
                    event.detail.screenElement.elementType === ELEMENT_TYPE.SCREEN &&
                    this.selectedNode.elementType === ELEMENT_TYPE.SCREEN
                ) {
                    screenPropertiesEditorContainer.focusExpandButton();
                } else {
                    screenPropertiesEditorContainer.focus();
                }
            }
        }
        const elem = event.screenElement;
        if (elem && elem.guid !== this.screen.guid) {
            this.setSelectedNode(this.screen.getFieldByGUID(elem.guid));
        } else {
            this.setSelectedNode(this.screen, event.property);
        }
    };

    handleFocusScreenElement = () => {
        const element = this.template.querySelector(SELECTORS.SCREEN_EDITOR_CANVAS);
        element.focusHighlight();
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
     *
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

    handleAutomaticFieldsLegalNotice(event) {
        event.stopPropagation();
        const tab = event.srcElement.value;
        if (tab === ScreenEditorTab.Fields) {
            if (!this.legalNotices[0].shown && !this.legalNotices[0].dismissed) {
                this.noticesToLegalPopover = [
                    ...this.noticesToLegalPopover,
                    { header: LEGAL_NOTICE_HEADERS.AUTOMATIC_FIELDS }
                ];
                this.legalNotices[0].shown = true;
            }
        } else {
            this.noticesToLegalPopover = this.noticesToLegalPopover.filter(
                (notice) => notice.header !== LEGAL_NOTICE_HEADERS.AUTOMATIC_FIELDS
            );
            this.legalNotices[0].shown = false;
        }
    }

    handleLegalNoticeDismissed(event) {
        event.stopPropagation();
        this.legalNotices = updateLegalNoticesStateAfterDismiss(this.legalNotices, this.noticesToLegalPopover);
        this.noticesToLegalPopover = [];
    }

    /**
     * Hide the popover on actions that results in it losing focus
     */
    hidePopover() {
        hidePopover({ closedBy: 'closeOnClickOut' });
    }
}
