import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { ComboboxStateChangedEvent, UpdateRelatedRecordFieldsChangeEvent } from 'builder_platform_interaction/events';
import FerovResourcePicker from 'builder_platform_interaction/ferovResourcePicker';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import RelatedRecordFieldsPicker from 'builder_platform_interaction/relatedRecordFieldsPicker';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import * as store from 'mock/storeData';
import {
    recordTriggeredFlowUIModel,
    startElement,
    updateTriggerRecordWithRelatedFields
} from 'mock/storeDataRecordTriggered';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_UPDATE
};

const getFerovResourcePicker = (sobjectPickerComponent) =>
    sobjectPickerComponent.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER
    ) as FerovResourcePicker & HTMLElement;

const createComponentUnderTest = (props?: {}) => {
    const el = createElement('builder_platform_interaction-related-record-fields-picker', {
        is: RelatedRecordFieldsPicker
    }) as RelatedRecordFieldsPicker & HTMLElement;
    Object.assign(el, mockDefaultConfig, props);
    setDocumentBodyChildren(el);
    return el;
};

describe('related-fields-picker', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(recordTriggeredFlowUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('base resource picker', () => {
        let ferovPicker: FerovResourcePicker & HTMLElement;
        let relatedRecordFieldsPicker: RelatedRecordFieldsPicker & HTMLElement;
        beforeAll(() => {
            relatedRecordFieldsPicker = createComponentUnderTest();
            ferovPicker = getFerovResourcePicker(relatedRecordFieldsPicker);
        });

        it('contains a ferov resource picker', () => {
            expect(ferovPicker).not.toBeNull();
        });

        it('has includeEntityRelatedRecordFields equals true', () => {
            expect(relatedRecordFieldsPicker.relatedRecordFieldsComboboxConfig.includeEntityRelatedRecordFields).toBe(
                true
            );
        });

        it('has disableFieldDrilldown set as true', () => {
            expect(relatedRecordFieldsPicker.relatedRecordFieldsComboboxConfig.enableFieldDrilldown).toBe(true);
        });

        it('defaults sObjectCollectionCriterion to SOBJECT', () => {
            expect(relatedRecordFieldsPicker.sobjectCollectionCriterion).toBe(
                SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
            );
        });
        it('should set the value', () => {
            const ferovPicker = getFerovResourcePicker(
                createComponentUnderTest({
                    value: updateTriggerRecordWithRelatedFields.inputReference
                })
            );
            expect(ferovPicker.value.value).toEqual(updateTriggerRecordWithRelatedFields.inputReference);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(startElement.name));
        });
    });

    describe('handling value change event from combobox', () => {
        it("should fire 'SObjectVariableChangedEvent'", async () => {
            const relatedRecordFieldsPicker = createComponentUnderTest({
                value: store.accountSObjectCollectionVariable.guid
            });
            const ferovResourcePicker = getFerovResourcePicker(relatedRecordFieldsPicker);
            const newParamValue = store.accountSObjectVariable.guid;
            await ticks(1);
            const eventCallback = jest.fn();
            relatedRecordFieldsPicker.addEventListener(UpdateRelatedRecordFieldsChangeEvent.EVENT_NAME, eventCallback);
            ferovResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(null, newParamValue));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: { value: newParamValue }
            });
        });
    });
    describe('pills', () => {
        it('does support pills by default', () => {
            const relatedRecordFieldsPicker = createComponentUnderTest();
            const ferovPicker = getFerovResourcePicker(relatedRecordFieldsPicker);
            expect(ferovPicker.isPillSupported).toBe(true);
        });
    });
});
