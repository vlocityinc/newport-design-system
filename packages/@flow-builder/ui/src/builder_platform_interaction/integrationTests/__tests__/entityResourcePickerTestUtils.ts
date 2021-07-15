import { deepQuerySelector, INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import EntityResourcePicker from 'builder_platform_interaction/entityResourcePicker';
import { ComboboxTestComponent } from './comboboxTestUtils';
import { TestComponent } from './testComponent';

export class EntityResourcePickerTestComponent extends TestComponent<EntityResourcePicker> {
    public getCombobox() {
        return new ComboboxTestComponent(
            deepQuerySelector(this.element, [
                INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
                INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
            ])
        );
    }
}
