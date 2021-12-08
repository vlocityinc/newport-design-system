// @ts-nocheck
import { createElement } from 'lwc';
import CollectionChoiceSetEditor from 'builder_platform_interaction/collectionChoiceSetEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import {
    setDocumentBodyChildren,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { resetState, setupStateForFlow } from '../integrationTestUtils';
import { setScreenElement } from 'builder_platform_interaction/expressionUtils';
import { mockScreenElement } from 'mock/calloutData';

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const getFerovResourcePicker = (collectionChoiceSetElement) => {
    return collectionChoiceSetElement.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
};

const setupComponentUnderTest = (collectionChoiceObject) => {
    const element = createElement('builder_platform_interaction-collection-choice-set-editor', {
        is: CollectionChoiceSetEditor
    });
    element.node = collectionChoiceObject;
    setDocumentBodyChildren(element);
    return element;
};

// TODO: Once Ryan's changes for W-10123390 are in, I will switch this to use the collectionChoiceSet
// from flowWithAllElementsUIModel
const collectionChoiceObjectAsIfFromStore = {
    guid: '8828cb76-9deb-4765-bba0-b3291b1303e6',
    name: 'collectionChoiceSet',
    description: '',
    limit: '',
    displayField: 'Name',
    valueField: 'Id',
    dataType: 'String',
    sortOrder: 'NotSorted',
    elementType: 'CollectionChoiceSet',
    collectionReferenceIndex: '8da17fa9-310c-41d0-af09-f9bd81fc0c17',
    collectionReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511'
};

describe('collection-choice-set-editor', () => {
    let collectionChoiceObject, collectionChoiceEditor;

    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
    });
    afterAll(() => {
        resetState();
    });

    describe('collection resource picker items', () => {
        let ferovResourcePicker;
        beforeEach(() => {
            collectionChoiceObject = getElementForPropertyEditor(collectionChoiceObjectAsIfFromStore);
            setScreenElement(mockScreenElement);
            collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
            ferovResourcePicker = getFerovResourcePicker(collectionChoiceEditor);
        });
        afterEach(() => {
            setScreenElement(undefined);
        });

        it('ferov-resource-picker should only contain elements that are in the store', () => {
            const groupedCombobox = deepQuerySelector(ferovResourcePicker, [
                SELECTORS.BASE_RESOURCE_PICKER,
                SELECTORS.COMBOBOX,
                SELECTORS.LIGHTNING_GROUPED_COMBOBOX
            ]);
            expect(groupedCombobox.items.length).toBeGreaterThan(2);
            expect(groupedCombobox.items[2].items).toHaveLength(2);
        });
    });
});
