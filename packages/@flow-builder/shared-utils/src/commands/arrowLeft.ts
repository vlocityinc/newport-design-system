import { BaseCommand } from './baseCommand';
const commandName = 'arrowleft';

export class ArrowLeft extends BaseCommand {
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
