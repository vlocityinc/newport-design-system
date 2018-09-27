import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseResource, baseElementsArrayToMap } from './base/baseElement';
import { baseResourceMetadataObject } from './base/baseMetadata';

const elementType = ELEMENT_TYPE.FORMULA;

/**
 * Either creates a new formula or create a new copy of existing formula
 * @param {Object} formula existing formula which needs to be copied
 * @return {Object} newFormula new formula which is created
 */
export function createFormula(formula = {}) {
    const newFormula = baseResource(formula);
    const {
        expression = '',
        dataType = null,
        scale = 2
    } = formula;
    Object.assign(newFormula, {
        expression,
        dataType,
        scale,
        elementType
    });
    return newFormula;
}

/**
 * Create a new copy of existing formula in shape as expected by store.
 * @param {Object} formula existing formula which needs to be copied
 * @return {Object} Map containing guid as key and new formula as value
 */
export function createFormulaForStore(formula) {
    const newFormula = createFormula(formula);
    return baseElementsArrayToMap([newFormula]);
}

/**
 * Create a new copy of existing formula in shape as expected by flow metadata.
 * @param {Object} formula existing formula which needs to be copied
 * @return {Object} newFormula new formula which is created
 */
export function createFormulaMetadataObject(formula) {
    if (!formula) {
        throw new Error('formula is not defined');
    }
    const newFormula = baseResourceMetadataObject(formula);
    const {
        expression,
        dataType,
        scale
    } = formula;
    Object.assign(newFormula, {
        expression,
        dataType,
        scale
    });
    return newFormula;
}
