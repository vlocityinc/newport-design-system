// @ts-nocheck
import { createElement } from 'lwc';
import FlcNode from 'builder_platform_interaction/flcNode';
import { FlcSelectDeselectNodeEvent } from 'builder_platform_interaction/flcEvents';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ICON_SHAPE, AutoLayoutCanvasMode } from 'builder_platform_interaction/flcComponentsUtils';
import { LABELS } from '../flcNodeLabels';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const createComponentUnderTest = (props = {}) => {
    const el = createElement('builder_platform_interaction-flcNode', {
        is: FlcNode
    });

    el.nodeInfo = props.nodeInfo;
    el.canvasMode = props.canvasMode;

    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    buttonMenu: 'builder_platform_interaction-flc-button-menu',
    diamondIconWrapper: '.rotated-icon-radius.slds-icon-standard-decision',
    startIcon: '.background-green.slds-icon__container_circle',
    decisionIcon: '.rotate-icon-svg',
    selectionCheckbox: '.selection-checkbox',
    textContainerElementType: '.text-element-type',
    textElementLabel: '.text-element-label',
    textElementGotoCount: '.text-element-goto-count'
};

describe('FlcNode', () => {
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
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const iconWrapper = flcNodeComponent.shadowRoot.querySelector(selectors.diamondIconWrapper);
            expect(iconWrapper).not.toBeNull();
        });

        it('Should have the correct icon classes when iconShape is circle and background color is defined', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: startNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const startIcon = flcNodeComponent.shadowRoot.querySelector(selectors.startIcon);
            expect(startIcon).not.toBeNull();
        });

        it('Should have the correct icon classes when iconShape is diamond', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionIcon = flcNodeComponent.shadowRoot.querySelector(selectors.decisionIcon);
            expect(decisionIcon).not.toBeNull();
        });

        it('Should have the correct icon size (medium) when iconSize is defined in the nodeInfo', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: startNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const startIcon = flcNodeComponent.shadowRoot.querySelector(selectors.startIcon);
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
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('Shows the selection checkbox in Selection Mode', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).not.toBeNull();
        });

        it('Does not show selection box for Start Element in Selection Mode', () => {
            nodeInfo.metadata.type = NodeType.START;
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('Does not show selection box for End Element in Selection Mode', () => {
            nodeInfo.metadata.type = NodeType.END;
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox).toBeNull();
        });

        it('The Selection Box should have the correct alternative text', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.alternativeText).toBe(LABELS.selectionCheckboxAltText);
        });

        it('The Selection Box should not be disabled when isSelectable is true', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.disabled).toBeFalsy();
        });

        it('The Selection Box should be disabled when isSelectable is false', () => {
            nodeInfo.config.isSelectable = false;
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.disabled).toBeTruthy();
        });

        it('The Selection Box should have the correct icon name and variant when not selected', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.iconName).toEqual('utility:add');
            expect(selectionCheckbox.variant).toEqual('border-filled');
        });

        it('The Selection Box should have the correct icon name and variant when selected', () => {
            nodeInfo.config.isSelected = true;
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const selectionCheckbox = flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox);
            expect(selectionCheckbox.iconName).toEqual('utility:check');
            expect(selectionCheckbox.variant).toEqual('brand');
        });

        it('Should dispatch FlcSelectDeselectNodeEvent event on checkbox click (when the checkbox is not selected)', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const eventCallback = jest.fn();
            flcNodeComponent.addEventListener(FlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
            flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox).click();
            expect(eventCallback).toHaveBeenCalled();
        });

        it('Should dispatch FlcSelectDeselectNodeEvent event on checkbox click (when the checkbox is selected)', () => {
            nodeInfo.config.isSelected = true;
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const eventCallback = jest.fn();
            flcNodeComponent.addEventListener(FlcSelectDeselectNodeEvent.EVENT_NAME, eventCallback);
            flcNodeComponent.shadowRoot.querySelector(selectors.selectionCheckbox).click();
            expect(eventCallback).toHaveBeenCalled();
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
            menuOpened: false
        };

        it('Should show the element type for Decision Element', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionTextElementType = flcNodeComponent.shadowRoot.querySelector(
                selectors.textContainerElementType
            );
            expect(decisionTextElementType).not.toBeNull();
        });

        it('Should not show the element type for End Element', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: endNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const endTextElementType = flcNodeComponent.shadowRoot.querySelector(selectors.textContainerElementType);
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
                type: NodeType.BRANCH
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
            menuOpened: false
        };

        const startLabelNodeInfo = {
            guid: 'guid',
            metadata: {
                icon: 'standard:end',
                iconShape: ICON_SHAPE.CIRCLE,
                label: 'start',
                type: NodeType.START,
                description: 'start description'
            },
            menuOpened: false
        };

        it('Should show the label for Decision Element', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const decisionTextLabel = flcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
            expect(decisionTextLabel.textContent).toEqual('elementType');
        });

        it('Should not show the label if undefined', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: noLabelNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const noLabelTextLabel = flcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
            expect(noLabelTextLabel.textContent).toEqual('');
        });

        it('If start node and label is not set, use description in metadata', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: startLabelNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const startTextLabel = flcNodeComponent.shadowRoot.querySelector(selectors.textElementLabel);
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
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: decisionNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const gotoCount = flcNodeComponent.shadowRoot.querySelector(selectors.textElementGotoCount);
            expect(gotoCount.textContent).toEqual('+ 1 Incoming');
        });

        it('Should not show incoming count if goto does not exist', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo: noIncomingGotoNodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const gotoCount = flcNodeComponent.shadowRoot.querySelector(selectors.textElementGotoCount);
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
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const eventCallback = jest.fn();
            flcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            flcNodeComponent.shadowRoot
                .querySelector(selectors.buttonMenu)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).toHaveBeenCalled();
        });

        it('Double clicking on Start element should not dispatch edit element event', () => {
            nodeInfo.metadata.type = NodeType.START;
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const eventCallback = jest.fn();
            flcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            flcNodeComponent.shadowRoot
                .querySelector(selectors.buttonMenu)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).not.toHaveBeenCalled();
        });

        it('Double clicking on End element should not dispatch edit element event', () => {
            nodeInfo.metadata.type = NodeType.END;
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.DEFAULT
            });
            const eventCallback = jest.fn();
            flcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            flcNodeComponent.shadowRoot
                .querySelector(selectors.buttonMenu)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).not.toHaveBeenCalled();
        });

        it('Double clicking on Default element in Selection Mode should not dispatch edit element event', () => {
            const flcNodeComponent = createComponentUnderTest({
                nodeInfo,
                canvasMode: AutoLayoutCanvasMode.SELECTION
            });
            const eventCallback = jest.fn();
            flcNodeComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            flcNodeComponent.shadowRoot
                .querySelector(selectors.buttonMenu)
                .dispatchEvent(new CustomEvent('dblclick', {}));
            expect(eventCallback).not.toHaveBeenCalled();
        });
    });
});
