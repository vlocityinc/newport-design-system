
let getAllInvocableActionsForTypeFunction;
let getInvocableActionParametersFunction;

export function setGetAllInvocableActionsForTypeFunction(theFunction) {
    getAllInvocableActionsForTypeFunction = theFunction;
}

export function setGetInvocableActionParametersFunction(theFunction) {
    getInvocableActionParametersFunction = theFunction;
}

/**
 * Callback for getAllInvocableActionsForType
 *
 * @callback invocableActionsCallback
 * @param {Object[]}
 *            invocableActions array of invocable actions
 * @param {boolean}
 *            invocableActions[].IsStandard
 * @param {String}
 *            invocableActions[].Type "apex", "quickAction", "component" or same as name for standard invocable actions
 * @param {String}
 *            invocableActions[].Description
 * @param {String}
 *            invocableActions[].Label
 * @param {String}
 *            invocableActions[].Id always "000000000000000AAA" ?
 * @param {String}
 *            invocableActions[].DurableId type-name, for ex "apex-LogACall",
 *            "deactivateSessionPermSet-deactivateSessionPermSet"
 * @param {String}
 *            invocableActions[].Name for ex "LogACall", "chatterPost", "CollaborationGroup.NewGroupMember" ...
 * @param {String}
 *            invocableActions[].sobjectType "InvocableAction"
 */

/**
 * Callback for getInvocableActionParameters
 *
 * @callback invocableActionParametersCallback
 */

/**
 * Get all the invocable actions
 *
 * @param {invocableActionsCallback}
 *            callback The callback that handles the response. May be called twice : First with the cached response, if
 *            it’s in storage. Second with updated data from the server, if the stored response has exceeded the time to
 *            refresh entries.
 *
 */
export function getAllInvocableActionsForType(callback) {
    getAllInvocableActionsForTypeFunction(callback);
}

/**
 * Get parameters for given invocable action
 *
 * @param {String}
 *            actionName the action name for ex "LogACall", "chatterPost", "CollaborationGroup.NewGroupMember" ...
 * @param {String}
 *            actionType the action type "apex", "quickAction", "component" or same as name for standard invocable
 *            actions
 * @param {invocableActionParametersCallback}
 *            callback The callback that handles the response. May be called twice : First with the cached response, if
 *            it’s in storage. Second with updated data from the server, if the stored response has exceeded the time to
 *            refresh entries.
 *
 */
export function getInvocableActionParameters(actionName, actionType, callback) {
    getInvocableActionParametersFunction(actionName, actionType, callback);
}
