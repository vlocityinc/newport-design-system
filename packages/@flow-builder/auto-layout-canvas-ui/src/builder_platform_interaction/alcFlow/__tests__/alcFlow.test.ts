// @ts-nocheck
import { createElement } from 'lwc';
import AlcFlow from 'builder_platform_interaction/alcFlow';
import { flowWithFault, flowModelWithFault } from './mockData';
import { FAULT_INDEX } from 'builder_platform_interaction/autoLayoutCanvas';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const createComponentUnderTest = (flow, flowModel) => {
    const el = createElement('builder_platform_interaction-alcNode', {
        is: AlcFlow
    });

    el.flowModel = flowModel;
    el.flow = flow;
    el.flowModel = flowModelWithFault;
    el.canvasMode = 'default';
    el.isCanvasReady = true;
    el.disableAddElements = false;

    document.body.appendChild(el);
    return el;
};

const selectors = {
    connector: 'builder_platform_interaction-alc-connector',
    compoundNode: 'builder_platform_interaction-alc-compound-node',
    flow: 'builder_platform_interaction-alc-flow'
};

describe('ALC Flow tests', () => {
    describe('Flow with a Fault branch', () => {
        let flowComponent;
        beforeEach(() => {
            const flowModel = {
                start: {
                    config: {},
                    label: undefined
                },
                decision: {
                    conditionOptions: [],
                    config: {},
                    defaultConnectorLabel: 'Default Outcome',
                    label: 'decision',
                    children: [null, null],
                    childReferences: [
                        {
                            childReference: 'o1'
                        },
                        {
                            childReference: 'o2'
                        }
                    ]
                },
                o1: {
                    label: 'o1'
                },
                o2: {
                    label: 'o2'
                },
                createRecords: {
                    conditionOptions: undefined,
                    config: {},
                    defaultConnectorLabel: undefined,
                    label: 'createRecords'
                },
                screen: {
                    config: {},
                    label: 'screen'
                },
                faultEnd: {
                    config: {},
                    label: 'End'
                },
                end: {
                    config: {},
                    label: 'End'
                }
            };
            flowComponent = createComponentUnderTest(flowWithFault, flowModel);
        });

        it('Should not have any preConnector', () => {
            const preConnector = flowComponent.shadowRoot.querySelector(selectors.connector);
            expect(preConnector).toBeNull();
        });

        it('Should have four compound nodes', () => {
            const compoundNodes = flowComponent.shadowRoot.querySelectorAll(selectors.compoundNode);
            expect(compoundNodes).not.toBeNull();
            expect(compoundNodes.length).toEqual(4);
        });

        it('Should have one fault flow', () => {
            const faultFlow = flowComponent.shadowRoot.querySelectorAll(selectors.flow);
            expect(faultFlow).not.toBeNull();
            expect(faultFlow.length).toEqual(1);
        });

        it('findNode for the main flow should return the searched node', () => {
            const compoundNode = flowComponent.findNode([{ guid: 'createRecords' }]);
            expect(compoundNode).not.toBeNull();
            expect(compoundNode.dataset.key).toEqual('createRecords');
        });

        it('findConnector for the main branch should return the searched connector', () => {
            const compoundConnector = flowComponent.findConnector([{ guid: 'decision' }]);
            expect(compoundConnector).not.toBeNull();
            expect(compoundConnector.connectorInfo.source).toEqual({
                guid: 'decision'
            });
        });

        it('findConnector for the 0th branch of the decision should return the searched connector', () => {
            const compoundConnector = flowComponent.findConnector([{ guid: 'decision' }], 0);
            expect(compoundConnector).not.toBeNull();
            expect(compoundConnector.connectorInfo.source).toEqual({
                childIndex: 0,
                guid: 'decision'
            });
        });

        it('findConnector for the Fault branch should return the searched connector', () => {
            const compoundConnector = flowComponent.findConnector([{ guid: 'createRecords' }], FAULT_INDEX);
            expect(compoundConnector).not.toBeNull();
            expect(compoundConnector.connectorInfo.source).toEqual({
                childIndex: FAULT_INDEX,
                guid: 'createRecords'
            });
        });
    });
});
