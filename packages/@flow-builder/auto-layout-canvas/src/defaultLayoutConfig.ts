import { LayoutConfig } from './flowRendererUtils';

/**
 * Returns the default config for the layout algorithm
 *
 * @returns The default LayoutConfig for the layout
 */
export function getDefaultLayoutConfig(): LayoutConfig {
    const gridHeight = 24;
    const gridWidth = 132;

    return {
        grid: {
            w: gridWidth,
            h: gridHeight
        },
        menu: {
            marginBottom: gridHeight
        },
        connector: {
            icon: {
                w: 20,
                h: 20
            },
            strokeWidth: 6,
            curveRadius: 16,
            menu: {
                w: 100,
                h: 328
            },
            types: {
                straight: {
                    addOffset: gridHeight * 2.5,
                    h: gridHeight * 5,
                    labelOffset: gridHeight,
                    variants: {
                        edge: {
                            svgMarginTop: gridHeight
                        },
                        center: {},
                        default: {},
                        loop: {}
                    }
                },
                branchHead: {
                    addOffset: gridHeight * 3.5,
                    labelOffset: gridHeight * 2,
                    h: 6 * gridHeight,
                    variants: {
                        edge: {
                            svgMarginTop: gridHeight
                        },
                        center: { svgMarginBottom: -gridHeight },
                        default: {},
                        loop: {}
                    }
                },
                branchEmptyHead: {
                    addOffset: gridHeight * 3.5,
                    labelOffset: gridHeight * 2,
                    h: 5 * gridHeight,
                    variants: {
                        edge: {
                            svgMarginTop: gridHeight,
                            svgMarginBottom: gridHeight
                        },
                        center: { svgMarginBottom: -gridHeight },
                        default: {},
                        loop: { svgMarginBottom: gridHeight * 2 }
                    }
                },
                loopAfterLast: {
                    h: 0,
                    addOffset: 0,
                    labelOffset: gridHeight * 2
                },
                branchTail: {
                    addOffset: gridHeight * 2.5,
                    h: 4 * gridHeight,
                    variants: {
                        edge: {
                            svgMarginBottom: gridHeight
                        },
                        center: { svgMarginBottom: -gridHeight },
                        default: {},
                        loop: { svgMarginBottom: gridHeight * 2 }
                    }
                },
                postMerge: {
                    addOffset: gridHeight * 1.5,
                    h: 4 * gridHeight,
                    svgMarginTop: gridHeight,
                    variants: {
                        edge: { svgMarginBottom: gridHeight },
                        center: { svgMarginBottom: -gridHeight },
                        default: {},
                        loop: {}
                    }
                }
            }
        },
        node: {
            icon: {
                w: 48,
                h: 48
            },
            offsetX: (gridWidth * 2) / 3,
            w: gridWidth * 2,
            menu: {
                default: {
                    w: 100,
                    h: 225
                },
                branch: {
                    w: 100,
                    h: 225
                },
                loop: {
                    w: 100,
                    h: 225
                },
                start: {
                    w: 100,
                    h: 200
                }
            }
        },
        branch: {
            defaultWidth: gridWidth * 2,
            emptyWidth: (gridWidth * 4) / 3
        }
    };
}
