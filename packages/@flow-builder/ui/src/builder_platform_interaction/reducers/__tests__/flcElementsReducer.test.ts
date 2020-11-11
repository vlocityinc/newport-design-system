// @ts-nocheck
import {
    ADD_CANVAS_ELEMENT,
    ADD_START_ELEMENT,
    DELETE_ELEMENT,
    MODIFY_DECISION_WITH_OUTCOMES,
    SELECTION_ON_FIXED_CANVAS,
    ADD_FAULT,
    PASTE_ON_FIXED_CANVAS,
    FLC_CREATE_CONNECTION
} from 'builder_platform_interaction/actions';
import {
    addElement,
    deleteElement,
    addElementToState,
    linkElement,
    linkBranchOrFault,
    FAULT_INDEX,
    reconnectBranchElement
} from 'builder_platform_interaction/autoLayoutCanvas';

import { createEndElement } from 'builder_platform_interaction/elementFactory';
import flcElementsReducer from '../flcElementsReducer';
import { getSubElementGuids } from '../reducersUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const getElement = (guid, name) => {
    return {
        guid,
        name
    };
};
jest.mock('../elementsReducer', () => {
    return jest.fn((state) => Object.assign({}, state));
});

jest.mock('builder_platform_interaction/elementFactory', () => {
    const { createPastedAssignment, createPastedDecision, createPastedScreen, createPastedWait } = jest.requireActual(
        'builder_platform_interaction/elementFactory'
    );
    return {
        createEndElement: jest.fn((props) => {
            const prev = props ? props.prev : undefined;
            const end = {
                guid: 'end-element-guid'
            };
            if (prev != null) {
                end.prev = prev;
            }
            return end;
        }),
        createPastedAssignment,
        createPastedDecision,
        createPastedScreen,
        createPastedWait
    };
});

jest.mock('builder_platform_interaction/autoLayoutCanvas', () => {
    const actual = jest.requireActual('builder_platform_interaction/autoLayoutCanvas');
    return Object.assign({}, actual, {
        addElementToState: jest.fn((element, state) => {
            state[element.guid] = element;
        }),
        addElement: jest.fn(),
        deleteElement: jest.fn(),
        linkElement: jest.fn(),
        linkBranchOrFault: jest.fn(),
        reconnectBranchElement: jest.fn((state) => state),
        assertAutoLayoutState: jest.fn()
    });
});

jest.mock('builder_platform_interaction/flcBuilderUtils', () => {
    const { addFlcProperties } = jest.requireActual('builder_platform_interaction/flcBuilderUtils');
    return {
        addFlcProperties,
        supportsChildren: jest.fn(),
        createRootElement: jest.fn(() => ({
            guid: 'root'
        }))
    };
});

const oldElements = { guid1: getElement('guid1', 'ass1') };
const payload = getElement('guid2', 'ass2');

