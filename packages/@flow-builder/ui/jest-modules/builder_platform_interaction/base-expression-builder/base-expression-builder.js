import { Element, api } from 'engine';

export default class BaseExpressionBuilder extends Element {
    @api
    containerElemnt;

    @api
    lhsPlaceholder;

    @api
    lhsLabel;

    @api
    lhsValue;

    @api
    lhsError;

    @api
    lhsFields;

    @api
    lhsParam;

    @api
    lhsActivePicklistValues;

    @api
    lhsIsField;

    @api
    showLhsAsFieldReference;

    @api
    operatorLabel;

    @api
    operatorValue;

    @api
    operatorError;

    @api
    operatorPlaceholder;

    @api
    rhsLabel;

    @api
    rhsValue;

    @api
    rhsError;

    @api
    rhsGuid;

    @api
    rhsIsField;

    @api
    rhsFields;

    @api
    rhsLiteralsAllowed;
}
