// @ts-nocheck
import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';
import {
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData,
    getCanvasElementDeselectionDataOnToggleOff,
    getFlcMenuData
} from '../flcComponentsUtils';

import * as autoLayoutTestUtils from '../../../../../auto-layout-canvas/src/__tests__/testUtils.js';

const ELEMENT_TYPE_ASSIGNMENT = 'Assignment';
const ELEMENT_TYPE_DECISION = 'Decision';
const ELEMENT_TYPE_SCREEN = 'Screen';
const ELEMENT_TYPE_START_ELEMENT = 'START_ELEMENT';
const ELEMENT_TYPE_WAIT = 'wait';
const ELEMENT_TYPE_END_ELEMENT = 'end';
const ELEMENT_TYPE_LOOP = 'Loop';

const elementsMetadata = {
    [ELEMENT_TYPE_ASSIGNMENT]: { type: ElementType.DEFAULT },
    [ELEMENT_TYPE_DECISION]: { type: ElementType.BRANCH },
    [ELEMENT_TYPE_WAIT]: { type: ElementType.BRANCH },
    [ELEMENT_TYPE_SCREEN]: { type: ElementType.DEFAULT },
    [ELEMENT_TYPE_START_ELEMENT]: { type: ElementType.START },
    [ELEMENT_TYPE_END_ELEMENT]: { type: ElementType.END },
    [ELEMENT_TYPE_LOOP]: { type: ElementType.LOOP }
};
const checkSelectionDeselectionResultEquality = (
    result,
    expectedCanvasElementGuidsToSelect,
    expectedCanvasElementGuidsToDeselect,
    expectedSelectableCanvasElementGuids,
    expectedTopSelectedGuid
) => {
    expect(result.canvasElementGuidsToSelect).toEqual(expectedCanvasElementGuidsToSelect);
    expect(result.canvasElementGuidsToDeselect).toEqual(expectedCanvasElementGuidsToDeselect);
    expect(result.selectableCanvasElementGuids).toEqual(expectedSelectableCanvasElementGuids);
    if (expectedTopSelectedGuid === '') {
        expect(result.topSelectedGuid).toBeNull();
    } else {
        expect(result.topSelectedGuid).toEqual(expectedTopSelectedGuid);
    }
};

function testGetFlcMenuData(toggleMenuDetail, expectedHasEndElement) {
    const flowRenderContext = autoLayoutTestUtils.getFlowWithDecisionWithEndedLeftBranchContext();

    const { flowModel } = flowRenderContext;

    const menuButtonHalfWidth = 12;
    const containerElementGeometry = {
        x: 0,
        y: 0,
        w: 500,
        h: 500
    };

    const menuData = getFlcMenuData({ detail: toggleMenuDetail }, menuButtonHalfWidth, containerElementGeometry, 1, {
        flowModel,
        elementsMetadata: flowRenderContext.elementsMetadata
    });

    expect(menuData.hasEndElement).toEqual(expectedHasEndElement);
}

