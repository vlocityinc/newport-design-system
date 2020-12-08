// @ts-nocheck
import { BaseCommand } from './baseCommand';
export class SpaceCommand extends BaseCommand {
    /**
     * Command used to navigate various parts of flow builder
     */
    constructor(callback) {
        super(callback, 'spacecommand', '', false);
    }
}
