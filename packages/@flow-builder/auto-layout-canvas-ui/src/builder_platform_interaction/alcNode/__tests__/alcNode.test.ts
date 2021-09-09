// @ts-nocheck
import { createElement } from 'lwc';
import AlcNode from 'builder_platform_interaction/alcNode';
import { AlcSelectDeselectNodeEvent } from 'builder_platform_interaction/alcEvents';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ICON_SHAPE, AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import { LABELS } from '../alcNodeLabels';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const createComponentUnderTest = (props = {}) => {
    const el = createElement('builder_platform_interaction-alcNode', {
        is: AlcNode
    });

    el.nodeInfo = props.nodeInfo;
    el.canvasMode = props.canvasMode;

    setDocumentBodyChildren(el);
    return el;
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
        const startNodeInfo = {
            guid: 'guid',
            config: {
                isSelected: false,
                isSelectable: true
            },
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
            config: {
                isSelected: false,
                isSelectable: true
            },
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            menuOpened: false
        };

        it('Should have the diamondIconWrapper when iconShape is diamond', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const iconWrapper = alcNodeComponent.shadowRoot.querySelector(selectors.diamondIconWrapper);
            expect(iconWrapper).not.toBeNull();
        });

        it('Should have the correct icon classes when iconShape is circle and background color is defined', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: startNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const startIcon = alcNodeComponent.shadowRoot.querySelector(selectors.startIcon);
            expect(startIcon).not.toBeNull();
        });

        it('Should have the correct icon classes when iconShape is diamond', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionIcon = alcNodeComponent.shadowRoot.querySelector(selectors.decisionIcon);
            expect(decisionIcon).not.toBeNull();
        });

        it('Should have the correct icon size (medium) when iconSize is defined in the nodeInfo', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: startNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const startIcon = alcNodeComponent.shadowRoot.querySelector(selectors.startIcon);
            expect(startIcon.size).toBe('medium');
        });
    });

    describe('Selection Checkbox', () => {
        beforeEach(() => {
            nodeInfo = {
                guid: 'guid',
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };
        });

        it('Does not show the selection checkbox in Base Mode', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('Shows the selection checkbox in Selection Mode', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).not.toBeNull();
        });

        it('Does not show selection box for Start Element in Selection Mode', () => {
            nodeInfo.metadata.type = NodeType.START;
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('Does not show selection box for End Element in Selection Mode', () => {
            nodeInfo.metadata.type = NodeType.END;
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('The Selection Box should have the correct alternative text', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.alternativeText).toBe(LABELS.selectionCheckboxAltText);
        });

        it('The Selection Box should not be disabled when isSelectable is true', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.disabled).toBeFalsy();
        });

        it('The Selection Box should be disabled when isSelectable is false', () => {
            nodeInfo.config.isSelectable = false;
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.disabled).toBeTruthy();
        });

        it('The Selection Box should have the correct icon name and variant when not selected', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.iconName).toEqual('utility:add');
            expect(selectionCheckbox.variant).toEqual('border-filled');
        });

        it('The Selection Box should have the correct icon name and variant when selected', () => {
            nodeInfo.config.isSelected = true;
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.iconName).toEqual('utility:check');
            expect(selectionCheckbox.variant).toEqual('brand');
        });

        it('Should dispatch AlcSelectDeselectNodeEvent event on checkbox click (when the checkbox is not selected)', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(AlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox).click();
            expect(eventCallback).toHaveBeenCalled();
        });

        it('Should dispatch AlcSelectDeselectNodeEvent event on checkbox click (when the checkbox is selected)', () => {
            nodeInfo.config.isSelected = true;
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(AlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox).click();
            expect(eventCallback).toHaveBeenCalled();
        });

        it('The Selection Box should have aria-label set properly', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.getAttribute('aria-label')).toEqual(LABELS.checkboxLabel);
        });
    });

    describe('Text Container', () => {
        const decisionNodeInfo = {
            guid: 'guid',
            config: {
                isSelected: false,
                isSelectable: true
            },
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            menuOpened: false
        };

        const endNodeInfo = {
            guid: 'guid',
            metadata: {
                icon: 'standard:end',
                iconShape: ICON_SHAPE.CIRCLE,
                label: 'End',
                type: NodeType.END
            },
            menuOpened: false,
            config: {}
        };

        it('Should show the element type for Decision Element', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionTextElementType = alcNodeComponent.shadowRoot.querySelector(
                selectors.textContainerElementType
            );
            expect(decisionTextElementType).not.toBeNull();
        });

        it('Should not show the element type for End Element', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: endNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const endTextElementType = alcNodeComponent.shadowRoot.querySelector(selectors.textContainerElementType);
            expect(endTextElementType).toBeNull();
        });
    });

    describe('Label Container', () => {
        const decisionNodeInfo = {
            guid: 'guid',
            config: {
                isSelected: false,
                isSelectable: true
            },
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH,
                elementType: 'Decision'
            },
            menuOpened: false,
            label: 'elementType'
        };

        const noLabelNodeInfo = {
            guid: 'guid',
            metadata: {
                icon: 'standard:end',
                iconShape: ICON_SHAPE.CIRCLE,
                label: 'start',
                type: NodeType.END
            },
            menuOpened: false,
            config: {}
        };

        const startLabelNodeInfo = {
            guid: 'guid',
            metadata: {
                icon: 'standard:end',
                iconShape: ICON_SHAPE.CIRCLE,
                label: 'start',
                type: NodeType.START,
                description: 'start description',
                elementType: 'START_ELEMENT'
            },
            menuOpened: false,
            config: {}
        };

        it('Should show the label for Decision Element', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionTextLabel = alcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
            expect(decisionTextLabel.textContent).toEqual('elementType');
        });

        it('Should not show the label if undefined', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: noLabelNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const noLabelTextLabel = alcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
            expect(noLabelTextLabel.textContent).toEqual('');
        });

        it('If start node and label is not set, use description in metadata', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: startLabelNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const startTextLabel = alcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
            expect(startTextLabel.textContent).toEqual('start description');
        });
    });

    describe('Goto Label', () => {
        const decisionNodeInfo = {
            guid: 'd1',
            config: {
                isSelected: false,
                isSelectable: true
            },
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            menuOpened: false,
            node: {
                guid: 'd1',
                incomingGoTo: ['d2']
            }
        };

        const noIncomingGotoNodeInfo = {
            guid: 'd2',
            config: {
                isSelected: false,
                isSelectable: true
            },
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH
            },
            menuOpened: false,
            node: {
                guid: 'd2',
                incomingGoTo: []
            }
        };

        it('Should show incoming count on gotos target if goto exists', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const gotoCount = alcNodeComponent.shadowRoot.querySelector(selectors.textIncomingGoTo);
            const expectText = `${LABELS.incomingGoToLabel}(${decisionNodeInfo.node.incomingGoTo.length})`;
            expect(gotoCount.textContent).toEqual(expectText);
        });

        it('Should not show incoming count if goto does not exist', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: noIncomingGotoNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const gotoCount = alcNodeComponent.shadowRoot.querySelector(selectors.textIncomingGoTo);
            expect(gotoCount).toBeNull();
        });
    });

    describe('Double clicking', () => {
        beforeEach(() => {
            nodeInfo = {
                guid: 'guid',
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };
        });

        it('Double clicking on Default element should dispatch edit element event', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot
                .querySelector(selectors.menuTrigger)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).toHaveBeenCalled();
        });

        it('Double clicking on Start element should not dispatch edit element event', () => {
            nodeInfo.metadata.type = NodeType.START;
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot
                .querySelector(selectors.menuTrigger)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).not.toHaveBeenCalled();
        });

        it('Double clicking on End element should not dispatch edit element event', () => {
            nodeInfo.metadata.type = NodeType.END;
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const eventCallback = jest.fn();
            alcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            alcNodeComponent.shadowRoot
                .querySelector(selectors.menuTrigger)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).not.toHaveBeenCalled();
        });

        it('Double clicking on Default element in Selection Mode should not dispatch edit element event', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
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
        it('Should not be displayed if node config has no error', () => {
            const nodeInfo = {
                guid: 'guid',
                config: {
                    hasError: false
                },
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };

            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const errorIcon = alcNodeComponent.shadowRoot.querySelector(selectors.errorIcon);
            expect(errorIcon).toBeNull();
        });

        it('Should be displayed if node config has error', () => {
            const nodeInfo = {
                guid: 'guid',
                config: {
                    hasError: true
                },
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };

            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const errorIcon = alcNodeComponent.shadowRoot.querySelector(selectors.errorIcon);
            expect(errorIcon).not.toBeNull();
        });
    });

    describe('Aria attributes', () => {
        const decisionNodeInfo = {
            guid: 'guid',
            config: {
                isSelected: false,
                isSelectable: true
            },
            metadata: {
                icon: 'standard:decision',
                iconShape: ICON_SHAPE.DIAMOND,
                label: 'elementType',
                type: NodeType.BRANCH,
                elementType: 'Decision'
            },
            menuOpened: false,
            label: 'elementType'
        };

        const startNodeInfo = {
            guid: 'guid',
            config: {
                isSelected: false,
                isSelectable: true
            },
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

        it('Should set the aria-label and aria-haspopup properly for decision', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionIcon = alcNodeComponent.shadowRoot.querySelector(selectors.decisionIcon);
            const expectedAriaLabel = `${LABELS.ariaLabelNode}(${decisionNodeInfo.metadata.elementType},${decisionNodeInfo.metadata.label})`;
            expect(decisionIcon.getAttribute('aria-label')).toEqual(expectedAriaLabel);
            expect(decisionIcon.getAttribute('aria-haspopup')).toEqual('dialog');
        });

        it('Should set the aria-label properly for start node', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: startNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const startIcon = alcNodeComponent.shadowRoot.querySelector(selectors.startIcon);
            const expectedAriaLabel = `${LABELS.ariaLabelNode}(${startNodeInfo.metadata.elementType},${startNodeInfo.metadata.description})`;
            expect(startIcon.getAttribute('aria-label')).toEqual(expectedAriaLabel);
            expect(startIcon.getAttribute('aria-haspopup')).toEqual('dialog');
        });
    });

    describe('Highlighting', () => {
        const decisionNodeInfo = {
            guid: 'guid',
            config: {
                isSelected: false,
                isSelectable: true,
                isHighlighted: true
            },
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
            guid: '0c59e7db-144d-443a-9bf2-61a9e17d451a',
            config: {
                isSelected: false,
                isSelectable: true,
                isHighlighted: true
            },
            isNew: false,
            isTerminal: false,
            label: 'myAssignment',
            logicConnectors: [],
            menuOpened: false,
            metadata: {},
            nextConnector: { labelType: 0, geometry: {}, addInfo: {}, source: {}, svgInfo: {} }
        };

        const getRecordNodeInfoWithFault = {
            geometry: { x: 0, y: 144, w: 48, h: 120 },
            guid: '0c59e7db-144d-443a-9bf2-61a9e17d451a',
            config: {
                isSelected: false,
                isSelectable: true,
                isHighlighted: true
            },
            faultFlow: {},
            isNew: false,
            isTerminal: false,
            label: 'myAssignment',
            logicConnectors: [],
            menuOpened: false,
            metadata: {},
            nextConnector: { labelType: 0, geometry: {}, addInfo: {}, source: {}, svgInfo: {} }
        };

        it('Should have the CSS class : "highlighted-container-multioutput" for Highlighted element with multiple connectors', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionTextElementType = alcNodeComponent.shadowRoot.querySelector(selectors.iconContainer);
            expect(decisionTextElementType.classList).toContain('highlighted-container-multioutput');
        });

        it('Should have the CSS class : "highlighted-container-multioutput" for Highlighted element with fault connectors', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: getRecordNodeInfoWithFault,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionTextElementType = alcNodeComponent.shadowRoot.querySelector(selectors.iconContainer);
            expect(decisionTextElementType.classList).toContain('highlighted-container-multioutput');
        });

        it('Should have the CSS class : "highlighted-container" for Highlighted element with simple connector', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo: assignmentNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionTextElementType = alcNodeComponent.shadowRoot.querySelector(selectors.iconContainer);
            expect(decisionTextElementType.classList).toContain('highlighted-container');
        });
    });

    describe('Focus', () => {
        beforeEach(() => {
            nodeInfo = {
                guid: 'guid',
                config: {
                    isSelected: false,
                    isSelectable: true
                },
                metadata: {
                    icon: 'dummyIcon',
                    label: 'elementType',
                    type: NodeType.DEFAULT
                },
                menuOpened: false
            };
        });

        it('Focus event on menu trigger should be fired when focusOnSelectionBox is false', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const menuTrigger = alcNodeComponent.shadowRoot.querySelector(selectors.menuTrigger);
            menuTrigger.focus = jest.fn();
            alcNodeComponent.focus();
            expect(menuTrigger.focus).toHaveBeenCalled();
        });

        it('Focus event on selection checkbox should be fired when focusOnSelectionBox is true', () => {
            const alcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.RECONNECTION
            });
            const selectionCheckbox = alcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            selectionCheckbox.focus = jest.fn();
            alcNodeComponent.focus(true);
            expect(selectionCheckbox.focus).toHaveBeenCalled();
        });
    });
});
