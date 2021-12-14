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
import { getElementByDevName } from '../../../storeUtils/storeQuery';

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

describe('collection-choice-set-editor', () => {
    let collectionChoiceObject, collectionChoiceEditor;

    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);

        const collectionChoiceSetElement = getElementByDevName('ccs_getAccAutowFieldsNfilters');
        collectionChoiceObject = getElementForPropertyEditor(collectionChoiceSetElement);
    });
    afterAll(() => {
        resetState();
    });

    describe('collection resource picker items', () => {
        let ferovResourcePicker;
        beforeEach(() => {
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
