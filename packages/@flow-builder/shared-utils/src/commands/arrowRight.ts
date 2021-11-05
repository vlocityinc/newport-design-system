import { BaseCommand } from './baseCommand';
const commandName = 'arrowright';

export class ArrowRight extends BaseCommand {
    /**
     * Arrow Up key command
     *
     * @param callback The function to invoke.
     */
    constructor(callback: Function) {
        super(callback, commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
