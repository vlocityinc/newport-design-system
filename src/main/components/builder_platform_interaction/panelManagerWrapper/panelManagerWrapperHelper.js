({
    init: function (cmp) {
        var that = this;
        var keyboardInteractions = new this.sharedUtils.keyboardInteractionUtils.KeyboardInteractions();
        // Move Focus To Editor Toolbox Command
        var focusOnDockingPanelCommand = new this.sharedUtils.commands.FocusOnDockingPanelCommand(function () {
            that.handleFocusOnToolbox();
        });
        var focusOnDockingPanelShortcut = this.app.shortcuts.focusOnDockingPanel;
        keyboardInteractions.setupCommandAndShortcut(focusOnDockingPanelCommand, focusOnDockingPanelShortcut);
        // Display shortcuts Command
        var displayShortcutsCommand = new this.sharedUtils.commands.DisplayShortcutsCommand(function () {
            that.builderUtils.invokeKeyboardHelpDialog();
        });
        var displayShortcutKeyCombo = this.app.shortcuts.displayShortcuts;
        keyboardInteractions.setupCommandAndShortcut(displayShortcutsCommand, displayShortcutKeyCombo);
        cmp.set('v.keyboardInteractions', keyboardInteractions);
    },
    handleFocusOnToolbox: function (cmp) {
        var editor = document.querySelector('builder_platform_interaction-editor');
        editor.handleFocusOnToolbox();
    }
});
