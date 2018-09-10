import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction-flow-metadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/base-element';
import { baseCanvasElementMetadataObject } from './base/base-metadata';
import { createConnectorObjects } from './connector';
import { createFilter, createFilterMetadataObject } from './recordFilter';
import {
    RECORD_FILTER_CRITERIA,
    SORT_ORDER
} from 'builder_platform_interaction-record-editor-lib';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { removeFromAvailableConnections } from 'builder_platform_interaction-connector-utils';

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
    return {
        field: queriedField,
        rowIndex: generateGuid()
    };
}

export function createRecordLookup(recordLookup = {}) {
    const newRecordLookup = baseCanvasElement(recordLookup);

    let { filters, queriedFields = [] } = recordLookup;
    const {
        object = '',
        outputReference = '',
        assignNullValuesIfNoRecordsFound = false,
        sortOrder = SORT_ORDER.NOT_SORTED,
        sortField = '',
        availableConnections = getDefaultAvailableConnections()
    } = recordLookup;

    // If no queried fields defined, or if queried fields are not in the object shape the store expects
    if (queriedFields.length === 0 || !queriedFields[0].hasOwnProperty('field')) {
        // push 'Id' as a mandatory field
        if (!queriedFields.includes('Id')) {
            queriedFields.push('Id');
        }
        // create at least one empty row in queriedFields besides 'Id'
        if (queriedFields.length === 1) {
            queriedFields.push('');
        }
        queriedFields = queriedFields.map(queriedField =>
            createQueriedField(queriedField)
        );
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
        elementType
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
        assignNullValuesIfNoRecordsFound = false
    } = recordLookup;

    let { sortOrder, sortField, filters = [], queriedFields = [] } = recordLookup;
    filters = filters.map(filter => createFilterMetadataObject(filter));
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
