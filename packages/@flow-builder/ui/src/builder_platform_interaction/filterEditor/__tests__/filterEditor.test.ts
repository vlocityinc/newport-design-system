import { createElement } from 'lwc';
import { ComboboxTestComponent } from '../../integrationTests/__tests__/comboboxTestUtils';
import FilterEditor from 'builder_platform_interaction/filterEditor';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import * as store from 'mock/storeData';

/**
 * Executing jest test
 * cd into /packages/@flow-builder/ui
 * yarn jest src/builder_platform_interaction/filterEditor/__tests__/filterEditor.test.ts
 */

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const initFilterElementInfo = {
    collectionReference: { value: null, error: null },
    conditions: [
        {
            rowIndex: '9afbaf94-5c0b-48ca-9ed9-e75b74bec527',
            leftHandSide: '',
            rightHandSide: '',
            rightHandSideDataType: '',
            operator: ''
        }
    ],
    filterText: null,
    formulaExpression: null
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
});
