import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './eventDrivenJourneyEditorLabels';
import { eventDrivenJourneyReducer } from './eventDrivenJourneyReducer';

const nodeConfig = getConfigForElementType(ELEMENT_TYPE.START_ELEMENT).nodeConfig;

export default class EventDrivenJourneyEditor extends LightningElement {
    labels = LABELS;

    @track
    startElement!: UI.Start;

    @api
    editorParams;

    @api
    mode: string | undefined;

    @api
    processType: string | undefined;

    _lastEntityType = null;

    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        this.startElement = newValue || {};
    }

    /**
     * public api function to return the node
     *
     * @returns node
     */
    @api getNode(): UI.Start {
        return this.startElement;
    }

    get iconName() {
        return nodeConfig?.iconName;
    }

    get iconShape() {
        return nodeConfig?.iconShape;
    }

    get iconBackgroundColor() {
        return nodeConfig?.iconBackgroundColor;
    }

    get editorHeader() {
        return this.editorParams?.panelConfig?.titleForModal;
    }

    handleFocusOut(event) {
        event.stopPropagation();
        const newEntity = event.target.value;
        if (newEntity !== this._lastEntityType) {
            this.updateProperty('object', newEntity);
            this._lastEntityType = newEntity;
        }
    }

    updateProperty(propertyName, newValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue);
        this.startElement = eventDrivenJourneyReducer(this.startElement, propChangedEvent);
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }
}
