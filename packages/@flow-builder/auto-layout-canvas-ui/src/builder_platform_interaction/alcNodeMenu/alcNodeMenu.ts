import cutAllPathsComboboxLabel from '@salesforce/label/AlcNodeContextualMenu.cutAllPathsComboboxLabel';
import deleteAllPathsComboboxLabel from '@salesforce/label/AlcNodeContextualMenu.deleteAllPathsComboboxLabel';
import { scheduleTask } from 'builder_platform_interaction/alcComponentsUtils';
import {
    AddElementFaultEvent,
    ClearHighlightedPathEvent,
    CloseMenuEvent,
    DeleteBranchElementEvent,
    DeleteElementFaultEvent,
    HighlightPathsToDeleteOrCutEvent
} from 'builder_platform_interaction/alcEvents';
import AlcMenu from 'builder_platform_interaction/alcMenu';
import {
    FlowModel,
    FOR_EACH_INDEX,
    Guid,
    NodeOperationType,
    NodeType,
    ParentNodeModel,
    resolveParent
} from 'builder_platform_interaction/autoLayoutCanvas';
import {
    CopySingleElementEvent,
    CutElementsEvent,
    DeleteElementEvent,
    EditElementEvent,
    OpenSubflowEvent
} from 'builder_platform_interaction/events';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { classSet } from 'lightning/utils';
import { api, LightningElement, track } from 'lwc';
import { ELEMENT_ACTION_CONFIG, getMenuConfiguration } from './alcNodeMenuConfig';
import { LABELS } from './alcNodeMenuLabels';

const selectors = {
    backButton: '.back-button',
    footerButton: '.footer lightning-button'
};

enum ConditionOptions {
    DEFAULT_PATH = 'DEFAULT_PATH',
    NO_PATH = 'NO_PATH'
}

interface Option {
    label: string;
    value: Guid;
}

/**
 * The node menu overlay, displayed when clicking on a node.
 */
export default class AlcNodeMenu extends AlcMenu {
    static className = 'node-menu';

    dom = lwcUtils.createDomProxy(this, selectors);

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
    operationType: NodeOperationType = undefined;

    _selectedConditionValue;
    _childIndexToKeep: number | undefined = undefined;

