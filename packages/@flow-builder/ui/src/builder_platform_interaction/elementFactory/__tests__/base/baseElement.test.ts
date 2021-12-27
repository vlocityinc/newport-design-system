// @ts-nocheck
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { CONDITION_LOGIC, CONNECTOR_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    baseChildElement,
    baseResource,
    createCondition,
    duplicateCanvasElement,
    duplicateCanvasElementWithChildElements,
    DUPLICATE_ELEMENT_XY_OFFSET,
    getDeletedCanvasElementChildren,
    updateChildReferences
} from '../../base/baseElement';
import * as baseList from '../../base/baseList';

const canvasElementWithAllTerminatedChildren = {
    guid: 'decisionWithAllTerminatedChildrenGuid',
    childReferences: [{ childReference: 'outcome1' }],
    children: ['end1', 'end2']
};
const canvasElementWithNoneTerminatedChildren = {
    guid: 'decisionWithNoneTerminatedChildrenGuid',
    childReferences: [{ childReference: 'outcome1' }],
    children: ['end3', 'end4']
};
const existingDecisionWithChildren = {
    guid: 'existingDecisionWithChildrenGuid',
    childReferences: [{ childReference: 'existingOutcome1' }, { childReference: 'existingOutcome2' }],
    children: ['screen1', 'screen2', null]
};
const decisionWithMergingBranches = {
    guid: 'decisionWithMergingBranchesGuid',
    childReferences: [{ childReference: 'outcome1' }, { childReference: 'outcome2' }, { childReference: 'outcome3' }],
    children: ['end1', null, null, 'end2']
};
const decisionWithElementsOnMergingBranches = {
    guid: 'decisionWithElementsOnMergingBranchesGuid',
    childReferences: [{ childReference: 'outcome1' }, { childReference: 'outcome2' }, { childReference: 'outcome3' }],
    children: ['end1', 'screen3', null, 'end2']
};

const end1 = {
    guid: 'end1',
    isTerminal: true
};
const end2 = {
    guid: 'end2',
    isTerminal: true
};
const end3 = {
    guid: 'end3',
    isTerminal: false
};
const end4 = {
    guid: 'end4',
    isTerminal: false
};
const mergingEnd1 = {
    guid: 'mergingEnd1',
    prev: 'decisionWithMergingBranchesGuid'
};
const mergingEnd2 = {
    guid: 'mergingEnd2',
    prev: 'nestedDecisionWithMergingBranchesGuid'
};

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn()
    };
});

