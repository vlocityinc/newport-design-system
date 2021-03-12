// @ts-nocheck
/**
 * Used to report that the debug panel filter option selections have been changed
 */
const eventName = 'panelfilter';

export class DebugPanelFilterEvent extends CustomEvent<{}> {
    constructor(selection: Object = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                selection
            }
        });
    }

    static EVENT_NAME = eventName;
}
