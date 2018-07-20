({
    /**
     * Generic function to get data from server using this component. It sets the function on server-data-lib.js
     * @param cmp
     */
    initializeFetch: function(cmp) {
        var showAlertModal = true;
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
                        status = result.getState();
                        if (status === 'SUCCESS') {
                            return callback({
                                data: result.getReturnValue()
                            });
                        } else if (status === 'ERROR' || status === 'INCOMPLETE') {
                            if (showAlertModal) {
                                openAlertModal(status);
                            }
                            return callback({
                                error: result.getError()
                            });
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

        var openAlertModal = function(status) {
            var headerTitle, bodyTextOne, buttonVariant, buttonLabel, alertModal;
            alertModal = cmp.find('builderUtils').invokeAlertModal;
            buttonVariant = 'Brand';
            // TODO: update the labels: W-4962898
            buttonLabel = $A.get('$Label.FlowBuilderDeleteAlertModal.okayButtonLabel');
            if (status === 'ERROR') {
                headerTitle = 'Something went wrong';
                bodyTextOne = 'There is some error please contact the admin.';
            } else if (status === 'INCOMPLETE') {
                headerTitle = 'You are offline';
                bodyTextOne = 'You are currently offline. Please try to connect to internet and refresh the page.';
            }
            alertModal({
                headerData: {
                    headerTitle: headerTitle
                },
                bodyData: {
                    bodyTextOne: bodyTextOne
                },
                footerData: {
                    buttonOne: {
                        buttonVariant: buttonVariant,
                        buttonLabel: buttonLabel
                    }
                },
                closeCallback: function() {
                    showAlertModal = true;
                }
            });
            showAlertModal = false;
        }
    }
});