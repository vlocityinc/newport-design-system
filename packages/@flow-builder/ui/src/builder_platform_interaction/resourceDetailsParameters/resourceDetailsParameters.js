import { LightningElement, api, track } from 'lwc';
import { LIGHTNING_COMPONENT_PARAMETERS_RETRIEVAL_CONFIGURATION } from './resourceDetailsParametersExtension';
import { LABELS } from './resourceDetailsParametersLabels';

/**
 * @returns {Object} configuration for all element supporting automatic output parameters
 * will provide fetch function and mapping function in order to render parameters as expected
 * To be completed by any other element type supporting automatic output parameters
 */
export const RESOURCES_TYPE_WITH_AUTOMATIC_OUTPUT_PARAMETERS_CONFIGURATION = {
    ...LIGHTNING_COMPONENT_PARAMETERS_RETRIEVAL_CONFIGURATION
};

/**
 * If no specific mapper provided (dummy one used without any transformation)
 * @param {Object} parameter raw parameter to be transformed
 * @returns {Object} the given parameter left unchanged
 */
const FALLBACK_PARAMETER_MAPPER = parameter => parameter;

export default class ResourceDetailParameters extends LightningElement {
    @api resourceDetails = {};

    @track state = {
        hasParameters: false,
        displaySpinner: false
    };

    labels = LABELS;
    _parameters = undefined;

    /**
     * Array of parameters
     */
    @api
    get parameters() {
        return this._parameters;
    }

    /**
     * Based on the given map storing fetching specifics ({@link ResourceDetailParameters#ALL_CONFIGURATION})returns for the current resource
     * element type the properties to retrieve the parameters (ie: fecth function, mapper)
     */
    get fetchConfig() {
        if (this._fetchConfig === undefined) {
            this._fetchConfig =
                RESOURCES_TYPE_WITH_AUTOMATIC_OUTPUT_PARAMETERS_CONFIGURATION[
                    this.resourceDetails.elementType
                ] || {};
        }
        return this._fetchConfig;
    }

    /**
     * @returns {Function} the fetch function used
     */
    get fetchFunction() {
        return this.fetchConfig.fetch;
    }

    /**
     * Resource element GUID
     * @returns {string} the resource GUID
     */
    get resourceGuid() {
        return this.resourceDetails ? this.resourceDetails.elementGuid : '';
    }

    /**
     * @returns {Function} the given specific  mapper if any (used to shape the aprameter to meet UI requirements) or dummy default mapper otherwise {@link resourceDetailsParameters#FALLBACK_PARAMETER_MAPPER}
     */
    get mapper() {
        return typeof this.fetchConfig.mapper === 'function'
            ? this.fetchConfig.mapper
            : FALLBACK_PARAMETER_MAPPER;
    }

    _reshapeParameters(rawParameters = []) {
        return rawParameters.map(this.mapper);
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
        this._parameters = error ? [] : this._reshapeParameters(data);
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
