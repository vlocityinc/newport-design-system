import { ELEMENT_TYPE, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from "./base/baseElement";
import { baseCanvasElementMetadataObject } from "./base/baseMetadata";
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from "builder_platform_interaction/connectorUtils";
import { NUMBER_RECORDS_TO_STORE,
    RECORD_FILTER_CRITERIA } from "builder_platform_interaction/recordEditorLib";
import { createFilter, createFilterMetadataObject, createFlowInputFieldAssignmentMetadataObject, createFlowInputFieldAssignment  } from './base/baseRecordElement';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const elementType = ELEMENT_TYPE.RECORD_UPDATE;
const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

/*
 * return the selected way to store the variables.
 * the default value is SOBJECT_VARIABLE
 */
function getNumberRecordsToStore(inputReference, object) {
    return inputReference !== '' || object === '' ? NUMBER_RECORDS_TO_STORE.FIRST_RECORD : NUMBER_RECORDS_TO_STORE.ALL_RECORDS;
}

export function createRecordUpdate(recordUpdate = {}) {
    const newRecordUpdate = baseCanvasElement(recordUpdate);
    const { inputReference = '', availableConnections = getDefaultAvailableConnections(), object = '' } = recordUpdate;
    let { filters, inputAssignments = []} = recordUpdate;

    inputAssignments = inputAssignments.map(item => createFlowInputFieldAssignment(item, object));

    const numberRecordsToStore = getNumberRecordsToStore(inputReference, object);

    if (filters && filters.length > 0) {
        filters = filters.map(filter => createFilter(filter, object));
    } else {
        const newFilter = createFilter();
        filters = [newFilter];
    }

    const filterType = filters[0].leftHandSide
    ? RECORD_FILTER_CRITERIA.ALL
    : RECORD_FILTER_CRITERIA.NONE;

    const recordUpdateObject = Object.assign(newRecordUpdate, {
        inputReference,
        maxConnections,
        availableConnections,
        elementType,
        inputAssignments,
        numberRecordsToStore,
        filters,
        filterType,
        object,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
    });

    return recordUpdateObject;
}

export function createRecordUpdateWithConnectors(recordUpdate = {}) {
    const newRecordUpdate = createRecordUpdate(recordUpdate);

    const connectors = createConnectorObjects(
        recordUpdate,
        newRecordUpdate.guid
    );
    const availableConnections = removeFromAvailableConnections(getDefaultAvailableConnections(), connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const recordUpdateObject = Object.assign(newRecordUpdate, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordUpdateObject], connectors);
}

export function createRecordUpdateMetadataObject(recordUpdate, config) {
    if (!recordUpdate) {
        throw new Error('recordUpdate is not defined');
    }

    const recordUpdateMetadata = baseCanvasElementMetadataObject(recordUpdate, config);
    const { inputReference, filterType, object, numberRecordsToStore } = recordUpdate;

    if (numberRecordsToStore === NUMBER_RECORDS_TO_STORE.ALL_RECORDS) {
        let { filters = [], inputAssignments = [] } = recordUpdate;
        if (filterType === RECORD_FILTER_CRITERIA.NONE) {
            filters = [];
        } else {
            filters = filters.map(filter => createFilterMetadataObject(filter));
        }

        inputAssignments = inputAssignments.map(input => createFlowInputFieldAssignmentMetadataObject(input));

        return Object.assign(recordUpdateMetadata, {
            filters,
            object,
            inputAssignments
        });
    }

    return Object.assign(recordUpdateMetadata, {
        inputReference
    });
}
