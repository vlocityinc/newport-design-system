// @ts-nocheck
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { getConnectorMenuInfo, getNodeMenuInfo } from '../alcMenuUtils';

jest.mock('builder_platform_interaction/alcComponentsUtils', () => {
    return {
        getComponent(componentName) {
            return componentName;
        }
    };
});

const ELEMENT_TYPE_ASSIGNMENT = 'Assignment';
const ELEMENT_TYPE_DECISION = 'Decision';
const ELEMENT_TYPE_SCREEN = 'Screen';
const ELEMENT_TYPE_START_ELEMENT = 'START_ELEMENT';
const ELEMENT_TYPE_WAIT = 'wait';
const ELEMENT_TYPE_END_ELEMENT = 'END_ELEMENT';
const ELEMENT_TYPE_LOOP = 'Loop';
const ELEMENT_TYPE_ROOT = 'root';

const elementsMetadata = {
    [ELEMENT_TYPE_ASSIGNMENT]: { type: NodeType.DEFAULT },
    [ELEMENT_TYPE_DECISION]: { type: NodeType.BRANCH },
    [ELEMENT_TYPE_WAIT]: { type: NodeType.BRANCH },
    [ELEMENT_TYPE_SCREEN]: { type: NodeType.DEFAULT },
    [ELEMENT_TYPE_START_ELEMENT]: { type: NodeType.START },
    [ELEMENT_TYPE_END_ELEMENT]: { type: NodeType.END },
    [ELEMENT_TYPE_LOOP]: { type: NodeType.LOOP },
    [ELEMENT_TYPE_ROOT]: { type: NodeType.ROOT }
};

const flowModel = {
    root: {
        guid: 'root',
        elementType: 'root',
        children: ['guid1']
    },
    guid1: {
        parent: 'root',
        childIndex: 0,
        guid: 'guid1',
        elementType: ELEMENT_TYPE_SCREEN,
        config: {
            isSelected: false
        },
        prev: null,
        next: 'branch-guid',
        incomingGoTo: ['branch-guid:o2', 'guid5']
    },
    'branch-guid': {
        guid: 'branch-guid',
        elementType: ELEMENT_TYPE_DECISION,
        defaultConnectorLabel: 'Default Outcome',
        config: {
            isSelected: false
        },
        childReferences: [
            {
                childReference: 'o1'
            },
            {
                childReference: 'o2'
            },
            {
                childReference: 'o3'
            }
        ],
        prev: 'guid1',
        next: 'guid3',
        children: ['guid4', 'guid1', 'guid5', null],
        nodeType: 'branch'
    },
    guid3: {
        guid: 'guid3',
        elementType: ELEMENT_TYPE_SCREEN,
        config: {
            isSelected: false
        },
        prev: 'branch-guid',
        next: null
    },
    guid4: {
        guid: 'guid4',
        elementType: ELEMENT_TYPE_END_ELEMENT,
        nodeType: NodeType.END,
        config: {
            isSelected: false
        },
        parent: 'branch-guid',
        prev: null,
        next: null,
        childIndex: 0,
        isTerminal: true
    },
    guid5: {
        guid: 'guid5',
        elementType: ELEMENT_TYPE_SCREEN,
        config: {
            isSelected: false
        },
        parent: 'branch-guid',
        prev: null,
        next: 'guid1',
        childIndex: 2,
        isTerminal: true
    },
    o1: {
        guid: 'o1',
        label: 'o1'
    },
    o2: {
        guid: 'o2',
        label: 'o2'
    },
    o3: {
        guid: 'o3',
        label: 'o3'
    }
};

function testConnectorMenuInfo(
    flowModel,
    source,
    { canAddGoto, isGoToConnector, canAddEndElement, autoFocus = false, isPasteAvailable = false }
) {
    const menu = {
        source,
        autoFocus: false
    };

    const canvasContext = {
        menu,
        connectorMenuMetadata: {
            menuComponent: 'alcConnectorMenu',
            elementTypes: new Set([ELEMENT_TYPE_SCREEN, ELEMENT_TYPE_DECISION])
        },
        elementsMetadata,
        isPasteAvailable
    };

    const connectorMenuInfo = getConnectorMenuInfo(canvasContext, flowModel);

    expect(connectorMenuInfo).toEqual({
        canAddGoto,
        ctor: 'alcConnectorMenu',
        elementsMetadata,
        isGoToConnector,
        autoFocus,
        canAddEndElement,
        isPasteAvailable,
        metadata: {
            menuComponent: 'alcConnectorMenu',
            elementTypes: new Set([ELEMENT_TYPE_SCREEN, ELEMENT_TYPE_DECISION])
        },
        source: menu.source
    });
}

