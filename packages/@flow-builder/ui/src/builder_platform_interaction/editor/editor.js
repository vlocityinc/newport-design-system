import { Element, unwrap } from 'engine';
import {SAVE_FLOW} from 'builder_platform_interaction-constant';

/**
 * Editor component for flow builder. This is the top-level smart component for
 * flow builder. It is responsible for maintaining the overall state of app and
 * handle event from various child components.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
 * @since 214
 */
export default class Editor extends Element {
    @api flow;

    @track
    appState = {
        flow: {}
    };

    @api
    get flow() {
        return this.appState.flow;
    }

    @api
    set flow(newValue = {}) {
        this.appState.flow = newValue;
    }

    /**
     * Handle save event fired by a child component. Fires another event
     * containing flow information, which is handled by container.cmp.
     *
     */
    handleSaveFlow = () => {
        const saveEvent = new CustomEvent(
            SAVE_FLOW,
            {
                composed: true
            },
            {
                detail: unwrap(this.appState.flow)
            }
        );
        this.dispatchEvent(saveEvent);
    };
}