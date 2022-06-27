// @ts-nocheck
import { AutoLayoutCanvasMode, CanvasContext } from 'builder_platform_interaction/alcComponentsUtils';
import { NodeRenderInfo } from 'builder_platform_interaction/autoLayoutCanvas';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { flowModelWithLoop, flowModelWithScreenGoTo } from './mockData.ts';

const tag = 'builder_platform_interaction-alc-compound-node';

const defaultCanvasContext: CanvasContext = {
    mode: AutoLayoutCanvasMode.DEFAULT,
    incomingStubGuid: null,
    connectorMenuMetadata: {}
};

const getLoopNodeRenderInfo: NodeRenderInfo = () => {
    return {
        metadata: {
            dynamicNodeComponent: null
        },
        logicConnectors: [
            {
                geometry: {},
                svgInfo: {
                    geometry: {},
                    endLocation: {}
                },
                type: 'loopAfterLast',
                source: {
                    guid: 'loop'
                },
                isHighlighted: true,
                operationType: 'delete'
            },
            {
                geometry: {},
                svgInfo: {
                    geometry: {},
                    endLocation: {}
                },
                source: {
                    guid: 'loop'
                },
                type: 'loopBack',
                isHighlighted: false,
                operationType: undefined
            }
        ],
        nextConnector: {
            type: 'nextConnector',
            source: { guid: 'loop' },
            svgInfo: {
                geometry: {},
                endLocation: {}
            }
        },
        guid: 'loop'
    };
};

const getGoToScreenNodeRenderInfo: NodeRenderInfo = () => {
    return {
        metadata: {
            dynamicNodeComponent: null
        },
        nextConnector: {
            type: 'goTo',
            source: {
                guid: 's2'
            },
            svgInfo: {
                geometry: {},
                endLocation: {}
            }
        },
        guid: 's2'
    };
};

const defaultOptions = {
    canvasContext: defaultCanvasContext
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent(tag, defaultOptions, overrideOptions);
};

describe('alcCompoundNode tests', () => {
    describe('loop connectors', () => {
        let loopCompoundNode;
        let alcConnectors;
        beforeEach(async () => {
            loopCompoundNode = await createComponentUnderTest({
                node: getLoopNodeRenderInfo(),
                flowModel: flowModelWithLoop
            });
            alcConnectors = loopCompoundNode.shadowRoot.querySelectorAll('builder_platform_interaction-alc-connector');
        });

        it('Should have 3 connectors', async () => {
            expect(alcConnectors.length).toEqual(3);
        });

        it('After Last connector should have the loop after last class', async () => {
            const afterLastConnector = alcConnectors[0];
            expect(afterLastConnector.classList.value.includes('loopAfterLast')).toBeTruthy();
        });

        it('After Last connector should have the is-highlighted class', async () => {
            const afterLastConnector = alcConnectors[0];
            expect(afterLastConnector.classList.value.includes('is-highlighted')).toBeTruthy();
        });

        it('After Last connector should not have the to-be-deleted-or-cut class', async () => {
            const afterLastConnector = alcConnectors[0];
            expect(afterLastConnector.classList.value.includes('to-be-deleted-or-cut')).toBeTruthy();
        });

        it('Loop Back Connector should have the loop back class', async () => {
            const loopBackConnector = alcConnectors[1];
            expect(loopBackConnector.classList.value.includes('loopBack')).toBeTruthy();
        });

        it('Loop Back Connector should not have is-highlighted class', async () => {
            const loopBackConnector = alcConnectors[1];
            expect(loopBackConnector.classList.value.includes('is-highlighted')).toBeFalsy();
        });

        it('Loop Back Connector should not have to-be-deleted-or-cut class', async () => {
            const loopBackConnector = alcConnectors[1];
            expect(loopBackConnector.classList.value.includes('to-be-deleted-or-cut')).toBeFalsy();
        });

        it('Next connector should have the right classes', async () => {
            const nextConnector = alcConnectors[2];
            expect(nextConnector.classList.value.includes('nextConnector')).toBeTruthy();
        });
    });

    describe('goTo connectors', () => {
        let goToCompoundNode;
        let alcConnectors;
        beforeEach(async () => {
            goToCompoundNode = await createComponentUnderTest({
                node: getGoToScreenNodeRenderInfo(),
                flowModel: flowModelWithScreenGoTo
            });
            alcConnectors = goToCompoundNode.shadowRoot.querySelectorAll('builder_platform_interaction-alc-connector');
        });

        it('Should have 1 connector', async () => {
            expect(alcConnectors.length).toEqual(1);
        });

        it('GoTo connector should have the right classes', async () => {
            const goToConnector = alcConnectors[0];
            expect(goToConnector.classList.value.includes('goTo')).toBeTruthy();
        });
    });
});
