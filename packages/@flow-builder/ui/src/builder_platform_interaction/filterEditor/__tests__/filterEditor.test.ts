import { createElement } from 'lwc';
import { ComboboxTestComponent } from '../../integrationTests/__tests__/comboboxTestUtils';
import { CollectionReferenceChangedEvent } from 'builder_platform_interaction/events';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import FilterEditor from 'builder_platform_interaction/filterEditor';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { PropertyChangedEvent, AddConditionEvent, DeleteConditionEvent } from 'builder_platform_interaction/events';
import * as store from 'mock/storeData';

/**
 * Executing jest test
 * cd into /packages/@flow-builder/ui
 * yarn jest src/builder_platform_interaction/filterEditor/__tests__/filterEditor.test.ts
 */

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const initFilterElementInfo = {
    collectionReference: { value: '', error: null },
    assignNextValueToReference: { value: '', error: null },
    conditions: [
        {
            leftHandSide: { value: '', error: null },
            rightHandSide: { value: '', error: null },
            rightHandSideDataType: { value: '', error: null },
            operator: { value: '', error: null },
            rowIndex: '9afbaf94-5c0b-48ca-9ed9-e75b74bec527'
        }
    ],
    conditionLogic: { value: CONDITION_LOGIC.AND, error: null },
    formula: null
};

const testSObjectTypeCollection = {
    collectionReference: {
        value: store.accountSObjectCollectionVariable.guid,
        error: null
    },
    assignNextValueToReference: {
        value: store.accountSObjectCollectionVariable.guid,
        error: null
    },
    conditions: [
        {
            leftHandSide: { value: 'Account.Name', error: null },
            rightHandSide: { value: 'This is my name', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            operator: { value: 'Contains', error: null },
            rowIndex: '9afbaf94-5c0b-48ca-9ed9-e75b74bec527'
        }
    ],
    conditionLogic: { value: 'and', error: null },
    formula: null,
    guid: '12345'
};

const GROUP_LABELS = {
    RECORD_COLLECTION_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.SOBJECTCOLLECTIONPLURALLABEL',
    APEX_COLLECTION_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.APEXCOLLECTIONVARIABLEPLURALLABEL',
    COLLECTION_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.COLLECTIONVARIABLEPLURALLABEL'
};

const createComponentUnderTest = ({ elementInfo = initFilterElementInfo } = {}) => {
    const el = createElement('builder_platform_interaction-filter-editor', {
        is: FilterEditor
    });
    Object.assign(el, { elementInfo });
    setDocumentBodyChildren(el);
    return el;
};

const getFilterInputCollection = (filterEditor) =>
    filterEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.INPUT_COLLECTION);

const getFerovResourcePicker = (inputCollection) =>
    inputCollection.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER);

const getBaseResourcePicker = (ferovResourcePicker) =>
    ferovResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER);

const getCombobox = (inputCollection) => {
    const baseResourcePicker = getBaseResourcePicker(getFerovResourcePicker(inputCollection));
    return new ComboboxTestComponent(
        baseResourcePicker.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.COMBOBOX)
    );
};

const getFilterConditionList = (filterEditor) => {
    const filterConditionList = filterEditor.shadowRoot.querySelector(
        INTERACTION_COMPONENTS_SELECTORS.FILTER_CONDITION_LIST
    );
    if (filterConditionList) {
        return filterConditionList.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST);
    }
    return null;
};

describe('filter-editor', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });

    describe('Initializing Filter Editor', () => {
        let filterEditor;
        let filterInputCollection;

        beforeEach(() => {
            filterEditor = createComponentUnderTest();
            filterInputCollection = getFilterInputCollection(filterEditor);
        });

        it('should display Filter Editor', () => {
            expect(filterEditor).not.toBeNull();
        });

        it('should display filter input collection combobox', () => {
            expect(filterInputCollection).not.toBeNull();
        });

        it('should have empty input collection', () => {
            const ferovResourcePicker = getFerovResourcePicker(filterInputCollection);
            expect(ferovResourcePicker.value).toEqual('');
        });

        it('should dispaly sObject collection variable', () => {
            const groupedCombobox = getCombobox(filterInputCollection).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.accountSObjectCollectionVariable.name)
                )
            ).not.toBeNull();
        });
        it('should contain apex call collection from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(filterInputCollection).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.apexCallAutomaticAnonymousAccountsOutput.name)
                )
            ).not.toBeNull();
        });
        it('should contain primitive collection variables from flowWithAllElementsUIModel', () => {
            const groupedCombobox = getCombobox(filterInputCollection).getGroupedCombobox();
            expect(
                groupedCombobox.getItemInGroup(
                    GROUP_LABELS.COLLECTION_VARIABLES,
                    'displayText',
                    addCurlyBraces(store.stringCollectionVariable1.name)
                )
            ).not.toBeNull();
        });
    });

    describe('handle events', () => {
        describe('on input collection change', () => {
            let filterEditor;
            let filterConditionList;
            let inputCollection;

            beforeEach(() => {
                filterEditor = createComponentUnderTest({ elementInfo: testSObjectTypeCollection });
                filterConditionList = getFilterConditionList(filterEditor);
                inputCollection = getFilterInputCollection(filterEditor);
            });

            it('should update input collection reference', async () => {
                const valueChangedEvent = new CollectionReferenceChangedEvent(
                    store.caseSObjectCollectionVariable.guid,
                    null
                );
                inputCollection.dispatchEvent(valueChangedEvent);
                await ticks(1);
                const ferovResourcePicker = getFerovResourcePicker(inputCollection);
                expect(ferovResourcePicker.value.value).toEqual(store.caseSObjectCollectionVariable.guid);
            });

            it('should add a new filter condition', async () => {
                const addConditionEvent = new AddConditionEvent(filterEditor.elementInfo.guid);
                filterConditionList.dispatchEvent(addConditionEvent);
                await ticks(1);
                expect(filterEditor.elementInfo.conditions).toHaveLength(2);
            });

            it('should remove filter condition', async () => {
                const deleteConditionEvent = new DeleteConditionEvent(filterEditor.elementInfo.guid, 0);
                filterConditionList.dispatchEvent(deleteConditionEvent);
                await ticks(1);
                expect(filterEditor.elementInfo.conditions).toHaveLength(0);
            });

            it('should handle filter logic change', async () => {
                const propertyChangeEvent = new PropertyChangedEvent('conditionLogic', CONDITION_LOGIC.OR);
                filterConditionList.dispatchEvent(propertyChangeEvent);
                await ticks(1);
                expect(filterEditor.elementInfo.conditionLogic.value).toBe(CONDITION_LOGIC.OR);
            });
        });
    });
});
