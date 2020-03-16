export class BaseCommand {
    id;
    label;
    disabled = false;

    constructor(callback, id, label, disabled) {
        this.callback = callback;
        this.id = id;
        this.label = label;
        this.disabled = disabled;
    }

    // baseCommand.js maps to command.js in the builder framework where execute returns Promise<void>
    // eslint-disable-next-line @lwc/lwc/no-async-await
    async execute(event) {
        if (this.callback) {
            this.callback(event);
        }
    }
}
