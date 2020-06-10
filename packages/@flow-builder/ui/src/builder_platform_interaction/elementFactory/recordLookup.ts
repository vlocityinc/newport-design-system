// @ts-nocheck
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    createPastedCanvasElement,
    duplicateCanvasElement,
    createAvailableConnection,
    automaticOutputHandlingSupport,
    INCOMPLETE_ELEMENT
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import {
    createRecordFilters,
    createFilterMetadataObject,
    createFlowOutputFieldAssignment,
    getDefaultAvailableConnections,
    createFlowOutputFieldAssignmentMetadataObject,
    createEmptyAssignmentMetadata
} from './base/baseRecordElement';
import { SORT_ORDER, VARIABLE_AND_FIELD_MAPPING_VALUES } from 'builder_platform_interaction/recordEditorLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getGlobalConstantOrSystemVariable } from 'builder_platform_interaction/systemLib';
import { getElementByGuidFromState, getElementByDevNameFromState } from 'builder_platform_interaction/storeUtils';
import { Store } from 'builder_platform_interaction/storeLib';

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
    const { field = queriedField } = queriedField;
    return {
        field,
        rowIndex: generateGuid()
    };
};

export function createRecordLookup(recordLookup = {}, { elements } = Store.getStore().getCurrentState()) {
    let newRecordLookup;
    if (recordLookup.storeOutputAutomatically) {
        newRecordLookup = createRecordLookupWithAutomaticOutputHandling(recordLookup);
    } else if (recordLookup.outputReference) {
        newRecordLookup = createRecordLookupWithOuputReference(recordLookup, { elements });
    } else {
        newRecordLookup = createRecordLookupWithVariableAssignments(recordLookup);
    }
    return newRecordLookup;
}

function createRecordLookupWithOuputReference(recordLookup = {}, { elements } = Store.getStore().getCurrentState()) {
    const newRecordLookup = baseCanvasElement(recordLookup);

    let {
        availableConnections = getDefaultAvailableConnections(),
        filterLogic = CONDITION_LOGIC.AND,
        filters,
        queriedFields = [],
        getFirstRecordOnly = true
    } = recordLookup;
    const {
        object = '',
        objectIndex = generateGuid(),
        outputReference,
        outputReferenceIndex = generateGuid(),
        assignNullValuesIfNoRecordsFound = false,
        sortOrder = SORT_ORDER.NOT_SORTED,
        sortField = ''
    } = recordLookup;

    availableConnections = availableConnections.map(availableConnection =>
        createAvailableConnection(availableConnection)
    );

    filters = createRecordFilters(filters, object);

    // For the existing element if no filters has been set we need to assign No Conditions to the filterLogic.
    if (object !== '' && !filters[0].leftHandSide && filterLogic === CONDITION_LOGIC.AND) {
        filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
    }

    let complete = true;

    // When the flow is loaded, this factory is called twice. In the first phase, elements is empty. In the second phase, elements contain variables and
    // we can calculate getFirstRecordOnly
    const variable =
        getElementByGuidFromState({ elements }, outputReference) ||
        getElementByDevNameFromState({ elements }, outputReference) ||
        getGlobalConstantOrSystemVariable(outputReference);
    if (variable) {
        getFirstRecordOnly = !(variable.dataType === FLOW_DATA_TYPE.SOBJECT.value && variable.isCollection);
    } else {
        complete = false;
    }

    if (queriedFields && queriedFields.length > 0) {
        queriedFields = queriedFields.map(queriedField => createQueriedField(queriedField));
    } else {
        // If creating new queried fields, there needs to be one for the ID field, and a new blank one
        queriedFields = ['Id', ''].map(queriedField => createQueriedField(queriedField));
    }
    return Object.assign(
        newRecordLookup,
        {
            object,
            objectIndex,
            outputReference,
            assignNullValuesIfNoRecordsFound,
            filterLogic,
            filters,
            queriedFields,
            sortOrder,
            sortField,
            maxConnections,
            availableConnections,
            elementType,
            outputReferenceIndex,
            dataType: FLOW_DATA_TYPE.BOOLEAN.value,
            storeOutputAutomatically: false,
            getFirstRecordOnly,
            variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
        },
        complete ? {} : { [INCOMPLETE_ELEMENT]: true }
    );
}

