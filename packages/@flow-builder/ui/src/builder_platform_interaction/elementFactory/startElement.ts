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
    getDeletedCanvasElementChildren,
    updateChildReferences
} from './base/baseElement';
import { createStartElementConnector, createConnectorObjects } from './connector';
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from './base/baseMetadata';
import { createRecordFilters, createFilterMetadataObject } from './base/baseRecordElement';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { SYSTEM_VARIABLE_RECORD_PREFIX } from 'builder_platform_interaction/systemLib';
import { isScheduledTriggerType, isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import { formatDateTimeUTC, getDayOfTheWeek } from 'builder_platform_interaction/dateTimeUtils';
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { isScheduledPathSupported } from 'builder_platform_interaction/processTypeLib';
import { getElementByGuid, getProcessType } from 'builder_platform_interaction/storeUtils';
import {
    getConnectionProperties,
    addRegularConnectorToAvailableConnections
} from './commonFactoryUtils/connectionPropertiesUtils';
import { LABELS } from './elementFactoryLabels';

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
export function findStartYOffset(startElement: UI.Start): number {
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
 * Helper function to figure out if time triggers are supported or not.
 * Time Triggers are only supported in the following scenarios when an object is defined:
 * 1) For After_Save trigger type:
 *      a) Create - Time Triggers are always available
 *      b) Update/CreateAndUpdate - Time Triggers are only available when
 *          doesRequireRecordChangedToMeetCriteria is true and filters are defined
 * 2) Process type is autolaunched
 * @param startElement start element metadata structure
 */
export function shouldSupportTimeTriggers(startElement: UI.Start | Metadata.Start) {
    // TODO: W-8882792 Duplicated the method in rendering layer form ui layer. Find a better way to do this.
    // The need for the process type check is to ensure that scheduled paths are not rendered for process type
    // othe rthan autolaunched.
    // A cleaner way to perform this check is to update process type utils method
    // to use the feature-processType check.
    // Refer W-8931057 [Scheduled Paths] Scheduled Path errors are not linked on the builder
    const schedulePathSupported = getProcessType() === null ? true : isScheduledPathSupported(getProcessType());
    return (
        schedulePathSupported &&
        startElement.triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE &&
        startElement.object &&
        (startElement.recordTriggerType === FLOW_TRIGGER_SAVE_TYPE.CREATE ||
            (startElement.doesRequireRecordChangedToMeetCriteria &&
                startElement.filterLogic !== CONDITION_LOGIC.NO_CONDITIONS))
    );
}

/**
 * Creates a start element object
 * @param {Object} startElement start element object used to construct the new object
 * @returns {Object} startElement the new start element object
 */
export function createStartElement(startElement: UI.Start | Metadata.Start) {
    const newStartElement: UI.Start = <UI.Start>baseCanvasElement(startElement);
    const {
        locationX = START_ELEMENT_LOCATION.x,
        locationY = START_ELEMENT_LOCATION.y,
        object = '',
        filters = []
    } = startElement;
    const { objectIndex = generateGuid(), objectContainer } = <UI.Start>startElement;
    const maxConnections = calculateMaxConnections(startElement);
    const triggerType = startElement.triggerType || FLOW_TRIGGER_TYPE.NONE;
    const { startDate, startTime } = (startElement as Metadata.Start).schedule || startElement;
    let { recordTriggerType, frequency } = (startElement as Metadata.Start).schedule || startElement;
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
        // used to mark $Record.field as system variable
        haveSystemVariableFields: object ? true : undefined,
        dataType: object ? FLOW_DATA_TYPE.SOBJECT.value : undefined,
        subtype: object ? object : undefined,
        isCollection: object ? false : undefined,
        isAssignable: object ? true : undefined,
        doesRequireRecordChangedToMeetCriteria: requireChangedValues,
        childReferences: (<UI.Start>startElement).childReferences || [],
        availableConnections: (<UI.Start>startElement).availableConnections || [{ type: CONNECTOR_TYPE.REGULAR }]
    });
}

