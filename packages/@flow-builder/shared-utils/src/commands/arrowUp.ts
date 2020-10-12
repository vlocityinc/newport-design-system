// @ts-nocheck
import { BaseCommand } from './baseCommand';
export class ArrowUp extends BaseCommand {
    /**
     * Arrow Up key command
     */
    constructor(callback) {
        super(callback, 'arrowup', '', false);
    }
}