function createRecordLookupWithVariableAssignments(recordLookup = {}) {
    const newRecordLookup = baseCanvasElement(recordLookup);

    let {
        availableConnections = getDefaultAvailableConnections(),
        filterLogic = CONDITION_LOGIC.AND,
        filters,
        outputAssignments = []
    } = recordLookup;
    const {
        object = '',
        objectIndex = generateGuid(),
        outputReferenceIndex = generateGuid(),
        assignNullValuesIfNoRecordsFound = false,
        sortOrder = SORT_ORDER.NOT_SORTED,
        sortField = ''
    } = recordLookup;

    availableConnections = availableConnections.map(availableConnection =>
        createAvailableConnection(availableConnection)
    );

    filters = createRecordFilters(filters, object);

    // For the existing element if no filters has been set we need to assign No Conditions to the filterLogic.
    if (object !== '' && !filters[0].leftHandSide && filterLogic === CONDITION_LOGIC.AND) {
        filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
    }

    outputAssignments = outputAssignments.map(item =>
        createFlowOutputFieldAssignment(item, object, 'assignToReference')
    );

    return Object.assign(newRecordLookup, {
        object,
        objectIndex,
        outputAssignments,
        assignNullValuesIfNoRecordsFound,
        filterLogic,
        filters,
        queriedFields: [],
        sortOrder,
        sortField,
        maxConnections,
        availableConnections,
        elementType,
        outputReference: undefined,
        outputReferenceIndex,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
        storeOutputAutomatically: false,
        getFirstRecordOnly: true,
        variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
    });
}

function createRecordLookupWithAutomaticOutputHandling(recordLookup = {}) {
    const newRecordLookup = baseCanvasElement(recordLookup);

    let {
        availableConnections = getDefaultAvailableConnections(),
        filterLogic = CONDITION_LOGIC.AND,
        filters,
        queriedFields = null,
        variableAndFieldMapping = VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC
    } = recordLookup;
    const {
        object = '',
        objectIndex = generateGuid(),
        sortOrder = SORT_ORDER.NOT_SORTED,
        sortField = '',
        outputReferenceIndex = generateGuid(),
        getFirstRecordOnly = true
    } = recordLookup;

    availableConnections = availableConnections.map(availableConnection =>
        createAvailableConnection(availableConnection)
    );

    filters = createRecordFilters(filters, object);

    // For the existing element if no filters has been set we need to assign No Conditions to the filterLogic.
    if (object !== '' && !filters[0].leftHandSide && filterLogic === CONDITION_LOGIC.AND) {
        filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
    }

    // if queriedFields.length is 0 it means the user selected automatic version.
    // the flow has been saved with queriedFields = null but the serialization create an empty array
    if (queriedFields && queriedFields.length > 0) {
        if (queriedFields.length === 1) {
            // If creating new queried fields or only one field is selected, there needs to be one for the ID field, and a new blank one
            queriedFields = ['Id', ''];
        }
        queriedFields = queriedFields.map(queriedField => createQueriedField(queriedField));
        variableAndFieldMapping = VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS;
    } else {
        queriedFields = null;
    }

    return Object.assign(newRecordLookup, {
        object,
        objectIndex,
        filterLogic,
        filters,
        queriedFields,
        sortOrder,
        sortField,
        maxConnections,
        availableConnections,
        elementType,
        outputReference: undefined,
        outputReferenceIndex,
        dataType: FLOW_DATA_TYPE.SOBJECT.value,
        isCollection: !getFirstRecordOnly,
        subtype: object,
        storeOutputAutomatically: true,
        getFirstRecordOnly,
        variableAndFieldMapping
    });
}

