// @ts-nocheck
import { LightningElement, api, track, wire } from 'lwc';
import { LABELS } from './debugEditorPopoverLabels';
import { getRecordCreateDefaults } from 'lightning/uiRecordApi';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';

const DEFAULT_NAME_FIELD = 'Name';

export default class DebugEditorPopover extends LightningElement {
    labels = LABELS;

    @track
    debugInput = {
        inputs: [],
        runLatestVersion: true,
        showDebugInfo: true,
        enableRollback: false,
        runAs: false,
        debugAsUserId: undefined,
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

    /**
     * Max values to select in the lookup.
     */
    maxValues = 1;

    /**
     * Field info for the input field api name
     */
    _fieldInfo = {};

    /**
     * Name field of the target record
     */
    _nameField = '';

    /**
     * Fields of target record
     * @typedef {Array}
     */
    _fields;

    /**
     * The object infos for the object api name. Its a map of object api name to its object info.
     */
    @track
    objectInfos = {};

    /**
     * The mocked source record to pass it to search lookup.
     */
    @track
    sourceRecord;

    /**
     * The API name of the source object.
     * @typedef {String}
     * @memberof Lookup
     */
    objectApiName = 'User';

    /**
     * The API name of a lookup field on the source object.
     * @typedef {String}
     * @memberof Lookup
     */
    fieldApiName = 'CreatedById';

    /** Requiredness for lookup
     * @typedef {Boolean}
     * @memberof Lookup
     */
    required = false;

    @wire(getRecordCreateDefaults, {
        objectApiName: '$objectApiName'
    })
    wiredLookupMetadata({ error, data }) {
        if (error || !data) {
            return;
        }

        if (data.objectInfos) {
            // data is readonly, do deep copy to update the values
            this.objectInfos = JSON.parse(JSON.stringify(data.objectInfos));
            this._fieldInfo = this.objectInfos[this.objectApiName].fields[this.fieldApiName];

            if (!this._fieldInfo) {
                return;
            }

            // get the target record apiName and name field from referenceToInfos
            // the logic is adopted from function computeReferenceInfos of lookupDesktop/utils
            const { referenceToInfos } = this._fieldInfo;
            if (Array.isArray(referenceToInfos) && referenceToInfos.length) {
                const { nameFields, apiName } = referenceToInfos[0];
                this._nameField = nameFields.length > 1 ? DEFAULT_NAME_FIELD : nameFields[0];
                this._fields = [`${apiName}.${this._nameField}`];
            }

            this.createSourceRecord();
            // Use the field on field info to control the requiredness as it takes precedence over the required attribute
            this._fieldInfo.required = this.required;
        }
    }

    /**
     * Handle the lookup value change event.
     * @param {Object} event value change event
     */
    handleValueChange(event) {
        event.stopPropagation();
        this.recordId = event.detail.value[0] || '';
        this.debugInput.debugAsUserId = this.recordId;
    }

    /**
     * Create the mock source record to pass it to the search lookup component.
     */
    createSourceRecord() {
        const relationshipName = this._fieldInfo.relationshipName;
        this.sourceRecord = {
            apiName: this.objectApiName,
            fields: {
                [this.fieldApiName]: {
                    // this populates the preselected record Id on the lightning-lookup
                    value: this.recordId
                },
                [relationshipName]: ''
            }
        };
    }
}
