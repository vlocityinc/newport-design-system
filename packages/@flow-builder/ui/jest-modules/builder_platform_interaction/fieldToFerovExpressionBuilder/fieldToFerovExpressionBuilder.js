import { Element, api } from 'engine';

export default class FerToFerovExpressionBuilder extends Element {
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

    @api
    objectType;

    @api
    lhsFields;

    @api
    rules;
}
