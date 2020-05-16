// @ts-nocheck
import {
    baseResource,
    baseCanvasElement,
    createPastedCanvasElement,
    duplicateCanvasElement,
    duplicateCanvasElementWithChildElements,
    baseChildElement,
    baseCanvasElementsArrayToMap,
    createCondition,
    DUPLICATE_ELEMENT_XY_OFFSET
} from '../../base/baseElement';
import { CONDITION_LOGIC, ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import * as baseList from '../../base/baseList';

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn().mockImplementation(() => {
            return {
                guid: 'originalChildElement',
                name: 'childElement1'
            };
        })
    };
});

const createListRowItemSpy = jest.spyOn(baseList, 'createListRowItem');

const resource = {
    name: 'var1',
    description: 'This is description for variable 1'
};
const canvasElement = {
    name: 'Assignment 1',
    description: 'This is description for assignment 1',
    label: 'Assignment 1',
    locationX: 10,
    locationY: 20,
    connectorCount: 1,
    availableConnections: ['connector1', 'connector2'],
    config: {
        isSelected: true,
        isHighlighted: false
    }
};

const childElement = {
    name: 'Outcome_1',
    label: 'Outcome 1',
    conditionLogic: 'someConditionLogic'
};

const mockCondition1 = {
    leftHandSide: 'lhs1',
    operator: 'foo'
};
const mockCondition2 = {
    leftHandSide: 'lhs2',
    operator: 'bar'
};

const elementList = [
    {
        guid: '1',
        name: 'decision 1'
    },
    {
        guid: '2',
        name: 'decision 2'
    }
];

const connectors = [
    {
        guid: '3',
        label: 'connector 1'
    },
    {
        guid: '4',
        label: 'connector 2'
    }
];

describe('Base resource function', () => {
    it('returns a new resource object with default values when no argument is passed', () => {
        const expectedResult = {
            name: '',
            description: ''
        };
        const actualResult = baseResource();
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new resource object when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'var1',
            description: 'This is description for variable 1'
        };
        const actualResult = baseResource(resource);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new resource object with same value when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'var1',
            description: 'This is description for variable 1'
        };
        const actualResult = baseResource(resource);
        expect(actualResult).toMatchObject(expectedResult);
    });
});

describe('Base canvas element function', () => {
    it('returns a new canvas element object with default values when no argument is passed', () => {
        const expectedResult = {
            name: '',
            description: '',
            label: '',
            locationX: 0,
            locationY: 0,
            connectorCount: 0,
            isCanvasElement: true,
            config: {
                isSelected: false,
                isHighlighted: false
            }
        };
        const actualResult = baseCanvasElement();
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new canvas element object when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'Assignment 1',
            description: 'This is description for assignment 1',
            label: 'Assignment 1',
            locationX: 10,
            locationY: 20,
            connectorCount: 1,
            isCanvasElement: true,
            config: {
                isSelected: true,
                isHighlighted: false
            }
        };
        const actualResult = baseCanvasElement(canvasElement);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new canvas element object with same value when existing resource object is passed as argument', () => {
        const expectedResult = {
            name: 'Assignment 1',
            description: 'This is description for assignment 1',
            label: 'Assignment 1',
            locationX: 10,
            locationY: 20,
            connectorCount: 1,
            isCanvasElement: true,
            config: {
                isSelected: true,
                isHighlighted: false
            }
        };
        const actualResult = baseCanvasElement(canvasElement);
        expect(actualResult).toMatchObject(expectedResult);
    });
});

