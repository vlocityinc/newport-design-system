import { createElement } from 'lwc';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { ComboboxStateChangedEvent, SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction/sobjectOrSobjectCollectionPicker';
import { sObjectOrSObjectCollectionByEntitySelector } from 'builder_platform_interaction/selectors';
import * as store from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_LOOKUP
};

const selectors = {
    ferovResourcePicker: 'builder_platform_interaction-ferov-resource-picker'
};

const getFerovResourcePicker = sobjectPickerComponent => {
    return sobjectPickerComponent.shadowRoot.querySelector(selectors.ferovResourcePicker);
};

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-sobject-or-sobject-collection-picker', {
        is: SObjectOrSObjectCollectionPicker
    });
    Object.assign(el, mockDefaultConfig, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        sObjectOrSObjectCollectionByEntitySelector: jest.fn()
    };
});

describe('sobject-or-sobject-collection-picker', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('base resource picker', () => {
        let ferovPicker, sobjectOrSobjectCollectionPicker;
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([]));
            sobjectOrSobjectCollectionPicker = createComponentUnderTest();
            ferovPicker = getFerovResourcePicker(sobjectOrSobjectCollectionPicker);
        });

        it('contains a ferov resource picker', () => {
            expect(ferovPicker).not.toBeNull();
        });

        it('defaults sObjectCollectionCriterion to SOBJECT', () => {
            expect(sobjectOrSobjectCollectionPicker.sobjectCollectionCriterion).toBe(
                SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT
            );
        });
    });

    describe('sobject variables', () => {
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
                jest.fn().mockReturnValue([store.accountSObjectVariable])
            );
        });
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
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
                jest.fn().mockReturnValue([store.accountSObjectCollectionVariable])
            );
        });
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
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(
                jest.fn().mockReturnValue([store.accountSObjectVariable, store.accountSObjectCollectionVariable])
            );
        });
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
});
