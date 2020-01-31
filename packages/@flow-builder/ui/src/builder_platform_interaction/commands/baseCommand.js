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

    async execute(event) {
        if (this.callback) {
            this.callback(event);
        }
    }
}
