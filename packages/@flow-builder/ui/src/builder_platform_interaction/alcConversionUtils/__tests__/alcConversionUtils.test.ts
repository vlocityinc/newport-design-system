// @ts-nocheck
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { createNewConnector } from 'builder_platform_interaction/connectorUtils';

import sanity from './alcUiModels/sanity';
import decisionWithGotoOnHead from './alcUiModels/decision-with-goto-on-head';
import decisionWithGotoOnDefaultHead from './alcUiModels/decision-with-goto-on-default-head';
import decisionWithGotoOnLeftBranchNext from './alcUiModels/decision-with-goto-on-left-branch-next';
import decisionWithGotoOnNext from './alcUiModels/decision-with-goto-on-next';
import decisionWithGotoOnNextAndNestedLeftDecision from './alcUiModels/decision-with-goto-on-next-and-nested-left-decision';
import oneScreen from './alcUiModels/one-screen';
import oneElementWithFault from './alcUiModels/one-element-with-fault';
import elementWithGotoOnFault from './alcUiModels/element-with-goto-on-fault';
import decisionOneChildOnEachBranchNextIsNotEnd from './alcUiModels/decision-one-child-on-each-branch-next-is-not-end';
import decisionEmptyWithScreenNext from './alcUiModels/decision-with-empty-with-screen-next';
import emptyDecisionWithEndNext from './alcUiModels/decision-empty-with-end-next';
import decisionWithTwoEndedBranches from './alcUiModels/decision-with-two-ended-branches';
import decisionWithNestedDecisionWithTwoEndedBranches from './alcUiModels/decision-with-nested-decision-with-two-ended-branches';
import emptyLoopWithEndNext from './alcUiModels/loop-empty-with-end-next';
import loopWithForEachScreenAndAfterLastScreen from './alcUiModels/loop-with-for-each-screen-and-after-last-screen';
import loopWithForEachScreenAndAfterLastEnd from './alcUiModels/loop-with-for-each-screen-and-after-last-end';
import loopWithNestedLoop from './alcUiModels/loop-with-nested-loop';
import loopWithNestedEmptyDecision from './alcUiModels/loop-with-nested-empty-decision';
import loopEmptyWithGotoAfterLast from './alcUiModels/loop-empty-with-goto-after-last';
import decisionWithChildOnNonDefaultOutcome from './alcUiModels/decision-with-child-on-non-default-outcome';
import decisionWithChildOnNonDefaultOutcomeNextIsEnd from './alcUiModels/decision-with-child-on-non-default-outcome-next-is-end';
import decisionWithNestedLeftDecision from './alcUiModels/decision-with-nested-left-decision';
import decisionWithNestedRightDecision from './alcUiModels/decision-with-nested-right-decision';
import decisionWithEmptyNestedDecision from './alcUiModels/decision-with-empty-nested-decision';
import decisionWithDecisionNext from './alcUiModels/decision-with-decision-next';
import updatedElementConfig from './alcUiModels/updated-element-config';
import testCaseW8010546 from './alcUiModels/test-case-W-8010546';
import oneAssignmentInScheduledPath from './alcUiModels/one-assignment-in-scheduled-path';

import startWithOnlyImmediate from './alcUiModels/start-with-only-immediate';
import startWithOnlyScheduledPaths from './alcUiModels/start-with-only-scheduled-paths';
import startWithImmPlusScheduledPath from './alcUiModels/start-with-imm-plus-scheduled-path';
import startWithMultipleScheduledPaths from './alcUiModels/start-with-multiple-scheduled-paths';
import startWithMergingPaths from './alcUiModels/start-with-merging-paths';
import startWithGotoOnImmediatePath from './alcUiModels/start-with-goto-on-immediate-path';

import ffcSanity from './ffcUiModels/sanity.json';
import ffcElementWithFault from './ffcUiModels/element-with-fault.json';
import ffcElementWithFaultWithDecisionHead from './ffcUiModels/element-with-fault-with-decision-head.json';
import ffcStartWithOnlyImmediate from './ffcUiModels/start-with-only-scheduled-path.json';
import ffcStartWithOnlyScheduledPath from './ffcUiModels/start-with-only-scheduled-path.json';
import ffcStartWithSingleScheduledPath from './ffcUiModels/start-with-single-scheduled-path.json';
import ffcStartWithMultipleScheduledPath from './ffcUiModels/start-with-multiple-scheduled-path.json';
import ffcStartWithMergingPaths from './ffcUiModels/start-with-merging-path.json';
import ffcDecisionEmpty from './ffcUiModels/decision-empty.json';
import ffcDecisionWithNestedLeftDecision from './ffcUiModels/decision-with-nested-left-decision.json';
import ffcDecisionWithScreenOnEachBranchAndScreenMerge from './ffcUiModels/decision-with-screen-on-each-branch-and-screen-merge.json';
import ffcDecisionWithDecisionNext from './ffcUiModels/decision-with-decision-next.json';
import ffcDecisionWithNestedEmptyDecision from './ffcUiModels/decision-with-nested-empty-decision.json';
import ffcLoopWithForEachAndAfterLast from './ffcUiModels/loop-with-for-each-and-after-last.json';
import ffcLoopEmptyWithAfterLast from './ffcUiModels/loop-empty-with-after-last.json';
import ffcLoopWithEndPathWithin from './ffcUiModels/loop-with-end-path-within.json';
import ffcLoopEmpty from './ffcUiModels/loop-empty.json';
import ffcDecisionWithNestedDecisionAndJoinScreen from './ffcUiModels/decision-with-nested-decision-and-join-screen.json';
import ffcComplex1 from './ffcUiModels/complex1.json';
import ffcComplex2 from './ffcUiModels/complex2.json';
import ffcComplex3 from './ffcUiModels/complex3.json';
import ffcComplex4 from './ffcUiModels/complex4.json';
import ffcComplex5 from './ffcUiModels/complex5.json';
import ffcComplex6 from './ffcUiModels/complex6.json';
import ffcDecisionWithMultipleOutcomes from './ffcUiModels/decision-with-multiple-outcomes.json';
import ffcWaitWithThreeOutcomesAndFault from './ffcUiModels/wait-with-three-outcomes-and-fault.json';
import ffcUpdatedElementConfig from './ffcUiModels/updated-element-config.json';

import ffcTestCase01 from './ffcUiModels/testCase01.json';
import ffcTestCase02 from './ffcUiModels/testCase02.json';
import ffcTestCase03 from './ffcUiModels/testCase03.json';
import ffcTestCase04 from './ffcUiModels/testCase04.json';
import ffcTestCase05 from './ffcUiModels/testCase05.json';
import ffcTestCase06 from './ffcUiModels/testCase06.json';
import ffcTestCase07 from './ffcUiModels/testCase07.json';
import ffcTestCase08 from './ffcUiModels/testCase08.json';
import ffcTestCase09 from './ffcUiModels/testCase09.json';
import ffcTestCase10 from './ffcUiModels/testCase10.json';
import ffcTestCase11 from './ffcUiModels/testCase11.json';
import ffcTestCase12 from './ffcUiModels/testCase12.json';

