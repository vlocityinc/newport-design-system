import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import ResourceDetailsParametersExtensionConfig from './resourceDetailsParametersExtension';
import ResourceDetailsParametersActionConfig from './resourceDetailsParametersAction';

import { LABELS } from './resourceDetailsParametersLabels';

/**
 * @returns {Map} configuration for all element supporting automatic output parameters
 * will provide fetch function and mapping function in order to render parameters as expected
 * To be completed by any other element type supporting automatic output parameters
 */
export const RESOURCES_TYPE_WITH_AUTOMATIC_OUTPUT_PARAMETERS_CONFIGURATION = new Map(
    [
        [ELEMENT_TYPE.SCREEN_FIELD, ResourceDetailsParametersExtensionConfig],
        [ELEMENT_TYPE.ACTION_CALL, ResourceDetailsParametersActionConfig],
        [ELEMENT_TYPE.APEX_CALL, ResourceDetailsParametersActionConfig]
    ]
);

export default class ResourceDetailParameters extends LightningElement {
    @api resourceDetails = {};

    @track state = {
        hasParameters: false,
        displaySpinner: false
    };

    labels = LABELS;
    _parameters = [];

    /**
     * Array of parameters
     */
    @api
    get parameters() {
        return this._parameters;
    }

    /**
     * @returns {Function} the fetch function used
     */
    get fetchFunction() {
        if (this._fetchFunction === undefined) {
            const configurationClass = RESOURCES_TYPE_WITH_AUTOMATIC_OUTPUT_PARAMETERS_CONFIGURATION.get(
                this.resourceDetails.elementType
            );
            this._fetchFunction = configurationClass
                ? configurationClass.fetch()
                : undefined;
        }
        return this._fetchFunction;
    }

    /**
     * Resource element GUID
     * @returns {string} the resource GUID
     */
    get resourceGuid() {
        return this.resourceDetails ? this.resourceDetails.elementGuid : '';
    }

    /**
     * Feed the parameters (if empty will reactively hide the section content)
     * @param {Array[Object]} data parameters returned by the fetch function (will be re shaped the given resource element custom mapper if any left untouched if none)
     * @param {Object} error error if any
     * Parameters defaulted to empty array if error
     */
    _setParameters(data, error) {
        this.state.displaySpinner = false;
        this.state.hasParameters = data && data.length > 0;
        this._parameters = error ? [] : data;
    }

    connectedCallback() {
        if (typeof this.fetchFunction === 'function') {
            this.state.displaySpinner = true;
            try {
                this.fetchFunction(this.resourceGuid, (data, error) =>
                    this._setParameters(data, error)
                );
            } catch (error) {
                this.state.displaySpinner = false;
            }
        }
    }
}
