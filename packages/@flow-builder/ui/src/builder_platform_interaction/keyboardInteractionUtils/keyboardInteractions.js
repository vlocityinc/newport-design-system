import {
    CommandRegistry,
    KeyboardShortcutServiceImpl
  } from 'builder_framework/command';

export class KeyboardInteractions {
    commandRegistry;
    keyboardService;

    constructor() {
        this.commandRegistry = new CommandRegistry();
        this.keyboardService = new KeyboardShortcutServiceImpl(this.commandRegistry);
    }

    addKeyDownEventListener(template) {
        template.addEventListener('keydown', event => {
            this.keyboardService.handleKeydown(event);
        });
    }

    removeKeyDownEventListener(template) {
        template.removeEventListener('keydown');
    }

    setupCommandAndShortcut(command, shortcutKeys) {
        this.commandRegistry.registerCommands([command]);
        this.keyboardService.registerShortcuts([{
          shortcut: shortcutKeys,
          commandId: command.id
        }]);
    }
}