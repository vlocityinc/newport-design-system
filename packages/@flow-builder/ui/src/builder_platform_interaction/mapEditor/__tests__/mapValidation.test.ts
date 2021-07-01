import { createElement } from 'lwc';
import MapEditor from '../mapEditor';
import { mapValidation, getRules } from '../mapValidation';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import * as store from 'mock/storeData';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const createComponentForTest = (elementInfo) => {
    const el = createElement('builder_platform_interaction-map-editor', {
        is: MapEditor
    });
    Object.assign(el, { elementInfo });
    setDocumentBodyChildren(el);
    return el;
};

const validate = (node) => {
    const rules = getRules();
    return getErrorsFromHydratedElement(mapValidation.validateAll(node, rules));
};

const validMapNode = () => ({
    collectionReference: { value: store.accountSObjectCollectionVariable.guid, error: null },
    mapItems: [],
    currentValueFromCollection: { value: store.contactSObjectVariable.name, error: null },
    outputTable: { value: 'Contact', error: null },
    storeOutputAutomatically: true
});

describe('Map Validation', () => {
    let mapEditorNode;
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    beforeEach(() => {
        mapEditorNode = validMapNode();
    });
    describe('node is valid', () => {
        it('returns no errors', () => {
            const mapEditor = createComponentForTest(mapEditorNode);
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(0);
        });
    });
    describe('no input collection', () => {
        it('should return an error', () => {
            mapEditorNode.collectionReference.value = '';
            const mapEditor = createComponentForTest(mapEditorNode);
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('collectionReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('primitive input collection', () => {
        it('should return an error', () => {
            mapEditorNode.collectionReference.value = store.stringCollectionVariable1.guid;
            const mapEditor = createComponentForTest(mapEditorNode);
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('collectionReference');
            expect(errors[0].errorString).toBe(LABELS.enterValidValue);
        });
    });
    // TODO: will add more tests in next PR
});
