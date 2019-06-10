import { LightningElement, api, track } from 'lwc';
import { format } from 'builder_platform_interaction/commonUtils';

/**
 * Display a label that can contain strong HTML tags.
 *
 * Label arguments will be properly escaped if needed.
 *
 * This component should be used instead of lightning-formatted-rich-text if
 * label arguments need to be escaped.
 */
export default class RichLabel extends LightningElement {
    @track
    state = {
        label: '',
        args: []
    };

    @api
    get label() {
        return this.state.label;
    }

    /**
     * Set the label. Label can contain strong html tags and include
     * placeholders.
     *
     * @param {string}
     *            value the label. Label can contain strong html tags and
     *            include placeholders. (ex : 'record {0}')
     */
    set label(value) {
        this.state.label = value;
    }

    /**
     * The arguments for the label. Arguments will be interpreted as plain text, not HTML.
     *
     * @param {string|string[]}
     *            values the arguments. '{0}' in the label will be replaced by
     *            values[0].
     */
    set args(values) {
        if (Array.isArray(values)) {
            this.state.args = values;
        } else {
            this.state.args = [values];
        }
    }

    @api
    get args() {
        return this.state.args;
    }

    get parts() {
        const splitted = this.state.label.split(/(<strong>|<\/strong>)/g);
        let strong = false;
        const parts = [];
        for (let i = 0; i < splitted.length; i++) {
            const part = splitted[i];
            if (part === '<strong>') {
                strong = true;
            } else if (part === '</strong>') {
                strong = false;
            } else {
                const text = format(part, ...this.state.args);
                parts.push({
                    strong,
                    text
                });
            }
        }
        return parts;
    }
}
