import { LightningElement, api } from 'lwc';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';
import { LABELS } from './steppedStageItemLabels';
import { steppedStageItemReducer } from './steppedStageItemReducer';

export default class SteppedStageItemEditor extends LightningElement {
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

    get stepStartOptions() {
        return [
            {
                label: 'When Stage Starts',
                value: 0
            },

            {
                label: 'Based On Other Steps',
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

    get stepStartValue() {
        return this.stepStartOptions[0].value;
    }

    get stepFinishOptions() {
        return [
            {
                label: 'When Flow Is Completed',
                value: 1
            },
            {
                label: 'Based On Custom Conditions',
                value: 4
            }
        ];
    }

    get stepFinishValue() {
        return this.stepFinishOptions[0].value;
    }

    get openSections() {
        return ['startSection', 'stepImplementationSection', 'finishSection'];
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event) {
        event.stopPropagation();

        this.element = steppedStageItemReducer(this.element, event);

        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    handleStepStartChanged() {}

    handleStepFinishChanged() {}
}
