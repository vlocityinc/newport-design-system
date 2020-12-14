// @ts-nocheck
import { BaseCommand } from './baseCommand';
const commandName = 'arrowup';
export class ArrowUp extends BaseCommand {
    /**
     * Arrow Up key command
     */
    constructor(callback) {
        super(callback, commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
