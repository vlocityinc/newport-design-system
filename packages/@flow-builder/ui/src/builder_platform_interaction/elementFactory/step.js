import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseCanvasElement, baseCanvasElementsArrayToMap } from "./base/baseElement";
import { baseCanvasElementMetadataObject } from "./base/baseMetadata";
import { createConnectorObjects } from './connector';

const elementType = ELEMENT_TYPE.STEP;
const maxConnections = -1;

/**
 * Method to create the step element object
 *
 * @returns {Object} the step element object
 */
export function createStep(step = {}) {
    const newStep = baseCanvasElement(step);
    const stepObject = Object.assign(newStep, {
        maxConnections,
        elementType
    });
    return stepObject;
}

/**
 * Method to create the step element object for Store
 *
 * @returns {Object} the step element object
 */
export function createStepWithConnectorsForStore(step = {}) {
    const newStep = createStep(step);
    const connectors = createConnectorObjects(step, newStep.guid);
    const connectorCount = connectors ? connectors.length : 0;
    const stepObject = Object.assign(newStep, { connectorCount });

    return baseCanvasElementsArrayToMap([stepObject], connectors);
}

/**
 * Method to create step element objects for a given flow metadata element
 * @param {step} step element metadata object
 * @returns {Object} the step element object
 */
export function createStepMetadataObject(step, config = {}) {
    if (!step) {
        throw new Error('step is not defined');
    }

    return baseCanvasElementMetadataObject(step, config);
}