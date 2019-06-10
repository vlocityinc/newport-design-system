import {
    usedBy,
    usedByStoreAndElementState
} from 'builder_platform_interaction/usedByLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const elements = {
    WAIT_1: {
        waitEventReferences: [
            { waitEventReference: 'WAIT_EVENT_1' },
            { waitEventReference: 'WAIT_EVENT_2' },
            { waitEventReference: 'WAIT_EVENT_4' }
        ],
        guid: 'WAIT_1',
        elementType: ELEMENT_TYPE.WAIT
    },
    WAIT_EVENT_1: {
        conditions: [
            {
                leftValueReference: 'VARIABLE_1.fieldName',
                operator: 'EqualTo',
                rightValue: {
                    elementReference: 'VARIABLE_3'
                }
            }
        ],
        label: 'WAIT EVENT 1',
        name: 'WAIT EVENT 1',
        guid: 'WAIT_EVENT_1',
        isCanvasElement: false
    },
    WAIT_EVENT_2: {
        conditions: [
            {
                leftValueReference: 'VARIABLE_1',
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'WAIT_EVENT_1' // String value without curly braces should not be match even if it is equal to a GUID
                }
            }
        ],
        guid: 'WAIT_EVENT_2',
        label: 'WAIT EVENT 2',
        name: 'WAIT EVENT 2',
        isCanvasElement: false
    },
    WAIT_EVENT_3: {
        conditions: [
            {
                leftValueReference: 'WAIT_EVENT_1',
                operator: 'EqualTo',
                rightValue: {
                    stringValue: '{!WAIT_EVENT_2}' // String value with curly braces should match even if it is equal to a GUID
                }
            }
        ],
        guid: 'WAIT_EVENT_3',
        label: 'WAIT EVENT 3',
        name: 'WAIT EVENT 3',
        isCanvasElement: false
    },
    WAIT_EVENT_4: {
        conditions: [
            {
                leftValueReference: 'WAIT_EVENT_1',
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'foo'
                }
            }
        ],
        guid: 'WAIT_EVENT_4',
        label: 'WAIT EVENT 4',
        name: 'WAIT EVENT 4',
        isCanvasElement: false
    },
    DECISION_1: {
        defaultConnectorLabel: '[Default Outcome]',
        config: {
            isSelected: false
        },
        outcomeReferences: [
            {
                outcomeReference: 'OUTCOME_1'
            },
            {
                outcomeReference: 'OUTCOME_2'
            },
            {
                outcomeReference: 'OUTCOME_4'
            }
        ],
        availableConnections: [
            {
                type: 'REGULAR',
                childReference: 'OUTCOME_1'
            },
            {
                type: 'REGULAR',
                childReference: 'OUTCOME_2'
            },
            {
                type: 'DEFAULT'
            }
        ],
        guid: 'DECISION_1',
        elementType: ELEMENT_TYPE.DECISION
    },
    OUTCOME_1: {
        conditions: [
            {
                leftValueReference: 'VARIABLE_1.fieldName',
                operator: 'EqualTo',
                rightValue: {
                    elementReference: 'VARIABLE_3'
                }
            }
        ],
        label: 'OUTCOME 1',
        name: 'OUTCOME 1',
        guid: 'OUTCOME_1',
        isCanvasElement: false
    },
    OUTCOME_2: {
        conditions: [
            {
                leftValueReference: 'VARIABLE_1',
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'OUTCOME_1' // String value without curly braces should not be match even if it is equal to a GUID
                }
            }
        ],
        guid: 'OUTCOME_2',
        label: 'OUTCOME 2',
        name: 'OUTCOME 2',
        isCanvasElement: false
    },
    OUTCOME_3: {
        conditions: [
            {
                leftValueReference: 'OUTCOME_1',
                operator: 'EqualTo',
                rightValue: {
                    stringValue: '{!OUTCOME_2}' // String value with curly braces should match even if it is equal to a GUID
                }
            }
        ],
        guid: 'OUTCOME_3',
        label: 'OUTCOME 3',
        name: 'OUTCOME 3',
        isCanvasElement: false
    },
    OUTCOME_4: {
        conditions: [
            {
                leftValueReference: 'OUTCOME_1',
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'foo'
                }
            }
        ],
        guid: 'OUTCOME_4',
        label: 'OUTCOME 4',
        name: 'OUTCOME 4',
        isCanvasElement: false
    },
    FORMULA_1: {
        expression:
            '{!VARIABLE_1.fieldName} is a variable with following elements jfkdjkfjdkjf: {!OUTCOME_3} {!WAIT_EVENT_3}',
        name: 'Formula_1',
        elementType: ELEMENT_TYPE.FORMULA,
        guid: 'FORMULA_1',
        isCanvasElement: false
    },
    VARIABLE_1: {
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'VARIABLE_1',
        isCanvasElement: false,
        name: 'VARIABLE 1'
    },
    VARIABLE_2: {
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'VARIABLE_2',
        isCanvasElement: false,
        name: 'VARIABLE 2'
    },
    VARIABLE_3: {
        elementType: ELEMENT_TYPE.VARIABLE,
        guid: 'VARIABLE_3',
        isCanvasElement: false,
        name: 'VARIABLE 3'
    },
    SCREEN_1: {
        config: {
            isSelected: false
        },
        fieldReferences: [
            {
                fieldReference: 'FIELD_1'
            },
            {
                fieldReference: 'FIELD_2'
            },
            {
                fieldReference: 'FIELD_3'
            }
        ],
        guid: 'SCREEN_1',
        elementType: ELEMENT_TYPE.SCREEN
    },
    FIELD_1: {
        label: 'FIELD 1',
        name: 'FIELD 1',
        guid: 'FIELD_1',
        isCanvasElement: false
    },
    FIELD_2: {
        guid: 'FIELD_2',
        label: 'FIELD 2',
        name: 'FIELD 2',
        isCanvasElement: false
    },
    FIELD_3: {
        guid: 'FIELD_3',
        label: 'FIELD 3',
        name: 'FIELD 3',
        isCanvasElement: false
    }
};

