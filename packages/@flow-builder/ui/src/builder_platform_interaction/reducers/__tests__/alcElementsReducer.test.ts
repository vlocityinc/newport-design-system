// @ts-nocheck
import {
    ADD_CANVAS_ELEMENT,
    ADD_START_ELEMENT,
    DELETE_ELEMENT,
    MODIFY_DECISION_WITH_OUTCOMES,
    MODIFY_START_WITH_SCHEDULED_PATHS,
    SELECTION_ON_FIXED_CANVAS,
    ADD_FAULT,
    PASTE_ON_FIXED_CANVAS,
    ADD_SCREEN_WITH_FIELDS,
    DECORATE_CANVAS,
    CLEAR_CANVAS_DECORATION,
    DELETE_GOTO_CONNECTION
} from 'builder_platform_interaction/actions';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import {
    reducer,
    actions,
    HighlightInfo,
    FAULT_INDEX,
    FOR_EACH_INDEX,
    NodeType,
    START_IMMEDIATE_INDEX
} from 'builder_platform_interaction/autoLayoutCanvas';

import alcElementsReducer from '../alcElementsReducer';

import { CONNECTOR_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('../elementsReducer', () => {
    return jest.fn((state) => Object.assign({}, state));
});

jest.mock('builder_platform_interaction/elementFactory', () => {
    const {
        createDuplicateDecision,
        createDuplicateScreen,
        createDuplicateAssignment,
        createDuplicateWait,
        createDuplicatePastedRecordLookup
    } = jest.requireActual('builder_platform_interaction/elementFactory');
    const { NodeType } = require('builder_platform_interaction/autoLayoutCanvas');

    return {
        createEndElement: jest.fn((props) => {
            const prev = props ? props.prev : undefined;
            const end = {
                guid: 'end-element-guid',
                nodeType: NodeType.END
            };
            if (prev != null) {
                end.prev = prev;
            }

            return end;
        }),
        createDuplicateDecision,
        createDuplicateScreen,
        createDuplicateAssignment,
        createDuplicateWait,
        createDuplicatePastedRecordLookup
    };
});

jest.mock('builder_platform_interaction/autoLayoutCanvas', () => {
    const actual = jest.requireActual('builder_platform_interaction/autoLayoutCanvas');

    const mockReducer = jest.fn((state) => state);

    return Object.assign({}, actual, {
        addElement: jest.fn(),
        linkElement: jest.fn(),
        linkBranchOrFault: jest.fn(),
        reconnectBranchElement: jest.fn((state) => state),
        assertAutoLayoutState: jest.fn(),
        actions: actual.actions,
        reducer: jest.fn(() => mockReducer)
    });
});

jest.mock('builder_platform_interaction/alcCanvasUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/alcCanvasUtils');

    const metadata = {
        Decision: 'branch',
        'some-element-type': {
            type: 'Default'
        },
        Screen: {
            type: 'Default'
        }
    };

    return Object.assign({}, actual, {
        getElementsMetadata: jest.fn(() => metadata)
    });
});

