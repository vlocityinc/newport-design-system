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
    getUpdatedChildrenAndDeletedChildrenUsingStore,
    updateChildReferences,
    DUPLICATE_ELEMENT_XY_OFFSET
} from '../../base/baseElement';
import { CONDITION_LOGIC, ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import * as baseList from '../../base/baseList';
import { shouldUseAutoLayoutCanvas, getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { Store } from 'builder_platform_interaction/storeLib';

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
        getElementByGuid: jest.fn(),
        shouldUseAutoLayoutCanvas: jest.fn()
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
    it('returns a new canvas element object with auto-layout canvas values when no argument is passed and shouldUseAutoLayoutCanvas is true', () => {
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
                isSelectable: true,
                isHighlighted: false,
                hasError: false
            },
            next: null,
            prev: null
        };
        shouldUseAutoLayoutCanvas.mockImplementation(() => true);
        const actualResult = baseCanvasElement();
        expect(actualResult).toMatchObject(expectedResult);
    });
    it('returns a new canvas element object with auto-layout canvas values when existing resource object is passed as argument and shouldUseAutoLayoutCanvas is true', () => {
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
                isSelectable: true,
                isHighlighted: false,
                hasError: false
            },
            next: null,
            prev: null
        };
        shouldUseAutoLayoutCanvas.mockImplementation(() => true);
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
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
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
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
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
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                prev: null,
                next: null,
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
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
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
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
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
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
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
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
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
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                prev: 'pastedDecision1',
                next: 'screen1'
            });
        });
    });

    describe('When element has a fault branch', () => {
        const canvasElementGuidMap = {
            pause1: 'pastedPause1',
            pause2: 'pastedPause2'
        };
        const topCutOrCopiedGuid = 'pause1';
        const bottomCutOrCopiedGuid = 'pause1';
        const prev = 'pause2';
        const next = 'end2';

        it('Pasted Pause 1 should have updated guid, prev, next and fault properties', () => {
            const duplicatedElement = {
                guid: 'pastedPause1',
                prev: 'start1',
                next: 'end1',
                fault: 'pause2'
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

            expect(pastedCanvasElement).toEqual({
                guid: 'pastedPause1',
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                prev: 'pause2',
                next: 'end2',
                fault: 'pastedPause2'
            });
        });

        it('Pasted Pause 2 should have updated guid, prev and next properties. Fault property should be removed', () => {
            const duplicatedElement = {
                guid: 'pastedPause2',
                prev: null,
                next: 'end2',
                parent: 'pause1',
                childIndex: -1,
                fault: 'assignment1'
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

            expect(pastedCanvasElement).toEqual({
                guid: 'pastedPause2',
                config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                prev: null,
                next: null,
                parent: 'pastedPause1',
                childIndex: -1
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
            'baseChildElement should only be used for outcomes, wait events, time triggers and stage steps'
        );
    });
    it('throws an Error if invalid element type specified', () => {
        expect(() => baseChildElement(childElement, ELEMENT_TYPE.ACTION_CALL)).toThrow(
            'baseChildElement should only be used for outcomes, wait events, time triggers and stage steps'
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

describe('getUpdatedChildrenAndDeletedChildrenUsingStore Function', () => {
    const shouldUseFlc = (useFlc) => {
        shouldUseAutoLayoutCanvas.mockImplementation(() => {
            return useFlc;
        });
    };

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
        ],
        next: null,
        children: ['end1', 'end2'],
        fault: null
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
        ],
        next: null,
        children: ['end3', 'end4'],
        fault: null
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

    it('sets shouldAddEndElement to true when all existing children are on the terminating branch', () => {
        shouldUseFlc(true);
        const canvasElementFromPropertyEditorWithAllTerminatedChildren = {
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
        const canvasElementChildren = [
            {
                guid: 'outcome1'
            },
            {
                guid: 'outcome2'
            }
        ];
        const { shouldAddEndElement } = getUpdatedChildrenAndDeletedChildrenUsingStore(
            canvasElementFromPropertyEditorWithAllTerminatedChildren,
            canvasElementChildren
        );
        expect(shouldAddEndElement).toBeTruthy();
    });
    it('sets shouldAddEndElement to false when not all existing children are on the terminating branch', () => {
        shouldUseFlc(true);
        const canvasElementFromPropertyEditorWithNoneTerminatedChildren = {
            guid: 'decisionWithNoneTerminatedChildrenGuid',
            outcomes: [
                {
                    guid: 'outcome1'
                },
                {
                    guid: 'outcome2'
                }
            ],
            children: ['end3', 'end4']
        };
        const canvasElementChildren = [];
        const { shouldAddEndElement } = getUpdatedChildrenAndDeletedChildrenUsingStore(
            canvasElementFromPropertyEditorWithNoneTerminatedChildren,
            canvasElementChildren
        );
        expect(shouldAddEndElement).toBeFalsy();
    });

    it('sets newEndElementIdx to the right index to add end element when all existing children are on the terminating branch', () => {
        shouldUseFlc(true);
        const canvasElementFromPropertyEditorWithAllTerminatedChildren = {
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
        const canvasElementChildren = [
            {
                guid: 'outcome1'
            },
            {
                guid: 'outcome2'
            }
        ];
        const { newEndElementIdx } = getUpdatedChildrenAndDeletedChildrenUsingStore(
            canvasElementFromPropertyEditorWithAllTerminatedChildren,
            canvasElementChildren
        );
        expect(newEndElementIdx).toEqual(1);
    });
    it('sets newEndElementIdx to undefined, shouldAddEndElement as false when adding multiple outcomes from property editor and all existing children are on the terminating branch', () => {
        shouldUseFlc(true);
        const canvasElementFromPropertyEditorWithThreeOutcomes = {
            guid: 'decisionWithAllTerminatedChildrenGuid',
            outcomes: [
                {
                    guid: 'outcome1'
                },
                {
                    guid: 'outcome2'
                },
                {
                    guid: 'outcome3'
                }
            ],
            children: ['end1', 'end2']
        };
        const canvasElementChildren = [
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
        const { shouldAddEndElement, newEndElementIdx } = getUpdatedChildrenAndDeletedChildrenUsingStore(
            canvasElementFromPropertyEditorWithThreeOutcomes,
            canvasElementChildren
        );
        expect.assertions(2);
        expect(newEndElementIdx).toBeUndefined();
        expect(shouldAddEndElement).toBeTruthy();
    });

    it('initializes children correctly for new decision with children', () => {
        shouldUseFlc(true);
        const decisionFromPropertyEditorWithChildren = {
            guid: 'decisionWithChildrenGuid',
            outcomes: [
                {
                    guid: 'outcome1'
                }
            ],
            children: null
        };
        const outcomes = [
            {
                guid: 'outcome1'
            }
        ];
        const { newChildren } = getUpdatedChildrenAndDeletedChildrenUsingStore(
            decisionFromPropertyEditorWithChildren,
            outcomes
        );

        expect(newChildren).toEqual([null, null]);
    });

    describe('delete children', () => {
        const screen1 = {
            guid: 'screen1',
            name: 'screen1',
            elementType: ELEMENT_TYPE.SCREEN,
            prev: null,
            next: null,
            parent: 'existingDecisionWithChildrenGuid',
            childIndex: 0,
            isTerminal: false
        };

        const screen2 = {
            guid: 'screen2',
            name: 'screen2',
            elementType: ELEMENT_TYPE.SCREEN,
            prev: null,
            next: null,
            parent: 'existingDecisionWithChildrenGuid',
            childIndex: 1,
            isTerminal: true
        };

        const mockStoreState = {
            screen1,
            screen2
        };

        beforeAll(() => {
            Store.setMockState({
                elements: mockStoreState
            });
        });
        afterAll(() => {
            Store.resetStore();
        });

        it('gets updated children correctly for existing decision with children', () => {
            shouldUseFlc(true);
            const existingDecisionFromPropertyEditorWithChildren = {
                guid: 'existingDecisionWithChildrenGuid',
                outcomes: [
                    {
                        guid: 'existingOutcome1'
                    }
                ],
                children: ['screen1', 'screen2', null]
            };
            const outcomes = [
                {
                    guid: 'existingOutcome1'
                }
            ];
            const { newChildren } = getUpdatedChildrenAndDeletedChildrenUsingStore(
                existingDecisionFromPropertyEditorWithChildren,
                outcomes
            );

            expect(newChildren).toEqual(['screen1', null]);
        });

        it('deletedBranchHeadGuids should include "screen2" for existing decision with children', () => {
            shouldUseFlc(true);
            const existingDecisionFromPropertyEditorWithChildren = {
                guid: 'existingDecisionWithChildrenGuid',
                outcomes: [
                    {
                        guid: 'existingOutcome1'
                    }
                ],
                children: ['screen1', 'screen2', null]
            };
            const outcomes = [
                {
                    guid: 'existingOutcome1'
                }
            ];
            const result = getUpdatedChildrenAndDeletedChildrenUsingStore(
                existingDecisionFromPropertyEditorWithChildren,
                outcomes
            );
            expect(result.deletedBranchHeadGuids).toEqual(['screen2']);
        });

        describe('deleted children are on the merging branches', () => {
            let decision;
            let outcomes;
            beforeEach(() => {
                decision = {
                    guid: 'decisionWithMergingBranchesGuid',
                    outcomes: [
                        {
                            guid: 'outcome1'
                        }
                    ],
                    children: ['end1', null, null, 'end2'],
                    next: 'mergingEnd1'
                };
                outcomes = [
                    {
                        guid: 'outcome1'
                    }
                ];
            });

            const decisionFromStore = {
                guid: 'decisionWithMergingBranchesGuid',
                outcomes: [
                    {
                        guid: 'outcome1'
                    },
                    {
                        guid: 'outcome2'
                    },
                    {
                        guid: 'outcome3'
                    }
                ],
                children: ['end1', null, null, 'end2'],
                next: 'mergingEnd1'
            };

            const mockStore = {
                decisionFromStore,
                outcome1,
                outcome2,
                outcome3,
                end1,
                end2,
                mergingEnd1
            };

            beforeAll(() => {
                Store.setMockState({
                    elements: mockStore
                });
            });
            afterAll(() => {
                Store.resetStore();
            });

            it('deletedBranchHeadGuids should include canvas elements next', () => {
                shouldUseFlc(true);
                const { deletedBranchHeadGuids } = getUpdatedChildrenAndDeletedChildrenUsingStore(decision, outcomes);
                expect(deletedBranchHeadGuids).toEqual(['mergingEnd1']);
            });

            it('shouldMarkBranchHeadAsTerminal should be true', () => {
                shouldUseFlc(true);
                const { shouldMarkBranchHeadAsTerminal } = getUpdatedChildrenAndDeletedChildrenUsingStore(
                    decision,
                    outcomes
                );
                expect(shouldMarkBranchHeadAsTerminal).toBeTruthy();
            });
        });

        describe('deleted children are on the nested merging branches', () => {
            let decision;
            let outcomes;
            beforeEach(() => {
                decision = {
                    guid: 'nestedDecisionWithMergingBranchesGuid',
                    outcomes: [
                        {
                            guid: 'outcome1'
                        }
                    ],
                    children: ['end1', null, null, 'end2'],
                    next: null
                };
                outcomes = [
                    {
                        guid: 'outcome1'
                    }
                ];
            });

            const nestedDecisionFromStore = {
                guid: 'nestedDecisionWithMergingBranchesGuid',
                outcomes: [
                    {
                        guid: 'outcome1'
                    },
                    {
                        guid: 'outcome2'
                    },
                    {
                        guid: 'outcome3'
                    }
                ],
                children: ['end1', null, null, 'end2'],
                next: 'null'
            };

            const decisionFromStore = {
                guid: 'decisionGuid',
                outcomes: [
                    {
                        guid: 'outcome1'
                    }
                ],
                children: ['nestedDecisionWithMergingBranchesGuid', null],
                next: 'end3'
            };

            const mockStore = {
                decisionFromStore,
                nestedDecisionFromStore,
                outcome1,
                outcome2,
                outcome3,
                end1,
                end2,
                end3,
                mergingEnd2
            };

            beforeAll(() => {
                Store.setMockState({
                    elements: mockStore
                });
            });
            afterAll(() => {
                Store.resetStore();
            });

            it('deletedBranchHeadGuids should be empty', () => {
                shouldUseFlc(true);
                const { deletedBranchHeadGuids } = getUpdatedChildrenAndDeletedChildrenUsingStore(decision, outcomes);
                expect(deletedBranchHeadGuids).toEqual([]);
            });

            it('shouldMarkBranchHeadAsTerminal should be true', () => {
                shouldUseFlc(true);
                const { shouldMarkBranchHeadAsTerminal } = getUpdatedChildrenAndDeletedChildrenUsingStore(
                    decision,
                    outcomes
                );
                expect(shouldMarkBranchHeadAsTerminal).toBeTruthy();
            });
        });

        describe('deleted children are on the merging branches and there are elements before and after merging', () => {
            let decision;
            let outcomes;
            beforeEach(() => {
                decision = {
                    guid: 'decisionWithElementsOnMergingBranchesGuid',
                    outcomes: [
                        {
                            guid: 'outcome1'
                        }
                    ],
                    children: ['end1', 'screen3', null, 'end2'],
                    next: 'screen4'
                };
                outcomes = [
                    {
                        guid: 'outcome1'
                    }
                ];
            });

            const screen3 = {
                guid: 'screen3',
                name: 'screen3',
                elementType: ELEMENT_TYPE.SCREEN,
                prev: null,
                next: null,
                parent: 'decisionWithElementsOnMergingBranchesGuid',
                childIndex: 1,
                isTerminal: false
            };

            const screen4 = {
                guid: 'screen4',
                name: 'screen4',
                elementType: ELEMENT_TYPE.SCREEN,
                prev: 'decisionWithElementsOnMergingBranchesGuid',
                next: 'mergingEnd1',
                childIndex: 1,
                isTerminal: false
            };

            const decisionFromStore = {
                guid: 'decisionWithElementsOnMergingBranchesGuid',
                outcomes: [
                    {
                        guid: 'outcome1'
                    },
                    {
                        guid: 'outcome2'
                    },
                    {
                        guid: 'outcome3'
                    }
                ],
                children: ['end1', 'screen3', null, 'end2'],
                next: 'screen4'
            };

            const mockStore = {
                decisionFromStore,
                outcome1,
                outcome2,
                outcome3,
                screen3,
                screen4,
                end1,
                end2,
                mergingEnd1
            };

            beforeAll(() => {
                Store.setMockState({
                    elements: mockStore
                });
            });
            afterAll(() => {
                Store.resetStore();
            });

            it('deletedBranchHeadGuids should include elements before and after merging', () => {
                shouldUseFlc(true);
                const { deletedBranchHeadGuids } = getUpdatedChildrenAndDeletedChildrenUsingStore(decision, outcomes);
                expect(deletedBranchHeadGuids).toEqual(['screen3', 'screen4']);
            });

            it('shouldMarkBranchHeadAsTerminal should be true', () => {
                shouldUseFlc(true);
                const { shouldMarkBranchHeadAsTerminal } = getUpdatedChildrenAndDeletedChildrenUsingStore(
                    decision,
                    outcomes
                );
                expect(shouldMarkBranchHeadAsTerminal).toBeTruthy();
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
    });
});
