import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import EntityResourcePicker from 'builder_platform_interaction/entityResourcePicker';
import LabelDescription from 'builder_platform_interaction/labelDescription';
import OutputResourcePicker from 'builder_platform_interaction/outputResourcePicker';
import RecordCreateEditor from 'builder_platform_interaction/recordCreateEditor';
import RecordInputOutputAssignments from 'builder_platform_interaction/recordInputOutputAssignments';
import RecordStoreFieldsSelection from 'builder_platform_interaction/recordStoreOptions';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction/sobjectOrSobjectCollectionPicker';
import { EntityResourcePickerTestComponent } from './entityResourcePickerTestUtils';
import { changeLightningRadioGroupValue } from './integrationTestUtils';
import { LabelDescriptionComponentTest } from './labelDescriptionTestUtils';
import { RecordInputOutputAssignmentsComponentTest } from './recordInputOutputAssignmentsTestUtils';
import { ResourcePickerTestComponent } from './resourcePickerTestUtils';
import { TestComponent } from './testComponent';

export class RecordCreateEditorComponentTest extends TestComponent<RecordCreateEditor> {
    public getLabelDescription() {
        return new LabelDescriptionComponentTest(
            this.element.shadowRoot!.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.LABEL_DESCRIPTION
            ) as LabelDescription & HTMLElement
        );
    }

    public getSObjectOrSObjectCollectionPicker() {
        const element = this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
        ) as (SObjectOrSObjectCollectionPicker & HTMLElement) | null;
        if (!element) {
            return null;
        }
        return new ResourcePickerTestComponent<SObjectOrSObjectCollectionPicker>(element, [
            INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
        ]);
    }

    public getSObjectOrSObjectCollectionPickerCombobox() {
        return this.getSObjectOrSObjectCollectionPicker()?.getCombobox();
    }

    public getEntityResourcePicker() {
        const entityResourcePickerElement = this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER
        ) as (EntityResourcePicker & HTMLElement) | null;
        if (!entityResourcePickerElement) {
            return null;
        }
        return new EntityResourcePickerTestComponent(entityResourcePickerElement);
    }

    public async selectEntity(apiName: string) {
        const entityResourcePicker = this.getEntityResourcePicker();
        if (!entityResourcePicker) {
            return;
        }
        await entityResourcePicker.getCombobox().typeLiteralValue(apiName);
    }

    public getRecordStoreOptionElement() {
        return this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION
        ) as RecordStoreFieldsSelection & HTMLElement;
    }

    public getRecordStoreOptionRadioGroupElements() {
        return this.getRecordStoreOptionElement().shadowRoot!.querySelectorAll(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP
        );
    }

    public async clickUseSeparateVariables() {
        const radioGroupElements = this.getRecordStoreOptionRadioGroupElements();
        if (radioGroupElements[1]) {
            changeLightningRadioGroupValue(radioGroupElements[1], 'separateVariables');
            await ticks(1);
        }
    }

    public async clickCreateMultipleRecords() {
        const radioGroupElements = this.getRecordStoreOptionRadioGroupElements();
        changeLightningRadioGroupValue(radioGroupElements[0], 'allRecords');
        await ticks(1);
    }

    public getFieldsAssignments() {
        const element = this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS
        ) as (RecordInputOutputAssignments & HTMLElement) | null;
        if (!element) {
            return null;
        }
        return new RecordInputOutputAssignmentsComponentTest(element);
    }

    public getOutputResourcePicker() {
        const element = this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.OUTPUT_RESOURCE_PICKER
        ) as (OutputResourcePicker & HTMLElement) | null;
        if (!element) {
            return null;
        }
        return new ResourcePickerTestComponent<OutputResourcePicker>(element, [
            INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER
        ]);
    }

    public getManuallyAssignVariablesCheckboxElement() {
        return this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.MANUALLY_ASSIGN_VARIABLES_CHECKBOX
        );
    }

    public isManuallyAssignVariables() {
        const component = this.getManuallyAssignVariablesCheckboxElement();
        if (!component) {
            return false;
        }
        return (component.shadowRoot!.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT) as any).checked;
    }
}
