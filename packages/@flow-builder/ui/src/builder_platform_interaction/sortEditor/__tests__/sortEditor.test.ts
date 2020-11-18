// @ts-nocheck
import { createElement } from 'lwc';
import SortEditor from 'builder_platform_interaction/sortEditor';
import { Store } from 'builder_platform_interaction/storeLib';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { SORT_OUTPUT_OPTION } from 'builder_platform_interaction/sortEditorLib';
import { ComboboxStateChangedEvent } from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const defaultEmptyElementInfo = {
    collectionReference: { value: null, error: null },
    limit: { value: null, error: null },
    sortOptions: [
        {
            sortField: { value: null, error: null },
            sortOrder: { value: 'Asc', erro: null },
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: 'r1'
        }
    ]
};

const testElementInfoWithSObjectCollection = {
    collectionReference: { value: 'accountSObjectCollectionVariable', error: null },
    limit: { value: null, error: null },
    sortOptions: [
        {
            sortField: { value: 'Id', error: null },
            sortOrder: { value: 'Asc', erro: null },
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: 'r1'
        },
        {
            sortField: { value: 'Name', error: null },
            sortOrder: { value: 'Desc', erro: null },
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: 'r2'
        }
    ]
};

const testElementInfoWithApexCollection = {
    collectionReference: { value: 'apexComplexTypeCollectionVariable', error: null },
    limit: { value: null, error: null },
    sortOptions: [
        {
            sortField: { value: 'name', error: null },
            sortOrder: { value: 'Asc', erro: null },
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: 'r1'
        }
    ]
};

const testElementInfoWithStringCollection = {
    collectionReference: { value: 'stringCollectionVariable1', error: null },
    limit: { value: '3', error: null },
    sortOptions: [
        {
            sortField: { value: null, error: null },
            sortOrder: { value: 'Asc', erro: null },
            doesPutEmptyStringAndNullFirst: false,
            rowIndex: 'r1'
        }
    ]
};

const createComponentUnderTest = ({ elementInfo = defaultEmptyElementInfo } = {}) => {
    const el = createElement('builder_platform_interaction-sort-editor', {
        is: SortEditor
    });
    Object.assign(el, { elementInfo });
    document.body.appendChild(el);
    return el;
};

const getFlowCollection = (sortEditor) => {
    return sortEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER);
};

const getSortOptionsSection = (sortEditor) => {
    return sortEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SORT_OPTION_LIST);
};

const getSortOptions = (sortOptionList) => {
    return sortOptionList.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.SORT_OPTION_ITEM);
};

const getSortOutputSection = (sortEditor) => {
    return sortEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SORT_COLLECTION_OUTPUT);
};

const getFieldPicker = (sortOptionItem) => {
    return sortOptionItem.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FIELD_PICKER);
};

const getSortOutputRadioGroup = (sortCollectionOutput) =>
    sortCollectionOutput.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

const getLimitText = (sortCollectionOutput) =>
    sortCollectionOutput.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT);

