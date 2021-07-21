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
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/expressionValidator', () =>
    require('builder_platform_interaction_mocks/expressionValidator')
);

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
    assignNextValueToReference: { value: store.contactSObjectVariable.guid, error: null },
    mapItems: [
        {
            leftHandSide: { value: 'Contact.Description', error: null },
            rightHandSide: { value: 'This is my description', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            operator: { value: 'Assign', error: null },
            rowIndex: 'MapItem_1'
        }
    ],
    outputSObjectType: { value: 'Contact', error: null }
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
            const mapEditor = createComponentForTest(mapEditorNode);
            mapEditorNode.collectionReference.value = '';
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('collectionReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('primitive input collection', () => {
        it('should return an error', () => {
            const mapEditor = createComponentForTest(mapEditorNode);
            mapEditorNode.collectionReference.value = store.stringCollectionVariable1.guid;
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('collectionReference');
            expect(errors[0].errorString).toBe(LABELS.enterValidValue);
        });
    });
    describe('no outputSObjectType', () => {
        it('should return an error', () => {
            const mapEditor = createComponentForTest(mapEditorNode);
            mapEditorNode.outputSObjectType.value = '';
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('outputSObjectType');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('no assignNextValueToReference', () => {
        it('should return an error', () => {
            const mapEditor = createComponentForTest(mapEditorNode);
            mapEditorNode.assignNextValueToReference.value = '';
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('assignNextValueToReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('mapItems is not valid', () => {
        it('should return an error if leftHandSide is empty', () => {
            const mapEditor = createComponentForTest(mapEditorNode);
            mapEditorNode.mapItems[0].leftHandSide.value = '';
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if operator is empty', () => {
            const mapEditor = createComponentForTest(mapEditorNode);
            mapEditorNode.mapItems[0].leftHandSide.value = 'Contact.Name';
            mapEditorNode.mapItems[0].operator.value = '';
            const errors = validate(mapEditor.elementInfo);
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('operator');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
});
