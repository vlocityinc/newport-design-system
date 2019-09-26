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

    addKeyDownEventListener() {
        document.addEventListener('keydown', event => {
            this.keyboardService.handleKeydown(event);
        });
    }

    removeKeyDownEventListener() {
        document.removeEventListener('keydown');
    }

    setupCommandAndShortcut(command, shortcutKeys) {
        this.commandRegistry.registerCommands([command]);
        this.keyboardService.registerShortcuts([{
          shortcut: shortcutKeys,
          commandId: command.id
        }]);
    }
}