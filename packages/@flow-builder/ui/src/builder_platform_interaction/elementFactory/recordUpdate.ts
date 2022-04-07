// @ts-nocheck
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    CONDITION_LOGIC,
    CONNECTOR_TYPE,
    ELEMENT_TYPE,
    FLOW_TRIGGER_TYPE,
    RECORD_UPDATE_WAY_TO_FIND_RECORDS
} from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getStartObject, getTriggerType } from 'builder_platform_interaction/storeUtils';
import { SYSTEM_VARIABLE_RECORD_PREFIX } from 'builder_platform_interaction/systemVariableConstantsLib';
import { doesSupportTriggeringRecordUpdate } from 'builder_platform_interaction/triggerTypeLib';
import {
    baseCanvasElementsArrayToMap,
    baseCanvasElementWithFault,
    createAvailableConnection,
    duplicateCanvasElement
} from './base/baseElement';
import { createExpressionListRowItemWithoutOperator } from './base/baseList';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import {
    createFilterMetadataObject,
    createFlowInputFieldAssignment,
    createFlowInputFieldAssignmentMetadataObject,
    createRecordFilters,
    getDefaultAvailableConnections
} from './base/baseRecordElement';
import { createConnectorObjects } from './connector';

const elementType = ELEMENT_TYPE.RECORD_UPDATE;

/**
 * @param recordUpdate
 * @param triggerType
 * @param startObject
 */
export function createRecordUpdate(recordUpdate = {}, triggerType = getTriggerType(), startObject = getStartObject()) {
    const newRecordUpdate = baseCanvasElementWithFault(recordUpdate);
    const { inputReference = '', inputReferenceIndex = generateGuid(), objectIndex = generateGuid() } = recordUpdate;
    let {
        object = '',
        filterLogic = CONDITION_LOGIC.AND,
        filters,
        inputAssignments = [],
        availableConnections = getDefaultAvailableConnections(),
        wayToFindRecords
    } = recordUpdate;

    let { canHaveFaultConnector } = newRecordUpdate;

    let maxConnections = 2;
    if (triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE) {
        canHaveFaultConnector = false;
        maxConnections -= 1;
        availableConnections = [
            {
                type: CONNECTOR_TYPE.REGULAR
            }
        ];
    }

    availableConnections = availableConnections.map((availableConnection) =>
        createAvailableConnection(availableConnection)
    );

    // If wayToFindRecords haven't been set, which is true when we are translating from UDD
    if (!wayToFindRecords) {
        wayToFindRecords = setWayToFindRecords(
            wayToFindRecords,
            object,
            inputReference,
            triggerType,
            startObject,
            inputAssignments
        );
    }

    // Triggering record displays one empty assignment off the bat.
    if (inputAssignments.length === 0) {
        inputAssignments.push(createExpressionListRowItemWithoutOperator({}));
    } else {
        inputAssignments = inputAssignments.map((item) => createFlowInputFieldAssignment(item, object));
    }

    // TODO remove the dot or ADD $Record
    filters = createRecordFilters(filters, object);

    // Udd Metadata only has AND, OR and ADVANCED. NO_CONDITIONS on the backend is just AND with 0 filters.
    // TODO set filter logic to no_conditions when TRIGGERING_RECORD
    if (!filters[0].leftHandSide && filterLogic === CONDITION_LOGIC.AND) {
        filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
    }

    // handles incompatible switches between processTypes and triggerTypes.
    if (
        wayToFindRecords !== RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD &&
        triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE
    ) {
        // If triggerType is before save, only Triggering Record option is available.
        // If wayToFindRecords not already TRIGGERING_RECORD, need to do the following cleanup
        wayToFindRecords = RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD;

        // this value will be orphaned (not accessible), when opening the editor
        object = '';
    } else if (
        wayToFindRecords === RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD &&
        !doesSupportTriggeringRecordUpdate(triggerType)
    ) {
        // If triggerType is not record-change, TriggeringRecord option is not available.
        // inputReference is available when switching to sObjectReference, so no need to clean it up.
        wayToFindRecords = RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE;
    }

    return Object.assign(newRecordUpdate, {
        inputReference,
        inputReferenceIndex,
        maxConnections,
        availableConnections,
        elementType,
        inputAssignments,
        filters,
        filterLogic,
        canHaveFaultConnector,
        object,
        objectIndex,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
        wayToFindRecords
    });
}