/**
 * Creates a start element object on opening any start element property editor
 * @param {Object} startElement start element object used to construct the new object
 * @returns {Object} startElement the new start element object
 */
export function createStartElementForPropertyEditor(startElement: UI.Start = {} as UI.Start) {
    const newStartElement = createStartElement(startElement);

    const triggerType = startElement.triggerType || FLOW_TRIGGER_TYPE.NONE;
    const { childReferences } = startElement;
    let timeTriggers: UI.TimeTrigger[] = [];

    if (isRecordChangeTriggerType(triggerType)) {
        if (childReferences && childReferences.length > 0) {
            timeTriggers = childReferences.map((childReference) => {
                const timeTrigger = createTimeTrigger(
                    getElementByGuid(childReference.childReference) as UI.TimeTrigger
                );
                return timeTrigger;
            });
        } else {
            // new trigger case
            const newTimeTrigger = createTimeTrigger(<UI.TimeTrigger>{});
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
export function createStartElementWithConnectors(
    startElement: Metadata.Start = {} as Metadata.Start,
    startElementReference
) {
    const newStartElement = createStartElement(startElement);

    let connectorCount, connectors;
    let availableConnections: UI.AvailableConnection[] = [];
    if (!shouldSupportTimeTriggers(startElement)) {
        // Creates a REGULAR connector or pushes one into the availableConnections if needed
        connectors = startElementReference
            ? createStartElementConnector(newStartElement.guid, startElementReference)
            : createConnectorObjects(startElement, newStartElement.guid, undefined, false);
        availableConnections = addStartElementConnectorToAvailableConnections(
            availableConnections,
            startElement,
            CONNECTOR_TYPE.REGULAR
        );
    } else {
        // Creates an IMMEDIATE connector (Therefore,immediateConnector is passed as true here)
        connectors = createConnectorObjects(startElement, newStartElement.guid, undefined, true);
        let childReferences: UI.ChildReference[] = [],
            timeTriggers: UI.TimeTrigger[] = [];
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

        // Pushes an Immediate connector into availableConnections if needed
        availableConnections = addStartElementConnectorToAvailableConnections(
            availableConnections,
            startElement,
            CONNECTOR_TYPE.IMMEDIATE
        );
        connectorCount = connectors ? connectors.length : 0;

        Object.assign(newStartElement, {
            childReferences,
            elementType,
            connectorCount,
            availableConnections,
            defaultConnectorLabel: LABELS.immediateConnectorLabel
        });
        return baseCanvasElementsArrayToMap([newStartElement, ...timeTriggers], connectors);
    }

    connectorCount = connectors ? connectors.length : 0;
    Object.assign(newStartElement, { connectorCount, availableConnections });
    return baseCanvasElementsArrayToMap([newStartElement], connectors);
}

/**
 * Create a start element Flow metadata object
 * @param {Object} startElement the start element client side object used to construct the metadata object
 * @param {Object} config configuration used to translate to the metadata object
 * @returns {Object} startElementMetadata the start element metadata object
 */
export function createStartElementMetadataObject(startElement: UI.Start, config = {}) {
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
        childReferences
    } = startElement;
    let { doesRequireRecordChangedToMeetCriteria, filterLogic } = startElement;
    let recordFilters;

    if (filters.length > 0 && filters[0].leftHandSide && filterLogic !== CONDITION_LOGIC.NO_CONDITIONS) {
        recordFilters = filters.map((filter) => createFilterMetadataObject(filter));
    } else {
        recordFilters = [];
        filterLogic = undefined;
        doesRequireRecordChangedToMeetCriteria = false;
    }

    let scheduledPaths;

    if (childReferences && childReferences.length > 0) {
        scheduledPaths = childReferences.map(({ childReference }) => {
            const timeTrigger: UI.TimeTrigger = getElementByGuid(childReference) as UI.TimeTrigger;
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

export function createTimeTrigger(timeTrigger: UI.TimeTrigger | Metadata.ScheduledPath): UI.TimeTrigger {
    const newTimeTrigger: UI.ChildElement = baseChildElement(timeTrigger, ELEMENT_TYPE.TIME_TRIGGER);

    const { recordField } = <Metadata.ScheduledPath>timeTrigger;

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
    let newStartElement = createStartElement(startElement);

    if (!shouldSupportTimeTriggers(startElement)) {
        // When updating to a start element that doesn't support time triggers, replacing the Immediate available connector
        // with a Regular one
        const updatedAvailableConnections = newStartElement.availableConnections.map((availableConnection) => {
            return availableConnection.type === CONNECTOR_TYPE.IMMEDIATE
                ? { type: CONNECTOR_TYPE.REGULAR }
                : availableConnection;
        });

        newStartElement = Object.assign(newStartElement, {
            availableConnections: updatedAvailableConnections
        });

        return {
            canvasElement: newStartElement,
            elementType: ELEMENT_TYPE.START_WITH_MODIFIED_AND_DELETED_TIME_TRIGGERS,
            shouldSupportTimeTriggers: shouldSupportTimeTriggers(newStartElement),
            startElementGuid: newStartElement.guid
        };
    }

    const { timeTriggers = [] } = startElement;
    let childReferences: UI.ChildReference[] = [];
    let newTimeTriggers: UI.TimeTrigger[] = [];

    for (let i = 0; i < timeTriggers.length; i++) {
        const timeTrigger = timeTriggers[i];
        if (timeTrigger.name) {
            const newTimeTrigger = createTimeTrigger(timeTrigger);
            childReferences = updateChildReferences(childReferences, newTimeTrigger);
            newTimeTriggers = [...newTimeTriggers, newTimeTrigger];
        }
    }

    const deletedCanvasElementChildren = getDeletedCanvasElementChildren(startElement, newTimeTriggers);

    const deletedTimeTriggerGuids = deletedCanvasElementChildren.map((timeTrigger) => timeTrigger.guid);

    const { defaultConnectorLabel = LABELS.immediateConnectorLabel } = startElement;

    const originalStartElement = getElementByGuid(startElement.guid);

    const { connectorCount, availableConnections } = getConnectionProperties(
        originalStartElement,
        childReferences,
        deletedTimeTriggerGuids
    );

    const elementSubtype = startElement.elementSubtype;
    Object.assign(newStartElement, {
        childReferences,
        elementType,
        connectorCount,
        availableConnections,
        defaultConnectorLabel
    });

    return {
        canvasElement: newStartElement,
        /* This code will not be exercised till Time Triggers is supported for Auto-Layout (232)
        W-8179230 - https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008gWsnIAE/view
        */
        deletedChildElementGuids: deletedTimeTriggerGuids,
        childElements: newTimeTriggers,
        elementType: ELEMENT_TYPE.START_WITH_MODIFIED_AND_DELETED_TIME_TRIGGERS,
        elementSubtype,
        shouldSupportTimeTriggers: shouldSupportTimeTriggers(newStartElement as UI.Start),
        startElementGuid: newStartElement.guid
    };
}

function calculateMaxConnections(startElement) {
    if (!startElement) {
        throw new Error('Max connection cannot be calculated because startElement is not defined');
    }
    let length = 1;
    if (startElement.timeTriggers) {
        // Only including defined time triggers for maxConnections calculation
        for (let i = 0; i < startElement.timeTriggers.length; i++) {
            if (startElement.timeTriggers[i].name) {
                length++;
            }
        }
    } else if (startElement.scheduledPaths) {
        length = startElement.scheduledPaths.length + 1;
    } else if (startElement.childReferences) {
        length = startElement.childReferences.length + 1;
    }
    return length;
}

function addStartElementConnectorToAvailableConnections(
    availableConnections: UI.AvailableConnection[] = [],
    startElement: Metadata.Start,
    type: UI.ConnectorType
) {
    if (!availableConnections || !startElement) {
        throw new Error('Either availableConnections or start Element is not defined');
    }
    const { connector } = startElement;
    if (!connector) {
        return [
            ...availableConnections,
            {
                type
            }
        ];
    }
    return availableConnections;
}
