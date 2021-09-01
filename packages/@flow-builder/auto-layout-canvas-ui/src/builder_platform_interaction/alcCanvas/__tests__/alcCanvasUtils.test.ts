import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { getFocusPath } from '../alcCanvasUtils';

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
        canHaveCanvasEmbeddedElement: true,
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
        elementType: 'STAGE_STEP',
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
        elementType: 'STAGE_STEP',
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

describe('ALC Builder Utils tests', () => {
    describe('getFocusPath tests', () => {
        it('When focusing on Start Element', () => {
            const focusPath = [{ guid: 'startGuid' }];
            expect(getFocusPath(flowModel, focusPath)).toEqual([{ guid: 'startGuid' }]);
        });

        it('When focusing on any other element is the main flow', () => {
            const focusPath = [{ guid: 'branch1' }];
            expect(getFocusPath(flowModel, focusPath)).toEqual([{ guid: 'branch1' }]);
        });

        it('When focusing on a branch head element', () => {
            const focusPath = [{ guid: 'branchHead1' }];
            expect(getFocusPath(flowModel, focusPath)).toEqual([
                {
                    guid: 'branch1',
                    index: 0
                },
                {
                    guid: 'branchHead1'
                }
            ]);
        });

        it('When focusing on any element other than a branch head element in a given branch', () => {
            const focusPath = [{ guid: 'screen1' }];
            expect(getFocusPath(flowModel, focusPath)).toEqual([
                {
                    guid: 'branch1',
                    index: 1
                },
                {
                    guid: 'branchHead2',
                    index: 0
                },
                {
                    guid: 'screen1'
                }
            ]);
        });
    });
});
describe('ALC Builder Utils tests for Orchestrator', () => {
    describe('getFocusPath tests', () => {
        it('When focusing on Step 1 from stage element', () => {
            const focusPath = [{ guid: 'step1Guid' }];
            expect(getFocusPath(orchestratorModel, focusPath)).toEqual([
                { guid: 'stageGuid', index: 0, canHaveCanvasEmbeddedElement: true },
                { guid: 'step1Guid' }
            ]);
        });
    });
});
