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
export const accountSObjectVariable = getElementByName('accountSObjectVariable');
export const lookupRecordOutputReference = getElementByName('lookupRecordOutputReference');
export const lookupRecordAutomaticOutput = getElementByName('lookupRecordAutomaticOutput');
export const lookupRecordCollectionAutomaticOutput = getElementByName('lookupRecordCollectionAutomaticOutput');
export const getRecordSObjectCollection = getElementByName('getRecordSObjectCollection');
export const getAccountSeparateFieldsWithFilters = getElementByName('getAccountSeparateFieldsWithFilters');
export const lookupRecordAutomaticOutputWithFields = getElementByName('getAccountAutoWithFields');
export const getAccountsAutomaticWithFieldsAndFilters = getElementByName('getAccountsAutomaticWithFieldsAndFilters');
export const screenElement = getElementByName('screen1');
export const emailScreenFieldAutomaticOutput = getElementByName('emailScreenFieldAutomaticOutput');
export const emailScreenField = getElementByName('emailScreenField');
export { default as lookupScreenField } from './lookupScreenField';
export const actionCallElement = getElementByName('actionCall1');
export const actionCallAutomaticOutput = getElementByName('actionCallAutomaticOutput');
export const actionCallLocalActionAutomaticOutput = getElementByName('localAction');
export const apexCallAutomaticAnonymousAccountOutput = getElementByName('apexCall_anonymous_account');
export const apexCallAutomaticAnonymousAccountsOutput = getElementByName('apexCall_anonymous_accounts');
export const apexCallAutomaticAnonymousStringOutput = getElementByName('apexCall_anonymous_string');
export const apexCallAutomaticAnonymousStringsOutput = getElementByName('apexCall_anonymous_strings');
export const apexCallAutomaticAnonymousApexTypeCollectionOutput = getElementByName(
    'apexCall_anonymous_apex_collection'
);
export const apexCallManualAccountOutput = getElementByName('apexCall_action_account_manual_output');
export const apexCallAccountAutomaticOutput = getElementByName('apexCall_account_automatic_output');
export const apexCallStringAutomaticOutput = getElementByName('apexCall_String_automatic_output');
export const apexCallApexTypeAutomaticOutput = getElementByName('apexCall_Car_automatic_output');
export const emailAlertOnAccount = getElementByName('emailAlertOnAccount');
export const externalServiceAutomaticOutput = getElementByName('addAccountExternalService');
export const stringCollectionVariable1 = getElementByName('stringCollectionVariable1');
export const stringCollectionVariable2 = getElementByName('stringCollectionVariable2');
export const apexSampleVariable = getElementByName('apexSampleVariable');
export const caseSObjectCollectionVariable = getElementByName('caseSObjectCollectionVariable');
export const accountSObjectCollectionVariable = getElementByName('accountSObjectCollectionVariable');
export const apexSampleCollectionVariable = getElementByName('apexSampleCollectionVariable');
export const stageElement = getElementByName('stage1');
export const stringConstant = getElementByName('stringConstant');
export const startElement = getStartElement();
export const textTemplate1 = getElementByName('textTemplate1');
export const dateCollectionVariable = getElementByName('dateCollectionVariable');
export const decision1 = getElementByName('decision1');
export const decision1Outcome1 = getElementByName('outcome1');
export const decision2 = getElementByName('decision');
export const decision2Outcome1 = getElementByName('outcome');
export const caseLogACallAutomatic = getElementByName('caseLogACallAutomatic');
export const apexComplexTypeVariable = getElementByName('apexComplexTypeVariable');
export const apexComplexTypeCollectionVariable = getElementByName('apexComplexTypeCollectionVariable');
export const apexCarVariable = getElementByName('apexCarVariable');
export const apexComplexTypeTwoVariable = getElementByName('apexComplexTypeTwoVariable');
export const createAccountWithAutomaticOutput = getElementByName('createAccountWithAutomaticOutput');
export const createWithApexDefSingleSObjectVariable = getElementByName('withApexDefSingleSObjectVariable');
export const createWithApexDefSObjectCollectionVariable = getElementByName('withApexDefSObjectCollectionVariable');
export const lightningCompAutomaticOutputContainsAccountExtension = getElementByName('lightningCompWithAccountOutput');
export const lightningCompAutomaticOutputNoSObjectExtension = getElementByName('lightningCompWithNoAccountOutput');
export const lightningCompAutomaticOutputSObjectCollectionExtension = getElementByName(
    'lightningCompWithAccountsOutput'
);
export const localActionApexDoesNotContainSObjectAutomaticOutput = getElementByName(
    'actionCallLC_apex_no_sobject_auto'
);
export const localActionApexDoesContainsSObjectAutomaticOutput = getElementByName(
    'actionCallLC_apex_with_sobject_auto'
);
export const feedItemVariable = getElementByName('feedItemVariable');
export const caseSObjectVariable = getElementByName('caseSObjectVariable');
export const contactSObjectVariable = getElementByName('contactSObjectVariable');
export const campaignSObjectVariable = getElementByName('campaignSObjectVariable');
export const opportunitySObjectVariable = getElementByName('opportunitySObjectVariable');
export const opportunitySObjectCollectionVariable = getElementByName('opportunitySObjectCollectionVariable');
export const subflowAutomaticOutput = getElementByName('subflowAutomaticOutput');
export const screenWithAddress = getElementByName('screenWithAddress');
export const screenWithAddressAddress = getElementByName('Address');

// elements after getElementForPropertyEditor
const deepCopy = obj => JSON.parse(JSON.stringify(obj));
export const numberVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[numberVariable.name]);
export const stringVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[stringVariable.name]);
export const dateVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[dateVariable.name]);
export const stringConstantForPropertyEditor = () => deepCopy(elementsForPropertyEditors[stringConstant.name]);
export const accountSObjectVariableForPropertyEditor = () =>
    deepCopy(elementsForPropertyEditors[accountSObjectVariable.name]);
export const textTemplate1ForPropertyEditor = () => deepCopy(elementsForPropertyEditors[textTemplate1.name]);
