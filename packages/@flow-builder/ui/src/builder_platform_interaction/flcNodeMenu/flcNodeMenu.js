import { api, track } from 'lwc';
import {
    CopySingleElementEvent,
    DeleteElementEvent,
    EditElementEvent,
    ToggleMenuEvent
} from 'builder_platform_interaction/events';
import Menu from 'builder_platform_interaction/menu';
import { CONTEXTUAL_MENU_MODE, ELEMENT_ACTION_CONFIG, getMenuConfiguration } from './flcNodeMenuConfig';
import { supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';

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

    @track
    contextualMenuMode = CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE;

    _selectedConditionValue;
    _isRendered = false;

    get menuConfiguration() {
        return getMenuConfiguration(this.elementMetadata, this.contextualMenuMode);
    }

    set menuConfiguration(config) {
        return config;
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

    /**
     * Handles the click on the cancel button and closes the contextual menu
     */
    handleCancelButtonClick = event => {
        event.stopPropagation();
        this.dispatchEvent(new ToggleMenuEvent({}));
    };

    /**
     * Handles click on the delete action row present in the base_actions_mode
     */
    handleDeleteActionClick = () => {
        if (supportsChildren(this.elementMetadata)) {
            this.contextualMenuMode = CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE;
            this._selectedConditionValue = this.conditionOptions[0].value;
        } else {
            this.dispatchEvent(new ToggleMenuEvent({}));
            this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType));
        }
    };

    /**
     * Handles the click on the action row item and dispatches the appropriate event
     */
    handleSelectNodeAction = event => {
        event.stopPropagation();
        const actionType = event.currentTarget.getAttribute('data-value');
        switch (actionType) {
            case ELEMENT_ACTION_CONFIG.COPY_ACTION.value:
                this.dispatchEvent(new ToggleMenuEvent({}));
                this.dispatchEvent(new CopySingleElementEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_ACTION.value:
                this.handleDeleteActionClick();
                break;
            default:
                break;
        }
    };

    /**
     * Handles onchange event coming from the combobox and updates the _selectedConditionValue accordingly
     */
    handleComboboxChange = event => {
        event.stopPropagation();
        this._selectedConditionValue = event.detail.value;
    };

    /**
     * Handles the click on the Footer button and dispatches the relevant event
     */
    handleFooterButtonClick = event => {
        event.stopPropagation();
        this.dispatchEvent(new ToggleMenuEvent({}));

        if (this.contextualMenuMode === CONTEXTUAL_MENU_MODE.BASE_ACTIONS_MODE) {
            this.dispatchEvent(new EditElementEvent(this.guid));
        } else if (this.contextualMenuMode === CONTEXTUAL_MENU_MODE.DELETE_BRANCH_ELEMENT_MODE) {
            const childIndexToKeep = this.conditionOptions.findIndex(
                option => option.value === this._selectedConditionValue
            );
            this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType, childIndexToKeep));
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
