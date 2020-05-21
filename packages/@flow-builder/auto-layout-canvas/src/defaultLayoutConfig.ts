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
                    addOffset: gridHeight * 3,
                    h: 6 * gridHeight,
                    labelOffset: gridHeight,
                    variants: {
                        edge: {
                            svgMarginTop: gridHeight
                        },
                        center: {},
                        default: {}
                    }
                },
                branchHead: {
                    addOffset: gridHeight * 4.5,
                    labelOffset: gridHeight * 2,
                    h: 7 * gridHeight,
                    variants: {
                        edge: {
                            svgMarginTop: gridHeight
                        },
                        center: { svgMarginBottom: -gridHeight },
                        default: {}
                    }
                },
                branchEmptyHead: {
                    addOffset: gridHeight * 4.5,
                    labelOffset: gridHeight * 2,
                    h: 6 * gridHeight,
                    variants: {
                        edge: {
                            svgMarginTop: gridHeight,
                            svgMarginBottom: gridHeight
                        },
                        center: { svgMarginBottom: -gridHeight },
                        default: {}
                    }
                },
                branchTail: {
                    addOffset: gridHeight * 3,
                    h: 5 * gridHeight,
                    variants: {
                        edge: {
                            svgMarginBottom: gridHeight
                        },
                        center: { svgMarginBottom: -gridHeight },
                        default: {}
                    }
                },
                postMerge: {
                    addOffset: gridHeight * 2,
                    h: 5 * gridHeight,
                    svgMarginTop: gridHeight,
                    variants: {
                        edge: { svgMarginBottom: gridHeight },
                        center: { svgMarginBottom: -gridHeight },
                        default: {}
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
                start: {
                    w: 100,
                    h: 200
                },
                end: {
                    w: 100,
                    h: 150
                }
            }
        },
        branch: {
            defaultWidth: gridWidth * 2,
            emptyWidth: gridWidth * (3 / 2)
        }
    };
}
