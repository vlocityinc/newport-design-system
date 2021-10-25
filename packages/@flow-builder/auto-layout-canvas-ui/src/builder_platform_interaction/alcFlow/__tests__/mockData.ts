const flowWithFault = {
    geometry: {},
    isTerminal: true,
    layoutConfig: {},
    nodes: [
        {
            flows: [],
            guid: 'start',
            isNew: false,
            isTerminal: false,
            logicConnectors: [],
            menuOpened: false,
            metadata: {
                canHaveFaultConnector: false,
                description: 'Screen Flow',
                elementType: 'START_ELEMENT',
                hasContext: false,
                hasTrigger: false,
                icon: 'utility:right',
                iconBackgroundColor: 'background-green',
                iconShape: 'circle',
                iconSize: 'medium',
                isSupported: true,
                label: 'Start',
                section: null,
                supportsMenu: true,
                type: 'start',
                value: 'START_ELEMENT'
            },
            nextConnector: {
                addInfo: {
                    menuOpened: false,
                    offsetY: 60
                },
                source: {
                    guid: 'start'
                },
                geometry: {},
                isFault: undefined,
                isHighlighted: false,
                labelOffsetY: 48,
                labelType: 0,
                svgInfo: {
                    endLocation: { x: 3, y: 120 },
                    geometry: {},
                    path: 'M 3, 0\nL 3, 120'
                },
                toBeDeleted: false,
                type: 'straight'
            },
            toBeDeleted: false
        },
        {
            flows: [
                {
                    geometry: {},
                    isTerminal: false,
                    layoutConfig: {},
                    nodes: [],
                    preConnector: {
                        addInfo: { offsetY: 84, menuOpened: false },
                        source: { guid: 'decision', childIndex: 0 },
                        geometry: {},
                        isFault: false,
                        isHighlighted: false,
                        labelOffsetY: 48,
                        labelType: 1,
                        svgInfo: {
                            endLocation: { x: 3, y: 96 },
                            geometry: {},
                            path: 'M 3, 24↵L 3, 96'
                        },
                        toBeDeleted: false,
                        type: 'straight'
                    }
                },
                {
                    geometry: {},
                    isTerminal: false,
                    layoutConfig: {},
                    nodes: [],
                    preConnector: {
                        addInfo: { offsetY: 84, menuOpened: false },
                        source: { guid: 'decision', childIndex: 1 },
                        geometry: {},
                        isFault: false,
                        isHighlighted: false,
                        labelOffsetY: 48,
                        labelType: 1,
                        svgInfo: {
                            endLocation: { x: 3, y: 96 },
                            geometry: {},
                            path: 'M 3, 24\nL 3, 96'
                        },
                        toBeDeleted: false,
                        type: 'straight'
                    }
                }
            ],
            geometry: {},
            guid: 'decision',
            isNew: false,
            isTerminal: false,
            logicConnectors: [],
            menuOpened: false,
            metadata: {
                canHaveFaultConnector: undefined,
                description: 'Create paths for the flow to take based on conditions you set.',
                dynamicNodeComponent: undefined,
                dynamicNodeComponentSelector: undefined,
                elementType: 'Decision',
                icon: 'standard:decision',
                iconBackgroundColor: undefined,
                iconShape: 'diamond',
                iconSize: undefined,
                isSupported: true,
                label: 'Decision',
                section: 'Logic',
                supportsMenu: true,
                type: 'branch',
                value: 'Decision'
            },
            nextConnector: {
                addInfo: { offsetY: 36, menuOpened: false },
                source: {
                    guid: 'decision'
                },
                geometry: {},
                isFault: undefined,
                isHighlighted: false,
                labelOffsetY: 48,
                labelType: 0,
                svgInfo: {
                    endLocation: { x: 3, y: 144 },
                    geometry: {},
                    path: 'M 3, 24\nL 3, 144'
                },
                toBeDeleted: false,
                type: 'straight'
            },
            toBeDeleted: false
        },
        {
            faultFlow: {
                geometry: {},
                isTerminal: true,
                layoutConfig: {},
                nodes: [
                    {
                        flows: [],
                        geometry: {},
                        guid: 'screen',
                        isNew: false,
                        isTerminal: false,
                        logicConnectors: [],
                        menuOpened: true,
                        metadata: {
                            canHaveFaultConnector: undefined,
                            description:
                                'Collect information from users who run the flow or show them some information.',
                            dynamicNodeComponent: undefined,
                            dynamicNodeComponentSelector: undefined,
                            elementType: 'Screen',
                            icon: 'standard:screen',
                            iconBackgroundColor: undefined,
                            iconShape: undefined,
                            iconSize: undefined,
                            isSupported: true,
                            label: 'Screen',
                            section: 'Interaction',
                            supportsMenu: true,
                            type: 'default',
                            value: 'Screen'
                        },
                        nextConnector: {
                            addInfo: { offsetY: 60, menuOpened: false },
                            source: { guid: 'screen' },
                            geometry: {},
                            isFault: undefined,
                            isHighlighted: false,
                            labelOffsetY: 48,
                            labelType: 0,
                            svgInfo: {
                                endLocation: { x: 3, y: 120 },
                                geometry: {},
                                path: 'M 3, 0\nL 3, 120'
                            },
                            toBeDeleted: false,
                            type: 'straight'
                        },
                        toBeDeleted: false
                    },
                    {
                        flows: [],
                        geometry: {},
                        guid: 'faultEnd',
                        isNew: false,
                        isTerminal: true,
                        logicConnectors: [],
                        menuOpened: false,
                        metadata: {
                            canHaveFaultConnector: false,
                            description: 'Finish the flow.',
                            elementType: 'END_ELEMENT',
                            icon: 'utility:stop',
                            iconBackgroundColor: 'background-red',
                            iconShape: 'circle',
                            iconSize: 'medium',
                            isSupported: true,
                            label: 'End',
                            section: 'Logic',
                            supportsMenu: false,
                            type: 'end',
                            value: 'END_ELEMENT'
                        },
                        toBeDeleted: false
                    }
                ],
                preConnector: {
                    addInfo: { offsetY: 60, menuOpened: false },
                    source: { guid: 'createRecords', childIndex: -1 },
                    geometry: {},
                    isFault: true,
                    isHighlighted: false,
                    labelOffsetY: 24,
                    labelType: 4,
                    svgInfo: {
                        endLocation: { x: 3, y: 120 },
                        geometry: {},
                        path: 'M 3, 24\nL 3, 120'
                    },
                    toBeDeleted: false,
                    type: 'straight'
                }
            },
            flows: [],
            geometry: {},
            guid: 'createRecords',
            isNew: false,
            isTerminal: false,
            logicConnectors: [
                {
                    source: { guid: 'root', childIndex: -1 },
                    geometry: {},
                    isFault: true,
                    isHighlighted: false,
                    labelType: 0,
                    svgInfo: {
                        endLocation: { x: 267, y: 27 },
                        geometry: {},
                        path: 'M 3, 3\nL 251, 3\nA 16 16 0 0 1, 267, 19\nL 267, 27'
                    },
                    toBeDeleted: false,
                    type: 'branchRight'
                }
            ],
            menuOpened: false,
            metadata: {
                canHaveFaultConnector: true,
                description: 'Create Salesforce records using values from the flow.',
                dynamicNodeComponent: undefined,
                dynamicNodeComponentSelector: undefined,
                elementType: 'RecordCreate',
                icon: 'standard:record_create',
                iconBackgroundColor: undefined,
                iconShape: undefined,
                iconSize: undefined,
                isSupported: true,
                label: 'Create Records',
                section: 'Data',
                supportsMenu: true,
                type: 'default',
                value: 'RecordCreate'
            },
            nextConnector: {
                addInfo: { offsetY: 60, menuOpened: false },
                source: {
                    guid: 'createRecords'
                },
                geometry: {},
                isFault: undefined,
                isHighlighted: false,
                labelOffsetY: 48,
                labelType: 0,
                svgInfo: {
                    endLocation: { x: 3, y: 120 },
                    geometry: {},
                    path: 'M 3, 0\nL 3, 120'
                },
                toBeDeleted: false,
                type: 'straight'
            },
            toBeDeleted: false
        },
        {
            flows: [],
            geometry: {},
            guid: 'end',
            isNew: false,
            isTerminal: true,
            logicConnectors: [],
            menuOpened: false,
            metadata: {
                canHaveFaultConnector: false,
                description: 'Finish the flow.',
                elementType: 'END_ELEMENT',
                icon: 'utility:stop',
                iconBackgroundColor: 'background-red',
                iconShape: 'circle',
                iconSize: 'medium',
                isSupported: true,
                label: 'End',
                section: 'Logic',
                supportsMenu: false,
                type: 'end',
                value: 'END_ELEMENT'
            },
            toBeDeleted: false
        }
    ]
};

