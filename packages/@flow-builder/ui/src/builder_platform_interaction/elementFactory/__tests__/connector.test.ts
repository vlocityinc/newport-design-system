// @ts-nocheck
import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createConnectorObjects, createConnectorMetadataObjects, createStartElementConnector } from '../connector';
import { LABELS } from '../elementFactoryLabels';

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return 'testGUID';
        })
    };
});

describe('Connector Factory', () => {
    describe('createConnectorObjects function', () => {
        it('returns connector objects for regular connectors', () => {
            const element = { guid: 'sourceGuid', connector: { targetReference: 'targetGuid' } };
            const expectedConnectors = [
                {
                    guid: 'testGUID',
                    source: 'sourceGuid',
                    childSource: null,
                    target: 'targetGuid',
                    label: null,
                    type: CONNECTOR_TYPE.REGULAR,
                    config: { isSelected: false }
                }
            ];
            expect(createConnectorObjects(element, element.guid)).toEqual(expectedConnectors);
        });

        it('returns connector objects for regular connectors with child source', () => {
            const element = { guid: 'childSourceGuid', label: 'child1', connector: { targetReference: 'targetGuid' } };
            const expectedConnectors = [
                {
                    guid: 'testGUID',
                    source: 'parentGuid',
                    childSource: 'childSourceGuid',
                    target: 'targetGuid',
                    label: 'child1',
                    type: CONNECTOR_TYPE.REGULAR,
                    config: { isSelected: false }
                }
            ];
            expect(createConnectorObjects(element, element.guid, 'parentGuid')).toEqual(expectedConnectors);
        });

        it('returns connector objects for regular connectors with gotos', () => {
            const element = { guid: 'sourceGuid', connector: { targetReference: 'targetGuid', isGoTo: true } };
            const expectedConnectors = [
                {
                    guid: 'testGUID',
                    source: 'sourceGuid',
                    childSource: null,
                    target: 'targetGuid',
                    label: null,
                    type: CONNECTOR_TYPE.REGULAR,
                    isGoTo: true,
                    config: { isSelected: false }
                }
            ];
            expect(createConnectorObjects(element, element.guid)).toEqual(expectedConnectors);
        });

        it('returns connector objects for immediate connectors', () => {
            const element = { guid: 'sourceGuid', connector: { targetReference: 'targetGuid' } };
            const expectedConnectors = [
                {
                    guid: 'testGUID',
                    source: 'sourceGuid',
                    childSource: null,
                    target: 'targetGuid',
                    label: LABELS.immediateConnectorLabel,
                    type: CONNECTOR_TYPE.IMMEDIATE,
                    config: { isSelected: false }
                }
            ];
            expect(createConnectorObjects(element, element.guid, null, true)).toEqual(expectedConnectors);
        });

        it('returns connector objects for loop connectors', () => {
            const element = {
                guid: 'sourceGuid',
                nextValueConnector: { targetReference: 'targetGuid1', isGoTo: true },
                noMoreValuesConnector: { targetReference: 'targetGuid2', isGoTo: true }
            };
            const expectedConnectors = [
                {
                    guid: 'testGUID',
                    source: 'sourceGuid',
                    childSource: null,
                    target: 'targetGuid1',
                    label: LABELS.loopNextConnectorLabel,
                    type: CONNECTOR_TYPE.LOOP_NEXT,
                    isGoTo: true,
                    config: { isSelected: false }
                },
                {
                    guid: 'testGUID',
                    source: 'sourceGuid',
                    childSource: null,
                    target: 'targetGuid2',
                    label: LABELS.loopEndConnectorLabel,
                    type: CONNECTOR_TYPE.LOOP_END,
                    isGoTo: true,
                    config: { isSelected: false }
                }
            ];
            expect(createConnectorObjects(element, element.guid)).toEqual(expectedConnectors);
        });

        it('returns connector objects for fault connectors', () => {
            const element = {
                guid: 'sourceGuid',
                connector: { targetReference: 'targetGuid1' },
                faultConnector: { targetReference: 'targetGuid2', isGoTo: true }
            };
            const expectedConnectors = [
                {
                    guid: 'testGUID',
                    source: 'sourceGuid',
                    childSource: null,
                    target: 'targetGuid1',
                    label: null,
                    type: CONNECTOR_TYPE.REGULAR,
                    config: { isSelected: false }
                },
                {
                    guid: 'testGUID',
                    source: 'sourceGuid',
                    childSource: null,
                    target: 'targetGuid2',
                    label: LABELS.faultConnectorLabel,
                    type: CONNECTOR_TYPE.FAULT,
                    isGoTo: true,
                    config: { isSelected: false }
                }
            ];
            expect(createConnectorObjects(element, element.guid)).toEqual(expectedConnectors);
        });

        it('returns connector objects for default connectors', () => {
            const element = {
                guid: 'sourceGuid',
                defaultConnector: { targetReference: 'targetGuid', isGoTo: true },
                defaultConnectorLabel: 'defaultConnLabel'
            };
            const expectedConnectors = [
                {
                    guid: 'testGUID',
                    source: 'sourceGuid',
                    childSource: null,
                    target: 'targetGuid',
                    label: 'defaultConnLabel',
                    type: CONNECTOR_TYPE.DEFAULT,
                    isGoTo: true,
                    config: { isSelected: false }
                }
            ];
            expect(createConnectorObjects(element, element.guid)).toEqual(expectedConnectors);
        });
    });

    describe('createConnectorMetadataObjects function', () => {
        it('returns connector objects for regular connectors', () => {
            const connectors = [{ type: CONNECTOR_TYPE.REGULAR, target: 'targetGuid' }];
            const expectedConnectors = {
                connector: {
                    targetReference: 'targetGuid',
                    isGoTo: undefined
                }
            };
            expect(createConnectorMetadataObjects(connectors)).toEqual(expectedConnectors);
        });

        it('returns connector objects for regular connectors with gotos', () => {
            const connectors = [{ type: CONNECTOR_TYPE.REGULAR, target: 'targetGuid', isGoTo: true }];
            const expectedConnectors = {
                connector: {
                    targetReference: 'targetGuid',
                    isGoTo: true
                }
            };
            expect(createConnectorMetadataObjects(connectors)).toEqual(expectedConnectors);
        });

        it('returns connector objects for immediate connectors', () => {
            const connectors = [{ type: CONNECTOR_TYPE.IMMEDIATE, target: 'targetGuid' }];
            const expectedConnectors = {
                connector: {
                    targetReference: 'targetGuid',
                    isGoTo: undefined
                }
            };
            expect(createConnectorMetadataObjects(connectors)).toEqual(expectedConnectors);
        });

        it('returns connector objects for loop connectors', () => {
            const connectors = [
                { type: CONNECTOR_TYPE.LOOP_NEXT, target: 'targetGuid' },
                { type: CONNECTOR_TYPE.LOOP_END, target: 'targetGuid2', isGoTo: true }
            ];
            const expectedConnectors = {
                nextValueConnector: {
                    targetReference: 'targetGuid',
                    isGoTo: undefined
                },
                noMoreValuesConnector: {
                    targetReference: 'targetGuid2',
                    isGoTo: true
                }
            };
            expect(createConnectorMetadataObjects(connectors)).toEqual(expectedConnectors);
        });

        it('returns connector objects for fault connectors', () => {
            const connectors = [
                { type: CONNECTOR_TYPE.REGULAR, target: 'targetGuid' },
                { type: CONNECTOR_TYPE.FAULT, target: 'targetGuid2' }
            ];
            const expectedConnectors = {
                connector: {
                    targetReference: 'targetGuid',
                    isGoTo: undefined
                },
                faultConnector: {
                    targetReference: 'targetGuid2',
                    isGoTo: undefined
                }
            };
            expect(createConnectorMetadataObjects(connectors)).toEqual(expectedConnectors);
        });

        it('returns connector objects for default connectors', () => {
            const connectors = [{ type: CONNECTOR_TYPE.DEFAULT, target: 'targetGuid', label: 'defaultConnLabel' }];
            const expectedConnectors = {
                defaultConnector: {
                    targetReference: 'targetGuid',
                    isGoTo: undefined
                },
                defaultConnectorLabel: 'defaultConnLabel'
            };
            expect(createConnectorMetadataObjects(connectors)).toEqual(expectedConnectors);
        });
    });

    describe('createStartElementConnector function', () => {
        it('returns connector object for start element', () => {
            const expectedConnector = [
                {
                    guid: 'testGUID',
                    source: 'startGuid',
                    childSource: null,
                    target: 'targetGuid',
                    label: null,
                    type: CONNECTOR_TYPE.REGULAR,
                    config: { isSelected: false }
                }
            ];
            expect(createStartElementConnector('startGuid', 'targetGuid')).toEqual(expectedConnector);
        });
    });
});