export function createPastedRecordLookup({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    prev,
    next,
    parent,
    childIndex
}) {
    const { duplicatedElement } = createDuplicateRecordLookup(canvasElementToPaste, newGuid, newName);

    const pastedCanvasElement = createPastedCanvasElement(
        duplicatedElement,
        canvasElementGuidMap,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        prev,
        next,
        parent,
        childIndex
    );

    return {
        pastedCanvasElement
    };
}

export function createDuplicateRecordLookup(recordLookup, newGuid, newName) {
    const newRecordLookup = createRecordLookup(recordLookup);
    Object.assign(newRecordLookup, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateRecordLookup = duplicateCanvasElement(newRecordLookup, newGuid, newName);

    return duplicateRecordLookup;
}

export function createRecordLookupWithConnectors(recordLookup, { elements } = Store.getStore().getCurrentState()) {
    const newRecordLookup = createRecordLookup(recordLookup, { elements });

    const connectors = createConnectorObjects(recordLookup, newRecordLookup.guid);
    const availableConnections = removeFromAvailableConnections(getDefaultAvailableConnections(), connectors);
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

    const recordUpdateMetadata = baseCanvasElementMetadataObject(recordLookup, config);
    const {
        object,
        outputReference,
        assignNullValuesIfNoRecordsFound = false,
        filterLogic,
        storeOutputAutomatically,
        getFirstRecordOnly,
        variableAndFieldMapping
    } = recordLookup;

    let { sortOrder, sortField, filters = [], queriedFields = [] } = recordLookup;
    if (filterLogic === CONDITION_LOGIC.NO_CONDITIONS) {
        filters = [];
    } else {
        filters = filters.map(filter => createFilterMetadataObject(filter));
    }

    if (queriedFields) {
        queriedFields = queriedFields
            .filter(queriedField => queriedField.field !== '')
            .map(queriedField => queriedField.field);
    }

    if (sortOrder === SORT_ORDER.NOT_SORTED) {
        sortOrder = undefined;
        sortField = undefined;
    }

    if (storeOutputAutomatically && automaticOutputHandlingSupport()) {
        if (variableAndFieldMapping === VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC) {
            Object.assign(recordUpdateMetadata, {
                object,
                filterLogic: filterLogic === CONDITION_LOGIC.NO_CONDITIONS ? undefined : filterLogic,
                filters,
                sortOrder,
                queriedFields,
                sortField,
                storeOutputAutomatically,
                getFirstRecordOnly
            });
        } else {
            Object.assign(recordUpdateMetadata, {
                object,
                filterLogic: filterLogic === CONDITION_LOGIC.NO_CONDITIONS ? undefined : filterLogic,
                filters,
                queriedFields,
                sortOrder,
                sortField,
                storeOutputAutomatically,
                getFirstRecordOnly
            });
        }
    } else if (storeOutputAutomatically && !automaticOutputHandlingSupport()) {
        Object.assign(recordUpdateMetadata, {
            object,
            outputReference: null,
            assignNullValuesIfNoRecordsFound,
            filterLogic: filterLogic === CONDITION_LOGIC.NO_CONDITIONS ? undefined : filterLogic,
            filters,
            queriedFields,
            sortOrder,
            sortField,
            getFirstRecordOnly
        });
    } else if (outputReference) {
        Object.assign(recordUpdateMetadata, {
            object,
            outputReference,
            assignNullValuesIfNoRecordsFound,
            filterLogic: filterLogic === CONDITION_LOGIC.NO_CONDITIONS ? undefined : filterLogic,
            filters,
            queriedFields,
            sortOrder,
            sortField
        });
    } else {
        let { outputAssignments = [] } = recordLookup;
        outputAssignments = outputAssignments.map(output => createFlowOutputFieldAssignmentMetadataObject(output));

        outputAssignments = createEmptyAssignmentMetadata(outputAssignments);

        Object.assign(recordUpdateMetadata, {
            object,
            outputAssignments,
            assignNullValuesIfNoRecordsFound,
            filterLogic: filterLogic === CONDITION_LOGIC.NO_CONDITIONS ? undefined : filterLogic,
            filters,
            queriedFields,
            sortOrder,
            sortField
        });
    }
    return recordUpdateMetadata;
}
