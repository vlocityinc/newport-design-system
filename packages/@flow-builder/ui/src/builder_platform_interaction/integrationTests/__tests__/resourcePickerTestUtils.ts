import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { ComboboxTestComponent } from './comboboxTestUtils';
import { TestComponent } from './testComponent';

export class ResourcePickerTestComponent<E> extends TestComponent<E> {
    private _baseResourcePickerSelectors: string[];

    constructor(element: E & HTMLElement, baseResourcePickerSelectors: string[]) {
        super(element);
        this._baseResourcePickerSelectors = baseResourcePickerSelectors;
    }

    public getCombobox() {
        return new ComboboxTestComponent(
            this.deepQuerySelector([...this._baseResourcePickerSelectors, INTERACTION_COMPONENTS_SELECTORS.COMBOBOX])
        );
    }
}
