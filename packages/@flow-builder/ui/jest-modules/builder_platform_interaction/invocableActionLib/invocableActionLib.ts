// @ts-nocheck
import { getAccountFromApexAnonymousOutputActionDetails } from 'serverData/GetInvocableActionDetails/getAccountFromApexAnonymousOutputActionDetails.json';
import { getAccountNameFromApexAnonymousOutputActionDetails } from 'serverData/GetInvocableActionDetails/getAccountNameFromApexAnonymousOutputActionDetails.json';
import { getAccountFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getAccountFromApexActionDetails.json';
import { getStringFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getStringFromApexActionDetails.json';
import { logACallActionDetails } from 'serverData/GetInvocableActionDetails/logACallActionDetails.json';
import { chatterPostActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';
import { getAccountsFromApexAnonymousOutputActionDetails } from 'serverData/GetInvocableActionDetails/getAccountsFromApexAnonymousOutputActionDetails.json';
import { getAccountsNamesFromApexAnonymousOutputActionDetails } from 'serverData/GetInvocableActionDetails/getAccountsNamesFromApexAnonymousOutputActionDetails.json';
import { getCarFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getCarFromApexActionDetails.json';
import { getCarsFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getCarsFromApexActionDetails.json';

let notLoadedActionKey;

// TODO This evil stuff needs to be removed when W-7013783 is fixed
const lightningWithApexContainsSObjectDetails = {
    configurationEditor: null,
    parameters: [
        {
            isRequired: false,
            isInput: true,
            dataType: 'Apex',
            description: null,
            label: 'ApexWithSObject',
            isOutput: false,
            name: 'apexWithSObject',
            apexClass: 'ApexComplexTypeTestOne216',
            maxOccurs: 1,
            id: null,
            isSystemGeneratedOutput: false,
            durableId: 'component-c:LightningWithApexContainsSObject-input-apexWithSObject',
            sobjectType: null
        },
        {
            isRequired: false,
            isInput: false,
            dataType: 'Apex',
            description: null,
            label: 'ApexWithSObject',
            isOutput: true,
            name: 'apexWithSObject',
            apexClass: 'ApexComplexTypeTestOne216',
            maxOccurs: 1,
            id: null,
            isSystemGeneratedOutput: false,
            durableId: 'component-c:LightningWithApexContainsSObject-output-apexWithSObject',
            sobjectType: null
        }
    ]
};

const lightningWithApexDoesNotContainSObjectDetails = {
    configurationEditor: null,
    parameters: [
        {
            isRequired: false,
            isInput: true,
            dataType: 'Apex',
            description: null,
            label: 'ApexWithoutSObject',
            isOutput: false,
            name: 'apexWithoutSObject',
            apexClass: 'Car',
            maxOccurs: 1,
            id: null,
            isSystemGeneratedOutput: false,
            durableId: 'component-c:LightningComponentWithApexNoSObject-input-apexWithoutSObject',
            sobjectType: null
        },
        {
            isRequired: false,
            isInput: false,
            dataType: 'Apex',
            description: null,
            label: 'ApexWithoutSObject',
            isOutput: true,
            name: 'apexWithoutSObject',
            apexClass: 'Car',
            maxOccurs: 1,
            id: null,
            isSystemGeneratedOutput: false,
            durableId: 'component-c:LightningComponentWithApexNoSObject-output-apexWithoutSObject',
            sobjectType: null
        }
    ]
};

const mockImplementationForGetDetailsForInvocableAction = ({ actionName, actionType }) => {
    const key = `${actionType}-${actionName}`;
    switch (key) {
        case notLoadedActionKey:
            return undefined;
        case 'chatterPost-chatterPost':
            return chatterPostActionDetails;
        case 'quickAction-Case.LogACall':
            return logACallActionDetails;
        case 'apex-getAccounts':
            return getAccountFromApexAnonymousOutputActionDetails;
        case 'apex-InvocableGetAccountName':
            return getAccountNameFromApexAnonymousOutputActionDetails;
        case 'apex-generateDraftAccount':
            return getAccountFromApexActionDetails;
        case 'apex-GetAccountName':
            return getStringFromApexActionDetails;
        case 'apex-GetAccounts':
            return getAccountsFromApexAnonymousOutputActionDetails;
        case 'apex-InvocableGetAccountsNames':
            return getAccountsNamesFromApexAnonymousOutputActionDetails;
        case 'apex-GetCarAction':
            return getCarFromApexActionDetails;
        case 'apex-ApexTypeCollectionAction':
            return getCarsFromApexActionDetails;
        case 'component-c:LightningWithApexContainsSObject':
            return lightningWithApexContainsSObjectDetails;
        case 'component-c:LightningComponentWithApexNoSObject':
            return lightningWithApexDoesNotContainSObjectDetails;
        default:
            return undefined;
    }
};

const mockImplementationForGetParametersForInvocableAction = ({ actionName, actionType }) => {
    const actionDetails = mockImplementationForGetDetailsForInvocableAction({
        actionName,
        actionType
    });
    return actionDetails ? actionDetails.parameters : actionDetails;
};

export const getParametersForInvocableAction = jest.fn().mockImplementation(({ actionName, actionType }) =>
    mockImplementationForGetParametersForInvocableAction({
        actionName,
        actionType
    })
);

export const fetchDetailsForInvocableAction = jest.fn().mockImplementation(({ actionName, actionType }) => {
    const result = mockImplementationForGetDetailsForInvocableAction({
        actionName,
        actionType
    });
    if (!result) {
        return Promise.reject(`Cannot load details for invocable action ${actionType}-${actionName}`);
    }
    return Promise.resolve(result);
});

/**
 * To fake that the given action is not yet loaded
 * @param {*} action
 */
export const setNotLoadedAction = ({ actionType, actionName } = {}) => {
    notLoadedActionKey = `${actionType}-${actionName}`;
};
