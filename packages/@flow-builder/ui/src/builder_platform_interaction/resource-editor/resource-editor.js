import { Element, api, track } from 'engine';

export default class ResourceEditor extends Element {
    /**
     * Internal state for the resource editor
     */
    @track resourceNode = {};
    @track object = [];

    @api
    get node() {
        return this.resourceNode;
    }

    @api
    set node(newValue) {
        this.resourceNode = newValue || {};
    }
}