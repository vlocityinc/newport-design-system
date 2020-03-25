import { LightningElement, track, api } from 'lwc';

import {
    AddElementEvent,
    EditElementEvent,
    AddNodeEvent,
    UpdateNodeEvent,
    ClosePropertyEditorEvent
} from 'builder_platform_interaction/events';
import { LABELS } from './propertyEditorPanelLabels';

const PROPERTY_EDITOR_CLASS = '.inline-property-editor';

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

    handleOk() {
        const propertyEditorComponent = this.template.querySelector(PROPERTY_EDITOR_CLASS);
        const validationErrors = propertyEditorComponent.validate();

        if (validationErrors.length === 0) {
            const mode = this.params.attr.bodyComponent.attr.mode;

            if (mode === AddElementEvent.EVENT_NAME) {
                const addNodeEvent = new AddNodeEvent(propertyEditorComponent.getNode());
                this.dispatchEvent(addNodeEvent);
            } else if (mode === EditElementEvent.EVENT_NAME) {
                const updateNodeEvent = new UpdateNodeEvent(propertyEditorComponent.getNode());
                this.dispatchEvent(updateNodeEvent);
            } else {
                throw Error('Unsupported mode: ' + mode);
            }

            const closePropertyEditorEvent = new ClosePropertyEditorEvent();
            this.dispatchEvent(closePropertyEditorEvent);
        }
    }

    handleCancel() {
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    }
}
