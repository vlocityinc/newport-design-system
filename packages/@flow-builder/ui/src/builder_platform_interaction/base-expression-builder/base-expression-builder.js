import { Element, api, track } from 'engine';
import { getRulesForContext } from 'builder_platform_interaction-rule-lib';

export default class BaseExpressionBuilder extends Element {
    @track
    state = {
        containerElement: undefined,
        rules: undefined,
        lhsParam: undefined,
        lhsFields: undefined,
        showLhsAsFieldReference: false,
        lhsActivePicklistValues: undefined,
        lhsFullMenuData: undefined,
        lhsFilteredMenuData: undefined,
        operatorValue: undefined,
        rhsFields: undefined,
        rhsIsField: undefined,
    };

    @api
    set containerElement(elementType) {
        this.state.containerElement = elementType;
        this.state.rules = getRulesForContext({elementType});
    }

    @api
    get containerElement() {
        return this.state.containerElement;
    }

    @api
    lhsPlaceholder;

    @api
    lhsLabel;

    @api
    lhsValue;

    @api
    lhsError;

    @api
    set lhsFields(fields) {
        this.state.lhsFields = fields;
    }

    @api
    get lhsFields() {
        return this.state.lhsFields;
    }

    @api
    set lhsParam(param) {
        this.state.lhsParam = param;
    }

    @api
    get lhsParam() {
        return this.state.lhsParam;
    }

    @api
    set lhsActivePicklistValues(values) {
        this.state.lhsActivePicklistValues = values;
    }

    @api
    get lhsActivePicklistValues() {
        return this.state.lhsActivePicklistValues;
    }

    @api
    set lhsIsField(isField) {
        this.state.lhsIsField = isField;
    }

    @api
    get lhsIsField() {
        return this.state.lhsIsField;
    }

    @api
    set showLhsAsFieldReference(show) {
        this.state.showLhsAsFieldReference = show;
    }

    @api
    get showLhsAsFieldReference() {
        return this.state.showLhsAsFieldReference;
    }

    @api
    operatorLabel;

    @api
    set operatorValue(value) {
        this.state.operatorValue = value;
    }

    @api
    get operatorValue() {
        return this.state.operatorValue;
    }

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
    set rhsIsField(isField) {
        this.state.rhsIsField = isField;
    }

    @api
    get rhsIsField() {
        return this.state.rhsIsField;
    }

    @api
    set rhsFields(fields) {
        this.state.rhsFields = fields;
    }

    @api
    get rhsFields() {
        return this.state.rhsFields;
    }

    @api
    rhsPlaceholder;

    @api
    set rhsLiteralsAllowed(allowed) {
        this.state.rhsLiteralsAllowedForContext = allowed;
    }

    @api
    get rhsLiteralsAllowed() {
        return this.state.rhsLiteralsAllowedForContext;
    }
}
