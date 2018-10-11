import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    createAvailableConnection
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { createFilter, createFilterMetadataObject } from './base/baseRecordElement';
import {
    RECORD_FILTER_CRITERIA,
    SORT_ORDER
} from 'builder_platform_interaction/recordEditorLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const elementType = ELEMENT_TYPE.RECORD_LOOKUP;
const maxConnections = 2;
const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

export function createQueriedField(queriedField) {
    // In metadata the queried fields are stored as ['someField'...],
    // but in the store they are stored as [{field: 'someField', rowIndex: '1'}...]
    const field = queriedField.field || queriedField;
    return {
        field,
        rowIndex: generateGuid()
    };
}

export function createRecordLookup(recordLookup = {}) {
    const newRecordLookup = baseCanvasElement(recordLookup);

    let { availableConnections = getDefaultAvailableConnections(), filters, queriedFields = [] } = recordLookup;
    const {
        object = '',
        outputReference = '',
        assignNullValuesIfNoRecordsFound = false,
        sortOrder = SORT_ORDER.NOT_SORTED,
        sortField = ''
    } = recordLookup;

    availableConnections = availableConnections.map(availableConnection => createAvailableConnection(availableConnection));

    if (queriedFields && queriedFields.length > 0) {
        queriedFields = queriedFields.map(queriedField => createQueriedField(queriedField));
    } else {
        // If creating new queried fields, there needs to be one for the ID field, and a new blank one
        queriedFields = ['Id', ''].map(queriedField => createQueriedField(queriedField));
    }

    if (filters && filters.length > 0) {
        filters = filters.map(filter => createFilter(filter, object));
    } else {
        const newFilter = createFilter();
        filters = [newFilter];
    }
    const filterType = filters[0].leftHandSide
        ? RECORD_FILTER_CRITERIA.ALL
        : RECORD_FILTER_CRITERIA.NONE;

    const recordLookupObject = Object.assign(newRecordLookup, {
        object,
        outputReference,
        assignNullValuesIfNoRecordsFound,
        filterType,
        filters,
        queriedFields,
        sortOrder,
        sortField,
        maxConnections,
        availableConnections,
        elementType,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
    });

    return recordLookupObject;
}

export function createRecordLookupWithConnectors(recordLookup) {
    const newRecordLookup = createRecordLookup(recordLookup);

    const connectors = createConnectorObjects(
        recordLookup,
        newRecordLookup.guid
    );
    const availableConnections = removeFromAvailableConnections(
        getDefaultAvailableConnections(),
        connectors
    );
    const connectorCount = connectors ? connectors.length : 0;

    const recordLookupObject = Object.assign(newRecordLookup, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordLookupObject], connectors);
}

export function createRecordLookupMetadataObject(recordLookup, config) {
    if (!recordLookup) {
        throw new Error('recordLookup is not defined');
    }

    const recordUpdateMetadata = baseCanvasElementMetadataObject(
        recordLookup,
        config
    );
    const {
        object,
        outputReference,
        assignNullValuesIfNoRecordsFound = false,
        filterType
    } = recordLookup;

    let { sortOrder, sortField, filters = [], queriedFields = [] } = recordLookup;
    if (filterType === RECORD_FILTER_CRITERIA.NONE) {
        filters = [];
    } else {
        filters = filters.map(filter => createFilterMetadataObject(filter));
    }
    queriedFields = queriedFields
        .filter(queriedField => queriedField.field !== '')
        .map(queriedField => {
            return queriedField.field;
        });

    if (sortOrder === SORT_ORDER.NOT_SORTED) {
        sortOrder = undefined;
        sortField = undefined;
    }

    return Object.assign(recordUpdateMetadata, {
        object,
        outputReference,
        assignNullValuesIfNoRecordsFound,
        filters,
        queriedFields,
        sortOrder,
        sortField
    });
}
