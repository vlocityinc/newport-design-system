import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from './base/baseElement';
import {
    createStartElementConnector,
    createConnectorObjects
} from './connector';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import {
    createRecordFilters,
    createFilterMetadataObject
} from './base/baseRecordElement';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';

export const START_ELEMENT_LOCATION = {
    x: 50,
    y: 50
};
const maxConnections = 1;
const elementType = ELEMENT_TYPE.START_ELEMENT;

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
        triggerType,
        object = '',
        objectIndex = generateGuid(),
        filters = []
    } = startElement;
    const { startDate, startTime, frequency } =
        startElement.schedule || startElement;
    let { filterType } = startElement;

    if (!filterType) {
        // If filter type is not set (eg. when loading from metadata), we can infer that it is NONE if object is set but no filters are set.
        // For all other cases we default to ALL.
        if (object && filters.length === 0) {
            filterType = RECORD_FILTER_CRITERIA.NONE;
        } else {
            filterType = RECORD_FILTER_CRITERIA.ALL;
        }
    }
    const recordFilters =
        filterType === RECORD_FILTER_CRITERIA.ALL
            ? createRecordFilters(filters, object)
            : [];

    Object.assign(newStartElement, {
        elementType,
        locationX,
        locationY,
        maxConnections,
        triggerType,
        filterType,
        startDate,
        startTime:
            startTime && startTime.timeInMillis
                ? getISOTimeFromMillis(startTime.timeInMillis)
                : startTime,
        frequency,
        object,
        objectIndex,
        filters: recordFilters
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
export function createStartElementWithConnectors(
    startElement = {},
    startElementReference
) {
    const newStartElement = createStartElement(startElement);

    const connectors = startElementReference
        ? createStartElementConnector(
              newStartElement.guid,
              startElementReference
          )
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

    const startElementMetadata = baseCanvasElementMetadataObject(
        startElement,
        config
    );

    const {
        object,
        triggerType,
        startDate,
        startTime,
        frequency,
        filters = []
    } = startElement;

    const recordFilters =
        filters.length > 0 && filters[0].leftHandSide
            ? filters.map(filter => createFilterMetadataObject(filter))
            : [];
    const schedule =
        startDate && startTime && frequency
            ? { startDate, startTime, frequency }
            : undefined;

    return Object.assign(startElementMetadata, {
        label: undefined,
        name: undefined,
        description: undefined,
        triggerType: triggerType === '' ? undefined : triggerType,
        schedule,
        object: object === '' ? undefined : object,
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
