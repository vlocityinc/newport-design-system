import { deepQuerySelector } from 'builder_platform_interaction/builderTestUtils';

export abstract class TestComponent<E> {
    private _element: E & HTMLElement;

    constructor(element: E & HTMLElement) {
        if (!element) {
            throw new Error('element needs to be defined');
        }
        this._element = element;
    }

    get element() {
        return this._element as any;
    }

    deepQuerySelector(selectors: string[]) {
        return deepQuerySelector(this.element, selectors);
    }
}
