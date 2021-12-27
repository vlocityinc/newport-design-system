import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { createElement } from 'lwc';
import * as store from 'mock/storeData';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import FilterEditor from '../filterEditor';
import { filterValidation, getRules } from '../filterValidation';

/**
 * Executing jest test
 * cd into /packages/@flow-builder/ui
 * yarn jest src/builder_platform_interaction/filterEditor/__tests__/filterValidation.test.ts
 */

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

const filterElementWithValidSObject = () => ({
    guid: 'TEST_FILTER',
    label: { value: 'testFilterLabel', error: null },
    name: { value: 'testFilter', error: null },
    collectionReference: { value: store.accountSObjectCollectionVariable.guid, error: null },
    assignNextValueToReference: { value: store.contactSObjectVariable.guid, error: null },
    conditionLogic: { value: CONDITION_LOGIC.AND, error: null },
    conditions: [
        {
            leftHandSide: { value: 'Account.Name', error: null },
            operator: { value: 'EqualTo', error: null },
            rightHandSide: { value: 'my address', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            rowIndex: '74cb7e19-9f98-4b59-9fdd-a276f216ddcf'
        }
    ],
    formula: { value: '', error: null }
});

const createComponentForTest = (elementInfo) => {
    const el = createElement('builder_platform_interaction-filter-editor', {
        is: FilterEditor
    });
    Object.assign(el, { elementInfo });
    setDocumentBodyChildren(el);
    return el;
};

const validate = (node, state) => {
    const rules = getRules(state);
    return getErrorsFromHydratedElement(filterValidation.validateAll(node, rules));
};

describe('Filter Validation', () => {
    let filterElement;
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });

    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });

    beforeEach(() => {
        filterElement = filterElementWithValidSObject();
    });

    describe('validate input collection', () => {
        it('should pass validation with valid input', () => {
            const filterEditor = createComponentForTest(filterElement);
            const state = {
                collectionReference: filterEditor.elementInfo.collectionReference.value,
                conditionLogic: { value: CONDITION_LOGIC.AND, error: null }
            };
            const errors = validate(filterEditor.elementInfo, state);

            expect(errors).toHaveLength(0);
        });

        it('should error if collectionReference is empty', () => {
            const filterEditor = createComponentForTest(filterElement);
            filterElement.collectionReference.value = null;
            const state = {
                conditionLogic: { value: CONDITION_LOGIC.AND, error: null }
            };
            const errors = validate(filterEditor.elementInfo, state);

            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('collectionReference');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });

    describe('should catch invalid value', () => {
        it('should error if leftHandSide is empty', () => {
            filterElement.conditions[0].leftHandSide.value = '';
            filterElement.conditionLogic = { value: CONDITION_LOGIC.AND, error: null };
            const state = {
                conditionLogic: filterElement.conditionLogic
            };
            const filterEditor = createComponentForTest(filterElement);
            const errors = validate(filterEditor.elementInfo, state);

            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('leftHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });

        it('should error if operator is empty', () => {
            filterElement.conditions[0].leftHandSide.value = 'Account.Name';
            filterElement.conditions[0].operator.value = '';
            const state = {
                conditionLogic: filterElement.conditionLogic
            };
            const filterEditor = createComponentForTest(filterElement);
            const errors = validate(filterEditor.elementInfo, state);

            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('operator');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });

        it('should error if rightHandSide is empty', () => {
            filterElement.conditions[0].operator.value = 'EqualTo';
            filterElement.conditions[0].rightHandSide.value = '';
            const state = {
                conditionLogic: filterElement.conditionLogic,
                conditions: filterElement.conditions
            };
            const filterEditor = createComponentForTest(filterElement);
            const errors = validate(filterEditor.elementInfo, state);

            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('rightHandSide');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });

        it('should return an error if conditionLogic is empty', () => {
            filterElement.conditionLogic = { value: '', error: null };
            const state = {
                conditionLogic: filterElement.conditionLogic,
                conditions: filterElement.conditions
            };
            const filterEditor = createComponentForTest(filterElement);
            const errors = validate(filterEditor.elementInfo, state);

            expect(errors).toHaveLength(1);
            expect(errors[0].key).toBe('conditionLogic');
            expect(errors[0].errorString).toBe(LABELS.cannotBeBlank);
        });
    });
});
