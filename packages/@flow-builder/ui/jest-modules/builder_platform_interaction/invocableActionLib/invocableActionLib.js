import { getAccountFromApexAnonymousOutputActionDetails as mockGetAccountFromApexAnonymousOutputActionDetails } from "serverData/GetInvocableActionDetails/getAccountFromApexAnonymousOutputActionDetails.json";
import { getAccountNameFromApexAnonymousOutputActionDetails as mockGetAccountNameFromApexAnonymousOutputActionDetails } from "serverData/GetInvocableActionDetails/getAccountNameFromApexAnonymousOutputActionDetails.json";
import { getAccountFromApexActionDetails as mockGetAccountFromApexActionDetails } from "serverData/GetInvocableActionDetails/getAccountFromApexActionDetails.json";
import { getStringFromApexActionDetails as mockGetAccountNameFromApexActionDetails } from "serverData/GetInvocableActionDetails/getStringFromApexActionDetails.json";
import { logACallActionDetails as mockLogACallActionDetails } from "serverData/GetInvocableActionDetails/logACallActionDetails.json";
import { chatterPostActionDetails as mockChatterPostActionDetails } from "serverData/GetInvocableActionDetails/chatterPostActionDetails.json";
import { getAccountsFromApexAnonymousOutputActionDetails as mockGetAccountsFromApexAnonymousOutputActionDetails } from "serverData/GetInvocableActionDetails/getAccountsFromApexAnonymousOutputActionDetails.json";
import { getAccountsNamesFromApexAnonymousOutputActionDetails as mockGetAccountsNamesFromApexAnonymousOutputActionDetails } from "serverData/GetInvocableActionDetails/getAccountsNamesFromApexAnonymousOutputActionDetails.json";

let notLoadedActionKey;

const mockImplementationForGetDetailsForInvocableAction = ({
  actionName,
  actionType
}) => {
  const key = `${actionType}-${actionName}`;
  switch (key) {
    case notLoadedActionKey:
      return undefined;
    case "chatterPost-chatterPost":
      return mockChatterPostActionDetails;
    case "quickAction-Case.LogACall":
      return mockLogACallActionDetails;
    case "apex-getAccounts":
      return mockGetAccountFromApexAnonymousOutputActionDetails;
    case "apex-InvocableGetAccountName":
      return mockGetAccountNameFromApexAnonymousOutputActionDetails;
    case "apex-generateDraftAccount":
      return mockGetAccountFromApexActionDetails;
    case "apex-GetAccountName":
      return mockGetAccountNameFromApexActionDetails;
    case "apex-GetAccounts":
      return mockGetAccountsFromApexAnonymousOutputActionDetails;
    case "apex-InvocableGetAccountsNames":
      return mockGetAccountsNamesFromApexAnonymousOutputActionDetails;
    default:
      return undefined;
  }
};

const mockImplementationForGetParametersForInvocableAction = ({
  actionName,
  actionType
}) => {
  const actionDetails = mockImplementationForGetDetailsForInvocableAction({
    actionName,
    actionType
  });
  return actionDetails ? actionDetails.parameters : actionDetails;
};

export const getParametersForInvocableAction = jest
  .fn()
  .mockImplementation(({ actionName, actionType }) =>
    mockImplementationForGetParametersForInvocableAction({
      actionName,
      actionType
    })
  );

/**
 * To fake that the given action is not yet loaded
 * @param {*} action
 */
export const setNotLoadedAction = ({ actionType, actionName } = {}) => {
  notLoadedActionKey = `${actionType}-${actionName}`;
};
