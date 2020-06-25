// @ts-nocheck
import { CommandRegistry, KeyboardShortcutServiceImpl } from 'builder_framework/command';

export class KeyboardInteractions {
    commandRegistry;
    keyboardService;

    constructor() {
        this.commandRegistry = new CommandRegistry();
        this.keyboardService = new KeyboardShortcutServiceImpl(this.commandRegistry);
    }

    keydownListener = event => {
        this.keyboardService.handleKeydown(event);
    };

    addKeyDownEventListener(template) {
        template.addEventListener('keydown', this.keydownListener);
    }

    removeKeyDownEventListener(template) {
        template.removeEventListener('keydown', this.keydownListener);
    }

    setupCommandAndShortcut(command, shortcutKeys) {
        this.commandRegistry.registerCommands([command]);
        this.keyboardService.registerShortcuts([
            {
                shortcut: shortcutKeys,
                commandId: command.id
            }
        ]);
    }
}