describe('FLC Canvas Utils test', () => {
    describe('getFlcMenuData', () => {
        it('hasEndElement is true on branch when next element is not end node', () => {
            const hasEndElement = true;

            testGetFlcMenuData(
                {
                    top: 0,
                    left: 0,
                    elementMetadata: { type: ElementType.DEFAULT },
                    parent: 'branch-guid',
                    childIndex: 1
                },
                hasEndElement
            );
        });

        it('hasEndElement is false on branch when next element is end node', () => {
            const hasEndElement = false;

            testGetFlcMenuData(
                {
                    top: 0,
                    left: 0,
                    elementMetadata: { type: ElementType.DEFAULT },
                    parent: 'branch-guid',
                    childIndex: 0,
                    next: 'branch-left-head-guid'
                },
                hasEndElement
            );
        });
    });

    describe('getCanvasElementSelectionData function', () => {
        it('When no element has been previously selected', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3'
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null
                }
            };

            const result = getCanvasElementSelectionData(elementsMetadata, flowModel, 'guid2', null);
            checkSelectionDeselectionResultEquality(result, ['guid2'], [], ['guid2', 'guid1', 'guid3'], 'guid2');
        });

        it('When no element has been previously selected and selecting a branch element', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_DECISION,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', 'guid5']
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 0
                },
                guid5: {
                    guid: 'guid5',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 1
                }
            };

            const result = getCanvasElementSelectionData(elementsMetadata, flowModel, 'guid4', null);
            checkSelectionDeselectionResultEquality(result, ['guid4'], [], ['guid4', 'guid2', 'guid1'], 'guid4');
        });

        it('When selecting elements downwards', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: true
                    },
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_WAIT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', null],
                    fault: 'guid5'
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: 'end1'
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE_WAIT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 0,
                    children: [null, null],
                    fault: 'guid6'
                },
                guid5: {
                    guid: 'guid5',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: 'end2',
                    childIndex: -1
                },
                guid6: {
                    guid: 'guid6',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid4',
                    prev: null,
                    next: 'end3',
                    childIndex: -1
                },
                end1: {
                    guid: 'end1',
                    elementType: ELEMENT_TYPE_END_ELEMENT,
                    prev: 'guid3',
                    next: null
                },
                end2: {
                    guid: 'end2',
                    elementType: ELEMENT_TYPE_END_ELEMENT,
                    prev: 'guid5',
                    next: null
                },
                end3: {
                    guid: 'end3',
                    elementType: ELEMENT_TYPE_END_ELEMENT,
                    prev: 'guid6',
                    next: null
                }
            };

            const result = getCanvasElementSelectionData(elementsMetadata, flowModel, 'guid3', 'guid1');
            checkSelectionDeselectionResultEquality(
                result,
                ['guid3', 'guid4', 'guid6', 'guid2'],
                [],
                ['guid1', 'guid2', 'guid4', 'guid6', 'guid5', 'guid3'],
                'guid1'
            );
        });

        it('When selecting elements upwards', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_START_ELEMENT,
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_DECISION,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', 'guid5']
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_LOOP,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null,
                    children: ['guid6']
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 0
                },
                guid5: {
                    guid: 'guid5',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 1
                },
                guid6: {
                    guid: 'guid6',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: true
                    },
                    parent: 'guid3',
                    prev: null,
                    next: null,
                    childIndex: 0
                }
            };

            const result = getCanvasElementSelectionData(elementsMetadata, flowModel, 'guid2', 'guid6');
            checkSelectionDeselectionResultEquality(
                result,
                ['guid3', 'guid4', 'guid5', 'guid2'],
                [],
                ['guid2', 'guid4', 'guid5', 'guid3', 'guid6'],
                'guid2'
            );
        });
    });

    describe('getCanvasElementDeselectionData function', () => {
        describe('Deselecting the top selected element', () => {
            it('When top element is the only selected element', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_ASSIGNMENT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_DECISION,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null]
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: false
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: false
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0
                    }
                };

                const result = getCanvasElementDeselectionData(elementsMetadata, flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(result, [], ['guid2'], [], '');
            });

            it('When top element is not the only selected element', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_ASSIGNMENT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_DECISION,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null]
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: false
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0
                    }
                };

                const result = getCanvasElementDeselectionData(elementsMetadata, flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(result, [], ['guid2'], ['guid3', 'guid2', 'guid1'], 'guid3');
            });

            it('When top element has selected child elements', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_ASSIGNMENT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_WAIT,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null],
                        fault: 'guid5'
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: 'end1'
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE_WAIT,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0,
                        children: [null, null],
                        fault: 'guid6'
                    },
                    guid5: {
                        guid: 'guid5',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: 'end2',
                        childIndex: -1
                    },
                    guid6: {
                        guid: 'guid6',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid4',
                        prev: null,
                        next: 'end3',
                        childIndex: -1
                    },
                    end1: {
                        guid: 'end1',
                        elementType: ELEMENT_TYPE_END_ELEMENT,
                        prev: 'guid3',
                        next: null
                    },
                    end2: {
                        guid: 'end2',
                        elementType: ELEMENT_TYPE_END_ELEMENT,
                        prev: 'guid5',
                        next: null
                    },
                    end3: {
                        guid: 'end3',
                        elementType: ELEMENT_TYPE_END_ELEMENT,
                        prev: 'guid6',
                        next: null
                    }
                };

                const result = getCanvasElementDeselectionData(elementsMetadata, flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(
                    result,
                    [],
                    ['guid2', 'guid4', 'guid6', 'guid5'],
                    ['guid3', 'guid2', 'guid1'],
                    'guid3'
                );
            });
        });

        describe('Deselecting a middle selected element', () => {
            it('When middle element in a simple flow (straight line) is deselected', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3'
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    }
                };

                const result = getCanvasElementDeselectionData(elementsMetadata, flowModel, 'guid2', 'guid1');
                checkSelectionDeselectionResultEquality(
                    result,
                    [],
                    ['guid2', 'guid3'],
                    ['guid1', 'guid2', 'guid3'],
                    'guid1'
                );
            });

            it('When the deselected middle element is a Decision element with a selected branch', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_ASSIGNMENT,
                        config: {
                            isSelected: true
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_WAIT,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null],
                        fault: 'guid5'
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: 'end1'
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE_WAIT,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0,
                        children: [null, null],
                        fault: 'guid6'
                    },
                    guid5: {
                        guid: 'guid5',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: 'end2',
                        childIndex: -1
                    },
                    guid6: {
                        guid: 'guid6',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid4',
                        prev: null,
                        next: 'end3',
                        childIndex: -1
                    },
                    end1: {
                        guid: 'end1',
                        elementType: ELEMENT_TYPE_END_ELEMENT,
                        prev: 'guid3',
                        next: null
                    },
                    end2: {
                        guid: 'end2',
                        elementType: ELEMENT_TYPE_END_ELEMENT,
                        prev: 'guid5',
                        next: null
                    },
                    end3: {
                        guid: 'end3',
                        elementType: ELEMENT_TYPE_END_ELEMENT,
                        prev: 'guid6',
                        next: null
                    }
                };

                const result = getCanvasElementDeselectionData(elementsMetadata, flowModel, 'guid2', 'guid1');
                checkSelectionDeselectionResultEquality(
                    result,
                    [],
                    ['guid2', 'guid4', 'guid6', 'guid5', 'guid3'],
                    ['guid1', 'guid2', 'guid4', 'guid6', 'guid5', 'guid3'],
                    'guid1'
                );
            });

            it('When the deselected middle element is a branch element where the parent is also selected', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE_DECISION,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', 'guid5']
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: false
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0
                    },
                    guid5: {
                        guid: 'guid5',
                        elementType: ELEMENT_TYPE_SCREEN,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 1
                    }
                };

                const result = getCanvasElementDeselectionData(elementsMetadata, flowModel, 'guid5', 'guid1');
                checkSelectionDeselectionResultEquality(
                    result,
                    [],
                    ['guid5'],
                    ['guid1', 'guid2', 'guid4', 'guid5', 'guid3'],
                    'guid1'
                );
            });
        });
    });

    describe('getCanvasElementDeselectionDataOnToggleOff function', () => {
        it('Deselects all selected elements in a simple flow (straight line)', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_DECISION,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2',
                    children: [null, null]
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid1',
                    next: 'guid3'
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid2',
                    next: null
                }
            };

            const result = getCanvasElementDeselectionDataOnToggleOff(elementsMetadata, flowModel, 'guid2');
            checkSelectionDeselectionResultEquality(result, [], ['guid2', 'guid3'], [], '');
        });

        it('Deselects all selected branch elements and following selected elements', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_DECISION,
                    config: {
                        isSelected: true
                    },
                    prev: null,
                    next: 'guid2',
                    children: ['guid3', 'guid4']
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid1',
                    next: null
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: true
                    },
                    parent: 'guid1',
                    prev: null,
                    next: null,
                    childIndex: 0
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid1',
                    prev: null,
                    next: null,
                    childIndex: 1
                }
            };

            const result = getCanvasElementDeselectionDataOnToggleOff(elementsMetadata, flowModel, 'guid1');
            checkSelectionDeselectionResultEquality(result, [], ['guid1', 'guid3', 'guid2'], [], '');
        });

        it('Deselects all selected elements in a complex flow', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE_DECISION,
                    config: {
                        isSelected: true
                    },
                    prev: null,
                    next: 'guid8',
                    children: ['guid2', 'guid3']
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE_SCREEN,
                    config: {
                        isSelected: true
                    },
                    parent: 'guid1',
                    prev: null,
                    next: 'guid4',
                    childIndex: 0
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE_DECISION,
                    config: {
                        isSelected: true
                    },
                    parent: 'guid1',
                    prev: null,
                    next: null,
                    childIndex: 1,
                    children: ['guid5', 'guid6']
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE_DECISION,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid2',
                    next: null,
                    children: [null, 'guid7']
                },
                guid5: {
                    guid: 'guid5',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid3',
                    prev: null,
                    next: null,
                    childIndex: 0
                },
                guid6: {
                    guid: 'guid6',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid3',
                    prev: null,
                    next: null,
                    childIndex: 1
                },
                guid7: {
                    guid: 'guid7',
                    elementType: ELEMENT_TYPE_WAIT,
                    config: {
                        isSelected: true
                    },
                    parent: 'guid4',
                    prev: null,
                    next: null,
                    childIndex: 1,
                    children: [null, null],
                    fault: 'guid9'
                },
                guid8: {
                    guid: 'guid8',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid1',
                    next: null
                },
                guid9: {
                    guid: 'guid9',
                    elementType: ELEMENT_TYPE_ASSIGNMENT,
                    config: {
                        isSelected: true
                    },
                    prev: null,
                    next: 'end1',
                    parent: 'guid7',
                    childIndex: -1
                },
                end1: {
                    guid: 'end1',
                    elementType: ELEMENT_TYPE_END_ELEMENT,
                    prev: 'guid9',
                    next: null
                }
            };

            const result = getCanvasElementDeselectionDataOnToggleOff(elementsMetadata, flowModel, 'guid1');
            checkSelectionDeselectionResultEquality(
                result,
                [],
                ['guid1', 'guid2', 'guid4', 'guid7', 'guid9', 'guid3', 'guid8'],
                [],
                ''
            );
        });
    });
});