/**
 * Function decides what option we need to set for RECORD_UPDATE_WAY_TO_FIND_RECORDS.
 *
 * @param wayToFindRecords
 * @param object
 * @param inputReference
 * @param triggerType
 * @param startObject
 * @param inputAssignments
 */
function setWayToFindRecords(wayToFindRecords, object, inputReference, triggerType, startObject, inputAssignments) {
    if (object !== '') {
        // When the object is set, we find records to update by "Specify conditions to identify records, and set fields individually."
        wayToFindRecords = RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP;
    } else if (
        inputReference !== '' &&
        inputReference === SYSTEM_VARIABLE_RECORD_PREFIX &&
        inputAssignments.length > 0
    ) {
        // inputReference is set to $Record, when wayToFindRecords is supposed to be "Update triggering <object name> Record"
        wayToFindRecords = RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD;
    } else if (inputReference === '' && startObject && doesSupportTriggeringRecordUpdate(triggerType)) {
        // inputReference is not set, triggerType is record-changed and object on startElement is set.
        wayToFindRecords = RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD;
    } else {
        // inputReference could be set to non $Record OR no values or set, then we should use "Use the IDs and all field values from Record or Record collection"
        wayToFindRecords = RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE;
    }

    return wayToFindRecords;
}

/**
 * @param recordUpdate
 * @param newGuid
 * @param newName
 */
export function createDuplicateRecordUpdate(recordUpdate, newGuid, newName) {
    const newRecordUpdate = createRecordUpdate(recordUpdate);
    Object.assign(newRecordUpdate, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateRecordUpdate = duplicateCanvasElement(newRecordUpdate, newGuid, newName);

    return duplicateRecordUpdate;
}

/**
 * @param recordUpdate
 * @param root0
 * @param root0.startElement
 */
export function createRecordUpdateWithConnectors(recordUpdate = {}, { startElement } = {}) {
    const { triggerType, object } = startElement;
    const newRecordUpdate = createRecordUpdate(recordUpdate, triggerType, object);

    const connectors = createConnectorObjects(recordUpdate, newRecordUpdate.guid);
    const availableConnections = removeFromAvailableConnections(getDefaultAvailableConnections(), connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const recordUpdateObject = Object.assign(newRecordUpdate, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordUpdateObject], connectors);
}

/**
 * @param recordUpdate
 * @param config
 */
export function createRecordUpdateMetadataObject(recordUpdate, config) {
    if (!recordUpdate) {
        throw new Error('recordUpdate is not defined');
    }

    const recordUpdateMetadata = baseCanvasElementMetadataObject(recordUpdate, config);
    const { object, wayToFindRecords } = recordUpdate;
    let { inputReference } = recordUpdate;

    if (wayToFindRecords === RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD) {
        inputReference = SYSTEM_VARIABLE_RECORD_PREFIX;
    }

    if (
        wayToFindRecords === RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP ||
        wayToFindRecords === RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD
    ) {
        let { filters = [], inputAssignments = [] } = recordUpdate;
        const { filterLogic } = recordUpdate;

        if (filterLogic === CONDITION_LOGIC.NO_CONDITIONS) {
            filters = [];
        } else {
            filters = filters.map((filter) => createFilterMetadataObject(filter));
        }

        inputAssignments = inputAssignments.map((input) => createFlowInputFieldAssignmentMetadataObject(input));

        return Object.assign(recordUpdateMetadata, {
            inputReference,
            filters,
            filterLogic: filterLogic === CONDITION_LOGIC.NO_CONDITIONS ? undefined : filterLogic,
            object,
            inputAssignments
        });
    }
    return Object.assign(recordUpdateMetadata, {
        inputReference
    });
}
