// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class FerovResourcePicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-ferov-resource-picker';

    @api
    elementConfig;

    @api
    propertyEditorElementType;

    @api
    value;

    @api
    comboboxConfig;

    @api
    elementParam;

    @api
    hideNewResource;

    @api
    newResourceTypeLabel;

    @api
    includeQuickCreateResourceOption;

    @api
    hideGlobalConstants;

    @api
    errorMessage;

    @api
    rules;

    @api
    hideSystemVariables;

    @api
    hideGlobalVariables;

    @api
    forFormula;

    @api
    rowIndex;

    @api
    inlineItem;

    @api
    setCustomValidity = jest.fn();

    @api
    isPillSupported;

    @api
    activePicklistValues;

    @api
    hideFlowSystemVariable;
}
