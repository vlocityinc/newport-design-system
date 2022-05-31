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
export const assign = getElementByName('assign');
export const createAccountFromAnAccount = getElementByName('create_account_from_an_account');
export const createAccountManualOutput = getElementByName('create_account_manual_output');
export const decision = getElementByName('decision');
export const record = getElementByName('$Record');
export const updateTriggeringRecord = getElementByName('Update_Triggering_Record');
