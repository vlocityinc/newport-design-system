import { Element, api } from 'engine';

export default class LightingTab extends Element {
    @api loadContent = jest.fn();
    @api label = jest.fn();
}