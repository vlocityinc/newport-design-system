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
            false
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
            false
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
            false
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });

    it('createConnectorToNextNode', () => {
        const connectorRenderInfo = createConnectorToNextNode(
            { next: 'nextGuid', prev: 'prevGuid' },
            ConnectorType.STRAIGHT,
            0,
            144,
            false,
            getDefaultLayoutConfig(),
            false,
            ConnectorVariant.DEFAULT
        );

        expect(connectorRenderInfo).toMatchSnapshot();
    });
});
