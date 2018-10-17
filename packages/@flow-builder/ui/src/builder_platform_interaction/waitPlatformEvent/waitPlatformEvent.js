import { LightningElement, track, api } from 'lwc';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './waitPlatformEventLabels';
import { isObject } from 'builder_platform_interaction/commonUtils';
import { RULE_TYPES, getRulesForElementType } from 'builder_platform_interaction/ruleLib';
import { getFieldsForEntity } from 'builder_platform_interaction/sobjectLib';

export default class WaitPlatformEvent extends LightningElement {
    labels = LABELS;

    filterParameters = [];

    /**
     * @type {String} guid of the parent wait element
     */
    @api
    parentGuid;

    /**
     * Selected event type from the sobject picker
     * @type {String} event type of the platform event
     */
    set eventType(eventType) {
        this._eventType = eventType;

        if (eventType && eventType.value) {
            this.updateFilterFields(eventType.value);
        }
    }

    @api
    get eventType() {
        return this._eventType;
    }

    /**
     * Object of input filter parameters
     * @type {Map}
     */
    set resumeTimeParameters(parameterItems) {
        if (parameterItems) {
            this.filterParameters = parameterItems;

            this.filters = [];
            for (let i = 0; i < parameterItems.length; i++) {
                const inputParameter = parameterItems[i];
                const filter = {
                    expression: {
                        leftHandSide: {
                            value: inputParameter.name,
                            error: null
                        },
                        rightHandSide: {
                            value: inputParameter.value,
                            error: null
                        },
                        rightHandSideDataType: {
                            value: inputParameter.valueDataType,
                            error: null
                        }
                    },
                    rowIndex: inputParameter.rowIndex
                };
                this.filters.push(filter);
            }
        }
    }

    @api
    get resumeTimeParameters() {
        return this.filterParameters;
    }

    // TODO: this should not need to be @track once eventType is flowing down correctly instead of being set at
    // this level by handleEventTypeChanged (currently needed for tests to pass)
    @track
    _eventType;

    @track
    filterConditionLogicOptions = [
        {value: CONDITION_LOGIC.NO_CONDITIONS, label: LABELS.noConditionsLabel},
        {value: CONDITION_LOGIC.AND, label: LABELS.andConditionLogicLabel}
    ];


    @track
    elementTypeForExpressionBuilder = ELEMENT_TYPE.WAIT;

    @track
    rulesForExpressionBuilder = getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementTypeForExpressionBuilder);

    @track
    filters = [];

    @track filterFields;

    @track
    outputParameterItem = {
        label: LABELS.platformEventOutputLabel,
        iconName: 'utility:events',
        dataType: FLOW_DATA_TYPE.SOBJECT.value,
    };

    get eventTypeValue() {
        return this._eventType && this._eventType.value;
    }

    /**
     * @returns the selected condition logic for filtering
     */
    get filterConditionLogic() {
        return {
            value: this.filters.length === 0 ? CONDITION_LOGIC.NO_CONDITIONS : CONDITION_LOGIC.AND
        };
    }

    /**
     * get the fields of the selected entity
     */
    updateFilterFields(objectType) {
        getFieldsForEntity(objectType, (fields) => {
            this.filterFields = fields;
        });
    }

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get eventTypeComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.eventLabel,
            LABELS.selectEventLabel,
            null,
            false,
            true,
        );
    }

    get showDelete() {
        return this.filters.length > 1;
    }

    get elementType() {
        return ELEMENT_TYPE.WAIT;
    }

    // TODO: as part of current story this should be moved up to wait event?
    handleEventTypeChanged(event) {
        event.stopPropagation();

        const eventTypeItem = event.detail.item;
        if (isObject(eventTypeItem)) {
            this.outputParameterItem.objectType = eventTypeItem.objectType;
            this.eventType = {
                value: eventTypeItem.objectType,
                error: null
            };
        } else {
            this.eventType = null;
        }
    }
}