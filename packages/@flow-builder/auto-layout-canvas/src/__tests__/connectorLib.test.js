import {
    createBranchConnector,
    createMergeConnector,
    createConnectorToNextNode,
    createLoopBackConnector,
    createLoopAfterLastConnector
} from '../connectorLib';
import ConnectorType from '../ConnectorTypeEnum';
import { ConnectorVariant } from '../flowRendererUtils';
import { getDefaultLayoutConfig } from '../defaultLayoutConfig';
import ConnectorLabelType from '../ConnectorLabelTypeEnum';

jest.mock('../svgUtils.ts', () => {
    return {
        createSvgInfo: (svgPathParams, startOffset) => ({ svgPathParams, startOffset }),
        createOffsetLocation: (location, offset) => ({ location, offset }),
        createSvgPath: (pathParams, startOffset) => ({ pathParams, startOffset })
    };
});

describe('connectorLib', () => {
    it('createLoopBackConnector', () => {
        const connectorRenderInfo = createLoopBackConnector(
            'guid',
            { x: 0, y: 0, w: 88, h: 168 },
            getDefaultLayoutConfig(),
            false,
            false,
            false
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createLoopAfterLastConnector', () => {
        const connectorRenderInfo = createLoopAfterLastConnector(
            'guid',
            { x: -88, y: 0, w: 88, h: 168 },
            getDefaultLayoutConfig(),
            false,
            false,
            48,
            true
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createBranchConnector', () => {
        const connectorRenderInfo = createBranchConnector(
            'guid',
            0,
            { x: 0, y: 0, w: 100, h: 28 },
            ConnectorType.BRANCH_LEFT,
            getDefaultLayoutConfig(),
            false,
            true,
            true
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createMergeConnector', () => {
        const connectorRenderInfo = createMergeConnector(
            'guid',
            0,
            { x: 0, y: 0, w: 100, h: 28 },
            ConnectorType.MERGE_LEFT,
            getDefaultLayoutConfig(),
            false,
            true,
            true
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createConnectorToNextNode with Straight connector type', () => {
        const connectorRenderInfo = createConnectorToNextNode(
            { next: 'nextGuid', prev: 'prevGuid' },
            ConnectorType.STRAIGHT,
            ConnectorLabelType.NONE,
            0,
            144,
            false,
            getDefaultLayoutConfig(),
            false,
            ConnectorVariant.DEFAULT,
            false,
            0,
            48,
            undefined
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createConnectorToNextNode with GoTo connector type and Branch Head', () => {
        const connectorRenderInfo = createConnectorToNextNode(
            { parent: 'parentGuid', childIndex: 0 },
            ConnectorType.GO_TO,
            ConnectorLabelType.BRANCH,
            0,
            132,
            false,
            getDefaultLayoutConfig(),
            false,
            [ConnectorVariant.BRANCH_HEAD, ConnectorVariant.EDGE],
            false,
            84,
            48,
            'Badge Label',
            false,
            'Target Label'
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createConnectorToNextNode with GoTo connector type and Default variant', () => {
        const connectorRenderInfo = createConnectorToNextNode(
            { next: 'nextGuid', prev: 'prevGuid' },
            ConnectorType.GO_TO,
            ConnectorLabelType.NONE,
            0,
            108,
            false,
            getDefaultLayoutConfig(),
            false,
            [ConnectorVariant.DEFAULT, ConnectorVariant.CENTER],
            false,
            60,
            48,
            undefined,
            false,
            'Target Label'
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createConnectorToNextNode with GoTo connector type and Post Merge variant', () => {
        const connectorRenderInfo = createConnectorToNextNode(
            { next: 'nextGuid', prev: 'prevGuid' },
            ConnectorType.GO_TO,
            ConnectorLabelType.NONE,
            96,
            120,
            false,
            getDefaultLayoutConfig(),
            false,
            [ConnectorVariant.POST_MERGE, ConnectorVariant.CENTER],
            false,
            36,
            48,
            undefined,
            false,
            'Target Label'
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createConnectorToNextNode with GoTo connector type and Fault variant', () => {
        const connectorRenderInfo = createConnectorToNextNode(
            { parent: 'parentGuid', childIndex: -1 },
            ConnectorType.GO_TO,
            ConnectorLabelType.FAULT,
            0,
            108,
            false,
            getDefaultLayoutConfig(),
            false,
            [ConnectorVariant.FAULT, ConnectorVariant.CENTER],
            false,
            60,
            24,
            'Fault Badge Label',
            false,
            'Target Label'
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });
});
