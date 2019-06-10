import elementReducer from '../elementsReducer';
import {
    UPDATE_FLOW,
    DO_DUPLICATE,
    ADD_CANVAS_ELEMENT,
    ADD_START_ELEMENT,
    ADD_RESOURCE,
    UPDATE_CANVAS_ELEMENT,
    UPDATE_CANVAS_ELEMENT_LOCATION,
    UPDATE_RESOURCE,
    UPDATE_VARIABLE_CONSTANT,
    DELETE_ELEMENT,
    ADD_CONNECTOR,
    DELETE_RESOURCE,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    MARQUEE_SELECT_ON_CANVAS,
    HIGHLIGHT_ON_CANVAS,
    ADD_DECISION_WITH_OUTCOMES,
    MODIFY_DECISION_WITH_OUTCOMES,
    ADD_WAIT_WITH_WAIT_EVENTS,
    MODIFY_WAIT_WITH_WAIT_EVENTS,
    ADD_SCREEN_WITH_FIELDS,
    MODIFY_SCREEN_WITH_FIELDS
} from 'builder_platform_interaction/actions';
import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE
} from 'builder_platform_interaction/flowMetadata';

const mockAssignment = {
    guid: 'originalAssignmentId',
    label: 'test Original Assignment',
    name: 'test_Original_Assignment',
    elementType: ELEMENT_TYPE.ASSIGNMENT,
    config: {
        isSelected: true
    }
};

const mockOutcome = {
    guid: 'originalOutcomeId',
    name: 'test_Original_Outcome',
    elementType: ELEMENT_TYPE.OUTCOME
};

const mockOutcome2 = {
    guid: 'originalOutcome2Id',
    name: 'test_Original_Outcome_0',
    elementType: ELEMENT_TYPE.OUTCOME
};

const mockDecision = {
    guid: 'originalDecisionId',
    label: 'test Original Decision',
    name: 'test_Original_Decision',
    elementType: ELEMENT_TYPE.DECISION,
    outcomeReferences: [{ outcomeReference: mockOutcome.guid }],
    config: {
        isSelected: true
    }
};

const mockDecision2 = {
    guid: 'originalDecision2Id',
    label: 'test Original Decision2',
    name: 'test_Original_Decision_0',
    elementType: ELEMENT_TYPE.DECISION,
    outcomeReferences: [{ outcomeReference: mockOutcome2.guid }],
    config: {
        isSelected: true
    }
};

const mockOriginalState = {
    [mockAssignment.guid]: mockAssignment,
    [mockOutcome.guid]: mockOutcome,
    [mockDecision.guid]: mockDecision,
    [mockOutcome2.guid]: mockOutcome2,
    [mockDecision2.guid]: mockDecision2
};

jest.mock('builder_platform_interaction/storeLib', () => {
    const getCurrentState = function () {
        return {
            elements: mockOriginalState
        };
    };
    const getStore = function () {
        return {
            getCurrentState
        };
    };
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    storeLib.Store.getStore = getStore;
    return storeLib;
});

const getElement = (guid, name) => {
    return {
        guid,
        name
    };
};

const getElementWithConfigProp = (
    guid,
    isCanvasElement,
    isSelected,
    isHighlighted
) => {
    return {
        guid,
        isCanvasElement,
        config: {
            isSelected,
            isHighlighted
        }
    };
};

