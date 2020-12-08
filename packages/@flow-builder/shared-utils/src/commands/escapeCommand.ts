import { BaseCommand } from './baseCommand';
export class EscapeCommand extends BaseCommand {
    /**
     * Command used to close contextual menus in auto layout
     */
    constructor(callback: Function) {
        super(callback, 'escapecommand', '', false);
    }
}