describe('createPastedCanvasElement Function', () => {
    describe('When the prev and next element are also copied', () => {
        const canvasElementGuidMap = {
            screen1: 'pastedScreen1',
            screen2: 'pastedScreen2',
            decision1: 'pastedDecision1',
            screen3: 'pastedScreen3',
            screen4: 'pastedScreen4'
        };
        const topCutOrCopiedGuid = 'screen1';
        const bottomCutOrCopiedGuid = 'screen4';
        const prev = 'startElement';
        const next = 'screen1';

        it('Should have updated guid, prev and next properties', () => {
            const duplicatedElement = {
                guid: 'pastedScreen2',
                prev: 'screen1',
                next: 'decision1'
            };

            const pastedCanvasElement = createPastedCanvasElement(
                duplicatedElement,
                canvasElementGuidMap,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                prev,
                next,
                null,
                null
            );

            expect(pastedCanvasElement).toMatchObject({
                guid: 'pastedScreen2',
                config: { isSelected: false, isHighlighted: false, isSelectable: true },
                prev: 'pastedScreen1',
                next: 'pastedDecision1'
            });
        });

        it('Should update the children array', () => {
            const duplicatedElement = {
                guid: 'pastedDecision1',
                prev: 'screen2',
                next: 'screen4',
                children: ['screen3', 'screen5']
            };

            const pastedCanvasElement = createPastedCanvasElement(
                duplicatedElement,
                canvasElementGuidMap,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                prev,
                next,
                null,
                null
            );

            expect(pastedCanvasElement).toMatchObject({
                guid: 'pastedDecision1',
                config: { isSelected: false, isHighlighted: false, isSelectable: true },
                prev: 'pastedScreen2',
                next: 'pastedScreen4',
                children: ['pastedScreen3', null]
            });
        });

        it('Should update the parent guid', () => {
            const duplicatedElement = {
                guid: 'pastedScreen3',
                prev: null,
                next: null,
                parent: 'decision1',
                childIndex: 0
            };

            const pastedCanvasElement = createPastedCanvasElement(
                duplicatedElement,
                canvasElementGuidMap,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                prev,
                next,
                null,
                null
            );

            expect(pastedCanvasElement).toMatchObject({
                guid: 'pastedScreen3',
                config: { isSelected: false, isHighlighted: false, isSelectable: true },
                prev: undefined,
                next: undefined,
                parent: 'pastedDecision1',
                childIndex: 0
            });
        });
    });

    describe('When pasting the top or bottom selected element', () => {
        const canvasElementGuidMap = {
            decision1: 'pastedDecision1',
            screen2: 'pastedScreen2'
        };
        const topCutOrCopiedGuid = 'decision1';
        const bottomCutOrCopiedGuid = 'screen2';
        const prev = 'startElement';
        const next = 'screen1';

        it('Top-Selected: Should update the prev and next properties', () => {
            const duplicatedElement = {
                guid: 'pastedDecision1',
                prev: 'screen1',
                next: 'screen2',
                children: [null, null]
            };

            const pastedCanvasElement = createPastedCanvasElement(
                duplicatedElement,
                canvasElementGuidMap,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                prev,
                next,
                null,
                null
            );

            expect(pastedCanvasElement).toMatchObject({
                guid: 'pastedDecision1',
                config: { isSelected: false, isHighlighted: false, isSelectable: true },
                prev: 'startElement',
                next: 'pastedScreen2',
                children: [null, null]
            });
        });

        it('Top-Selected: Should update the children property', () => {
            const duplicatedElement = {
                guid: 'pastedDecision1',
                prev: 'screen1',
                next: 'screen2',
                children: ['screen3', 'screen4']
            };

            const pastedCanvasElement = createPastedCanvasElement(
                duplicatedElement,
                canvasElementGuidMap,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                prev,
                next,
                null,
                null
            );

            expect(pastedCanvasElement).toMatchObject({
                guid: 'pastedDecision1',
                config: { isSelected: false, isHighlighted: false, isSelectable: true },
                prev: 'startElement',
                next: 'pastedScreen2',
                children: [null, null]
            });
        });

        it('Top-Selected: Should delete parent and childIndex properties if not pasting on the head branch', () => {
            const duplicatedElement = {
                guid: 'pastedDecision1',
                prev: null,
                next: 'screen2',
                children: [null, null],
                parent: 'tempDecision',
                childIndex: 0
            };

            const pastedCanvasElement = createPastedCanvasElement(
                duplicatedElement,
                canvasElementGuidMap,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                prev,
                next,
                null,
                null
            );

            expect(pastedCanvasElement).toMatchObject({
                guid: 'pastedDecision1',
                config: { isSelected: false, isHighlighted: false, isSelectable: true },
                prev: 'startElement',
                next: 'pastedScreen2',
                children: [null, null]
            });
        });

        it('Top-Selected: Should update parent and childIndex properties and remove isTerminal property when pasting on the head branch', () => {
            const duplicatedElement = {
                guid: 'pastedDecision1',
                prev: 'screen1',
                next: 'screen2',
                children: [null, null],
                isTerminal: true
            };

            const pastedCanvasElement = createPastedCanvasElement(
                duplicatedElement,
                canvasElementGuidMap,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                null,
                null,
                'tempDecision',
                1
            );

            expect(pastedCanvasElement).toMatchObject({
                guid: 'pastedDecision1',
                config: { isSelected: false, isHighlighted: false, isSelectable: true },
                prev: null,
                next: 'pastedScreen2',
                children: [null, null],
                parent: 'tempDecision',
                childIndex: 1
            });
        });

        it('Bottom-Selected: Should update prev and next properties', () => {
            const duplicatedElement = {
                guid: 'pastedScreen2',
                prev: 'decision1',
                next: 'endElement'
            };

            const pastedCanvasElement = createPastedCanvasElement(
                duplicatedElement,
                canvasElementGuidMap,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                prev,
                next,
                null,
                null
            );

            expect(pastedCanvasElement).toMatchObject({
                guid: 'pastedScreen2',
                config: { isSelected: false, isHighlighted: false, isSelectable: true },
                prev: 'pastedDecision1',
                next: 'screen1'
            });
        });
    });
});

