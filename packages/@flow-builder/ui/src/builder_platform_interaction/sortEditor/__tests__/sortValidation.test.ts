// @ts-nocheck
import { createElement } from 'lwc';
import SortEditor from '../sortEditor';
import { sortValidation, getRules } from '../sortValidation';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { SORT_OUTPUT_OPTION } from 'builder_platform_interaction/sortEditorLib';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/expressionValidator', () =>
    require('builder_platform_interaction_mocks/expressionValidator')
);

const createComponentForTest = (elementInfo) => {
    const el = createElement('builder_platform_interaction-sort-editor', {
        is: SortEditor
    });
    Object.assign(el, { elementInfo });
    document.body.appendChild(el);
    return el;
};

const validate = (node, params) => {
    const rules = getRules(params);
    return getErrorsFromHydratedElement(sortValidation.validateAll(node, rules));
};

const validSObjectCollection = () => ({
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
});

describe('Sort Validation', () => {
    let sortEditorNode;
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    beforeEach(() => {
        sortEditorNode = validSObjectCollection();
    });
    describe('node is valid', () => {
        it('returns no errors', () => {
            const sortEditor = createComponentForTest(sortEditorNode);
            const errors = validate(sortEditor.elementInfo, {
                collectionReference: sortEditor.elementInfo.collectionReference.value,
                selectedOutput: SORT_OUTPUT_OPTION.ALL,
                isSObjectOrApexClass: true
            });
            expect(errors).toHaveLength(0);
        });
    });
    describe('no flow collection', () => {
        it('should return an error', () => {
            sortEditorNode.collectionReference.value = '';
            const sortEditor = createComponentForTest(sortEditorNode);
            const errors = validate(sortEditor.elementInfo, {
                collectionReference: sortEditor.elementInfo.collectionReference.value,
                selectedOutput: SORT_OUTPUT_OPTION.ALL,
                isSObjectOrApexClass: true
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('collectionReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('no sort field', () => {
        it('should return an error', () => {
            sortEditorNode.sortOptions[0].sortField.value = '';
            const sortEditor = createComponentForTest(sortEditorNode);
            const errors = validate(sortEditor.elementInfo, {
                collectionReference: sortEditor.elementInfo.collectionReference.value,
                selectedOutput: SORT_OUTPUT_OPTION.ALL,
                isSObjectOrApexClass: true
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('sortField');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('invalid limit field', () => {
        it('should return an error when empty limit', () => {
            sortEditorNode.limit.value = '';
            const sortEditor = createComponentForTest(sortEditorNode);
            const errors = validate(sortEditor.elementInfo, {
                collectionReference: sortEditor.elementInfo.collectionReference.value,
                selectedOutput: SORT_OUTPUT_OPTION.CUSTOM,
                isSObjectOrApexClass: true
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('limit');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error when invalid limit', () => {
            sortEditorNode.limit.value = 'abc';
            const sortEditor = createComponentForTest(sortEditorNode);
            const errors = validate(sortEditor.elementInfo, {
                collectionReference: sortEditor.elementInfo.collectionReference.value,
                selectedOutput: SORT_OUTPUT_OPTION.CUSTOM,
                isSObjectOrApexClass: true
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('limit');
            expect(errors[0].errorString).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
        });
        it('should return an error when limit is too high', () => {
            sortEditorNode.limit.value = '1234567890000000000';
            const sortEditor = createComponentForTest(sortEditorNode);
            const errors = validate(sortEditor.elementInfo, {
                collectionReference: sortEditor.elementInfo.collectionReference.value,
                selectedOutput: SORT_OUTPUT_OPTION.CUSTOM,
                isSObjectOrApexClass: true
            });
            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('limit');
            expect(errors[0].errorString).toBe(LABELS.shouldBeInRange);
        });
    });
});
