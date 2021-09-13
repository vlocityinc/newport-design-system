// @ts-nocheck
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    createDecisionWithOutcomes,
    createDuplicateDecision,
    createOutcome,
    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor,
    createDecisionWithOutcomeReferences,
    createDecisionMetadataObject
} from '../decision';
import { ELEMENT_TYPE, CONNECTOR_TYPE, CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from '../elementFactoryLabels';
import {
    baseCanvasElement,
    duplicateCanvasElementWithChildElements,
    baseChildElement,
    baseCanvasElementsArrayToMap,
    updateChildReferences,
    getDeletedCanvasElementChildren
} from '../base/baseElement';
import {
    baseCanvasElementMetadataObject,
    baseChildElementMetadataObject,
    createConditionMetadataObject
} from '../base/baseMetadata';
import {
    getConnectionProperties,
    addRegularConnectorToAvailableConnections
} from '../commonFactoryUtils/connectionPropertiesUtils';
import { Store } from 'builder_platform_interaction/storeLib';

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn(),
        isExecuteOnlyWhenChangeMatchesConditionsPossible: jest.fn().mockReturnValue(true)
    };
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const newDecisionGuid = 'newDecision';
const existingDecisionGuid = 'existingDecision';
const decisionWithChildrenGuid = 'newDecisionWithChildren';
const existingDecisionWithChildrenGuid = 'existingDecisionWithChildren';
const existingDecisionWithAllTerminatedChildrenGuid = 'existingDecisionWithAllTerminatedChildrenGuid';
const existingDecisionWithNoneTerminatedChildrenGuid = 'existingDecisionWithNoneTerminatedChildrenGuid';
const decisionWithMergingBranchesGuid = 'decisionWithMergingBranchesGuid';
const nestedDecisionWithMergingBranchesGuid = 'nestedDecisionWithMergingBranchesGuid';
const decisionWithElementsOnMergingBranchesGuid = 'decisionWithElementsOnMergingBranchesGuid';

const existingDecision = {
    guid: existingDecisionGuid,
    childReferences: [{ childReference: 'existingOutcome1' }, { childReference: 'existingOutcome2' }]
};
const existingDecisionWithChildren = {
    guid: existingDecisionWithChildrenGuid,
    childReferences: [{ childReference: 'existingOutcome1' }, { childReference: 'existingOutcome2' }],
    children: ['screen1', 'screen2', null]
};
const existingDecisionWithAllTerminatedChildren = {
    guid: existingDecisionWithAllTerminatedChildrenGuid,
    childReferences: [{ childReference: 'outcome1' }],
    children: ['end1', 'end2']
};
const existingDecisionWithNoneTerminatedChildren = {
    guid: existingDecisionWithNoneTerminatedChildrenGuid,
    childReferences: [{ childReference: 'outcome1' }],
    children: ['end3', 'end4']
};
const decisionWithMergingBranches = {
    guid: decisionWithMergingBranchesGuid,
    childReferences: [{ childReference: 'outcome1' }, { childReference: 'outcome2' }, { childReference: 'outcome3' }],
    children: ['end1', null, null, 'end2']
};
const decisionWithElementsOnMergingBranches = {
    guid: decisionWithElementsOnMergingBranchesGuid,
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
    prev: decisionWithMergingBranchesGuid
};
const mergingEnd2 = {
    guid: 'mergingEnd2',
    prev: nestedDecisionWithMergingBranchesGuid
};

getElementByGuid.mockImplementation((guid) => {
    if (guid === newDecisionGuid || guid === decisionWithChildrenGuid) {
        return null;
    } else if (guid === existingDecisionGuid) {
        return existingDecision;
    } else if (guid === existingDecisionWithChildrenGuid) {
        return existingDecisionWithChildren;
    } else if (guid === existingDecisionWithAllTerminatedChildrenGuid) {
        return existingDecisionWithAllTerminatedChildren;
    } else if (guid === existingDecisionWithNoneTerminatedChildrenGuid) {
        return existingDecisionWithNoneTerminatedChildren;
    } else if (guid === decisionWithMergingBranchesGuid || guid === nestedDecisionWithMergingBranchesGuid) {
        return decisionWithMergingBranches;
    } else if (guid === decisionWithElementsOnMergingBranchesGuid) {
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
        guid
    };
});