describe('ALC Menu Utils', () => {
    describe('getNodeMenuInfo', () => {
        it('conditionOptionsForNode is defined for a branching element', () => {
            const elementMetadata = { type: NodeType.BRANCH, menuComponent: 'alcNodeMenu' };
            const menu = {
                source: { guid: 'branch-guid', childIndex: 0 },
                autoFocus: false
            };
            const canvasContext = {
                menu
            };
            const nodeMenuInfo = getNodeMenuInfo(canvasContext, flowModel, elementMetadata);

            expect(nodeMenuInfo).toEqual({
                ctor: 'alcNodeMenu',
                autoFocus: false,
                source: menu.source,
                conditionOptions: [
                    {
                        label: 'o1',
                        value: 'o1'
                    },
                    {
                        label: 'o2',
                        value: 'o2'
                    },
                    {
                        label: 'o3',
                        value: 'o3'
                    },
                    {
                        label: 'Default Outcome',
                        value: 'DEFAULT_PATH'
                    },
                    {
                        label: 'AlcNodeContextualMenu.deleteAllPathsComboboxLabel',
                        value: 'NO_PATH'
                    }
                ]
            });
        });
    });

    describe('getConnectorMenuInfo', () => {
        it('canAddEndElement is true and isGoToConnector is false on branch when next element is not end node', () => {
            const source = { guid: 'branch-guid', childIndex: 3 };
            testConnectorMenuInfo(flowModel, source, {
                canAddEndElement: true,
                isGoToConnector: false,
                canAddGoto: true
            });
        });

        it('canAddEndElement is false and isGoToConnector is false on branch when next element is end node', () => {
            const source = { guid: 'branch-guid', childIndex: 0 };
            testConnectorMenuInfo(flowModel, source, {
                canAddEndElement: false,
                isGoToConnector: false,
                canAddGoto: true
            });
        });

        it('canAddEndElement is false and isGoToConnector is true on branch that has a GoTo connection at branch head', () => {
            const source = { guid: 'branch-guid', childIndex: 1 };
            testConnectorMenuInfo(flowModel, source, {
                canAddEndElement: false,
                isGoToConnector: true,
                canAddGoto: false
            });
        });

        it('canAddEndElement is false and isGoToConnector is true when there is a GoTo connection to the next element', () => {
            const source = { guid: 'guid5' };
            testConnectorMenuInfo(flowModel, source, {
                canAddEndElement: false,
                isGoToConnector: true,
                canAddGoto: false
            });
        });

        it('canAddEndElement, isGoToConnector, canAddGoto is false when there are no elements to connect to', () => {
            const providedFlowModel = {
                root: {
                    elementType: 'root',
                    guid: 'root',
                    label: 'root',
                    value: 'root',
                    text: 'root',
                    name: 'root',
                    prev: null,
                    next: null,
                    children: ['start-guid']
                },
                'start-guid': {
                    guid: 'start-guid',
                    description: '',
                    next: 'decision',
                    prev: null,
                    locationX: 50,
                    locationY: 50,
                    isCanvasElement: true,
                    connectorCount: 0,
                    config: { isSelected: false, isHighlighted: false, canSelect: true },
                    elementType: 'START_ELEMENT',
                    maxConnections: 1,
                    triggerType: 'None',
                    filterType: 'all',
                    object: '',
                    parent: 'root',
                    childIndex: 0,
                    isTerminal: true,
                    nodeType: 'start'
                },
                decision: {
                    availableConnections: [],
                    childReferences: [{ childReference: 'o1' }],
                    children: [null, 'screen'],
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    connectorCount: 2,
                    defaultConnectorLabel: 'Default Outcome',
                    description: '',
                    elementType: 'Decision',
                    guid: 'decision',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'decision',
                    locationX: 0,
                    locationY: 0,
                    maxConnections: 2,
                    name: 'decision',
                    next: 'end-guid',
                    prev: 'start-guid',
                    nodeType: 'branch'
                },
                screen: {
                    allowBack: true,
                    allowFinish: true,
                    allowPause: true,
                    childReferences: [],
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    description: '',
                    elementType: 'Screen',
                    guid: 'screen',
                    helpText: '',
                    incomingGoTo: [],
                    isCanvasElement: true,
                    label: 'screen',
                    locationX: 0,
                    locationY: 0,
                    name: 'screen',
                    next: null,
                    nodeType: 'default',
                    pausedText: '',
                    prev: null,
                    parent: 'decision',
                    childIndex: 1,
                    isTerminal: false,
                    showFooter: true,
                    showHeader: true
                },
                'end-guid': {
                    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
                    connectorCount: 0,
                    description: '',
                    elementType: 'END_ELEMENT',
                    guid: 'end-guid',
                    isCanvasElement: true,
                    label: 'End',
                    locationX: 0,
                    locationY: 0,
                    name: 'END_ELEMENT',
                    nodeType: 'end',
                    prev: 'decision',
                    text: 'END_ELEMENT',
                    value: 'END_ELEMENT'
                }
            };
            const source = { guid: 'decision' };
            testConnectorMenuInfo(providedFlowModel, source, {
                canAddEndElement: false,
                isGoToConnector: false,
                canAddGoto: false
            });
        });

        it('isPasteAvailable is false when passed in as false into the canvas context', () => {
            const source = { guid: 'branch-guid', childIndex: 3 };
            testConnectorMenuInfo(flowModel, source, {
                canAddEndElement: true,
                isGoToConnector: false,
                canAddGoto: true,
                isPasteAvailable: false
            });
        });

        it('isPasteAvailable is true when passed in as true into the canvas context', () => {
            const source = { guid: 'branch-guid', childIndex: 3 };
            testConnectorMenuInfo(flowModel, source, {
                canAddEndElement: true,
                isGoToConnector: false,
                canAddGoto: true,
                isPasteAvailable: true
            });
        });
    });
});
