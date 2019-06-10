import * as ValidationRules from 'builder_platform_interaction/validationRules';
import {
    Validation,
    defaultRules
} from 'builder_platform_interaction/validation';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    CONDITION_LOGIC,
    WAIT_TIME_EVENT_TYPE,
    WAIT_TIME_EVENT_PARAMETER_NAMES,
    WAIT_TIME_EVENT_OFFSET_UNIT
} from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './waitEditorLabels';

/**
 * Function to test the value is equal to the string 'days' or 'weeks'
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldBeHoursDaysOrBlank = value => {
    if (
        value &&
        value !== WAIT_TIME_EVENT_OFFSET_UNIT.HOURS &&
        value !== WAIT_TIME_EVENT_OFFSET_UNIT.DAYS
    ) {
        return LABELS.shouldBeHoursOrDays;
    }

    return null;
};

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    defaultConnectorLabel: [ValidationRules.shouldNotBeBlank],
    conditionLogic: [ValidationRules.shouldNotBeBlank]
};

const conditionRule = {
    conditions: ValidationRules.validateExpressionWith3Properties({
        elementType: ELEMENT_TYPE.WAIT
    })
};

// TODO: This will work properly when this story (W-5568291) is completed
const outputParameterRules = outputParameter => {
    const opRules = {};
    opRules.value = [
        ValidationRules.validateResourcePicker(outputParameter.rowIndex)
    ];
    return opRules;
};

const absoluteTimeRules = () => {
    return {
        inputParameters: inputParameter => {
            const ipRules = {};

            if (
                inputParameter.name.value ===
                WAIT_TIME_EVENT_PARAMETER_NAMES.ABSOLUTE_BASE_TIME
            ) {
                ipRules.value = [
                    ValidationRules.shouldNotBeBlank,
                    ValidationRules.validateResourcePicker(
                        inputParameter.rowIndex
                    )
                ];
            } else if (
                inputParameter.name.value ===
                WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_UNIT
            ) {
                ipRules.value = [shouldBeHoursDaysOrBlank];
            }

            return ipRules;
        },
        outputParameters: outputParameterRules
    };
};

const directTimeRules = () => {
    return {
        inputParameters: inputParameter => {
            const requiredParameterNames = [
                WAIT_TIME_EVENT_PARAMETER_NAMES.SALESFORCE_OBJECT,
                WAIT_TIME_EVENT_PARAMETER_NAMES.DIRECT_RECORD_BASE_TIME
            ];

            const ipRules = {};

            if (requiredParameterNames.includes(inputParameter.name.value)) {
                ipRules.value = [ValidationRules.shouldNotBeBlank];
            }

            if (
                inputParameter.name.value ===
                WAIT_TIME_EVENT_PARAMETER_NAMES.RECORD_ID
            ) {
                ipRules.value = [
                    ValidationRules.shouldNotBeBlank,
                    ValidationRules.validateResourcePicker(
                        inputParameter.rowIndex
                    )
                ];
            }

            if (
                inputParameter.name.value ===
                WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_UNIT
            ) {
                ipRules.value = [shouldBeHoursDaysOrBlank];
            }

            return ipRules;
        },
        outputParameters: outputParameterRules
    };
};

const platformEventParametersRule = eventTypeIndex => {
    return {
        eventType: [
            ValidationRules.shouldNotBeBlank,
            ValidationRules.validateResourcePicker(eventTypeIndex)
        ],
        inputParameters: () => {
            return {
                name: [ValidationRules.shouldNotBeBlank]
            };
        },
        outputParameters: outputParameterRules
    };
};

class WaitValidation extends Validation {
    /**
     * @returns {Object} Base rules for a wait node
     */
    getBaseWaitRules() {
        const overrideRules = Object.assign({}, this.finalizedRules);
        overrideRules.waitEvents = this.getWaitEventRules();
        return overrideRules;
    }

    getWaitEventRules() {
        return waitEvent => {
            let rules = Object.assign({}, defaultRules);

            if (
                waitEvent.conditionLogic.value !== CONDITION_LOGIC.NO_CONDITIONS
            ) {
                rules = Object.assign(rules, conditionRule);
            }

            // Resume validation based on event type
            if (
                waitEvent.eventType.value === WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME
            ) {
                rules = Object.assign(rules, absoluteTimeRules());
            } else if (
                waitEvent.eventType.value ===
                WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME
            ) {
                rules = Object.assign(rules, directTimeRules());
            } else {
                // Platform events
                rules = Object.assign(
                    rules,
                    platformEventParametersRule(waitEvent.eventTypeIndex)
                );
            }

            return rules;
        };
    }

    /**
     * Method to check if devname is unique locally amongst all other waitevents and parent wait node state.
     * @param {Object} state -  overall state of wait node
     * @param {string} devNameToBeValidated - for uniqueness
     * @param {string} currentWaitEventGuid - guid of the current waitevent whose devname is tested for uniquness
     * @returns {string|null} errorString or null
     */
    validateWaitEventNameUniquenessLocally = (
        state,
        devNameToBeValidated,
        currentWaitEventGuid
    ) => {
        const stateGuidToDevName = [
            {
                guid: state.guid,
                name: state.name.value
            }
        ];
        const waitEventsDevNameToGuidList = state.waitEvents.map(waitEvent => {
            return {
                guid: waitEvent.guid,
                name: waitEvent.name.value
            };
        });
        const finalListOfGuidToDevNames = stateGuidToDevName.concat(
            waitEventsDevNameToGuidList
        );
        return this.validateDevNameUniquenessLocally(
            finalListOfGuidToDevNames,
            devNameToBeValidated,
            currentWaitEventGuid
        );
    };
}

export const waitValidation = new WaitValidation(additionalRules);
