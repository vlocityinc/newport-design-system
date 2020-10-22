// @ts-nocheck
import { recordTriggeredFlowUIModel } from './recordTriggeredFlowUIModel';
export * from './recordTriggeredFlowUIModel';

export const getElementByName = (name) => {
    const elements = recordTriggeredFlowUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].name === name) {
                return elements[guid];
            }
        }
    }
    return undefined;
};
