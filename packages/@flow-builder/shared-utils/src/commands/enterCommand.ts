// @ts-nocheck
import { BaseCommand } from './baseCommand';
const commandName = 'entercommand';
export class EnterCommand extends BaseCommand {
    /**
     * Command used to navigate various parts of flow builder
     */
    constructor(callback) {
        super(callback, commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
