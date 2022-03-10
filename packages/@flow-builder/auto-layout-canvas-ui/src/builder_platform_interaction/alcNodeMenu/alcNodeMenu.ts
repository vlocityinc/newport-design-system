import { scheduleTask } from 'builder_platform_interaction/alcComponentsUtils';
import {
    AddElementFaultEvent,
    ClearHighlightedPathEvent,
    CloseMenuEvent,
    DeleteBranchElementEvent,
    DeleteElementFaultEvent,
    HighlightPathsToDeleteEvent
} from 'builder_platform_interaction/alcEvents';
import AlcMenu from 'builder_platform_interaction/alcMenu';
import { FOR_EACH_INDEX, NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import {
    CopySingleElementEvent,
    DeleteElementEvent,
    EditElementEvent,
    OpenSubflowEvent
} from 'builder_platform_interaction/events';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { classSet } from 'lightning/utils';
import { api, track } from 'lwc';
import { ELEMENT_ACTION_CONFIG, getMenuConfiguration, NodeMenuMode } from './alcNodeMenuConfig';
import { LABELS } from './alcNodeMenuLabels';

const selectors = {
    backButton: '.back-button',
    footerButton: '.footer lightning-button'
};

/**
 * The node menu overlay, displayed when clicking on a node.
 */
export default class AlcNodeMenu extends AlcMenu {
    static className = 'node-menu';

    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    conditionOptions;

    @api
    elementMetadata;

    @api
    guid;

    @api
    disableDeleteElements;

    @api
    disableEditElements;

    @api
    flowModel;

    @track
    contextualMenuMode = NodeMenuMode.Default;

    _selectedConditionValue;
    _childIndexToKeep: number | undefined = 0;

    get bodyClass() {
        return classSet({
            'slds-dropdown__divst': true,
            'slds-hide': this.isDeleteBranchElementMode
        }).toString();
    }

    get labels() {
        return LABELS;
    }

    get menuConfiguration() {
        const element = this.flowModel[this.guid];
        const canHaveFaultConnector = element.canHaveFaultConnector;
        const elementHasFault = element.fault != null;

        return getMenuConfiguration(
            this.elementMetadata,
            this.contextualMenuMode,
            canHaveFaultConnector,
            elementHasFault,
            this.disableDeleteElements
        );
    }

    get isBaseActionMode() {
        return this.contextualMenuMode === NodeMenuMode.Default;
    }

    get isDeleteBranchElementMode() {
        return this.contextualMenuMode === NodeMenuMode.Delete;
    }

    get selectedConditionValue() {
        return this._selectedConditionValue;
    }

    get descriptionHeader() {
        return this.menuConfiguration.header.description;
    }

    get flowElement() {
        return this.flowModel[this.guid];
    }

    /**
     * Handles the onclick event on the back button, and updates the contextualMenuMode to base mode.
     * Also, dispatches the ClearHighlightedPathEvent to remove the highlight from nodes and connectors
     * on the deletion path.
     *
     * @param event - The click event
     */
    handleBackButtonClick = (event: Event | undefined = undefined) => {
        if (event != null) {
            event.stopPropagation();
        }

        scheduleTask(() => this.focus());

        this.contextualMenuMode = NodeMenuMode.Default;
        this.dispatchEvent(new ClearHighlightedPathEvent());
    };

    /**
     * Handles the click on the action row item and dispatches the appropriate event
     *
     * @param event - The selection event
     */
    handleSelectNodeAction = (event) => {
        if (!event.fromKeyboard) {
            event.stopPropagation();
        }
        const actionType = event.currentTarget.dataset.value;
        let closeMenu = true;
        let moveFocusToTrigger = true;

        switch (actionType) {
            case ELEMENT_ACTION_CONFIG.COPY_ACTION.value:
                this.dispatchEvent(new CopySingleElementEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_ACTION.value:
                if (this.elementMetadata.type === NodeType.BRANCH) {
                    this.contextualMenuMode = NodeMenuMode.Delete;
                    this._selectedConditionValue = this.conditionOptions[0].value;
                    this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
                    closeMenu = false;
                    scheduleTask(() => this.dom.backButton.focus());
                } else if (this.elementMetadata.type === NodeType.LOOP) {
                    this.dispatchEvent(
                        new DeleteElementEvent([this.guid], this.elementMetadata.elementType, FOR_EACH_INDEX)
                    );
                } else {
                    this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType));
                }
                moveFocusToTrigger = false;
                break;
            case ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION.value:
                this.dispatchEvent(new AddElementFaultEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION.value:
                this.dispatchEvent(new DeleteElementFaultEvent(this.guid));
                break;
            case ELEMENT_ACTION_CONFIG.OPEN_SUBFLOW_ACTION.value:
                this.dispatchEvent(new OpenSubflowEvent(this.flowElement.flowName));
                break;
            default:
        }

        // Closing the menu as needed
        if (closeMenu) {
            this.dispatchEvent(new CloseMenuEvent(moveFocusToTrigger));
        }
    };

    /**
     * Handles onchange event coming from the combobox and updates the _selectedConditionValue accordingly
     *
     * @param event - The change event
     */
    handleComboboxChange = (event: CustomEvent) => {
        event.stopPropagation();
        this._selectedConditionValue = event.detail.value;
        this._childIndexToKeep = this.conditionOptions.findIndex(
            (option) => option.value === this._selectedConditionValue
        );
        if (this._childIndexToKeep === this.conditionOptions.length - 1) {
            this._childIndexToKeep = undefined;
        }
        this.dispatchEvent(new HighlightPathsToDeleteEvent(this.guid, this._childIndexToKeep));
    };

    /**
     * Handles the click on the Footer button and dispatches the relevant event
     *
     * @param event - The click event
     */
    handleFooterButtonClick = (event: Event | undefined = undefined) => {
        if (event != null) {
            event.stopPropagation();
        }
        this.dispatchEvent(new CloseMenuEvent());
        if (this.contextualMenuMode === NodeMenuMode.Default) {
            this.dispatchEvent(new EditElementEvent(this.guid, undefined, undefined, true));
        } else if (this.contextualMenuMode === NodeMenuMode.Delete) {
            this.dispatchEvent(
                new DeleteBranchElementEvent([this.guid], this.elementMetadata.elementType, this._childIndexToKeep)
            );
        }
    };

    /**
     * Helper function used during keyboard commands
     */
    override handleSpaceOrEnter() {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            if (currentItemInFocus.role === 'menuitem') {
                this.handleSelectNodeAction({ currentTarget: currentItemInFocus.parentElement, fromKeyboard: true });
            } else if (currentItemInFocus.parentElement.classList.value.includes('footer')) {
                this.handleFooterButtonClick();
            } else if (currentItemInFocus.classList.value.includes('back-button')) {
                this.handleBackButtonClick();
            }
        }
    }

    renderedCallback() {
        // stash the value before it gets reset in the super() call
        const isFirstRender = this.isFirstRender;
        super.renderedCallback();

        if (isFirstRender) {
            if (this.menuConfiguration.footer) {
                // Setting the slds-button_stretch class on the footer button the make it extend
                const footerButton = this.dom.as<LightningElement>().footerButton;
                const baseButton = footerButton?.shadowRoot.querySelector('button');
                if (baseButton) {
                    baseButton.classList.add('slds-button_stretch');
                }
            }
        }
    }
}
