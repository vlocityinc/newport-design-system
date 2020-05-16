// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { assignmentReducer } from './assignmentReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { getRulesForElementType, RULE_TYPES, RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';
import { LABELS } from './assignmentEditorLabels';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';

/**
 * @constant UPDATE_PROPERTY
 * @type {string}
 */

export default class AssignmentEditor extends LightningElement {
    /**
     * Internal state for the assignment editor
     */
    @track assignmentElement;

    labels = LABELS;
    defaultOperator = RULE_OPERATOR.ASSIGN;

    get elementType() {
        return ELEMENT_TYPE.ASSIGNMENT;
    }

    get rules() {
        return getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementType);
    }

    get showDelete() {
        return this.assignmentElement.assignmentItems.length > 1;
    }

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    get node() {
        return this.assignmentElement;
    }

    set node(newValue) {
        this.assignmentElement = newValue || {};
    }

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
        return this.assignmentElement;
    }

    /**
     * public api function to run the rules from assignment validation library
     * @returns {object} list of errors
     */
    @api validate() {
        // we may want to use createAction here ?
        const event = { type: VALIDATE_ALL };
        this.assignmentElement = assignmentReducer(this.assignmentElement, event);
        return getErrorsFromHydratedElement(this.assignmentElement);
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event) {
        event.stopPropagation();
        this.assignmentElement = assignmentReducer(this.assignmentElement, event);

        this.dispatchEvent(new UpdateNodeEvent(this.assignmentElement));
    }
}
