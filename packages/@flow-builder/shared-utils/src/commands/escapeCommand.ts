import { BaseCommand } from './baseCommand';
const commandName = 'escapecommand';
export class EscapeCommand extends BaseCommand {
    /**
     * Command used to close contextual menus in auto layout
     */
    constructor(callback: Function) {
        super(callback, commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