jest.mock('../base/baseElement');
baseCanvasElement
    .mockImplementation((element) => {
        return Object.assign({}, element);
    })
    .mockName('baseCanvasElementMock');

duplicateCanvasElementWithChildElements
    .mockImplementation(() => {
        const duplicatedElement = {};
        const duplicatedChildElements = {
            duplicatedOutcomeGuid: {
                guid: 'duplicatedOutcomeGuid',
                name: 'duplicatedOutcomeName'
            }
        };
        const updatedChildReferences = [
            {
                childReference: 'duplicatedOutcomeGuid'
            }
        ];
        const availableConnections = [
            {
                type: CONNECTOR_TYPE.REGULAR,
                childReference: 'duplicatedOutcomeGuid'
            },
            {
                type: CONNECTOR_TYPE.DEFAULT
            }
        ];

        return {
            duplicatedElement,
            duplicatedChildElements,
            updatedChildReferences,
            availableConnections
        };
    })
    .mockName('duplicateCanvasElementWithChildElementsMock');
baseChildElement
    .mockImplementation((outcome) => {
        return Object.assign({}, outcome);
    })
    .mockName('baseChildElementMock');
baseCanvasElementsArrayToMap.mockImplementation(jest.requireActual('../base/baseElement').baseCanvasElementsArrayToMap);

getDeletedCanvasElementChildren.mockImplementation(
    jest.requireActual('../base/baseElement').getDeletedCanvasElementChildren
);

updateChildReferences.mockImplementation((childReferences, ruleOrOutcome) => {
    return [
        ...childReferences,
        {
            childReference: ruleOrOutcome.guid
        }
    ];
});

jest.mock('../base/baseMetadata');
baseCanvasElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});
baseChildElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});
createConditionMetadataObject
    .mockImplementation((element) => Object.assign({}, element))
    .mockName('createConditionMetadataObject');

jest.mock('../commonFactoryUtils/connectionPropertiesUtils');
getConnectionProperties.mockImplementation(() => {
    return {
        connectorCount: 1,
        availableConnections: [
            {
                type: CONNECTOR_TYPE.DEFAULT
            }
        ],
        addFaultConnectionForWaitElement: false
    };
});
addRegularConnectorToAvailableConnections.mockImplementation((availableConnections, ruleOrOutcome) => {
    return [
        ...availableConnections,
        {
            type: 'REGULAR',
            childReference: ruleOrOutcome.name
        }
    ];
});

// TODO: https://gus.my.salesforce.com/a07B0000004ihceIAA - add connector tests

