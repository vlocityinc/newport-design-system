({
    closeModal : function(cmp) {
        // The root is builder_platform_interaction:flowBuilder.
        var root = $A.getRoot();
        var userPreferencesLib = root.find('userPreferencesLib');

        var checkbox = cmp.find('checkbox');
        var checkboxValue = checkbox.get("v.checked");

        userPreferencesLib.setWelcomeMatPreference(!checkboxValue);

        // close panel
        cmp.getEvent('notify').setParams({
            action: 'closePanel',
        }).fire();
    }
})