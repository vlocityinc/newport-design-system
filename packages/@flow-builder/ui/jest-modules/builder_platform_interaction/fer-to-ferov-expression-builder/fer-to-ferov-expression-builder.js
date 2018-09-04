import { LightningElement, api } from 'lwc';

export default class FerToFerovExpressionBuilder extends LightningElement {
    @api
    lhsLabel;

    @api
    lhsPlaceholder;

    @api
    operatorLabel;

    @api
    operatorPlaceholder;

    @api
    rhsLabel;

    @api
    rhsPlaceholder;

    @api
    containerElement;

    @api
    expression;
}