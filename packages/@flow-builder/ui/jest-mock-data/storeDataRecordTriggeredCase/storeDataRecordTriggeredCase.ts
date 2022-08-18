import { recordTriggeredCaseFlowUIModel } from './recordTriggeredCaseFlowUIModel';
export * from './recordTriggeredCaseFlowUIModel';

export const getElementByName = (name) => {
    const elements = recordTriggeredCaseFlowUIModel.elements;
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
    const elements = recordTriggeredCaseFlowUIModel.elements;
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
export const record = getElementByName('$Record');
export const updateRelatedOwnerUser = getElementByName('update_related_owner_user');
