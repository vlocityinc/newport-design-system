import {
    ELEMENT_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    duplicateCanvasElement,
    createAvailableConnection
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { createRecordFilters,
    createFilterMetadataObject,
    createFlowOutputFieldAssignment,
    getDefaultAvailableConnections,
    createFlowOutputFieldAssignmentMetadataObject,
    createEmptyAssignmentMetadata} from './base/baseRecordElement';
import {
    RECORD_FILTER_CRITERIA,
    SORT_ORDER
} from 'builder_platform_interaction/recordEditorLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { NUMBER_RECORDS_TO_STORE } from "builder_platform_interaction/recordEditorLib";
import { getGlobalConstantOrSystemVariable } from "builder_platform_interaction/systemLib";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";

const elementType = ELEMENT_TYPE.RECORD_LOOKUP;
const maxConnections = 2;

/**
 * Build query field (see "queryFields" element property)
 * @param {(Object|string)} queriedField - query field about to be built
 * @param {string} queriedField.field - if not undefined contains the query field name (eg: "id")
 * @returns {Object} - query field built
 */
export const createQueriedField = queriedField => {
    // In Metadata the queried fields are stored as ['someField'...],
    // but in the store they are stored as [{field: 'someField', rowIndex: '1'}...]
    // const fieldName = queriedField.field !== undefined ? queriedField.field : queriedField;
    const {field = queriedField }  = queriedField;
    return {
        field,
        rowIndex: generateGuid()
    };
};

export function createRecordLookup(recordLookup = {}) {
    const newRecordLookup = baseCanvasElement(recordLookup);

    let { availableConnections = getDefaultAvailableConnections(), filters, queriedFields = [], outputAssignments = [],
        numberRecordsToStore = NUMBER_RECORDS_TO_STORE.FIRST_RECORD } = recordLookup;
    const {
        object = '',
        outputReference,
        assignNullValuesIfNoRecordsFound = false,
        sortOrder = SORT_ORDER.NOT_SORTED,
        sortField = ''
    } = recordLookup;

    availableConnections = availableConnections.map(availableConnection => createAvailableConnection(availableConnection));

    filters = createRecordFilters(filters, object);

    const filterType = filters[0].leftHandSide
        ? RECORD_FILTER_CRITERIA.ALL
        : RECORD_FILTER_CRITERIA.NONE;

    if (!outputReference) {
        outputAssignments = outputAssignments.map(item => createFlowOutputFieldAssignment(item, object, 'assignToReference'));

        return Object.assign(newRecordLookup, {
            object,
            outputAssignments,
            numberRecordsToStore,
            assignNullValuesIfNoRecordsFound,
            filterType,
            filters,
            queriedFields:[],
            sortOrder,
            sortField,
            maxConnections,
            availableConnections,
            elementType,
            outputReference,
            dataType: FLOW_DATA_TYPE.BOOLEAN.value,
        });
    }

    // When the builder is loaded the store does not yet contain the variables
    // numberRecordsToStore can only be calculated at the opening on the element
    const variable  = getElementByGuid(outputReference) || getGlobalConstantOrSystemVariable(outputReference);
    if (variable) {
        numberRecordsToStore = variable.dataType === FLOW_DATA_TYPE.SOBJECT.value && variable.isCollection ? NUMBER_RECORDS_TO_STORE.ALL_RECORDS : NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
    }

    if (queriedFields && queriedFields.length > 0) {
        queriedFields = queriedFields.map(queriedField => createQueriedField(queriedField));
    } else {
        // If creating new queried fields, there needs to be one for the ID field, and a new blank one
        queriedFields = ['Id', ''].map(queriedField => createQueriedField(queriedField));
    }

    return Object.assign(newRecordLookup, {
        object,
        outputReference,
        numberRecordsToStore,
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
}

export function createDuplicateRecordLookup(recordLookup, newGuid, newName) {
    const newRecordLookup = createRecordLookup(recordLookup);
    Object.assign(newRecordLookup, { availableConnections: getDefaultAvailableConnections() });
    const duplicateRecordLookup = duplicateCanvasElement(newRecordLookup, newGuid, newName);

    return duplicateRecordLookup;
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
        filterType,
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

    if (outputReference) {
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

    let { outputAssignments = [] } = recordLookup;
    outputAssignments = outputAssignments.map(output => createFlowOutputFieldAssignmentMetadataObject(output));

    outputAssignments = createEmptyAssignmentMetadata(outputAssignments);

    return Object.assign(recordUpdateMetadata, {
        object,
        outputAssignments,
        assignNullValuesIfNoRecordsFound,
        filters,
        queriedFields,
        sortOrder,
        sortField
    });
}