describe('elements-reducer', () => {
    describe('Flc Create Connection', () => {
        it('calls reconnect branch element', () => {
            const elements = {};

            flcElementsReducer(elements, {
                type: FLC_CREATE_CONNECTION,
                payload: { sourceGuid: 'source-guid', targetGuid: 'target-guid' }
            });
            expect(reconnectBranchElement).toHaveBeenLastCalledWith({}, 'source-guid', 'target-guid');
        });
    });

    describe('Add Canvas Element', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(flcElementsReducer(undefined, {})).toEqual({});
        });

        it('addElement should be called when when dispatching ADD_CANVAS_ELEMENT', () => {
            const spy = addElement;
            flcElementsReducer(oldElements, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('Add Start Element', () => {
        it('start, end and root elements are added', () => {
            const state = {
                'start-element-guid': {
                    guid: 'start-element-guid',
                    isTerminal: true
                }
            };

            flcElementsReducer(state, {
                type: ADD_START_ELEMENT,
                payload: { guid: 'start-element-guid' }
            });

            const expectedState = { ...state, root: { guid: 'root' } };

            expect(addElementToState).toHaveBeenLastCalledWith({ guid: 'root' }, expectedState);
            expect(linkElement).toHaveBeenLastCalledWith(expectedState, {
                guid: 'end-element-guid',
                prev: 'start-element-guid'
            });
            expect(createEndElement).toHaveBeenLastCalledWith({ prev: 'start-element-guid' });
        });
    });

    describe('Delete Element', () => {
        const shouldAddEndElement = (addEndElement) => {
            deleteElement.mockImplementation(() => ({
                addEndElement
            }));
        };

        it('calls deleteElement', () => {
            shouldAddEndElement(false);
            const elementToDelete = {
                guid: 'element-guid'
            };

            flcElementsReducer(
                {},
                {
                    type: DELETE_ELEMENT,
                    payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: 1 }
                }
            );

            expect(deleteElement).toHaveBeenLastCalledWith({}, elementToDelete, 1, getSubElementGuids);
        });

        describe('When addEndElement is true', () => {
            beforeEach(() => {
                shouldAddEndElement(true);
            });

            it('createEndElement should be called if element has a prev', () => {
                const elementToDelete = {
                    guid: 'element-guid',
                    prev: 'dummy-prev'
                };

                flcElementsReducer(
                    {
                        'dummy-prev': {
                            next: 'element-guid'
                        }
                    },
                    {
                        type: DELETE_ELEMENT,
                        payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: -2 }
                    }
                );

                expect(createEndElement).toHaveBeenLastCalledWith({ prev: 'dummy-prev', next: null });
            });

            it('addElementToState should have been called if element has a prev', () => {
                const elementToDelete = {
                    guid: 'element-guid',
                    prev: 'dummy-prev'
                };

                flcElementsReducer(
                    {
                        'dummy-prev': {
                            next: 'element-guid'
                        }
                    },
                    {
                        type: DELETE_ELEMENT,
                        payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: -2 }
                    }
                );

                expect(addElementToState).toHaveBeenCalled();
            });

            it('prev element should point to end element', () => {
                const elementToDelete = {
                    guid: 'element-guid',
                    prev: 'dummy-prev'
                };

                const updatedState = flcElementsReducer(
                    {
                        'dummy-prev': {
                            next: 'element-guid'
                        }
                    },
                    {
                        type: DELETE_ELEMENT,
                        payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: -2 }
                    }
                );

                expect(updatedState['dummy-prev'].next).toBe('end-element-guid');
            });

            it('createEndElement should be called if element has a parent and childIndex', () => {
                const elementToDelete = {
                    guid: 'element-guid',
                    parent: 'dummy-parent',
                    childIndex: 0
                };

                flcElementsReducer(
                    {
                        'dummy-parent': {
                            children: ['element-guid', 'dummy-end']
                        }
                    },
                    {
                        type: DELETE_ELEMENT,
                        payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: -2 }
                    }
                );

                expect(createEndElement).toHaveBeenLastCalledWith({
                    parent: 'dummy-parent',
                    childIndex: 0,
                    next: null,
                    isTerminal: true
                });
            });

            it('addElementToState should have been called if element has a parent and childIndex', () => {
                const elementToDelete = {
                    guid: 'element-guid',
                    parent: 'dummy-parent',
                    childIndex: 0
                };

                flcElementsReducer(
                    {
                        'dummy-parent': {
                            children: ['element-guid', 'dummy-end']
                        }
                    },
                    {
                        type: DELETE_ELEMENT,
                        payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: -2 }
                    }
                );

                expect(addElementToState).toHaveBeenCalled();
            });

            it('parent element -> children should point to end element', () => {
                const elementToDelete = {
                    guid: 'element-guid',
                    parent: 'dummy-parent',
                    childIndex: 0
                };

                const updatedState = flcElementsReducer(
                    {
                        'dummy-parent': {
                            children: ['element-guid', 'dummy-end']
                        }
                    },
                    {
                        type: DELETE_ELEMENT,
                        payload: { selectedElements: [elementToDelete], connectorsToDelete: [], childIndexToKeep: -2 }
                    }
                );

                expect(updatedState['dummy-parent'].children[0]).toBe('end-element-guid');
            });
        });
    });

    describe('Modify Element With Children', () => {
        describe('When adding an outcome and deleting another outcome', () => {
            const newDecision = {
                guid: 'newDecision',
                name: 'newDecision',
                children: [null, 'screen1', null]
            };

            const originalStoreState = {
                newDecision: {
                    guid: 'newDecision',
                    name: 'newDecision',
                    children: [null, 'screen1', null]
                },
                screen1: {
                    guid: 'screen1',
                    name: 'screen1',
                    childIndex: 0
                },
                screen2: {
                    guid: 'screen2',
                    name: 'screen2',
                    childIndex: 1,
                    next: 'screen3'
                },
                screen3: {
                    guid: 'screen3',
                    name: 'screen3',
                    prev: 'screen2'
                }
            };

            const updatedState = flcElementsReducer(originalStoreState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: { canvasElement: newDecision, deletedBranchHeadGuids: ['screen2'] }
            });

            it('Updates the childIndex correctly', () => {
                expect(updatedState.screen1.childIndex).toBe(1);
            });

            it('screen2 should not be in the store', () => {
                expect(updatedState.screen2).toBeUndefined();
            });

            it('screen3 should not be in the store', () => {
                expect(updatedState.screen3).toBeUndefined();
            });
        });
        describe('When elements need to be inlined and parent next is an end element', () => {
            const newDecision = {
                guid: 'newDecision',
                name: 'newDecision',
                children: ['end1', null],
                next: 'end2'
            };

            const originalStoreState = {
                newDecision: {
                    guid: 'newDecision',
                    name: 'newDecision',
                    children: ['end1', null],
                    next: 'end2'
                },
                end1: {
                    guid: 'end1',
                    name: 'end1',
                    childIndex: 0,
                    isTerminal: true
                },
                end2: {
                    guid: 'end2',
                    name: 'end2',
                    elementType: ELEMENT_TYPE.END_ELEMENT,
                    prev: 'newDecision'
                }
            };

            const updatedState = flcElementsReducer(originalStoreState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: { canvasElement: newDecision, deletedBranchHeadGuids: [] }
            });

            it('end2 should be moved to the second branch', () => {
                expect(updatedState.newDecision.children).toMatchObject(['end1', 'end2']);
            });

            it('newDecision should not have a next', () => {
                expect(updatedState.newDecision.next).toBeNull();
            });

            it('end2 should have updated childIndex', () => {
                expect(updatedState.end2.childIndex).toBe(1);
            });

            it('end2 should have no prev', () => {
                expect(updatedState.end2.prev).toBeNull();
            });

            it('end2 should have isTerminal set to true', () => {
                expect(updatedState.end2.isTerminal).toBeTruthy();
            });
        });
        describe('When elements need to be inlined and parent next is a regular element', () => {
            const newDecision = {
                guid: 'newDecision',
                name: 'newDecision',
                children: ['end1', null],
                next: 'screen1'
            };

            const originalStoreState = {
                newDecision: {
                    guid: 'newDecision',
                    name: 'newDecision',
                    children: ['end1', null],
                    next: 'screen1'
                },
                end1: {
                    guid: 'end1',
                    name: 'end1',
                    childIndex: 0,
                    isTerminal: true
                },
                screen1: {
                    guid: 'screen1',
                    name: 'screen1',
                    prev: 'newDecision',
                    next: 'end2'
                },
                end2: {
                    guid: 'end2',
                    name: 'end2',
                    elementType: ELEMENT_TYPE.END_ELEMENT,
                    prev: 'screen1'
                }
            };

            const updatedState = flcElementsReducer(originalStoreState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: { canvasElement: newDecision, deletedBranchHeadGuids: [] }
            });

            it('end2 should be moved to the second branch', () => {
                expect(updatedState.newDecision.children).toMatchObject(['end1', 'screen1']);
            });

            it('newDecision should not have a next', () => {
                expect(updatedState.newDecision.next).toBeNull();
            });

            it('screen1 should have updated childIndex', () => {
                expect(updatedState.screen1.childIndex).toBe(1);
            });

            it('screen1 should have no prev', () => {
                expect(updatedState.screen1.prev).toBeNull();
            });

            it('screen1 should have isTerminal set to true', () => {
                expect(updatedState.screen1.isTerminal).toBeTruthy();
            });
        });

        describe('When adding an end element', () => {
            const newDecision = {
                guid: 'newDecision',
                name: 'newDecision',
                children: ['end1', null, 'end2']
            };
            const originalStoreState = {
                newDecision: {
                    guid: 'newDecision',
                    name: 'newDecision',
                    children: ['end1', null, 'end2']
                },
                end1: {
                    guid: 'end1',
                    name: 'end1',
                    childIndex: 0
                },
                end2: {
                    guid: 'end2',
                    name: 'end2',
                    childIndex: 2
                }
            };
            it('adds an end element to the correct index when shouldAddEndElement is true and newEndElementIdx exists', () => {
                const shouldAddEndElement = true;
                const newEndElementIdx = 1;
                const newState = flcElementsReducer(originalStoreState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: {
                        canvasElement: newDecision,
                        deletedBranchHeadGuids: [],
                        shouldAddEndElement,
                        newEndElementIdx
                    }
                });
                expect.assertions(2);
                expect(createEndElement).toHaveBeenCalledWith({
                    parent: 'newDecision',
                    childIndex: 1,
                    prev: null,
                    next: null,
                    isTerminal: true
                });
                expect(newState['end-element-guid']).toBeDefined();
            });

            it('adds an end element to current elements next when shouldAddEndElement is true and newEndElementIdx exists', () => {
                const shouldAddEndElement = true;
                const newState = flcElementsReducer(originalStoreState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: {
                        canvasElement: newDecision,
                        deletedBranchHeadGuids: [],
                        shouldAddEndElement
                    }
                });
                expect.assertions(3);
                expect(createEndElement).toHaveBeenCalledWith({
                    prev: 'newDecision',
                    next: null
                });
                expect(newState['end-element-guid'].prev).toBe('newDecision');
                expect(newState.newDecision.next).toBe('end-element-guid');
            });

            it('adds an end element properly when shouldAddEndElement is true and newEndElementIdx is 0', () => {
                const shouldAddEndElement = true;
                const newEndElementIdx = 0;
                const newState = flcElementsReducer(originalStoreState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: {
                        canvasElement: newDecision,
                        deletedBranchHeadGuids: [],
                        shouldAddEndElement,
                        newEndElementIdx
                    }
                });
                expect.assertions(2);
                expect(createEndElement).toHaveBeenCalledWith({
                    parent: 'newDecision',
                    childIndex: 0,
                    prev: null,
                    next: null,
                    isTerminal: true
                });
                expect(newState['end-element-guid']).toBeDefined();
            });
        });
        describe('When deleting outcomes on merging branches', () => {
            const newDecision = {
                guid: 'newDecision',
                name: 'newDecision',
                children: ['end1', null, null, 'end2'],
                next: null
            };
            const originalStoreState = {
                newDecision: {
                    guid: 'newDecision',
                    name: 'newDecision',
                    children: ['end1', null, 'end2'],
                    next: null,
                    prev: 'branchHead'
                },
                end1: {
                    guid: 'end1',
                    name: 'end1',
                    childIndex: 0
                },
                end2: {
                    guid: 'end2',
                    name: 'end2',
                    childIndex: 3
                },
                end3: {
                    guid: 'end3',
                    name: 'end3',
                    prev: 'newDecision'
                },
                branchHead: {
                    guid: 'branchHead',
                    next: 'newDecision',
                    isTerminal: false
                }
            };
            it('sets the branch head as terminal', () => {
                const newState = flcElementsReducer(originalStoreState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: {
                        canvasElement: newDecision,
                        deletedBranchHeadGuids: ['end3'],
                        shouldMarkBranchHeadAsTerminal: true
                    }
                });
                expect(newState.branchHead.isTerminal).toBeTruthy();
            });
        });
    });

    describe('Selection/Deselection of an Element', () => {
        let elements;
        beforeEach(() => {
            elements = {
                guid1: {
                    guid: 'guid1',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: true
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: false
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
            const updatedState = flcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: { canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids: [] }
            });

            expect(updatedState.guid1).toMatchObject({
                guid: 'guid1',
                config: {
                    isSelected: true,
                    isHighlighted: false,
                    isSelectable: true
                }
            });
        });

        it('Should mark guid3 as de-selected', () => {
            const updatedState = flcElementsReducer(elements, {
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
            const updatedState = flcElementsReducer(elements, {
                type: SELECTION_ON_FIXED_CANVAS,
                payload: { canvasElementGuidsToSelect: [], canvasElementGuidsToDeselect: [], selectableGuids: [] }
            });

            expect(updatedState).toMatchObject({
                guid1: {
                    guid: 'guid1',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        isSelectable: true
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
            const updatedState = flcElementsReducer(elements, {
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
                        isSelectable: false
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
                        isSelectable: false
                    }
                }
            });
        });
    });

    describe('Add Fault', () => {
        it('should add a fault to the an element and create a fault flow with a single end element', () => {
            const elementToAddFault = {
                guid: 'element-to-add-fault-guid'
            };

            const elements = {
                [elementToAddFault.guid]: elementToAddFault
            };

            flcElementsReducer(elements, {
                type: ADD_FAULT,
                payload: elementToAddFault.guid
            });

            const endElement = {
                guid: 'end-element-guid'
            };

            const expectedState = { ...elements, [endElement.guid]: endElement };
            expect(addElementToState).toHaveBeenLastCalledWith({ guid: 'end-element-guid' }, expectedState);
            expect(linkBranchOrFault).toHaveBeenLastCalledWith(expectedState, elementToAddFault, FAULT_INDEX, {
                guid: 'end-element-guid'
            });
        });
    });

    describe('Pasting elements', () => {
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
                updatedState = flcElementsReducer(mockStoreData.elements, {
                    type: PASTE_ON_FIXED_CANVAS,
                    payload: {
                        canvasElementGuidMap,
                        childElementGuidMap,
                        cutOrCopiedCanvasElements,
                        cutOrCopiedChildElements,
                        topCutOrCopiedGuid,
                        bottomCutOrCopiedGuid,
                        prev: 'assignment1',
                        next: 'wait1',
                        parent: null,
                        childIndex: null
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
                updatedState = flcElementsReducer(mockStoreData.elements, {
                    type: PASTE_ON_FIXED_CANVAS,
                    payload: {
                        canvasElementGuidMap,
                        childElementGuidMap,
                        cutOrCopiedCanvasElements,
                        cutOrCopiedChildElements,
                        topCutOrCopiedGuid,
                        bottomCutOrCopiedGuid,
                        prev: null,
                        next: 'screen1',
                        parent: 'wait1',
                        childIndex: 0
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
                updatedState = flcElementsReducer(mockStoreData.elements, {
                    type: PASTE_ON_FIXED_CANVAS,
                    payload: {
                        canvasElementGuidMap,
                        childElementGuidMap,
                        cutOrCopiedCanvasElements,
                        cutOrCopiedChildElements,
                        topCutOrCopiedGuid,
                        bottomCutOrCopiedGuid,
                        prev: null,
                        next: null,
                        parent: 'wait1',
                        childIndex: 1
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
                updatedState = flcElementsReducer(mockStoreData.elements, {
                    type: PASTE_ON_FIXED_CANVAS,
                    payload: {
                        canvasElementGuidMap,
                        childElementGuidMap,
                        cutOrCopiedCanvasElements,
                        cutOrCopiedChildElements,
                        topCutOrCopiedGuid,
                        bottomCutOrCopiedGuid,
                        prev: null,
                        next: 'screen2',
                        parent: 'wait1',
                        childIndex: 2
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
});
