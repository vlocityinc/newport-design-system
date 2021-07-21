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

const getStartElement = () => {
    const elements = recordTriggeredFlowUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].elementType === 'START_ELEMENT') {
                return elements[guid];
            }
        }
    }
    return undefined;
};

export const startElement = getStartElement();
export const actionPostToChatter = getElementByName('Post_to_Chatter_Action');
