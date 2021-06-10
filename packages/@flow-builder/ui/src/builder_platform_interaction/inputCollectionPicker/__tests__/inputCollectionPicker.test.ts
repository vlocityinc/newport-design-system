import { createElement } from 'lwc';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { ComboboxStateChangedEvent, CollectionReferenceChangedEvent } from 'builder_platform_interaction/events';
import InputCollectionPicker from 'builder_platform_interaction/inputCollectionPicker';
import * as store from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { ComboboxTestComponent } from '../../integrationTests/__tests__/comboboxTestUtils';
import { SORTABLE_FILTER, MAPPABLE_FILTER } from 'builder_platform_interaction/collectionProcessorLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const GROUP_LABELS = {
    APEX_COLLECTION_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.APEXCOLLECTIONVARIABLEPLURALLABEL',
    COLLECTION_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.COLLECTIONVARIABLEPLURALLABEL',
    RECORD_COLLECTION_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.SOBJECTCOLLECTIONPLURALLABEL'
};

const getFerovResourcePicker = (inputCollectionPicker) =>
    inputCollectionPicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER);

const getBaseResourcePicker = (ferovResourcePicker) => {
    return ferovResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER);
};

const getCombobox = (ferovResourcePicker) => {
    const baseResourcePicker = getBaseResourcePicker(ferovResourcePicker);
    return new ComboboxTestComponent(
        baseResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX)
    );
};

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-input-collection-picker', {
        is: InputCollectionPicker
    });
    Object.assign(el, { collectionProcessorFilter: SORTABLE_FILTER }, props);
    setDocumentBodyChildren(el);
    return el;
};

describe('input-collection-picker', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('all collections in flow', () => {
        let ferovPicker;
        let inputCollectionPicker;
        beforeAll(() => {
            inputCollectionPicker = createComponentUnderTest({});
            ferovPicker = getFerovResourcePicker(inputCollectionPicker);
        });
        it('contains a ferov resource picker', () => {
            expect(ferovPicker).not.toBeNull();
        });
        it('should have no selected collection', () => {
            expect(ferovPicker.value).toEqual('');
        });
        it('should contain apex collection variables from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(ferovPicker).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.APEX_COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.apexComplexTypeCollectionVariable.name)
                )
            ).not.toBeNull();
        });
        it('should contain sObject collection variables from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(ferovPicker).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.accountSObjectCollectionVariable.name)
                )
            ).not.toBeNull();
        });
        it('should contain apex call collection from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(ferovPicker).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.apexCallAutomaticAnonymousAccountsOutput.name)
                )
            ).not.toBeNull();
        });
        it('should contain primitive collection variables from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(ferovPicker).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.stringCollectionVariable1.name)
                )
            ).not.toBeNull();
        });
    });
    describe('only SObject collections', () => {
        let ferovPicker;
        let inputCollectionPicker;
        beforeAll(() => {
            inputCollectionPicker = createComponentUnderTest({
                sobjectOnly: true,
                collectionProcessorFilter: MAPPABLE_FILTER
            });
            ferovPicker = getFerovResourcePicker(inputCollectionPicker);
        });
        it('should have no selected collection', () => {
            expect(ferovPicker.value).toEqual('');
        });
        it('should contain sObject collection variables from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(ferovPicker).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.accountSObjectCollectionVariable.name)
                )
            ).not.toBeNull();
        });
        it('should contain apex call sobject collection from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(ferovPicker).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.apexCallAutomaticAnonymousAccountsOutput.name)
                )
            ).not.toBeNull();
        });
        it('should not contain primitive collection variables from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(ferovPicker).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.stringCollectionVariable1.name)
                )
            ).toBeUndefined();
        });
        it('should not contain apex collection variables from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(ferovPicker).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.APEX_COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.apexComplexTypeCollectionVariable.name)
                )
            ).toBeUndefined();
        });
    });
    describe('set a value', () => {
        it('should be a primitive value', () => {
            const ferovPicker = getFerovResourcePicker(
                createComponentUnderTest({
                    collectionReference: { value: store.stringCollectionVariable1.guid, error: null }
                })
            );
            expect(ferovPicker.value.value).toEqual(store.stringCollectionVariable1.guid);
        });
        it('should be a sObject value', () => {
            const ferovPicker = getFerovResourcePicker(
                createComponentUnderTest({
                    collectionProcessorFilter: MAPPABLE_FILTER,
                    sobjectOnly: true,
                    collectionReference: { value: store.accountSObjectCollectionVariable.guid, error: null }
                })
            );
            expect(ferovPicker.value.value).toEqual(store.accountSObjectCollectionVariable.guid);
        });
    });
    describe('handling value change event from combobox', () => {
        it("should fire 'CollectionReferenceChangedEvent'", async () => {
            const inputCollectionPicker = createComponentUnderTest({
                collectionReference: { value: store.accountSObjectCollectionVariable.guid, error: null }
            });
            const ferovResourcePicker = getFerovResourcePicker(inputCollectionPicker);
            const caseSObjectItem = {
                value: store.caseSObjectCollectionVariable.guid,
                text: addCurlyBraces(store.caseSObjectCollectionVariable.name),
                displayText: addCurlyBraces(store.caseSObjectCollectionVariable.name),
                dataType: 'SObject',
                subType: 'Case',
                type: 'option-card'
            };
            const eventCallback = jest.fn();
            inputCollectionPicker.addEventListener(CollectionReferenceChangedEvent.EVENT_NAME, eventCallback);
            const valueChangedEvent = new ComboboxStateChangedEvent(caseSObjectItem, null, null);
            ferovResourcePicker.dispatchEvent(valueChangedEvent);
            await ticks(1);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    value: store.caseSObjectCollectionVariable.guid
                }
            });
        });
    });
    describe('pills', () => {
        it('support pills by default', () => {
            const ferovPicker = getFerovResourcePicker(createComponentUnderTest({}));
            expect(ferovPicker.isPillSupported).toBe(true);
        });
    });
});
