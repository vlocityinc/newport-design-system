import {
    ELEMENT_TYPE,
    FLOW_TRIGGER_FREQUENCY,
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    CONDITION_LOGIC,
    START_ELEMENT_LOCATION,
    CONNECTOR_TYPE,
    TIME_OPTION,
    SCHEDULED_PATH_OFFSET_UNIT,
    SCHEDULED_PATH_TIME_SOURCE_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    baseChildElement,
    getUpdatedChildrenAndDeletedChildrenUsingStore,
    updateChildReferences
} from './base/baseElement';
import { createStartElementConnector, createConnectorObjects } from './connector';
import { addRegularConnectorToAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from './base/baseMetadata';
import { createRecordFilters, createFilterMetadataObject } from './base/baseRecordElement';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { SYSTEM_VARIABLE_RECORD_PREFIX } from 'builder_platform_interaction/systemLib';
import { isScheduledTriggerType, isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import { formatDateTimeUTC, getDayOfTheWeek } from 'builder_platform_interaction/dateTimeUtils';
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { getElementByGuid, shouldUseAutoLayoutCanvas } from 'builder_platform_interaction/storeUtils';
import { getConnectionProperties } from './commonFactoryUtils/decisionAndWaitConnectionPropertiesUtil';
import { LABELS } from './elementFactoryLabels';
import {
    AvailableConnection,
    ChildElement,
    ChildReference,
    StartFlow,
    StartUi,
    TimeTrigger
} from 'builder_platform_interaction/flowModel';

let maxConnections = 1;

const elementType = ELEMENT_TYPE.START_ELEMENT;

const { BEFORE_SAVE, AFTER_SAVE, SCHEDULED, PLATFORM_EVENT, BEFORE_DELETE } = FLOW_TRIGGER_TYPE;
const BEFORE_AFTER_SAVE_Y_OFFSET = 216;
const BEFORE_AFTER_SAVE_FILTER_Y_OFFSET = 239;
const SCHEDULED_Y_OFFSET = 181;
const SCHEDULED_FILTER_Y_OFFSET = 204;
const PLATFORM_Y_OFFSET = 122;
const DEFAULT_Y_OFFSET = 86;

/**
 * Helper function to determine how big the start element is in the Y direction.
 * @param startElement start element metadata structure
 * @returns Y offset
 */
export function findStartYOffset(startElement: StartUi): number {
    switch (startElement.triggerType) {
        case AFTER_SAVE:
        case BEFORE_SAVE:
        case BEFORE_DELETE:
            if (startElement.filters && startElement.filters.length > 0) {
                return BEFORE_AFTER_SAVE_FILTER_Y_OFFSET;
            }
            return BEFORE_AFTER_SAVE_Y_OFFSET;
        case SCHEDULED:
            if (startElement.filters && startElement.filters.length > 0) {
                return SCHEDULED_FILTER_Y_OFFSET;
            }
            return SCHEDULED_Y_OFFSET;
        case PLATFORM_EVENT:
            return PLATFORM_Y_OFFSET;
        default:
            return DEFAULT_Y_OFFSET;
    }
}

/**
 * Creates a start element object
 * @param {Object} startElement start element object used to construct the new object
 * @returns {Object} startElement the new start element object
 */
function createStartElement(startElement: StartFlow | StartUi) {
    const newStartElement = baseCanvasElement(startElement);
    const {
        locationX = START_ELEMENT_LOCATION.x,
        locationY = START_ELEMENT_LOCATION.y,
        object = '',
        objectIndex = generateGuid(),
        filters = [],
        objectContainer
    } = startElement;
    maxConnections = calculateMaxConnections(startElement);
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

    if (isRecordChangeTriggerType(triggerType)) {
        if (recordTriggerType === undefined) {
            if (triggerType === FLOW_TRIGGER_TYPE.BEFORE_DELETE) {
                recordTriggerType = FLOW_TRIGGER_SAVE_TYPE.DELETE;
            } else {
                recordTriggerType = FLOW_TRIGGER_SAVE_TYPE.CREATE;
            }
        }
    }

    const requireChangedValues = startElement.doesRequireRecordChangedToMeetCriteria;
    const recordFilters = createRecordFilters(filters, object);

    return Object.assign(newStartElement, {
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
}

/**
 * Creates a start element object on opening any start element property editor
 * @param {Object} startElement start element object used to construct the new object
 * @returns {Object} startElement the new start element object
 */
export function createStartElementForPropertyEditor(startElement: StartUi = {} as StartUi) {
    const newStartElement = createStartElement(startElement);

    const triggerType = startElement.triggerType || FLOW_TRIGGER_TYPE.NONE;
    const { childReferences } = startElement;
    let timeTriggers: TimeTrigger[] = [];

    if (isRecordChangeTriggerType(triggerType)) {
        if (childReferences && childReferences.length > 0) {
            timeTriggers = childReferences.map((childReference) => {
                const timeTrigger = createTimeTrigger(getElementByGuid(childReference.childReference));
                return timeTrigger;
            });
        } else {
            // new trigger case
            const newTimeTrigger = createTimeTrigger(<TimeTrigger>{});
            timeTriggers = [newTimeTrigger];
        }
        return Object.assign(newStartElement, {
            timeTriggers
        });
    }
    return newStartElement;
}

/**
 * Create the start element object with connectors using either the startElement metadata object or the startElementReference metadata property
 * This is used during translation from metadata to the client side UI model.
 * @param {Object} startElement start element metadata object
 * @param {string} startElementReference guid/name of the first element in the flow
 * @returns {Object} startElement the start element object
 */
export function createStartElementWithConnectors(startElement: StartFlow = {} as StartFlow, startElementReference) {
    const newStartElement = createStartElement(startElement);

    let connectorCount, connectors;
    const { triggerType } = startElement;
    if (!isRecordChangeTriggerType(triggerType)) {
        // Creates a REGULAR connector from startElement
        connectors = startElementReference
            ? createStartElementConnector(newStartElement.guid, startElementReference)
            : createConnectorObjects(startElement, newStartElement.guid, undefined, false);
    } else {
        // Creates an IMMEDIATE connector from startElement (Therefore,immediateConnector is passed as true here)
        connectors = createConnectorObjects(startElement, newStartElement.guid, undefined, true);
        let childReferences: ChildReference[] = [],
            availableConnections: AvailableConnection[] = [],
            timeTriggers: TimeTrigger[] = [];
        const { scheduledPaths = [] } = startElement;

        for (let i = 0; i < scheduledPaths.length; i++) {
            const scheduledPath = scheduledPaths[i];
            const timeTrigger = createTimeTrigger(scheduledPath);
            const connector = createConnectorObjects(scheduledPath, timeTrigger.guid, newStartElement.guid);
            timeTriggers = [...timeTriggers, timeTrigger];
            // updating child references
            childReferences = updateChildReferences(childReferences, timeTrigger);
            availableConnections = addRegularConnectorToAvailableConnections(availableConnections, scheduledPath);
            // connector is an array. FIX it.
            connectors = [...connectors, ...connector];
        }
        availableConnections = addImmediateConnectorToAvailableConnections(availableConnections, startElement);
        connectorCount = connectors ? connectors.length : 0;

        Object.assign(newStartElement, {
            childReferences,
            elementType,
            connectorCount,
            maxConnections,
            availableConnections
        });
        return baseCanvasElementsArrayToMap([newStartElement, ...timeTriggers], connectors);
    }

    connectorCount = connectors ? connectors.length : 0;
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
    /* Commented code in this function will be checked in with this story:
    W-8188232: https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008ge9PIAQ/view
    */
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
        doesRequireRecordChangedToMeetCriteria,
        childReferences
    } = startElement;
    let { filterLogic } = startElement;
    let recordFilters;

    if (filters.length > 0 && filters[0].leftHandSide && filterLogic !== CONDITION_LOGIC.NO_CONDITIONS) {
        recordFilters = filters.map((filter) => createFilterMetadataObject(filter));
    } else {
        recordFilters = [];
        filterLogic = undefined;
    }

    let scheduledPaths;

    if (childReferences && childReferences.length > 0) {
        scheduledPaths = childReferences.map(({ childReference }) => {
            const timeTrigger = getElementByGuid(childReference);
            const metadataTimeTrigger = baseChildElementMetadataObject(timeTrigger, config);

            let recordField;
            const { offsetNumber } = timeTrigger;
            let { timeSource, offsetUnit } = timeTrigger;

            let offsetNumberAsNumber = Number(offsetNumber);

            if (offsetUnit === TIME_OPTION.HOURS_BEFORE) {
                offsetUnit = SCHEDULED_PATH_OFFSET_UNIT.HOURS;
                offsetNumberAsNumber *= -1;
            } else if (offsetUnit === TIME_OPTION.HOURS_AFTER) {
                offsetUnit = SCHEDULED_PATH_OFFSET_UNIT.HOURS;
            } else if (offsetUnit === TIME_OPTION.DAYS_BEFORE) {
                offsetUnit = SCHEDULED_PATH_OFFSET_UNIT.DAYS;
                offsetNumberAsNumber *= -1;
            } else if (offsetUnit === TIME_OPTION.DAYS_AFTER) {
                offsetUnit = SCHEDULED_PATH_OFFSET_UNIT.DAYS;
            }

            if (timeSource !== SCHEDULED_PATH_TIME_SOURCE_TYPE.RECORD_TRIGGER_EVENT) {
                recordField = timeSource;
                timeSource = SCHEDULED_PATH_TIME_SOURCE_TYPE.RECORD_FIELD;
            }

            return Object.assign(metadataTimeTrigger, {
                timeSource,
                offsetUnit,
                offsetNumber: offsetNumberAsNumber,
                recordField
            });
        });
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
        filters: recordFilters,
        scheduledPaths
    });
}

function getISOTimeFromMillis(timeinMillis) {
    const date = new Date(timeinMillis);
    // ISO Time is in this format: 2008-09-15T15:53:00Z, and we just care about the latter time portion minus the Z
    return date.toISOString().slice(0, -1).split('T')[1];
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

export function createTimeTrigger(timeTrigger: TimeTrigger): TimeTrigger {
    const newTimeTrigger: ChildElement = baseChildElement(timeTrigger, ELEMENT_TYPE.TIME_TRIGGER);

    const { recordField } = timeTrigger;

    let { timeSource = '', offsetUnit = '', offsetNumber = '' } = timeTrigger;

    // When converting from scheduledPath to timeTrigger
    if (offsetNumber !== '') {
        let offsetNumberAsNumber = Number(offsetNumber);
        if (offsetUnit === SCHEDULED_PATH_OFFSET_UNIT.HOURS) {
            if (offsetNumberAsNumber >= 0) {
                offsetUnit = TIME_OPTION.HOURS_AFTER;
            } else {
                offsetUnit = TIME_OPTION.HOURS_BEFORE;
                offsetNumberAsNumber *= -1;
            }
        } else if (offsetUnit === SCHEDULED_PATH_OFFSET_UNIT.DAYS) {
            if (offsetNumberAsNumber >= 0) {
                offsetUnit = TIME_OPTION.DAYS_AFTER;
            } else {
                offsetUnit = TIME_OPTION.DAYS_BEFORE;
                offsetNumberAsNumber *= -1;
            }
        }
        offsetNumber = offsetNumberAsNumber.toString();
    }

    if (timeSource === SCHEDULED_PATH_TIME_SOURCE_TYPE.RECORD_FIELD) {
        timeSource = recordField!;
    }

    return Object.assign(newTimeTrigger, {
        timeSource,
        offsetUnit,
        offsetNumber
    });
}

/**
 * Creates a start element object on closing of any start property editor / when a new flow is opened for the first time which goes to store
 * @param {Object} startElement start element object used to construct the new object
 * @returns {Object} which contains startElement, children and ALC params
 */
export function createStartElementWhenUpdatingFromPropertyEditor(startElement) {
    const newStartElement = createStartElement(startElement);

    // Start element is initialized here when flow trigger type is selected from new flow modal
    if (isRecordChangeTriggerType(startElement.triggerType)) {
        if (startElement.guid === undefined) {
            const timeTriggerProperties = {
                availableConnections: [
                    {
                        type: CONNECTOR_TYPE.IMMEDIATE
                    }
                ],
                childReferences: []
            };
            return Object.assign(newStartElement, timeTriggerProperties);
        }
    } else {
        return newStartElement;
    }

    const { timeTriggers = [] } = startElement;
    let childReferences: ChildReference[] = [];
    let newTimeTriggers: TimeTrigger[] = [];

    for (let i = 0; i < timeTriggers.length; i++) {
        const timeTrigger = timeTriggers[i];
        const newTimeTrigger = createTimeTrigger(timeTrigger);
        childReferences = updateChildReferences(childReferences, newTimeTrigger);
        newTimeTriggers = [...newTimeTriggers, newTimeTrigger];
    }

    maxConnections = newTimeTriggers.length + 1;
    const {
        newChildren,
        deletedCanvasElementChildren,
        deletedBranchHeadGuids
    } = getUpdatedChildrenAndDeletedChildrenUsingStore(startElement, newTimeTriggers);

    const deletedTimeTriggerGuids = deletedCanvasElementChildren.map((timeTrigger) => timeTrigger.guid);

    const originalStartElement = getElementByGuid(startElement.guid);

    const { connectorCount, availableConnections } = getConnectionProperties(
        originalStartElement,
        childReferences,
        deletedTimeTriggerGuids
    );
    /* This code will not be exercised till Time Triggers is supported for Auto-Layout (232)
    W-8179230 - https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008gWsnIAE/view
    */
    if (shouldUseAutoLayoutCanvas()) {
        Object.assign(newStartElement, {
            children: newChildren
        });
    }

    const elementSubtype = startElement.elementSubtype;
    Object.assign(newStartElement, {
        childReferences,
        elementType,
        maxConnections,
        connectorCount,
        availableConnections
    });

    return {
        canvasElement: newStartElement,
        /* This code will not be exercised till Time Triggers is supported for Auto-Layout (232)
        W-8179230 - https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008gWsnIAE/view
        */
        deletedChildElementGuids: deletedTimeTriggerGuids,
        childElements: newTimeTriggers,
        deletedBranchHeadGuids,
        //
        elementType: ELEMENT_TYPE.START_WITH_MODIFIED_AND_DELETED_TIME_TRIGGERS,
        elementSubtype
    };
}

function calculateMaxConnections(startElement) {
    if (!startElement) {
        throw new Error('Max connection cannot be calculated because startElement is not defined');
    }
    let length = 1;
    if (startElement.timeTriggers) {
        length = startElement.timeTriggers.length + 1;
    } else if (startElement.scheduledPaths) {
        length = startElement.scheduledPaths.length + 1;
    } else if (startElement.childReferences) {
        length = startElement.childReferences.length + 1;
    }
    return length;
}

function addImmediateConnectorToAvailableConnections(
    availableConnections: AvailableConnection[] = [],
    startElement: StartUi
) {
    if (!availableConnections || !startElement) {
        throw new Error('Either availableConnections or start Element is not defined');
    }
    const { connector } = startElement;
    if (!connector) {
        return [
            ...availableConnections,
            {
                type: CONNECTOR_TYPE.IMMEDIATE
            }
        ];
    }
    return availableConnections;
}
