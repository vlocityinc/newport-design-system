// @ts-nocheck
import { AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import { OutgoingGoToStubClickEvent } from 'builder_platform_interaction/alcEvents';
import { ConnectorLabelType, NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { createComponent, LIGHTNING_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { keyboardInteractionUtils } from 'builder_platform_interaction_mocks/sharedUtils';
import { LABELS } from '../alcConnectorLabels';
const { Keys } = keyboardInteractionUtils;

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const selectors = {
    connectorToBeDeletedSVG: '.connector-to-be-deleted',
    connectorToBeCutSVG: '.connector-to-be-cut',
    addElementButton: '.circle-text',
    defaultConnectorBadge: '.connector-badge span',
    faultConnectorBadge: '.connector-badge.fault-badge span',
    goToInfo: '.go-to-info',
    goToTargetLabel: '.go-to-info .go-to-target-label span',
    goToTargetArrow: '.go-to-info span',
    alcMenuTrigger: 'builder_platform_interaction-alc-menu-trigger'
};

const geometry = {
    x: 0,
    y: 0,
    w: 20,
    h: 40
};

const svgInfo = {
    geometry,
    path: 'M 10, 20',
    endLocation: { x: 10, y: 20 }
};

const addInfo = {
    offsetY: 20,
    menuOpened: false
};

const labelOffsetY = 50;

const regularFlowModel = {
    prevGuid1: {
        next: 'targetChild'
    },
    targetChild: {
        prev: 'prevGuid1'
    }
};

const getRegularConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'prevGuid1'
        },
        isFault: false,
        labelOffsetY,
        operationType: undefined
    };
};

const defaultFlowModel = {
    parentGuid1: {
        nodeType: NodeType.BRANCH,
        children: [null, 'targetChild', 'nestedDecision'],
        childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }],
        defaultConnectorLabel: 'Default'
    },
    targetChild: {
        parent: 'parentGuid1',
        childIndex: 1
    },
    targetGrandChild: {
        parent: 'targetChild'
    },
    nestedDecision: {
        parent: 'parentGuid1',
        childIndex: 2,
        nodeType: NodeType.BRANCH,
        children: [null, 'nestedChild'],
        childReferences: [{ childReference: 'o3' }],
        defaultConnectorLabel: 'Default'
    },
    nestedChild: {
        parent: 'nestedDecision',
        childIndex: 1
    },
    o1: {
        label: 'o1'
    },
    o2: {
        label: 'o2'
    },
    o3: {
        label: 'o3'
    }
};

const mergeFlowModel = {
    parentGuid: {
        nodeType: NodeType.BRANCH,
        children: ['s1', null, null],
        childReferences: [{ childReference: 'o1' }],
        defaultConnectorLabel: 'Default',
        next: 's2'
    },
    s2: {
        label: 's2'
    },
    o1: {
        label: 'o1'
    }
};

const getDefaultConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'parentGuid1',
            childIndex: 2
        },
        isFault: false,
        labelOffsetY,
        operationType: 'delete',
        labelType: ConnectorLabelType.BRANCH
    };
};

const getMergeConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'parentGuid'
        },
        isFault: false,
        labelOffsetY,
        operationType: 'delete',
        labelType: ConnectorLabelType.BRANCH
    };
};

const getDefaultConnectorInfoForCut = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'parentGuid1',
            childIndex: 1
        },
        isFault: false,
        labelOffsetY,
        operationType: 'cut',
        labelType: ConnectorLabelType.BRANCH
    };
};

const faultFlowModel = {
    parentGuid1: {
        fault: 'targetChild'
    },
    targetChild: {
        parent: 'parentGuid1',
        childIndex: -1
    }
};

const getFaultConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'parentGuid1',
            childIndex: -1
        },
        isFault: true,
        labelOffsetY,
        operationType: undefined,
        labelType: ConnectorLabelType.FAULT
    };
};

const goToFlowModel = {
    parentGuid1: {
        nodeType: NodeType.BRANCH,
        children: [null, 'targetChild'],
        childReferences: [{ childReference: 'o1' }]
    },
    targetChild: {
        incomingGoTo: ['parentGuid1:default'],
        label: 'Target Label'
    }
};

const getGoToConnectorInfo = (operationType = undefined) => {
    return {
        type: 'goTo',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'parentGuid1',
            childIndex: 1
        },
        isFault: false,
        labelOffsetY,
        operationType,
        labelType: ConnectorLabelType.BRANCH
    };
};

const branchingStartFlowModel = {
    startGuid1: {
        nodeType: NodeType.START,
        children: ['targetChild', null],
        childReferences: [{ childReference: 'p1' }],
        defaultConnectorLabel: 'Run Immediately'
    },
    targetChild: {
        parent: 'startGuid1',
        childIndex: 0
    },
    p1: {
        label: 'p1'
    }
};

const getImmediateBranchConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'startGuid1',
            childIndex: 0
        },
        isFault: false,
        labelOffsetY,
        operationType: undefined,
        labelType: ConnectorLabelType.BRANCH
    };
};

const immediateStartFlowModel = {
    startGuid1: {
        nodeType: NodeType.START,
        next: 'targetChild',
        defaultConnectorLabel: 'Run Immediately'
    },
    targetChild: {
        prev: 'startGuid1'
    }
};

const getImmediateStraightConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'startGuid1'
        },
        isFault: false,
        labelOffsetY,
        operationType: undefined,
        labelType: ConnectorLabelType.BRANCH
    };
};

const getScheduledPathConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        source: {
            guid: 'startGuid1',
            childIndex: 1
        },
        isFault: false,
        labelOffsetY,
        operationType: undefined,
        labelType: ConnectorLabelType.BRANCH
    };
};

const defaultCanvasContext = {
    mode: AutoLayoutCanvasMode.DEFAULT,
    highlightInfo: null,
    connectorMenuMetadata: {},
    operationType: 'delete',
    cutInfo: {
        guids: [],
        childIndexToKeep: null
    }
};

const defaultOptions = {
    canvasContext: defaultCanvasContext
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-alc-connector', defaultOptions, overrideOptions);
};