import ffcLoopWithNestedLoopBack from './ffcUiModels/loop-with-nested-branch-that-loops-back.json';
import ffcLoopWithBackEdge from './ffcUiModels/loop-with-back-edge.json';
import ffcLoopWithCrossAsGotoEdge from './ffcUiModels/loop-with-cross-as-goto-edge.json';
import ffcLoopWithFowardAsGotoEdge from './ffcUiModels/loop-with-forward-as-goto-edge.json';
import ffcNextAndFaultSameElement from './ffcUiModels/element-with-next-and-fault-pointing-to-same-element.json';
import ffcLoopForEachAndEndSameElement from './ffcUiModels/loop-foreach-and-end-same-element.json';
import ffcDecisionWithGoToOnHead from './ffcUiModels/decision-with-goto-on-head.json';
import ffcDecisionWithGoToOnDefaultHead from './ffcUiModels/decision-with-goto-on-default-head.json';
import ffcDecisionWithGoToOnBranchNext from './ffcUiModels/decision-with-goto-on-branch-next.json';
import ffcDecisionWithGoToInNestedBranch from './ffcUiModels/decision-with-goto-in-nested-branch.json';
import ffcElementWithGoToOnFault from './ffcUiModels/element-with-goto-on-fault.json';
import ffcLoopWithGoToAfterLast from './ffcUiModels/loop-with-goto-after-last.json';
import ffcStartWithGoToOnImmediateHead from './ffcUiModels/start-with-goto-on-immediate-head.json';
import ffcStartWithGoToOnScheduledHead from './ffcUiModels/start-with-goto-on-scheduled-head.json';
import ffcGoToOnCrossEdgeFault from './ffcUiModels/goto-on-cross-edge-fault.json';
import ffcComplexNestedDecisionsWithGoTos from './ffcUiModels/complex-decision-with-mutiple-nested-decisions-and-gotos.json';
import ffcDecisionsWithGoToInNestedDecision from './ffcUiModels/decision-with-goto-in-nested-decision.json';
import ffcOgDecisionWithGoToOnHead from './ffcUiModels/original-decision-with-goto-on-head.json';
import ffcOgDecisionWithGoToOnDefaultHead from './ffcUiModels/original-decision-with-goto-on-default-head.json';
import ffcOgDecisionWithGoToOnBranchNext from './ffcUiModels/original-decision-with-goto-on-branch-next.json';
import ffcOgDecisionWithGoToInNestedBranch from './ffcUiModels/original-decision-with-goto-in-nested-branch.json';
import ffcOgElementWithGoToOnFault from './ffcUiModels/original-element-with-goto-on-fault.json';
import ffcOgLoopWithGoToAfterLast from './ffcUiModels/original-loop-with-goto-after-last.json';
import ffcOgGoToOnCrossEdgeFault from './ffcUiModels/original-goto-on-cross-edge-fault.json';
import ffcOgComplexNestedDecisionsWithGoTos from './ffcUiModels/original-complex-decision-with-mutiple-nested-decisions-and-gotos.json';
import ffcOgDecisionsWithGoToInNestedDecision from './ffcUiModels/original-decision-with-goto-in-nested-decision.json';

