({
    init: function (cmp) {
        var loggingUtils = cmp.find('sharedUtils').loggingUtils;
        loggingUtils.logPerfTransactionStart('ServerDataLib');
        var serverDataLibInit = cmp.find('serverDataLibInit');
        var serverDataLib = serverDataLibInit.find('serverDataLib');
        var serverActionType = serverDataLib.SERVER_ACTION_TYPE.GET_CONTEXT;
        if (!cmp.get('v.builderType')) {
            cmp.set('v.builderType', 'FlowBuilder');
        }
        serverDataLib.fetch(serverActionType, this.getContextCallback, {
            builderType: cmp.get('v.builderType'),
            flowId: cmp.get('v.flowId'),
            processType: cmp.get('v.processType'),
            triggerType: cmp.get('v.triggerType'),
            recordTriggerType: cmp.get('v.recordTriggerType'),
            startObject: cmp.get('v.startObject'),
            hasAsyncPath: cmp.get('v.hasAsyncPath')
        });

        var imageLib = cmp.find('imageLib');
        imageLib.preloadImages();
        loggingUtils.logPerfTransactionEnd('ServerDataLib', {
            context: {
                flowId: cmp.get('v.flowId'),
                processType: cmp.get('v.processType'),
                triggerType: cmp.get('v.triggerType')
            }
        });
    },

    getContextCallback: function (response) {
        if (response.error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else {
            // The root is builder_platform_interaction:flowBuilder.
            var cmp = $A.getRoot();
            var contextLib = cmp.find('contextLib');
            contextLib.setContext(response.data);
            var builderConfig = response.data.builderConfig ? response.data.builderConfig : {};
            var complianceBannerEnabled = response.data.access
                ? response.data.access.orgHasComplianceBannerEnabled
                : false;
            cmp.set('v.builderConfig', builderConfig);
            cmp.set('v.complianceBannerEnabled', complianceBannerEnabled);
            cmp.set('v.ready', true);
        }
    },
    setErrorMessage: function (errorMessage, gackId) {
        var newErrorMessage = errorMessage ? errorMessage : $A.get('$Label.FlowBuilderAlertModal.errorMessage');
        if (gackId) {
            newErrorMessage += ' ' + $A.util.format($A.get('$Label.FlowBuilderAlertModal.errorCode'), gackId);
        }
        return newErrorMessage;
    },
    invokeAlertModal: function (cmp, errorMessage, gackId) {
        alertModal = cmp.find('sharedUtils').invokeModal;
        var newErrorMessage = errorMessage ? errorMessage : $A.get('$Label.FlowBuilderAlertModal.errorMessage');
        var errorId =
            gackId === 0 ? '' : ' ' + $A.util.format($A.get('$Label.FlowBuilderAlertModal.errorCode'), gackId) + '.';
        var bodyOne = $A.get('$Label.FlowBuilderAlertModal.flowPageError') + errorId;
        alertModal({
            headerData: {
                headerTitle: $A.get('$Label.FlowBuilderAlertModal.errorTitle')
            },
            bodyData: {
                bodyTextOne: bodyOne,
                bodyTextTwo: newErrorMessage,
                showBodyTwoVariant: true
            },

            footerData: {
                buttonOne: {
                    buttonLabel: $A.get('$Label.FlowBuilderAlertModal.gotItButtonLabel'),
                    buttonCallback: 'Brand'
                }
            }
        });
    },
    handleInitOnboarding: function (cmp, event, helper) {
        var appDefinition = {
            id: 'flowBuilder_app'
        };

        cmp.set('v.appDefinition', appDefinition);
        helper.initializeOnboardingManager(cmp);
    },
    initializeOnboardingManager: function (cmp) {
        var onboardingMgr = cmp.get('v.onboardingMgr')[0];
        if (!cmp.get('v.onboardingManagerInitialized')) {
            cmp.set('v.onboardingManagerInitialized', true);
            onboardingMgr && onboardingMgr.init(cmp.get('v.appDefinition'));
        } else if (cmp.get('v.isOnboardingManagerPaused')) {
            // restart processing
            cmp.set('v.isOnboardingManagerPaused', false);
            onboardingMgr && onboardingMgr.resume(cmp.get('v.appDefinition'));
        }
    }
});
