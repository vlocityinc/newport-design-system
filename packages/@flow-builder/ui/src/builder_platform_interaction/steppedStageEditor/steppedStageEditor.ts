import { LightningElement, api } from 'lwc';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import { LABELS } from './steppedStageEditorLabels';
import { steppedStageReducer } from './steppedStageReducer';

export default class SteppedStageEditor extends LightningElement {
    element;

    labels = LABELS;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    editorParams;

    get isLabelCollapsibleToHeader() {
        return this.editorParams && this.editorParams.panelConfig.isLabelCollapsibleToHeader;
    }

    get styleForLabelDescription() {
        if (!this.isLabelCollapsibleToHeader) {
            return 'slds-p-horizontal_small slds-p-top_small';
        }
        return '';
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.element;
    }

    get stageStartOptions() {
        return [
            {
                label: 'When Previous Stage Finishes',
                value: 1
            },
            {
                label: 'Based On Time',
                value: 3
            },
            {
                label: 'Based On Custom Conditions',
                value: 4
            }
        ];
    }

    get stageStartValue() {
        return this.stageStartOptions[0].value;
    }

    get stageFinishOptions() {
        return [
            {
                label: 'When All Steps Are Completed',
                value: 1
            },
            {
                label: 'Based On Custom Conditions',
                value: 4
            }
        ];
    }

    get stageFinishValue() {
        return this.stageFinishOptions[0].value;
    }

    get openSections() {
        return ['startSection', 'finishSection'];
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
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event) {
        event.stopPropagation();

        this.element = steppedStageReducer(this.element, event);

        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    handleStageStartChanged() {}

    handleStageFinishChanged() {}
}
