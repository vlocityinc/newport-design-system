import { FlowDataProvider } from '../flowDataProvider/flowDataProvider';
import { FLOW_PROPERTIES } from '../flowDataProvider/flow';

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
        screen: {
            elementMetadata: 'y'
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
                const { screen } = metadata;
                expect(Object.keys(screen)).toHaveLength(1);
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
