// @ts-nocheck
import { BaseCommand } from './baseCommand';
export class EnterCommand extends BaseCommand {
    /**
     * Command to select visual picker tile (free-form or auto-layout) on the welcome mat
     */
    constructor(callback) {
        super(callback, 'entercommand', false);
    }
}
