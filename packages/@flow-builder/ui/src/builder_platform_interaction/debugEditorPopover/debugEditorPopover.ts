// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { LABELS } from './debugEditorPopoverLabels';

export default class DebugEditorPopover extends LightningElement {
    labels = LABELS;

    @track
    debugInput = {
        runLatestVersion: true,
        showDebugInfo: true,
        enableRollback: false,
        runAs: false,
        governorLimits: false
    };

    @api
    get debugInputObject() {
        return this.debugInput;
    }

    set debugInputObject(data) {
        if (this.debugInput !== data) {
            this.debugInput = data;
        }
    }

    handleChange = event => {
        switch (event.target.label) {
            case LABELS.runLatestVersion:
                this.debugInput.latestSubflow = event.detail.checked;
                break;
            case LABELS.showDebugInfo:
                this.debugInput.showDebugInfo = event.detail.checked;
                break;
            case LABELS.enableRollbackMode:
                this.debugInput.enableRollback = event.detail.checked;
                break;
            case LABELS.runAs:
                this.debugInput.runAs = event.detail.checked;
                break;
            case LABELS.governorLimits:
                this.debugInput.governorLimits = event.detail.checked;
                break;
            default:
                break;
        }
    };
}
