// @ts-nocheck
import { FLOW_STATUS } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement } from 'lwc';
import { LABELS } from './flowStatusLabels';

/**
 * Flow status component (active, inactive, etc...)
 */
export default class FlowStatus extends LightningElement {
    @api flowStatus;

    labels = LABELS;

    statusLabelAndTitle = {
        [FLOW_STATUS.ACTIVE]: {
            label: this.labels.activeLabel,
            title: this.labels.activeTitle
        },
        [FLOW_STATUS.OBSOLETE]: {
            label: this.labels.deactivatedLabel,
            title: this.labels.deactivatedTitle
        },
        [FLOW_STATUS.DRAFT]: {
            label: this.labels.draftLabel,
            title: this.labels.draftTitle
        },
        [FLOW_STATUS.INVALID_DRAFT]: {
            label: this.labels.draftLabel,
            title: this.labels.draftTitle
        }
    };

    get statusBadgeLabel() {
        return this.flowStatus ? this.statusLabelAndTitle[this.flowStatus].label : '';
    }

    get statusBadgeTitle() {
        return this.flowStatus ? this.statusLabelAndTitle[this.flowStatus].title : '';
    }

    get statusBadgeClasses() {
        let classes = '';
        if (this.flowStatus === FLOW_STATUS.ACTIVE) {
            classes = 'slds-theme_success';
        }
        return classes;
    }
}
