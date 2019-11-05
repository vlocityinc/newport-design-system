import { contactRequestFlowUIModel } from './contactRequestFlowUIModel';
export * from './contactRequestFlowUIModel';

export const getElementByName = name => {
	const elements = contactRequestFlowUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].name === name) {
                return elements[guid];
            }
        }
    }
    return undefined;
};

export const getAccountWithFields = getElementByName('getAccountWithFields');
export const getAccountWithSObject = getElementByName('get_Account_with_sObject');
export const getAccountWithSObjectCollection = getElementByName('get_Accounts');