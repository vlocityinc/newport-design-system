import AlcNode from 'builder_platform_interaction/alcNode';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createElement } from 'lwc';
import {
    convertToElementMetadataMap,
    getBoundingBoxForElements,
    getNodePath,
    getSanitizedNodeGeo
} from '../alcCanvasUtils';
import { elementsMetadata } from './mockData';

const flowModel = {
    startGuid: {
        guid: 'startGuid',
        label: 'start node',
        elementType: 'START_ELEMENT',
        nodeType: NodeType.START,
        prev: null,
        next: 'branch1',
        parent: 'root',
        childIndex: 0,
        maxConnections: 1,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null,
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: true
    },
    branch1: {
        guid: 'branch1',
        label: 'branch node',
        elementType: 'DECISION',
        nodeType: NodeType.BRANCH,
        prev: 'startGuid',
        next: 'end',
        children: ['branchHead1', 'branchHead2'],
        maxConnections: 2,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null,
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: true
    },
    branchHead1: {
        guid: 'branchHead1',
        label: 'Left branch head element',
        elementType: 'SCREEN',
        nodeType: NodeType.DEFAULT,
        prev: null,
        next: null,
        parent: 'branch1',
        childIndex: 0,
        maxConnections: 1,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null,
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: true
    },
    branchHead2: {
        guid: 'branchHead2',
        label: 'Right branch head element',
        elementType: 'DECISION',
        nodeType: NodeType.BRANCH,
        prev: null,
        next: null,
        parent: 'branch1',
        childIndex: 1,
        children: ['screen1', null],
        maxConnections: 2,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null,
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: true
    },
    screen1: {
        guid: 'screen1',
        label: 'Left branch screen',
        elementType: 'SCREEN',
        nodeType: NodeType.DEFAULT,
        prev: null,
        next: null,
        parent: 'branchHead2',
        childIndex: 0,
        maxConnections: 1,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null,
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: true
    },
    end: {
        guid: 'end',
        label: 'end node',
        elementType: 'END_ELEMENT',
        nodeType: NodeType.END,
        prev: 'branch1',
        next: null,
        maxConnections: 0,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null,
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: true
    }
};

const orchestratorModel = {
    startGuid: {
        guid: 'startGuid',
        label: 'start node',
        elementType: 'START_ELEMENT',
        nodeType: NodeType.START,
        prev: null,
        next: 'stageGuid',
        parent: 'root',
        childIndex: 0,
        maxConnections: 1,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null,
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: true
    },
    stageGuid: {
        guid: 'stageGuid',
        name: 'Stage_1',
        fault: null,
        description: '',
        label: 'Stage 1',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 1,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        childReferences: [
            {
                childReference: 'step1Guid'
            },
            {
                childReference: 'step2Guid'
            }
        ],
        maxConnections: 1,
        elementType: 'OrchestratedStage',
        dataType: 'ORCHESTRATED_STAGE',
        exitActionInputParameters: [],
        nodeType: NodeType.ORCHESTRATED_STAGE,
        prev: 'startGuid',
        incomingGoTo: [],
        next: 'endGuid',
        children: ['step1Guid', 'step2Guid']
    },
    step1Guid: {
        nodeType: NodeType.DEFAULT,
        next: null,
        maxConnections: 0,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: false,

        label: 'Step 1 of Stage 1',
        name: 'Step_1_of_Stage_1',
        outputParameters: [],
        processMetadataValues: [],
        guid: 'step1Guid',
        fault: null,
        elementType: ELEMENT_TYPE.STAGE_STEP,
        dataType: 'STAGE_STEP',
        parent: 'stageGuid',
        childIndex: 0,
        isTerminal: false,
        prev: null
    },
    step2Guid: {
        label: 'Step 2 of Stage 1',
        name: 'Step_2_of_Stage_1',
        outputParameters: [],
        processMetadataValues: [],
        guid: 'step2Guid',
        fault: null,
        elementType: ELEMENT_TYPE.STAGE_STEP,
        dataType: 'STAGE_STEP',
        parent: 'stageGuid',
        childIndex: 1,
        isTerminal: false,
        prev: null,
        nodeType: NodeType.DEFAULT,
        next: null,
        maxConnections: 0,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: false
    },
    endGuid: {
        guid: 'endGuid',
        label: 'end node',
        elementType: 'END_ELEMENT',
        nodeType: NodeType.END,
        prev: 'branch1',
        next: null,
        maxConnections: 0,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        fault: null,
        incomingGoTo: [],
        canHaveFaultConnector: false,
        isCanvasElement: true
    }
};

Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
    } as DOMRect;
});

