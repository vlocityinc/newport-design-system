import {createElement} from "lwc";
import { getShadowRoot } from 'lwc-test-utils';
import { addCurlyBraces } from 'builder_platform_interaction-common-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import {
    ComboboxStateChangedEvent,
    SObjectReferenceChangedEvent,
} from 'builder_platform_interaction-events';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction-sobject-or-sobject-collection-picker';
import { sObjectOrSObjectCollectionByEntitySelector }  from 'builder_platform_interaction-selectors';
import * as store from 'mock-store-data';

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
};

const selectors = {
    ferovResourcePicker: 'builder_platform_interaction-ferov-resource-picker',
};

const getFerovResourcePicker = (sobjectPickerComponent) => {
    return getShadowRoot(sobjectPickerComponent).querySelector(selectors.ferovResourcePicker);
};

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-sobject-or-sobject-collection-picker', {
        is: SObjectOrSObjectCollectionPicker
    });
    Object.assign(el, mockDefaultConfig, props);
    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
    };
});

describe('sobject-or-sobject-collection-picker', () => {
    describe('base resource picker', () => {
        let ferovPicker;
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([]));
            ferovPicker = getFerovResourcePicker(createComponentUnderTest());
        });

        it('contains a ferov resource picker', () => {
            expect(ferovPicker).not.toBeNull();
        });
    });

    describe('sobject variables', () => {
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid]]));
        });
        it('should set the value', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest({value: store.accountSObjectVariableGuid}));
            expect(ferovPicker.value.value).toEqual(store.accountSObjectVariableGuid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectVariableDevName));
        });
    });

    describe('sobject collection variables', () => {
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectCollectionVariableGuid]]));
        });
        it('should set the value', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest({value: store.accountSObjectCollectionVariableGuid}));
            expect(ferovPicker.value.value).toEqual(store.accountSObjectCollectionVariableGuid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectCollectionVariableDevName));
        });
    });

    describe('sobject and sobject collection variables', () => {
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid], store.elements[store.accountSObjectCollectionVariableGuid]]));
        });
        it('should set the value as sobject collection variable', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest({value: store.accountSObjectCollectionVariableGuid}));
            expect(ferovPicker.value.value).toEqual(store.accountSObjectCollectionVariableGuid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectCollectionVariableDevName));
        });

        it('should set the value as sobject variable', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest({value: store.accountSObjectVariableGuid}));
            expect(ferovPicker.value.value).toEqual(store.accountSObjectVariableGuid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectVariableDevName));
        });
    });

    describe('handling value change event from combobox', () => {
        it("should fire 'SObjectVariableChangedEvent'", () => {
            const sobjectPicker = createComponentUnderTest({value: store.accountSObjectCollectionVariableGuid});
            const ferovResourcePicker = getFerovResourcePicker(sobjectPicker);
            const newParamValue = store.accountSObjectVariableGuid;
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                sobjectPicker.addEventListener(SObjectReferenceChangedEvent.EVENT_NAME, eventCallback);
                ferovResourcePicker.dispatchEvent(new ComboboxStateChangedEvent(null, newParamValue));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {value: newParamValue}});
            });
        });
    });
});