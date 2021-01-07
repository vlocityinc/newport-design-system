import { createElement } from 'lwc';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ComboboxStateChangedEvent, SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction/sobjectOrSobjectCollectionPicker';
import * as store from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { INTERACTION_COMPONENTS_SELECTORS, ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_LOOKUP
};

const getFerovResourcePicker = (sobjectPickerComponent) =>
    sobjectPickerComponent.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER);

const createComponentUnderTest = (props?: {}) => {
    const el = createElement('builder_platform_interaction-sobject-or-sobject-collection-picker', {
        is: SObjectOrSObjectCollectionPicker
    });
    Object.assign(el, mockDefaultConfig, props);
    document.body.appendChild(el);
    return el;
};

describe('sobject-or-sobject-collection-picker', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('base resource picker', () => {
        let ferovPicker, sobjectOrSobjectCollectionPicker;
        beforeAll(() => {
            sobjectOrSobjectCollectionPicker = createComponentUnderTest();
            ferovPicker = getFerovResourcePicker(sobjectOrSobjectCollectionPicker);
        });

        it('contains a ferov resource picker', () => {
            expect(ferovPicker).not.toBeNull();
        });

        it('creates proper sobjectVariableComboboxConfig when disableFieldDrilldown set as false', () => {
            sobjectOrSobjectCollectionPicker.disableFieldDrilldown = false;
            expect(sobjectOrSobjectCollectionPicker.sobjectVariableComboboxConfig.enableFieldDrilldown).toBe(true);
        });

        it('creates proper sobjectVariableComboboxConfig when disableFieldDrilldown set as true', () => {
            sobjectOrSobjectCollectionPicker.disableFieldDrilldown = true;
            expect(sobjectOrSobjectCollectionPicker.sobjectVariableComboboxConfig.enableFieldDrilldown).toBe(false);
        });

        it('defaults disableFieldDrilldown to false', () => {
            expect(createComponentUnderTest().disableFieldDrilldown).toBe(false);
        });

        it('defaults sObjectCollectionCriterion to SOBJECT', () => {
            expect(sobjectOrSobjectCollectionPicker.sobjectCollectionCriterion).toBe(
                SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
            );
        });
    });

    describe('sobject variables', () => {
        it('should set the value', () => {
            const ferovPicker = getFerovResourcePicker(
                createComponentUnderTest({
                    value: store.accountSObjectVariable.guid
                })
            );
            expect(ferovPicker.value.value).toEqual(store.accountSObjectVariable.guid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectVariable.name));
        });
    });

    describe('sobject collection variables', () => {
        it('should set the value', () => {
            const ferovPicker = getFerovResourcePicker(
                createComponentUnderTest({
                    value: store.accountSObjectCollectionVariable.guid
                })
            );
            expect(ferovPicker.value.value).toEqual(store.accountSObjectCollectionVariable.guid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectCollectionVariable.name));
        });
    });

    describe('sobject and sobject collection variables', () => {
        it('should set the value as sobject collection variable', () => {
            const ferovPicker = getFerovResourcePicker(
                createComponentUnderTest({
                    value: store.accountSObjectCollectionVariable.guid
                })
            );
            expect(ferovPicker.value.value).toEqual(store.accountSObjectCollectionVariable.guid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectCollectionVariable.name));
        });

        it('should set the value as sobject variable', () => {
            const ferovPicker = getFerovResourcePicker(
                createComponentUnderTest({
                    value: store.accountSObjectVariable.guid
                })
            );
            expect(ferovPicker.value.value).toEqual(store.accountSObjectVariable.guid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectVariable.name));
        });
    });

    describe('handling value change event from combobox', () => {
        it("should fire 'SObjectVariableChangedEvent'", async () => {
            const sobjectPicker = createComponentUnderTest({
                value: store.accountSObjectCollectionVariable.guid
            });
            const ferovResourcePicker = getFerovResourcePicker(sobjectPicker);
            const newParamValue = store.accountSObjectVariable.guid;
            await ticks(1);
            const eventCallback = jest.fn();
            sobjectPicker.addEventListener(SObjectReferenceChangedEvent.EVENT_NAME, eventCallback);
            ferovResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(null, newParamValue));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: { value: newParamValue }
            });
        });
    });
    describe('pills', () => {
        it('does not support pills by default', () => {
            const sobjectOrSobjectCollectionPicker = createComponentUnderTest();
            expect(sobjectOrSobjectCollectionPicker.isPillSupported).toBe(false);
        });
    });
});
