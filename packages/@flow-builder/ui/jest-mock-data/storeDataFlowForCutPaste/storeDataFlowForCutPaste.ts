import { flowForCutPasteUIModel } from './flowForCutPasteUIModel';
export * from './flowForCutPasteUIModel';

export const getElementByName = (name) => {
    const elements = flowForCutPasteUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].name === name) {
                return elements[guid];
            }
        }
    }
    return undefined;
};

export const assignment1 = getElementByName('as1');
export const assignment2 = getElementByName('as2');
export const assignment3 = getElementByName('as3');
export const assignment4 = getElementByName('as4');
export const assignment5 = getElementByName('as5');
export const decision1 = getElementByName('d1');
export const decision2 = getElementByName('d2');
export const end1 = getElementByName('END_ELEMENT');
export const end2 = getElementByName('END_ELEMENT_2');
export const X2 = getElementByName('X2');
export const X2_0 = getElementByName('X2_0');
export const X1 = getElementByName('X1');
export const X1_0 = getElementByName('X1_0');
