// @ts-nocheck
import { AutoLayoutCanvasMode, ICON_SHAPE } from 'builder_platform_interaction/alcComponentsUtils';
import { AlcSelectDeselectNodeEvent, IncomingGoToStubClickEvent } from 'builder_platform_interaction/alcEvents';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { keyboardInteractionUtils } from 'builder_platform_interaction_mocks/sharedUtils';
import { LABELS } from '../alcNodeLabels';
const { Keys } = keyboardInteractionUtils;

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const defaultOptions = {
    canvasContext: {
        mode: AutoLayoutCanvasMode.DEFAULT
    }
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-alc-node', defaultOptions, overrideOptions);
};

const selectors = {
    menuTrigger: 'builder_platform_interaction-alc-menu-trigger',
    diamondIconWrapper: '.rotated-icon-radius.slds-icon-standard-decision',
    startIcon: '.background-green.slds-icon__container_circle',
    decisionIcon: '.rotate-icon-svg',
    selectionCheckbox: '.selection-checkbox',
    textContainerElementType: '.text-element-type',
    textElementLabel: '.text-element-label',
    textIncomingGoTo: '.text-incoming-goto',
    errorIcon: '.error-icon',
    iconContainer: '.icon-container'
};

describe('AlcNode', () => {
    let nodeInfo;

    describe('Node Icon', () => {
        const flowModel = {
            guid: {
                config: {}
            }
        };

        const startNodeInfo = {
            guid: 'guid',
            metadata: {
                icon: 'utility:right',
                iconBackgroundColor: 'background-green',
                iconShape: ICON_SHAPE.CIRCLE,
                iconSize: 'medium',
                label: 'elementType',
                type: NodeType.START
            },
            menuOpened: false
        };

        const decisionNodeInfo = {
            guid: 'guid',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            menuOpened: false
        };

        it('Should have the diamondIconWrapper when iconShape is diamond', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: decisionNodeInfo
            });
            const iconWrapper = alcNodeComponent.shadowRoot.querySelector(selectors.diamondIconWrapper);
            expect(iconWrapper).not.toBeNull();
        });

        it('Should have the correct icon classes when iconShape is circle and background color is defined', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: startNodeInfo
            });
            const startIcon = alcNodeComponent.shadowRoot.querySelector(selectors.startIcon);
            expect(startIcon).not.toBeNull();
        });

        it('Should have the correct icon classes when iconShape is diamond', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: decisionNodeInfo
            });
            const decisionIcon = alcNodeComponent.shadowRoot.querySelector(selectors.decisionIcon);
            expect(decisionIcon).not.toBeNull();
        });

        it('Should have the correct icon size (medium) when iconSize is defined in the nodeInfo', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: startNodeInfo
            });
            const startIcon = alcNodeComponent.shadowRoot.querySelector(selectors.startIcon);
            expect(startIcon.size).toBe('medium');
        });
    });

    describe('Selection Checkbox', () => {
        let flowModel;

        beforeEach(() => {
            flowModel = {
                guid: {
                    config: {
                        isSelected: false,
                        isSelectable: true
                    }
                }
            };

            nodeInfo = {
                guid: 'guid',
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };
        });

        it('Does not show the selection checkbox in Base Mode', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('Shows the selection checkbox in Selection Mode', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).not.toBeNull();
        });

        it('Does not show selection box for Start Element in Selection Mode', async () => {
            nodeInfo.metadata.type = NodeType.START;
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('Does not show selection box for End Element in Selection Mode', async () => {
            nodeInfo.metadata.type = NodeType.END;
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('The Selection Box should have the correct alternative text', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.alternativeText).toBe(LABELS.selectionCheckboxAltText);
        });

        it('The Selection Box should not be disabled when isSelectable is true', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.disabled).toBeFalsy();
        });

        it('The Selection Box should be disabled when isSelectable is false', async () => {
            flowModel.guid.config.isSelectable = false;
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.disabled).toBeTruthy();
        });

        it('The Selection Box should have the correct icon name and variant when not selected', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.iconName).toEqual('utility:add');
            expect(selectionCheckbox.variant).toEqual('border-filled');
        });

        it('The Selection Box should have the correct icon name and variant when selected', async () => {
            flowModel.guid.config.isSelected = true;
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.iconName).toEqual('utility:check');
            expect(selectionCheckbox.variant).toEqual('brand');
        });

        it('Should dispatch AlcSelectDeselectNodeEvent event on checkbox click (when the checkbox is not selected)', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(AlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox).click();
            expect(eventCallback).toHaveBeenCalled();
        });

        it('Should dispatch AlcSelectDeselectNodeEvent event on checkbox click (when the checkbox is selected)', async () => {
            flowModel.guid.config.isSelected = true;
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(AlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox).click();
            expect(eventCallback).toHaveBeenCalled();
        });

        it('Should dispatch AlcSelectDeselectNodeEvent event when pressing Enter on the checkbox', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(AlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            const keyDownEvent = new KeyboardEvent('keydown', { key: Keys.Enter, bubbles: true });
            selectionCheckbox.dispatchEvent(keyDownEvent);
            expect(eventCallback).toHaveBeenCalled();
        });

        it('Should dispatch AlcSelectDeselectNodeEvent event when pressing Space on the checkbox', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(AlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            const keyDownEvent = new KeyboardEvent('keydown', { key: Keys.Space, bubbles: true });
            selectionCheckbox.dispatchEvent(keyDownEvent);
            expect(eventCallback).toHaveBeenCalled();
        });

        it('The Selection Box should have aria-label set properly', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.getAttribute('aria-label')).toEqual(LABELS.checkboxLabel);
        });

        it('Shows the selection checkbox in Reconnection Mode', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.RECONNECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).not.toBeNull();
        });

        it('Shows the selection checkbox for End Element in Reconnection Mode', async () => {
            nodeInfo.metadata.type = NodeType.END;
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.RECONNECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).not.toBeNull();
        });
    });

    describe('Text Container', () => {
        const flowModel = {
            decisionGuid: {
                config: {
                    isSelected: false,
                    isSelectable: true
                }
            },
            endGuid: {
                config: {}
            }
        };

        const decisionNodeInfo = {
            guid: 'decisionGuid',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            menuOpened: false
        };

        const endNodeInfo = {
            guid: 'endGuid',
            metadata: {
                icon: 'standard:end',
                iconShape: ICON_SHAPE.CIRCLE,
                label: 'End',
                type: NodeType.END
            },
            menuOpened: false
        };

        it('Should show the element type for Decision Element', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: decisionNodeInfo
            });
            const decisionTextElementType = alcNodeComponent.shadowRoot.querySelector(
                selectors.textContainerElementType
            );
            expect(decisionTextElementType).not.toBeNull();
        });

        it('Should not show the element type for End Element', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: endNodeInfo
            });
            const endTextElementType = alcNodeComponent.shadowRoot.querySelector(selectors.textContainerElementType);
            expect(endTextElementType).toBeNull();
        });
    });

    describe('Label Container', () => {
        const flowModel = {
            decisionGuid: {
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                label: 'elementType'
            },
            endGuid: {
                config: {}
            },
            startGuid: {
                config: {}
            }
        };

        const decisionNodeInfo = {
            guid: 'decisionGuid',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH,
                elementType: 'Decision'
            },
            menuOpened: false
        };

        const noLabelNodeInfo = {
            guid: 'endGuid',
            metadata: {
                icon: 'standard:end',
                iconShape: ICON_SHAPE.CIRCLE,
                label: 'end',
                type: NodeType.END
            },
            menuOpened: false
        };

        const startLabelNodeInfo = {
            guid: 'startGuid',
            metadata: {
                icon: 'standard:end',
                iconShape: ICON_SHAPE.CIRCLE,
                label: 'start',
                type: NodeType.START,
                description: 'start description',
                elementType: 'START_ELEMENT'
            },
            menuOpened: false
        };

        it('Should show the label for Decision Element', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: decisionNodeInfo
            });
            const decisionTextLabel = alcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
            expect(decisionTextLabel.textContent).toEqual('elementType');
        });

        it('Should not show the label if undefined', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: noLabelNodeInfo
            });
            const noLabelTextLabel = alcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
            expect(noLabelTextLabel.textContent).toEqual('');
        });

        it('If start node and label is not set, use description in metadata', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: startLabelNodeInfo
            });
            const startTextLabel = alcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
            expect(startTextLabel.textContent).toEqual('start description');
        });
    });

    describe('Goto Label', () => {
        const flowModel = {
            d1: {
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                incomingGoTo: ['d2']
            },
            d2: {
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                incomingGoTo: []
            }
        };

        const decisionNodeInfo = {
            guid: 'd1',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            menuOpened: false
        };

        const noIncomingGotoNodeInfo = {
            guid: 'd2',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            menuOpened: false
        };

        it('Should show incoming count on gotos target if goto exists', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: decisionNodeInfo
            });
            const gotoCount = alcNodeComponent.shadowRoot.querySelector(selectors.textIncomingGoTo);
            const expectText = `${LABELS.incomingGoToLabel}(${flowModel.d1.incomingGoTo.length})`;
            expect(gotoCount.textContent).toEqual(expectText);
        });

        it('Should not show incoming count if goto does not exist', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: noIncomingGotoNodeInfo
            });
            const gotoCount = alcNodeComponent.shadowRoot.querySelector(selectors.textIncomingGoTo);
            expect(gotoCount).toBeNull();
        });

        it('Should fire IncomingGoToStubClickEvent when clicked', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: decisionNodeInfo
            });
            const gotoCount = alcNodeComponent.shadowRoot.querySelector(selectors.textIncomingGoTo);

            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(IncomingGoToStubClickEvent.EVENT_NAME, eventCallback);
            gotoCount.click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('Dynamic Component Goto Label', () => {
        const itemGuid = 'someStepGuid';
        const flowModel = {
            d1: {
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                incomingGoTo: ['d2']
            },
            d2: {
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                incomingGoTo: []
            }
        };

        const dynamicDecisionNodeInfo = {
            guid: 'd1',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.ORCHESTRATED_STAGE,
                dynamicNodeComponent: 'builder_platform_interaction/orchestratedStageNode',
                dynamicNodeComponentSelector: () => {
                    return [
                        {
                            name: 'some_step',
                            guid: itemGuid,
                            config: {}
                        },
                        {
                            name: 'some_step_2',
                            guid: itemGuid + '_2',
                            config: {}
                        }
                    ];
                },
                menuOpened: false
            }
        };

        const noIncomingGotoNodeInfo = {
            guid: 'd2',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.ORCHESTRATED_STAGE,
                dynamicNodeComponent: 'builder_platform_interaction/orchestratedStageNode',
                dynamicNodeComponentSelector: () => {
                    return [
                        {
                            name: 'some_step',
                            guid: itemGuid,
                            config: {}
                        },
                        {
                            name: 'some_step_2',
                            guid: itemGuid + '_2',
                            config: {}
                        }
                    ];
                }
            },
            menuOpened: false
        };

        it('Should show incoming count for dynamic nodes on gotos target if goto exists', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: dynamicDecisionNodeInfo
            });
            const gotoCount = alcNodeComponent.shadowRoot.querySelector(selectors.textIncomingGoTo);
            const expectText = `${LABELS.incomingGoToLabel}(${flowModel.d1.incomingGoTo.length})`;
            expect(gotoCount.textContent).toEqual(expectText);
        });

        it('Should not show incoming count on dynamic nodes if goto does not exist', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: noIncomingGotoNodeInfo
            });
            const gotoCount = alcNodeComponent.shadowRoot.querySelector(selectors.textIncomingGoTo);
            expect(gotoCount).toBeNull();
        });
    });

    describe('Double clicking', () => {
        let flowModel;

        beforeEach(() => {
            flowModel = {
                guid: {
                    config: {
                        isSelected: false,
                        isSelectable: true
                    }
                }
            };

            nodeInfo = {
                guid: 'guid',
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };
        });

        it('Double clicking on Default element should dispatch edit element event', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot
                .querySelector(selectors.menuTrigger)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).toHaveBeenCalled();
        });

        it('Double clicking on Start element should not dispatch edit element event', async () => {
            nodeInfo.metadata.type = NodeType.START;
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot
                .querySelector(selectors.menuTrigger)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).not.toHaveBeenCalled();
        });

        it('Double clicking on End element should not dispatch edit element event', async () => {
            nodeInfo.metadata.type = NodeType.END;
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot
                .querySelector(selectors.menuTrigger)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).not.toHaveBeenCalled();
        });

        it('Double clicking on Default element in Selection Mode should not dispatch edit element event', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.SELECTION }
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot
                .querySelector(selectors.menuTrigger)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).not.toHaveBeenCalled();
        });
    });

    describe('Error Icon', () => {
        it('Should not be displayed if node config has no error', async () => {
            const flowModel = {
                guid: {
                    config: {
                        hasError: false
                    }
                }
            };
            const nodeInfo = {
                guid: 'guid',
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };

            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo
            });
            const errorIcon = alcNodeComponent.shadowRoot.querySelector(selectors.errorIcon);
            expect(errorIcon).toBeNull();
        });

        it('Should be displayed if node config has error', async () => {
            const flowModel = {
                guid: {
                    config: {
                        hasError: true
                    }
                }
            };
            const nodeInfo = {
                guid: 'guid',
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };

            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo
            });
            const errorIcon = alcNodeComponent.shadowRoot.querySelector(selectors.errorIcon);
            expect(errorIcon).not.toBeNull();
        });
    });

    describe('Aria attributes', () => {
        const flowModel = {
            decisionGuid: {
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                label: 'elementType'
            },
            startGuid: {
                config: {
                    isSelected: false,
                    isSelectable: true
                }
            }
        };

        const decisionNodeInfo = {
            guid: 'decisionGuid',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH,
                elementType: 'Decision'
            },
            menuOpened: false
        };

        const startNodeInfo = {
            guid: 'startGuid',
            metadata: {
                icon: 'utility:right',
                iconBackgroundColor: 'background-green',
                iconShape: ICON_SHAPE.CIRCLE,
                iconSize: 'medium',
                label: 'elementType',
                type: NodeType.START,
                description: 'start description',
                elementType: 'START_ELEMENT'
            },
            menuOpened: false
        };

        it('Should set the aria-label and aria-haspopup properly for decision', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: decisionNodeInfo
            });
            const decisionIcon = alcNodeComponent.shadowRoot.querySelector(selectors.decisionIcon);
            const expectedAriaLabel = `${LABELS.ariaLabelNode}(${decisionNodeInfo.metadata.elementType},${decisionNodeInfo.metadata.label})`;
            expect(decisionIcon.getAttribute('aria-label')).toEqual(expectedAriaLabel);
            expect(decisionIcon.getAttribute('aria-haspopup')).toEqual('dialog');
        });

        it('Should set the aria-label properly for start node', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: startNodeInfo
            });
            const startIcon = alcNodeComponent.shadowRoot.querySelector(selectors.startIcon);
            const expectedAriaLabel = `${LABELS.ariaLabelNode}(${startNodeInfo.metadata.elementType},${startNodeInfo.metadata.description})`;
            expect(startIcon.getAttribute('aria-label')).toEqual(expectedAriaLabel);
            expect(startIcon.getAttribute('aria-haspopup')).toEqual('dialog');
        });
    });

    describe('Highlighting', () => {
        const flowModel = {
            decisionGuid: {
                config: {
                    isSelected: false,
                    isSelectable: true,
                    isHighlighted: true
                }
            },
            assignmentGuid: {
                config: {
                    isSelected: false,
                    isSelectable: true,
                    isHighlighted: true
                }
            },
            getRecordsGuid: {
                config: {
                    isSelected: false,
                    isSelectable: true,
                    isHighlighted: true
                }
            }
        };

        const decisionNodeInfo = {
            guid: 'decisionGuid',
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            flows: [
                {
                    geometry: { x: 0, y: 0, w: 1968, h: 2256 },
                    isTerminal: false,
                    layoutConfig: { grid: {}, menu: {}, connector: {}, node: {}, branch: {} },
                    nodes: [],
                    preConnector: {}
                }
            ],
            menuOpened: false
        };

        const assignmentNodeInfo = {
            geometry: { x: 0, y: 144, w: 48, h: 120 },
            guid: 'assignmentGuid',
            isNew: false,
            isTerminal: false,
            logicConnectors: [],
            menuOpened: false,
            metadata: {},
            nextConnector: { labelType: 0, geometry: {}, addInfo: {}, source: {}, svgInfo: {} }
        };

        const getRecordNodeInfoWithFault = {
            geometry: { x: 0, y: 144, w: 48, h: 120 },
            guid: 'getRecordsGuid',
            faultFlow: {},
            isNew: false,
            isTerminal: false,
            logicConnectors: [],
            menuOpened: false,
            metadata: {},
            nextConnector: { labelType: 0, geometry: {}, addInfo: {}, source: {}, svgInfo: {} }
        };

        it('Should have the CSS class : "highlighted-container-multioutput" for Highlighted element with multiple connectors', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: decisionNodeInfo
            });
            const decisionTextElementType = alcNodeComponent.shadowRoot.querySelector(selectors.iconContainer);
            expect(decisionTextElementType.classList).toContain('highlighted-container-multioutput');
        });

        it('Should have the CSS class : "highlighted-container-multioutput" for Highlighted element with fault connectors', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: getRecordNodeInfoWithFault
            });
            const decisionTextElementType = alcNodeComponent.shadowRoot.querySelector(selectors.iconContainer);
            expect(decisionTextElementType.classList).toContain('highlighted-container-multioutput');
        });

        it('Should have the CSS class : "highlighted-container" for Highlighted element with simple connector', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo: assignmentNodeInfo
            });
            const decisionTextElementType = alcNodeComponent.shadowRoot.querySelector(selectors.iconContainer);
            expect(decisionTextElementType.classList).toContain('highlighted-container');
        });
    });

    describe('Focus', () => {
        let flowModel;
        beforeEach(() => {
            flowModel = {
                guid: {
                    config: {
                        isSelected: false,
                        isSelectable: true
                    }
                }
            };
            nodeInfo = {
                guid: 'guid',
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };
        });

        it('Focus event on menu trigger should be fired when in default mode', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo
            });
            const menuTrigger = alcNodeComponent.shadowRoot.querySelector(selectors.menuTrigger);
            menuTrigger.focus = jest.fn();
            alcNodeComponent.focus();
            expect(menuTrigger.focus).toHaveBeenCalled();
        });

        it('Focus event on selection checkbox should be fired when in selection mode', async () => {
            const alcNodeComponent = await createComponentUnderTest({
                flowModel,
                nodeInfo,
                canvasContext: { mode: AutoLayoutCanvasMode.RECONNECTION }
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            selectionCheckbox.focus = jest.fn();
            alcNodeComponent.focus();
            expect(selectionCheckbox.focus).toHaveBeenCalled();
        });
    });
});
