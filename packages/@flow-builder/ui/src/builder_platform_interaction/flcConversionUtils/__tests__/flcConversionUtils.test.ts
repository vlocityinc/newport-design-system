// @ts-nocheck
import { deepCopy } from 'builder_platform_interaction/storeLib';

import sanity from './flcUiModels/sanity';
import oneScreen from './flcUiModels/one-screen';
import oneElementWithFault from './flcUiModels/one-element-with-fault';
import decisionOneChildOnEachBranchNextIsNotEnd from './flcUiModels/decision-one-child-on-each-branch-next-is-not-end';

import { convertFromFlc, convertToFlc, canConvertToFlc } from '../flcConversionUtils';

jest.mock('builder_platform_interaction/elementFactory', () => {
    const flowMetadata = require('builder_platform_interaction/flowMetadata');
    return {
        createConnector: (source, childSource, target, label, type, isSelected = false) => {
            return {
                guid: `${source} -> ${target}`,
                source,
                childSource,
                target,
                label,
                type,
                config: { isSelected }
            };
        },
        createEndElement: ({ prev }) => {
            return {
                guid: `end-element-guid (${prev})`,
                elementType: flowMetadata.ELEMENT_TYPE.END_ELEMENT,
                prev,
                next: null
            };
        }
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = require('builder_platform_interaction_mocks/storeLib');

    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return 'end-element-guid';
        }),
        deepCopy: actual.deepCopy
    };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        shouldUseAutoLayoutCanvas: jest.fn()
    };
});

function sortCanvasElementsAndConnectors({ elements, canvasElements, connectors }) {
    canvasElements.sort();
    connectors = connectors
        .sort((a, b) => b.guid.localeCompare(a.guid))
        .map(connector => {
            if (connector.childSource == null) {
                delete connector.childSource;
            }
            return connector;
        });
    return { elements, canvasElements, connectors };
}

function testConversions(flcUiModel) {
    const ffcUiModel = sortCanvasElementsAndConnectors(convertFromFlc(deepCopy(flcUiModel), 1250));

    it('from flc', () => {
        expect(ffcUiModel).toMatchSnapshot();
    });

    it('to flc', () => {
        expect(convertToFlc(deepCopy(ffcUiModel))).toEqual(flcUiModel);
    });
}

describe('converts', () => {
    describe('sanity', () => {
        testConversions(sanity);
    });

    describe('one-screen', () => {
        testConversions(oneScreen);
    });

    describe('one decision with one child on each branch, followed by a screen element', () => {
        testConversions(decisionOneChildOnEachBranchNextIsNotEnd);
    });

    describe('one element with fault', () => {
        testConversions(oneElementWithFault);
    });

    describe('can convert to flc', () => {
        describe('empty flow is valid', () => {
            const startGuid = 'start';
            const connectors = [{ source: 'start', target: null }];
            expect(canConvertToFlc(startGuid, connectors)).toBeTruthy();
        });

        describe('if flow is valid', () => {
            const startGuid = 'start';
            const connectors = [
                { source: 'start', target: 'if' },
                { source: 'if', target: 'n1' },
                { source: 'if', target: 'n2' },
                { source: 'n1', target: 'merge' },
                { source: 'n2', target: 'merge' }
            ];
            expect(canConvertToFlc(startGuid, connectors)).toBeTruthy();
        });

        // describe('loop flow is valid', () => {
        //     const startGuid = 'start';
        //     const connectors = [
        //         { source: 'start', target: 'loop' },
        //         { source: 'loop', target: 'n1' },
        //         { source: 'loop', target: 'n2' },
        //         { source: 'n1', target: 'loop' }
        //     ];
        //     expect(canConvertToFlc(startGuid, connectors)).toBeTruthy();
        // });

        describe('cross if flow invalid', () => {
            const startGuid = 'start';
            const connectors = [
                { source: 'start', target: 'if' },
                { source: 'if', target: 'n1' },
                { source: 'if', target: 'n2' },
                { source: 'n1', target: 'n2' },
                { source: 'n1', target: 'merge' },
                { source: 'n2', target: 'merge' }
            ];
            expect(canConvertToFlc(startGuid, connectors)).toBeFalsy();
        });

        describe('loop back before if flow is invalid', () => {
            const startGuid = 'start';
            const connectors = [
                { source: 'start', target: 'if' },
                { source: 'if', target: 'n1' },
                { source: 'if', target: 'n2' },
                { source: 'n1', target: 'start' }
            ];
            expect(canConvertToFlc(startGuid, connectors)).toBeFalsy();
        });

        describe('loop back to if flow is invalid', () => {
            const startGuid = 'start';
            const connectors = [
                { source: 'start', target: 'if' },
                { source: 'if', target: 'n1' },
                { source: 'if', target: 'n2' },
                { source: 'n1', target: 'if' }
            ];
            expect(canConvertToFlc(startGuid, connectors)).toBeFalsy();
        });

        describe('jump out of if flow is invalid', () => {
            const startGuid = 'start';
            const connectors = [
                { source: 'start', target: 'if' },
                { source: 'if', target: 'n1' },
                { source: 'if', target: 'n2' },
                { source: 'n1', target: 'merge' },
                { source: 'n2', target: 'merge' },
                { source: 'merge', target: 'n3' },
                { source: 'n1', target: 'n3' }
            ];
            expect(canConvertToFlc(startGuid, connectors)).toBeFalsy();
        });
    });
});