getElementByGuid.mockImplementation((guid) => {
    if (guid === 'decisionWithAllTerminatedChildrenGuid') {
        return canvasElementWithAllTerminatedChildren;
    } else if (guid === 'decisionWithNoneTerminatedChildrenGuid') {
        return canvasElementWithNoneTerminatedChildren;
    } else if (guid === 'decisionWithChildrenGuid') {
        return null;
    } else if (guid === 'existingDecisionWithChildrenGuid') {
        return existingDecisionWithChildren;
    } else if (guid === 'decisionWithMergingBranchesGuid' || guid === 'nestedDecisionWithMergingBranchesGuid') {
        return decisionWithMergingBranches;
    } else if (guid === 'decisionWithElementsOnMergingBranchesGuid') {
        return decisionWithElementsOnMergingBranches;
    } else if (guid === 'end1') {
        return end1;
    } else if (guid === 'end2') {
        return end2;
    } else if (guid === 'end3') {
        return end3;
    } else if (guid === 'end4') {
        return end4;
    } else if (guid === 'mergingEnd1') {
        return mergingEnd1;
    } else if (guid === 'mergingEnd2') {
        return mergingEnd2;
    } else if (guid === null) {
        return undefined;
    }

    return {
        guid: 'originalChildElement',
        name: 'childElement1'
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
        isHighlighted: false,
        isSelectable: true,
        hasError: false
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
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
                isHighlighted: false,
                hasError: false
            }
        };
        const actualResult = baseCanvasElement(canvasElement);
        expect(actualResult).toMatchObject(expectedResult);
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
        config: { isSelected: true, isHighlighted: false, hasError: false },
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

    const createChildElement = function (originalChildElement) {
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
            childReferences: [
                {
                    childReference: 'originalChildElement'
                }
            ]
        };

        const defaultAvailableConnections = [
            {
                type: CONNECTOR_TYPE.DEFAULT
            }
        ];

        const { duplicatedElement, duplicatedChildElements, updatedChildReferences, availableConnections } =
            duplicateCanvasElementWithChildElements(
                originalCanvasElement,
                'duplicateElement',
                'Decision1_0',
                childElementGuidMap,
                childElementNameMap,
                undefined,
                createChildElement,
                defaultAvailableConnections
            );

        it('The duplicated element should have updated properties', () => {
            const newElement = {
                guid: 'duplicateElement',
                name: 'Decision1_0',
                locationX: originalCanvasElement.locationX + DUPLICATE_ELEMENT_XY_OFFSET,
                locationY: originalCanvasElement.locationY + DUPLICATE_ELEMENT_XY_OFFSET,
                config: { isSelected: true, isHighlighted: false, hasError: false },
                connectorCount: 0,
                maxConnections: 2,
                elementType: ELEMENT_TYPE.DECISION,
                childReferences: [
                    {
                        childReference: 'originalChildElement'
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
                    childReference: 'duplicateChildElement'
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
            childReferences: [
                {
                    childReference: 'section1'
                }
            ]
        };

        const createDuplicateChildElements = function (originalChildElement) {
            originalChildElement.guid = 'section1';
            return [
                { guid: 'section1', name: 'section1', childReferences: [{ childReference: 'column1' }] },
                { guid: 'column1', name: 'column1' }
            ];
        };

        const { duplicatedElement, duplicatedChildElements, updatedChildReferences, availableConnections } =
            duplicateCanvasElementWithChildElements(
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
                createDuplicateChildElements
            );

        it('The duplicated element should have updated properties', () => {
            const newElement = {
                guid: 'duplicateElement',
                name: 'Screen1_0',
                locationX: originalCanvasElement.locationX + DUPLICATE_ELEMENT_XY_OFFSET,
                locationY: originalCanvasElement.locationY + DUPLICATE_ELEMENT_XY_OFFSET,
                config: { isSelected: true, isHighlighted: false, hasError: false },
                connectorCount: 0,
                maxConnections: 1,
                elementType: ELEMENT_TYPE.SCREEN,
                childReferences: [{ childReference: 'section1' }]
            };

            expect(duplicatedElement).toMatchObject(newElement);
        });

        it('The duplicated section component should have the right properties', () => {
            expect(duplicatedChildElements.duplicateSection1).toMatchObject({
                guid: 'duplicateSection1',
                name: 'duplicateSection1',
                childReferences: [{ childReference: 'duplicateColumn1' }]
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
                    childReference: 'duplicateSection1'
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
            childReferences: []
        };

        const { duplicatedElement, duplicatedChildElements, updatedChildReferences, availableConnections } =
            duplicateCanvasElementWithChildElements(
                originalCanvasElement,
                'duplicateElement',
                'Screen1_0',
                childElementGuidMap,
                childElementNameMap,
                undefined,
                createChildElement
            );

        it('The duplicated element should have updated properties', () => {
            const newElement = {
                guid: 'duplicateElement',
                name: 'Screen1_0',
                locationX: originalCanvasElement.locationX + DUPLICATE_ELEMENT_XY_OFFSET,
                locationY: originalCanvasElement.locationY + DUPLICATE_ELEMENT_XY_OFFSET,
                config: { isSelected: true, isHighlighted: false, hasError: false },
                connectorCount: 0,
                maxConnections: 1,
                elementType: ELEMENT_TYPE.SCREEN,
                childReferences: []
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
        expect(() => baseChildElement()).toThrow(
            'baseChildElement should only be used for outcomes, wait events, scheduled paths and stage steps'
        );
    });
    it('throws an Error if invalid element type specified', () => {
        expect(() => baseChildElement(childElement, ELEMENT_TYPE.ACTION_CALL)).toThrow(
            'baseChildElement should only be used for outcomes, wait events, scheduled paths and stage steps'
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

describe('updateChildReferences', () => {
    const childReferences = [
        {
            childReference: 'abc'
        }
    ];
    it('canvasElementChild is undefined', () => {
        try {
            updateChildReferences(childReferences, undefined);
        } catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toEqual(`Either canvasElementChild or canvasElementChild.guid not defined`);
        }
        expect.assertions(2);
    });
    it('canvasElementChild.guid is undefined', () => {
        const canvasElementChild = { name: 'abc' };
        try {
            updateChildReferences(childReferences, canvasElementChild);
        } catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toEqual(`Either canvasElementChild or canvasElementChild.guid not defined`);
        }
        expect.assertions(2);
    });
    it('child reference is added and returned for a well defined canvasElementChild', () => {
        const canvasElementChild = {
            name: 'outcome1',
            guid: 'outcome1'
        };
        const result = updateChildReferences(childReferences, canvasElementChild);
        expect(result.length).toEqual(2);
        expect(result[1].childReference).toEqual('outcome1');
    });
});

describe('getDeletedCanvasElementChildren', () => {
    const outcome1 = {
        guid: 'outcome1',
        name: 'outcome1'
    };
    const outcome2 = {
        guid: 'outcome2',
        name: 'outcome2'
    };
    const outcome3 = {
        guid: 'outcome3',
        name: 'outcome3'
    };

    const decision1 = {
        guid: 'decisionWithAllTerminatedChildrenGuid',
        name: 'decision1',
        elementType: ELEMENT_TYPE.DECISION,
        childReferences: [
            {
                childReference: 'outcome1'
            },
            {
                childReference: 'outcome2'
            }
        ]
    };
    const decision2 = {
        guid: 'decisionWithNoneTerminatedChildrenGuid',
        name: 'decision2',
        elementType: ELEMENT_TYPE.DECISION,
        childReferences: [
            {
                childReference: 'outcome1'
            },
            {
                childReference: 'outcome2'
            }
        ]
    };

    const mockStoreData = {
        decision1,
        decision2,
        outcome1,
        outcome2,
        outcome3,
        end1,
        end2,
        end3,
        end4
    };

    beforeAll(() => {
        Store.setMockState({
            elements: mockStoreData
        });
    });
    afterAll(() => {
        Store.resetStore();
    });

    it('when children are the same', () => {
        const originalElement = {
            guid: 'decisionWithAllTerminatedChildrenGuid',
            outcomes: [
                {
                    guid: 'outcome1'
                },
                {
                    guid: 'outcome2'
                }
            ]
        };
        const updatedElementChildren = [
            {
                guid: 'outcome1'
            },
            {
                guid: 'outcome2'
            }
        ];

        const deletedChildren = getDeletedCanvasElementChildren(originalElement, updatedElementChildren);

        expect(deletedChildren).toEqual([]);
    });

    it('when a child is deleted', () => {
        const originalElement = {
            guid: 'decisionWithAllTerminatedChildrenGuid',
            outcomes: [
                {
                    guid: 'outcome1'
                },
                {
                    guid: 'outcome2'
                }
            ]
        };
        const updatedElementChildren = [
            {
                guid: 'outcome2'
            }
        ];

        const deletedChildren = getDeletedCanvasElementChildren(originalElement, updatedElementChildren);

        expect(deletedChildren).toEqual([
            {
                guid: 'originalChildElement',
                name: 'childElement1'
            }
        ]);
    });

    it('when a child is added', () => {
        const originalElement = {
            guid: 'decisionWithAllTerminatedChildrenGuid',
            outcomes: [
                {
                    guid: 'outcome1'
                },
                {
                    guid: 'outcome2'
                }
            ],
            children: ['end1', 'end2']
        };
        const updatedElementChildren = [
            {
                guid: 'outcome1'
            },
            {
                guid: 'outcome2'
            },
            {
                guid: 'outcome3'
            }
        ];

        const deletedChildren = getDeletedCanvasElementChildren(originalElement, updatedElementChildren);

        expect(deletedChildren).toEqual([]);
    });

    describe('updateChildReferences', () => {
        const childReferences = [
            {
                childReference: 'abc'
            }
        ];
        it('canvasElementChild is undefined', () => {
            try {
                updateChildReferences(childReferences, undefined);
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toEqual(`Either canvasElementChild or canvasElementChild.guid not defined`);
            }
            expect.assertions(2);
        });
        it('canvasElementChild.guid is undefined', () => {
            const canvasElementChild = { name: 'abc' };
            try {
                updateChildReferences(childReferences, canvasElementChild);
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toEqual(`Either canvasElementChild or canvasElementChild.guid not defined`);
            }
            expect.assertions(2);
        });
        it('child reference is added and returned for a well defined canvasElementChild', () => {
            const canvasElementChild = {
                name: 'outcome1',
                guid: 'outcome1'
            };
            const result = updateChildReferences(childReferences, canvasElementChild);
            expect(result.length).toEqual(2);
            expect(result[1].childReference).toEqual('outcome1');
        });
    });
    // });
});
