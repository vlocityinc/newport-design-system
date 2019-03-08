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
        }
    },
})