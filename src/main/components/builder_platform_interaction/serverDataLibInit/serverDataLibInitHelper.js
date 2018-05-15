({
    /**
     * Generic function to get data from server using this component. It sets the function on server-data-lib.js
     * @param cmp
     */
    initializeFetch: function(cmp) {
        var auraFetch = $A.getCallback(function(actionName, shouldExecuteCallback, callback, params, background, storable) {
            if (actionName && callback) {
                var action = cmp.get(actionName);
                if (params) {
                    action.setParams(params);
                }
                if (storable) {
                    action.setStorable();
                }
                if (background) {
                    action.setBackground();
                }
                action.setCallback(this, function (result) {
                    var executeCallback = shouldExecuteCallback();
                    if (executeCallback) {
                        if (result.getState() === 'SUCCESS') {
                            return callback({
                                data: result.getReturnValue()
                            });
                        } else if (result.getState() === 'ERROR') {
                            return callback({
                                error: result.getError()
                            });
                        } else if (result.getState() === 'INCOMPLETE') {
                            //TODO: handle offline case
                        }
                    }
                });
                $A.enqueueAction(action);
            }
        });

        var serverDataLib = cmp.find('serverDataLib');
        if (!$A.util.isUndefinedOrNull(serverDataLib)) {
            serverDataLib.setAuraFetch(auraFetch);
        }
    }
});