// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { LABELS } from './debugEditorPopoverLabels';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';

export default class DebugEditorPopover extends LightningElement {
    labels = LABELS;

    @track
    debugInput = {
        inputs: [],
        name,
        runLatestVersion: true,
        showDebugInfo: true,
        enableRollback: false,
        runAs: false,
        governorLimits: false
    };

    @api flowName;
    dict = {};
    inputVar = [];
    hasInputVariables = false;

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

    connectedCallback() {
        this.fetchFlowInputOutputVariables();
    }

    handleInputVariable(event) {
        this.dict[event.detail.name] = event.detail;
    }

    fetchFlowInputOutputVariables() {
        const flowName = this.flowName;
        const serverActionParams = { flowName };
        fetch(SERVER_ACTION_TYPE.GET_FLOW_INPUT_OUTPUT_VARIABLES, this.fetchVariablesCallback, serverActionParams);
    }

    fetchVariablesCallback = ({ data, error }) => {
        if (error) {
            // Do something here
            window.console.log(error);
        } else {
            for (let i = 0; i < data[0].variables.length; i++) {
                const currentVar = data[0].variables[i];
                if (currentVar && currentVar.isInput && !currentVar.isCollection && currentVar.dataType !== 'Apex') {
                    this.hasInputVariables = true;
                    this.inputVar.push(currentVar);
                    const values = { name: currentVar.name, value: '', type: currentVar.dataType };
                    this.dict[currentVar.name] = values;
                }
            }
            this.setInput();
        }
    };

    setInput() {
        // Reset in case we call it again
        this.debugInput.inputs = [];
        for (const key in this.dict) {
            if (this.dict.hasOwnProperty(key)) {
                this.debugInput.inputs.push(this.dict[key]);
            }
        }
    }
}
