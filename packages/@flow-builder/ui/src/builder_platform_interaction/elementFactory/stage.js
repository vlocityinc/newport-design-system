import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseResource, baseElementsArrayToMap } from "./base/baseElement";
import { baseResourceMetadataObject } from "./base/baseMetadata";

const elementType = ELEMENT_TYPE.STAGE;

/**
 * Method to create the stage element object
 *
 * @returns {Object} the stage element object
 */
export function createStage(stage = {}) {
    const newStage = baseResource(stage);
    let { stageOrder = null } = stage;
    const { isActive = false, label = '' } = stage;

    // Convert stageOrder property to string, which is needed for validation purposes.
    // Saving it as a string allows it be hydrated.
    if (stageOrder != null && typeof stageOrder === 'number') {
        stageOrder = stageOrder.toString();
    }

    return Object.assign(newStage, {
        isActive,
        stageOrder,
        label,
        elementType
    });
}

export function createStageForStore(stage = {}) {
    const newStage = createStage(stage);
    return baseElementsArrayToMap([newStage]);
}

/**
 * Method to create stage element objects for a given flow metadata element
 * @param {stage} stage element metadata object
 * @returns {Object} the stage element object
 */
export function createStageMetadataObject(stage) {
    if (!stage) {
        throw new Error('stage is not defined');
    }

    const newStage = baseResourceMetadataObject(stage);
    let { stageOrder } = stage;
    const { isActive = false, label } = stage;

    // Convert stageOrder back to number. MD expects this to be a number, but within FlowBuilder, we want it to be a string.
    if (stageOrder != null && typeof stageOrder === 'string') {
        stageOrder = Number(stageOrder);
    }

    return Object.assign(newStage, {
        isActive,
        stageOrder,
        label
    });
}
