import { usedBy } from 'builder_platform_interaction-used-by-lib';

const elements = {
    'DECISION_1': {
        'defaultConnectorLabel': '[Default Outcome]',
        'config': {
            'isSelected': false
        },
        'outcomeReferences': [{
            'outcomeReference': 'OUTCOME_1'
        }, {
            'outcomeReference': 'OUTCOME_2'
        }],
        'availableConnections': [{
            'type': 'REGULAR',
            'childReference': 'OUTCOME_1'
        },
        {
            'type': 'REGULAR',
            'childReference': 'OUTCOME_2'
        },
        {
            'type': 'DEFAULT'
        }],
        'guid': 'DECISION_1',
        'elementType': 'DECISION'
    },
    'OUTCOME_1': {
        'conditions': [
            {
                'leftValueReference': 'VARIABLE_1.fieldName',
                'operator': 'EqualTo',
                'rightValue': {
                    'elementReference': 'VARIABLE_3'
                }
            }
        ],
        'label': 'OUTCOME 1',
        'name': 'OUTCOME 1',
        'guid': 'OUTCOME_1',
        'isCanvasElement': false
    },
    'OUTCOME_2': {
        'conditions': [
            {
                'leftValueReference': 'VARIABLE_1',
                'operator': 'EqualTo',
                'rightValue': {
                    'stringValue': 'OUTCOME_1' // String value without curly braces should not be match even if it is equal to a GUID
                }
            }
        ],
        'guid': 'OUTCOME_2',
        'label': 'OUTCOME 2',
        'name': 'OUTCOME 2',
        'isCanvasElement': false
    },
    'OUTCOME_3': {
        'conditions': [
            {
                'leftValueReference': 'OUTCOME_1',
                'operator': 'EqualTo',
                'rightValue': {
                    'stringValue': '{!OUTCOME_2}'
                }
            }
        ],
        'guid': 'OUTCOME_3',
        'label': 'OUTCOME 3',
        'name': 'OUTCOME 3',
        'isCanvasElement': false
    },
    'FORMULA_1': {
        'expression': '{!VARIABLE_1.fieldName} is a variable with following element jfkdjkfjdkjf: {!OUTCOME_3}',
        'name': 'Formula_1',
        'elementType': 'FORMULA',
        'guid': 'FORMULA_1',
        'isCanvasElement': false
    },
    'VARIABLE_1': {
        'elementType': 'VARIABLE',
        'guid': 'VARIABLE_1',
        'isCanvasElement': false,
        'name': 'VARIABLE 1'
    },
    'VARIABLE_2': {
        'elementType': 'VARIABLE',
        'guid': 'VARIABLE_2',
        'isCanvasElement': false,
        'name': 'VARIABLE 2'
    },
    'VARIABLE_3': {
        'elementType': 'VARIABLE',
        'guid': 'VARIABLE_3',
        'isCanvasElement': false,
        'name': 'VARIABLE 3'
    },
};

describe('Used by library', () => {
    it('returns an empty array if an element is not used anywhere', () => {
        const elementGuids = ['VARIABLE_2'];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toHaveLength(0);
    });
    it('returns an array of elements where an element is being referenced', () => {
        const elementGuids = ['VARIABLE_1'];
        const expectedResult = [{
            'guid': 'OUTCOME_1',
            'label': 'OUTCOME 1',
            'name': 'OUTCOME 1',
            'elementGuidsReferenced': [
                'VARIABLE_1'
            ]
        },
        {
            'guid': 'OUTCOME_2',
            'label': 'OUTCOME 2',
            'name': 'OUTCOME 2',
            'elementGuidsReferenced': [
                'VARIABLE_1'
            ]
        },
        {
            'guid': 'FORMULA_1',
            'name': 'Formula_1',
            'elementGuidsReferenced': [
                'VARIABLE_1'
            ],
            iconName: 'standard:formula'
        }];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns an array of object which contains guid, label, name, elementGuidsReferenced', () => {
        const elementGuids = ['VARIABLE_3'];
        const expectedResult = [{
            'guid': 'OUTCOME_1',
            'label': 'OUTCOME 1',
            'name': 'OUTCOME 1',
            'elementGuidsReferenced': [
                'VARIABLE_3'
            ]
        }];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns an array of object which contains multiple element guids referenced', () => {
        const elementGuids = ['VARIABLE_1', 'VARIABLE_3', 'VARIABLE_2'];
        const expectedResult = [{
            'guid': 'OUTCOME_1',
            'label': 'OUTCOME 1',
            'name': 'OUTCOME 1',
            'elementGuidsReferenced': [
                'VARIABLE_1',
                'VARIABLE_3'
            ]
        },
        {
            'guid': 'OUTCOME_2',
            'label': 'OUTCOME 2',
            'name': 'OUTCOME 2',
            'elementGuidsReferenced': [
                'VARIABLE_1'
            ]
        },
        {
            'guid': 'FORMULA_1',
            'name': 'Formula_1',
            'elementGuidsReferenced': [
                'VARIABLE_1'
            ],
            iconName: 'standard:formula'
        }];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns an array of object if an element is referenced in a template field', () => {
        const elementGuids = ['OUTCOME_3'];
        const expectedResult = [{
            'guid': 'FORMULA_1',
            'name': 'Formula_1',
            'elementGuidsReferenced': [
                'OUTCOME_3'
            ],
            iconName: 'standard:formula'
        }];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns an array of object including any childReferences if an element is referenced and has child references', () => {
        const elementGuids = ['DECISION_1'];
        const expectedResult = [{
            'guid': 'OUTCOME_3',
            'label': 'OUTCOME 3',
            'name': 'OUTCOME 3',
            'elementGuidsReferenced': [
                'OUTCOME_1',
                'OUTCOME_2'
            ],
            "iconName": "standard:custom"
        }];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
});