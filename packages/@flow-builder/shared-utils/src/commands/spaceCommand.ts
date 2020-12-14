// @ts-nocheck
import { BaseCommand } from './baseCommand';
const commandName = 'spacecommand';
export class SpaceCommand extends BaseCommand {
    /**
     * Command used to navigate various parts of flow builder
     */
    constructor(callback) {
        super(callback, commandName, '', false);
    }
    static COMMAND_NAME = commandName;
}
