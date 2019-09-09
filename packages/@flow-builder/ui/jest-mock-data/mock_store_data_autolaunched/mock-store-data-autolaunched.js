import { autolaunchedFlowUIModel } from './autolaunchedFlowUIModel';
export * from './autolaunchedFlowUIModel';

export const getElementByName = name => {
	const elements = autolaunchedFlowUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].name === name) {
                return elements[guid];
            }
        }
    }
    return undefined;
};


export const waitEvent1 = getElementByName('waitEvent1');