describe('sort-editor', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('new sort collection mode', () => {
        let sortEditor;
        beforeEach(() => {
            sortEditor = createComponentUnderTest();
        });
        it('should not be null', () => {
            expect(sortEditor).not.toBeNull();
        });
        it('should have the flow collection combobox', () => {
            expect(getFlowCollection(sortEditor)).not.toBeNull();
        });
        it('should have no selected flow collection', () => {
            const flowCollection = getFlowCollection(sortEditor);
            expect(flowCollection.value).toEqual('');
        });
        it('should not have sort options section', () => {
            expect(getSortOptionsSection(sortEditor)).toBeNull();
        });
        it('should have sort output section', () => {
            const sortOutput = getSortOutputSection(sortEditor);
            expect(sortOutput).not.toBeNull();
        });
    });
    describe('edit sort collection mode', () => {
        describe('SObject Collection', () => {
            let sortEditor;
            beforeEach(() => {
                sortEditor = createComponentUnderTest({ elementInfo: testElementInfoWithSObjectCollection });
            });
            it('should not be null', () => {
                expect(sortEditor).not.toBeNull();
            });
            it('should have the flow collection combobox', () => {
                expect(getFlowCollection(sortEditor)).not.toBeNull();
            });
            it('should have selected flow collection', () => {
                const flowCollection = getFlowCollection(sortEditor);
                expect(flowCollection.value.value).toEqual(
                    testElementInfoWithSObjectCollection.collectionReference.value
                );
            });
            it('should have sort options section', () => {
                expect(getSortOptionsSection(sortEditor)).not.toBeNull();
            });
            it('should have 2 sort options', () => {
                const sortOptionList = getSortOptionsSection(sortEditor);
                const sortOptions = getSortOptions(sortOptionList);
                expect(sortOptions).toHaveLength(2);
                expect(getFieldPicker(sortOptions[0])).not.toBeNull();
            });
            it('should have sort output section', () => {
                expect(getSortOutputSection(sortEditor)).not.toBeNull();
            });
        });
        describe('Apex Collection', () => {
            let sortEditor;
            beforeEach(() => {
                sortEditor = createComponentUnderTest({ elementInfo: testElementInfoWithApexCollection });
            });
            it('should not be null', () => {
                expect(sortEditor).not.toBeNull();
            });
            it('should have the flow collection combobox', () => {
                expect(getFlowCollection(sortEditor)).not.toBeNull();
            });
            it('should have selected flow collection', () => {
                const flowCollection = getFlowCollection(sortEditor);
                expect(flowCollection.value.value).toEqual(testElementInfoWithApexCollection.collectionReference.value);
            });
            it('should have sort options section', () => {
                expect(getSortOptionsSection(sortEditor)).not.toBeNull();
            });
            it('should have only one sort option', () => {
                const sortOptionList = getSortOptionsSection(sortEditor);
                const sortOptions = getSortOptions(sortOptionList);
                expect(sortOptions).toHaveLength(1);
                expect(getFieldPicker(sortOptions[0])).not.toBeNull();
            });
            it('should have sort output section', () => {
                expect(getSortOutputSection(sortEditor)).not.toBeNull();
            });
        });
        describe('Primitive Collection', () => {
            let sortEditor;
            beforeEach(() => {
                sortEditor = createComponentUnderTest({ elementInfo: testElementInfoWithStringCollection });
            });
            it('should not be null', () => {
                expect(sortEditor).not.toBeNull();
            });
            it('should have the flow collection combobox', () => {
                expect(getFlowCollection(sortEditor)).not.toBeNull();
            });
            it('should have selected flow collection', () => {
                const flowCollection = getFlowCollection(sortEditor);
                expect(flowCollection.value.value).toEqual(
                    testElementInfoWithStringCollection.collectionReference.value
                );
            });
            it('should have sort options section', () => {
                expect(getSortOptionsSection(sortEditor)).not.toBeNull();
            });
            it('should not have field in sort option', () => {
                const sortOptionList = getSortOptionsSection(sortEditor);
                const sortOptions = getSortOptions(sortOptionList);
                expect(sortOptions).toHaveLength(1);
            });
            it('should not contains a field picker', () => {
                const sortOptions = getSortOptions(getSortOptionsSection(sortEditor));
                const fieldPicker = getFieldPicker(sortOptions[0]);
                expect(fieldPicker).toBeNull();
            });
            it('should have sort output section', () => {
                expect(getSortOutputSection(sortEditor)).not.toBeNull();
            });
            it('should be selected by Custom with the specified limit', () => {
                const sortOutput = getSortOutputSection(sortEditor);
                const selectedRadioGroup = getSortOutputRadioGroup(sortOutput);
                expect(selectedRadioGroup.value).toEqual(SORT_OUTPUT_OPTION.CUSTOM);
                const limit = getLimitText(sortOutput);
                expect(limit.value).toEqual(testElementInfoWithStringCollection.limit.value);
            });
        });
        describe('handling events', () => {
            describe('changing the flow collection', () => {
                let sortEditor, flowCollection;
                beforeEach(() => {
                    sortEditor = createComponentUnderTest({ elementInfo: testElementInfoWithSObjectCollection });
                    flowCollection = getFlowCollection(sortEditor);
                });
                it('should reset the sort options', async () => {
                    const sObjectMenuItem = {
                        value: 'caseSObjectCollectionVariable',
                        text: '{!caseSObjectCollectionVariable}',
                        displayText: '{!caseSObjectCollectionVariable}',
                        dataType: 'SObject',
                        subType: 'Case'
                    };
                    const valueChangedEvent = new ComboboxStateChangedEvent(sObjectMenuItem, null, null);
                    flowCollection.dispatchEvent(valueChangedEvent);
                    await ticks(1);
                    const sortOptionList = getSortOptionsSection(sortEditor);
                    const sortOptions = getSortOptions(sortOptionList);
                    expect(sortOptions).toHaveLength(1);
                    const fieldPicker = getFieldPicker(sortOptions[0]);
                    expect(fieldPicker.value).toBeNull();
                });
                it('should change the sort options from SObject to Primitive', async () => {
                    const primitiveMenuItem = {
                        value: 'stringCollectionVariable1',
                        text: '{!stringCollectionVariable1}',
                        displayText: '{!stringCollectionVariable1}',
                        dataType: 'String'
                    };
                    const valueChangedEvent = new ComboboxStateChangedEvent(primitiveMenuItem, null, null);
                    flowCollection.dispatchEvent(valueChangedEvent);
                    await ticks(1);
                    const sortOptionList = getSortOptionsSection(sortEditor);
                    const sortOptions = getSortOptions(sortOptionList);
                    expect(sortOptions).toHaveLength(1);
                    const fieldPicker = getFieldPicker(sortOptions[0]);
                    expect(fieldPicker).toBeNull();
                });
            });
        });
    });
});
