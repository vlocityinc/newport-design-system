// @ts-nocheck
import { api, track } from 'lwc';
import { CopySingleElementEvent, DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import {
    HighlightPathsToDeleteEvent,
    DeleteElementFaultEvent,
    AddElementFaultEvent,
    CloseMenuEvent
} from 'builder_platform_interaction/flcEvents';
import Menu from 'builder_platform_interaction/menu';
import { CONTEXTUAL_MENU_MODE, ELEMENT_ACTION_CONFIG, getMenuConfiguration } from './flcNodeMenuConfig';
import { ICON_SHAPE } from 'builder_platform_interaction/flcComponentsUtils';
import { ElementType, DELETE_ALL } from 'builder_platform_interaction/autoLayoutCanvas';
import { LABELS } from './flcNodeMenuLabels';

/**
 * The node menu overlay, displayed when clicking on a node.
 */
export default class FlcNodeMenu extends Menu {
    @api
    conditionOptions;

    @api
    elementMetadata;

    @api
    guid;

    @api
    elementHasFault;

    @track
    contextualMenuMode = CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE;

    _selectedConditionValue;
    _childIndexToKeep = 0;
    _isRendered = false;

    get labels() {
        return LABELS;
    }

    get menuConfiguration() {
        return getMenuConfiguration(this.elementMetadata, this.contextualMenuMode, this.elementHasFault);
    }

    set menuConfiguration(config) {
        return config;
    }

    get menuWrapper() {
        return this.elementMetadata.iconShape === ICON_SHAPE.DIAMOND ? 'diamond-element-menu' : '';
    }

    get isBaseActionMode() {
        return this.contextualMenuMode === CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE;
    }

    get isDeleteBranchElementMode() {
        return this.contextualMenuMode === CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE;
    }

    get selectedConditionValue() {
        return this._selectedConditionValue;
    }

    get descriptionHeader() {
        return this.menuConfiguration.header.description;
    }

    /**
     * Handles the click on the action row item and dispatches the appropriate event
     */
    handleSelectNodeAction = (event) => {
        event.stopPropagation();
        const actionType = event.currentTarget.getAttribute('data-value');
        let closeMenu = true;

        switch (actionType) {
            case ELEMENT_ACTION_CONFIG.COPY_ACTION.value:
                this.dispatchEvent(new CopySingleElementEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_ACTION.value:
                if (this.elementMetadata.type === ElementType.BRANCH) {
                    this.contextualMenuMode = CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE;
                    this._selectedConditionValue = this.conditionOptions[0].value;
                    this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
                    closeMenu = false;
                } else if (this.elementMetadata.type === ElementType.LOOP) {
                    this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType, 0));
                } else {
                    this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType));
                }
                break;
            case ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION.value:
                this.dispatchEvent(new AddElementFaultEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION.value:
                this.dispatchEvent(new DeleteElementFaultEvent(this.guid));
                break;
            default:
        }

        if (closeMenu) {
            this.dispatchEvent(new CloseMenuEvent());
        }
    };

    /**
     * Handles onchange event coming from the combobox and updates the _selectedConditionValue accordingly
     */
    handleComboboxChange = (event) => {
        event.stopPropagation();
        this._selectedConditionValue = event.detail.value;
        this._childIndexToKeep = this.conditionOptions.findIndex(
            (option) => option.value === this._selectedConditionValue
        );

        if (this._childIndexToKeep === this.conditionOptions.length - 1) {
            this._childIndexToKeep = DELETE_ALL;
        }
        this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
    };

    /**
     * Handles the click on the Footer button and dispatches the relevant event
     */
    handleFooterButtonClick = (event) => {
        event.stopPropagation();
        this.dispatchEvent(new CloseMenuEvent());

        if (this.contextualMenuMode === CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE) {
            this.dispatchEvent(new EditElementEvent(this.guid));
        } else if (this.contextualMenuMode === CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE) {
            this.dispatchEvent(
                new DeleteElementEvent([this.guid], this.elementMetadata.elementType, this._childIndexToKeep)
            );
        }
    };

    renderedCallback() {
        if (!this._isRendered && this.menuConfiguration.footer) {
            // Setting the slds-button_stretch class on the footer button the make it extend
            const footerButton = this.template.querySelector('.test-footer lightning-button');
            const baseButton = footerButton && footerButton.shadowRoot.querySelector('button');
            if (baseButton) {
                baseButton.classList.add('slds-button_stretch');
                this._isRendered = true;
            }
        }
    }
}
