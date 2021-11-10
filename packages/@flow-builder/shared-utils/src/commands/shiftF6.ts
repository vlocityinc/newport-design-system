import { BaseCommand } from './baseCommand';
const commandName = 'ShiftF6';
export class ShiftF6 extends BaseCommand {
    /**
     * Shift F6 command
     *
     * @param callback The function to invoke.
     */
    constructor(callback: () => void) {
        super(callback, commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