describe('Duplicate Base Canvas Element Function', () => {
    const originalCanvasElement = {
        guid: 'originalElement',
        name: 'Assignment1',
        locationX: 10,
        locationY: 20,
        maxConnections: 1,
        elementType: ELEMENT_TYPE.ASSIGNMENT
    };

    const duplicatedCanvasElement = {
        guid: 'duplicateElement',
        name: 'Assignment1_0',
        locationX: originalCanvasElement.locationX + DUPLICATE_ELEMENT_XY_OFFSET,
        locationY: originalCanvasElement.locationY + DUPLICATE_ELEMENT_XY_OFFSET,
        config: { isSelected: true, isHighlighted: false },
        connectorCount: 0,
        maxConnections: 1,
        elementType: ELEMENT_TYPE.ASSIGNMENT
    };

    const { duplicatedElement } = duplicateCanvasElement(originalCanvasElement, 'duplicateElement', 'Assignment1_0');

    it('The duplicated element should contain updated properties', () => {
        expect(duplicatedElement).toEqual(duplicatedCanvasElement);
    });
});

describe('Duplicate Canvas Element With Child Elements Function', () => {
    const childElementGuidMap = {
        originalChildElement: 'duplicateChildElement'
    };

    const childElementNameMap = {
        childElement1: 'childElement1_0'
    };

    const createChildElement = function(originalChildElement) {
        return originalChildElement;
    };

    describe('When child elements are present', () => {
        const originalCanvasElement = {
            guid: 'originalElement',
            name: 'Decision1',
            locationX: 10,
            locationY: 20,
            maxConnections: 2,
            elementType: ELEMENT_TYPE.DECISION,
            outcomeReferences: [
                {
                    outcomeReference: 'originalChildElement'
                }
            ]
        };

        const defaultAvailableConnections = [
            {
                type: CONNECTOR_TYPE.DEFAULT
            }
        ];

        const {
            duplicatedElement,
            duplicatedChildElements,
            updatedChildReferences,
            availableConnections
        } = duplicateCanvasElementWithChildElements(
            originalCanvasElement,
            'duplicateElement',
            'Decision1_0',
            childElementGuidMap,
            childElementNameMap,
            undefined,
            createChildElement,
            'outcomeReferences',
            'outcomeReference',
            defaultAvailableConnections
        );

        it('The duplicated element should have updated properties', () => {
            const newElement = {
                guid: 'duplicateElement',
                name: 'Decision1_0',
                locationX: originalCanvasElement.locationX + DUPLICATE_ELEMENT_XY_OFFSET,
                locationY: originalCanvasElement.locationY + DUPLICATE_ELEMENT_XY_OFFSET,
                config: { isSelected: true, isHighlighted: false },
                connectorCount: 0,
                maxConnections: 2,
                elementType: ELEMENT_TYPE.DECISION,
                outcomeReferences: [
                    {
                        outcomeReference: 'originalChildElement'
                    }
                ]
            };

            expect(duplicatedElement).toEqual(newElement);
        });

        it('The duplicated child elements should have the duplicated child element', () => {
            expect(duplicatedChildElements).toEqual({
                duplicateChildElement: {
                    guid: 'duplicateChildElement',
                    name: 'childElement1_0'
                }
            });
        });

        it('updatedChildReferences should be an array containing the updated Child References', () => {
            expect(updatedChildReferences).toEqual([
                {
                    outcomeReference: 'duplicateChildElement'
                }
            ]);
        });

        it('availableConenctions should have both default and child referenced available connections', () => {
            expect(availableConnections).toEqual([
                {
                    type: CONNECTOR_TYPE.DEFAULT
                },
                {
                    type: CONNECTOR_TYPE.REGULAR,
                    childReference: 'duplicateChildElement'
                }
            ]);
        });
    });

    describe('When nested child elements are present', () => {
        const originalCanvasElement = {
            guid: 'originalElement',
            name: 'Screen1',
            locationX: 10,
            locationY: 20,
            maxConnections: 1,
            elementType: ELEMENT_TYPE.SCREEN,
            fieldReferences: [
                {
                    fieldReference: 'section1'
                }
            ]
        };

        const createDuplicateChildElements = function(originalChildElement) {
            originalChildElement.guid = 'section1';
            return [
                { guid: 'section1', name: 'section1', fieldReferences: [{ fieldReference: 'column1' }] },
                { guid: 'column1', name: 'column1' }
            ];
        };

        const {
            duplicatedElement,
            duplicatedChildElements,
            updatedChildReferences,
            availableConnections
        } = duplicateCanvasElementWithChildElements(
            originalCanvasElement,
            'duplicateElement',
            'Screen1_0',
            {
                section1: 'duplicateSection1',
                column1: 'duplicateColumn1'
            },
            {
                section1: 'duplicateSection1',
                column1: 'duplicateColumn1'
            },
            undefined,
            createDuplicateChildElements,
            'fieldReferences',
            'fieldReference'
        );

        it('The duplicated element should have updated properties', () => {
            const newElement = {
                guid: 'duplicateElement',
                name: 'Screen1_0',
                locationX: originalCanvasElement.locationX + DUPLICATE_ELEMENT_XY_OFFSET,
                locationY: originalCanvasElement.locationY + DUPLICATE_ELEMENT_XY_OFFSET,
                config: { isSelected: true, isHighlighted: false },
                connectorCount: 0,
                maxConnections: 1,
                elementType: ELEMENT_TYPE.SCREEN,
                fieldReferences: [{ fieldReference: 'section1' }]
            };

            expect(duplicatedElement).toMatchObject(newElement);
        });

        it('The duplicated section component should have the right properties', () => {
            expect(duplicatedChildElements.duplicateSection1).toMatchObject({
                guid: 'duplicateSection1',
                name: 'duplicateSection1',
                fieldReferences: [{ fieldReference: 'duplicateColumn1' }]
            });
        });

        it('The duplicated column component should have the right properties', () => {
            expect(duplicatedChildElements.duplicateColumn1).toMatchObject({
                guid: 'duplicateColumn1',
                name: 'duplicateColumn1'
            });
        });

        it('The updatedChildReferences should be correct', () => {
            expect(updatedChildReferences).toMatchObject([
                {
                    fieldReference: 'duplicateSection1'
                }
            ]);
        });

        it('availableConenctions should be an empty array', () => {
            expect(availableConnections).toEqual([
                {
                    childReference: 'duplicateSection1',
                    type: 'REGULAR'
                }
            ]);
        });
    });

    describe('When child elements are not present', () => {
        const originalCanvasElement = {
            guid: 'originalElement',
            name: 'Screen1',
            locationX: 10,
            locationY: 20,
            maxConnections: 1,
            elementType: ELEMENT_TYPE.SCREEN,
            fieldReferences: []
        };

        const {
            duplicatedElement,
            duplicatedChildElements,
            updatedChildReferences,
            availableConnections
        } = duplicateCanvasElementWithChildElements(
            originalCanvasElement,
            'duplicateElement',
            'Screen1_0',
            childElementGuidMap,
            childElementNameMap,
            undefined,
            createChildElement,
            'fieldReferences',
            'fieldReference'
        );

        it('The duplicated element should have updated properties', () => {
            const newElement = {
                guid: 'duplicateElement',
                name: 'Screen1_0',
                locationX: originalCanvasElement.locationX + DUPLICATE_ELEMENT_XY_OFFSET,
                locationY: originalCanvasElement.locationY + DUPLICATE_ELEMENT_XY_OFFSET,
                config: { isSelected: true, isHighlighted: false },
                connectorCount: 0,
                maxConnections: 1,
                elementType: ELEMENT_TYPE.SCREEN,
                fieldReferences: []
            };

            expect(duplicatedElement).toEqual(newElement);
        });

        it('The duplicated child elements should be an empty object', () => {
            expect(duplicatedChildElements).toEqual({});
        });

        it('updatedChildReferences should be an empty array', () => {
            expect(updatedChildReferences).toEqual([]);
        });

        it('availableConenctions should be an empty array', () => {
            expect(availableConnections).toEqual([]);
        });
    });
});

