// @ts-nocheck
import {
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData,
    getCanvasElementDeselectionDataOnToggleOff
} from '../flcBuilderUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

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

describe('FLC Canvas Utils test', () => {
    describe('getCanvasElementSelectionData function', () => {
        it('When no element has been previously selected', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3'
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null
                }
            };

            const result = getCanvasElementSelectionData(flowModel, 'guid2', null);
            checkSelectionDeselectionResultEquality(result, ['guid2'], [], ['guid2', 'guid1', 'guid3'], 'guid2');
        });

        it('When no element has been previously selected and selecting a branch element', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE.SCREEN,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', 'guid5']
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE.SCREEN,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE.SCREEN,
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
                    elementType: ELEMENT_TYPE.SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid2',
                    prev: null,
                    next: null,
                    childIndex: 1
                }
            };

            const result = getCanvasElementSelectionData(flowModel, 'guid4', null);
            checkSelectionDeselectionResultEquality(result, ['guid4'], [], ['guid4', 'guid2', 'guid1'], 'guid4');
        });

        it('When selecting elements downwards', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE.SCREEN,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', 'guid5']
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null,
                    children: ['guid6', null]
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE.SCREEN,
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
                    elementType: ELEMENT_TYPE.SCREEN,
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
                    elementType: ELEMENT_TYPE.SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid3',
                    prev: null,
                    next: null,
                    childIndex: 0
                }
            };

            const result = getCanvasElementSelectionData(flowModel, 'guid6', 'guid2');
            checkSelectionDeselectionResultEquality(
                result,
                ['guid6', 'guid3', 'guid4', 'guid5'],
                [],
                ['guid2', 'guid1', 'guid4', 'guid5', 'guid3', 'guid6'],
                'guid2'
            );
        });

        it('When selecting elements upwards', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE.START_ELEMENT,
                    prev: null,
                    next: 'guid2'
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid1',
                    next: 'guid3',
                    children: ['guid4', 'guid5']
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: false
                    },
                    prev: 'guid2',
                    next: null,
                    children: ['guid6', null]
                },
                guid4: {
                    guid: 'guid4',
                    elementType: ELEMENT_TYPE.SCREEN,
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
                    elementType: ELEMENT_TYPE.SCREEN,
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
                    elementType: ELEMENT_TYPE.SCREEN,
                    config: {
                        isSelected: true
                    },
                    parent: 'guid3',
                    prev: null,
                    next: null,
                    childIndex: 0
                }
            };

            const result = getCanvasElementSelectionData(flowModel, 'guid2', 'guid6');
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
                        elementType: ELEMENT_TYPE.ASSIGNMENT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE.DECISION,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null]
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: false
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: false
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(result, [], ['guid2'], [], '');
            });

            it('When top element is not the only selected element', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE.ASSIGNMENT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE.DECISION,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null]
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: false
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(result, [], ['guid2'], ['guid3', 'guid2', 'guid1'], 'guid3');
            });

            it('When top element has selected child elements', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE.ASSIGNMENT,
                        config: {
                            isSelected: false
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE.DECISION,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', null]
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 0
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid2', 'guid2');
                checkSelectionDeselectionResultEquality(
                    result,
                    [],
                    ['guid2', 'guid4'],
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
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3'
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid2', 'guid1');
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
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE.DECISION,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', 'guid5']
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE.SCREEN,
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
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 1
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid2', 'guid1');
                checkSelectionDeselectionResultEquality(
                    result,
                    [],
                    ['guid2', 'guid5', 'guid3'],
                    ['guid1', 'guid2', 'guid4', 'guid5', 'guid3'],
                    'guid1'
                );
            });

            it('When the deselected middle element is a branch element where the parent is also selected', () => {
                const flowModel = {
                    guid1: {
                        guid: 'guid1',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: null,
                        next: 'guid2'
                    },
                    guid2: {
                        guid: 'guid2',
                        elementType: ELEMENT_TYPE.DECISION,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid1',
                        next: 'guid3',
                        children: ['guid4', 'guid5']
                    },
                    guid3: {
                        guid: 'guid3',
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        prev: 'guid2',
                        next: null
                    },
                    guid4: {
                        guid: 'guid4',
                        elementType: ELEMENT_TYPE.SCREEN,
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
                        elementType: ELEMENT_TYPE.SCREEN,
                        config: {
                            isSelected: true
                        },
                        parent: 'guid2',
                        prev: null,
                        next: null,
                        childIndex: 1
                    }
                };

                const result = getCanvasElementDeselectionData(flowModel, 'guid5', 'guid1');
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
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: false
                    },
                    prev: null,
                    next: 'guid2',
                    children: [null, null]
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid1',
                    next: 'guid3'
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE.SCREEN,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid2',
                    next: null
                }
            };

            const result = getCanvasElementDeselectionDataOnToggleOff(flowModel, 'guid2');
            checkSelectionDeselectionResultEquality(result, [], ['guid2', 'guid3'], [], '');
        });

        it('Deselects all selected branch elements and following select elements', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: true
                    },
                    prev: null,
                    next: 'guid2',
                    children: ['guid3', 'guid4']
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid1',
                    next: null
                },
                guid3: {
                    guid: 'guid3',
                    elementType: ELEMENT_TYPE.SCREEN,
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
                    elementType: ELEMENT_TYPE.SCREEN,
                    config: {
                        isSelected: false
                    },
                    parent: 'guid1',
                    prev: null,
                    next: null,
                    childIndex: 1
                }
            };

            const result = getCanvasElementDeselectionDataOnToggleOff(flowModel, 'guid1');
            checkSelectionDeselectionResultEquality(result, [], ['guid1', 'guid3', 'guid2'], [], '');
        });

        it('Deselects all selected elements in a complex flow', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: true
                    },
                    prev: null,
                    next: 'guid8',
                    children: ['guid2', 'guid3']
                },
                guid2: {
                    guid: 'guid2',
                    elementType: ELEMENT_TYPE.SCREEN,
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
                    elementType: ELEMENT_TYPE.DECISION,
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
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid2',
                    next: null,
                    children: [null, 'guid7']
                },
                guid5: {
                    guid: 'guid5',
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
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
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
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
                    elementType: ELEMENT_TYPE.DECISION,
                    config: {
                        isSelected: true
                    },
                    parent: 'guid4',
                    prev: null,
                    next: null,
                    childIndex: 1,
                    children: [null, null]
                },
                guid8: {
                    guid: 'guid8',
                    elementType: ELEMENT_TYPE.ASSIGNMENT,
                    config: {
                        isSelected: true
                    },
                    prev: 'guid1',
                    next: null
                }
            };

            const result = getCanvasElementDeselectionDataOnToggleOff(flowModel, 'guid1');
            checkSelectionDeselectionResultEquality(
                result,
                [],
                ['guid1', 'guid2', 'guid4', 'guid7', 'guid3', 'guid8'],
                [],
                ''
            );
        });
    });
});
