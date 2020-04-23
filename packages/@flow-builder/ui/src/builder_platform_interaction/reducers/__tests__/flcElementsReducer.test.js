import {
    ADD_CANVAS_ELEMENT,
    ADD_START_ELEMENT,
    DELETE_ELEMENT,
    REORDER_CONNECTORS,
    SELECTION_ON_FIXED_CANVAS,
    PASTE_ON_FIXED_CANVAS
} from 'builder_platform_interaction/actions';
import { supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';
import { addElement, deleteElement, addElementToState, linkElement } from 'builder_platform_interaction/flowUtils';
import { createRootElement } from 'builder_platform_interaction/flcConversionUtils';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import flcElementsReducer from '../flcElementsReducer.js';
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
    return jest.fn(state => Object.assign({}, state));
});

jest.mock('builder_platform_interaction/elementFactory', () => {
    const { createPastedAssignment, createPastedDecision, createPastedScreen } = jest.requireActual(
        'builder_platform_interaction/elementFactory'
    );
    return {
        createEndElement: jest.fn(() => ({
            guid: 'end-element-guid'
        })),
        createPastedAssignment,
        createPastedDecision,
        createPastedScreen
    };
});

jest.mock('builder_platform_interaction/flcConversionUtils', () => {
    return {
        createRootElement: jest.fn(() => ({
            guid: 'root'
        }))
    };
});

jest.mock('builder_platform_interaction/flowUtils', () => {
    return Object.assign({}, jest.requireActual('builder_platform_interaction/flowUtils'), {
        addElement: jest.fn(),
        addElementToState: jest.fn(),
        deleteElement: jest.fn(),
        linkElement: jest.fn()
    });
});

jest.mock('builder_platform_interaction/flcBuilderUtils', () => {
    return {
        supportsChildren: jest.fn()
    };
});

jest.mock('builder_platform_interaction/contextLib', () => {
    return {
        useFixedLayoutCanvas: jest.fn(() => true)
    };
});

const oldElements = { guid1: getElement('guid1', 'ass1') };
const payload = getElement('guid2', 'ass2');

