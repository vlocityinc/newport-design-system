import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { createNewConnector } from 'builder_platform_interaction/connectorUtils';
import { generateGuid, deepCopy } from 'builder_platform_interaction/storeLib';
import { pick } from 'builder_platform_interaction/dataMutationLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { convertToAutoLayoutCanvas, ConvertToAutoLayoutCanvasOptions } from './freeFormToAutoLayout';
import { convertToFreeFormCanvas } from './autoLayoutToFreeForm';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';

const { logInteraction, logMetricsServiceErrorTransaction } = loggingUtils;

const CONVERT_TO_FREE_FORM_FAILED = 'Convert to free form canvas failed';
const CONVERT_TO_AUTO_LAYOUT_FAILED = 'Convert to auto layout canvas failed';
/**
 * Generates end connectors for a Free Form Canvas UI Model.
 * Generates end connectors for the available connections of each canvas element
 *
 * @param storeState - The FFC UI Model
 * @param elements
 * @returns The generated end connectorss
 */
function generateEndConnectors(elements: UI.Elements): UI.Connector[] {
    const endConnectors: UI.Connector[] = [];

    Object.values(elements).forEach((element) => {
        if (element.isCanvasElement) {
            const canvasElement = element as UI.CanvasElement;
            if (canvasElement.availableConnections != null) {
                // for elements that support multiple "out" connectors

                canvasElement.availableConnections.forEach(({ childReference, type }, i) => {
                    // don't create end connectors for missing faults or loop next
                    if (type !== CONNECTOR_TYPE.FAULT && type !== CONNECTOR_TYPE.LOOP_NEXT) {
                        const connector = createNewConnector(
                            elements,
                            element.guid,
                            // @ts-ignore
                            generateGuid(element.guid, i),
                            type
                        );
                        if (childReference != null) {
                            connector.childSource = childReference;
                            connector.label = elements[childReference].label || null;
                        }
                        endConnectors.push(connector);
                    }
                });
            } else if (canvasElement.connectorCount === 0) {
                // for elements that support only one "out" connector
                endConnectors.push(
                    // @ts-ignore
                    createNewConnector(elements, element.guid, generateGuid(element.guid), CONNECTOR_TYPE.REGULAR)
                );
            }
        }
    });

    return endConnectors;
}

// element props to pick when normalizing
const elementProps = [
    'guid',
    'connectorCount',
    'elementType',
    'maxConnections',
    'childReferences',
    'availableConnections',
    'isCanvasElement',
    'elementType'
];

const autoLayoutElementProps = [
    'guid',
    'prev',
    'next',
    'children',
    'parent',
    'incomingGoTo',
    'childIndex',
    'isTerminal',
    'elementType'
];

// connector props to pick when normalizing
const connectorProps = ['guid', 'source', 'target', 'childSource', 'type'];

// comparator function to sort elements by guids
const guidCompare = (obj1, obj2) => (obj1.guid >= obj2.guid ? 1 : -1);

/**
 * Normalizes store elements
 *
 * @param elements - The elements
 * @param isAutoLayout
 * @returns the normalized elements
 */
function normalizeElements(elements: Record<string, UI.Element>, isAutoLayout = false) {
    const props = isAutoLayout ? autoLayoutElementProps : elementProps;
    return Object.values(deepCopy(elements))
        .map((ele: any) => pick(ele, props as any))
        .filter((ele: any) => ele.elementType !== ELEMENT_TYPE.END_ELEMENT)
        .sort(guidCompare);
}

/**
 * Normalizes store connectors
 *
 * @param connectors - The connectors
 * @returns the normalized connectors
 */
function normalizeConnectors(connectors) {
    return deepCopy(connectors)
        .map((conn) => pick(conn, connectorProps as any))
        .sort(guidCompare);
}

/**
 * @param canvasElements
 */
function sortCanvasElements(canvasElements) {
    [...canvasElements].sort(guidCompare);
}

/**
 * Deep equality check for two objects.
 * (note that null + undefined values are ignored in this check)
 *
 * @param objA - First object
 * @param objB - Second object
 * @returns true if the objects are equal
 */
export function deepEquals(objA, objB) {
    // if same primitive value or same reference value
    if (objA === objB) {
        return true;
    } else if (typeof objA !== 'object') {
        // return false if a primtive (ie not an array or object)
        return false;
    }

    const keysA = Object.getOwnPropertyNames(objA).filter((key) => objA[key] != null);
    const keysB = Object.getOwnPropertyNames(objB).filter((key) => objB[key] != null);

    if (keysA.length !== keysB.length) {
        return false;
    }

    const setB = new Set(keysB);
    for (const key of keysA) {
        setB.delete(key);
        if (!deepEquals(objA[key], objB[key])) {
            return false;
        }
    }

    return setB.size === 0;
}

