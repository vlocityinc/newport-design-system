// @ts-nocheck
import { BaseCommand } from './baseCommand';
const commandName = 'entercommand';
export class EnterCommand extends BaseCommand {
    /**
     * Command used to navigate various parts of flow builder
     *
     * @param {Function} callback The function to invoke.
     */
    constructor(callback) {
        super(callback, commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
