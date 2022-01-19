// @ts-nocheck
import { AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import AlcConnector from 'builder_platform_interaction/alcConnector';
import { OutgoingGoToStubClickEvent } from 'builder_platform_interaction/alcEvents';
import { ConnectorLabelType, NodeType } from 'builder_platform_interaction/autoLayoutCanvas';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';
import { createElement } from 'lwc';
import { LABELS } from '../alcConnectorLabels';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const selectors = {
    connectorToBeDeletedSVG: '.connector-to-be-deleted',
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
        toBeDeleted: false
    };
};

const defaultFlowModel = {
    parentGuid1: {
        nodeType: NodeType.BRANCH,
        children: [null, 'targetChild'],
        childReferences: [{ childReference: 'o1' }],
        defaultConnectorLabel: 'Default'
    },
    targetChild: {
        parent: 'parentGuid1',
        childIndex: 1
    }
};

const getDefaultConnectorInfo = (toBeDeleted = false) => {
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
        toBeDeleted,
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
        toBeDeleted: false,
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

const getGoToConnectorInfo = (toBeDeleted = false) => {
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
        toBeDeleted,
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
        toBeDeleted: false,
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
        toBeDeleted: false,
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
        toBeDeleted: false,
        labelType: ConnectorLabelType.BRANCH
    };
};

const createComponentUnderTest = (
    connectorInfo,
    canvasMode = AutoLayoutCanvasMode.DEFAULT,
    disableAddElements = false,
    flowModel,
    incomingStubGuid = null
) => {
    const el = createElement('builder_platform_interaction-alc-connector', {
        is: AlcConnector
    });

    el.connectorInfo = connectorInfo;
    el.canvasContext = { mode: canvasMode, incomingStubGuid };
    el.disableAddElements = disableAddElements;
    el.flowModel = flowModel;
    setDocumentBodyChildren(el);
    return el;
};

