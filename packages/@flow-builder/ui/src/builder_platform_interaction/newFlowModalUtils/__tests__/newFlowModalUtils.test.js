import {FETCH_FLOW_MODAL_DATA_ERROR_TYPE, getFullErrorMessage} from 'builder_platform_interaction/newFlowModalUtils';

describe('"getFullErrorMessage" function', () => {
    let errorMessage;
    it('undefined "errorMessage" argument returns empty string', () => {
        expect(getFullErrorMessage()).toBe('');
    });
    it('null "errorMessage" argument returns empty string', () => {
        expect(getFullErrorMessage(null)).toBe('');
    });
    it('"empty string" "errorMessage" argument returns empty string', () => {
        expect(getFullErrorMessage('')).toBe('');
    });
    it('"errorMessage" argument (with no "type" property) returns "errorMessage.message"', () => {
        errorMessage = {message: "an error occured"};
        expect(getFullErrorMessage(errorMessage)).toBe(errorMessage.message);
    });
    it('"errorMessage" argument (with "type" property) other than "FETCH_FLOW_MODAL_DATA_ERROR_TYPE.TEMPLATE_DATA_ERROR" returns "errorMessage.message"', () => {
        errorMessage = {type: "not the template data error type", message: "an error occured"};
        expect(getFullErrorMessage(errorMessage)).toBe(errorMessage.message);
    });
    it('"errorMessage" argument (with "FETCH_FLOW_MODAL_DATA_ERROR_TYPE.TEMPLATE_DATA_ERROR type" property) returns "errorMessage.message"', () => {
        errorMessage = {type: FETCH_FLOW_MODAL_DATA_ERROR_TYPE.TEMPLATE_DATA_ERROR, message: "an error occured"};
        expect(getFullErrorMessage(errorMessage)).toBe('FlowBuilderNewFlowModal.errorLoadingTemplateData');
    });
});