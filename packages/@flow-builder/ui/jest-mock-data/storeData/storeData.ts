import { elementsForPropertyEditors } from './elementsForPropertyEditors';
import { flowWithAllElementsUIModel } from './flowWithAllElementsUIModel';
export * from './elementsForPropertyEditors';
export * from './flowWithAllElementsUIModel';
export { default as lookupScreenField } from './lookupScreenField';

export const getElementByName = (name) => {
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

export const getElementByGuid = (guid) => {
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

/**
 * @param elementGuid
 */
function getChildrenElementsGuidsRecursively(elementGuid: UI.Guid): UI.Guid[] {
    const element = getElementByGuid(elementGuid);
    if (!element.childReferences) {
        return [];
    }
    return element.childReferences.reduce<UI.Guid[]>(
        (acc, { childReference }) => [...acc, childReference, ...getChildrenElementsGuidsRecursively(childReference)],
        []
    );
}

const getAutomaticFieldElement = (screenElementName, objectFieldReference) => {
    const objectFieldReferenceParts = objectFieldReference.split('.');
    const objectReferenceElement = getElementByName(objectFieldReferenceParts[0]);
    const objectFieldRefenceWithGuid = [objectReferenceElement.guid, ...objectFieldReferenceParts.slice(1)].join('.');
    const screenElement = getElementByName(screenElementName);
    const childrenElementsGuids = getChildrenElementsGuidsRecursively(screenElement.guid);
    const automaticFieldGuid = childrenElementsGuids.find(
        (guid) => getElementByGuid(guid).objectFieldReference === objectFieldRefenceWithGuid
    );
    return getElementByGuid(automaticFieldGuid);
};

export const numberVariable = getElementByName('numberVariable');
export const stringVariable = getElementByName('stringVariable');
export const booleanVariable = getElementByName('booleanVariable');
export const dateVariable = getElementByName('dateVariable');
export const currencyVariable = getElementByName('currencyVariable');
export const assignmentElement = getElementByName('assignment1');
export const accountSObjectVariable = getElementByName('accountSObjectVariable');
export const objectWithAllPossibleFieldsVariable = getElementByName('objectWithAllPossiblFieldsVariable');
export const lookupRecordOutputReference = getElementByName('lookupRecordOutputReference');
export const lookupRecordAutomaticOutput = getElementByName('lookupRecordAutomaticOutput');
export const lookupRecordCollectionAutomaticOutput = getElementByName('lookupRecordCollectionAutomaticOutput');
export const lookupRecordCollectionManualOutput = getElementByName('lookupAccountsManual');
export const getAccountSeparateFieldsWithFilters = getElementByName('getAccountSeparateFieldsWithFilters');
export const updateAccountWithFilter = getElementByName('updateAccountWithFilter');
export const updateAccountSObjectVariable = getElementByName('updateSObject');
export const lookupRecordAutomaticOutputWithFields = getElementByName('getAccountAutoWithFields');
export const getAccountsAutomaticWithFieldsAndFilters = getElementByName('getAccountsAutomaticWithFieldsAndFilters');
export const getAccountManualOutputIntoApexVariable = getElementByName('get_account_into_apex_variable');
export const getAccountsManualOutputIntoApexVariable = getElementByName('get_accounts_into_apex_variable');
export const screenElement = getElementByName('screen1');
export const emailScreenFieldAutomaticOutput = getElementByName('emailScreenFieldAutomaticOutput');
export const emailScreenField = getElementByName('emailScreenField');
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
export const textTemplate2 = getElementByName('textTemplate2');
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
export const contractSObjectVariable = getElementByName('contractSObjectVariable');
export const opportunitySObjectVariable = getElementByName('opportunitySObjectVariable');
export const opportunitySObjectCollectionVariable = getElementByName('opportunitySObjectCollectionVariable');
export const subflowWithAllVariableTypes = getElementByName('subflow_with_all_type_variables');
export const subflowAutomaticOutput = getElementByName('subflowAutomaticOutput');
export const screenWithAddress = getElementByName('screenWithAddress');
export const screenWithAddressAddress = getElementByName('Address');
export const loopOnAccountAutoOutput = getElementByName('loopOnAccountAutoOutput');
export const loopOnTextCollectionManualOutput = getElementByName('loopOnTextCollection');
export const loopOnComplexMergeFieldManualOutput = getElementByName('loopOnComplexMergeFieldManualOutput');
export const loopOnTextCollectionAutoOutput = getElementByName('loopOnTextCollectionAutoOutput');
export const loopOnApexAutoOutput = getElementByName('loopOnApexAutoOutput');
export const loopOnNestedApexTypeAutoOutput = getElementByName('loopOnNestedApexTypeAutoOutput');
export const loopOnSobjectCollectionInApexTypeAutoOutput = getElementByName(
    'loopOnSobjectCollectionInApexTypeAutoOutput'
);
export const loopOnScreenCompSObjectCollAutoOutput = getElementByName('loopOnScreenCompSObjectCollAutoOutput');
export const loopOnLocalActionSobjectCollInApexAutoOutput = getElementByName(
    'loopOnLocalActionSobjectCollInApexAutoOutput'
);
export const deleteAccount = getElementByName('deleteAccount');
export const deleteAccountWithFilters = getElementByName('deleteAccountWithFilters');
export const screenWithSection = getElementByName('ScreenWithSection');
export const section1 = getElementByName('ScreenWithSection_Section1');
export const section2 = getElementByName('ScreenWithSection_Section2');
export const section2Column1 = getElementByName('ScreenWithSection_Section2_Column1');
export const section2Column2 = getElementByName('ScreenWithSection_Section2_Column2');
export const screenWithAutomaticFields = getElementByName('screenWithAutomaticFields');
export const accountVariableNameAutomaticField = getAutomaticFieldElement(
    'screenWithAutomaticFields',
    'accountSObjectVariable.Name'
);
export const contactVariableNameAutomaticField = getAutomaticFieldElement(
    'screenWithAutomaticFields',
    'contactSObjectVariable.Name'
);
export const contactVariableAddressAutomaticField = getAutomaticFieldElement(
    'screenWithAutomaticFields',
    'contactSObjectVariable.MailingAddress'
);
export const objectWithAllPossibleFieldsVariableTextFieldAutomaticField = getAutomaticFieldElement(
    'screenWithAutomaticFields',
    'objectWithAllPossiblFieldsVariable.Text_Field__c'
);
export const screenWithAutomaticFieldsInSection = getElementByName('screenWithAutomaticFieldsInSection');
export const accountVariableNameAutomaticFieldInSection = getAutomaticFieldElement(
    'screenWithAutomaticFieldsInSection',
    'accountSObjectVariable.Name'
);
export const address2 = getElementByName('address_2');
export const email2 = getElementByName('email_2');
export const displayTextUsingResources = getElementByName('displayTextUsingResources');
export const slider1 = getElementByName('slider_1');
export const number2 = getElementByName('number_2');
export const text2 = getElementByName('text_2');
export const dateTimeInSection = getElementByName('dateTimeInSection');
export const screenFieldAccounts = getElementByName('accounts');
export const screenFieldTextBoxSomeText = getElementByName('someText');

export const staticChoiceOther = getElementByName('other');

export const createAccountFromLiteralValues = getElementByName('createAccountFromLiteralValues');
export const variableWithSameNameAsAccount = getElementByName('Account');
export const recordChoiceSet = getElementByName('recordChoiceSet');

// elements after getElementForPropertyEditor
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
export const numberVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[numberVariable.name]);
export const stringVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[stringVariable.name]);
export const dateVariableForPropertyEditor = () => deepCopy(elementsForPropertyEditors[dateVariable.name]);
export const stringConstantForPropertyEditor = () => deepCopy(elementsForPropertyEditors[stringConstant.name]);
export const accountSObjectVariableForPropertyEditor = () =>
    deepCopy(elementsForPropertyEditors[accountSObjectVariable.name]);
export const textTemplateInRichTextModeForPropertyEditor = () =>
    deepCopy(elementsForPropertyEditors[textTemplate1.name]);
export const textTemplateInPlainTextModeForPropertyEditor = () =>
    deepCopy(elementsForPropertyEditors[textTemplate2.name]);
