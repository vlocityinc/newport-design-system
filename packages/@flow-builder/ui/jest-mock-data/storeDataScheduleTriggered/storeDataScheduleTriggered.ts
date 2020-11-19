// @ts-nocheck
import { scheduleTriggeredFlowUIModel } from './scheduleTriggeredFlowUIModel';
export * from './scheduleTriggeredFlowUIModel';

export const getElementByName = (name) => {
    const elements = scheduleTriggeredFlowUIModel.elements;
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
export const actionPostToChatter = getElementByName('postToChatter');

export const accountVariable = getElementByName('accountVariable');
export const accountsCollectionVariable = getElementByName('accounts');
export const textCollection = getElementByName('textCollection');
export const textVariable = getElementByName('textVariable');
export const loopAccountAutomaticOutput = getElementByName('loopAccountAutomaticOutput');
export const loopOnTextCollectionManualOutput = getElementByName('loopOnTextCollection');
export const loopOnTextCollectionAutomaticOutput = getElementByName('loopOnTextAutomaticOutput');
export const loopOnApexTypeCollectionAutoOutput = getElementByName('loopOnApexTypeCollectionAutoOutput');
export const startElementWithAccountAndNoCondition = getElementByName('$Record');
