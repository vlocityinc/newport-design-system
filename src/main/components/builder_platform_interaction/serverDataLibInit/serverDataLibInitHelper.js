({
    showAlertModal: true,
    /**
     * Generic function to get data from server using this component. It sets the function on server-data-lib.js
     * @param cmp
     */
    initializeFetch: function(cmp, helper) {
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
                    var error = result.getError();
                    if (executeCallback) {
                        var status = result.getState();
                        if (status === 'SUCCESS') {
                            return callback({
                                data: result.getReturnValue()
                            });
                        } else if (status === 'ERROR') {
                            var gackId;
                            if (!messageForErrorModal && error && error[0]) {
                                messageForErrorModal = (error[0].data && error[0].data.contextMessage);
                                gackId = error[0].id;
                            }
                            helper.errorCallback(cmp, helper, disableErrorModal, messageForErrorModal, gackId);
                        } else if (status === 'INCOMPLETE') {
                            helper.offlineCallback(cmp, helper);
                        }
                        return callback({
                            error: error
                        });
                    }
                });
                $A.enqueueAction(action);
            }
        });

        var serverDataLib = cmp.find('serverDataLib');
        if (!$A.util.isUndefinedOrNull(serverDataLib)) {
            serverDataLib.setAuraFetch(auraFetch);
        }
    },

    /**
     * This function is called when network gets disconnected while a server call is in progress. 
     */
    offlineCallback: function(cmp, helper) {
        var headerTitle, bodyTextOne;
        if (helper.showAlertModal) {
            headerTitle = $A.get('$Label.FlowBuilderAlertModal.noNetworkConnectionTitle');
            bodyTextOne = $A.get('$Label.FlowBuilderAlertModal.noNetworkConnectionMessage');                    
            helper.openAlertModal(cmp, headerTitle, bodyTextOne, helper.offlineAlertModalCloseCallback(helper));
            helper.showAlertModal = false;                   
        }
    },
    /**
     * This function is called when a server call returns an error. 
     * It opens a modal with errorMessage if disableErrorModal is false.
     * Error argument could be used for setting custom error message.
     */
    errorCallback: function(cmp, helper, disableErrorModal, errorMessage, gackId) {
        var headerTitle, bodyTextOne;
        if (helper.showAlertModal && !disableErrorModal) {
            headerTitle = $A.get('$Label.FlowBuilderAlertModal.errorTitle');
            bodyTextOne = helper.setErrorMessage(errorMessage, gackId);
            helper.openAlertModal(cmp, headerTitle, bodyTextOne, helper.errorAlertModalCloseCallback(helper));
            helper.showAlertModal = false;                            
        }
    },

    /**
     * Helper function to set the error message. It appends the gack id if it is defined.
     */
    setErrorMessage: function(errorMessage, gackId) {
        var newErrorMessage = errorMessage ? errorMessage : $A.get('$Label.FlowBuilderAlertModal.errorMessage');
        if (gackId) {
            newErrorMessage += ' ' + $A.util.format($A.get('$Label.FlowBuilderAlertModal.errorCode'), gackId);
        }
        return newErrorMessage;
    },

    /**
     * This function is called user closes the error alert modal.
     * A function is returned with helper as closure 
     */
    errorAlertModalCloseCallback: function(helper) {
        function setShowAlertModal() {
            helper.showAlertModal = true;
        }
        return setShowAlertModal;
    },

    /**
     * This function is called user closes the offline alert modal.
     * A function is returned with helper as closure 
     */ 
    offlineAlertModalCloseCallback: function(helper) {
        function setShowAlertModal() {
            helper.showAlertModal = true;
        }    
        return setShowAlertModal;
    }, 

    /**
     * Helper function to open an alert modal
     */
    openAlertModal: function(cmp, headerTitle, bodyTextOne, buttonCloseCallback) {
        var buttonVariant, buttonLabel, alertModal;
        alertModal = cmp.find('builderUtils').invokeModal;
        buttonVariant = 'Brand';
        buttonLabel = $A.get('$Label.FlowBuilderAlertModal.okayButtonLabel');
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
                    buttonCallback: buttonCloseCallback
                }
            },
            closeCallback: buttonCloseCallback
        });
    }
});