/**
 * @param state
 */
function updateConnectorGuids(state: UI.StoreState) {
    state.connectors.forEach((conn: any) => {
        const { source, target, type } = conn;
        const childSource = conn.childSource || '';
        conn.guid = `${source}->${target}(${type},${childSource})`;
    });
    state.connectors.sort(guidCompare);
    return state;
}

/**
 * Normalizes and compares two store states
 *
 * @param prevState - The previous state
 * @param nextState - The next state
 * @param isAutoLayout
 * @returns true if the normalized state is the same
 */
const compareState = (prevState: UI.StoreState, nextState: UI.StoreState, isAutoLayout = false) => {
    return deepEquals(
        updateConnectorGuids(normalizeState(prevState, isAutoLayout)),
        updateConnectorGuids(normalizeState(nextState, isAutoLayout))
    );
};

/**
 * Normalizes the essential state of the store by picking and sorting selected properties.
 *
 * @param state
 * @param isAutoLayout
 * @returns the normalized state
 */
export function normalizeState(state: UI.StoreState, isAutoLayout = false): any {
    const { elements, connectors, canvasElements } = state;

    return {
        elements: normalizeElements(elements, isAutoLayout),
        connectors: normalizeConnectors(connectors),
        canvasElements: sortCanvasElements(canvasElements)
    };
}

/**
 * Removes end elements and connectors from a Free Form Flow flow.
 * Needed to persist a flow converted from Auto Layout Canvas flow
 * until the back end has end element support.
 *
 * @param storeState - The store state for the flow
 * @param endConnectors - Optional array where the removed end connectors will be added to.
 * @returns The flow without any end elements or connectors
 */
export function removeEndElementsAndConnectorsTransform(
    storeState: UI.StoreState,
    endConnectors?: UI.Connector[]
): UI.StoreState {
    let { elements, connectors } = storeState;

    // remove the end connectors
    connectors = connectors.filter((connector) => {
        const { source, target, childSource, type } = connector;
        if (elements[target].elementType === ELEMENT_TYPE.END_ELEMENT) {
            const sourceElement = elements[source] as UI.CanvasElement;
            if (endConnectors != null) {
                endConnectors.push(connector);
            }

            // adjust the connector count
            sourceElement.connectorCount--;

            // adjust the available connections
            const availableConnections = sourceElement.availableConnections;
            if (availableConnections != null) {
                const availableConnection: UI.AvailableConnection = { type };
                if (childSource != null) {
                    availableConnection.childReference = childSource;
                }
                availableConnections.push(availableConnection);
            }

            return false;
        }

        return true;
    });

    const canvasElements: UI.Guid[] = [];

    // remove the end elements
    elements = Object.values(elements).reduce((elementsMap, element) => {
        if (element.elementType !== ELEMENT_TYPE.END_ELEMENT) {
            elementsMap[element.guid] = element;
            if (element.isCanvasElement) {
                canvasElements.push(element.guid);
                // TODO: clean this up

                // @ts-ignore
                if (element.availableConnections != null && element.availableConnections.length > 0) {
                    // @ts-ignore
                    if (element.availableConnections[0].type === CONNECTOR_TYPE.FAULT) {
                        // @ts-ignore
                        element.availableConnections.splice(0, 1);
                        // @ts-ignore
                        element.availableConnections.push({
                            type: CONNECTOR_TYPE.FAULT
                        });
                    }
                }
            }
        }
        return elementsMap;
    }, {});

    return { ...storeState, elements, connectors, canvasElements };
}

/**
 * Add end connectors and elements to a Free Form Canvas UI Model.
 * Needed before converting a Free Form flow without end nodes to Auto Layout.
 *
 * @param storeState - The Free Form UI Model
 * @param endConnectors - The end connectors information to use. If missing these will be generated.
 * @returns The Free Form UIModel with end elements and connnectors
 */