describe('ALC Builder Utils tests', () => {
    describe('getNodePath tests', () => {
        it('When focusing on Start Element', () => {
            expect(getNodePath(flowModel, 'startGuid')).toEqual([{ guid: 'startGuid' }]);
        });

        it('When focusing on any other element is the main flow', () => {
            expect(getNodePath(flowModel, 'branch1')).toEqual([{ guid: 'branch1' }]);
        });

        it('When focusing on a branch head element', () => {
            expect(getNodePath(flowModel, 'branchHead1')).toEqual([
                {
                    guid: 'branch1',
                    childIndex: 0
                },
                {
                    guid: 'branchHead1'
                }
            ]);
        });

        it('When focusing on any element other than a branch head element in a given branch', () => {
            expect(getNodePath(flowModel, 'screen1')).toEqual([
                {
                    guid: 'branch1',
                    childIndex: 1
                },
                {
                    guid: 'branchHead2',
                    childIndex: 0
                },
                {
                    guid: 'screen1'
                }
            ]);
        });
    });
    describe('stubInteraction util function', () => {
        describe('getBoundingBoxForElements', () => {
            it('with complex geometry', () => {
                const elementsGeometry = [
                    { x: 119, y: 1491, w: 53, h: 132 },
                    { x: 1439, y: 771, w: 53, h: 132 },
                    { x: 1703, y: 1011, w: 53, h: 108 },
                    { x: 1416, y: 243, w: 48, h: 48 }
                ];
                expect(getBoundingBoxForElements(elementsGeometry)).toEqual({ h: 1380, w: 1637, x: 119, y: 243 });
            });
            it('with negative positions', () => {
                const elementsGeometry = [
                    { x: 119, y: 1491, w: 53, h: 132 },
                    { x: 1439, y: 771, w: 53, h: 132 },
                    { x: 1703, y: 1011, w: 53, h: 108 },
                    { x: -1416, y: -243, w: 48, h: 48 }
                ];
                expect(getBoundingBoxForElements(elementsGeometry)).toEqual({ h: 1866, w: 3172, x: -1416, y: -243 });
            });
            it('with simple geometry', () => {
                const elementsGeometry = [
                    { x: 0, y: 0, w: 50, h: 50 },
                    { x: 50, y: 50, w: 50, h: 50 },
                    { x: -50, y: -50, w: 50, h: 50 }
                ];
                expect(getBoundingBoxForElements(elementsGeometry)).toEqual({ h: 150, w: 150, x: -50, y: -50 });
            });
        });
        describe('getSanitizedNodeGeo', () => {
            it('at zoomed in scale of 1', () => {
                const alcNodeHTML = createElement('builder_platform_interaction-alc-node', {
                    is: AlcNode
                });
                expect(getSanitizedNodeGeo(alcNodeHTML, 1)).toEqual({ h: 48, w: 48, x: -14, y: -14 });
            });
            it('with scale of 0.5', () => {
                const alcNodeHTML = createElement('builder_platform_interaction-alc-node', {
                    is: AlcNode
                });
                expect(getSanitizedNodeGeo(alcNodeHTML, 0.5)).toEqual({ h: 24, w: 24, x: -2, y: -2 });
            });
            it('at zoomed out scale of 0.1', () => {
                const alcNodeHTML = createElement('builder_platform_interaction-alc-node', {
                    is: AlcNode
                });
                expect(getSanitizedNodeGeo(alcNodeHTML, 0.1)).toEqual({
                    h: 4.800000000000001,
                    w: 4.800000000000001,
                    x: 7.6,
                    y: 7.6
                });
            });
        });
    });
    describe('convertToElementMetadataMap util function tests', () => {
        it('Should have ActionCall in the map with the elementType as the key', () => {
            const elementsMetadataMap = convertToElementMetadataMap(elementsMetadata);
            const actionCall = elementsMetadataMap.ActionCall;
            expect(actionCall).not.toBeNull();
            expect(actionCall.elementType).toEqual('ActionCall');
        });

        it('Should have emailAlert in the map with the actionType as the key since it has a defined actionType', () => {
            const elementsMetadataMap = convertToElementMetadataMap(elementsMetadata);
            const emailAlert = elementsMetadataMap.emailAlert;
            expect(emailAlert).not.toBeNull();
            expect(emailAlert.actionType).toEqual('emailAlert');
        });

        it('Should have emailSimple in the map with the actionType as the key since it has a defined actionType', () => {
            const elementsMetadataMap = convertToElementMetadataMap(elementsMetadata);
            const emailSimple = elementsMetadataMap.emailSimple;
            expect(emailSimple).not.toBeNull();
            expect(emailSimple.actionType).toEqual('emailSimple');
        });
    });
});
describe('ALC Builder Utils tests for Orchestrator', () => {
    describe('getNodePath tests', () => {
        it('When focusing on Step 1 from stage element', () => {
            expect(getNodePath(orchestratorModel, 'step1Guid')).toEqual([
                { guid: 'stageGuid', childIndex: 0 },
                { guid: 'step1Guid' }
            ]);
        });
    });
});
