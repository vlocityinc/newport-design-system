({
    init : function(cmp) {
        var serverDataLibInit = cmp.find('serverDataLibInit');
        var serverDataLib = serverDataLibInit.find('serverDataLib');
        var serverActionType = serverDataLib.SERVER_ACTION_TYPE.GET_CONTEXT;
        serverDataLib.fetch(serverActionType, this.getContextCallback);
    },

    getContextCallback : function(response) {
        if (response.error) {
            // TODO: handle error case
        } else {
            // The root is builder_platform_interaction:flowBuilder.
            var cmp = $A.getRoot();
            var contextLib = cmp.find('contextLib');
            contextLib.setContext(response.data);
            cmp.set('v.ready', true);

            // show welcome mat
            var userPreferencesLib = cmp.find('userPreferencesLib');
            var flowId = cmp.get('v.flowId');
            if(userPreferencesLib.getWelcomeMatPreference() && !flowId) {
                cmp.get('c.createWelcomeMat').run();
            }
        }
    },

    createWelcomeMat : function() {
        var welcomeMat = $A.newCmp({ componentDef: 'builder_platform_interaction:welcomeMat'});
        $A.get('e.ui:createPanel').setParams({
            panelType: 'welcomeMatModal',
            visible: true,
            panelConfig: {
                body: welcomeMat,
                bodyClass: 'slds-p-around_none',
            }
        }).fire();
    },
})