import { Element, api } from 'engine';

export default class ExpressionBuilder extends Element {
    @api
    elementType;

    @api
    showoperator;

    @api
    expression;

    @api
    lhsLabel;

    @api
    operatorLabel;

    @api
    rhsLabel;

    @api
    lhsMenuData;

    @api
    operatorMenuData;

    @api
    rhsMenuData;
}

