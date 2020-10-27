import { LightningElement, api } from 'lwc';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import {
    ComboboxStateChangedEvent,
    DeleteConditionEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    UpdateNodeEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { LABELS } from './steppedStageItemEditorLabels';
import { steppedStageItemReducer } from './steppedStageItemReducer';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getOtherItemsInSteppedStage, SteppedStageItem } from 'builder_platform_interaction/elementFactory';
import { ComboboxItem } from 'builder_platform_interaction/flowModel';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';

enum ENTRY_CRITERIA {
    ON_STAGE_START = 'on_stage_start',
    ON_STEP_COMPLETE = 'on_step_complete'
}

export default class SteppedStageItemEditor extends LightningElement {
    labels = LABELS;

    element;

    selectedScreenFlow: {
        elementType: ELEMENT_TYPE;
        flowName?: string;
    } = {
        elementType: ELEMENT_TYPE.SUBFLOW,
        flowName: undefined
    };

    selectedEntryCriteria?: ENTRY_CRITERIA;

    // For step based entry criteria
    entryCriteriaAvailableStepItems: ComboboxItem[] = [];
    entryCriteriaSelectedItem?: ComboboxItem;

    // TODO: Should only list screen flows.  currently incxludes all flows
    availableScreenFlows = [];

    screenFlowsFetched = false;

    screenFlowSelectionLabelConfig = {
        label: 'someLabel'
    };

    displayScreenFlowSelectionSpinner = true;

    screenFlowSelectionParameters = {};

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    editorParams;

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.element;
    }

    /**
     * public api function to run the rules from stage validation library
     * @returns list of errors
     */
    @api validate(): object {
        // const event = { type: VALIDATE_ALL };
        return getErrorsFromHydratedElement(this.element);
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.element;
    }

    set node(newValue) {
        this.element = newValue;

        if (this.element.entryCriteria.length === 0) {
            this.selectedEntryCriteria = ENTRY_CRITERIA.ON_STAGE_START;
        } else {
            this.selectedEntryCriteria = ENTRY_CRITERIA.ON_STEP_COMPLETE;
        }
        const otherItems: SteppedStageItem[] = getOtherItemsInSteppedStage(this.getNode().guid);

        this.entryCriteriaAvailableStepItems = [];

        otherItems.forEach((steppedStageItem) => {
            const comboboxItem: ComboboxItem = {
                type: 'option-card',
                dataType: FLOW_DATA_TYPE.STRING.value,
                text: steppedStageItem.label,
                displayText: steppedStageItem.label || '',
                value: steppedStageItem.name || ''
            };

            // This depends on steppedStageItem entry criteria always having the shape
            // "devName" "EqualTo" "Completed".  For 230, we only parse the LHS devName
            if (
                this.element.entryCriteria.length > 0 &&
                this.element.entryCriteria[0].leftHandSide.value === steppedStageItem.guid
            ) {
                this.entryCriteriaSelectedItem = comboboxItem;
            }

            this.entryCriteriaAvailableStepItems.push(comboboxItem);
        });
    }

    get isLabelCollapsibleToHeader() {
        return this.editorParams && this.editorParams.panelConfig.isLabelCollapsibleToHeader;
    }

    get styleForLabelDescription() {
        if (!this.isLabelCollapsibleToHeader) {
            return 'slds-p-horizontal_small slds-p-top_small';
        }
        return '';
    }

    get startCriteriaItem() {
        if (this.element.entryCriteria.length !== 0) {
            // This depends on steppedStageItem entry criteria always having the shape
            // "devName" "EqualTo" "Completed".  For 230, we only parse the LHS devName
            const itemDevName: string = this.element.entryCriteria[0].leftHandSide.value;
            return { value: getElementByDevName(itemDevName) };
        }

        return null;
    }

    get stepStartOptions() {
        return [
            {
                label: LABELS.startOptionStageStart,
                value: ENTRY_CRITERIA.ON_STAGE_START
            },

            {
                label: LABELS.startOptionBasedOnOtherStep,
                value: ENTRY_CRITERIA.ON_STEP_COMPLETE
            }
        ];
    }

    get stepStartValue() {
        return this.stepStartOptions[0].value;
    }

    get openSections() {
        return ['startSection', 'itemImplementationSection', 'finishSection'];
    }

    get isStartCriteriaBasedOnStep() {
        return this.selectedEntryCriteria === ENTRY_CRITERIA.ON_STEP_COMPLETE;
    }

    async connectedCallback() {
        try {
            const subflows = await fetchOnce(SERVER_ACTION_TYPE.GET_SUBFLOWS, {
                flowProcessType: this.processType
            });

            this.screenFlowsFetched = true;
            this.availableScreenFlows = subflows;
        } catch (err) {
            this.screenFlowsFetched = true;
        }
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event: PropertyChangedEvent) {
        event.stopPropagation();

        this.element = steppedStageItemReducer(this.element, event);

        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    handleStepStartChanged(event: CustomEvent) {
        this.selectedEntryCriteria = event.detail.value;

        if (this.selectedEntryCriteria === ENTRY_CRITERIA.ON_STAGE_START) {
            const deleteEntryCriteriaEvent = new DeleteConditionEvent(this.element.guid, 0);

            this.element = steppedStageItemReducer(this.element, deleteEntryCriteriaEvent);
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }

    handleScreenFlowsLoaded() {}

    handleScreenFlowSelected(e: ValueChangedEvent) {
        // TODO in next PR
        this.selectedScreenFlow.flowName = e.detail.value;
    }

    handleEntryCriteriaItemChanged(e: ComboboxStateChangedEvent) {
        if (e.detail.item) {
            const updateEntryCriteria = new UpdateConditionEvent(this.element.guid, 0, {
                leftValueReference: e.detail.item.value,
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'Completed'
                }
            });
            this.element = steppedStageItemReducer(this.element, updateEntryCriteria);
            this.dispatchEvent(new UpdateNodeEvent(this.element));
        }
    }
}
