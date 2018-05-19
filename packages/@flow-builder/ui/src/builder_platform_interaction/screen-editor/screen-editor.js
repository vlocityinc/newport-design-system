import { Element, api, track, unwrap } from 'engine';
import { dehydrate } from 'builder_platform_interaction-data-mutation-lib';
import { createScreen, createEmptyNodeOfType } from 'builder_platform_interaction-screen-editor-utils';

/*
 * Screen editor container and template (3-col layout) for palette, canvas and property editor
 */
export default class ScreenEditor extends Element {
    @track screen;
    @track selectedNode;

    @api get node() {
        return this.screen.node;
    }

    @api set node(newValue) {
        this.screen = createScreen(dehydrate(unwrap(newValue) || {}));
        this.setSelectedNode(this.screen);
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.screen.node);
    }

    /**
     * public api function to run the rules from assignment validation library
     * @returns {object} list of errors
     */
    @api validate() {
        // TODO: Run node validation rules for all fields -- W-4947106
        return [];
    }

    setSelectedNode(value) {
        this.selectedNode = unwrap(value);
    }

    handleSave = (/* event */) => {}

    handleAddScreenField = (event) => {
        const screenFieldNode = createEmptyNodeOfType(event.detail.elementType);
        this.screen.addField(screenFieldNode);
    }

    handleDeleteScreenElement = (event) => {
        const element = event.screenElement;
        if (element.guid === this.screen.guid) {
            const propertyName = event.property;
            this.screen[propertyName] = false;
            this.selectedNode[propertyName] = false;
        } else {
            this.screen.removeField(element);
            this.setSelectedNode(this.screen);
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

    handlePropertyValueChanged = (event) => {
        if (this.selectedNode.guid !== this.screen.guid) { // A screenfield is selected
            const field = this.screen.getFieldByGUID(this.selectedNode.guid);
            field[event.property.name] = event.newValue;
        } else {
            this.screen[event.property.name] = event.newValue;
        }
    }
}