export function addEndElementsAndConnectorsTransform(
    storeState: UI.StoreState,
    endConnectors?: UI.Connector[]
): UI.StoreState {
    // generate the connectors if none are provided
    endConnectors = endConnectors || generateEndConnectors(storeState.elements);

    const endElements: UI.Elements = {};

    // create the end elements from the end connectors
    endConnectors.forEach((endConnector) => {
        const { source, target, type, childSource } = endConnector;

        if (!endElements[target]) {
            const endElement = createEndElement() as any;
            endElement.nodeType = NodeType.END;
            endElement.guid = target;
            endElements[target] = endElement;
        }
        const sourceElement = storeState.elements[source] as UI.CanvasElement;
        sourceElement.connectorCount++;
        if (sourceElement.availableConnections) {
            sourceElement.availableConnections = sourceElement.availableConnections.filter((connection) => {
                // eslint-disable-next-line eqeqeq
                return connection.type !== type || connection.childReference != childSource;
            });
        }
    });

    return {
        ...storeState,
        elements: { ...storeState.elements, ...endElements },
        connectors: [...storeState.connectors, ...endConnectors],
        canvasElements: [
            ...storeState.canvasElements,
            ...Object.values(endElements).map((endElement) => endElement.guid)
        ]
    };
}

/**
 * Checks if a flow can be converted to Auto Layout Canvas.
 *
 * To ensure the conversion is valid it does a round trip conversion and compares
 * the resulting state with the original state
 *
 * @param state - A Free Form Canvas UI flow state
 * @param storeState
 * @param flowDefId - Flow definition id
 * @param gackIfFail - If we should gack if the conversion fails
 * @param options - Conversion options
 * @returns true if can be convertd to Auto Layout Canvas
 */
export function canConvertToAutoLayoutCanvas(
    storeState: UI.StoreState,
    flowDefId: string,
    gackIfFail = true,
    options: Partial<ConvertToAutoLayoutCanvasOptions> = {}
) {
    let canConvert = false;

    try {
        const autoLayoutState = convertToAutoLayoutCanvas(deepCopy(storeState), options);
        const freeFormState = convertToFreeFormCanvas(autoLayoutState, [0, 0]);

        canConvert = compareState(storeState, freeFormState);
    } catch (e) {
        // handled by the code below
    }

    if (!canConvert) {
        logInteraction(
            'alcConversionUtils',
            'alcConversionUtils',
            { flowDefId, operationStatus: 'convert to auto layout canvas failed' },
            ''
        );

        if (gackIfFail) {
            logMetricsServiceErrorTransaction(JSON.stringify(normalizeState(storeState)), '');
        }
    }

    return canConvert;
}

/**
 * Checks if a flow can be converted to Free Form
 *
 * To ensure the conversion is valid it does a round trip conversion and compares
 * the resulting state with the original state
 *
 * @param storeState - An Auto Canvas UI flow state
 * @param flowDefId - Flow definition id
 * @returns true if can be converted to Free From
 */
export function canConvertToFreeFormCanvas(storeState: UI.StoreState, flowDefId: string) {
    let canConvert = false;

    try {
        const endConnectors = [];
        const freeFormState = removeEndElementsAndConnectorsTransform(
            convertToFreeFormCanvas(deepCopy(storeState), [0, 0]),
            endConnectors
        );
        const autoLayoutState = convertToAutoLayoutCanvas(
            addEndElementsAndConnectorsTransform(deepCopy(freeFormState), endConnectors)
        );

        canConvert = compareState(storeState, autoLayoutState, true);
    } catch (e) {
        // handled by the code below
    }

    if (!canConvert) {
        logInteraction(
            'alcConversionUtils',
            'alcConversionUtils',
            { flowDefId, operationStatus: CONVERT_TO_FREE_FORM_FAILED },
            ''
        );

        logMetricsServiceErrorTransaction(JSON.stringify(normalizeState(storeState)), '');
    }

    return canConvert;
}

// adds conversion check to convertToAutoLayoutCanvas
const safeConvertToAutoLayoutCanvas = (
    storeState: UI.StoreState,
    options: Partial<ConvertToAutoLayoutCanvasOptions> = {},
    flowDefId: string
): UI.StoreState => {
    storeState = deepCopy(storeState);

    if (!canConvertToAutoLayoutCanvas(storeState, flowDefId, true, options)) {
        throw new Error(CONVERT_TO_AUTO_LAYOUT_FAILED);
    }

    return convertToAutoLayoutCanvas(storeState, options);
};

// adds conversion check to convertToFreeFormCanvas
const safeConvertToFreeFormCanvas = (storeState: UI.StoreState, startElementCoords: number[]): UI.StoreState => {
    storeState = deepCopy(storeState);

    // need to add flowDefId as param when below code is not skipped any more
    // skip for now
    // if (!canConvertToFreeFormCanvas(storeState)) {
    //     throw new Error(CONVERT_TO_FREE_FORM_FAILED);
    // }

    return convertToFreeFormCanvas(storeState, startElementCoords);
};

export { consolidateEndConnectors } from './freeFormToAutoLayout';
export { safeConvertToAutoLayoutCanvas as convertToAutoLayoutCanvas };
export { safeConvertToFreeFormCanvas as convertToFreeFormCanvas };
