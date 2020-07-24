// @ts-nocheck
import {
    ELEMENT_TYPE,
    FLOW_TRIGGER_FREQUENCY,
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    CONDITION_LOGIC
} from 'builder_platform_interaction/flowMetadata';
import { baseCanvasElement, baseCanvasElementsArrayToMap } from './base/baseElement';
import { createStartElementConnector, createConnectorObjects } from './connector';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createRecordFilters, createFilterMetadataObject } from './base/baseRecordElement';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { SYSTEM_VARIABLE_RECORD_PREFIX } from 'builder_platform_interaction/systemLib';
import { isScheduledTriggerType, isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import { formatDateTimeUTC, getDayOfTheWeek } from 'builder_platform_interaction/dateTimeUtils';
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './elementFactoryLabels';

export const START_ELEMENT_LOCATION = {
    x: 50,
    y: 50
};
const maxConnections = 1;
const elementType = ELEMENT_TYPE.START_ELEMENT;

const { BEFORE_SAVE, AFTER_SAVE, SCHEDULED, PLATFORM_EVENT, BEFORE_DELETE } = FLOW_TRIGGER_TYPE;
const BEFORE_AFTER_SAVE_Y_OFFSET = 181;
const SCHEDULED_Y_OFFSET = 204;
const PLATFORM_Y_OFFSET = 122;
const DEFAULT_Y_OFFSET = 86;

/**
 * Helper function to determine how big the start element is in the Y direction.
 * @param startElement start element metadata structure
 * @returns Y offset
 */
export function findStartYOffset(startElement: object): number {
    switch (startElement.triggerType) {
        case AFTER_SAVE:
        case BEFORE_SAVE:
        case BEFORE_DELETE:
            return BEFORE_AFTER_SAVE_Y_OFFSET;
        case SCHEDULED:
            if (startElement.filters && startElement.filters.length > 0) {
                return SCHEDULED_Y_OFFSET;
            }
            return BEFORE_AFTER_SAVE_Y_OFFSET;
        case PLATFORM_EVENT:
            return PLATFORM_Y_OFFSET;
        default:
            return DEFAULT_Y_OFFSET;
    }
}

/**
 * Creates a start element object in the shape expected by the store
 * @param {Object} startElement start element object used to construct the new object
 * @returns {Object} startElement the new start element object
 */
export function createStartElement(startElement = {}) {
    const newStartElement = baseCanvasElement(startElement);

    const {
        locationX = START_ELEMENT_LOCATION.x,
        locationY = START_ELEMENT_LOCATION.y,
        object = '',
        objectIndex = generateGuid(),
        filters = [],
        objectContainer
    } = startElement;
    const triggerType = startElement.triggerType || FLOW_TRIGGER_TYPE.NONE;
    const { startDate, startTime } = startElement.schedule || startElement;
    let { recordTriggerType, frequency } = startElement.schedule || startElement;
    let { filterLogic = CONDITION_LOGIC.AND } = startElement;

    // For the existing element if no filters has been set we need to assign No Conditions to the filterLogic.
    if (object !== '' && filters.length === 0 && filterLogic === CONDITION_LOGIC.AND) {
        filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
    }

    const isoStartTime =
        startTime && !isUndefinedOrNull(startTime.timeInMillis)
            ? getISOTimeFromMillis(startTime.timeInMillis)
            : startTime;

    let label;
    if (isScheduledTriggerType(triggerType)) {
        label = getscheduledLabel(startDate, isoStartTime, frequency);
        if (!frequency) {
            frequency = FLOW_TRIGGER_FREQUENCY.ONCE;
        }
    }

    if (isRecordChangeTriggerType(triggerType) && recordTriggerType === undefined) {
        if (triggerType === FLOW_TRIGGER_TYPE.BEFORE_DELETE) {
            recordTriggerType = FLOW_TRIGGER_SAVE_TYPE.DELETE;
        } else {
            recordTriggerType = FLOW_TRIGGER_SAVE_TYPE.CREATE;
        }
    }

    const requireChangedValues = !!startElement.doesRequireRecordChangedToMeetCriteria;
    const recordFilters = createRecordFilters(filters, object);

    Object.assign(newStartElement, {
        elementType,
        locationX,
        locationY,
        maxConnections,
        triggerType,
        filterLogic,
        startDate,
        startTime: isoStartTime,
        recordTriggerType,
        frequency,
        object,
        objectIndex,
        filters: recordFilters,
        label,
        objectContainer,
        // If the start element is linked to an sobject, then make the element look like a data element.
        name: object ? SYSTEM_VARIABLE_RECORD_PREFIX : undefined,
        dataType: object ? FLOW_DATA_TYPE.SOBJECT.value : undefined,
        subtype: object ? object : undefined,
        isCollection: object ? false : undefined,
        isAssignable: object ? true : undefined,
        doesRequireRecordChangedToMeetCriteria: requireChangedValues
    });

    return newStartElement;
}

/**
 * Create the start element object with connectors using either the startElement metadata object or the startElementReference metadata property
 * This is used during translation from metadata to the client side UI model.
 * @param {Object} startElement start element metadata object
 * @param {string} startElementReference guid/name of the first element in the flow
 * @returns {Object} startElement the start element object
 */
export function createStartElementWithConnectors(startElement = {}, startElementReference) {
    const newStartElement = createStartElement(startElement);

    const connectors = startElementReference
        ? createStartElementConnector(newStartElement.guid, startElementReference)
        : createConnectorObjects(startElement, newStartElement.guid);
    const connectorCount = connectors.length;
    Object.assign(newStartElement, { connectorCount });

    return baseCanvasElementsArrayToMap([newStartElement], connectors);
}

/**
 * Create a start element Flow metadata object
 * @param {Object} startElement the start element client side object used to construct the metadata object
 * @param {Object} config configuration used to translate to the metadata object
 * @returns {Object} startElementMetadata the start element metadata object
 */
export function createStartElementMetadataObject(startElement, config = {}) {
    if (!startElement) {
        throw new Error('startElement is not defined');
    }

    const startElementMetadata = baseCanvasElementMetadataObject(startElement, config);

    const {
        object,
        objectContainer,
        triggerType,
        startDate,
        recordTriggerType,
        startTime,
        frequency,

        filters = [],
        doesRequireRecordChangedToMeetCriteria
    } = startElement;
    let { filterLogic } = startElement;
    let recordFilters;

    if (filters.length > 0 && filters[0].leftHandSide && filterLogic !== CONDITION_LOGIC.NO_CONDITIONS) {
        recordFilters = filters.map(filter => createFilterMetadataObject(filter));
    } else {
        recordFilters = [];
        filterLogic = undefined;
    }

    const schedule = startDate && startTime && frequency ? { startDate, startTime, frequency } : undefined;

    return Object.assign(startElementMetadata, {
        label: undefined,
        name: undefined,
        description: undefined,
        triggerType: triggerType === FLOW_TRIGGER_TYPE.NONE ? undefined : triggerType,
        schedule,
        object: object === '' ? undefined : object,
        objectContainer,
        recordTriggerType: recordTriggerType === '' ? undefined : recordTriggerType,
        doesRequireRecordChangedToMeetCriteria,
        filterLogic,
        filters: recordFilters
    });
}

function getISOTimeFromMillis(timeinMillis) {
    const date = new Date(timeinMillis);
    // ISO Time is in this format: 2008-09-15T15:53:00Z, and we just care about the latter time portion minus the Z
    return date
        .toISOString()
        .slice(0, -1)
        .split('T')[1];
}

function getscheduledLabel(startDate, startTime, frequency) {
    let label;
    if (startDate && startTime) {
        const startDateTime = new Date(startDate);
        const parts = startTime.split(':');
        if (parts.length > 1) {
            startDateTime.setUTCHours(parts[0]);
            startDateTime.setUTCMinutes(parts[1]);
        }
        let frequencyLabel;
        if (frequency === FLOW_TRIGGER_FREQUENCY.ONCE) {
            frequencyLabel = LABELS.triggerFrequencyOnce;
        } else if (frequency === FLOW_TRIGGER_FREQUENCY.DAILY) {
            frequencyLabel = LABELS.triggerFrequencyDaily;
        } else if (frequency === FLOW_TRIGGER_FREQUENCY.WEEKLY) {
            frequencyLabel = LABELS.triggerFrequencyWeekly;
        }
        label = getDayOfTheWeek(startDateTime) + ', ' + formatDateTimeUTC(startDateTime) + ', ' + frequencyLabel;
    }

    return label;
}
