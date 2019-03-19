import { LightningElement, api } from 'lwc';

export default class FerToFerovExpressionBuilder extends LightningElement {
    @api
    lhsLabel;

    @api
    lhsPlaceholder;

    @api
    lhsMustBeWritable;

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
}