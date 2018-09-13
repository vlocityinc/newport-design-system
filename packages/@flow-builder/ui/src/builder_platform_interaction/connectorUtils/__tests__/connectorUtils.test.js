import {
    getFlowBounds,
    getMaxConnections,
    createConnectorObject,
    createConnectorObjects,
    createConnectorsAndConnectionProperties,
    setConnectorsOnElements,
    sortConnectorPickerComboboxOptions,
    getLabelAndValueForConnectorPickerOptions,
    createNewConnector
} from "builder_platform_interaction/connectorUtils";
import { ELEMENT_TYPE, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS } from "../connectorUtilsLabels";

jest.mock('builder_platform_interaction-store-lib', () => {
    return {
        generateGuid: () => {
            return 'CONNECTOR_1';
        }
    };
});

describe('Connector Utils', () => {
    it('Gets min and max x,y coordinates and flow width and height of the flow on canvas', () => {
        const elements = [
            { locationX: 2, locationY: 101 },
            { locationX: -1, locationY: 100 },
            { locationX: 100, locationY: 2 }
        ];

        expect(
            getFlowBounds(elements)
        ).toEqual({ minX: -1, minY: 2, maxX: 100, maxY: 101, flowWidth: 149, flowHeight: 195 });
    });

    describe('Calculates max connections', () => {
        it('For a node with a fixed max connection size', () => {
            const node = { elementType: ELEMENT_TYPE.ASSIGNMENT };
            const mockElementConfig = {
                nodeConfig: {
                    maxConnections: 5
                }
            };

            const elementConfig = require.requireActual(
                'builder_platform_interaction-element-config'
            );
            elementConfig.getConfigForElementType = jest
                .fn()
                .mockReturnValue(mockElementConfig);

            expect(getMaxConnections(node)).toEqual(
                mockElementConfig.nodeConfig.maxConnections
            );
        });

        it('For a decision node with outcomes', () => {
            const node = {
                elementType: ELEMENT_TYPE.DECISION,
                outcomeReferences: ['1', '2']
            };

            expect(getMaxConnections(node)).toEqual(3);
        });

        it('For a decision node with no outcomes', () => {
            const node = {
                elementType: ELEMENT_TYPE.DECISION
            };

            expect(getMaxConnections(node)).toEqual(1);
        });

        it('For a wait node with wait events', () => {
            const node = {
                elementType: ELEMENT_TYPE.WAIT,
                waitEventReferences: ['1', '2']
            };

            expect(getMaxConnections(node)).toEqual(4);
        });

        it('For a wait node with no wait events', () => {
            const node = {
                elementType: ELEMENT_TYPE.WAIT
            };

            expect(getMaxConnections(node)).toEqual(2);
        });
    });

    it('Creates connector object', () => {
        const expectedConnectorObject = {
            guid: 'CONNECTOR_1',
            source: 'srcElement',
            childSource: 'childSrcElement',
            target: 'trgt',
            label: 'label',
            type: CONNECTOR_TYPE.REGULAR,
            config: {
                isSelected: false
            }
        };

        expect(
            createConnectorObject(
                'srcElement',
                'childSrcElement',
                'trgt',
                'label',
                CONNECTOR_TYPE.REGULAR
            )
        ).toEqual(expectedConnectorObject);
    });

    describe('Creates connector objects', () => {
        it('For a node with a regular connector', () => {
            const node = {
                guid: 'guid1',
                connector: { targetReference: 'targetRef' }
            };
            const expectedConnectorObject = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                label: null,
                type: CONNECTOR_TYPE.REGULAR
            };

            const connectorObject = createConnectorObjects(node)[0];
            expect(connectorObject).toMatchObject(expectedConnectorObject);
            expect(node.connector).toBeUndefined();
        });

        it('For a node with a child element connector', () => {
            const node = {
                guid: 'guid1',
                label: 'elementLabel',
                connector: { targetReference: 'targetRef' }
            };
            const expectedConnectorObject = {
                source: 'parentGuid',
                childSource: 'guid1',
                target: 'targetRef',
                label: 'elementLabel',
                type: CONNECTOR_TYPE.REGULAR
            };

            const connectorObject = createConnectorObjects(node, 'parentGuid')[0];
            expect(connectorObject).toMatchObject(expectedConnectorObject);
            expect(node.connector).toBeUndefined();
        });

        it('For a node with an array of regular connectors', () => {
            const node = {
                guid: 'guid1',
                connectors: [
                    { targetReference: 'targetRef' },
                    { targetReference: 'targetRef2' }
                ]
            };
            const expectedConnectorObject1 = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                label: null,
                type: CONNECTOR_TYPE.REGULAR
            };
            const expectedConnectorObject2 = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef2',
                label: null,
                type: CONNECTOR_TYPE.REGULAR
            };

            const connectorObjects = createConnectorObjects(node);
            expect(connectorObjects[0]).toMatchObject(expectedConnectorObject1);
            expect(connectorObjects[1]).toMatchObject(expectedConnectorObject2);
            expect(node.connectors).toBeUndefined();
        });

        it('For a node with a fault connector', () => {
            const node = {
                guid: 'guid1',
                faultConnector: { targetReference: 'targetRef' }
            };
            const expectedConnectorObject = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                label: LABELS.faultConnectorLabel,
                type: CONNECTOR_TYPE.FAULT
            };

            const connectorObject = createConnectorObjects(node)[0];
            expect(connectorObject).toMatchObject(expectedConnectorObject);
            expect(node.faultConnector).toBeUndefined();
        });

        it('For a node with a default connector', () => {
            const node = {
                guid: 'guid1',
                defaultConnector: { targetReference: 'targetRef' },
                defaultConnectorLabel: 'defaultLabel'
            };
            const expectedConnectorObject = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                label: 'defaultLabel',
                type: CONNECTOR_TYPE.DEFAULT
            };

            const connectorObject = createConnectorObjects(node)[0];
            expect(connectorObject).toMatchObject(expectedConnectorObject);
            expect(node.defaultConnector).toBeUndefined();
        });

        it('For a loop node with next value connector', () => {
            const node = {
                guid: 'guid1',
                nextValueConnector: { targetReference: 'targetRef' }
            };
            const expectedConnectorObject = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                label: LABELS.loopNextConnectorLabel,
                type: CONNECTOR_TYPE.LOOP_NEXT
            };

            const connectorObject = createConnectorObjects(node)[0];
            expect(connectorObject).toMatchObject(expectedConnectorObject);
            expect(node.nextValueConnector).toBeUndefined();
        });

        it('For a loop node with no more values connector', () => {
            const node = {
                guid: 'guid1',
                noMoreValuesConnector: { targetReference: 'targetRef' }
            };
            const expectedConnectorObject = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                label: LABELS.loopEndConnectorLabel,
                type: CONNECTOR_TYPE.LOOP_END
            };

            const connectorObject = createConnectorObjects(node)[0];
            expect(connectorObject).toMatchObject(expectedConnectorObject);
            expect(node.noMoreValuesConnector).toBeUndefined();
        });

        it('For a node with connectors of different types', () => {
            const node = {
                guid: 'guid1',
                connector: { targetReference: 'targetRef' },
                faultConnector: { targetReference: 'targetRef2' }
            };
            const expectedConnectorObject1 = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                label: null,
                type: CONNECTOR_TYPE.REGULAR
            };

            const expectedConnectorObject2 = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef2',
                label: LABELS.faultConnectorLabel,
                type: CONNECTOR_TYPE.FAULT
            };

            const connectorObjects = createConnectorObjects(node);
            expect(connectorObjects[0]).toMatchObject(expectedConnectorObject1);
            expect(connectorObjects[1]).toMatchObject(expectedConnectorObject2);
            expect(node.connector).toBeUndefined();
            expect(node.faultConnector).toBeUndefined();
        });
    });

    describe('Creates connectors and connection properties', () => {
        it('For a node without child element connectors', () => {
            const mockElementConfig = {
                nodeConfig: {
                    maxConnections: 2
                }
            };

            const elementConfig = require.requireActual(
                'builder_platform_interaction-element-config'
            );
            elementConfig.getConfigForElementType = jest
                .fn()
                .mockReturnValue(mockElementConfig);

            const nodeId = 'guid1';

            const elements = [];
            elements[nodeId] = {
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                guid: nodeId,
                connector: {
                    targetReference: 'guid2'
                }
            };

            const expectedConnectorObject = {
                source: nodeId,
                target: 'guid2'
            };

            expect(
                createConnectorsAndConnectionProperties(nodeId, elements)[0]
            ).toMatchObject(expectedConnectorObject);

            expect(elements[nodeId].connectorCount).toEqual(1);
            expect(elements[nodeId].maxConnections).toEqual(
                mockElementConfig.nodeConfig.maxConnections
            );
        });

        it('For a node with child element connectors', () => {
            const nodeId = 'guid1';
            const childNodeId = 'childGuid1';
            const childNodeId2 = 'childGuid2';

            const elements = [];
            elements[nodeId] = {
                elementType: ELEMENT_TYPE.DECISION,
                guid: nodeId,
                outcomeReferences: [
                    { outcomeReference: childNodeId },
                    { outcomeReference: childNodeId2 }
                ],
                defaultConnector: {
                    targetReference: 'guid2'
                },
                availableConnections: [
                    {type: CONNECTOR_TYPE.REGULAR, childReference: childNodeId},
                    {type: CONNECTOR_TYPE.REGULAR, childReference: childNodeId2},
                    {type: CONNECTOR_TYPE.DEFAULT}
                ]
            };
            elements[childNodeId] = {
                elementType: ELEMENT_TYPE.OUTCOME,
                guid: childNodeId,
                connector: {
                    targetReference: 'guid3'
                }
            };
            elements[childNodeId2] = {
                elementType: ELEMENT_TYPE.OUTCOME,
                guid: childNodeId2
            };

            const expectedParentConnectorObject = {
                source: nodeId,
                target: 'guid2'
            };
            const expectedChildConnectorObject = {
                source: nodeId,
                childSource: childNodeId,
                target: 'guid3'
            };

            const connectors = createConnectorsAndConnectionProperties(
                nodeId,
                elements
            );

            expect(connectors[0]).toMatchObject(expectedParentConnectorObject);
            expect(connectors[1]).toMatchObject(expectedChildConnectorObject);

            expect(elements[nodeId].connectorCount).toEqual(2);
            expect(elements[nodeId].maxConnections).toEqual(3);
            expect(elements[nodeId].availableConnections).toEqual([{type: CONNECTOR_TYPE.REGULAR, childReference: childNodeId2}]);
        });
    });

    describe('Sets connectors on elements in the flow metadata shape', () => {
        it('For a node with a regular connector', () => {
            const elements = {
                guid1: {}
            };
            const connectorObject = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                type: CONNECTOR_TYPE.REGULAR
            };

            setConnectorsOnElements([connectorObject], elements);

            expect(elements.guid1.connector).toEqual({
                targetReference: 'targetRef'
            });
        });

        it('For a node with a child element connector', () => {
            const elements = {
                guid1: {}
            };
            const connectorObject = {
                source: 'guid0',
                childSource: 'guid1',
                target: 'targetRef',
                type: CONNECTOR_TYPE.REGULAR
            };

            setConnectorsOnElements([connectorObject], elements);

            expect(elements.guid1.connector).toEqual({
                targetReference: 'targetRef'
            });
        });

        it('For a loop node with next value connector', () => {
            const elements = {
                guid1: {}
            };
            const connectorObject = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                type: CONNECTOR_TYPE.LOOP_NEXT
            };

            setConnectorsOnElements([connectorObject], elements);

            expect(elements.guid1.nextValueConnector).toEqual({
                targetReference: 'targetRef'
            });
        });

        it('For a loop node with no more values connector', () => {
            const elements = {
                guid1: {}
            };
            const connectorObject = {
                source: 'guid1',
                childSource: null,
                target: 'targetRef',
                type: CONNECTOR_TYPE.LOOP_END
            };

            setConnectorsOnElements([connectorObject], elements);

            expect(elements.guid1.noMoreValuesConnector).toEqual({
                targetReference: 'targetRef'
            });
        });

        it('For a node with an array of regular connectors', () => {
            const elements = {
                guid1: { elementType: ELEMENT_TYPE.STEP }
            };
            const connectorObject1 = {
                source: 'guid1',
                target: 'targetRef',
                type: CONNECTOR_TYPE.REGULAR
            };
            const connectorObject2 = {
                source: 'guid1',
                target: 'targetRef2',
                type: CONNECTOR_TYPE.REGULAR
            };

            setConnectorsOnElements(
                [connectorObject1, connectorObject2],
                elements
            );

            expect(elements.guid1.connectors[0]).toEqual({
                targetReference: 'targetRef'
            });
            expect(elements.guid1.connectors[1]).toEqual({
                targetReference: 'targetRef2'
            });
        });

        it('For a node with a fault connector', () => {
            const elements = {
                guid1: {}
            };
            const connectorObject = {
                source: 'guid1',
                target: 'targetRef',
                type: CONNECTOR_TYPE.FAULT
            };

            setConnectorsOnElements([connectorObject], elements);

            expect(elements.guid1.faultConnector).toEqual({
                targetReference: 'targetRef'
            });
        });

        it('For a node with a default connector', () => {
            const elements = {
                guid1: {}
            };
            const connectorObject = {
                source: 'guid1',
                target: 'targetRef',
                label: 'connLabel',
                type: CONNECTOR_TYPE.DEFAULT
            };

            setConnectorsOnElements([connectorObject], elements);

            expect(elements.guid1.defaultConnector).toEqual({
                targetReference: 'targetRef'
            });
            expect(elements.guid1.defaultConnectorLabel).toEqual('connLabel');
        });

        it('For a node with connectors of different types', () => {
            const elements = {
                guid1: {}
            };
            const connectorObject1 = {
                source: 'guid1',
                target: 'targetRef',
                type: CONNECTOR_TYPE.REGULAR
            };
            const connectorObject2 = {
                source: 'guid1',
                target: 'targetRef2',
                type: CONNECTOR_TYPE.FAULT
            };

            setConnectorsOnElements(
                [connectorObject1, connectorObject2],
                elements
            );

            expect(elements.guid1.connector).toEqual({
                targetReference: 'targetRef'
            });

            expect(elements.guid1.faultConnector).toEqual({
                targetReference: 'targetRef2'
            });
        });
    });

    describe('Connector Picker', () => {
        it('Sorting options in connector picker for Loop Element', () => {
            const sourceElement = {
                elementType: ELEMENT_TYPE.LOOP
            };
            const comboboxOptions = [{
                label: LABELS.loopEndComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_END
            }, {
                label: LABELS.loopNextComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_NEXT
            }];

            const sortedOptions = sortConnectorPickerComboboxOptions(sourceElement, comboboxOptions);

            expect(sortedOptions).toEqual([{
                label: LABELS.loopNextComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_NEXT
            }, {
                label: LABELS.loopEndComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_END
            }]);
        });

        it('Sorting options in connector picker for Decision Element', () => {
            const sourceElement = {
                elementType: ELEMENT_TYPE.DECISION,
                outcomeReferences: [{outcomeReference: 'outcome1'}, {outcomeReference: 'outcome2'}],
            };
            const comboboxOptions = [{
                label: 'outcome 2',
                value: 'outcome2'
            }, {
                label: 'Default',
                value: CONNECTOR_TYPE.DEFAULT
            }, {
                label: 'outcome 1',
                value: 'outcome1'
            }];

            const sortedOptions = sortConnectorPickerComboboxOptions(sourceElement, comboboxOptions);

            expect(sortedOptions).toEqual([{
                label: 'outcome 1',
                value: 'outcome1'
            }, {
                label: 'outcome 2',
                value: 'outcome2'
            }, {
                label: 'Default',
                value: CONNECTOR_TYPE.DEFAULT
            }]);
        });

        it('Getting connector label and value for connector-picker combobox', () => {
            const elements = {
                'outcome_1': {
                    label: 'Outcome 1'
                }
            };
            const sourceElement = {
                defaultConnectorLabel: 'Default'
            };

            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, 'outcome_1', CONNECTOR_TYPE.REGULAR)).toEqual({
                label: 'Outcome 1',
                value: 'outcome_1'
            });
            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, null, CONNECTOR_TYPE.DEFAULT)).toEqual({
                label: 'Default',
                value: CONNECTOR_TYPE.DEFAULT
            });
            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, null, CONNECTOR_TYPE.FAULT)).toEqual({
                label: LABELS.faultConnectorLabel,
                value: CONNECTOR_TYPE.FAULT
            });
            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, null, CONNECTOR_TYPE.LOOP_NEXT)).toEqual({
                label: LABELS.loopNextComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_NEXT
            });
            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, null, CONNECTOR_TYPE.LOOP_END)).toEqual({
                label: LABELS.loopEndComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_END
            });
        });

        it('Creating new connector object from connector-picker combobox', () => {
            const elements = {
                'decision_1': {
                    defaultConnectorLabel: 'Default'
                },
                'outcome_1': {
                    label: 'Outcome 1'
                }
            };

            expect(createNewConnector(elements, 'start_1', 'assignment_1', CONNECTOR_TYPE.START)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'start_1',
                'target': 'assignment_1',
                'type': CONNECTOR_TYPE.START,
                'label': null,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'assignment_1', 'assignment_2', CONNECTOR_TYPE.REGULAR)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'assignment_1',
                'target': 'assignment_2',
                'type': CONNECTOR_TYPE.REGULAR,
                'label': null,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'decision_1', 'assignment_2', CONNECTOR_TYPE.DEFAULT)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'decision_1',
                'target': 'assignment_2',
                'type': CONNECTOR_TYPE.DEFAULT,
                'label': 'Default',
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'action_1', 'assignment_1', CONNECTOR_TYPE.FAULT)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'action_1',
                'target': 'assignment_1',
                'type': CONNECTOR_TYPE.FAULT,
                'label': LABELS.faultConnectorLabel,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'loop_1', 'assignment_1', CONNECTOR_TYPE.LOOP_NEXT)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'loop_1',
                'target': 'assignment_1',
                'type': CONNECTOR_TYPE.LOOP_NEXT,
                'label': LABELS.loopNextConnectorLabel,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'loop_1', 'assignment_2', CONNECTOR_TYPE.LOOP_END)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'loop_1',
                'target': 'assignment_2',
                'type': CONNECTOR_TYPE.LOOP_END,
                'label': LABELS.loopEndConnectorLabel,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'decision_1', 'loop_1', 'outcome_1')).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'decision_1',
                'target': 'loop_1',
                'type': CONNECTOR_TYPE.REGULAR,
                'label': 'Outcome 1',
                'childSource': 'outcome_1',
                'config': {
                    'isSelected': false,
                }
            });
        });
    });
});
