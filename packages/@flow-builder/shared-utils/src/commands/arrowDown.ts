// @ts-nocheck
import { BaseCommand } from './baseCommand';
export class ArrowDown extends BaseCommand {
    /**
     * Arrow Down key command
     */
    constructor(callback) {
        super(callback, 'arrowdown', '', false);
    }
}
