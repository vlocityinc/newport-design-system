({
    init : function(cmp) {
        var serverDataLibInit = cmp.find('serverDataLibInit');
        var serverDataLib = serverDataLibInit.find('serverDataLib');
        var serverActionType = serverDataLib.SERVER_ACTION_TYPE.GET_CONTEXT;
        serverDataLib.fetch(serverActionType, this.getContextCallback);

        var imageLib = cmp.find('imageLib');
        imageLib.preloadImages();
    },

    getContextCallback : function(response) {
        if (response.error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else {
            // The root is builder_platform_interaction:flowBuilder.
            var cmp = $A.getRoot();
            var contextLib = cmp.find('contextLib');
            contextLib.setContext(response.data);
            cmp.set('v.ready', true);

            // show welcome mat
            var userPreferencesLib = cmp.find('userPreferencesLib');
            if(userPreferencesLib.getWelcomeMatPreference()) {
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
                // override close behavior
                closeAction: function(panel) {
                    var welcomeMatCmp = welcomeMat.get('v.body')[0];
                    if (welcomeMatCmp) {
                        var checkbox = welcomeMatCmp.find('checkbox');
                        if (checkbox) {
                            var checkboxValue = checkbox.get("v.checked");
                            // The root is builder_platform_interaction:flowBuilder.
                            var userPreferencesLib = $A.getRoot().find('userPreferencesLib');
                            userPreferencesLib.setWelcomeMatPreference(!checkboxValue);
                        }
                    }
                    panel.close();
                }
            },
            // set focus to the lightning:button
            onAfterShow: function() {
                var welcomeMatCmp = welcomeMat.get('v.body')[0];
                if (welcomeMatCmp) {
                    var button = welcomeMatCmp.find('button');
                    if (button) {
                        button.focus();
                    }
                }
            }
        }).fire();
    },
})