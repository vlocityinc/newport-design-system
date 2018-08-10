import { Element, api, track } from 'engine';
import {
    getElementsForMenuData,
    filterFieldsForChosenElement,
} from 'builder_platform_interaction-expression-utils';
import { getRulesForContext, getLHSTypes, getOperators, getRHSTypes, transformOperatorsForCombobox, } from 'builder_platform_interaction-rule-lib';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { isUndefined } from 'builder_platform_interaction-common-utils';

const SHOW_SUBTEXT = true;
const SHOW_NEW_RESOURCE = true;

const LHS_FULL_MENU_DATA = 'lhsFullMenuData';
const LHS_FILTERED_MENU_DATA = 'lhsFilteredMenuData';
const RHS_FULL_MENU_DATA = 'rhsFullMenuData';
const RHS_FILTERED_MENU_DATA = 'rhsFilteredMenuData';

export default class BaseExpressionBuilder extends Element {
    @track
    state = {
        containerElement: undefined,
        lhsParam: undefined,
        lhsFields: undefined,
        lhsParamTypes: undefined,
        showLhsAsFieldReference: undefined,
        lhsActivePicklistValues: undefined,
        lhsFullMenuData: undefined,
        lhsFilteredMenuData: undefined,
        operatorValue: undefined,
        rhsFields: undefined,
        rhsIsField: undefined,
        [LHS_FULL_MENU_DATA]: undefined,
        [LHS_FILTERED_MENU_DATA]: undefined,
        [RHS_FULL_MENU_DATA]: undefined,
        [RHS_FILTERED_MENU_DATA]: undefined,
    };

    @api
    set containerElement(elementType) {
        this.state.containerElement = elementType;
        this._rules = getRulesForContext({elementType});
        if (!this._rules) {
            throw new Error('Something went wrong fetching the rules');
        }
        this.state.lhsParamTypes = getLHSTypes(elementType, this._rules);
        this.setLhsMenuData();
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
        this.setLhsMenuData();
    }

    @api
    get lhsFields() {
        return this.state.lhsFields;
    }

    @api
    set lhsParam(param) {
        this.state.lhsParam = param;
        this._operatorMenuData = undefined;
        this.setLhsMenuData();
        this._rhsParamTypes = undefined;
        this.setRhsMenuData();
    }

    @api
    get lhsParam() {
        return this.state.lhsParam;
    }

    @api
    set lhsActivePicklistValues(values) {
        this.state.lhsActivePicklistValues = values;
        this.setRhsMenuData();
    }

    @api
    get lhsActivePicklistValues() {
        return this.state.lhsActivePicklistValues;
    }

    @api
    set lhsIsField(isField) {
        this.state.lhsIsField = isField;
        this.setLhsMenuData();
    }

    @api
    get lhsIsField() {
        return this.state.lhsIsField;
    }

    @api
    set showLhsAsFieldReference(show) {
        this.state.showLhsAsFieldReference = show;
        this.setLhsMenuData();
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
        this._rhsParamTypes = undefined;
        this.setRhsMenuData();
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
        this.setRhsMenuData();
    }

    @api
    get rhsIsField() {
        return this.state.rhsIsField;
    }

    @api
    set rhsFields(fields) {
        this.state.rhsFields = fields;
        this.setRhsMenuData();
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

    _rules;
    _rhsParamTypes;
    _operatorMenuData;

    setLhsMenuData() {
        if (!this.areAllDefined([this.state.containerElement, this.state.lhsParam, this.state.lhsFields,
            this.state.lhsIsField, this.state.showLhsAsFieldReference])) {
            return;
        }

        const isFieldMenuData = this.state.lhsIsField && this.state.lhsFields && this.lhsValue;
        const parentMenuItem = isFieldMenuData ? this.lhsValue.parent : null;
        this.populateLhsMenuData(isFieldMenuData, parentMenuItem);
    }

    get operatorMenuData() {
        if (this.areAllDefined([this.state.containerElement, this.state.lhsParam]) && !this._operatorMenuData) {
            this._operatorMenuData = transformOperatorsForCombobox(getOperators(this.state.containerElement, this.state.lhsParam, this._rules));
        }
        return this._operatorMenuData;
    }

    setRhsMenuData() {
        if (!this.areAllDefined([this.state.containerElement, this.state.lhsParam, this.state.lhsActivePicklistValues, this.state.operatorValue,
            this.state.rhsIsField, this.state.rhsFields])) {
            return;
        }

        const isFieldMenuData = this.state.rhsIsField && this.state.rhsFields && this.rhsValue;
        const parentMenuItem = isFieldMenuData ? this.rhsValue.parent : null;
        this.populateRhsMenuData(isFieldMenuData, parentMenuItem);
    }

    getRhsParamTypes() {
        if (!this._rhsParamTypes) {
            this._rhsParamTypes = getRHSTypes(this.state.containerElement, this.state.lhsParam, this.state.operatorValue, this._rules);
        }
        return this._rhsParamTypes;
    }

    populateLhsMenuData(getFields, parentMenuItem) {
        const shouldBeWritable = false;

        this.populateMenuData(getFields, parentMenuItem, LHS_FULL_MENU_DATA, LHS_FILTERED_MENU_DATA, this.state.lhsFields,
            this.state.lhsParamTypes, shouldBeWritable, this.state.showLhsAsFieldReference);
    }

    populateRhsMenuData(getFields, parentMenuItem) {
        const isFerov = true;
        const showAsFieldReference = true;
        const shouldBeWritable = true;

        this.populateMenuData(getFields, parentMenuItem, RHS_FULL_MENU_DATA, RHS_FILTERED_MENU_DATA, this.state.rhsFields,
            this.getRhsParamTypes(), shouldBeWritable, showAsFieldReference, isFerov, this.state.lhsActivePicklistValues);
    }

    populateMenuData(getFields, parentMenuItem, fullMenuData, filteredMenuData, preFetchedFields, paramTypes,
        shouldBeWritable, showAsFieldReference, isFerov, picklistValues) {
        const config = {
            elementType: this.state.containerElement,
            shouldBeWritable,
        };

        const setFieldMenuData = (fields = preFetchedFields) => {
            this.state[fullMenuData] = this.state[filteredMenuData] = filterFieldsForChosenElement(parentMenuItem, paramTypes, fields, showAsFieldReference, SHOW_SUBTEXT);
        };

        if (getFields) {
            if (parentMenuItem) {
                getFieldsForEntity(parentMenuItem.objectType, setFieldMenuData);
            } else {
                setFieldMenuData();
            }
        } else {
            this.state[fullMenuData] = this.state[filteredMenuData] = getElementsForMenuData(config, paramTypes,
                SHOW_NEW_RESOURCE, isFerov, isFerov, picklistValues);
        }
    }

    areAllDefined(attributes) {
        const undefinedIndex = attributes.findIndex((attribute) => {
            return isUndefined(attribute);
        });
        return undefinedIndex < 0;
    }
}
