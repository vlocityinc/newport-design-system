import errorLoadingTemplateData from "@salesforce/label/FlowBuilderNewFlowModal.errorLoadingTemplateData";

/**
 * @enum {string} FETCH_FLOW_MODAL_DATA_ERROR_TYPE
 */
export const FETCH_FLOW_MODAL_DATA_ERROR_TYPE = {
    TEMPLATE_DATA_ERROR : 'fetchTemplateDataError', // error when fetching template data
    TEMPLATES_ERROR : 'fetchTemplatesError', // error when fetching templates
    PROCESS_TYPES_ERROR : 'fetchProcesTypesError', // error when fetching process types
};

export const getFullErrorMessage = (errorMessage) => {
    if (errorMessage) {
        const type = errorMessage.type;
        if (type) {
            switch (type) {
                case FETCH_FLOW_MODAL_DATA_ERROR_TYPE.TEMPLATE_DATA_ERROR:
                    return errorLoadingTemplateData;
                default:
                    return errorMessage.message;
            }
        }
        return errorMessage.message;
    }
    return '';
};