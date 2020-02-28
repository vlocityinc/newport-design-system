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
        this.editorParams = params;
        this.title = params.panelConfig.titleForModal;
        this.loadCtor(params.attr.bodyComponent.className);
    }

    @track
    title;

    @track
    ctor;

    @track messages = {};

    async loadCtor(className) {
        const module = await import(className);

        this.ctor = module.default;
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
