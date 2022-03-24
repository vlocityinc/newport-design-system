// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class FerToFerovExpressionBuilder extends LightningElement {
    @api
    lhsLabel;

    @api
    lhsPlaceholder;

    @api
    lhsMustBeWritable;

    @api
    lhsDisabled;

    @api
    lhsFormattedDisplayText;

    @api
    operatorLabel;

    @api
    operatorPlaceholder;

    @api
    defaultOperator;

    @api
    rhsLabel;

    @api
    rhsPlaceholder;

    @api
    containerElement;

    @api
    expression;

    @api
    rules;

    @api
    variant;

    @api
    lhsLabelHelpText;

    @api
    rhsLabelHelpText;

    @api
    hideNewResource;

    @api
    hideGlobalVariables;

    @api
    rhsCategoriesToInclude;

    @api
    required;
}
