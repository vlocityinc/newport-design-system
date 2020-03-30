import { LightningElement, track, api } from 'lwc';

import { ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import { LABELS } from './propertyEditorPanelLabels';

/**
 * LWC version of the property editor, for use in lwc (as opposed to aura modal version)
 * @ScrumTeam Automation UI
 * @since 228
 */
export default class PropertyEditorPanel extends LightningElement {
    editorParams;
    labels = LABELS;

    @api
    get params() {
        return this.editorParams;
    }

    set params(params) {
        this.processParams(params);
    }

    @api
    nodeUpdateCallback;

    @track
    title;

    ctor;

    @track messages = {};

    /**
     * Import the constructor and update the component params
     *
     * Note: all of this needs to happen in a single tick, otherwise the component
     * constructor and params could be out of sync (old constructor with new params
     * or new constructor with old params)
     * @param params
     * @return {Promise<void>}
     */
    // eslint-disable-next-line @lwc/lwc/no-async-await
    async processParams(params) {
        const module = await import(params.attr.bodyComponent.className);

        this.ctor = module.default;
        this.editorParams = params;
        this.title = params.panelConfig.titleForModal;
    }

    setPropertyEditorTitle(event) {
        this.title = event.detail.title;
    }

    handleClose() {
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    }

    /**
     * Handle changes to any property in the property editor
     * @param event
     */
    handleUpdateNode(event) {
        const node = event.detail.node;

        if (node && this.nodeUpdateCallback) {
            this.nodeUpdateCallback(node);
        }
    }
}