describe('Base child element function', () => {
    it('throws an Error if no element type specified', () => {
        expect(() => baseChildElement()).toThrow('baseChildElement should only be used for outcomes and wait events');
    });
    it('throws an Error if invalid element type specified', () => {
        expect(() => baseChildElement(childElement, ELEMENT_TYPE.ACTION_CALL)).toThrow(
            'baseChildElement should only be used for outcomes and wait events'
        );
    });
    it('returns a new child element object when existing resource child element is passed as argument', () => {
        const expectedResult = {
            label: 'foo',
            elementType: ELEMENT_TYPE.OUTCOME
        };

        const actualResult = baseChildElement(childElement, ELEMENT_TYPE.OUTCOME);
        expect(actualResult).not.toBe(expectedResult);
    });
    it('returns a new child element object with same value when existing child element object is passed as argument', () => {
        const mockOutcome = {
            label: 'foo',
            elementType: ELEMENT_TYPE.OUTCOME
        };

        const actualResult = baseChildElement(mockOutcome, ELEMENT_TYPE.OUTCOME);
        expect(actualResult).toMatchObject(mockOutcome);
    });

    it('child element returned has data type BOOLEAN even if no data type specified', () => {
        const mockOutcome = {
            label: 'foo',
            elementType: ELEMENT_TYPE.OUTCOME
        };

        const actualResult = baseChildElement(mockOutcome, ELEMENT_TYPE.OUTCOME);
        expect(actualResult.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
    });

    it('throws an Error if data type other than BOOLEAN specified', () => {
        const mockOutcome = {
            conditionLogic: CONDITION_LOGIC.OR,
            conditions: [mockCondition1, mockCondition2],
            dataType: FLOW_DATA_TYPE.STRING.value
        };

        expect(() => baseChildElement(mockOutcome, ELEMENT_TYPE.OUTCOME)).toThrow(
            `dataType ${FLOW_DATA_TYPE.STRING.value} is invalid for baseChildElement`
        );
    });
});

describe('createCondition', () => {
    it('creates a new condition even if one is already passed in', () => {
        const input = {};
        const result = createCondition(input);
        expect(result).not.toBe(input);
    });

    it('calls createListRowItem when given a condition from the store', () => {
        const mockCondition = {
            leftValueReference: '{!foo}',
            rightValue: { stringValue: 'bar' },
            operator: 'fizzBuzz'
        };
        const expectedParam = {
            leftHandSide: mockCondition.leftValueReference,
            rightHandSide: mockCondition.rightValue.stringValue,
            rightHandSideDataType: FLOW_DATA_TYPE.STRING.value,
            operator: mockCondition.operator
        };
        createCondition(mockCondition);
        expect(createListRowItemSpy).toHaveBeenCalledWith(expectedParam);
    });

    it('calls listRowItem when given an existing condition', () => {
        const mockCondition = {
            leftHandSide: 'foo',
            rightHandSide: 'bar',
            rightHandSideDataType: FLOW_DATA_TYPE.STRING.value,
            operator: 'fizzBuzz'
        };
        const condition = createCondition(mockCondition);
        expect(createListRowItemSpy).toHaveBeenCalledWith(mockCondition);
        expect(condition).toBe(createListRowItemSpy.mock.results[0].value);
    });

    it('creates a rowIndex', () => {
        const result = createCondition();
        expect(result).toHaveProperty('rowIndex');
    });

    it('returns a condition list row item', () => {
        const result = createCondition();
        expect(result).toHaveProperty('leftHandSide');
        expect(result).toHaveProperty('operator');
        expect(result).toHaveProperty('rightHandSide');
        expect(result).toHaveProperty('rightHandSideDataType');
    });
});

describe('Base elements with connectors function returns a new object combining elements and connectors', () => {
    it('and have same element object as element in element list', () => {
        const actualResult = baseCanvasElementsArrayToMap(elementList, connectors);
        expect(actualResult.elements['1']).toBe(elementList[0]);
    });
    it('and have same connector array in new object as connector', () => {
        const actualResult = baseCanvasElementsArrayToMap(elementList, connectors);
        expect(actualResult.connectors).toBe(connectors);
    });
});
