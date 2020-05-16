// @ts-nocheck
import { FlowDataProvider } from '../flowDataProvider/flowDataProvider';
import { FLOW_PROPERTIES } from '../flowDataProvider/flow';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const flowModel = {
    name: 'flowName',
    version: 'flowVersion',
    metadata: {
        start: {
            locationX: 50,
            locationY: 50,
            connector: {
                targetReference: 'test1232'
            },
            filters: []
        },
        screens: {
            name: 'screenElement',
            elementMetadata: 'y',
            connector: {
                targetReference: 'test1232'
            },
            faultConnector: {
                targetReference: 'faultTarget'
            }
        },
        otherProperty1: 'stringProperty',
        otherProperty2: {
            otherSubProperty1: 'subProperty1'
        }
    }
};

describe('dataprovider flow translation', () => {
    let flowDataProvider;
    describe('provide', () => {
        beforeEach(() => {
            flowDataProvider = new FlowDataProvider();
        });
        it('no data', () => {
            const flow = undefined;
            expect(() => {
                flowDataProvider.updateFlow(flow);
            }).toThrowError(/undefined/);
        });
        it('return type', () => {
            flowDataProvider.updateFlow(flowModel);
            const type = flowDataProvider.provide()[0].type;
            expect(type).toBe(FLOW_PROPERTIES.TYPE);
        });
        it('return version', () => {
            flowDataProvider.updateFlow(flowModel);
            const versionNumber = flowDataProvider.provide()[0].version;
            expect(versionNumber).toBe('flowVersion');
        });
        it('return name', () => {
            flowDataProvider.updateFlow(flowModel);
            expect(flowDataProvider.provide()[0].name).toBe('flowName');
        });
        it('return consumer properties', () => {
            flowDataProvider.updateFlow(flowModel);
            const consumerProperties = flowDataProvider.provide()[0].consumerProperties;
            expect(consumerProperties.hasOwnProperty(FLOW_PROPERTIES.CONNECTOR_TARGETS)).toBe(true);
            // Verify undefined start element name has been replaced with start type
            expect(
                consumerProperties[FLOW_PROPERTIES.CONNECTOR_TARGETS].hasOwnProperty(ELEMENT_TYPE.START_ELEMENT)
            ).toBe(true);
            // Verify connectors of the 'screenElement'
            expect(consumerProperties[FLOW_PROPERTIES.CONNECTOR_TARGETS].hasOwnProperty('screenElement')).toBe(true);
            expect(consumerProperties[FLOW_PROPERTIES.CONNECTOR_TARGETS].screenElement.next).toContain('test1232');
            // Verify faultConnectors are not added into the connector targets map
            expect(consumerProperties[FLOW_PROPERTIES.CONNECTOR_TARGETS].screenElement.next).not.toContain(
                'faultTarget'
            );
        });
        describe('return metadata', () => {
            it('with start element', () => {
                flowDataProvider.updateFlow(flowModel);
                const metadata = flowDataProvider.provide()[0];
                const { start } = metadata;
                expect(start[0].type).toBe('START_ELEMENT');
            });
            it('with screen element', () => {
                flowDataProvider.updateFlow(flowModel);
                const metadata = flowDataProvider.provide()[0];
                const { screens } = metadata;
                expect(screens[0].type).toBe('Screen');
            });
            it('with regular element having name property', () => {
                flowDataProvider.updateFlow(flowModel);
                const metadata = flowDataProvider.provide()[0];
                const { otherProperty2 } = metadata;
                expect(otherProperty2.otherSubProperty1).toBe('subProperty1');
            });
        });
    });
});