describe('elements-reducer', () => {
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
        it('supports children should be called when when dispatching ADD_CANVAS_ELEMENT', () => {
            const spy = supportsChildren;
            flcElementsReducer(oldElements, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('Add Start Element', () => {
        it('start, end and root elements are added', () => {
            flcElementsReducer(
                {},
                {
                    type: ADD_START_ELEMENT,
                    payload: { guid: 'start-element-guid' }
                }
            );

            expect(addElementToState).toHaveBeenLastCalledWith({ guid: 'root' }, {});
            expect(linkElement).toHaveBeenLastCalledWith({}, { guid: 'end-element-guid' });
            expect(createRootElement).toHaveBeenLastCalledWith('start-element-guid');
            expect(createEndElement).toHaveBeenLastCalledWith({ prev: 'start-element-guid' });
        });
    });

    describe('Delete Element', () => {
        it('calls deleteElement', () => {
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

            expect(deleteElement).toHaveBeenLastCalledWith({}, elementToDelete, 1);
        });
    });

    describe('Reorder Connectors', () => {
        it('outcome1 and outcome2 should be correctly swapped', () => {
            const elements = {
                decision1: {
                    guid: 'decision1',
                    elementType: ELEMENT_TYPE.DECISION,
                    outcomeReferences: [
                        {
                            outcomeReference: 'outcome1'
                        },
                        {
                            outcomeReference: 'outcome2'
                        }
                    ]
                }
            };

            const updatedState = flcElementsReducer(elements, {
                type: REORDER_CONNECTORS,
                payload: {
                    parentElementGuid: 'decision1',
                    oldChildReferenceGuid: 'outcome1',
                    newChildReferenceGuid: 'outcome2'
                }
            });

            expect(updatedState.decision1.outcomeReferences).toMatchObject([
                {
                    outcomeReference: 'outcome2'
                },
                {
                    outcomeReference: 'outcome1'
                }
            ]);
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
                        canSelect: true
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: false
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        canSelect: true
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
                    canSelect: true
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
                    canSelect: true
                }
            });
        });

        it('Should set canSelect to true for all elements when selectableGuids is an empty array', () => {
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
                        canSelect: true
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: true
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        canSelect: true
                    }
                }
            });
        });

        it('Should set canSelect to true only for elements in selectableGuids and false for the rest', () => {
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
                        canSelect: false
                    }
                },
                guid2: {
                    guid: 'guid2',
                    config: {
                        isSelected: false,
                        isHighlighted: false,
                        canSelect: true
                    }
                },
                guid3: {
                    guid: 'guid3',
                    config: {
                        isSelected: true,
                        isHighlighted: false,
                        canSelect: false
                    }
                }
            });
        });
    });

    describe('Pasting elements', () => {
        let mockStoreData;

        const assignment1 = {
            guid: 'assignment1',
            name: 'assignment1',
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            next: 'decision1'
        };

        const decision1 = {
            guid: 'decision1',
            name: 'decision1',
            elementType: ELEMENT_TYPE.DECISION,
            outcomeReferences: [
                {
                    outcomeReference: 'outcome1'
                },
                {
                    outcomeReference: 'outcome2'
                }
            ],
            prev: 'assignment1',
            next: null,
            children: ['screen1', null, 'screen2']
        };

        const screen1 = {
            guid: 'screen1',
            name: 'screen1',
            elementType: ELEMENT_TYPE.SCREEN,
            prev: null,
            next: null,
            parent: 'decision1',
            childIndex: 0,
            isTerminal: false
        };

        const screen2 = {
            guid: 'screen2',
            name: 'screen2',
            elementType: ELEMENT_TYPE.SCREEN,
            prev: null,
            next: null,
            parent: 'decision1',
            childIndex: 2,
            isTerminal: true
        };

        const outcome1 = {
            guid: 'outcome1',
            name: 'outcome1'
        };

        const outcome2 = {
            guid: 'outcome2',
            name: 'outcome2'
        };

        const canvasElementGuidMap = {
            assignment1: 'assignment1_0',
            decision1: 'decision1_0'
        };
        const childElementGuidMap = {
            outcome1: 'outcome1_0',
            outcome2: 'outcome2_0'
        };
        const cutOrCopiedCanvasElements = {
            assignment1,
            decision1
        };
        const cutOrCopiedChildElements = {
            outcome1,
            outcome2
        };
        const topCutOrCopiedGuid = 'assignment1';
        const bottomCutOrCopiedGuid = 'decision1';

        beforeEach(() => {
            mockStoreData = {
                elements: {
                    assignment1,
                    decision1,
                    screen1,
                    screen2,
                    outcome1,
                    outcome2
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
                        next: 'decision1',
                        parent: null,
                        childIndex: null
                    }
                });
            });

            it('Pasted elements should be included in the updated state', () => {
                expect(Object.keys(updatedState).includes('assignment1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('decision1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('outcome1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('outcome2_0')).toBeTruthy();
            });

            it('Previous Element next property should be updated', () => {
                expect(updatedState.assignment1.next).toEqual('assignment1_0');
            });

            it('Next Element previous property should be updated', () => {
                expect(updatedState.decision1.prev).toEqual('decision1_0');
            });

            it('Next Element should not have parent, childIndex or isTerminal property', () => {
                expect(Object.keys(updatedState.decision1).includes('parent')).toBeFalsy();
                expect(Object.keys(updatedState.decision1).includes('childIndex')).toBeFalsy();
                expect(Object.keys(updatedState.decision1).includes('isTerminal')).toBeFalsy();
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
                        parent: 'decision1',
                        childIndex: 0
                    }
                });
            });

            it('Pasted elements should be included in the updated state', () => {
                expect(Object.keys(updatedState).includes('assignment1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('decision1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('outcome1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('outcome2_0')).toBeTruthy();
            });

            it('assignment1_0 should have the right isTerminal property', () => {
                expect(updatedState.assignment1_0.isTerminal).toBeFalsy();
            });

            it('Next Element previous property should be updated', () => {
                expect(updatedState.screen1.prev).toEqual('decision1_0');
            });

            it('Next Element should not have parent, childIndex or isTerminal property', () => {
                expect(Object.keys(updatedState.screen1).includes('parent')).toBeFalsy();
                expect(Object.keys(updatedState.screen1).includes('childIndex')).toBeFalsy();
                expect(Object.keys(updatedState.screen1).includes('isTerminal')).toBeFalsy();
            });

            it('Parent element children property should be updated', () => {
                expect(updatedState.decision1.children).toEqual(['assignment1_0', null, 'screen2']);
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
                        parent: 'decision1',
                        childIndex: 1
                    }
                });
            });

            it('Pasted elements should be included in the updated state', () => {
                expect(Object.keys(updatedState).includes('assignment1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('decision1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('outcome1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('outcome2_0')).toBeTruthy();
            });

            it('assignment1_0 should have the right isTerminal property', () => {
                expect(updatedState.assignment1_0.isTerminal).toBeFalsy();
            });

            it('Parent element children property should be updated', () => {
                expect(updatedState.decision1.children).toEqual(['screen1', 'assignment1_0', 'screen2']);
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
                        parent: 'decision1',
                        childIndex: 2
                    }
                });
            });

            it('Pasted elements should be included in the updated state', () => {
                expect(Object.keys(updatedState).includes('assignment1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('decision1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('outcome1_0')).toBeTruthy();
                expect(Object.keys(updatedState).includes('outcome2_0')).toBeTruthy();
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
                expect(updatedState.decision1.children).toEqual(['screen1', null, 'assignment1_0']);
            });
        });
    });
});
