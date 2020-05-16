// @ts-nocheck
import { Data } from 'analyzer_framework/api';

/**
 * @description The element class contains abstracted client model information about each element
 * that is needed to run guardrails rules.
 */

export class Element extends Data {
    constructor(id, type, elementMetadata) {
        super(id);
        this.type = type;
        Object.assign(this, elementMetadata);
    }
}