import {
    convertToFreeFormCanvas,
    convertToAutoLayoutCanvas,
    canConvertToAutoLayoutCanvas,
    removeEndElementsAndConnectorsTransform,
    addEndElementsAndConnectorsTransform,
    consolidateEndConnectors,
    deepEquals
} from '../alcConversionUtils';
import {
    ELEMENT_TYPE,
    CONNECTOR_TYPE,
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_SAVE_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { shouldSupportScheduledPaths } from 'builder_platform_interaction/elementFactory';

const CANVAS_WIDTH = 1024;
const startElementCoords = [CANVAS_WIDTH / 2 - 24, 48];

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

jest.mock('builder_platform_interaction/elementFactory', () => {
    const flowMetadata = require('builder_platform_interaction/flowMetadata');
    const { findStartYOffset } = jest.requireActual('builder_platform_interaction/elementFactory');
    const { NodeType } = require('builder_platform_interaction/autoLayoutCanvas');

    return {
        createEndElement: (props = {}) => {
            const { prev, parent, childIndex } = props;
            let guid;
            let extraProps;

            if (prev != null) {
                guid = `end-element-guid (${prev})`;
                extraProps = { guid, prev };
            } else {
                guid = `end-element-guid (${parent}:${childIndex})`;
                extraProps = { guid, parent, childIndex };
            }

            return Object.assign(
                {
                    guid: `end-element-guid (${prev})`,
                    elementType: flowMetadata.ELEMENT_TYPE.END_ELEMENT,
                    prev,
                    next: null,
                    isCanvasElement: true,
                    nodeType: NodeType.END
                },
                extraProps
            );
        },
        findStartYOffset,
        shouldSupportScheduledPaths: jest.fn()
    };
});

jest.mock('builder_platform_interaction/connectorUtils', () => {
    return {
        createNewConnector: (elements, source, target, type = 'REGULAR', isGoTo) => {
            const connector = {
                guid: `${source} -> ${target}`,
                source,
                target,
                label: type !== 'REGULAR' ? type : null,
                type,
                config: {
                    isSelected: false
                }
            };
            if (isGoTo) {
                connector.isGoTo = true;
            }

            return connector;
        }
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = require('builder_platform_interaction_mocks/storeLib');

    return {
        generateGuid: jest.fn().mockImplementation((id, i) => {
            i = i == null ? '' : `:${i}`;
            return `end-element-guid (${id}:${i})`;
        }),
        deepCopy: actual.deepCopy
    };
});

shouldSupportScheduledPaths.mockImplementation((startElement) => {
    return startElement.guid === 'scheduled-path-start-element-guid';
});

function sortCanvasElementsAndConnectors({ elements, canvasElements, connectors }) {
    canvasElements.sort();
    connectors = connectors
        .sort((a, b) => b.guid.localeCompare(a.guid))
        .map((connector) => {
            if (connector.childSource == null) {
                delete connector.childSource;
            }
            return connector;
        });
    return { elements, canvasElements, connectors };
}

function addOutcomes(elements, ...guids) {
    guids.forEach((guid) => {
        elements[guid] = { guid, config: {}, elementType: 'OUTCOME' };
    });
}

function newCanvasElement(guid) {
    return {
        guid,
        isCanvasElement: true,
        config: { isSelected: false },
        connectorCount: 0,
        maxConnections: 1
    };
}

function storeStateFromConnectors(connectors) {
    const elements = {};

    connectors.forEach((connector) => {
        const { source, target, type } = connector;
        elements[source] = elements[source] || newCanvasElement(source);
        elements[target] = elements[target] || newCanvasElement(target);

        elements[source].connectorCount += 1;

        Object.assign(connector, createNewConnector(elements, source, target, type));
    });

    if (!elements.start) {
        elements.start = newCanvasElement('start');
    }

    elements.start.elementType = ELEMENT_TYPE.START_ELEMENT;
    return { elements, connectors, canvasElements: Object.values(elements).map((ele) => ele.guid) };
}

function translateNulls(uiModel) {
    const replacer = (k, v) => {
        if (v == null) {
            return k !== 'parent' && k !== 'childIndex' ? 'NULL' : undefined;
        }
        if (v.incomingGoTo && v.incomingGoTo.length === 0) {
            delete v.incomingGoTo;
        }
        return v;
    };

    return JSON.parse(JSON.stringify(uiModel, replacer, ''));
}

function assertConsolidatedEndConnectors(elements) {
    expect(translateNulls(consolidateEndConnectors(deepCopy(elements)))).toMatchSnapshot();
}

function assertCanConvertToAutoLayoutCanvas(storeState, canConvert = true) {
    expect(
        translateNulls(canConvertToAutoLayoutCanvas(addEndElementsAndConnectorsTransform(deepCopy(storeState)), null))
    ).toEqual(canConvert);
}

function assertRoundTripFromAutoLayoutCanvas(alcUiModel, expectedEndConnectors, assertRoundTrip = true) {
    let ffcUiModel;
    const endConnectors = [];
    it('from Auto Layout Canvas', () => {
        ffcUiModel = sortCanvasElementsAndConnectors(
            translateNulls(
                removeEndElementsAndConnectorsTransform(
                    convertToFreeFormCanvas(deepCopy(alcUiModel), startElementCoords),
                    endConnectors
                )
            )
        );

        if (expectedEndConnectors != null) {
            expect(translateNulls(endConnectors)).toEqual(translateNulls(expectedEndConnectors));
        }

        expect(translateNulls(ffcUiModel)).toMatchSnapshot();
    });

    if (assertRoundTrip) {
        it('to Auto Layout Canvas', () => {
            const options = { shouldConsolidateEndConnectors: false, noEmptyFaults: false };
            const roundTripAlcUiModel = convertToAutoLayoutCanvas(
                addEndElementsAndConnectorsTransform(deepCopy(ffcUiModel), endConnectors),
                options
            );

            expect(translateNulls(roundTripAlcUiModel)).toEqual(translateNulls(alcUiModel));
        });
    }
}

function assertRoundTripFromFreeFormCanvas(ffcUiModel, coords = startElementCoords, assertRoundTrip = true) {
    let alcUiModel;

    it('from Free Form Canvas', () => {
        const options = { shouldConsolidateEndConnectors: false, noEmptyFaults: false };
        alcUiModel = convertToAutoLayoutCanvas(addEndElementsAndConnectorsTransform(deepCopy(ffcUiModel)), options);
        expect(translateNulls(alcUiModel)).toMatchSnapshot();
    });

    if (assertRoundTrip) {
        it('to Free Form Canvas', () => {
            const roundTripFfcUiModel = sortCanvasElementsAndConnectors(
                removeEndElementsAndConnectorsTransform(convertToFreeFormCanvas(deepCopy(alcUiModel), coords))
            );

            expect(translateNulls(roundTripFfcUiModel)).toEqual(
                translateNulls(sortCanvasElementsAndConnectors(ffcUiModel))
            );
        });
    }
}

describe('deepEquals', () => {
    it('passes for primitives', () => {
        expect(deepEquals(1, 1)).toBeTruthy();
        expect(deepEquals('abc', 'abc')).toBeTruthy();
        expect(deepEquals(0.1, 0.1)).toBeTruthy();
        expect(deepEquals(false, false)).toBeTruthy();
    });

    it('passes for arrays', () => {
        expect(deepEquals([1], [1])).toBeTruthy();
    });

    it('passes for objects', () => {
        expect(deepEquals({ guid: 'a' }, { guid: 'a' })).toBeTruthy();
    });
    it('passes for nested objects', () => {
        expect(
            deepEquals({ guid: 'a', children: [{ guid: 'b' }] }, { guid: 'a', children: [{ guid: 'b' }] })
        ).toBeTruthy();
    });

    it('fails for diff primitives', () => {
        expect(deepEquals(1, 2)).toBeFalsy();
        expect(deepEquals('abc', 'ac')).toBeFalsy();
        expect(deepEquals(0.1, null)).toBeFalsy();
        expect(deepEquals(true, false)).toBeFalsy();
    });

    it('fails for diff arrays', () => {
        expect(deepEquals([1], [])).toBeFalsy();
    });

    it('fails diff objects', () => {
        expect(deepEquals({ guid: 'a' }, { guid: 'b' })).toBeFalsy();
        expect(deepEquals({ guid: 'a', extra: true }, { guid: 'a' })).toBeFalsy();
        expect(deepEquals({ guid: 'a' }, { guid: 'a', extra: true })).toBeFalsy();
    });
    it('fails for diff nested objects', () => {
        expect(
            deepEquals({ guid: 'a', children: [{ guid: 'b' }] }, { guid: 'a', children: [{ guid: 'c' }] })
        ).toBeFalsy();
    });
});

describe('alc conversion utils', () => {
    describe('consolidate end connectors', () => {
        it('for decision with two ended branches', () => {
            assertConsolidatedEndConnectors(decisionWithTwoEndedBranches.elements);
        });
        it('for decision with nested empty decision', () => {
            assertConsolidatedEndConnectors(decisionWithEmptyNestedDecision.elements);
        });
        it('for decision with nested decision with two ended branches', () => {
            assertConsolidatedEndConnectors(decisionWithNestedDecisionWithTwoEndedBranches.elements);
        });
    });

    describe('can convert Free Form Flow with', () => {
        it('only start node', () => {
            const storeState = storeStateFromConnectors([]);
            assertCanConvertToAutoLayoutCanvas(storeState);
        });

        it('with start node that has empty childReferences array', () => {
            const storeState = storeStateFromConnectors([]);
            storeState.elements.start.childReferences = [];
            assertCanConvertToAutoLayoutCanvas(storeState);
        });

        it('fault', () => {
            const connectors = [
                { source: 'start', target: 'action' },
                { source: 'action', target: 'n1' },
                { source: 'action', target: 'fault', type: CONNECTOR_TYPE.FAULT }
            ];
            const storeState = storeStateFromConnectors(connectors);

            Object.assign(storeState.elements.action, {
                elementType: ELEMENT_TYPE.ACTION_CALL,
                childReferences: [],
                maxConnections: 2,
                availableConnections: [],
                canHaveFaultConnector: true
            });

            assertCanConvertToAutoLayoutCanvas(storeState);
        });

        it('fault reconnect', () => {
            const connectors = [
                { source: 'start', target: 'action' },
                { source: 'action', target: 'n1' },
                { source: 'action', target: 'fault', type: CONNECTOR_TYPE.FAULT },
                { source: 'fault', target: 'n1' }
            ];
            const storeState = storeStateFromConnectors(connectors);
            assertCanConvertToAutoLayoutCanvas(storeState);
        });

        describe('decision', () => {
            it('with two merging branches', () => {
                const connectors = [
                    { source: 'start', target: 'if' },
                    { source: 'if', target: 'n1', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome1' },
                    { source: 'if', target: 'n2', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'n1', target: 'merge' },
                    { source: 'n2', target: 'merge' }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.if, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });

                addOutcomes(storeState.elements, 'outcome1');

                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with two ended branches', () => {
                const connectors = [
                    { source: 'start', target: 'if' },
                    { source: 'if', target: 'n1', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome1' },
                    { source: 'if', target: 'n2', type: CONNECTOR_TYPE.DEFAULT }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.if, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });

                addOutcomes(storeState.elements, 'outcome1');
                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with nested decision', () => {
                const connectors = [
                    { source: 'start', target: 'decision' },
                    {
                        source: 'decision',
                        target: 'nested-decision',
                        type: CONNECTOR_TYPE.REGULAR,
                        childSource: 'outcome1'
                    },
                    { source: 'decision', target: 'merge', type: CONNECTOR_TYPE.DEFAULT },
                    {
                        source: 'nested-decision',
                        target: 'merge',
                        type: CONNECTOR_TYPE.REGULAR,
                        childSource: 'outcome2'
                    },
                    { source: 'nested-decision', target: 'merge', type: CONNECTOR_TYPE.DEFAULT }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.decision, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });
                Object.assign(storeState.elements['nested-decision'], {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome2'
                        }
                    ]
                });

                addOutcomes(storeState.elements, 'outcome1', 'outcome2');
                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with back edge', () => {
                const connectors = [
                    { source: 'start', target: 'n1' },
                    { source: 'n1', target: 'if' },
                    { source: 'if', target: 'n1' }
                ];
                const storeState = storeStateFromConnectors(connectors);
                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with jump out forward', () => {
                const connectors = [
                    { source: 'start', target: 'if' },
                    { source: 'if', target: 'n1', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome1' },
                    { source: 'if', target: 'n2', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'n1', target: 'merge', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome2' },
                    { source: 'n2', target: 'merge' },
                    { source: 'merge', target: 'n3' },
                    { source: 'n1', target: 'n3', type: CONNECTOR_TYPE.DEFAULT }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.if, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });
                Object.assign(storeState.elements.n1, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome2'
                        }
                    ]
                });
                addOutcomes(storeState.elements, 'outcome1', 'outcome2');

                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with cross connector', () => {
                const connectors = [
                    { source: 'start', target: 'if' },
                    { source: 'if', target: 'n1', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome1' },
                    { source: 'if', target: 'n2', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'n1', target: 'n2', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome2' },
                    { source: 'n1', target: 'merge', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'n2', target: 'merge' }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.if, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });
                Object.assign(storeState.elements.n1, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome2'
                        }
                    ]
                });
                addOutcomes(storeState.elements, 'outcome1', 'outcome2');

                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with cross connector example 2', () => {
                const connectors = [
                    { source: 'start', target: 'if' },
                    { source: 'if', target: 'if2', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome1' },
                    { source: 'if', target: 'merge', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'if2', target: 'n1', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome2' },
                    { source: 'if2', target: 'n2', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'n1', target: 'merge2' },
                    { source: 'n2', target: 'merge2', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome3' },
                    { source: 'n2', target: 'merge', type: CONNECTOR_TYPE.DEFAULT }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.if, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });
                Object.assign(storeState.elements.if2, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome2'
                        }
                    ]
                });
                Object.assign(storeState.elements.n2, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome3'
                        }
                    ]
                });
                addOutcomes(storeState.elements, 'outcome1', 'outcome2', 'outcome3');

                assertCanConvertToAutoLayoutCanvas(storeState, true, true);
            });

            it('with cross connector example 3', () => {
                const connectors = [
                    { source: 'start', target: 'if' },
                    { source: 'if', target: 'merge', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome1' },
                    { source: 'if', target: 'if2', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'if2', target: 'n1', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome2' },
                    { source: 'if2', target: 'n2', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'n1', target: 'merge2' },
                    { source: 'n2', target: 'merge2', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome3' },
                    { source: 'n2', target: 'merge', type: CONNECTOR_TYPE.DEFAULT }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.if, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });
                Object.assign(storeState.elements.if2, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome2'
                        }
                    ]
                });
                Object.assign(storeState.elements.n2, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome3'
                        }
                    ]
                });
                addOutcomes(storeState.elements, 'outcome1', 'outcome2', 'outcome3');

                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with connector back to decision', () => {
                const connectors = [
                    { source: 'start', target: 'if' },
                    { source: 'if', target: 'n1', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome1' },
                    { source: 'if', target: 'n2', type: CONNECTOR_TYPE.DEFAULT },
                    { source: 'n1', target: 'if' }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.if, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });
                addOutcomes(storeState.elements, 'outcome1');

                assertCanConvertToAutoLayoutCanvas(storeState);
            });
        });

        describe('loop', () => {
            it('with next and end', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 'n1', type: 'LOOP_NEXT' },
                    { source: 'loop', target: 'n2', type: 'LOOP_END' },
                    { source: 'n1', target: 'loop' }
                ];

                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.loop, {
                    elementType: ELEMENT_TYPE.LOOP,
                    maxConnections: 2,
                    availableConnections: []
                });

                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with no next', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 'n2', type: CONNECTOR_TYPE.LOOP_END }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.loop, {
                    elementType: ELEMENT_TYPE.LOOP,
                    maxConnections: 2,
                    availableConnections: [{ type: 'LOOP_NEXT' }]
                });

                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with no end', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 'n1', type: CONNECTOR_TYPE.LOOP_NEXT },
                    { source: 'n1', target: 'loop' }
                ];

                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.loop, {
                    elementType: ELEMENT_TYPE.LOOP,
                    maxConnections: 2,
                    availableConnections: [{ type: 'LOOP_END' }]
                });

                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with nested decision 2', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 'd1', type: 'LOOP_NEXT' },
                    { source: 'loop', target: 'n2', type: 'LOOP_END' },
                    { source: 'd1', target: 'loop', type: CONNECTOR_TYPE.REGULAR, childSource: 'outcome1' },
                    { source: 'd1', target: 'loop', type: CONNECTOR_TYPE.DEFAULT }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.loop, {
                    elementType: ELEMENT_TYPE.LOOP,
                    maxConnections: 2,
                    availableConnections: []
                });

                Object.assign(storeState.elements.d1, {
                    elementType: ELEMENT_TYPE.DECISION,
                    availableConnections: [],
                    maxConnections: 2,
                    childReferences: [
                        {
                            childReference: 'outcome1'
                        }
                    ]
                });
                addOutcomes(storeState.elements, 'outcome1');
                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('with nested loop', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 'nestedLoop', type: 'LOOP_NEXT' },
                    { source: 'nestedLoop', target: 's1', type: 'LOOP_END' },
                    { source: 'nestedLoop', target: 's2', type: 'LOOP_NEXT' },
                    { source: 's1', target: 'loop' },
                    { source: 's2', target: 'nestedLoop' }
                ];
                const storeState = storeStateFromConnectors(connectors);
                Object.assign(storeState.elements.loop, {
                    elementType: ELEMENT_TYPE.LOOP,
                    maxConnections: 2,
                    availableConnections: [{ type: 'LOOP_END' }]
                });

                Object.assign(storeState.elements.nestedLoop, {
                    elementType: ELEMENT_TYPE.LOOP,
                    maxConnections: 2,
                    availableConnections: []
                });

                assertCanConvertToAutoLayoutCanvas(storeState);
            });

            it('loop - end path within a loop', () => {
                assertCanConvertToAutoLayoutCanvas(ffcLoopWithEndPathWithin, true);
            });
        });
    });

    describe('cant convert Free Form Flow with', () => {
        it('next and fault same element', () => {
            assertCanConvertToAutoLayoutCanvas(ffcNextAndFaultSameElement, false);
        });

        it('loop for each and end same element', () => {
            assertCanConvertToAutoLayoutCanvas(ffcLoopForEachAndEndSameElement, false);
        });

        it('loop with nested loop back', () => {
            assertCanConvertToAutoLayoutCanvas(ffcLoopWithNestedLoopBack, false);
        });

        it('loop with back edge goto', () => {
            assertCanConvertToAutoLayoutCanvas(ffcLoopWithBackEdge, false);
        });

        it('loop with cross as goto edge', () => {
            assertCanConvertToAutoLayoutCanvas(ffcLoopWithCrossAsGotoEdge, false);
        });

        it('loop with forward as goto edge and execution context does not match', () => {
            assertCanConvertToAutoLayoutCanvas(ffcLoopWithFowardAsGotoEdge, false);
        });

        it('with start node that has set childReferences', () => {
            const storeState = storeStateFromConnectors([]);
            storeState.elements.start.childReferences = [
                {
                    childReference: 't1'
                }
            ];
            assertCanConvertToAutoLayoutCanvas(storeState, false);
        });

        it('with orphan node', () => {
            const storeState = storeStateFromConnectors([]);
            storeState.elements.orphan = { guid: 'orphan', isCanvasElement: true };
            assertCanConvertToAutoLayoutCanvas(storeState, false);
        });

        it('with unsupported element type', () => {
            const connectors = [{ source: 'start', target: 'e1' }];
            const storeState = storeStateFromConnectors(connectors);
            storeState.elements.e1.elementType = ELEMENT_TYPE.STEP;
            assertCanConvertToAutoLayoutCanvas(storeState, false);
        });

        describe('loop', () => {
            it('with end element', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 'e1', type: 'LOOP_NEXT' },
                    { source: 'loop', target: 'n2', type: 'LOOP_END' }
                ];

                const storeState = storeStateFromConnectors(connectors);
                storeState.elements.loop.elementType = ELEMENT_TYPE.LOOP;
                storeState.elements.e1.elementType = ELEMENT_TYPE.END_ELEMENT;
                assertCanConvertToAutoLayoutCanvas(storeState, false);
            });

            it('with decision with no default', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 'd1', type: 'LOOP_NEXT' },
                    { source: 'd1', target: 'loop', type: 'REGULAR' },
                    { source: 'd1', target: 'end', type: 'DEFAULT' },
                    { source: 'loop', target: 'n2', type: 'LOOP_END' }
                ];

                const storeState = storeStateFromConnectors(connectors);
                storeState.elements.loop.elementType = ELEMENT_TYPE.LOOP;
                storeState.elements.end.elementType = ELEMENT_TYPE.END_ELEMENT;
                storeState.elements.d1.elementType = ELEMENT_TYPE.DECISION;

                assertCanConvertToAutoLayoutCanvas(storeState, false);
            });
            it('with ended branch', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 's1', type: 'LOOP_NEXT' },
                    { source: 'loop', target: 'n2', type: 'LOOP_END' }
                ];
                const storeState = storeStateFromConnectors(connectors);
                storeState.elements.loop.elementType = ELEMENT_TYPE.LOOP;
                storeState.elements.s1.connectorCount = 0;

                assertCanConvertToAutoLayoutCanvas(storeState, false);
            });

            it('loop with nested loop with element jumping to top loop', () => {
                const connectors = [
                    { source: 'start', target: 'loop' },
                    { source: 'loop', target: 'nestedLoop', type: 'LOOP_NEXT' },
                    { source: 'nestedLoop', target: 's1', type: 'LOOP_END' },
                    { source: 'nestedLoop', target: 's2', type: 'LOOP_NEXT' },
                    { source: 's1', target: 'loop' },
                    { source: 's2', target: 'loop' }
                ];
                const storeState = storeStateFromConnectors(connectors);
                storeState.elements.loop.elementType = ELEMENT_TYPE.LOOP;
                storeState.elements.nestedLoop.elementType = ELEMENT_TYPE.LOOP;
                assertCanConvertToAutoLayoutCanvas(storeState, false);
            });

            it('with nested decision jumping after loop', () => {
                const connectors = [
                    { source: 'start', target: 'd1' },
                    { source: 'd1', target: 'loop' },
                    { source: 'loop', target: 'd2', type: 'LOOP_NEXT' },
                    { source: 'loop', target: 'n2', type: 'LOOP_END' },
                    { source: 'd2', target: 's1' },
                    { source: 's1', target: 'loop' },
                    { source: 'd2', target: 'n2' }
                ];
                const storeState = storeStateFromConnectors(connectors);
                storeState.elements.loop.elementType = ELEMENT_TYPE.LOOP;
                storeState.elements.d2.elementType = ELEMENT_TYPE.DECISION;
                storeState.elements.d1.elementType = ELEMENT_TYPE.DECISION;
                assertCanConvertToAutoLayoutCanvas(storeState, false);
            });
        });
    });

    describe('converts', () => {
        describe('Resetting config', () => {
            it('When toggling from Free-Form to Auto-Layout', () => {
                const options = { shouldConsolidateEndConnectors: false, noEmptyFaults: false };
                const alcUiModel = convertToAutoLayoutCanvas(
                    addEndElementsAndConnectorsTransform(deepCopy(ffcUpdatedElementConfig)),
                    options
                );
                expect(translateNulls(alcUiModel)).toMatchSnapshot();
            });

            it('When toggling from Auto-Layout to Free-Form', () => {
                const ffcUiModel = sortCanvasElementsAndConnectors(
                    translateNulls(
                        removeEndElementsAndConnectorsTransform(
                            convertToFreeFormCanvas(deepCopy(updatedElementConfig), startElementCoords),
                            []
                        )
                    )
                );

                expect(translateNulls(ffcUiModel)).toMatchSnapshot();
            });
        });
        describe('Free Form to Autolayout canvas', () => {
            describe('Decision with go to on branch head', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgDecisionWithGoToOnHead, undefined, false);
            });
            describe('Decision with go to on default branch head', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgDecisionWithGoToOnDefaultHead, undefined, false);
            });
            describe('Decision with go to on branch next', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgDecisionWithGoToOnBranchNext, undefined, false);
            });
            describe('Decision with go to in nested branch', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgDecisionWithGoToInNestedBranch, undefined, false);
            });
            describe('Decision with go to in nested decision', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgDecisionsWithGoToInNestedDecision, undefined, false);
            });
            describe('Complex Nested Decisions with go tos', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgComplexNestedDecisionsWithGoTos, undefined, false);
            });
            describe('Element with go to on fault', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgElementWithGoToOnFault, undefined, false);
            });
            describe('Elements with go to on cross edge fault', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgGoToOnCrossEdgeFault, undefined, false);
            });
            describe('Loop with go to on after last connector', () => {
                assertRoundTripFromFreeFormCanvas(ffcOgLoopWithGoToAfterLast, undefined, false);
            });
        });
        describe('round trip from Free Form', () => {
            describe('sanity', () => {
                assertRoundTripFromFreeFormCanvas(ffcSanity);
            });
            describe('fault', () => {
                describe('simple', () => {
                    assertRoundTripFromFreeFormCanvas(ffcElementWithFault);
                });
                describe('decision head', () => {
                    assertRoundTripFromFreeFormCanvas(ffcElementWithFaultWithDecisionHead);
                });
                describe('element with go to on fault', () => {
                    assertRoundTripFromFreeFormCanvas(ffcElementWithGoToOnFault);
                });
                describe('element with go to on cross edge fault', () => {
                    assertRoundTripFromFreeFormCanvas(ffcGoToOnCrossEdgeFault);
                });
            });
            describe('triggering record start', () => {
                describe('only immediate', () => {
                    assertRoundTripFromFreeFormCanvas(ffcStartWithOnlyImmediate);
                });
                describe('only scheduled paths', () => {
                    assertRoundTripFromFreeFormCanvas(ffcStartWithOnlyScheduledPath);
                });
                describe('one immediate + one scheduled path', () => {
                    assertRoundTripFromFreeFormCanvas(ffcStartWithSingleScheduledPath);
                });
                describe('two scheduled paths', () => {
                    assertRoundTripFromFreeFormCanvas(ffcStartWithMultipleScheduledPath);
                });
                describe('with merging imm and async path', () => {
                    assertRoundTripFromFreeFormCanvas(ffcStartWithMergingPaths);
                });
                describe('with go to on immediate path head', () => {
                    assertRoundTripFromFreeFormCanvas(ffcStartWithGoToOnImmediateHead);
                });
                describe('with go to on scheduled path head', () => {
                    assertRoundTripFromFreeFormCanvas(ffcStartWithGoToOnScheduledHead);
                });
            });
            describe('decision', () => {
                describe('empty', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionEmpty);
                });
                describe('with multiple outcomes', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithMultipleOutcomes);
                });
                describe('with nested empty decision', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithNestedEmptyDecision);
                });
                describe('with screen on each branch and screen merge', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithScreenOnEachBranchAndScreenMerge);
                });
                describe('with decision next', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithDecisionNext);
                });
                describe('with nested left decision', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithNestedLeftDecision);
                });
                describe('with decision nested and join screen', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithNestedDecisionAndJoinScreen);
                });
                describe('with go to on head', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithGoToOnHead);
                });
                describe('with go to on default head', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithGoToOnDefaultHead);
                });
                describe('with go to on branch next', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithGoToOnBranchNext);
                });
                describe('with go to in nested branch', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionWithGoToInNestedBranch);
                });
                describe('with go to in nested decision', () => {
                    assertRoundTripFromFreeFormCanvas(ffcDecisionsWithGoToInNestedDecision);
                });
                describe('complex decision with multiple nested branches and go tos', () => {
                    assertRoundTripFromFreeFormCanvas(ffcComplexNestedDecisionsWithGoTos);
                });
                describe('complex 1', () => {
                    assertRoundTripFromFreeFormCanvas(ffcComplex1);
                });
                describe('complex 2', () => {
                    assertRoundTripFromFreeFormCanvas(ffcComplex2);
                });
                describe('complex 3', () => {
                    assertRoundTripFromFreeFormCanvas(ffcComplex3);
                });
                describe('complex 4', () => {
                    assertRoundTripFromFreeFormCanvas(ffcComplex4);
                });
                describe('complex 5', () => {
                    assertRoundTripFromFreeFormCanvas(ffcComplex5);
                });
                describe('complex 6', () => {
                    assertRoundTripFromFreeFormCanvas(ffcComplex6);
                });
            });
            describe('wait', () => {
                describe('with three outcomes and fault', () => {
                    assertRoundTripFromFreeFormCanvas(ffcWaitWithThreeOutcomesAndFault);
                });
            });
            describe('loop', () => {
                describe('with for each and after last', () => {
                    assertRoundTripFromFreeFormCanvas(ffcLoopWithForEachAndAfterLast);
                });
                describe('empty with after last', () => {
                    assertRoundTripFromFreeFormCanvas(ffcLoopEmptyWithAfterLast);
                });
                describe('empty', () => {
                    assertRoundTripFromFreeFormCanvas(ffcLoopEmpty);
                });
                describe('with go to after last', () => {
                    assertRoundTripFromFreeFormCanvas(ffcLoopWithGoToAfterLast);
                });
            });
            describe('test cases', () => {
                const coords = [0, 0];
                describe('ffcTestCase01', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase01, coords);
                });
                describe('ffcTestCase02', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase02, coords);
                });
                describe('ffcTestCase03', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase03, coords);
                });
                describe('ffcTestCase04', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase04, coords);
                });
                describe('ffcTestCase05', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase05, coords);
                });
                describe('ffcTestCase06', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase06, coords);
                });
                describe('ffcTestCase07', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase07, coords);
                });
                describe('ffcTestCase08', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase08, coords);
                });
                describe('ffcTestCase09', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase09, coords);
                });
                describe('ffcTestCase10', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase10, coords);
                });
                describe('ffcTestCase11', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase11, coords);
                });
                describe('ffcTestCase12', () => {
                    assertRoundTripFromFreeFormCanvas(ffcTestCase12, coords);
                });
            });
        });
        describe('round trip from Auto Layout', () => {
            describe('simple', () => {
                describe('only start', () => {
                    const endConnectors = [
                        {
                            config: {
                                isSelected: false
                            },
                            guid: 'start-element-guid -> end-element-guid (start-element-guid)',
                            label: null,
                            source: 'start-element-guid',
                            target: 'end-element-guid (start-element-guid)',
                            type: 'REGULAR'
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(sanity, endConnectors);
                });
                describe('one screen', () => {
                    const endConnectors = [
                        {
                            config: {
                                isSelected: false
                            },
                            guid: 'screen-element-guid -> end-element-guid (screen-element-guid)',
                            label: null,
                            source: 'screen-element-guid',
                            target: 'end-element-guid (screen-element-guid)',
                            type: 'REGULAR'
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(oneScreen, endConnectors);
                });
                describe('one element with fault', () => {
                    const expectedEndConnectors = [
                        {
                            config: { isSelected: false },
                            guid: 'fault-element-guid -> end-element-guid (fault-element-guid)',
                            label: null,
                            source: 'fault-element-guid',
                            target: 'end-element-guid (fault-element-guid)',
                            type: 'REGULAR'
                        },
                        {
                            config: { isSelected: false },
                            guid: 'record-create-element-guid -> end-element-guid (record-create-element-guid)',
                            label: null,
                            source: 'record-create-element-guid',
                            target: 'end-element-guid (record-create-element-guid)',
                            type: 'REGULAR'
                        }
                    ];

                    assertRoundTripFromAutoLayoutCanvas(oneElementWithFault, expectedEndConnectors);
                });
            });
            describe('goto', () => {
                describe('on fault', () => {
                    const endConnectors = [
                        {
                            config: {
                                isSelected: false
                            },
                            guid: 'record-create-element-guid -> end-element-guid (record-create-element-guid)',
                            label: null,
                            source: 'record-create-element-guid',
                            target: 'end-element-guid (record-create-element-guid)',
                            type: 'REGULAR'
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(elementWithGotoOnFault, endConnectors, false);
                });
                describe('on decision branch head', () => {
                    const endConnectors = [
                        {
                            config: {
                                isSelected: false
                            },
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            type: 'REGULAR'
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithGotoOnHead, endConnectors, false);
                });
                describe('on decision default branch head', () => {
                    const endConnectors = [
                        {
                            config: {
                                isSelected: false
                            },
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            type: 'REGULAR'
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithGotoOnDefaultHead, endConnectors, false);
                });
                describe('on decision next', () => {
                    const endConnectors = [];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithGotoOnNext, endConnectors, false);
                });
                describe('on decision next, with a nested left decision', () => {
                    const endConnectors = [];
                    assertRoundTripFromAutoLayoutCanvas(
                        decisionWithGotoOnNextAndNestedLeftDecision,
                        endConnectors,
                        false
                    );
                });
                describe('on decision left branch next', () => {
                    const endConnectors = [
                        {
                            config: {
                                isSelected: false
                            },
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            type: 'REGULAR'
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithGotoOnLeftBranchNext, endConnectors, false);
                });
                describe('on loop after last', () => {
                    const endConnectors = [];
                    assertRoundTripFromAutoLayoutCanvas(loopEmptyWithGotoAfterLast, endConnectors, false);
                });
            });
            describe('record triggered start', () => {
                describe('start with only immediate', () => {
                    const endConnectors = [
                        {
                            guid: 'assignment-imm-element-guid -> end-element-guid (assignment-imm-element-guid)',
                            source: 'assignment-imm-element-guid',
                            target: 'end-element-guid (assignment-imm-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(startWithOnlyImmediate, endConnectors);
                });
                describe('start with goto on immediate path', () => {
                    const endConnectors = [
                        {
                            guid:
                                'assignment-async-element-guid -> end-element-guid (scheduled-path-start-element-guid)',
                            source: 'assignment-async-element-guid',
                            target: 'end-element-guid (scheduled-path-start-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid:
                                'assignment-async2-element-guid -> end-element-guid (scheduled-path-start-element-guid)',
                            source: 'assignment-async2-element-guid',
                            target: 'end-element-guid (scheduled-path-start-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(startWithGotoOnImmediatePath, endConnectors, false);
                });
                describe('start with only scheduled paths', () => {
                    const endConnectors = [
                        {
                            guid:
                                'scheduled-path-start-element-guid -> end-element-guid (scheduled-path-start-element-guid)',
                            source: 'scheduled-path-start-element-guid',
                            target: 'end-element-guid (scheduled-path-start-element-guid)',
                            label: 'IMMEDIATE',
                            type: 'IMMEDIATE',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'assignment-async-element-guid -> end-element-guid (assignment-async-element-guid)',
                            source: 'assignment-async-element-guid',
                            target: 'end-element-guid (assignment-async-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(startWithOnlyScheduledPaths, endConnectors);
                });
                describe('start with immediate + one scheduled path', () => {
                    const endConnectors = [
                        {
                            guid: 'assignment-imm-element-guid -> end-element-guid (assignment-imm-element-guid)',
                            source: 'assignment-imm-element-guid',
                            target: 'end-element-guid (assignment-imm-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'assignment-async-element-guid -> end-element-guid (assignment-async-element-guid)',
                            source: 'assignment-async-element-guid',
                            target: 'end-element-guid (assignment-async-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(startWithImmPlusScheduledPath, endConnectors);
                });
                describe('start with multiple scheduled paths', () => {
                    const endConnectors = [
                        {
                            guid: 'assignment-imm-element-guid -> end-element-guid (assignment-imm-element-guid)',
                            source: 'assignment-imm-element-guid',
                            target: 'end-element-guid (assignment-imm-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'assignment-async-element-guid -> end-element-guid (assignment-async-element-guid)',
                            source: 'assignment-async-element-guid',
                            target: 'end-element-guid (assignment-async-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'assignment-async2-element-guid -> end-element-guid (assignment-async2-element-guid)',
                            source: 'assignment-async2-element-guid',
                            target: 'end-element-guid (assignment-async2-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(startWithMultipleScheduledPaths, endConnectors);
                });
                describe('merging imm and async paths', () => {
                    const endConnectors = [
                        {
                            guid: 'assignment-imm-element-guid -> end-element-guid (assignment-async-element-guid)',
                            source: 'assignment-imm-element-guid',
                            target: 'end-element-guid (assignment-async-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'assignment-async-element-guid -> end-element-guid (assignment-async-element-guid)',
                            source: 'assignment-async-element-guid',
                            target: 'end-element-guid (assignment-async-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'assignment-async2-element-guid -> end-element-guid (assignment-async2-element-guid)',
                            source: 'assignment-async2-element-guid',
                            target: 'end-element-guid (assignment-async2-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(startWithMergingPaths, endConnectors);
                });
            });
            describe('decision', () => {
                describe('empty with empty nested decision', () => {
                    const endConnectors = [
                        {
                            guid: 'nested-decision-element-guid -> end-element-guid (decision-element-guid)',
                            source: 'nested-decision-element-guid',
                            childSource: 'outcome2-element-guid',
                            target: 'end-element-guid (decision-element-guid)',
                            label: 'd1out',
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'nested-decision-element-guid -> end-element-guid (decision-element-guid)',
                            source: 'nested-decision-element-guid',
                            target: 'end-element-guid (decision-element-guid)',
                            label: 'DEFAULT',
                            type: 'DEFAULT',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'decision-element-guid -> end-element-guid (decision-element-guid)',
                            source: 'decision-element-guid',
                            target: 'end-element-guid (decision-element-guid)',
                            label: 'DEFAULT',
                            type: 'DEFAULT',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithEmptyNestedDecision, endConnectors);
                });
                describe('empty with screen next', () => {
                    const endConnectors = [
                        {
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionEmptyWithScreenNext, endConnectors);
                });
                describe('empty with end next', () => {
                    const endConnectors = [
                        {
                            guid: 'decision-element-guid -> end-element-guid (decision-element-guid)',
                            source: 'decision-element-guid',
                            childSource: 'outcome-element-guid',
                            target: 'end-element-guid (decision-element-guid)',
                            label: 'd1out',
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'decision-element-guid -> end-element-guid (decision-element-guid)',
                            source: 'decision-element-guid',
                            target: 'end-element-guid (decision-element-guid)',
                            label: 'DEFAULT',
                            type: 'DEFAULT',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(emptyDecisionWithEndNext, endConnectors);
                });
                describe('with child on non default outcome', () => {
                    const endConnectors = [
                        {
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithChildOnNonDefaultOutcome, endConnectors);
                });
                describe('with child on non default outcome next is end', () => {
                    const endConnectors = [
                        {
                            guid: 'screen-left-element-guid -> end-element-guid (decision-element-guid)',
                            source: 'screen-left-element-guid',
                            target: 'end-element-guid (decision-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'decision-element-guid -> end-element-guid (decision-element-guid)',
                            source: 'decision-element-guid',
                            target: 'end-element-guid (decision-element-guid)',
                            label: 'DEFAULT',
                            type: 'DEFAULT',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithChildOnNonDefaultOutcomeNextIsEnd, endConnectors);
                });
                describe('with testCaseW8010546', () => {
                    const endConnectors = [
                        {
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];

                    assertRoundTripFromAutoLayoutCanvas(testCaseW8010546, endConnectors, true);
                });
                describe('with one child on each branch, followed by a screen element', () => {
                    const endConnectors = [
                        {
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionOneChildOnEachBranchNextIsNotEnd, endConnectors);
                });
                describe('with two ended branches', () => {
                    const endConnectors = [
                        {
                            guid: 'screen-left-element-guid -> end-element-guid (screen-left-element-guid)',
                            source: 'screen-left-element-guid',
                            target: 'end-element-guid (screen-left-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'screen-right-element-guid -> end-element-guid (screen-right-element-guid)',
                            source: 'screen-right-element-guid',
                            target: 'end-element-guid (screen-right-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithTwoEndedBranches, endConnectors);
                });
                describe('with nested decision with two ended branches', () => {
                    const endConnectors = [
                        {
                            guid: 'screen-left-element-guid -> end-element-guid (screen-left-element-guid)',
                            source: 'screen-left-element-guid',
                            target: 'end-element-guid (screen-left-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'screen-right-element-guid -> end-element-guid (screen-right-element-guid)',
                            source: 'screen-right-element-guid',
                            target: 'end-element-guid (screen-right-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'decision-element-guid -> end-element-guid (decision-element-guid)',
                            source: 'decision-element-guid',
                            target: 'end-element-guid (decision-element-guid)',
                            label: 'DEFAULT',
                            type: 'DEFAULT',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithNestedDecisionWithTwoEndedBranches, endConnectors);
                });
                describe('with decision next', () => {
                    const endConnectors = [
                        {
                            guid: 'decision-next-element-guid -> end-element-guid (decision-next-element-guid)',
                            source: 'decision-next-element-guid',
                            childSource: 'outcome2-element-guid',
                            target: 'end-element-guid (decision-next-element-guid)',
                            label: 'd1out',
                            type: 'REGULAR',
                            config: { isSelected: false }
                        },
                        {
                            guid: 'decision-next-element-guid -> end-element-guid (decision-next-element-guid)',
                            source: 'decision-next-element-guid',
                            target: 'end-element-guid (decision-next-element-guid)',
                            label: 'DEFAULT',
                            type: 'DEFAULT',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithDecisionNext, endConnectors);
                });
                describe('with nested left decision', () => {
                    const endConnectors = [
                        {
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithNestedLeftDecision, endConnectors);
                });
                describe('with nested right decision', () => {
                    const endConnectors = [
                        {
                            guid:
                                'screen-after-decision-element-guid -> end-element-guid (screen-after-decision-element-guid)',
                            source: 'screen-after-decision-element-guid',
                            target: 'end-element-guid (screen-after-decision-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(decisionWithNestedRightDecision, endConnectors);
                });
            });
            describe('loop', () => {
                describe('empty', () => {
                    const endConnectors = [
                        {
                            guid: 'loop-element-guid -> end-element-guid (loop-element-guid)',
                            source: 'loop-element-guid',
                            target: 'end-element-guid (loop-element-guid)',
                            label: 'LOOP_END',
                            type: 'LOOP_END',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(emptyLoopWithEndNext, endConnectors);
                });
                describe('with for each and after last screen', () => {
                    const endConnectors = [
                        {
                            guid: 'screen-after-last-element-guid -> end-element-guid (screen-after-last-element-guid)',
                            source: 'screen-after-last-element-guid',
                            target: 'end-element-guid (screen-after-last-element-guid)',
                            label: null,
                            type: 'REGULAR',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(loopWithForEachScreenAndAfterLastScreen, endConnectors);
                });
                describe('with for each and after last end', () => {
                    const endConnectors = [
                        {
                            guid: 'loop-element-guid -> end-element-guid (loop-element-guid)',
                            source: 'loop-element-guid',
                            target: 'end-element-guid (loop-element-guid)',
                            label: 'LOOP_END',
                            type: 'LOOP_END',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(loopWithForEachScreenAndAfterLastEnd, endConnectors);
                });

                describe('with nested empty decision', () => {
                    const endConnectors = [
                        {
                            guid: 'loop-element-guid -> end-element-guid (loop-element-guid)',
                            source: 'loop-element-guid',
                            target: 'end-element-guid (loop-element-guid)',
                            label: 'LOOP_END',
                            type: 'LOOP_END',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(loopWithNestedEmptyDecision, endConnectors);
                });

                describe('with nested loop', () => {
                    const endConnectors = [
                        {
                            guid: 'loop-element-guid -> end-element-guid (loop-element-guid)',
                            source: 'loop-element-guid',
                            target: 'end-element-guid (loop-element-guid)',
                            label: 'LOOP_END',
                            type: 'LOOP_END',
                            config: { isSelected: false }
                        }
                    ];
                    assertRoundTripFromAutoLayoutCanvas(loopWithNestedLoop, endConnectors);
                });
            });
        });
    });

    describe('convert record triggered flow with single trigger', () => {
        it('can convert to Free Form Flow', () => {
            const storeState = storeStateFromConnectors([]);
            storeState.elements.start.triggerType = FLOW_TRIGGER_TYPE.AFTER_SAVE;
            storeState.elements.start.object = 'Account';
            storeState.elements.start.recordTriggerType = FLOW_TRIGGER_SAVE_TYPE.CREATE;
            assertCanConvertToAutoLayoutCanvas(storeState, true);
        });
        it('creates connector with default label (immediate)', () => {
            const ffUiModel = convertToFreeFormCanvas(oneAssignmentInScheduledPath, [0, 0]);
            const connector = ffUiModel.connectors.find((conn) => {
                return conn.guid === 'scheduled-path-start-element-guid -> assignment-element-guid';
            });
            expect(connector.type).toBe(CONNECTOR_TYPE.IMMEDIATE);
        });
    });
});
