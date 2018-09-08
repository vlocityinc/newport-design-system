import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { baseResource, baseElementsArrayToMap } from './base/base-element';
import { baseResourceMetadataObject } from './base/base-metadata';

const elementType = ELEMENT_TYPE.FORMULA;

export function createFormula(formula = {}) {
    const newFormula = baseResource(formula);
    const { expression, dataType, scale } = formula;
    return Object.assign(newFormula, {
        expression,
        dataType,
        scale,
        elementType
    });
}

export function createFormulaForStore(formula) {
    const newFormula = createFormula(formula);

    return baseElementsArrayToMap([newFormula]);
}

export function createFormulaMetadataObject(formula) {
    if (!formula) {
        throw new Error('formula is not defined');
    }

    const newFormula = baseResourceMetadataObject(formula);
    const { expression, dataType, scale } = formula;

    return Object.assign(newFormula, {
        expression,
        dataType,
        scale
    });
}
