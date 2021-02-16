import { deepQuerySelector } from 'builder_platform_interaction/builderTestUtils';

export abstract class TestComponent<E> {
    private _element: E & HTMLElement;

    constructor(element: E & HTMLElement) {
        this._element = element;
    }

    get element() {
        return this._element;
    }

    deepQuerySelector(selectors: string[]) {
        return deepQuerySelector(this.element, selectors);
    }
}
