// @ts-nocheck
import { createElement } from 'lwc';
import RecordChoiceSetEditor from '../recordChoiceSetEditor';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { recordChoiceSetValidation, getRules } from '../recordChoiceSetValidation';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => {
    function getCurrentState() {
        return {
            properties: {
                processType: 'flow'
            },
            elements: {}
        };
    }
    function getStore() {
        return {
            getCurrentState
        };
    }
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const setupComponentUnderTest = (recordChoiceSetObject) => {
    const element = createElement('builder_platform_interaction-picklist-choice-set-editor', {
        is: RecordChoiceSetEditor
    });
    element.node = recordChoiceSetObject;
    setDocumentBodyChildren(element);
    return element;
};
describe('Record Choice Set Validation', () => {
    const recordChoiceObjectWithoutObject = {
        elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
        guid: 'guid1',
        name: {
            value: 'recordChoice1',
            error: null
        },
        description: {
            value: 'This is record choice',
            error: null
        },
        object: {
            value: null,
            error: null
        },
        objectIndex: {
            value: 'guid',
            error: null
        },
        filterLogic: {
            value: CONDITION_LOGIC.NO_CONDITIONS,
            error: null
        },
        sortOrder: {
            value: 'NotSorted',
            error: null
        }
    };
    const recordChoiceObject = {
        elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
        guid: 'guid1',
        name: {
            value: 'recordChoice1',
            error: null
        },
        description: {
            value: 'This is record choice',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        objectIndex: {
            value: 'guid',
            error: null
        },
        dataType: {
            value: 'Text',
            error: null
        },
        filterLogic: {
            value: CONDITION_LOGIC.AND,
            error: null
        },
        filters: [
            {
                leftHandSide: { value: '', error: null },
                operator: { value: '', error: null },
                rightHandSide: { value: '', error: null },
                rightHandSideDataType: '',
                rowIndex: 1
            }
        ],
        sortField: {
            value: '',
            error: null
        },
        sortOrder: {
            value: 'Asc',
            error: null
        },
        limit: {
            value: '-3',
            error: null
        },
        displayField: {
            value: null,
            error: null
        },
        valueField: {
            value: 'AccountSource',
            error: null
        },
        outputAssignments: [
            {
                rowIndex: 44,
                leftHandSide: {
                    value: 'lhs',
                    error: null
                },
                rightHandSide: {
                    value: '',
                    error: null
                }
            }
        ]
    };

    describe('validateAll', () => {
        const validate = (node) => {
            return getErrorsFromHydratedElement(recordChoiceSetValidation.validateAll(node, getRules(node, true)));
        };
        const recordChoice = setupComponentUnderTest(recordChoiceObject);
        const node = recordChoice.node;
        const errors = validate(node);

        it('Returns 5 errors for recordChoiceSetObject', () => {
            expect(errors).toHaveLength(5);
        });
        it('Returns error for key leftHandSide', () => {
            expect(errors[0]).toHaveProperty('key', 'leftHandSide');
        });
        it('Returns error for key sortField', () => {
            expect(errors[1]).toHaveProperty('key', 'sortField');
        });
        it('Returns error for key limit', () => {
            expect(errors[2]).toHaveProperty('key', 'limit');
        });
        it('Returns error for key displayField', () => {
            expect(errors[3]).toHaveProperty('key', 'displayField');
        });
        it('Returns error for key rightHandSide', () => {
            expect(errors[4]).toHaveProperty('key', 'rightHandSide');
        });
    });

    describe('getRules', () => {
        describe('when second section is hidden/ object field is not filled', () => {
            const recordChoice = setupComponentUnderTest(recordChoiceObjectWithoutObject);
            const node = recordChoice.node;
            const rules = getRules(node, false);
            const keysFromRules = Object.keys(rules);
            const expectedKeysFromRules = ['label', 'name', 'object', 'limit'];

            it('returns rules object with number of keys as 5', () => {
                expect(keysFromRules).toHaveLength(5);
            });

            it('rules object should contain rule for key:', () => {
                expect(keysFromRules).toEqual(expect.arrayContaining(expectedKeysFromRules));
            });
        });

        describe('when second section is shown/when object is filled in record choice object', () => {
            const recordChoice = setupComponentUnderTest(recordChoiceObject);
            const node = recordChoice.node;
            const rules = getRules(node, true);
            const keysFromRules = Object.keys(rules);
            const expectedKeysFromRules = [
                'filters',
                'label',
                'limit',
                'name',
                'filterLogic',
                'object',
                'sortField',
                'displayField',
                'dataType',
                'outputAssignments'
            ];

            it('returns rules object with number of keys as 10', () => {
                expect(keysFromRules).toHaveLength(10);
            });

            it('rules object should contain rule for key:', () => {
                expect(keysFromRules).toEqual(expect.arrayContaining(expectedKeysFromRules));
            });
        });
    });
});
