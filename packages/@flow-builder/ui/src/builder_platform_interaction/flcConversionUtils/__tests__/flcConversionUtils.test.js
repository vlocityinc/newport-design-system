// @ts-nocheck
import { deepCopy } from 'builder_platform_interaction/storeLib';

import sanity from './flcUiModels/sanity';
import oneScreen from './flcUiModels/one-screen';
import oneElementWithFault from './flcUiModels/one-element-with-fault';
import decisionOneChildOnEachBranchNextIsNotEnd from './flcUiModels/decision-one-child-on-each-branch-next-is-not-end';

import { convertFromFlc, convertToFlc } from '../flcConversionUtils';

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

jest.mock('builder_platform_interaction/contextLib', () => {
    return require('builder_platform_interaction_mocks/contextLib');
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
    let ffcUiModel;
    it('from flc', () => {
        ffcUiModel = sortCanvasElementsAndConnectors(convertFromFlc(deepCopy(flcUiModel)));
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
});