    get bodyClass() {
        return classSet({
            'slds-dropdown__divst': true,
            'slds-hide': this.isSelectingBranchElementMode
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
            this.operationType,
            canHaveFaultConnector,
            elementHasFault,
            this.disableDeleteElements
        );
    }

    get isBaseActionMode() {
        return !this.operationType;
    }

    get isSelectingBranchElementMode() {
        return this.operationType === 'delete' || this.operationType === 'cut';
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

    get conditionOptions() {
        return this.getConditionOptionsForNode(this.flowModel, this.guid, this.operationType);
    }

    /**
     * Creates the condition options for a branching node
     *
     * @param flowModel - The flow model
     * @param node - The node
     * @returns The condition options
     */
    createConditionOptionsForNode(flowModel: FlowModel, node: ParentNodeModel): Option[] | undefined {
        const childReferences = node.childReferences;

        return childReferences?.map((reference) => {
            const value = reference.childReference;
            return {
                label: flowModel[value].label,
                value
            };
        });
    }

    /**
     * Get the menu condition options for a node
     *
     * @param flowModel - The flow model
     * @param guid - The node guid
     * @param operationType - The operation type
     * @returns The condition options
     */
    getConditionOptionsForNode(flowModel: FlowModel, guid: Guid, operationType: NodeOperationType) {
        const node = resolveParent(flowModel, guid);
        let conditionOptionsForNode = this.createConditionOptionsForNode(flowModel, node);

        if (conditionOptionsForNode != null) {
            conditionOptionsForNode = [
                {
                    label: operationType === 'delete' ? deleteAllPathsComboboxLabel : cutAllPathsComboboxLabel,
                    value: ConditionOptions.NO_PATH
                },
                ...conditionOptionsForNode,
                {
                    label: node.defaultConnectorLabel!,
                    value: ConditionOptions.DEFAULT_PATH
                }
            ];
        }
        return conditionOptionsForNode;
    }

    /**
     * Handles the onclick event on the back button, and updates the operationType to base mode.
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

        this.operationType = undefined;
        this._childIndexToKeep = undefined;
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
        let restoreFocus = true;

        let actionEvent;
        switch (actionType) {
            case ELEMENT_ACTION_CONFIG.COPY_ACTION.value:
                actionEvent = new CopySingleElementEvent(this.guid);
                break;
            case ELEMENT_ACTION_CONFIG.CUT_ACTION.value:
            case ELEMENT_ACTION_CONFIG.DELETE_ACTION.value:
                if (this.elementMetadata.type === NodeType.BRANCH) {
                    this.operationType = actionType === ELEMENT_ACTION_CONFIG.CUT_ACTION.value ? 'cut' : 'delete';

                    this._selectedConditionValue = ConditionOptions.NO_PATH;
                    actionEvent = new HighlightPathsToDeleteOrCutEvent(this.guid, this.operationType, undefined);
                    closeMenu = false;
                    scheduleTask(() => this.dom.backButton.focus());
                } else if (this.elementMetadata.type === NodeType.LOOP) {
                    actionEvent =
                        actionType === ELEMENT_ACTION_CONFIG.CUT_ACTION.value
                            ? new CutElementsEvent([this.guid])
                            : new DeleteElementEvent([this.guid], this.elementMetadata.elementType, FOR_EACH_INDEX);
                } else {
                    actionEvent =
                        actionType === ELEMENT_ACTION_CONFIG.CUT_ACTION.value
                            ? new CutElementsEvent([this.guid])
                            : new DeleteElementEvent([this.guid], this.elementMetadata.elementType);
                }
                restoreFocus = false;
                break;
            case ELEMENT_ACTION_CONFIG.ADD_FAULT_ACTION.value:
                actionEvent = new AddElementFaultEvent(this.guid);
                break;
            case ELEMENT_ACTION_CONFIG.DELETE_FAULT_ACTION.value:
                actionEvent = new DeleteElementFaultEvent(this.guid);
                break;
            case ELEMENT_ACTION_CONFIG.OPEN_SUBFLOW_ACTION.value:
                actionEvent = new OpenSubflowEvent(this.flowElement.flowName);
                break;
            default:
        }

        const closeMenuEvent = closeMenu ? new CloseMenuEvent(restoreFocus) : undefined;
        this.closeMenuAndDispatchAction(closeMenuEvent, actionEvent);
    };

    /**
     * Closes the menu and dispatches and action
     *
     * @param closeMenuEvent - The close menu event, if any
     * @param actionEvent - The action event, if any
     */
    closeMenuAndDispatchAction(closeMenuEvent?: CloseMenuEvent, actionEvent?: Event) {
        if (closeMenuEvent) {
            this.dispatchEvent(closeMenuEvent);
        }

        // need to dispatch the action event after closing the menu, so that the focus is restored by the close menu handler BEFORE any action is executed
        if (actionEvent) {
            this.dispatchEvent(actionEvent);
        }
    }
    /**
     * Handles onchange event coming from the combobox and updates the _selectedConditionValue accordingly
     *
     * @param event - The change event
     */
    handleComboboxChange = (event: CustomEvent) => {
        event.stopPropagation();
        this._selectedConditionValue = event.detail.value;
        this._childIndexToKeep =
            this.conditionOptions!.findIndex((option) => option.value === this._selectedConditionValue) - 1;

        if (this._childIndexToKeep === -1) {
            this._childIndexToKeep = undefined;
        }
        this.dispatchEvent(new HighlightPathsToDeleteOrCutEvent(this.guid, this.operationType, this._childIndexToKeep));
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

        let actionEvent;
        let restoreFocus = true;

        if (this.operationType === undefined) {
            actionEvent = new EditElementEvent(this.guid, undefined, undefined, true);
        } else if (this.operationType === 'delete') {
            actionEvent = new DeleteBranchElementEvent(
                [this.guid],
                this.elementMetadata.elementType,
                this._childIndexToKeep
            );
            restoreFocus = false;
        } else if (this.operationType === 'cut') {
            actionEvent = new CutElementsEvent([this.guid], this._childIndexToKeep);
            restoreFocus = false;
        }

        this.closeMenuAndDispatchAction(new CloseMenuEvent(restoreFocus), actionEvent);
    };

    /**
     * Helper function used during keyboard commands
     */
    override handleSpaceOrEnter() {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            // @ts-ignore TODO: remove me
            if (currentItemInFocus.role === 'menuitem') {
                this.handleSelectNodeAction({ currentTarget: currentItemInFocus.parentElement!, fromKeyboard: true });
            } else if (currentItemInFocus.parentElement!.classList.value.includes('footer')) {
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
                // @ts-ignore TODO: remove me
                const baseButton = footerButton?.shadowRoot.querySelector('button');
                if (baseButton) {
                    baseButton.classList.add('slds-button_stretch');
                }
            }
        }
    }
}
