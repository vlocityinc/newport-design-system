import {createElement} from 'engine';
import { getShadowRoot } from 'lwc-test-utils';
import { addCurlyBraces } from 'builder_platform_interaction-common-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import {
    ComboboxValueChangedEvent,
    OutputReferenceChangedEvent,
} from 'builder_platform_interaction-events';
import SObjectOrSObjectCollectionPicker from 'builder_platform_interaction-sobject-or-sobject-collection-picker';
import { sObjectOrSObjectCollectionByEntitySelector }  from 'builder_platform_interaction-selectors';
import * as store from 'mock-store-data';

const sobjectVariable = 'SOBJECT ' + store.variable;
const sobjectCollectionVariable = 'SOBJECT COLLECTION ' + store.variable;

const mockDefaultConfig = {
    elementType: ELEMENT_TYPE.RECORD_LOOKUP,
};

const selectors = {
    ferovResourcePicker: 'builder_platform_interaction-ferov-resource-picker',
    baseResourcePicker: 'builder_platform_interaction-base-resource-picker',
};

const getFerovResourcePicker = (sobjectPickerComponent) => {
    return getShadowRoot(sobjectPickerComponent).querySelector(selectors.ferovResourcePicker);
};

const getBaseResourcePicker = (ferovPickerComponent) => {
    return getShadowRoot(ferovPickerComponent).querySelector(selectors.baseResourcePicker);
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
        let ferovPicker, baseResourcePicker;
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([]));
            ferovPicker = getFerovResourcePicker(createComponentUnderTest());
            baseResourcePicker = getBaseResourcePicker(ferovPicker);
        });

        it('contains a ferov resource picker', () => {
            expect(ferovPicker).not.toBeNull();
        });

        it('should have New Resource as first element', () => {
            const fullMenuData = baseResourcePicker.fullMenuData;
            expect(fullMenuData).toHaveLength(1);
            expect(fullMenuData[0].text).toBe('FlowBuilderExpressionUtils.newResourceLabel');
            expect(fullMenuData[0].value).toBe('%%NewResource%%');
        });
    });

    describe('sobject variables', () => {
        beforeAll(() => {
            sObjectOrSObjectCollectionByEntitySelector.mockReturnValue(jest.fn().mockReturnValue([store.elements[store.accountSObjectVariableGuid]]));
        });

        it('should have only "SOBJECT VARIABLES" category', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest());
            const fullMenuData = getBaseResourcePicker(ferovPicker).fullMenuData;
            expect(fullMenuData).toHaveLength(2);
            expect(fullMenuData[1].label).toEqual(sobjectVariable);
        });

        it('should have only one sobject variable', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest());
            const fullMenuData = getBaseResourcePicker(ferovPicker).fullMenuData;
            expect(fullMenuData[1].items).toHaveLength(1);
            expect(fullMenuData[1].items[0].value).toEqual(store.accountSObjectVariableGuid);
            expect(fullMenuData[1].items[0].text).toEqual(store.accountSObjectVariableDevName);
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

        it('should have only "SOBJECT COLLECTION VARIABLES" category', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest());
            const fullMenuData = getBaseResourcePicker(ferovPicker).fullMenuData;
            expect(fullMenuData).toHaveLength(2);
            expect(fullMenuData[1].label).toEqual(sobjectCollectionVariable);
        });

        it('should have only one sobject collection variable', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest());
            const fullMenuData = getBaseResourcePicker(ferovPicker).fullMenuData;
            expect(fullMenuData[1].items).toHaveLength(1);
            expect(fullMenuData[1].items[0].value).toEqual(store.accountSObjectCollectionVariableGuid);
            expect(fullMenuData[1].items[0].text).toEqual(store.accountSObjectCollectionVariableDevName);
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

        it('should have "SOBJECT VARIABLES" and "SOBJECT COLLECTION VARIABLES" categories', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest());
            const fullMenuData = getBaseResourcePicker(ferovPicker).fullMenuData;
            expect(fullMenuData).toHaveLength(3);
            expect(fullMenuData[1].label).toEqual(sobjectCollectionVariable);
            expect(fullMenuData[2].label).toEqual(sobjectVariable);
        });

        it('should have one sobject variable and one sobject collection variable', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest());
            const fullMenuData = getBaseResourcePicker(ferovPicker).fullMenuData;
            expect(fullMenuData[1].items).toHaveLength(1);
            expect(fullMenuData[1].items[0].value).toEqual(store.accountSObjectCollectionVariableGuid);
            expect(fullMenuData[2].items).toHaveLength(1);
            expect(fullMenuData[2].items[0].value).toEqual(store.accountSObjectVariableGuid);
        });

        it('should set the value', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest({value: store.accountSObjectCollectionVariableGuid}));
            expect(ferovPicker.value.value).toEqual(store.accountSObjectCollectionVariableGuid);
            expect(ferovPicker.value.displayText).toEqual(addCurlyBraces(store.accountSObjectCollectionVariableDevName));
        });
    });

    describe('handling value change event from combobox', () => {
        it("should fire 'OutputReferenceChangedEvent'", () => {
            const sobjectPicker = createComponentUnderTest({value: store.accountSObjectCollectionVariableGuid});
            const ferovResourcePicker = getFerovResourcePicker(sobjectPicker);
            const newParamValue = store.accountSObjectVariableGuid;
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                sobjectPicker.addEventListener(OutputReferenceChangedEvent.EVENT_NAME, eventCallback);
                ferovResourcePicker.dispatchEvent(new ComboboxValueChangedEvent(null, newParamValue));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {value: newParamValue}});
            });
        });
    });
});