const flowModelWithFault = {
    start: {
        guid: 'start',
        description: 'Screen Flow',
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        elementType: 'START_ELEMENT',
        childReferences: [],
        nodeType: 'start',
        next: 'decision',
        parent: 'root',
        childIndex: 0,
        prev: null,
        isTerminal: true
    },
    decision: {
        guid: 'decision',
        name: 'decision',
        label: 'decision',
        connectorCount: 0,
        childReferences: [{ childReference: 'ed3e7c01-fb00-4f40-a7d3-89a3887fa20c' }],
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        nodeType: 'branch',
        prev: 'start',
        incomingGoTo: [],
        next: 'createRecords',
        children: [null, null]
    },
    'ed3e7c01-fb00-4f40-a7d3-89a3887fa20c': {
        guid: 'ed3e7c01-fb00-4f40-a7d3-89a3887fa20c',
        name: 'ed3e7c01-fb00-4f40-a7d3-89a3887fa20c',
        label: 'o1',
        elementType: 'OUTCOME'
    },
    createRecords: {
        guid: 'createRecords',
        name: 'createRecords',
        label: 'createRecords',
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        availableConnections: [],
        elementType: 'RecordCreate',
        nodeType: 'default',
        prev: 'decision',
        incomingGoTo: [],
        next: 'end',
        fault: 'screen'
    },
    screen: {
        guid: 'screen',
        name: 'screen',
        label: 'screen',
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        childReferences: [],
        elementType: 'Screen',
        nodeType: 'default',
        childIndex: -1,
        parent: 'createRecords',
        prev: null,
        incomingGoTo: [],
        next: 'faultEnd'
    },
    faultEnd: {
        guid: 'faultEnd',
        name: 'END_ELEMENT',
        label: 'End',
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: 'screen'
    },
    end: {
        guid: 'end',
        name: 'END_ELEMENT',
        label: 'End',
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: 'createRecords'
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        children: ['start']
    }
};

export { flowWithFault, flowModelWithFault };
