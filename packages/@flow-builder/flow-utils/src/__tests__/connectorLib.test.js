import { createBranchConnector, createMergeConnector, createConnectorToNextNode } from '../connectorLib';
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
    it('createBranchConnector', () => {
        const connectorRenderInfo = createBranchConnector(
            'guid',
            0,
            { x: 0, y: 0, w: 100, h: 28 },
            ConnectorType.BRANCH_LEFT,
            getDefaultLayoutConfig(),
            false
        );

        const expectedConnectorRenderInfo = {
            connectionInfo: {
                childIndex: 0,
                parent: 'guid'
            },
            geometry: {
                h: 28,
                w: 100,
                x: 0,
                y: 0
            },
            isFault: false,
            svgInfo: {
                startOffset: [3, 3],
                svgPathParams: {
                    offsets: [
                        [-84, 0],
                        [-16, 16],
                        [0, 12]
                    ],
                    start: {
                        x: 100,
                        y: 0
                    }
                }
            },
            type: 'branchLeft'
        };

        expect(connectorRenderInfo).toEqual(expectedConnectorRenderInfo);
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

        const expectedConnectorRenderInfo = {
            connectionInfo: {
                childIndex: 0,
                parent: 'guid'
            },
            geometry: {
                h: 28,
                w: 100,
                x: 0,
                y: 0
            },
            isFault: false,
            svgInfo: {
                startOffset: [3, 0],
                svgPathParams: {
                    offsets: [
                        [0, -2],
                        [16, 16],
                        [68, 0],
                        [16, 16],
                        [0, -2]
                    ],
                    start: {
                        x: 0,
                        y: 0
                    }
                }
            },
            type: 'mergeLeft'
        };

        expect(connectorRenderInfo).toEqual(expectedConnectorRenderInfo);
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

        const expectedConnectorRenderInfo = {
            addInfo: {
                menuOpened: false,
                offsetY: 72
            },
            conditionOptions: undefined,
            conditionType: undefined,
            conditionValue: undefined,
            connectionInfo: {
                next: 'nextGuid',
                prev: 'prevGuid'
            },
            geometry: {
                h: 144,
                w: 6,
                x: 0,
                y: 0
            },
            isFault: false,
            labelOffsetY: 24,
            svgInfo: {
                geometry: {
                    h: 144,
                    w: 6,
                    x: -3,
                    y: 0
                },
                path: {
                    pathParams: {
                        offsets: [[0, 144]],
                        start: {
                            location: {
                                x: 0,
                                y: 0
                            },
                            offset: [3, 0]
                        }
                    },
                    startOffset: undefined
                }
            },
            type: 'straight'
        };
        expect(connectorRenderInfo).toEqual(expectedConnectorRenderInfo);
    });
});