describe('decision', () => {
    describe('createDecisionWithOutcomes', () => {
        it('includes the return value of a call to baseCanvasElement', () => {
            createDecisionWithOutcomes(existingDecision);

            expect(baseCanvasElement).toHaveBeenCalledWith(existingDecision);
        });

        it('element type is DECISION', () => {
            const decision = createDecisionWithOutcomes();

            expect(decision.elementType).toEqual(ELEMENT_TYPE.DECISION);
        });

        describe('defaultConnectorLabel', () => {
            it('defaults to LABELS.emptyDefaultOutcomeLabel', () => {
                const decision = createDecisionWithOutcomes();

                expect(decision.defaultConnectorLabel).toEqual(LABELS.emptyDefaultOutcomeLabel);
            });
            it('is used if passed in', () => {
                const defaultConnectorLabel = 'some label';

                const decision = createDecisionWithOutcomes({
                    defaultConnectorLabel
                });

                expect(decision.defaultConnectorLabel).toEqual(defaultConnectorLabel);
            });
        });
        describe('outcomes', () => {
            it('includes a single default outcome if no outcome references present', () => {
                const outcome = {
                    foo: 'bar'
                };
                baseChildElement.mockReturnValueOnce(outcome);
                const decision = createDecisionWithOutcomes();

                expect(decision.outcomes).toHaveLength(1);
                expect(decision.outcomes[0]).toEqual(outcome);
            });

            it('includes outcomes for all outcome references present', () => {
                const childReferences = [{ childReference: 'a' }, { childReference: 'b' }, { childReference: 'c' }];

                const decision = createDecisionWithOutcomes({
                    childReferences
                });

                expect(decision.outcomes).toHaveLength(3);
                expect(decision.outcomes[0].guid).toEqual(childReferences[0].childReference);
                expect(decision.outcomes[1].guid).toEqual(childReferences[1].childReference);
                expect(decision.outcomes[2].guid).toEqual(childReferences[2].childReference);
            });
        });
    });

    describe('createDuplicateDecision function', () => {
        const { duplicatedElement, duplicatedChildElements } = createDuplicateDecision(
            {},
            'duplicatedGuid',
            'duplicatedName',
            {},
            {}
        );

        it('duplicatedElement has updated outcomeReferences', () => {
            expect(duplicatedElement.childReferences).toEqual([
                {
                    childReference: 'duplicatedOutcomeGuid'
                }
            ]);
        });
        it('duplicatedElement has updated availableConnections', () => {
            expect(duplicatedElement.availableConnections).toEqual([
                {
                    type: CONNECTOR_TYPE.REGULAR,
                    childReference: 'duplicatedOutcomeGuid'
                },
                {
                    type: CONNECTOR_TYPE.DEFAULT
                }
            ]);
        });
        it('duplicatedElement has updated defaultConnectorLabel', () => {
            expect(duplicatedElement.defaultConnectorLabel).toEqual(LABELS.emptyDefaultOutcomeLabel);
        });
        it('returns correct duplicatedChildElements', () => {
            expect(duplicatedChildElements).toEqual({
                duplicatedOutcomeGuid: {
                    guid: 'duplicatedOutcomeGuid',
                    name: 'duplicatedOutcomeName'
                }
            });
        });
    });

    describe('createOutcome', () => {
        beforeEach(() => {
            baseChildElement.mockClear();
        });
        it('calls baseChildElement with elementType = OUTCOME', () => {
            createOutcome();
            expect(baseChildElement.mock.calls[0][1]).toEqual(ELEMENT_TYPE.OUTCOME);
        });

        it('calls baseChildElement with an empty outcome by default', () => {
            createOutcome();
            expect(baseChildElement.mock.calls[0][0]).toEqual({});
        });

        it('uses existing values when passed in an outcome object', () => {
            const mockCondition1 = { operator: 'foo' };
            const mockCondition2 = { operator: 'bar' };
            const mockOutcome = {
                conditionLogic: CONDITION_LOGIC.OR,
                conditions: [mockCondition1, mockCondition2],
                dataType: 'sfdc'
            };

            createOutcome(mockOutcome);

            expect(baseChildElement.mock.calls[0][0]).toEqual(mockOutcome);
        });
    });

    describe('createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor', () => {
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
            guid: 'existingDecisionWithAllTerminatedChildrenGuid',
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
            guid: 'existingDecisionWithNoneTerminatedChildrenGuid',
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

        let decisionFromPropertyEditor;
        // let decisionFromPropertyEditorWithChildren;
        // let existingDecisionFromPropertyEditorWithChildren;
        // let existingDecisionFromPropertyEditorWithAllTerminatedChildren;
        // let existingDecisionFromPropertyEditorWithThreeOutcomes;
        // let existingDecisionFromPropertyEditorWithNoneTerminatedChildren;

        beforeEach(() => {
            decisionFromPropertyEditor = {
                guid: newDecisionGuid,
                outcomes: [
                    {
                        guid: 'outcome1'
                    }
                ]
            };

            // decisionFromPropertyEditorWithChildren = {
            //     guid: decisionWithChildrenGuid,
            //     outcomes: [
            //         {
            //             guid: 'outcome1'
            //         }
            //     ],
            //     children: null
            // };

            // existingDecisionFromPropertyEditorWithChildren = {
            //     guid: existingDecisionWithChildrenGuid,
            //     outcomes: [
            //         {
            //             guid: 'existingOutcome1'
            //         }
            //     ],
            //     children: ['screen1', 'screen2', null]
            // };

            // existingDecisionFromPropertyEditorWithAllTerminatedChildren = {
            //     guid: existingDecisionWithAllTerminatedChildrenGuid,
            //     outcomes: [
            //         {
            //             guid: 'outcome1'
            //         },
            //         {
            //             guid: 'outcome2'
            //         }
            //     ],
            //     children: ['end1', 'end2']
            // };

            // existingDecisionFromPropertyEditorWithNoneTerminatedChildren = {
            //     guid: existingDecisionWithNoneTerminatedChildrenGuid,
            //     outcomes: [
            //         {
            //             guid: 'outcome1'
            //         },
            //         {
            //             guid: 'outcome2'
            //         }
            //     ],
            //     children: ['end3', 'end4']
            // };

            // existingDecisionFromPropertyEditorWithThreeOutcomes = {
            //     guid: existingDecisionWithAllTerminatedChildrenGuid,
            //     outcomes: [
            //         {
            //             guid: 'outcome1'
            //         },
            //         {
            //             guid: 'outcome2'
            //         },
            //         {
            //             guid: 'outcome3'
            //         }
            //     ],
            //     children: ['end1', 'end2']
            // };
        });

        // it('sets shouldAddEndElement to true when all existing children are on the terminating branch', () => {
        //     shouldUseAlc(true);
        //     const { shouldAddEndElement } = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(
        //         existingDecisionFromPropertyEditorWithAllTerminatedChildren
        //     );
        //     expect(shouldAddEndElement).toBeTruthy();
        // });

        // it('sets shouldAddEndElement to false when not all existing children are on the terminating branch', () => {
        //     shouldUseAlc(true);
        //     const { shouldAddEndElement } = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(
        //         existingDecisionFromPropertyEditorWithNoneTerminatedChildren
        //     );
        //     expect(shouldAddEndElement).toBeFalsy();
        // });

        // it('sets newEndElementIdx to the right index to add end element when all existing children are on the terminating branch', () => {
        //     shouldUseAlc(true);
        //     const { newEndElementIdx } = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(
        //         existingDecisionFromPropertyEditorWithAllTerminatedChildren
        //     );
        //     expect(newEndElementIdx).toEqual(1);
        // });

        // it('sets newEndElementIdx to undefined, shouldAddEndElement as false when adding multiple outcomes from property editor and all existing children are on the terminating branch', () => {
        //     shouldUseAlc(true);
        //     const {
        //         shouldAddEndElement,
        //         newEndElementIdx
        //     } = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(
        //         existingDecisionFromPropertyEditorWithThreeOutcomes
        //     );
        //     expect.assertions(2);
        //     expect(newEndElementIdx).toBeUndefined();
        //     expect(shouldAddEndElement).toBeTruthy();
        // });

        it('includes the return value of a call to baseCanvasElement', () => {
            createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

            expect(baseCanvasElement).toHaveBeenCalledWith(decisionFromPropertyEditor);
        });

        it('element type is DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES', () => {
            const result =
                createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

            expect(result.elementType).toEqual(ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES);
        });

        it('decision element type is DECISION', () => {
            const result =
                createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

            expect(result.canvasElement.elementType).toEqual(ELEMENT_TYPE.DECISION);
        });

        describe('defaultConnectorLabel', () => {
            it('defaults to LABELS.emptyDefaultOutcomeLabel', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

                expect(result.canvasElement.defaultConnectorLabel).toEqual(LABELS.emptyDefaultOutcomeLabel);
            });
            it('is used if passed in', () => {
                const defaultConnectorLabel = 'some label';

                decisionFromPropertyEditor.defaultConnectorLabel = defaultConnectorLabel;
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

                expect(result.canvasElement.defaultConnectorLabel).toEqual(defaultConnectorLabel);
            });
        });

        describe('connection properties of a decision', () => {
            it('result has availableConnections', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);
                expect(result.canvasElement.availableConnections).toHaveLength(1);
                expect(result.canvasElement.availableConnections[0]).toEqual({
                    type: CONNECTOR_TYPE.DEFAULT
                });
            });

            it('has connectorCount', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);
                expect(result.canvasElement.connectorCount).toEqual(1);
            });

            it('decision has the right maxConnections', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);
                expect(result.canvasElement.maxConnections).toEqual(2);
            });
        });

        describe('new/modified outcomes', () => {
            let outcomes;

            beforeEach(() => {
                outcomes = [{ guid: 'a' }, { guid: 'b' }, { guid: 'c' }];

                decisionFromPropertyEditor.outcomes = outcomes;
            });

            it('decision includes outcome references for all outcomes present', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

                expect(result.canvasElement.childReferences).toHaveLength(3);
                expect(result.canvasElement.childReferences[0].childReference).toEqual(outcomes[0].guid);
                expect(result.canvasElement.childReferences[1].childReference).toEqual(outcomes[1].guid);
                expect(result.canvasElement.childReferences[2].childReference).toEqual(outcomes[2].guid);
            });

            it('includes outcomes for all outcomes present', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

                expect(result.childElements).toHaveLength(3);
                expect(result.childElements[0].guid).toEqual(outcomes[0].guid);
                expect(result.childElements[1].guid).toEqual(outcomes[1].guid);
                expect(result.childElements[2].guid).toEqual(outcomes[2].guid);
            });

            it('has the right maxConnections', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

                expect(result.canvasElement.maxConnections).toEqual(4);
            });
        });

        describe('deleted outcomes', () => {
            const screen1 = {
                guid: 'screen1',
                name: 'screen1',
                elementType: ELEMENT_TYPE.SCREEN
            };

            const screen2 = {
                guid: 'screen2',
                name: 'screen2',
                elementType: ELEMENT_TYPE.SCREEN
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

            beforeEach(() => {
                decisionFromPropertyEditor = {
                    guid: existingDecisionGuid,
                    outcomes: [
                        {
                            guid: 'outcome1'
                        }
                    ]
                };
            });

            it('decision does not include outcome references for deleted outcomes', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

                expect(result.canvasElement.childReferences).toHaveLength(1);
                expect(result.canvasElement.childReferences[0].childReference).toEqual(
                    decisionFromPropertyEditor.outcomes[0].guid
                );
            });

            // it('includes all deleted outcomes', () => {
            //     const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(
            //         decisionFromPropertyEditor
            //     );

            //     expect(result.deletedChildElementGuids).toHaveLength(2);
            //     expect(result.deletedChildElementGuids[0]).toEqual(existingDecision.childReferences[0].childReference);
            //     expect(result.deletedChildElementGuids[1]).toEqual(existingDecision.childReferences[1].childReference);
            // });

            it('has the right maxConnections', () => {
                const result =
                    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decisionFromPropertyEditor);

                expect(result.canvasElement.maxConnections).toEqual(2);
            });

            // it('updates children property for existing decision with children', () => {
            //     shouldUseAlc(true);
            //     const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(
            //         existingDecisionFromPropertyEditorWithChildren
            //     );

            //     expect(result.canvasElement.children).toEqual(['screen1', null]);
            // });

            // it('deletedBranchHeadGuids should include "screen2" for existing decision with children', () => {
            //     shouldUseAlc(true);
            //     const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(
            //         existingDecisionFromPropertyEditorWithChildren
            //     );

            //     expect(result.deletedBranchHeadGuids).toEqual(['screen2']);
            // });

            // describe('deleted outcomes are on the merging branches', () => {
            //     let decision;
            //     beforeEach(() => {
            //         decision = {
            //             guid: decisionWithMergingBranchesGuid,
            //             outcomes: [
            //                 {
            //                     guid: 'outcome1'
            //                 }
            //             ],
            //             children: ['end1', null, null, 'end2'],
            //             next: 'mergingEnd1'
            //         };
            //     });

            //     const decisionFromStore = {
            //         guid: decisionWithMergingBranchesGuid,
            //         outcomes: [
            //             {
            //                 guid: 'outcome1'
            //             },
            //             {
            //                 guid: 'outcome2'
            //             },
            //             {
            //                 guid: 'outcome3'
            //             }
            //         ],
            //         children: ['end1', null, null, 'end2'],
            //         next: 'mergingEnd1'
            //     };

            //     const mockStore = {
            //         decisionFromStore,
            //         outcome1,
            //         outcome2,
            //         outcome3,
            //         end1,
            //         end2,
            //         mergingEnd1
            //     };

            //     beforeAll(() => {
            //         Store.setMockState({
            //             elements: mockStore
            //         });
            //     });
            //     afterAll(() => {
            //         Store.resetStore();
            //     });

            //     it('deletedBranchHeadGuids should include decisions next', () => {
            //         shouldUseAlc(true);
            //         const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decision);
            //         expect(result.deletedBranchHeadGuids).toEqual(['mergingEnd1']);
            //     });

            //     it('new decisions next should be null and shouldMarkBranchHeadAsTerminal should be true', () => {
            //         shouldUseAlc(true);
            //         const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decision);
            //         expect.assertions(2);
            //         expect(result.canvasElement.next).toBeNull();
            //         expect(result.shouldMarkBranchHeadAsTerminal).toBeTruthy();
            //     });
            // });

            // describe('deleted outcomes are on the nested merging branches', () => {
            //     let decision;
            //     beforeEach(() => {
            //         decision = {
            //             guid: nestedDecisionWithMergingBranchesGuid,
            //             outcomes: [
            //                 {
            //                     guid: 'outcome1'
            //                 }
            //             ],
            //             children: ['end1', null, null, 'end2'],
            //             next: null
            //         };
            //     });

            //     const nestedDecisionFromStore = {
            //         guid: nestedDecisionWithMergingBranchesGuid,
            //         outcomes: [
            //             {
            //                 guid: 'outcome1'
            //             },
            //             {
            //                 guid: 'outcome2'
            //             },
            //             {
            //                 guid: 'outcome3'
            //             }
            //         ],
            //         children: ['end1', null, null, 'end2'],
            //         next: 'null'
            //     };

            //     const decisionFromStore = {
            //         guid: 'decisionGuid',
            //         outcomes: [
            //             {
            //                 guid: 'outcome1'
            //             }
            //         ],
            //         children: [nestedDecisionWithMergingBranchesGuid, null],
            //         next: 'end3'
            //     };

            //     const mockStore = {
            //         decisionFromStore,
            //         nestedDecisionFromStore,
            //         outcome1,
            //         outcome2,
            //         outcome3,
            //         end1,
            //         end2,
            //         end3,
            //         mergingEnd2
            //     };

            //     beforeAll(() => {
            //         Store.setMockState({
            //             elements: mockStore
            //         });
            //     });
            //     afterAll(() => {
            //         Store.resetStore();
            //     });

            //     it('deletedBranchHeadGuids should be empty', () => {
            //         shouldUseAlc(true);
            //         const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decision);
            //         expect(result.deletedBranchHeadGuids).toEqual([]);
            //     });

            //     it('new decisions next should be null and shouldMarkBranchHeadAsTerminal should be true', () => {
            //         shouldUseAlc(true);
            //         const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decision);
            //         expect.assertions(2);
            //         expect(result.canvasElement.next).toBeNull();
            //         expect(result.shouldMarkBranchHeadAsTerminal).toBeTruthy();
            //     });
            // });

            // describe('deleted outcomes are on the merging branches and there are elements before and after merging', () => {
            //     let decision;
            //     beforeEach(() => {
            //         decision = {
            //             guid: decisionWithElementsOnMergingBranchesGuid,
            //             outcomes: [
            //                 {
            //                     guid: 'outcome1'
            //                 }
            //             ],
            //             children: ['end1', 'screen3', null, 'end2'],
            //             next: 'screen4'
            //         };
            //     });

            //     const screen3 = {
            //         guid: 'screen3',
            //         name: 'screen3',
            //         elementType: ELEMENT_TYPE.SCREEN,
            //         prev: null,
            //         next: null,
            //         parent: decisionWithElementsOnMergingBranchesGuid,
            //         childIndex: 1,
            //         isTerminal: false
            //     };

            //     const screen4 = {
            //         guid: 'screen4',
            //         name: 'screen4',
            //         elementType: ELEMENT_TYPE.SCREEN,
            //         prev: decisionWithElementsOnMergingBranchesGuid,
            //         next: 'mergingEnd1',
            //         childIndex: 1,
            //         isTerminal: false
            //     };

            //     const decisionFromStore = {
            //         guid: decisionWithElementsOnMergingBranchesGuid,
            //         outcomes: [
            //             {
            //                 guid: 'outcome1'
            //             },
            //             {
            //                 guid: 'outcome2'
            //             },
            //             {
            //                 guid: 'outcome3'
            //             }
            //         ],
            //         children: ['end1', 'screen3', null, 'end2'],
            //         next: 'screen4'
            //     };

            //     const mockStore = {
            //         decisionFromStore,
            //         outcome1,
            //         outcome2,
            //         outcome3,
            //         screen3,
            //         screen4,
            //         end1,
            //         end2,
            //         mergingEnd1
            //     };

            //     beforeAll(() => {
            //         Store.setMockState({
            //             elements: mockStore
            //         });
            //     });
            //     afterAll(() => {
            //         Store.resetStore();
            //     });

            //     it('deletedBranchHeadGuids should include elements before and after merging', () => {
            //         shouldUseAlc(true);
            //         const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decision);
            //         expect(result.deletedBranchHeadGuids).toEqual(['screen3', 'screen4']);
            //     });

            //     it('new decisions next should be null and shouldMarkBranchHeadAsTerminal should be true', () => {
            //         shouldUseAlc(true);
            //         const result = createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decision);
            //         expect.assertions(2);
            //         expect(result.canvasElement.next).toBeNull();
            //         expect(result.shouldMarkBranchHeadAsTerminal).toBeTruthy();
            //     });
            // });
        });
    });

    describe('createDecisionWithOutcomeReferences', () => {
        let decisionFromFlow;

        beforeEach(() => {
            decisionFromFlow = {
                guid: existingDecisionGuid,
                rules: [
                    {
                        name: 'outcome1',
                        guid: 'outcome1'
                    },
                    {
                        name: 'outcome2',
                        guid: 'outcome2'
                    },
                    {
                        name: 'outcome3',
                        guid: 'outcome3'
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElement', () => {
            createDecisionWithOutcomeReferences(decisionFromFlow);

            expect(baseCanvasElement).toHaveBeenCalledWith(decisionFromFlow);
        });

        it('element type is DECISION', () => {
            const result = createDecisionWithOutcomeReferences(decisionFromFlow);

            const decision = result.elements[existingDecisionGuid];
            expect(decision.elementType).toEqual(ELEMENT_TYPE.DECISION);
        });

        describe('available connections', () => {
            it('available connections array is present', () => {
                const result = createDecisionWithOutcomeReferences(decisionFromFlow);

                const decision = result.elements[existingDecisionGuid];

                expect(decision.availableConnections).not.toBe(null);
            });
            it('available connections has default connection when no default connector', () => {
                const result = createDecisionWithOutcomeReferences(decisionFromFlow);

                const availableConnections = result.elements[existingDecisionGuid].availableConnections;
                expect(availableConnections[availableConnections.length - 1].type).toEqual(CONNECTOR_TYPE.DEFAULT);
            });
        });

        describe('defaultConnectorLabel', () => {
            it('defaults to LABELS.emptyDefaultOutcomeLabel', () => {
                const result = createDecisionWithOutcomeReferences(decisionFromFlow);
                const decision = result.elements[existingDecisionGuid];

                expect(decision.defaultConnectorLabel).toEqual(LABELS.emptyDefaultOutcomeLabel);
            });
            it('is used if passed in', () => {
                const defaultConnectorLabel = 'some label';

                decisionFromFlow.defaultConnectorLabel = defaultConnectorLabel;

                const result = createDecisionWithOutcomeReferences(decisionFromFlow);
                const decision = result.elements[existingDecisionGuid];

                expect(decision.defaultConnectorLabel).toEqual(defaultConnectorLabel);
            });
        });
        describe('outcomes', () => {
            it('decision includes outcomes for all rules present', () => {
                const result = createDecisionWithOutcomeReferences(decisionFromFlow);
                const decision = result.elements[existingDecisionGuid];

                expect(decision.childReferences).toHaveLength(3);
                expect(decision.childReferences[0].childReference).toEqual(decisionFromFlow.rules[0].guid);
                expect(decision.childReferences[1].childReference).toEqual(decisionFromFlow.rules[1].guid);
                expect(decision.childReferences[2].childReference).toEqual(decisionFromFlow.rules[2].guid);
            });

            it('are included in element map for all rules present', () => {
                const result = createDecisionWithOutcomeReferences(decisionFromFlow);

                expect(result.elements[decisionFromFlow.rules[0].guid]).toMatchObject(decisionFromFlow.rules[0]);
                expect(result.elements[decisionFromFlow.rules[1].guid]).toMatchObject(decisionFromFlow.rules[1]);
                expect(result.elements[decisionFromFlow.rules[2].guid]).toMatchObject(decisionFromFlow.rules[2]);
            });
        });
    });
    describe('createDecisionMetadataObject', () => {
        let decisionFromStore;

        beforeEach(() => {
            decisionFromStore = {
                guid: existingDecisionGuid,
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
        });

        it('includes the return value of a call to baseCanvasElementMetadataObject', () => {
            createDecisionMetadataObject(decisionFromStore);

            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(decisionFromStore, {});
        });

        describe('outcomes', () => {
            it('decision includes rules for all outcome references present', () => {
                const decision = createDecisionMetadataObject(decisionFromStore);

                expect(decision.rules).toHaveLength(3);
                expect(decision.rules[0].guid).toEqual(decisionFromStore.childReferences[0].childReference);
                expect(decision.rules[1].guid).toEqual(decisionFromStore.childReferences[1].childReference);
                expect(decision.rules[2].guid).toEqual(decisionFromStore.childReferences[2].childReference);
            });

            it('calls createConditionMetadataObject for each condition given', () => {
                const mockCondition = { leftHandSide: 'foo' };
                const mockOutcome = { conditions: [mockCondition] };
                getElementByGuid.mockReturnValueOnce(mockOutcome);
                const decision = createDecisionMetadataObject(decisionFromStore);
                expect(createConditionMetadataObject).toHaveBeenCalledTimes(1);
                expect(decision.rules[0].conditions).toHaveLength(1);
                expect(decision.rules[0].conditions[0]).toEqual(mockCondition);
                expect(decision.rules[0].conditions[0]).toBe(createConditionMetadataObject.mock.results[0].value);
            });
        });

        describe('defaultConnectorLabel', () => {
            it('defaults to LABELS.emptyDefaultOutcomeLabel', () => {
                const decision = createDecisionMetadataObject(decisionFromStore);

                expect(decision.defaultConnectorLabel).toEqual(LABELS.emptyDefaultOutcomeLabel);
            });
            it('is used if passed in', () => {
                const defaultConnectorLabel = 'some label';
                decisionFromStore.defaultConnectorLabel = defaultConnectorLabel;

                const decision = createDecisionMetadataObject(decisionFromStore);

                expect(decision.defaultConnectorLabel).toEqual(defaultConnectorLabel);
            });
        });
    });
});
