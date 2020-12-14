// @ts-nocheck
import { BaseCommand } from './baseCommand';
const commandName = 'arrowdown';
export class ArrowDown extends BaseCommand {
    /**
     * Arrow Down key command
     */
    constructor(callback) {
        super(callback, commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