describe('alc-elements-reducer', () => {
    describe('When delete goto', () => {
        it('it calls the goto reducer', () => {
            const state = {};

            const source = {
                guid: 'some-element-guid',
                childIndex: 'some-child-index'
            };

            alcElementsReducer(state, {
                type: DELETE_GOTO_CONNECTION,
                payload: {
                    source
                }
            });

            const deleteGoToConnectionAction = actions.deleteGoToConnectionAction(source.guid, source.childIndex);
            expect(reducer()).toHaveBeenLastCalledWith(state, deleteGoToConnectionAction);
        });
    });

    describe('When ADD_CANVAS_ELEMENT', () => {
        it('dispatches an AddElement action', () => {
            const alcConnectionSource = {
                guid: 'prev-element'
            };

            const newElement = {
                guid: 'new-element-guid',
                nodeType: NodeType.DEFAULT,
                elementType: ELEMENT_TYPE.SCREEN,
                alcConnectionSource
            };

            const state = {
                'new-element-guid': newElement
            };

            alcElementsReducer(state, {
                type: ADD_CANVAS_ELEMENT,
                payload: newElement
            });

            const nodeType = 'Default';
            const addElementAction = actions.addElementAction(newElement.guid, nodeType, alcConnectionSource);
            expect(reducer()).toHaveBeenLastCalledWith({ [newElement.guid]: newElement }, addElementAction);
        });

        it('initializes the children correctly', () => {
            const source = {
                guid: 'prev-element'
            };

            const canvasElement = {
                guid: 'decision-guid',
                elementType: 'Decision',
                childReferences: [
                    {
                        childReference: 'outcome1'
                    },
                    {
                        childReference: 'outcome2'
                    }
                ]
            };

            const state = {
                'prev-element': { guid: 'prev-element', elementType: ELEMENT_TYPE.SCREEN },
                [canvasElement.guid]: canvasElement
            };

            const nextState = alcElementsReducer(state, {
                type: ADD_CANVAS_ELEMENT,
                payload: {
                    canvasElement,
                    alcConnectionSource: source
                }
            });

            expect(nextState[canvasElement.guid].children).toEqual([null, null, null]);
        });
    });

    describe('When ADD_SCREEN_WITH_FIELDS', () => {
        it('children should be set to null', () => {
            const alcConnectionSource = {
                prev: 'prev-element'
            };

            const canvasElement = {
                guid: 'screen-guid',
                elementType: ELEMENT_TYPE.SCREEN,
                childReferences: [
                    {
                        childReference: 'screenField1'
                    },
                    {
                        childReference: 'screenField2'
                    }
                ]
            };

            const state = {
                [canvasElement.guid]: canvasElement
            };

            const nextState = alcElementsReducer(state, {
                type: ADD_SCREEN_WITH_FIELDS,
                payload: {
                    canvasElement,
                    alcConnectionSource
                }
            });

            expect(nextState[canvasElement.guid].children).toBeUndefined();
        });
    });

    describe('When ADD_START_ELEMENT', () => {
        it('dispatches an Init action', () => {
            const startElement = {
                guid: 'start-element-guid'
            };

            alcElementsReducer(
                {},
                {
                    type: ADD_START_ELEMENT,
                    payload: startElement
                }
            );

            const endElement = {
                guid: 'end-element-guid',
                nodeType: 'end'
            };

            const initAction = actions.initAction('start-element-guid', 'end-element-guid');
            expect(reducer()).toHaveBeenLastCalledWith(
                {
                    [startElement.guid]: startElement,
                    [endElement.guid]: endElement
                },
                initAction
            );
        });
    });

    describe('When DELETE_ELEMENT', () => {
        it('dispatches a DeleteElement action', () => {
            const guid = 'element-guid';
            const childIndexToKeep = 1;
            const elementToDelete = {
                guid
            };

            const flowModel = {};

            alcElementsReducer(flowModel, {
                type: DELETE_ELEMENT,
                payload: { selectedElements: [elementToDelete], childIndexToKeep }
            });

            const deleteElementAction = actions.deleteElementAction(guid, childIndexToKeep);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, deleteElementAction);
        });
    });

    describe('When MODIFY_DECISION_WITH_OUTCOMES', () => {
        const decision = {
            guid: 'decision',
            children: ['screen1', 'screen2', 'screen3', null],
            childReferences: [
                {
                    childReference: 'outcome1'
                },
                {
                    childReference: 'outcome2'
                },
                {
                    childReference: 'outcome3'
                }
            ]
        };

        const originalStoreState = {
            decision,
            screen1: {
                guid: 'screen1',
                parent: 'decision',
                childIndex: 0,
                next: null
            },
            screen2: {
                guid: 'screen2',
                parent: 'decision',
                childIndex: 1,
                next: null
            },
            screen3: {
                guid: 'screen3',
                parent: 'decision',
                childIndex: 2,
                next: null
            }
        };

        describe('When outcomes have not changed', () => {
            const updatedDecision = decision;

            it('children should be the same', () => {
                alcElementsReducer(originalStoreState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: { canvasElement: updatedDecision }
                });

                const action = actions.updateChildrenAction(decision.guid, updatedDecision.childReferences);

                expect(reducer()).toHaveBeenLastCalledWith(
                    {
                        ...originalStoreState,
                        decision
                    },
                    action
                );
            });
        });

        describe('When adding an outcome', () => {
            it('should add a null entry at the before last index of children', () => {
                const storeState = deepCopy(originalStoreState);

                const updatedDecision = {
                    guid: 'decision',
                    children: ['screen1', 'screen2', 'screen3', null],
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        },
                        {
                            childReference: 'outcome2'
                        },
                        {
                            childReference: 'outcome3'
                        },
                        {
                            childReference: 'outcome4'
                        }
                    ]
                };
                storeState[decision.guid] = updatedDecision;
                alcElementsReducer(storeState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: { canvasElement: updatedDecision }
                });

                const action = actions.updateChildrenAction(decision.guid, [
                    {
                        childReference: 'outcome1'
                    },
                    {
                        childReference: 'outcome2'
                    },
                    {
                        childReference: 'outcome3'
                    },
                    {
                        childReference: 'outcome4'
                    }
                ]);

                expect(reducer()).toHaveBeenLastCalledWith(
                    {
                        ...storeState
                    },
                    action
                );
            });
        });

        describe('When deleting an outcome', () => {
            describe('should remove children entry for the branch associated with the outcome', () => {
                it('for the leftmost outcome', () => {
                    const storeState = deepCopy(originalStoreState);

                    const updatedDecision = {
                        guid: 'decision',
                        children: ['screen1', 'screen2', 'screen3', null],
                        childReferences: [
                            {
                                childReference: 'outcome2'
                            },
                            {
                                childReference: 'outcome3'
                            }
                        ]
                    };
                    storeState[decision.guid] = updatedDecision;

                    alcElementsReducer(storeState, {
                        type: MODIFY_DECISION_WITH_OUTCOMES,
                        payload: { canvasElement: updatedDecision }
                    });

                    const action = actions.updateChildrenAction(decision.guid, [
                        {
                            childReference: 'outcome2'
                        },
                        {
                            childReference: 'outcome3'
                        }
                    ]);

                    expect(reducer()).toHaveBeenLastCalledWith(
                        {
                            ...storeState
                        },
                        action
                    );
                });
                it('for a middle outcome', () => {
                    const storeState = deepCopy(originalStoreState);

                    const updatedDecision = {
                        guid: 'decision',
                        children: ['screen1', 'screen2', 'screen3', null],
                        childReferences: [
                            {
                                childReference: 'outcome1'
                            },
                            {
                                childReference: 'outcome3'
                            }
                        ]
                    };
                    storeState[decision.guid] = updatedDecision;

                    alcElementsReducer(storeState, {
                        type: MODIFY_DECISION_WITH_OUTCOMES,
                        payload: { canvasElement: updatedDecision }
                    });

                    const action = actions.updateChildrenAction(decision.guid, [
                        {
                            childReference: 'outcome1'
                        },
                        {
                            childReference: 'outcome3'
                        }
                    ]);

                    expect(reducer()).toHaveBeenLastCalledWith(
                        {
                            ...storeState
                        },
                        action
                    );
                });

                it('for the rightmost outcome', () => {
                    const storeState = deepCopy(originalStoreState);

                    const updatedDecision = {
                        guid: 'decision',
                        children: ['screen1', 'screen2', 'screen3', null],
                        childReferences: [
                            {
                                childReference: 'outcome1'
                            },
                            {
                                childReference: 'outcome2'
                            }
                        ]
                    };
                    storeState[decision.guid] = updatedDecision;

                    alcElementsReducer(storeState, {
                        type: MODIFY_DECISION_WITH_OUTCOMES,
                        payload: { canvasElement: updatedDecision }
                    });

                    const action = actions.updateChildrenAction(decision.guid, [
                        {
                            childReference: 'outcome1'
                        },
                        {
                            childReference: 'outcome2'
                        }
                    ]);

                    expect(reducer()).toHaveBeenLastCalledWith(
                        {
                            ...storeState
                        },
                        action
                    );
                });
            });
        });

        describe('When reordering outcomes', () => {
            it('should reorder the entries of the children', () => {
                const storeState = deepCopy(originalStoreState);

                const updatedDecision = {
                    guid: 'decision',
                    children: ['screen1', 'screen2', 'screen3', null],
                    childReferences: [
                        {
                            childReference: 'outcome3'
                        },
                        {
                            childReference: 'outcome1'
                        },
                        {
                            childReference: 'outcome2'
                        }
                    ]
                };
                storeState[decision.guid] = updatedDecision;

                alcElementsReducer(storeState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: { canvasElement: updatedDecision }
                });

                const action = actions.updateChildrenAction(decision.guid, [
                    {
                        childReference: 'outcome3'
                    },
                    {
                        childReference: 'outcome1'
                    },
                    {
                        childReference: 'outcome2'
                    }
                ]);

                expect(reducer()).toHaveBeenLastCalledWith(
                    {
                        ...storeState
                    },
                    action
                );
            });
        });

        describe('When adding, deleting and reordering outcomes', () => {
            it('should update the children accordingly', () => {
                const storeState = deepCopy(originalStoreState);

                const updatedDecision = {
                    guid: 'decision',
                    children: ['screen1', 'screen2', 'screen3', null],
                    childReferences: [
                        {
                            childReference: 'outcome2'
                        },
                        {
                            childReference: 'outcome4'
                        },
                        {
                            childReference: 'outcome1'
                        },
                        {
                            childReference: 'outcome5'
                        }
                    ]
                };
                storeState[decision.guid] = updatedDecision;

                alcElementsReducer(storeState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: { canvasElement: updatedDecision }
                });

                const action = actions.updateChildrenAction(decision.guid, [
                    {
                        childReference: 'outcome2'
                    },
                    {
                        childReference: 'outcome4'
                    },
                    {
                        childReference: 'outcome1'
                    },
                    {
                        childReference: 'outcome5'
                    }
                ]);

                expect(reducer()).toHaveBeenLastCalledWith(
                    {
                        ...storeState
                    },
                    action
                );
            });
        });
    });

    describe('When MODIFY_START_WITH_SCHEDULED_PATHS', () => {
        const startElement = {
            guid: 'startElement',
            children: ['assignment1', 'assignment2', 'assignment3', null],
            childReferences: [
                {
                    childReference: 'scheduledPath1'
                },
                {
                    childReference: 'scheduledPath2'
                },
                {
                    childReference: 'scheduledPath3'
                }
            ]
        };

        const originalStoreState = {
            startElement,
            assignment1: {
                guid: 'assignment1',
                parent: 'startElement',
                childIndex: 0,
                next: null
            },
            assignment2: {
                guid: 'assignment2',
                parent: 'startElement',
                childIndex: 1,
                next: null
            },
            assignment3: {
                guid: 'assignment3',
                parent: 'startElement',
                childIndex: 2,
                next: null
            }
        };

        describe('When scheduled paths have not changed', () => {
            const updatedStartElement = startElement;

            it('children should be the same', () => {
                alcElementsReducer(originalStoreState, {
                    type: MODIFY_START_WITH_SCHEDULED_PATHS,
                    payload: { canvasElement: updatedStartElement }
                });

                const action = actions.updateChildrenOnAddingOrUpdatingScheduledPathsAction(
                    startElement.guid,
                    startElement.childReferences
                );

                expect(reducer()).toHaveBeenLastCalledWith(
                    {
                        ...originalStoreState,
                        startElement
                    },
                    action
                );
            });
        });

        describe('When adding a scheduledPath', () => {
            it('should add a null entry before last index of children', () => {
                const storeState = deepCopy(originalStoreState);

                const updatedStartElement = {
                    guid: 'startElement',
                    children: ['assignment1', 'assignment2', 'assignment3', null],
                    childReferences: [
                        {
                            childReference: 'scheduledPath1'
                        },
                        {
                            childReference: 'scheduledPath2'
                        },
                        {
                            childReference: 'scheduledPath3'
                        },
                        {
                            childReference: 'scheduledPath4'
                        }
                    ]
                };
                storeState[startElement.guid] = updatedStartElement;

                alcElementsReducer(storeState, {
                    type: MODIFY_START_WITH_SCHEDULED_PATHS,
                    payload: { canvasElement: updatedStartElement }
                });

                const action = actions.updateChildrenOnAddingOrUpdatingScheduledPathsAction(startElement.guid, [
                    {
                        childReference: 'scheduledPath1'
                    },
                    {
                        childReference: 'scheduledPath2'
                    },
                    {
                        childReference: 'scheduledPath3'
                    },
                    {
                        childReference: 'scheduledPath4'
                    }
                ]);

                expect(reducer()).toHaveBeenLastCalledWith(
                    {
                        ...storeState
                    },
                    action
                );
            });
        });

        describe('When deleting a scheduledPath', () => {
            describe('should remove children entry for the branch associated with the scheduledPath', () => {
                it('for the leftmost scheduledPath', () => {
                    const storeState = deepCopy(originalStoreState);

                    const updatedStartElement = {
                        guid: 'startElement',
                        children: ['assignment1', 'assignment2', 'assignment3', null],
                        childReferences: [
                            {
                                childReference: 'scheduledPath2'
                            },
                            {
                                childReference: 'scheduledPath3'
                            }
                        ]
                    };
                    storeState[startElement.guid] = updatedStartElement;

                    alcElementsReducer(storeState, {
                        type: MODIFY_START_WITH_SCHEDULED_PATHS,
                        payload: { canvasElement: updatedStartElement }
                    });

                    const action = actions.updateChildrenOnAddingOrUpdatingScheduledPathsAction(startElement.guid, [
                        {
                            childReference: 'scheduledPath2'
                        },
                        {
                            childReference: 'scheduledPath3'
                        }
                    ]);

                    expect(reducer()).toHaveBeenLastCalledWith(
                        {
                            ...storeState
                        },
                        action
                    );
                });
                it('for a middle scheduledPath', () => {
                    const storeState = deepCopy(originalStoreState);

                    const updatedStartElement = {
                        guid: 'startElement',
                        children: ['assignment1', 'assignment2', 'assignment3', null],
                        childReferences: [
                            {
                                childReference: 'scheduledPath1'
                            },
                            {
                                childReference: 'scheduledPath3'
                            }
                        ]
                    };
                    storeState[startElement.guid] = updatedStartElement;

                    alcElementsReducer(storeState, {
                        type: MODIFY_START_WITH_SCHEDULED_PATHS,
                        payload: { canvasElement: updatedStartElement }
                    });

                    const action = actions.updateChildrenOnAddingOrUpdatingScheduledPathsAction(startElement.guid, [
                        {
                            childReference: 'scheduledPath1'
                        },
                        {
                            childReference: 'scheduledPath3'
                        }
                    ]);

                    expect(reducer()).toHaveBeenLastCalledWith(
                        {
                            ...storeState
                        },
                        action
                    );
                });

                it('for the rightmost scheduledPath', () => {
                    const storeState = deepCopy(originalStoreState);

                    const updatedStartElement = {
                        guid: 'startElement',
                        children: ['assignment1', 'assignment2', 'assignment3', null],
                        childReferences: [
                            {
                                childReference: 'scheduledPath1'
                            },
                            {
                                childReference: 'scheduledPath2'
                            }
                        ]
                    };
                    storeState[startElement.guid] = updatedStartElement;

                    alcElementsReducer(storeState, {
                        type: MODIFY_START_WITH_SCHEDULED_PATHS,
                        payload: { canvasElement: updatedStartElement }
                    });

                    const action = actions.updateChildrenOnAddingOrUpdatingScheduledPathsAction(startElement.guid, [
                        {
                            childReference: 'scheduledPath1'
                        },
                        {
                            childReference: 'scheduledPath2'
                        }
                    ]);

                    expect(reducer()).toHaveBeenLastCalledWith(
                        {
                            ...storeState
                        },
                        action
                    );
                });
            });
        });

        describe('When reordering scheduledPaths', () => {
            it('should reorder the entries of the children', () => {
                const storeState = deepCopy(originalStoreState);

                const updatedStartElement = {
                    guid: 'startElement',
                    children: ['assignment1', 'assignment2', 'assignment3', null],
                    childReferences: [
                        {
                            childReference: 'scheduledPath3'
                        },
                        {
                            childReference: 'scheduledPath1'
                        },
                        {
                            childReference: 'scheduledPath2'
                        }
                    ]
                };
                storeState[startElement.guid] = updatedStartElement;

                alcElementsReducer(storeState, {
                    type: MODIFY_START_WITH_SCHEDULED_PATHS,
                    payload: { canvasElement: updatedStartElement }
                });

                const action = actions.updateChildrenOnAddingOrUpdatingScheduledPathsAction(startElement.guid, [
                    {
                        childReference: 'scheduledPath3'
                    },
                    {
                        childReference: 'scheduledPath1'
                    },
                    {
                        childReference: 'scheduledPath2'
                    }
                ]);

                expect(reducer()).toHaveBeenLastCalledWith(
                    {
                        ...storeState
                    },
                    action
                );
            });
        });

        describe('When adding, deleting and reordering scheduledPaths', () => {
            it('should update the children accordingly', () => {
                const storeState = deepCopy(originalStoreState);

                const updatedStartElement = {
                    guid: 'startElement',
                    children: ['assignment1', 'assignment2', 'assignment3', null],
                    childReferences: [
                        {
                            childReference: 'scheduledPath2'
                        },
                        {
                            childReference: 'scheduledPath4'
                        },
                        {
                            childReference: 'scheduledPath1'
                        },
                        {
                            childReference: 'scheduledPath5'
                        }
                    ]
                };
                storeState[startElement.guid] = updatedStartElement;

                alcElementsReducer(storeState, {
                    type: MODIFY_START_WITH_SCHEDULED_PATHS,
                    payload: { canvasElement: updatedStartElement }
                });

                const action = actions.updateChildrenOnAddingOrUpdatingScheduledPathsAction(startElement.guid, [
                    {
                        childReference: 'scheduledPath2'
                    },
                    {
                        childReference: 'scheduledPath4'
                    },
                    {
                        childReference: 'scheduledPath1'
                    },
                    {
                        childReference: 'scheduledPath5'
                    }
                ]);

                expect(reducer()).toHaveBeenLastCalledWith(
                    {
                        ...storeState
                    },
                    action
                );
            });
        });
    });

    describe('When SELECTION_ON_FIXED_CANVAS', () => {
        let elements;
        beforeEach(() => {
            elements = {
                guid1: {
                    guid: 'guid1',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: true,
                        hasError: true
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: false,
                        hasError: true
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        isSelectable: true
                    }
                }
            };
        });

        const canvasElementGuidsToSelect = ['guid1'];
        const canvasElementGuidsToDeselect = ['guid3'];

        it('Should mark guid1 as selected', () => {
            const updatedState = alcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: { canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids: [] }
            });

            expect(updatedState.guid1).toMatchObject({
                guid: 'guid1',
                config: {
                    isSelected: true,
                    isHighlighted: false,
                    isSelectable: true,
                    hasError: true
                }
            });
        });

        it('Should mark guid3 as de-selected', () => {
            const updatedState = alcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: { canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids: [] }
            });

            expect(updatedState.guid3).toMatchObject({
                guid: 'guid3',
                config: {
                    isSelected: false,
                    isHighlighted: false,
                    isSelectable: true
                }
            });
        });

        it('Should set isSelectable to true for all elements when selectableGuids is an empty array', () => {
            const updatedState = alcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: { canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: [], selectableGuids: [] }
            });

            expect(updatedState).toMatchObject({
                guid1: {
                    guid: 'guid1',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: true,
                        hasError: true
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: true
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        isSelectable: true
                    }
                }
            });
        });

        it('Should set isSelectable to true only for elements in selectableGuids and false for the rest', () => {
            const updatedState = alcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: {
                    canvasElementGuidsToSelect: [],
                    canvasElementGuidsToDeselect: [],
                    selectableGuids: ['guid2']
                }
            });

            expect(updatedState).toMatchObject({
                guid1: {
                    guid: 'guid1',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: false,
                        hasError: true
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: true,
                        hasError: true
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        isSelectable: false
                    }
                }
            });
        });
    });

    describe('When ADD_FAULT', () => {
        it('dispatches a AddFault action', () => {
            const guid = 'element-with-fault-guid';

            const flowModel = {};

            alcElementsReducer(flowModel, {
                type: ADD_FAULT,
                payload: guid
            });

            const addFaultAction = actions.addFaultAction(guid);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, addFaultAction);
        });
    });

    // describe('When PATES_ON_FIXED_CANVAS with GoTos', () => {
    //     let mockStoreData1;

    //     const screen1 = {
    //         guid: 'screen1',
    //         name: 'screen1',
    //         elementType: ELEMENT_TYPE.SCREEN,
    //         prev: 'getRecords',
    //         next: 'decision1',
    //         incomingGoTo: ['screen2', 'decision1:decEvent1', 'getRecords:fault'],
    //         childReferences: []
    //     };

    //     const getRecords = {
    //         guid: 'getRecords',
    //         name: 'getRecords',
    //         elementType: ELEMENT_TYPE.RECORD_LOOKUP,
    //         NodeType: 'default',
    //         prev: null,
    //         next: 'screen1',
    //         fault: 'screen1'
    //     };

    //     const decision1 = {
    //         guid: 'decision1',
    //         name: 'decision1',
    //         elementType: ELEMENT_TYPE.DECISION,
    //         nodeType: 'branch',
    //         childReferences: [
    //             {
    //                 childReference: 'decEvent1'
    //             }
    //         ],
    //         prev: 'screen1',
    //         next: null,
    //         children: ['screen1', 'screen2']
    //     };

    //     const screen2 = {
    //         guid: 'screen2',
    //         name: 'screen2',
    //         elementType: ELEMENT_TYPE.SCREEN,
    //         prev: null,
    //         next: 'screen1',
    //         parent: 'decision1',
    //         childIndex: 1,
    //         isTerminal: true,
    //         childReferences: []
    //     };

    //     const decEvent1 = {
    //         guid: 'decEvent1',
    //         name: 'decEvent1'
    //     };

    //     const canvasElementGuidMap = {
    //         screen1: 'screen1_0',
    //         decision1: 'decision1_0',
    //         screen2: 'screen2_0'
    //     };

    //     const childElementGuidMap = {
    //         decEvent1: 'decEvent1_0'
    //     };

    //     const cutOrCopiedCanvasElements = {
    //         screen1,
    //         decision1,
    //         screen2
    //     };

    //     const cutOrCopiedChildElements = {
    //         decEvent1
    //     };

    //     const topCutOrCopiedGuid = 'screen1';
    //     const bottomCutOrCopiedGuid = 'decision1';

    //     beforeEach(() => {
    //         mockStoreData1 = {
    //             elements: {
    //                 screen1,
    //                 decision1,
    //                 screen2,
    //                 decEvent1,
    //                 getRecords
    //             }
    //         };

    //         Store.setMockState(mockStoreData1);
    //     });

    //     afterEach(() => {
    //         Store.resetStore();
    //     });

    //     describe('When pasting elements on a fault branchHead with GoTo', () => {
    //         let updatedState;
    //         const topCutOrCopiedGuid = 'getRecords';
    //         const bottomCutOrCopiedGuid = 'screen1';
    //         const canvasElementGuidMap = {
    //             screen1: 'screen1_0',
    //             getRecords: 'getRecords_0'
    //         };
    //         const cutOrCopiedCanvasElements = {
    //             screen1,
    //             getRecords
    //         };
    //         beforeEach(() => {
    //             updatedState = alcElementsReducer(mockStoreData1.elements, {
    //                 type: PASTE_ON_FIXED_CANVAS,
    //                 payload: {
    //                     canvasElementGuidMap,
    //                     childElementGuidMap: {},
    //                     cutOrCopiedCanvasElements,
    //                     cutOrCopiedChildElements: {},
    //                     topCutOrCopiedGuid,
    //                     bottomCutOrCopiedGuid,
    //                     source: {
    //                         guid: 'getRecords',
    //                         childIndex: FAULT_INDEX
    //                     }
    //                 }
    //             });
    //         });

    //         it('Pasted elements should be included in the updated state', () => {
    //             expect(Object.keys(updatedState).includes('screen1_0')).toBeTruthy();
    //             expect(Object.keys(updatedState).includes('getRecords_0')).toBeTruthy();
    //         });

    //         it('Parent element fault property should be updated', () => {
    //             expect(updatedState.getRecords.fault).toEqual('getRecords_0');
    //         });

    //         it('Next Element incomingGoto property should be updated', () => {
    //             expect(updatedState.screen1.incomingGoTo.includes('screen1_0')).toBe(true);
    //         });

    //         it('bottomCutOrCopiedGuid should have the correct GoTo', () => {
    //             expect(updatedState.screen1_0.next).toEqual('screen1');
    //         });

    //         it('topCutOrCopiedGuid parent property should be updated', () => {
    //             expect(updatedState.getRecords_0.parent).toEqual('getRecords');
    //         });
    //     });

    //     describe('When pasting elements on a terminated branch with GoTo', () => {
    //         let updatedState;
    //         beforeEach(() => {
    //             updatedState = alcElementsReducer(mockStoreData1.elements, {
    //                 type: PASTE_ON_FIXED_CANVAS,
    //                 payload: {
    //                     canvasElementGuidMap,
    //                     childElementGuidMap,
    //                     cutOrCopiedCanvasElements,
    //                     cutOrCopiedChildElements,
    //                     topCutOrCopiedGuid,
    //                     bottomCutOrCopiedGuid,
    //                     source: {
    //                         guid: 'screen2'
    //                     }
    //                 }
    //             });
    //         });

    //         it('Pasted elements should be included in the updated state', () => {
    //             expect(Object.keys(updatedState).includes('screen1_0')).toBeTruthy();
    //             expect(Object.keys(updatedState).includes('decision1_0')).toBeTruthy();
    //             expect(Object.keys(updatedState).includes('screen2_0')).toBeTruthy();
    //             expect(Object.keys(updatedState).includes('decEvent1_0')).toBeTruthy();
    //         });

    //         it('Previous Element next property should be updated', () => {
    //             expect(updatedState.screen2.next).toEqual('screen1_0');
    //         });

    //         it('Next Element incomingGoto property should be updated', () => {
    //             expect(updatedState.screen1.incomingGoTo.includes('decision1_0')).toBe(true);
    //         });

    //         it('bottomCutOrCopiedGuid should have the correct GoTo', () => {
    //             expect(updatedState.decision1_0.next).toEqual('screen1');
    //         });

    //         it('topCutOrCopiedGuid prev property should be updated', () => {
    //             expect(updatedState.screen1_0.prev).toEqual('screen2');
    //         });
    //     });

    //     describe('When pasting elements on a terminated branchHead with GoTo', () => {
    //         let updatedState;
    //         beforeEach(() => {
    //             updatedState = alcElementsReducer(mockStoreData1.elements, {
    //                 type: PASTE_ON_FIXED_CANVAS,
    //                 payload: {
    //                     canvasElementGuidMap,
    //                     childElementGuidMap,
    //                     cutOrCopiedCanvasElements,
    //                     cutOrCopiedChildElements,
    //                     topCutOrCopiedGuid,
    //                     bottomCutOrCopiedGuid,
    //                     source: {
    //                         guid: 'decision1',
    //                         childIndex: 0
    //                     }
    //                 }
    //             });
    //         });

    //         it('Pasted elements should be included in the updated state', () => {
    //             expect(Object.keys(updatedState).includes('screen1_0')).toBeTruthy();
    //             expect(Object.keys(updatedState).includes('decision1_0')).toBeTruthy();
    //             expect(Object.keys(updatedState).includes('screen2_0')).toBeTruthy();
    //             expect(Object.keys(updatedState).includes('decEvent1_0')).toBeTruthy();
    //         });

    //         it('Parent element children property should be updated', () => {
    //             expect(updatedState.decision1.children).toEqual(['screen1_0', 'screen2']);
    //         });

    //         it('Next Element incomingGoto property should be updated', () => {
    //             expect(updatedState.screen1.incomingGoTo.includes('decision1_0')).toBe(true);
    //         });

    //         it('bottomCutOrCopiedGuid should have the correct GoTo', () => {
    //             expect(updatedState.decision1_0.next).toEqual('screen1');
    //         });

    //         it('topCutOrCopiedGuid parent property should be updated', () => {
    //             expect(updatedState.screen1_0.parent).toEqual('decision1');
    //         });
    //     });
    // });

    describe('When PASTE_ON_FIXED_CANVAS', () => {
        let mockStoreData;

        const assignment1 = {
            guid: 'assignment1',
            name: 'assignment1',
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            next: 'wait1'
        };

        const wait1 = {
            guid: 'wait1',
            name: 'wait1',
            elementType: ELEMENT_TYPE.WAIT,
            nodeType: 'branch',
            childReferences: [
                {
                    childReference: 'waitEvent1'
                },
                {
                    childReference: 'waitEvent2'
                }
            ],
            prev: 'assignment1',
            next: null,
            children: ['screen1', null, 'screen2'],
            fault: 'screen3'
        };

        const screen1 = {
            guid: 'screen1',
            name: 'screen1',
            elementType: ELEMENT_TYPE.SCREEN,
            prev: null,
            next: null,
            parent: 'wait1',
            childIndex: 0,
            isTerminal: false
        };

        const screen2 = {
            guid: 'screen2',
            name: 'screen2',
            elementType: ELEMENT_TYPE.SCREEN,
            prev: null,
            next: null,
            parent: 'wait1',
            childIndex: 2,
            isTerminal: true
        };

        const screen3 = {
            guid: 'screen3',
            name: 'screen3',
            elementType: ELEMENT_TYPE.SCREEN,
            childReferences: [],
            prev: null,
            next: null,
            parent: 'wait1',
            childIndex: -1,
            isTerminal: true
        };

        const waitEvent1 = {
            guid: 'waitEvent1',
            name: 'waitEvent1'
        };

        const waitEvent2 = {
            guid: 'waitEvent2',
            name: 'waitEvent2'
        };

        const canvasElementGuidMap = {
            assignment1: 'assignment1_0',
            wait1: 'wait1_0',
            screen3: 'screen3_0'
        };
        const childElementGuidMap = {
            waitEvent1: 'waitEvent1_0',
            waitEvent2: 'waitEvent2_0'
        };
        const cutOrCopiedCanvasElements = {
            assignment1,
            wait1,
            screen3
        };
        const cutOrCopiedChildElements = {
            waitEvent1,
            waitEvent2
        };
        const topCutOrCopiedGuid = 'assignment1';
        const bottomCutOrCopiedGuid = 'wait1';

        beforeEach(() => {
            mockStoreData = {
                elements: {
                    assignment1,
                    wait1,
                    screen1,
                    screen2,
                    screen3,
                    waitEvent1,
                    waitEvent2
                }
            };

            Store.setMockState(mockStoreData);
        });

        afterEach(() => {
            Store.resetStore();
        });

        describe('When pasting elements in the main flow', () => {
            let updatedState;

            beforeEach(() => {
                updatedState = alcElementsReducer(mockStoreData.elements, {
                    type: PASTE_ON_FIXED_CANVAS,
                    payload: {
                        canvasElementGuidMap,
                        childElementGuidMap,
                        childElementNameMap: {},
                        cutOrCopiedCanvasElements,
                        cutOrCopiedChildElements,
                        topCutOrCopiedGuid,
                        bottomCutOrCopiedGuid,
                        source: {
                            guid: 'assignment1'
                        }
                    }
                });
            });

            it('Pasted elements should be included in the updated state', () => {
                expect(Object.keys(updatedState).includes('assignment1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('wait1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('waitEvent1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('waitEvent2_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('screen3_0')).toBeTruthy();
            });

            it('Previous Element next property should be updated', () => {
                expect(updatedState.assignment1.next).toEqual('assignment1_0');
            });

            it('Next Element previous property should be updated', () => {
                expect(updatedState.wait1.prev).toEqual('wait1_0');
            });

            it('Next Element should not have parent, childIndex or isTerminal property', () => {
                expect(Object.keys(updatedState.wait1).includes('parent')).toBeFalsy();
                expect(Object.keys(updatedState.wait1).includes('childIndex')).toBeFalsy();
                expect(Object.keys(updatedState.wait1).includes('isTerminal')).toBeFalsy();
            });

            it('Pasted Fault Branch Element (screen3_0), should have the updated next property', () => {
                expect(updatedState.screen3_0.next).toEqual('end-element-guid');
            });
        });

        describe('When pasting elements on the branch head of a non-empty, non-terminated branch', () => {
            let updatedState;

            beforeEach(() => {
                updatedState = alcElementsReducer(mockStoreData.elements, {
                    type: PASTE_ON_FIXED_CANVAS,
                    payload: {
                        canvasElementGuidMap,
                        childElementGuidMap,
                        cutOrCopiedCanvasElements,
                        cutOrCopiedChildElements,
                        topCutOrCopiedGuid,
                        bottomCutOrCopiedGuid,
                        source: {
                            guid: 'wait1',
                            childIndex: 0
                        }
                    }
                });
            });

            it('Pasted elements should be included in the updated state', () => {
                expect(Object.keys(updatedState).includes('assignment1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('wait1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('waitEvent1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('waitEvent2_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('screen3_0')).toBeTruthy();
            });

            it('assignment1_0 should have the right isTerminal property', () => {
                expect(updatedState.assignment1_0.isTerminal).toBeFalsy();
            });

            it('Next Element previous property should be updated', () => {
                expect(updatedState.screen1.prev).toEqual('wait1_0');
            });

            it('Next Element should not have parent, childIndex or isTerminal property', () => {
                expect(Object.keys(updatedState.screen1).includes('parent')).toBeFalsy();
                expect(Object.keys(updatedState.screen1).includes('childIndex')).toBeFalsy();
                expect(Object.keys(updatedState.screen1).includes('isTerminal')).toBeFalsy();
            });

            it('Parent element children property should be updated', () => {
                expect(updatedState.wait1.children).toEqual(['assignment1_0', null, 'screen2']);
            });

            it('Pasted Fault Branch Element (screen3_0), should have the updated next property', () => {
                expect(updatedState.screen3_0.next).toEqual('end-element-guid');
            });
        });

        describe('When pasting elements on the branch head of an empty, non-terminated branch', () => {
            let updatedState;

            beforeEach(() => {
                updatedState = alcElementsReducer(mockStoreData.elements, {
                    type: PASTE_ON_FIXED_CANVAS,
                    payload: {
                        canvasElementGuidMap,
                        childElementGuidMap,
                        cutOrCopiedCanvasElements,
                        cutOrCopiedChildElements,
                        topCutOrCopiedGuid,
                        bottomCutOrCopiedGuid,
                        source: {
                            guid: 'wait1',
                            childIndex: 1
                        }
                    }
                });
            });

            it('Pasted elements should be included in the updated state', () => {
                expect(Object.keys(updatedState).includes('assignment1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('wait1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('waitEvent1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('waitEvent2_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('screen3_0')).toBeTruthy();
            });

            it('assignment1_0 should have the right isTerminal property', () => {
                expect(updatedState.assignment1_0.isTerminal).toBeFalsy();
            });

            it('Parent element children property should be updated', () => {
                expect(updatedState.wait1.children).toEqual(['screen1', 'assignment1_0', 'screen2']);
            });

            it('Pasted Fault Branch Element (screen3_0), should have the updated next property', () => {
                expect(updatedState.screen3_0.next).toEqual('end-element-guid');
            });
        });

        describe('When pasting elements on the branch head of a non-empty, terminated branch', () => {
            let updatedState;

            beforeEach(() => {
                updatedState = alcElementsReducer(mockStoreData.elements, {
                    type: PASTE_ON_FIXED_CANVAS,
                    payload: {
                        canvasElementGuidMap,
                        childElementGuidMap,
                        cutOrCopiedCanvasElements,
                        cutOrCopiedChildElements,
                        topCutOrCopiedGuid,
                        bottomCutOrCopiedGuid,
                        source: {
                            guid: 'wait1',
                            childIndex: 2
                        }
                    }
                });
            });

            it('Pasted elements should be included in the updated state', () => {
                expect(Object.keys(updatedState).includes('assignment1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('wait1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('waitEvent1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('waitEvent2_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('screen3_0')).toBeTruthy();
            });

            it('assignment1_0 should have the right isTerminal property', () => {
                expect(updatedState.assignment1_0.isTerminal).toBeTruthy();
            });

            it('Next Element should not have parent, childIndex or isTerminal property', () => {
                expect(Object.keys(updatedState.screen2).includes('parent')).toBeFalsy();
                expect(Object.keys(updatedState.screen2).includes('childIndex')).toBeFalsy();
                expect(Object.keys(updatedState.screen2).includes('isTerminal')).toBeFalsy();
            });

            it('Parent element children property should be updated', () => {
                expect(updatedState.wait1.children).toEqual(['screen1', null, 'assignment1_0']);
            });

            it('Pasted Fault Branch Element (screen3_0), should have the updated next property', () => {
                expect(updatedState.screen3_0.next).toEqual('end-element-guid');
            });
        });
    });

    describe('When DECORATE_CANVAS', () => {
        it('When highlighting next connectors', () => {
            const flowModel = {
                guid1: { next: 'guid2', config: {} },
                guid2: { next: 'guid3', config: {} },
                guid3: { next: 'end', config: {} }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid1' },
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid2' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { highlightNext: true });
            decoratedElements.set('guid2', { highlightNext: true });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting child connectors', () => {
            const flowModel = {
                guid1: {
                    childReferences: [{ childReference: 'childGuid1' }, { childReference: 'childGuid2' }],
                    children: ['end', 'guid2', null],
                    nodeType: NodeType.BRANCH,
                    next: 'end',
                    config: {}
                },
                guid2: { next: 'end', config: {} }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid1', childSource: 'childGuid2' },
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid2' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { branchIndexesToHighlight: [1] });
            decoratedElements.set('guid2', { highlightNext: true });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting default connector', () => {
            const flowModel = {
                guid1: {
                    childReferences: [{ childReference: 'childGuid1' }, { childReference: 'childGuid2' }],
                    children: ['end', 'end', 'guid2'],
                    nodeType: NodeType.BRANCH,
                    next: 'end',
                    config: {}
                },
                guid2: { next: 'end', config: {} }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [{ type: CONNECTOR_TYPE.DEFAULT, source: 'guid1' }]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { branchIndexesToHighlight: [2] });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting Start element immediate connector', () => {
            const flowModel = {
                guid1: {
                    childReferences: [{ childReference: 'childGuid1' }, { childReference: 'childGuid2' }],
                    children: ['end', 'end', 'guid2'],
                    nodeType: NodeType.START,
                    elementType: ELEMENT_TYPE.START_ELEMENT,
                    next: 'end',
                    config: {}
                },
                guid2: { next: 'end', config: {} }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [{ type: CONNECTOR_TYPE.IMMEDIATE, source: 'guid1' }]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { branchIndexesToHighlight: [START_IMMEDIATE_INDEX] });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting Start element immediate connector with no children/scheduled paths defined', () => {
            const flowModel = {
                guid1: {
                    nodeType: NodeType.START,
                    elementType: ELEMENT_TYPE.START_ELEMENT,
                    next: 'end',
                    config: {}
                }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [{ type: CONNECTOR_TYPE.IMMEDIATE, source: 'guid1' }]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { highlightNext: true });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting Start element child connector', () => {
            const flowModel = {
                guid1: {
                    childReferences: [{ childReference: 'childGuid1' }, { childReference: 'childGuid2' }],
                    children: ['end', 'end', 'guid2'],
                    nodeType: NodeType.START,
                    elementType: ELEMENT_TYPE.START_ELEMENT,
                    next: 'end',
                    config: {}
                },
                guid2: { next: 'end', config: {} }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid1', childSource: 'childGuid2' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { branchIndexesToHighlight: [2] });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When setting highlightNext on branch element with empty branch to highlight', () => {
            const flowModel = {
                guid1: {
                    childReferences: [{ childReference: 'childGuid1' }, { childReference: 'childGuid2' }],
                    children: ['someGuid', null, null],
                    nodeType: NodeType.BRANCH,
                    next: 'end',
                    config: {}
                }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid1', childSource: 'childGuid2' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', {
                highlightNext: true,
                branchIndexesToHighlight: [1],
                mergeBranchIndexesToHighlight: [1]
            });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When setting highlightNext on parent branch elements', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    childReferences: [{ childReference: 'childGuid1' }],
                    children: ['guid2', null],
                    nodeType: NodeType.BRANCH,
                    next: 'end',
                    config: {}
                },
                guid2: {
                    guid: 'guid2',
                    parent: 'guid1',
                    childIndex: 0,
                    childReferences: [{ childReference: 'childGuid2' }],
                    children: ['guid3', null],
                    nodeType: NodeType.BRANCH,
                    config: {}
                },
                guid3: { guid: 'guid3', parent: 'guid2', childIndex: 0, config: {} }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid1', childSource: 'childGuid1' },
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid2', childSource: 'childGuid2' },
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid3' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', {
                branchIndexesToHighlight: [0],
                mergeBranchIndexesToHighlight: [0],
                highlightNext: true
            });
            decoratedElements.set('guid2', {
                branchIndexesToHighlight: [0],
                mergeBranchIndexesToHighlight: [0],
                highlightNext: true
            });
            decoratedElements.set('guid3', { highlightNext: true });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When setting mergeBranchIndexesToHighlight on parent branch elements', () => {
            const flowModel = {
                guid1: {
                    guid: 'guid1',
                    childReferences: [{ childReference: 'childGuid1' }, { childReference: 'childGuid2' }],
                    children: ['guid3', null, 'guid2'],
                    nodeType: NodeType.BRANCH,
                    next: 'end',
                    config: {}
                },
                guid2: {
                    guid: 'guid2',
                    parent: 'guid1',
                    childIndex: 2,
                    childReferences: [{ childReference: 'childGuid3' }],
                    children: [null, 'guid3'],
                    nodeType: NodeType.BRANCH,
                    config: {}
                },
                guid3: { guid: 'guid3', parent: 'guid2', childIndex: 1, config: {} }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid1', childSource: 'childGuid1' },
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid3' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', {
                branchIndexesToHighlight: [0],
                mergeBranchIndexesToHighlight: [2],
                highlightNext: true
            });
            decoratedElements.set('guid2', {
                mergeBranchIndexesToHighlight: [1],
                highlightNext: true
            });
            decoratedElements.set('guid3', { highlightNext: true });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting loop connectors', () => {
            const flowModel = {
                guid1: { guid: 'guid1', nodeType: NodeType.LOOP, next: 'end', config: {}, children: ['guid2'] },
                guid2: { guid: 'guid2', parent: 'guid1', config: {} }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.LOOP_NEXT, source: 'guid1' },
                        { type: CONNECTOR_TYPE.LOOP_END, source: 'guid1' },
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid2' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', {
                highlightNext: true,
                highlightLoopBack: true,
                branchIndexesToHighlight: [FOR_EACH_INDEX]
            });
            decoratedElements.set('guid2', { highlightNext: true });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting loop connectors with no children', () => {
            const flowModel = {
                guid1: { guid: 'guid1', nodeType: NodeType.LOOP, next: 'end', config: {}, children: [null] }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.LOOP_NEXT, source: 'guid1' },
                        { type: CONNECTOR_TYPE.LOOP_END, source: 'guid1' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', {
                highlightNext: true,
                highlightLoopBack: true,
                branchIndexesToHighlight: [FOR_EACH_INDEX]
            });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting loop connector with error in loop back', () => {
            const flowModel = {
                guid1: { nodeType: NodeType.LOOP, next: 'end', config: {}, children: ['guid2'] },
                guid2: { parent: 'guid1', config: { hasError: true } }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.LOOP_NEXT, source: 'guid1' },
                        { type: CONNECTOR_TYPE.LOOP_END, source: 'guid1' },
                        { type: CONNECTOR_TYPE.FAULT, source: 'guid2' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { highlightNext: true, branchIndexesToHighlight: [FOR_EACH_INDEX] });
            decoratedElements.set('guid2', {});
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting loop connector with error and no error on same element in loop back', () => {
            const flowModel = {
                guid1: { guid: 'guid1', nodeType: NodeType.LOOP, next: 'end', config: {}, children: ['guid2'] },
                guid2: { guid: 'guid2', parent: 'guid1', config: { hasError: true } }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.LOOP_NEXT, source: 'guid1' },
                        { type: CONNECTOR_TYPE.REGULAR, source: 'guid2' },
                        { type: CONNECTOR_TYPE.LOOP_NEXT, source: 'guid1' },
                        { type: CONNECTOR_TYPE.FAULT, source: 'guid2' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { highlightLoopBack: true, branchIndexesToHighlight: [FOR_EACH_INDEX] });
            decoratedElements.set('guid2', { highlightNext: true });
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });

        it('When highlighting fault connector', () => {
            const flowModel = {
                guid1: { nodeType: NodeType.BRANCH, fault: 'end', config: { hasError: true } },
                guid2: { nodeType: NodeType.DEFAULT, config: { hasError: true } }
            };

            alcElementsReducer(flowModel, {
                type: DECORATE_CANVAS,
                payload: {
                    connectorsToHighlight: [
                        { type: CONNECTOR_TYPE.FAULT, source: 'guid1' },
                        { type: CONNECTOR_TYPE.FAULT, source: 'guid2' }
                    ]
                }
            });
            const decoratedElements = new Map<Guid, HighlightInfo>();
            decoratedElements.set('guid1', { branchIndexesToHighlight: [FAULT_INDEX] });
            decoratedElements.set('guid2', {});
            const expectedAction = actions.decorateCanvasAction(decoratedElements);
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });
    });

    describe('When CLEAR_CANVAS_DECORATION', () => {
        it('When clearing canvas decoration on all elements', () => {
            const flowModel = {
                guid1: { config: {} },
                guid2: { config: {} }
            };

            alcElementsReducer(flowModel, {
                type: CLEAR_CANVAS_DECORATION
            });
            const expectedAction = actions.clearCanvasDecorationAction();
            expect(reducer()).toHaveBeenLastCalledWith(flowModel, expectedAction);
        });
    });
});
