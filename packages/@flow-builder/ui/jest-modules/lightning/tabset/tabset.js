import { Element, api } from 'engine';

export default class LightningTabSet extends Element {
    @api title;
    @api variant = jest.fn();
}