describe('Auto-Layout connector tests', () => {
    it('Should add connector-to-be-deleted class to the connector svg when in Delete operation type', async () => {
        const defaultConnector = await createComponentUnderTest({
            connectorInfo: getDefaultConnectorInfo(),
            flowModel: defaultFlowModel
        });
        const connectorSVG = defaultConnector.shadowRoot.querySelector(selectors.connectorToBeDeletedSVG);
        expect(connectorSVG).not.toBeNull();
    });

    it('Should add connector-to-be-cut class to the connector svg when in Cut operation type', async () => {
        const defaultConnector = await createComponentUnderTest({
            connectorInfo: getDefaultConnectorInfoForCut(),
            flowModel: defaultFlowModel
        });
        const connectorSVG = defaultConnector.shadowRoot.querySelector(selectors.connectorToBeCutSVG);
        expect(connectorSVG).not.toBeNull();
    });

    it('"+" button icon should have the right alternative text', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getRegularConnectorInfo(),
            flowModel: regularFlowModel
        });
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton.alternativeText).toBe(LABELS.addElementIconAltText);
    });

    it('Default connector should have the label badge', async () => {
        const defaultConnector = await createComponentUnderTest({
            connectorInfo: getDefaultConnectorInfo(),
            flowModel: defaultFlowModel
        });
        const labelBadge = defaultConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge).not.toBeUndefined();
    });

    it('Default connector should have the right label content', async () => {
        const defaultConnectorInfo = getDefaultConnectorInfo();
        const defaultConnector = await createComponentUnderTest({
            connectorInfo: defaultConnectorInfo,
            flowModel: defaultFlowModel
        });
        const labelBadge = defaultConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(defaultFlowModel.parentGuid1.defaultConnectorLabel);
    });

    it('Run Immediately branching connector should have the right label content', async () => {
        const immediateConnectorInfo = getImmediateBranchConnectorInfo();
        const immediateConnector = await createComponentUnderTest({
            connectorInfo: immediateConnectorInfo,
            flowModel: branchingStartFlowModel
        });
        const labelBadge = immediateConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(branchingStartFlowModel.startGuid1.defaultConnectorLabel);
    });

    it('Run Immediately straight connector should have the right label content', async () => {
        const immediateConnectorInfo = getImmediateStraightConnectorInfo();
        const immediateConnector = await createComponentUnderTest({
            connectorInfo: immediateConnectorInfo,
            flowModel: immediateStartFlowModel
        });
        const labelBadge = immediateConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(immediateStartFlowModel.startGuid1.defaultConnectorLabel);
    });

    it('Scheduled Path connector should have the right label content', async () => {
        const scheduledPathConnectorInfo = getScheduledPathConnectorInfo();
        const scheduledPathConnector = await createComponentUnderTest({
            connectorInfo: scheduledPathConnectorInfo,
            flowModel: branchingStartFlowModel
        });
        const labelBadge = scheduledPathConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(branchingStartFlowModel.p1.label);
    });

    it('Fault connector should have the label badge', async () => {
        const faultConnector = await createComponentUnderTest({
            connectorInfo: getFaultConnectorInfo(),
            flowModel: faultFlowModel
        });
        const labelBadge = faultConnector.shadowRoot.querySelector(selectors.faultConnectorBadge);
        expect(labelBadge).not.toBeUndefined();
    });

    it('Fault connector should have the right label content', async () => {
        const faultConnector = await createComponentUnderTest({
            connectorInfo: getFaultConnectorInfo(),
            flowModel: faultFlowModel
        });
        const labelBadge = faultConnector.shadowRoot.querySelector(selectors.faultConnectorBadge);
        expect(labelBadge.textContent).toEqual(LABELS.faultConnectorBadgeLabel);
    });

    it('"+" button should be hidden when in selection mode', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getRegularConnectorInfo(),
            canvasContext: { ...defaultCanvasContext, mode: AutoLayoutCanvasMode.SELECTION },
            flowModel: regularFlowModel
        });
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton).toBeNull();
    });

    it('"+" button should be hidden when disableAddElements is true', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getRegularConnectorInfo(),
            canvasContext: { ...defaultCanvasContext, connectorMenuMetadata: null },
            flowModel: regularFlowModel
        });
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton).toBeNull();
    });

    it('Should have the title property on a GoTo connector', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const goToInfo = goToConnector.shadowRoot.querySelector(selectors.goToInfo);
        expect(goToInfo.title).toBe(goToFlowModel.targetChild.label);
    });

    it('Should have the target info (label) on a GoTo connector', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const goToTargetLabel = goToConnector.shadowRoot.querySelector(selectors.goToTargetLabel);
        expect(goToTargetLabel).not.toBeNull();
    });

    it('Should have the right text content on the target info (label) of the GoTo connector', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const goToTargetLabel = goToConnector.shadowRoot.querySelector(selectors.goToTargetLabel);
        expect(goToTargetLabel.textContent).toBe(goToFlowModel.targetChild.label);
    });

    it('Should have the target info (arrow) on a GoTo connector', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const goToTargetArrow = goToConnector.shadowRoot.querySelectorAll(selectors.goToTargetArrow)[1];
        expect(goToTargetArrow).not.toBeNull();
    });

    it('Should have the right text content on the target info (arrow) of the GoTo connector', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const goToTargetArrow = goToConnector.shadowRoot.querySelectorAll(selectors.goToTargetArrow)[1];
        expect(goToTargetArrow.textContent).toBe('→');
    });

    it('Clicking on the goTo info should dispatch OutgoingGoToStubClickEvent', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const callback = jest.fn();
        goToConnector.addEventListener(OutgoingGoToStubClickEvent.EVENT_NAME, callback);
        goToConnector.shadowRoot.querySelector(selectors.goToInfo).click();
        expect(callback).toHaveBeenCalled();
    });

    it('Clicking on the goTo info should dispatch OutgoingGoToStubClickEvent with the right details', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const callback = jest.fn();
        goToConnector.addEventListener(OutgoingGoToStubClickEvent.EVENT_NAME, callback);
        goToConnector.shadowRoot.querySelector(selectors.goToInfo).click();
        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    source: goToConnectorInfo.source
                }
            })
        );
    });

    it('Pressing Enter on the goTo info should dispatch OutgoingGoToStubClickEvent', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const callback = jest.fn();
        goToConnector.addEventListener(OutgoingGoToStubClickEvent.EVENT_NAME, callback);
        const goToInfo = goToConnector.shadowRoot.querySelector(selectors.goToInfo);
        goToInfo.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: Keys.Enter, bubbles: true });
        goToInfo.dispatchEvent(keyDownEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('Pressing Space on the goTo info should dispatch OutgoingGoToStubClickEvent', async () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = await createComponentUnderTest({
            connectorInfo: goToConnectorInfo,
            flowModel: goToFlowModel
        });
        const callback = jest.fn();
        goToConnector.addEventListener(OutgoingGoToStubClickEvent.EVENT_NAME, callback);
        const goToInfo = goToConnector.shadowRoot.querySelector(selectors.goToInfo);
        goToInfo.focus();
        const keyDownEvent = new KeyboardEvent('keydown', { key: Keys.Space, bubbles: true });
        goToInfo.dispatchEvent(keyDownEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('Should have aria attributes set properly for add button', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getRegularConnectorInfo(),
            flowModel: regularFlowModel
        });
        const addElementIconAltText = regularConnector.shadowRoot.querySelector(selectors.alcMenuTrigger);
        expect(addElementIconAltText.getAttribute('aria-label')).toEqual(LABELS.addElementIconAltText);
        expect(addElementIconAltText.getAttribute('aria-haspopup')).toEqual('dialog');
    });

    it('Should have class highlighted-container when goTo stub is clicked', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getGoToConnectorInfo(),
            flowModel: goToFlowModel,
            canvasContext: {
                ...defaultCanvasContext,
                highlightInfo: { gotos: [{ guid: 'parentGuid1', childIndex: 1 }] }
            }
        });
        const goToConnector = regularConnector.shadowRoot.querySelector(selectors.goToInfo);
        expect(goToConnector.classList).toContain('highlighted-container');
    });

    it('Should not have class highlighted-container when goTo stub is clicked', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getGoToConnectorInfo(),
            flowModel: goToFlowModel
        });
        const goToConnector = regularConnector.shadowRoot.querySelector(selectors.goToInfo);
        expect(goToConnector.classList).not.toContain('highlighted-container');
    });

    it('Should disable a branch head connector if the parent has been cut', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getDefaultConnectorInfo(),
            flowModel: defaultFlowModel,
            canvasContext: {
                ...defaultCanvasContext,
                mode: AutoLayoutCanvasMode.CUT,
                cutInfo: {
                    guids: ['parentGuid1']
                }
            }
        });
        const button = regularConnector.shadowRoot
            .querySelector(selectors.alcMenuTrigger)
            .shadowRoot.querySelector('button');
        expect(button.hasAttribute('disabled')).toBeTruthy();
    });

    it('Should not disable a branch head connector that the user has kept', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getDefaultConnectorInfo(),
            flowModel: defaultFlowModel,
            canvasContext: {
                ...defaultCanvasContext,
                mode: AutoLayoutCanvasMode.CUT,
                cutInfo: {
                    guids: ['parentGuid1'],
                    childIndexToKeep: 2
                }
            }
        });
        const button = regularConnector.shadowRoot
            .querySelector(selectors.alcMenuTrigger)
            .shadowRoot.querySelector('button');
        expect(button.hasAttribute('disabled')).toBeFalsy();
    });

    it('Should disable nested branch connectors', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: {
                ...getDefaultConnectorInfo(),
                source: {
                    guid: 'nestedDecision',
                    childIndex: 1
                }
            },
            flowModel: defaultFlowModel,
            canvasContext: {
                ...defaultCanvasContext,
                mode: AutoLayoutCanvasMode.CUT,
                cutInfo: {
                    guids: ['parentGuid1', 'nestedDecision', 'nestedChild'],
                    childIndexToKeep: 1
                }
            }
        });
        const button = regularConnector.shadowRoot
            .querySelector(selectors.alcMenuTrigger)
            .shadowRoot.querySelector('button');
        expect(button.hasAttribute('disabled')).toBeTruthy();
    });

    it('Should disable elements after branch heads being cut', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: {
                ...getDefaultConnectorInfo(),
                source: {
                    guid: 'targetGrandChild'
                }
            },
            flowModel: defaultFlowModel,
            canvasContext: {
                ...defaultCanvasContext,
                mode: AutoLayoutCanvasMode.CUT,
                cutInfo: {
                    guids: ['parentGuid1', 'targetChild', 'targetGrandChild']
                }
            }
        });
        const button = regularConnector.shadowRoot
            .querySelector(selectors.alcMenuTrigger)
            .shadowRoot.querySelector('button');
        expect(button.hasAttribute('disabled')).toBeTruthy();
    });

    it('Should not disable a connector after the element being cut', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: {
                ...getDefaultConnectorInfo(),
                source: {
                    guid: 'parentGuid1'
                }
            },
            flowModel: defaultFlowModel,
            canvasContext: {
                ...defaultCanvasContext,
                mode: AutoLayoutCanvasMode.CUT,
                cutInfo: {
                    guids: ['parentGuid1']
                }
            }
        });
        const button = regularConnector.shadowRoot
            .querySelector(selectors.alcMenuTrigger)
            .shadowRoot.querySelector('button');
        expect(button.hasAttribute('disabled')).toBeFalsy();
    });

    it('Should disable a connector if next element has been cut', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: getMergeConnectorInfo(),
            flowModel: mergeFlowModel,
            canvasContext: {
                ...defaultCanvasContext,
                mode: AutoLayoutCanvasMode.CUT,
                cutInfo: {
                    guids: ['parentGuid', 's2'],
                    childIndexToKeep: 1
                }
            }
        });
        const button = regularConnector.shadowRoot
            .querySelector(selectors.alcMenuTrigger)
            .shadowRoot.querySelector('button');
        expect(button.hasAttribute('disabled')).toBeTruthy();
    });

    it('Should have paste icon when paste is enabled', async () => {
        const regularConnector = await createComponentUnderTest({
            connectorInfo: {
                ...getDefaultConnectorInfo(),
                source: {
                    guid: 'parentGuid1'
                }
            },
            flowModel: defaultFlowModel,
            canvasContext: {
                ...defaultCanvasContext,
                mode: AutoLayoutCanvasMode.CUT,
                cutInfo: {
                    guids: ['parentGuid1']
                }
            }
        });
        const lightningIcons = regularConnector.shadowRoot.querySelectorAll(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ICON
        );
        expect(lightningIcons[1].classList[0]).toBe('secondary-paste-icon');
        expect(lightningIcons[1].classList[1]).toBe('slds-var-m-around_small');
    });
});
