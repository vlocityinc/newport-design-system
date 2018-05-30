import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { decorateScreen, undecorateScreen, isScreen } from 'builder_platform_interaction-screen-editor-utils';
import { screenReducer } from './screen-reducer';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { deepCopy } from 'builder_platform_interaction-store-lib';

/*
 * Screen editor container and template (3-col layout) for palette, canvas and property editor
 */
export default class ScreenEditor extends Element {
    @track screen;
    @track selectedNode;

    @api get node() {
        return this.screen;
    }

    @api set node(newValue) {
        this.screen = decorateScreen(unwrap(newValue)) || {};
        this.setSelectedNode(this.screen);
    }

    /*
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return undecorateScreen(deepCopy(unwrap(this.screen))); // Returning a deep copy because removing the "decoration" causes a rerender that fails because of the missing decoration (W-4947242)
    }

    /*
     * public api function to run the rules from assignment validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.screen = screenReducer(this.screen, event);
        return getErrorsFromHydratedElement(this.screen);
    }

    setSelectedNode(value) {
        this.selectedNode = unwrap(value); // Unwrapping to get rid of the double proxy warning message (Property "selectedNode" is set to a non-trackable object...)
    }

    handleSave = (/* event */) => {}

    handleAddScreenField = (/* event */) => { // TODO Move to reducer
        /*
        addFieldToScreen(this.screen, event.detail.elementType);
        */
    }

    handleDeleteScreenElement = (event) => {
        const element = event.screenElement;
        if (element.guid === this.screen.guid) { // Delete footer or header
            this.handlePropertyChanged(new PropertyChangedEvent(event.property, false, null, null, null, true));
        } else {
            this.screen = screenReducer(this.screen, event);
            this.setSelectedNode(this.screen);
        }
    }

    handlePropertyChanged = (event) => {
        const screenElement = screenReducer(this.screen, event);

        this.screen = screenElement;
        if (isScreen(this.selectedNode)) {
            this.setSelectedNode(this.screen);
        } else {
            this.setSelectedNode(this.screen.getFieldByGUID(this.selectedNode.guid));
        }
    }

    handleSelectScreenElement = (event) => {
        const elem = event.screenElement;
        if (elem && elem.guid !== this.screen.guid) {
            this.setSelectedNode(this.screen.getFieldByGUID(elem.guid));
        } else {
            this.setSelectedNode(this.screen);
        }
    }

    handleEditScreen = (/* event */) => {
        this.setSelectedNode(this.screen);
    }

    handleDeselectScreenElement = (/* event */) => {
        this.setSelectedNode(this.screen);
        this.template.querySelector('builder_platform_interaction-screen-editor-canvas').clearSelection();
    }
}