describe('Used by library', () => {
    it('returns an empty array if an element is not used anywhere', () => {
        const elementGuids = ['VARIABLE_2'];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toHaveLength(0);
    });
    it('returns an array of elements where an element is being referenced', () => {
        const elementGuids = ['VARIABLE_1'];
        const expectedResult = [
            {
                guid: 'WAIT_EVENT_1',
                label: 'WAIT EVENT 1',
                name: 'WAIT EVENT 1',
                elementGuidsReferenced: ['VARIABLE_1']
            },
            {
                guid: 'WAIT_EVENT_2',
                label: 'WAIT EVENT 2',
                name: 'WAIT EVENT 2',
                elementGuidsReferenced: ['VARIABLE_1']
            },
            {
                guid: 'OUTCOME_1',
                label: 'OUTCOME 1',
                name: 'OUTCOME 1',
                elementGuidsReferenced: ['VARIABLE_1']
            },
            {
                guid: 'OUTCOME_2',
                label: 'OUTCOME 2',
                name: 'OUTCOME 2',
                elementGuidsReferenced: ['VARIABLE_1']
            },
            {
                guid: 'FORMULA_1',
                name: 'Formula_1',
                elementGuidsReferenced: ['VARIABLE_1'],
                iconName: 'standard:formula'
            }
        ];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns an array of object which contains guid, label, name, elementGuidsReferenced', () => {
        const elementGuids = ['VARIABLE_3'];
        const expectedResult = [
            {
                guid: 'WAIT_EVENT_1',
                label: 'WAIT EVENT 1',
                name: 'WAIT EVENT 1',
                elementGuidsReferenced: ['VARIABLE_3']
            },
            {
                guid: 'OUTCOME_1',
                label: 'OUTCOME 1',
                name: 'OUTCOME 1',
                elementGuidsReferenced: ['VARIABLE_3']
            }
        ];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns an array of object which contains multiple element guids referenced', () => {
        const elementGuids = ['VARIABLE_1', 'VARIABLE_3', 'VARIABLE_2'];
        const expectedResult = [
            {
                guid: 'WAIT_EVENT_1',
                label: 'WAIT EVENT 1',
                name: 'WAIT EVENT 1',
                elementGuidsReferenced: ['VARIABLE_1', 'VARIABLE_3']
            },
            {
                guid: 'WAIT_EVENT_2',
                label: 'WAIT EVENT 2',
                name: 'WAIT EVENT 2',
                elementGuidsReferenced: ['VARIABLE_1']
            },
            {
                guid: 'OUTCOME_1',
                label: 'OUTCOME 1',
                name: 'OUTCOME 1',
                elementGuidsReferenced: ['VARIABLE_1', 'VARIABLE_3']
            },
            {
                guid: 'OUTCOME_2',
                label: 'OUTCOME 2',
                name: 'OUTCOME 2',
                elementGuidsReferenced: ['VARIABLE_1']
            },
            {
                guid: 'FORMULA_1',
                name: 'Formula_1',
                elementGuidsReferenced: ['VARIABLE_1'],
                iconName: 'standard:formula'
            }
        ];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns an array of object if an element is referenced in a template field', () => {
        const elementGuids = ['WAIT_EVENT_3', 'OUTCOME_3'];
        const expectedResult = [
            {
                guid: 'FORMULA_1',
                name: 'Formula_1',
                elementGuidsReferenced: ['OUTCOME_3', 'WAIT_EVENT_3'],
                iconName: 'standard:formula'
            }
        ];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns an array of object including any childReferences if an element is referenced and has child references', () => {
        const elementGuids = ['WAIT_1', 'DECISION_1'];
        const expectedResult = [
            {
                guid: 'WAIT_EVENT_3',
                label: 'WAIT EVENT 3',
                name: 'WAIT EVENT 3',
                elementGuidsReferenced: ['WAIT_EVENT_1', 'WAIT_EVENT_2'],
                iconName: 'standard:custom'
            },
            {
                guid: 'OUTCOME_3',
                label: 'OUTCOME 3',
                name: 'OUTCOME 3',
                elementGuidsReferenced: ['OUTCOME_1', 'OUTCOME_2'],
                iconName: 'standard:custom'
            }
        ];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toMatchObject(expectedResult);
    });

    it('returns an empty array in case the references are cyclic', () => {
        const elementGuids = [
            'DECISION_1',
            'OUTCOME_3',
            'WAIT_EVENT_3',
            'FORMULA_1'
        ];
        const actualResult = usedBy(elementGuids, elements);
        expect(actualResult).toHaveLength(0);
    });

    describe('usedByStoreAndElementState', () => {
        it('returns an empty array if an element is only referenced by the parent element', () => {
            const decisionOneOutcomes = elements.DECISION_1.outcomeReferences.map(
                ref => {
                    return {
                        guid: ref.outcomeReference,
                        name: elements[ref.outcomeReference].name
                    };
                }
            );

            const actualResult = usedByStoreAndElementState(
                'OUTCOME_4',
                'DECISION_1',
                decisionOneOutcomes
            );
            expect(actualResult).toHaveLength(0);
        });
        it('returns the referencing element if an element is referenced by an element other than the parent', () => {
            const actualResult = usedByStoreAndElementState(
                'guid15',
                'DECISION_1',
                []
            );
            expect(actualResult).not.toHaveLength(0);
        });

        it('returns an empty array if an screen field element is only referenced by the screen element', () => {
            const screenOneFields = elements.SCREEN_1.fieldReferences.map(
                ref => {
                    return {
                        guid: ref.fieldReference,
                        name: elements[ref.fieldReference].name
                    };
                }
            );

            const actualResult = usedByStoreAndElementState(
                'FIELD_3',
                'SCREEN_1',
                screenOneFields
            );
            expect(actualResult).toHaveLength(0);
        });
        it('returns the referencing screen field element if an element is referenced by any element other than the parent screen element', () => {
            const actualResult = usedByStoreAndElementState(
                'guid15',
                'SCREEN_1',
                []
            );
            expect(actualResult).not.toHaveLength(0);
        });
    });
});
