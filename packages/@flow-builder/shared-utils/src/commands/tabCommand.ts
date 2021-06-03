import { BaseCommand } from './baseCommand';
const commandName = 'tabcommand';
const shiftCommandName = 'shifttabcommand';
export class TabCommand extends BaseCommand {
    /**
     * Command used to navigate contextual menus in auto layout
     *
     * @param {Function} callback The function to invoke.
     * @param {boolean} shift - true is shift button is pushed
     */
    constructor(callback: Function, shift: boolean) {
        super(callback, shift ? shiftCommandName : commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