describe('elements-reducer', () => {
    describe('Update Flow', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        it('with state set to defined & action type set to UPDATE_FLOW should return the new element state with the new elements', () => {
            const oldElements = { guid1: getElement('guid1', 'ass1') };
            const newElements = { guid2: getElement('guid2', 'ass2') };
            const newElementState = elementReducer(oldElements, {
                type: UPDATE_FLOW,
                payload: { elements: newElements }
            });
            expect(newElementState).toEqual(newElements);
        });
    });

    describe('DO_DUPLICATE', () => {
        it('duplicates canvas element with no child elements', () => {
            const duplicateAssignmentGuid = 'duplicateAssignmentId';
            const canvasElementGuidMap = {
                [mockAssignment.guid]: duplicateAssignmentGuid
            };
            const newState = elementReducer(mockOriginalState, {
                type: DO_DUPLICATE,
                payload: {
                    canvasElementGuidMap
                }
            });

            const originalElement = newState[mockAssignment.guid];
            const duplicateElement = newState[duplicateAssignmentGuid];
            expect(duplicateElement.name).not.toEqual(originalElement.name);
            expect(duplicateElement.guid).toEqual(duplicateAssignmentGuid);
            expect(originalElement.config.isSelected).toEqual(false);
        });

        it('duplicates canvas element with child elements', () => {
            const duplicateDecisionGuid = 'duplicateDecisionId';
            const duplicateOutcomeGuid = 'duplicateOutcomeId';
            const canvasElementGuidMap = {
                [mockDecision.guid]: duplicateDecisionGuid
            };
            const childElementGuidMap = {
                [mockOutcome.guid]: duplicateOutcomeGuid
            };
            const newState = elementReducer(mockOriginalState, {
                type: DO_DUPLICATE,
                payload: {
                    canvasElementGuidMap,
                    childElementGuidMap
                }
            });

            const originalChildElement = newState[mockOutcome.guid];
            const duplicateChildElement = newState[duplicateOutcomeGuid];
            expect(duplicateChildElement.name).not.toEqual(
                originalChildElement.name
            );
            expect(duplicateChildElement.guid).toEqual(duplicateOutcomeGuid);
        });

        it('duplicates canvas element with connector', () => {
            const duplicateDecisionGuid = 'duplicateDecisionId';
            const duplicateOutcomeGuid = 'duplicateOutcomeId';
            const canvasElementGuidMap = {
                [mockDecision.guid]: duplicateDecisionGuid
            };
            const childElementGuidMap = {
                [mockOutcome.guid]: duplicateOutcomeGuid
            };
            const connector = {
                source: mockDecision.guid,
                target: mockAssignment.guid,
                type: CONNECTOR_TYPE.DEFAULT
            };
            const connectorsToDuplicate = [connector];
            const newState = elementReducer(mockOriginalState, {
                type: DO_DUPLICATE,
                payload: {
                    canvasElementGuidMap,
                    childElementGuidMap,
                    connectorsToDuplicate
                }
            });

            const expectedAvailableConnection = {
                type: CONNECTOR_TYPE.REGULAR,
                childReference: duplicateOutcomeGuid
            };

            const duplicateElement = newState[duplicateDecisionGuid];
            expect(duplicateElement.availableConnections).toHaveLength(1);
            expect(duplicateElement.availableConnections[0]).toMatchObject(
                expectedAvailableConnection
            );
            expect(duplicateElement.connectorCount).toEqual(1);
        });

        it('duplicates canvas element with connector on child element', () => {
            const duplicateDecisionGuid = 'duplicateDecisionId';
            const duplicateOutcomeGuid = 'duplicateOutcomeId';
            const canvasElementGuidMap = {
                [mockDecision.guid]: duplicateDecisionGuid
            };
            const childElementGuidMap = {
                [mockOutcome.guid]: duplicateOutcomeGuid
            };
            const connector = {
                source: mockDecision.guid,
                childSource: mockOutcome.guid,
                target: mockAssignment.guid,
                type: CONNECTOR_TYPE.DEFAULT
            };
            const connectorsToDuplicate = [connector];
            const newState = elementReducer(mockOriginalState, {
                type: DO_DUPLICATE,
                payload: {
                    canvasElementGuidMap,
                    childElementGuidMap,
                    connectorsToDuplicate
                }
            });

            const expectedAvailableConnection = {
                type: CONNECTOR_TYPE.DEFAULT
            };

            const duplicateElement = newState[duplicateDecisionGuid];
            expect(duplicateElement.availableConnections).toHaveLength(1);
            expect(duplicateElement.availableConnections[0]).toMatchObject(
                expectedAvailableConnection
            );
            expect(duplicateElement.connectorCount).toEqual(1);
        });

        it('duplicates canvas element and sets unique name correctly in case of name conflict with existing element', () => {
            const duplicateDecisionGuid = 'duplicateDecisionId';
            const duplicateDecision2Guid = 'duplicateDecision2Id';
            const canvasElementGuidMap = {
                [mockDecision.guid]: duplicateDecisionGuid,
                [mockDecision2.guid]: duplicateDecision2Guid
            };
            const newState = elementReducer(mockOriginalState, {
                type: DO_DUPLICATE,
                payload: {
                    canvasElementGuidMap
                }
            });

            const duplicateDecision1 = newState[duplicateDecisionGuid];
            const duplicateDecision2 = newState[duplicateDecision2Guid];
            expect(duplicateDecision1.name).not.toBeUndefined();
            expect(duplicateDecision2.name).not.toBeUndefined();
            const elementNamesExceptDuplicateDecision1Name = [
                mockDecision.name,
                mockDecision2.name,
                duplicateDecision2.name
            ];
            const elementNamesExceptDuplicateDecision2Name = [
                mockDecision.name,
                mockDecision2.name,
                duplicateDecision1.name
            ];
            expect(elementNamesExceptDuplicateDecision1Name).not.toContain(
                duplicateDecision1.name
            );
            expect(elementNamesExceptDuplicateDecision2Name).not.toContain(
                duplicateDecision2.name
            );
        });

        it('duplicates child element and sets unique name correctly in case of name conflict with existing element', () => {
            const duplicateDecisionGuid = 'duplicateDecisionId';
            const duplicateDecision2Guid = 'duplicateDecision2Id';
            const duplicateOutcomeGuid = 'duplicateOutcomeId';
            const duplicateOutcome2Guid = 'duplicateOutcome2Id';
            const canvasElementGuidMap = {
                [mockDecision.guid]: duplicateDecisionGuid,
                [mockDecision2.guid]: duplicateDecision2Guid
            };
            const childElementGuidMap = {
                [mockOutcome.guid]: duplicateOutcomeGuid,
                [mockOutcome2.guid]: duplicateOutcome2Guid
            };
            const newState = elementReducer(mockOriginalState, {
                type: DO_DUPLICATE,
                payload: {
                    canvasElementGuidMap,
                    childElementGuidMap
                }
            });

            const duplicateOutcome1 = newState[duplicateOutcomeGuid];
            const duplicateOutcome2 = newState[duplicateOutcome2Guid];
            expect(duplicateOutcome1.name).not.toBeUndefined();
            expect(duplicateOutcome2.name).not.toBeUndefined();
            const elementNamesExceptDuplicateOutcome1Name = [
                mockOutcome.name,
                mockOutcome2.name,
                duplicateOutcome2.name
            ];
            const elementNamesExceptDuplicateOutcome2Name = [
                mockOutcome.name,
                mockOutcome2.name,
                duplicateOutcome1.name
            ];
            expect(elementNamesExceptDuplicateOutcome1Name).not.toContain(
                duplicateOutcome1.name
            );
            expect(elementNamesExceptDuplicateOutcome2Name).not.toContain(
                duplicateOutcome2.name
            );
        });
    });

    describe('Add Canvas Element', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        const oldElements = { guid1: getElement('guid1', 'ass1') };
        const addedElements = { guid2: getElement('guid2', 'ass2') };
        const payload = getElement('guid2', 'ass2');

        it('with state set to undefined & action type is ADD_CANVAS_ELEMENT should add the new element', () => {
            const newElementState = elementReducer(undefined, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(newElementState).toEqual(addedElements);
        });

        it('with state set to defined & action type is ADD_CANVAS_ELEMENT should add the new element', () => {
            const newElementState = elementReducer(oldElements, {
                type: ADD_CANVAS_ELEMENT,
                payload
            });
            expect(newElementState).toEqual({
                ...oldElements,
                ...addedElements
            });
        });
    });

    describe('Add Start Element', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        const oldElements = { guid1: getElement('guid1', 'ass1') };
        const addedElements = { guid2: getElement('guid2', 'ass2') };
        const payload = getElement('guid2', 'ass2');

        it('with state set to undefined & action type is ADD_START_ELEMENT should add the new element', () => {
            const newElementState = elementReducer(undefined, {
                type: ADD_START_ELEMENT,
                payload
            });
            expect(newElementState).toEqual(addedElements);
        });

        it('with state set to defined & action type is ADD_START_ELEMENT should add the new element', () => {
            const newElementState = elementReducer(oldElements, {
                type: ADD_START_ELEMENT,
                payload
            });
            expect(newElementState).toEqual({
                ...oldElements,
                ...addedElements
            });
        });
    });

    describe('Add Resource', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        const oldElements = { guid1: getElement('guid1', 'ass1') };
        const addedElements = { guid2: getElement('guid2', 'ass2') };
        const payload = getElement('guid2', 'ass2');

        it('with state set to undefined & action type is ADD_RESOURCE should add the new element', () => {
            const newElementState = elementReducer(undefined, {
                type: ADD_RESOURCE,
                payload
            });
            expect(newElementState).toEqual(addedElements);
        });

        it('with state set to defined & action type is ADD_RESOURCE should add the new element', () => {
            const newElementState = elementReducer(oldElements, {
                type: ADD_RESOURCE,
                payload
            });
            expect(newElementState).toEqual({
                ...oldElements,
                ...addedElements
            });
        });
    });

    describe('Update Canavas Element', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        const oldElements = { guid1: getElement('guid1', 'ass1') };
        const updatedElements = { guid1: getElement('guid1', 'ass2') };
        const payload = getElement('guid1', 'ass2');

        it('with state set to undefined & action type is UPDATE_CANVAS_ELEMENT should return the new element state with the updated property', () => {
            const newElementState = elementReducer(undefined, {
                type: UPDATE_CANVAS_ELEMENT,
                payload
            });
            expect(newElementState).toEqual(updatedElements);
        });

        it('with state set to defined & action type is UPDATE_CANVAS_ELEMENT should return the new element state with the updated property', () => {
            const newElementState = elementReducer(oldElements, {
                type: UPDATE_CANVAS_ELEMENT,
                payload
            });
            expect(newElementState).toEqual(updatedElements);
        });
    });

    describe('Update Canavas Element Location', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        const oldElements = {
            guid1: {
                name: 'ass1',
                locationX: 1,
                locationY: 1,
                guid: 'guid1'
            }
        };
        const updatedElements = {
            guid1: {
                name: 'ass1',
                locationX: 2,
                locationY: 2,
                guid: 'guid1'
            }
        };

        const payload = {
            name: 'ass1',
            locationX: 2,
            locationY: 2,
            guid: 'guid1'
        };
        it('with state set to undefined & action type is UPDATE_CANVAS_ELEMENT_LOCATION should return the new element state with the updated property', () => {
            const newElementState = elementReducer(undefined, {
                type: UPDATE_CANVAS_ELEMENT_LOCATION,
                payload
            });
            expect(newElementState).toEqual(updatedElements);
        });

        it('with state set to defined & action type is UPDATE_CANVAS_ELEMENT_LOCATION should return the new element state with the updated property', () => {
            const newElementState = elementReducer(oldElements, {
                type: UPDATE_CANVAS_ELEMENT_LOCATION,
                payload
            });
            expect(newElementState).toEqual(updatedElements);
        });
    });

    describe('Update Resource', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        const oldElements = { guid1: getElement('guid1', 'ass1') };
        const updatedElements = { guid1: getElement('guid1', 'ass2') };
        const payload = getElement('guid1', 'ass2');

        it('with state set to undefined & action type is UPDATE_RESOURCE should return the new element state with the updated property', () => {
            const newElementState = elementReducer(undefined, {
                type: UPDATE_RESOURCE,
                payload
            });
            expect(newElementState).toEqual(updatedElements);
        });

        it('with state set to defined & action type is UPDATE_RESOURCE should return the new element state with the updated property', () => {
            const newElementState = elementReducer(oldElements, {
                type: UPDATE_RESOURCE,
                payload
            });
            expect(newElementState).toEqual(updatedElements);
        });
    });

    describe('Update Variable or Constant', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        const oldElements = {
            guid1: {
                name: 'ass1',
                elementType: 'VARIABLE',
                guid: 'guid1'
            }
        };
        const updatedElements = {
            guid1: {
                name: 'ass2',
                elementType: 'VARIABLE',
                guid: 'guid1'
            }
        };

        const payload = {
            name: 'ass2',
            elementType: 'VARIABLE',
            guid: 'guid1'
        };
        it('with state set to undefined & action type set to UPDATE_VARIABLE_CONSTANT should return the new element state with the updated property', () => {
            const newElementState = elementReducer(undefined, {
                type: UPDATE_RESOURCE,
                payload
            });
            expect(newElementState).toEqual(updatedElements);
        });

        it('with state set to defined & action type set to UPDATE_VARIABLE_CONSTANT should return the new element state with the updated property', () => {
            const newElementState = elementReducer(oldElements, {
                type: UPDATE_VARIABLE_CONSTANT,
                payload
            });
            expect(newElementState).toEqual(updatedElements);
        });
    });

    describe('Delete Element', () => {
        it('with state set to undefined & action type is DELETE_ELEMENT should return empty state', () => {
            const newElementState = elementReducer(undefined, {
                type: DELETE_ELEMENT,
                payload: { selectedElementGUIDs: [], connectorsToDelete: [] }
            });
            expect(newElementState).toEqual({});
        });

        it('with state set to defined & action type is DELETE_ELEMENT should delete the property from the element object', () => {
            const omitProps = ['guid1'];
            const connector = {
                source: 'guid2',
                type: 'DEFAULT'
            };
            const oldProperties = {
                guid1: {
                    name: 'ass1',
                    label: 'assignment 1',
                    description: 'desc 1',
                    guid: 'guid1'
                },
                guid2: {
                    name: 'des2',
                    label: 'decision 2',
                    description: 'desc 2',
                    guid: 'guid2',
                    connectorCount: 1,
                    availableConnections: []
                }
            };
            const newProperties = {
                guid2: {
                    name: 'des2',
                    label: 'decision 2',
                    description: 'desc 2',
                    guid: 'guid2',
                    connectorCount: 0,
                    availableConnections: [
                        {
                            childReference: undefined,
                            type: 'DEFAULT'
                        }
                    ]
                }
            };

            const payload = {
                selectedElementGUIDs: omitProps,
                connectorsToDelete: [connector]
            };
            const newElementState = elementReducer(oldProperties, {
                type: DELETE_ELEMENT,
                payload
            });
            expect(newElementState).toEqual(newProperties);
        });
    });

    describe('Add Connector', () => {
        it('with state set to defined & action type is ADD_CONNECTOR should increment connectorCount and remove the connector from availableConnections', () => {
            const connector = {
                source: 'guid1',
                type: 'REGULAR',
                childSource: 'outcome1'
            };
            const oldProperties = {
                guid1: {
                    name: 'des1',
                    label: 'decision 1',
                    description: 'desc 1',
                    guid: 'guid1',
                    outcomeReferences: ['outcome1'],
                    connectorCount: 0,
                    availableConnections: [
                        {
                            type: 'REGULAR',
                            childReference: 'outcome1'
                        }
                    ]
                }
            };
            const newProperties = {
                guid1: {
                    name: 'des1',
                    label: 'decision 1',
                    description: 'desc 1',
                    guid: 'guid1',
                    outcomeReferences: ['outcome1'],
                    connectorCount: 1,
                    availableConnections: []
                }
            };

            const newElementState = elementReducer(oldProperties, {
                type: ADD_CONNECTOR,
                payload: connector
            });
            expect(newElementState).toEqual(newProperties);
        });
    });

    describe('Delete Resource', () => {
        it('with state set to undefined & action type set to DELETE_RESOURCE should return an empty object', () => {
            const propToOmit = 'description';
            const newElementState = elementReducer(undefined, {
                type: DELETE_RESOURCE,
                payload: { selectedElementGUIDs: [propToOmit] }
            });
            expect(newElementState).toEqual({});
        });

        it('with state set to defined & action type set to DELETE_RESOURCE should return the new element state with the excluded properties', () => {
            const omitProps = 'description';
            const oldProperties = {
                name: 'ass1',
                label: 'assignment 1',
                description: 'desc 1',
                guid: 'guid1'
            };
            const newProperties = {
                name: 'ass1',
                label: 'assignment 1',
                guid: 'guid1'
            };

            const payload = { selectedElementGUIDs: [omitProps] };
            const newElementState = elementReducer(oldProperties, {
                type: DELETE_RESOURCE,
                payload
            });
            expect(newElementState).toEqual(newProperties);
        });
    });

    describe('Select on Canvas Elements', () => {
        it('With state set to undefined & action type is SELECT_ON_CANVAS should return the copy of original state', () => {
            const updatedElements = {};
            const newElementState = elementReducer(undefined, {
                type: SELECT_ON_CANVAS,
                payload: { guid: 'guid1' }
            });
            expect(newElementState).toEqual(updatedElements);
        });

        describe('Canvas element that has been clicked upon', () => {
            it('Clicking on a canvas element that is neither selected nor highlighted, Canvas element should get selected and should stay unhighlighted.', () => {
                const oldElement = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        false,
                        false
                    )
                };
                const updatedElements = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        false
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('Clicking on a canvas element that is not selected but is highlighted, Canvas element should get selected and should stay highlighted.', () => {
                const oldElement = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        false,
                        true
                    )
                };
                const updatedElements = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('Clicking on a canvas element that is selected but is not highlighted, Canvas element should stay selected and unhighlighted.', () => {
                const oldElement = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        false
                    )
                };
                const updatedElements = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        false
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('Clicking on a canvas element that is selected and highlighted, Canvas element should stay selected and highlighted.', () => {
                const oldElement = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    )
                };
                const updatedElements = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });
        });

        describe('Other canvas elements that have not been clicked upon', () => {
            it('When the other canvas element is neither selected nor highlighted, the other canvas element should stay deselected and unhighlighted.', () => {
                const oldElement = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, false)
                };
                const updatedElements = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, false)
                };
                const newElementState = elementReducer(oldElement, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('When the other canvas element is seletced but not highlighted, the other canvas element should get deselected and stay unhighlighted.', () => {
                const oldElement = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, true, false)
                };
                const updatedElements = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, false)
                };
                const newElementState = elementReducer(oldElement, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('When the other canvas element is not selected but is highlighted, the other canvas element should get unhighlighted and stay deselected.', () => {
                const oldElement = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, true)
                };
                const updatedElements = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, false)
                };
                const newElementState = elementReducer(oldElement, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('When the other canvas element is both selected and highlighted, the other canvas element should get both deselected and unhighlighted.', () => {
                const oldElement = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, true, true)
                };
                const updatedElements = {
                    selectedGUID: getElementWithConfigProp(
                        'selectedGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, false)
                };
                const newElementState = elementReducer(oldElement, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });
        });
    });

    describe('Toggle on Canvas Elements', () => {
        it('With state set to undefined & action type is TOGGLE_ON_CANVAS should return the copy of original state', () => {
            const updatedElements = {};
            const newElementState = elementReducer(undefined, {
                type: TOGGLE_ON_CANVAS,
                payload: { guid: 'guid1' }
            });
            expect(newElementState).toEqual(updatedElements);
        });

        describe('Toggling selected canvas element', () => {
            it('When the canvas element is selected and unhighlighted, the canvas element gets deselected and stays unhighlighted.', () => {
                const oldElement = {
                    toggledGUID: getElementWithConfigProp(
                        'toggledGUID',
                        true,
                        true,
                        false
                    )
                };
                const updatedElements = {
                    toggledGUID: getElementWithConfigProp(
                        'toggledGUID',
                        true,
                        false,
                        false
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: TOGGLE_ON_CANVAS,
                    payload: { guid: 'toggledGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('When the canvas element is selected and highlighted, the canvas element gets deselected and stays highlighted.', () => {
                const oldElement = {
                    toggledGUID: getElementWithConfigProp(
                        'toggledGUID',
                        true,
                        true,
                        true
                    )
                };
                const updatedElements = {
                    toggledGUID: getElementWithConfigProp(
                        'toggledGUID',
                        true,
                        false,
                        true
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: TOGGLE_ON_CANVAS,
                    payload: { guid: 'toggledGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });
        });

        describe('Toggling deselected canvas element', () => {
            it('When the canvas element is deselected and unhighlighted, the canvas element gets selected and stays unhighlighted.', () => {
                const oldElement = {
                    toggledGUID: getElementWithConfigProp(
                        'toggledGUID',
                        true,
                        false,
                        false
                    )
                };
                const updatedElements = {
                    toggledGUID: getElementWithConfigProp(
                        'toggledGUID',
                        true,
                        true,
                        false
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: TOGGLE_ON_CANVAS,
                    payload: { guid: 'toggledGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('When the canvas element is deselected and highlighted, The canvas element gets selected and stays highlighted.', () => {
                const oldElement = {
                    toggledGUID: getElementWithConfigProp(
                        'toggledGUID',
                        true,
                        false,
                        true
                    )
                };
                const updatedElements = {
                    toggledGUID: getElementWithConfigProp(
                        'toggledGUID',
                        true,
                        true,
                        true
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: TOGGLE_ON_CANVAS,
                    payload: { guid: 'toggledGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });
        });
    });

    describe('Deselect on Canvas Elements', () => {
        it('With state set to undefined & action type is DESELECT_ON_CANVAS should return the copy of original state', () => {
            const updatedElements = {};
            const newElementState = elementReducer(undefined, {
                type: DESELECT_ON_CANVAS,
                payload: { guid: 'guid1' }
            });
            expect(newElementState).toEqual(updatedElements);
        });

        it('Clicking on the white space with multiple canvas elements, all canvas elements should get deselected and unhighlighted.', () => {
            const oldElement = {
                deselectGUID: getElementWithConfigProp(
                    'deselectGUID',
                    true,
                    false,
                    true
                ),
                guid2: getElementWithConfigProp('guid2', true, true, false),
                guid3: getElementWithConfigProp('guid3', true, false, false),
                guid4: getElementWithConfigProp('guid4', true, true, true)
            };
            const updatedElements = {
                deselectGUID: getElementWithConfigProp(
                    'deselectGUID',
                    true,
                    false,
                    false
                ),
                guid2: getElementWithConfigProp('guid2', true, false, false),
                guid3: getElementWithConfigProp('guid3', true, false, false),
                guid4: getElementWithConfigProp('guid4', true, false, false)
            };
            const newElementState = elementReducer(oldElement, {
                type: DESELECT_ON_CANVAS
            });
            expect(newElementState).toEqual(updatedElements);
        });
    });

    describe('Marquee Select on Canvas Elements', () => {
        it('With state set to undefined & action type is MARQUEE_SELECT_ON_CANVAS should return the copy of original state', () => {
            const updatedElements = {};
            const newElementState = elementReducer(undefined, {
                type: MARQUEE_SELECT_ON_CANVAS,
                payload: {
                    canvasElementGuidsToSelect: [],
                    canvasElementGuidsToDeselect: []
                }
            });
            expect(newElementState).toEqual(updatedElements);
        });

        it('When list of canvas elements to be selected and none to be deselected, should select the canvas elements in guidsToSelect list', () => {
            const guidsToSelect = ['guid1', 'guid2'];
            const guidsToDeselect = [];
            const oldElement = {
                guid1: getElementWithConfigProp('guid1', true, false, false),
                guid2: getElementWithConfigProp('guid2', true, false, true),
                guid3: getElementWithConfigProp('guid3', true, false, false)
            };
            const updatedElements = {
                guid1: getElementWithConfigProp('guid1', true, true, false),
                guid2: getElementWithConfigProp('guid2', true, true, false),
                guid3: getElementWithConfigProp('guid3', true, false, false)
            };
            const newElementState = elementReducer(oldElement, {
                type: MARQUEE_SELECT_ON_CANVAS,
                payload: {
                    canvasElementGuidsToSelect: guidsToSelect,
                    canvasElementGuidsToDeselect: guidsToDeselect
                }
            });
            expect(newElementState).toEqual(updatedElements);
        });

        it('When list of canvas elements to be deselected and none to be selected, should deslect the canvas elements in guidsToDeselect list', () => {
            const guidsToSelect = [];
            const guidsToDeselect = ['guid1', 'guid2'];
            const oldElement = {
                guid1: getElementWithConfigProp('guid1', true, true, false),
                guid2: getElementWithConfigProp('guid2', true, true, true),
                guid3: getElementWithConfigProp('guid3', true, false, false)
            };
            const updatedElements = {
                guid1: getElementWithConfigProp('guid1', true, false, false),
                guid2: getElementWithConfigProp('guid2', true, false, false),
                guid3: getElementWithConfigProp('guid3', true, false, false)
            };
            const newElementState = elementReducer(oldElement, {
                type: MARQUEE_SELECT_ON_CANVAS,
                payload: {
                    canvasElementGuidsToSelect: guidsToSelect,
                    canvasElementGuidsToDeselect: guidsToDeselect
                }
            });
            expect(newElementState).toEqual(updatedElements);
        });

        it('When list of canvas elements to be selected and deselected, should select the canvas element in guidsToSelect list and deselect the elements in guidsToDeselect list', () => {
            const guidsToSelect = ['guid1', 'guid2'];
            const guidsToDeselect = ['guid3', 'guid4'];
            const oldElement = {
                guid1: getElementWithConfigProp('guid1', true, false, false),
                guid2: getElementWithConfigProp('guid2', true, false, true),
                guid3: getElementWithConfigProp('guid3', true, true, false),
                guid4: getElementWithConfigProp('guid4', true, true, true)
            };
            const updatedElements = {
                guid1: getElementWithConfigProp('guid1', true, true, false),
                guid2: getElementWithConfigProp('guid2', true, true, false),
                guid3: getElementWithConfigProp('guid3', true, false, false),
                guid4: getElementWithConfigProp('guid4', true, false, false)
            };
            const newElementState = elementReducer(oldElement, {
                type: MARQUEE_SELECT_ON_CANVAS,
                payload: {
                    canvasElementGuidsToSelect: guidsToSelect,
                    canvasElementGuidsToDeselect: guidsToDeselect
                }
            });
            expect(newElementState).toEqual(updatedElements);
        });
    });

    describe('Highlight on Canvas Elements', () => {
        it('With state set to undefined & action type is HIGHLIGHT_ON_CANVAS should return the copy of original state', () => {
            const updatedElements = {};
            const newElementState = elementReducer(undefined, {
                type: HIGHLIGHT_ON_CANVAS,
                payload: { guid: 'guid1' }
            });
            expect(newElementState).toEqual(updatedElements);
        });

        describe('Canvas element that has been searched', () => {
            it('Searching a canvas element that is neither selected nor highlighted, canvas element should stay deselected and get highlighted.', () => {
                const oldElement = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        false,
                        false
                    )
                };
                const updatedElements = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        false,
                        true
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: HIGHLIGHT_ON_CANVAS,
                    payload: { guid: 'highlightGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('Searching a canvas element that is not selected but is highlighted, canvas element should stay deselected and highlighted.', () => {
                const oldElement = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        false,
                        true
                    )
                };
                const updatedElements = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        false,
                        true
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: HIGHLIGHT_ON_CANVAS,
                    payload: { guid: 'highlightGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('Searching a canvas element that is selected but is not highlighted, canvas element should stay selected and get highlighted.', () => {
                const oldElement = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        false
                    )
                };
                const updatedElements = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: HIGHLIGHT_ON_CANVAS,
                    payload: { guid: 'highlightGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('Searching a canvas element that is selected and highlighted, canvas element should stay selected and stay highlighted.', () => {
                const oldElement = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    )
                };
                const updatedElements = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    )
                };
                const newElementState = elementReducer(oldElement, {
                    type: HIGHLIGHT_ON_CANVAS,
                    payload: { guid: 'highlightGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });
        });

        describe('Other canvas elements that have not been searched', () => {
            it('When the other canvas element is neither selected nor highlighted, the other canvas element should stay deselected and unhighlighted.', () => {
                const oldElement = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, false)
                };
                const updatedElements = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, false)
                };
                const newElementState = elementReducer(oldElement, {
                    type: HIGHLIGHT_ON_CANVAS,
                    payload: { guid: 'highlightGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('When the other canvas element is seletced but not highlighted, The other canvas element should stay selected and stay unhighlighted.', () => {
                const oldElement = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, true, false)
                };
                const updatedElements = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, true, false)
                };
                const newElementState = elementReducer(oldElement, {
                    type: HIGHLIGHT_ON_CANVAS,
                    payload: { guid: 'highlightGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('When the other canvas element is not selected but is highlighted, the other canvas element should stay deselected and get unhighlighted.', () => {
                const oldElement = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, true)
                };
                const updatedElements = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, false, false)
                };
                const newElementState = elementReducer(oldElement, {
                    type: HIGHLIGHT_ON_CANVAS,
                    payload: { guid: 'highlightGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });

            it('When the other canvas element is both selected and highlighted, the other canvas element should stay selected and get unhighlighted.', () => {
                const oldElement = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, true, true)
                };
                const updatedElements = {
                    highlightGUID: getElementWithConfigProp(
                        'highlightGUID',
                        true,
                        true,
                        true
                    ),
                    guid2: getElementWithConfigProp('guid2', true, true, false)
                };
                const newElementState = elementReducer(oldElement, {
                    type: HIGHLIGHT_ON_CANVAS,
                    payload: { guid: 'highlightGUID' }
                });
                expect(newElementState).toEqual(updatedElements);
            });
        });
    });

    describe('Add Decision with Outcomes', () => {
        const oldElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'DECISION',
                name: 'decison1'
            }
        };
        const newElements = {
            guid2: {
                guid: 'guid2',
                elementType: 'DECISION',
                name: 'decision2',
                outcomeReferences: [
                    {
                        outcomeReference: 'guid3'
                    }
                ]
            },
            guid3: {
                guid: 'guid3',
                name: 'outcome1',
                elementType: 'OUTCOME'
            }
        };

        const payload = {
            canvasElement: {
                guid: 'guid2',
                elementType: 'DECISION',
                name: 'decision2',
                outcomeReferences: [
                    {
                        outcomeReference: 'guid3'
                    }
                ]
            },
            deletedChildElementGuids: [],
            childElements: [
                {
                    guid: 'guid3',
                    name: 'outcome1',
                    elementType: 'OUTCOME'
                }
            ]
        };
        it('with state set to undefined & action type set to ADD_DECISION_WITH_OUTCOMES should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: ADD_DECISION_WITH_OUTCOMES,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to ADD_DECISION_WITH_OUTCOMES should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: ADD_DECISION_WITH_OUTCOMES,
                payload
            });
            expect(newElementState).toEqual({ ...oldElements, ...newElements });
        });
    });

    describe('Update Decision with Outcomes', () => {
        const oldElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'DECISION',
                name: 'decison1',
                outcomeReferences: [
                    {
                        outcomeReference: 'guid2'
                    }
                ]
            },
            guid2: {
                guid: 'guid2',
                elementType: 'OUTCOME',
                name: 'outcome2'
            }
        };
        const newElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'DECISION',
                name: 'decision2',
                outcomeReferences: [
                    {
                        outcomeReference: 'guid2'
                    }
                ]
            },
            guid2: {
                guid: 'guid2',
                elementType: 'OUTCOME',
                name: 'outcome3'
            }
        };

        const payload = {
            canvasElement: {
                guid: 'guid1',
                elementType: 'DECISION',
                name: 'decision2',
                outcomeReferences: [
                    {
                        outcomeReference: 'guid2'
                    }
                ]
            },
            deletedChildElementGuids: [],
            childElements: [
                {
                    guid: 'guid2',
                    elementType: 'OUTCOME',
                    name: 'outcome3'
                }
            ]
        };
        it('with state set to undefined & action type set to MODIFY_DECISION_WITH_OUTCOMES should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to MODIFY_DECISION_WITH_OUTCOMES should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });
    });

    describe('Delete Decision with Outcomes', () => {
        const oldElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'DECISION',
                name: 'decison1',
                outcomeReferences: [
                    {
                        outcomeReference: 'guid4'
                    }
                ]
            }
        };
        const newElements = {
            guid2: {
                guid: 'guid2',
                elementType: 'DECISION',
                name: 'decision2',
                outcomeReferences: [
                    {
                        outcomeReference: 'guid3'
                    }
                ]
            },
            guid3: {
                guid: 'guid3',
                name: 'outcome1',
                elementType: 'OUTCOME'
            }
        };

        const payload = {
            canvasElement: {
                guid: 'guid2',
                elementType: 'DECISION',
                name: 'decision2',
                outcomeReferences: [
                    {
                        outcomeReference: 'guid3'
                    }
                ]
            },
            deletedChildElementGuids: ['guid1'],
            childElements: [
                {
                    guid: 'guid3',
                    name: 'outcome1',
                    elementType: 'OUTCOME'
                }
            ]
        };
        it('with state set to undefined & action type set to MODIFY_DECISION_WITH_OUTCOMES should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to MODIFY_DECISION_WITH_OUTCOMES should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });
    });

    describe('Add Wait with Wait Events', () => {
        const oldElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'WAIT',
                name: 'wait1'
            }
        };
        const newElements = {
            guid2: {
                guid: 'guid2',
                elementType: 'WAIT',
                name: 'wait2',
                waitEventReferences: [
                    {
                        waitEventReference: 'guid3'
                    }
                ]
            },
            guid3: {
                guid: 'guid3',
                name: 'waitEvent1',
                elementType: 'WAIT_EVENT'
            }
        };

        const payload = {
            canvasElement: {
                guid: 'guid2',
                elementType: 'WAIT',
                name: 'wait2',
                waitEventReferences: [
                    {
                        waitEventReference: 'guid3'
                    }
                ]
            },
            deletedChildElementGuids: [],
            childElements: [
                {
                    guid: 'guid3',
                    name: 'waitEvent1',
                    elementType: 'WAIT_EVENT'
                }
            ]
        };
        it('with state set to undefined & action type set to ADD_WAIT_WITH_WAIT_EVENTS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: ADD_WAIT_WITH_WAIT_EVENTS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to ADD_WAIT_WITH_WAIT_EVENTS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: ADD_WAIT_WITH_WAIT_EVENTS,
                payload
            });
            expect(newElementState).toEqual({ ...oldElements, ...newElements });
        });
    });

    describe('Update Wait with Wait Events', () => {
        const oldElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'WAIT',
                name: 'wait1',
                waitEventReferences: [
                    {
                        waitEventReference: 'guid3'
                    }
                ]
            },
            guid2: {
                guid: 'guid2',
                elementType: 'WAIT_EVENT',
                name: 'waitEvent2'
            }
        };
        const newElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'WAIT',
                name: 'wait2',
                waitEventReferences: [
                    {
                        waitEventReference: 'guid2'
                    }
                ]
            },
            guid2: {
                guid: 'guid2',
                elementType: 'WAIT_EVENT',
                name: 'waitEvent3'
            }
        };

        const payload = {
            canvasElement: {
                guid: 'guid1',
                elementType: 'WAIT',
                name: 'wait2',
                waitEventReferences: [
                    {
                        waitEventReference: 'guid2'
                    }
                ]
            },
            deletedChildElementGuids: [],
            childElements: [
                {
                    guid: 'guid2',
                    elementType: 'WAIT_EVENT',
                    name: 'waitEvent3'
                }
            ]
        };
        it('with state set to undefined & action type set to MODIFY_WAIT_WITH_WAIT_EVENTS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to MODIFY_WAIT_WITH_WAIT_EVENTS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });
    });

    describe('Delete Wait with Wait Event', () => {
        const oldElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'WAIT',
                name: 'wait1',
                waitEventReferences: [
                    {
                        waitEventReference: 'guid4'
                    }
                ]
            }
        };
        const newElements = {
            guid2: {
                guid: 'guid2',
                elementType: 'WAIT',
                name: 'wait2',
                waitEventReferences: [
                    {
                        waitEventReference: 'guid3'
                    }
                ]
            },
            guid3: {
                guid: 'guid3',
                name: 'waitEvent1',
                elementType: 'WAIT_EVENT'
            }
        };

        const payload = {
            canvasElement: {
                guid: 'guid2',
                elementType: 'WAIT',
                name: 'wait2',
                waitEventReferences: [
                    {
                        waitEventReference: 'guid3'
                    }
                ]
            },
            deletedChildElementGuids: ['guid1'],
            childElements: [
                {
                    guid: 'guid3',
                    name: 'waitEvent1',
                    elementType: 'WAIT_EVENT'
                }
            ]
        };
        it('with state set to undefined & action type set to MODIFY_DECISION_WITH_OUTCOMES should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to MODIFY_DECISION_WITH_OUTCOMES should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });
    });

    describe('Add Screen with Fields', () => {
        const oldElements = {};
        const newElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'SCREEN',
                name: 'screen1',
                fieldReferences: ['guid2']
            },
            guid2: {
                guid: 'guid2',
                elementType: 'SCREEN_FIELD',
                name: 'screenField'
            }
        };

        const payload = {
            screen: {
                guid: 'guid1',
                elementType: 'SCREEN',
                name: 'screen1',
                fieldReferences: ['guid2']
            },
            deletedFields: [],
            fields: [
                {
                    guid: 'guid2',
                    elementType: 'SCREEN_FIELD',
                    name: 'screenField'
                }
            ]
        };
        it('with state set to undefined & action type set to ADD_SCREEN_WITH_FIELDS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: ADD_SCREEN_WITH_FIELDS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to ADD_SCREEN_WITH_FIELDS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: ADD_SCREEN_WITH_FIELDS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });
    });

    describe('Update Screen with Fields', () => {
        const oldElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'SCREEN',
                name: 'screen1',
                fieldReferences: ['guid2']
            },
            guid2: {
                guid: 'guid2',
                elementType: 'SCREEN_FIELD',
                name: 'screenField1'
            }
        };
        const newElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'SCREEN',
                name: 'screen2',
                fieldReferences: ['guid2']
            },
            guid2: {
                guid: 'guid2',
                elementType: 'SCREEN_FIELD',
                name: 'screenField2'
            }
        };

        const payload = {
            screen: {
                guid: 'guid1',
                elementType: 'SCREEN',
                name: 'screen2',
                fieldReferences: ['guid2']
            },
            deletedFields: [],
            fields: [
                {
                    guid: 'guid2',
                    elementType: 'SCREEN_FIELD',
                    name: 'screenField2'
                }
            ]
        };
        it('with state set to undefined & action type set to MODIFY_SCREEN_WITH_FIELDS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: MODIFY_SCREEN_WITH_FIELDS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to MODIFY_SCREEN_WITH_FIELDS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: MODIFY_SCREEN_WITH_FIELDS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });
    });

    describe('Delete Fields in Screen', () => {
        const oldElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'SCREEN',
                name: 'screen1',
                fieldReferences: ['guid2']
            },
            guid2: {
                guid: 'guid2',
                elementType: 'SCREEN_FIELD',
                name: 'screenField'
            }
        };
        const newElements = {
            guid1: {
                guid: 'guid1',
                elementType: 'SCREEN',
                name: 'screen1',
                fieldReferences: []
            }
        };

        const payload = {
            screen: {
                guid: 'guid1',
                elementType: 'SCREEN',
                name: 'screen1',
                fieldReferences: []
            },
            deletedFields: [
                {
                    guid: 'guid2',
                    elementType: 'SCREEN_FIELD',
                    name: 'screenField'
                }
            ],
            fields: []
        };
        it('with state set to undefined & action type set to MODIFY_SCREEN_WITH_FIELDS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(undefined, {
                type: MODIFY_SCREEN_WITH_FIELDS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });

        it('with state set to defined & action type set to MODIFY_SCREEN_WITH_FIELDS should return the new element state with the updated state', () => {
            const newElementState = elementReducer(oldElements, {
                type: MODIFY_SCREEN_WITH_FIELDS,
                payload
            });
            expect(newElementState).toEqual(newElements);
        });
    });

    describe('Default', () => {
        it('with state set to undefined & action type set to empty should return an empty object', () => {
            expect(elementReducer(undefined, {})).toEqual({});
        });

        it('with state set to defined & action type set to empty should return an original element state', () => {
            const oldElements = {
                guid1: {
                    guid: 'guid1'
                }
            };

            const newElementState = elementReducer(oldElements, {});
            expect(newElementState).toEqual(oldElements);
        });
    });
});
