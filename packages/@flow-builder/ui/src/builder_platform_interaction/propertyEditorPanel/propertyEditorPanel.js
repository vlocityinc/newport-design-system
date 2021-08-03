// @ts-nocheck
import { LightningElement, track, api } from 'lwc';

import { ClosePropertyEditorEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from './propertyEditorPanelLabels';
import { PROPERTY_EDITOR_PANEL_SIZE } from 'builder_platform_interaction/elementConfig';

/**
 * LWC version of the property editor, for use in lwc (as opposed to aura modal version)
 * @ScrumTeam Automation UI
 * @since 228
 */
export default class PropertyEditorPanel extends LightningElement {
    editorParams;

    labels = LABELS;

    @api
    element;

    @api
    get params() {
        return this.editorParams;
    }

    set params(params) {
        this.processParams(params).then(() => this._focusWhenReady && this.focus());
    }

    get ready() {
        return this.element && this.editorParams;
    }

    @track
    title;

    ctor;

    @track messages = {};

    // @hack: using boolean flag to make sure that x-lazy dynamic component is loaded before calling focus
    _focusWhenReady = false;

    /**
     * Public api method used to designate focus to the appropriate element within the property editor
     */
    @api
    focus() {
        const panelContent = this.template.querySelector('x-lazy');

        if (panelContent?.focus) {
            panelContent.focus();
        } else {
            this._focusWhenReady = true;
        }
    }

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
        // eslint-disable-next-line lwc-core/no-dynamic-import
        const module = await import(params.attr.bodyComponent.className);

        this.ctor = module.default;
        this.editorParams = params;

        this.title = params.panelConfig.titleForModal;
    }

    setPropertyEditorTitle(event) {
        this.title = event.detail.title;
    }

    handleClose() {
        // dummy updateProperties to trigger set node
        this.element = updateProperties(this.element, {
            config: this.element?.config
        });

        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    }

    get propertyEditorClass() {
        let propertyEditorClass = 'property-editor-scroll ';
        propertyEditorClass += this.editorParams?.panelConfig.propertyEditorPanelSize
            ? this.editorParams?.panelConfig.propertyEditorPanelSize
            : PROPERTY_EDITOR_PANEL_SIZE.X_LARGE;
        return propertyEditorClass;
    }
}
