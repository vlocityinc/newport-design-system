import { CommandRegistry, KeyboardShortcutServiceImpl } from 'builder_framework/command';
import { BaseCommand } from '../commands/baseCommand';

export class KeyboardInteractions {
    commandRegistry;
    keyboardService;

    constructor() {
        this.commandRegistry = new CommandRegistry();
        this.keyboardService = new KeyboardShortcutServiceImpl(this.commandRegistry);
    }

    keydownListener = (event: Event) => {
        this.keyboardService.handleKeydown(event);
    };

    addKeyDownEventListener(template: Element) {
        template.addEventListener('keydown', this.keydownListener);
    }

    removeKeyDownEventListener(template: Element) {
        template.removeEventListener('keydown', this.keydownListener);
    }

    setupCommandAndShortcut(command: BaseCommand, shortcut: string) {
        this.commandRegistry.registerCommands([command]);
        this.keyboardService.registerShortcuts([
            {
                shortcut,
                commandId: command.id
            }
        ]);
    }
}
