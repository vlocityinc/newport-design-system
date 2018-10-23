({
    /**
     * Generic function to get data from server using this component. It sets the function on server-data-lib.js
     * @param cmp
     */
    initializeFetch: function(cmp) {
        var showAlertModal = true;
        var auraFetch = $A.getCallback(function(actionName, shouldExecuteCallback, callback, params, background, storable, disableErrorModal, messageForErrorModal) {
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
                        var status = result.getState();
                        if (status === 'SUCCESS') {
                            return callback({
                                data: result.getReturnValue()
                            });
                        } else if (status === 'ERROR' || status === 'INCOMPLETE') {
                            if (showAlertModal && !disableErrorModal) {
                                openAlertModal(status, messageForErrorModal);
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

        var openAlertModal = function(status, errorMessage) {
            var headerTitle, bodyTextOne, buttonVariant, buttonLabel, alertModal;
            alertModal = cmp.find('builderUtils').invokeModal;
            buttonVariant = 'Brand';
            buttonLabel = $A.get('$Label.FlowBuilderAlertModal.okayButtonLabel');
            if (status === 'ERROR') {
                headerTitle = $A.get('$Label.FlowBuilderAlertModal.errorTitle');
                if (errorMessage) {
                    bodyTextOne = errorMessage;                    
                } else {
                    bodyTextOne = $A.get('$Label.FlowBuilderAlertModal.errorMessage');
                }
            } else if (status === 'INCOMPLETE') {
                headerTitle = $A.get('$Label.FlowBuilderAlertModal.noNetworkConnectionTitle');
                bodyTextOne = $A.get('$Label.FlowBuilderAlertModal.noNetworkConnectionMessage');
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
                        buttonLabel: buttonLabel,
                        buttonCallback: function() {
                            showAlertModal = true;
                        }
                    }
                },
                closeCallback: function() {
                    showAlertModal = true;
                }
            });
            showAlertModal = false;
        };
    }
});