describe('Auto-Layout connector tests', () => {
    it('Should add connector-to-be-deleted class to the connector svg when toBeDeleted is true', () => {
        const defaultConnector = createComponentUnderTest(
            getDefaultConnectorInfo(true),
            AutoLayoutCanvasMode.DEFAULT,
            false,
            defaultFlowModel
        );
        const connectorSVG = defaultConnector.shadowRoot.querySelector(selectors.connectorToBeDeletedSVG);
        expect(connectorSVG).not.toBeNull();
    });

    it('"+" button icon should have the right alternative text', () => {
        const regularConnector = createComponentUnderTest(
            getRegularConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            false,
            regularFlowModel
        );
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton.alternativeText).toBe(LABELS.addElementIconAltText);
    });

    it('Default connector should have the label badge', () => {
        const defaultConnector = createComponentUnderTest(
            getDefaultConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            false,
            defaultFlowModel
        );
        const labelBadge = defaultConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge).not.toBeUndefined();
    });

    it('Default connector should have the right label content', () => {
        const defaultConnectorInfo = getDefaultConnectorInfo();
        const defaultConnector = createComponentUnderTest(
            defaultConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            defaultFlowModel
        );
        const labelBadge = defaultConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(defaultFlowModel.parentGuid1.defaultConnectorLabel);
    });

    it('Run Immediately branching connector should have the right label content', () => {
        const immediateConnectorInfo = getImmediateBranchConnectorInfo();
        const immediateConnector = createComponentUnderTest(
            immediateConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            branchingStartFlowModel
        );
        const labelBadge = immediateConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(branchingStartFlowModel.startGuid1.defaultConnectorLabel);
    });

    it('Run Immediately straight connector should have the right label content', () => {
        const immediateConnectorInfo = getImmediateStraightConnectorInfo();
        const immediateConnector = createComponentUnderTest(
            immediateConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            immediateStartFlowModel
        );
        const labelBadge = immediateConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(immediateStartFlowModel.startGuid1.defaultConnectorLabel);
    });

    it('Scheduled Path connector should have the right label content', () => {
        const scheduledPathConnectorInfo = getScheduledPathConnectorInfo();
        const scheduledPathConnector = createComponentUnderTest(
            scheduledPathConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            branchingStartFlowModel
        );
        const labelBadge = scheduledPathConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(branchingStartFlowModel.p1.label);
    });

    it('Fault connector should have the label badge', () => {
        const faultConnector = createComponentUnderTest(
            getFaultConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            false,
            faultFlowModel
        );
        const labelBadge = faultConnector.shadowRoot.querySelector(selectors.faultConnectorBadge);
        expect(labelBadge).not.toBeUndefined();
    });

    it('Fault connector should have the right label content', () => {
        const faultConnector = createComponentUnderTest(
            getFaultConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            false,
            faultFlowModel
        );
        const labelBadge = faultConnector.shadowRoot.querySelector(selectors.faultConnectorBadge);
        expect(labelBadge.textContent).toEqual(LABELS.faultConnectorBadgeLabel);
    });

    it('"+" button should be hidden when in selection mode', () => {
        const regularConnector = createComponentUnderTest(
            getRegularConnectorInfo(),
            AutoLayoutCanvasMode.SELECTION,
            false,
            regularFlowModel
        );
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton).toBeNull();
    });

    it('"+" button should be hidden when disableAddElements is true', () => {
        const regularConnector = createComponentUnderTest(
            getRegularConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            true,
            regularFlowModel
        );
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton).toBeNull();
    });

    it('Should have the title property on a GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(
            goToConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel
        );
        const goToInfo = goToConnector.shadowRoot.querySelector(selectors.goToInfo);
        expect(goToInfo.title).toBe(goToFlowModel.targetChild.label);
    });

    it('Should have the target info (label) on a GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(
            goToConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel
        );
        const goToTargetLabel = goToConnector.shadowRoot.querySelector(selectors.goToTargetLabel);
        expect(goToTargetLabel).not.toBeNull();
    });

    it('Should have the right text content on the target info (label) of the GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(
            goToConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel
        );
        const goToTargetLabel = goToConnector.shadowRoot.querySelector(selectors.goToTargetLabel);
        expect(goToTargetLabel.textContent).toBe(goToFlowModel.targetChild.label);
    });

    it('Should have the target info (arrow) on a GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(
            goToConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel
        );
        const goToTargetArrow = goToConnector.shadowRoot.querySelectorAll(selectors.goToTargetArrow)[1];
        expect(goToTargetArrow).not.toBeNull();
    });

    it('Should have the right text content on the target info (arrow) of the GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(
            goToConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel
        );
        const goToTargetArrow = goToConnector.shadowRoot.querySelectorAll(selectors.goToTargetArrow)[1];
        expect(goToTargetArrow.textContent).toBe('→');
    });

    it('Clicking on the goTo info should dispatch OutgoingGoToStubClickEvent', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(
            goToConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel
        );
        const callback = jest.fn();
        goToConnector.addEventListener(OutgoingGoToStubClickEvent.EVENT_NAME, callback);
        goToConnector.shadowRoot.querySelector(selectors.goToInfo).click();
        expect(callback).toHaveBeenCalled();
    });

    it('Clicking on the goTo info should dispatch OutgoingGoToStubClickEvent with the right details', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(
            goToConnectorInfo,
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel
        );
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

    it('Should have aria attributes set properly for add button', () => {
        const regularConnector = createComponentUnderTest(
            getRegularConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            false,
            regularFlowModel
        );
        const connectorButtonLabel = regularConnector.shadowRoot.querySelector(selectors.alcMenuTrigger);
        expect(connectorButtonLabel.getAttribute('aria-label')).toEqual(LABELS.connectorButtonLabel);
        expect(connectorButtonLabel.getAttribute('aria-haspopup')).toEqual('dialog');
    });

    it('Should have class highlighted-container when goTo stub is clicked', () => {
        const regularConnector = createComponentUnderTest(
            getGoToConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel,
            'targetChild'
        );
        const goToConnector = regularConnector.shadowRoot.querySelector(selectors.goToInfo);
        expect(goToConnector.classList).toContain('highlighted-container');
    });

    it('Should not have class highlighted-container when goTo stub is clicked', () => {
        const regularConnector = createComponentUnderTest(
            getGoToConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            false,
            goToFlowModel
        );
        const goToConnector = regularConnector.shadowRoot.querySelector(selectors.goToInfo);
        expect(goToConnector.classList).not.toContain('highlighted-container');
    });
});
