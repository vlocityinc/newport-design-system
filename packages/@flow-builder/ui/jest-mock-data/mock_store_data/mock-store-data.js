import { flowWithAllElementsUIModel } from './flowWithAllElementsUIModel';
import { elementsForPropertyEditors } from './elementsForPropertyEditors';
export * from './flowWithAllElementsUIModel';
export * from './elementsForPropertyEditors';

export const getElementByName = name => {
	const elements = flowWithAllElementsUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].name === name) {
                return elements[guid];
            }
        }
    }
    return undefined;
};

export const getElementByGuid = guid => {
    return flowWithAllElementsUIModel.elements[guid];
};

const getStartElement = () => {
	const elements = flowWithAllElementsUIModel.elements;
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            if (elements[guid].elementType === 'START_ELEMENT') {
                return elements[guid];
            }
        }
    }
    return undefined;
};

export const numberVariable = getElementByName('numberVariable');
export const stringVariable = getElementByName('stringVariable');
export const dateVariable = getElementByName('dateVariable');
export const currencyVariable = getElementByName('currencyVariable');
export const assignmentElement = getElementByName('assignment1');
export const assignmentElement2 = getElementByName('assignment2');
export const accountSObjectVariable = getElementByName('accountSObjectVariable');
export const lookupRecordOutputReference = getElementByName('lookupRecordOutputReference');
export const lookupRecordAutomaticOutput = getElementByName('lookupRecordAutomaticOutput');
export const lookupRecordCollectionAutomaticOutput = getElementByName('lookupRecordCollectionAutomaticOutput');
export const screenElement = getElementByName('screen1');
export const emailScreenFieldAutomaticOutput = getElementByName('emailScreenFieldAutomaticOutput');
export const emailScreenField = getElementByName('emailScreenField');
export const actionCallElement = getElementByName('actionCall1');
export const actionCallAutomaticOutput = getElementByName('actionCallAutomaticOutput');
export const stringCollectionVariable1 = getElementByName('stringCollectionVariable1');
export const stringCollectionVariable2 = getElementByName('stringCollectionVariable2');
export const apexSampleVariable = getElementByName( 'apexSampleVariable');
export const caseSObjectCollectionVariable = getElementByName('caseSObjectCollectionVariable');
export const accountSObjectCollectionVariable = getElementByName('accountSObjectCollectionVariable');
export const apexSampleCollectionVariable = getElementByName('apexSampleCollectionVariable');
export const stageElement = getElementByName('stage1');
export const stringConstant = getElementByName('stringConstant');
export const startElement = getStartElement();
export const textTemplate1 = getElementByName('textTemplate1');
export const dateCollectionVariable = getElementByName('dateCollectionVariable');
export const decisionOutcome = getElementByName('outcome1');

// elements after getElementForPropertyEditor
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
export const numberVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[numberVariable.name]);
export const stringVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[stringVariable.name]);
export const dateVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[dateVariable.name]);
export const stringConstantForPropertyEditor = () => deepCopy(elementsForPropertyEditors[stringConstant.name]);
export const accountSObjectVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[accountSObjectVariable.name]);
export const textTemplate1ForPropertyEditor = () => deepCopy(elementsForPropertyEditors[textTemplate1.name]);