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

const mockImplementationForGetDetailsForInvocableAction = ({
  actionName,
  actionType
}) => {
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

export const fetchDetailsForInvocableAction = jest.fn().mockImplementation(({ actionName, actionType }) => {
	const result = mockImplementationForGetDetailsForInvocableAction({
    actionName,
    actionType
  });
	if (!result) {
		return Promise.reject(`Cannot load details for invocable action ${actionType}-${actionName}`);
	}
	return Promise.resolve(result);
}
);

/**
 * To fake that the given action is not yet loaded
 * @param {*} action
 */
export const setNotLoadedAction = ({ actionType, actionName } = {}) => {
  notLoadedActionKey = `${actionType}-${actionName}`;
};
