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
                    labelOffset: gridHeight * 2,
                    variants: {
                        defaultLabel: {
                            addOffset: gridHeight * 3.5,
                            h: 6 * gridHeight
                        },
                        fault: {
                            labelOffset: gridHeight,
                            svgMarginTop: gridHeight
                        },
                        postMerge: {
                            addOffset: gridHeight * 1.5,
                            h: 4 * gridHeight,
                            svgMarginTop: gridHeight,
                            svgMarginBottom: gridHeight,
                            variants: {
                                center: { svgMarginBottom: -gridHeight }
                            }
                        },
                        postMergeTail: {
                            addOffset: gridHeight * 1.5,
                            h: 3 * gridHeight,
                            svgMarginTop: gridHeight,
                            svgMarginBottom: gridHeight,
                            variants: {
                                center: { svgMarginBottom: -gridHeight },
                                loop: {
                                    svgMarginBottom: 2 * gridHeight
                                }
                            }
                        },
                        branchTail: {
                            h: 4 * gridHeight,
                            svgMarginBottom: gridHeight,
                            variants: {
                                center: { svgMarginBottom: -gridHeight },
                                loop: {
                                    svgMarginBottom: 2 * gridHeight
                                }
                            }
                        },
                        branchHead: {
                            addOffset: gridHeight * 3.5,
                            h: 6 * gridHeight,
                            svgMarginTop: gridHeight,
                            variants: {
                                center: { svgMarginBottom: -gridHeight },
                                fault: {
                                    labelOffset: gridHeight,
                                    svgMarginTop: gridHeight
                                }
                            }
                        },
                        branchHeadEmpty: {
                            addOffset: gridHeight * 3.5,
                            h: 5 * gridHeight,
                            svgMarginTop: gridHeight,
                            svgMarginBottom: gridHeight,
                            variants: {
                                loop: {
                                    svgMarginBottom: 2 * gridHeight
                                },
                                center: { svgMarginBottom: -gridHeight },
                                fault: {
                                    labelOffset: gridHeight,
                                    svgMarginTop: gridHeight
                                }
                            }
                        }
                    }
                },
                goTo: {
                    addOffset: gridHeight * 2.5,
                    h: gridHeight * 4.5,
                    labelOffset: gridHeight * 2,
                    variants: {
                        postMerge: {
                            addOffset: gridHeight * 1.5,
                            h: gridHeight * 3.5,
                            svgMarginTop: gridHeight
                        },
                        branchHead: {
                            addOffset: gridHeight * 3.5,
                            h: gridHeight * 5.5,
                            svgMarginTop: gridHeight
                        },
                        fault: {
                            labelOffset: gridHeight,
                            svgMarginTop: gridHeight
                        }
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
            w: gridWidth * 2
        },
        branch: {
            defaultWidth: gridWidth * 2,
            emptyWidth: (gridWidth * 4) / 3,
            extraWidthForAfterLast: 40
        }
    };
}
