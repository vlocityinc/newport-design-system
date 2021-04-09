// @ts-nocheck
import { createElement } from 'lwc';
import FlcConnector from 'builder_platform_interaction/flcConnector';
import { ConnectorLabelType } from 'builder_platform_interaction/autoLayoutCanvas';
import { AutoLayoutCanvasMode } from 'builder_platform_interaction/flcComponentsUtils';
import { LABELS } from '../flcConnectorLabels';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const selectors = {
    connectorToBeDeletedSVG: '.connector-to-be-deleted',
    addElementButton: '.circle-text',
    defaultConnectorBadge: '.connector-badge span',
    faultConnectorBadge: '.connector-badge.fault-badge span',
    goToTargetLabel: '.go-to-info .go-to-target-label span',
    goToTargetArrow: '.go-to-info span',
    flcButtonMenu: 'builder_platform_interaction-flc-button-menu'
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

const getRegularConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        connectionInfo: {
            prev: 'prevGuid1',
            next: 'nextGuid1'
        },
        isFault: false,
        labelOffsetY,
        connectorBadgeLabel: 'Regular Connector Label',
        toBeDeleted: false
    };
};

const getDefaultConnectorInfo = (toBeDeleted = false) => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        connectionInfo: {
            next: 'nextGuid1',
            parent: 'parentGuid1',
            childIndex: 1
        },
        isFault: false,
        labelOffsetY,
        connectorBadgeLabel: 'Default Connector Label',
        toBeDeleted,
        labelType: ConnectorLabelType.BRANCH
    };
};

const getFaultConnectorInfo = () => {
    return {
        type: 'straight',
        geometry,
        svgInfo,
        addInfo,
        connectionInfo: {
            next: 'nextGuid1',
            parent: 'parentGuid1',
            childIndex: -1
        },
        isFault: true,
        labelOffsetY,
        toBeDeleted: false,
        labelType: ConnectorLabelType.FAULT
    };
};

const getGoToConnectorInfo = (toBeDeleted = false) => {
    return {
        type: 'goTo',
        geometry,
        svgInfo,
        addInfo,
        connectionInfo: {
            next: 'nextGuid1',
            parent: 'parentGuid1',
            childIndex: 1
        },
        isFault: false,
        labelOffsetY,
        connectorBadgeLabel: 'Default Connector Label',
        toBeDeleted,
        labelType: ConnectorLabelType.BRANCH,
        goToTargetLabel: 'Next Element'
    };
};

const createComponentUnderTest = (
    connectorInfo,
    canvasMode = AutoLayoutCanvasMode.DEFAULT,
    disableAddElements = false
) => {
    const el = createElement('builder_platform_interaction-flc-connector', {
        is: FlcConnector
    });

    el.connectorInfo = connectorInfo;
    el.canvasMode = canvasMode;
    el.disableAddElements = disableAddElements;
    setDocumentBodyChildren(el);
    return el;
};

describe('Auto-Layout connector tests', () => {
    it('Should add connector-to-be-deleted class to the connector svg when toBeDeleted is true', () => {
        const defaultConnector = createComponentUnderTest(getDefaultConnectorInfo(true));
        const connectorSVG = defaultConnector.shadowRoot.querySelector(selectors.connectorToBeDeletedSVG);
        expect(connectorSVG).not.toBeNull();
    });

    it('"+" button icon should have the right alternative text', () => {
        const regularConnector = createComponentUnderTest(getRegularConnectorInfo());
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton.alternativeText).toBe(LABELS.addElementIconAltText);
    });

    it('Default connector should have the label badge', () => {
        const defaultConnector = createComponentUnderTest(getDefaultConnectorInfo());
        const labelBadge = defaultConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge).not.toBeUndefined();
    });

    it('Default connector should have the right label content', () => {
        const defaultConnectorInfo = getDefaultConnectorInfo();
        const defaultConnector = createComponentUnderTest(defaultConnectorInfo);
        const labelBadge = defaultConnector.shadowRoot.querySelector(selectors.defaultConnectorBadge);
        expect(labelBadge.textContent).toEqual(defaultConnectorInfo.connectorBadgeLabel);
    });

    it('Fault connector should have the label badge', () => {
        const faultConnector = createComponentUnderTest(getFaultConnectorInfo());
        const labelBadge = faultConnector.shadowRoot.querySelector(selectors.faultConnectorBadge);
        expect(labelBadge).not.toBeUndefined();
    });

    it('Fault connector should have the right label content', () => {
        const faultConnector = createComponentUnderTest(getFaultConnectorInfo());
        const labelBadge = faultConnector.shadowRoot.querySelector(selectors.faultConnectorBadge);
        expect(labelBadge.textContent).toEqual(LABELS.faultConnectorBadgeLabel);
    });

    it('"+" button should be hidden when in selection mode', () => {
        const regularConnector = createComponentUnderTest(getRegularConnectorInfo(), AutoLayoutCanvasMode.SELECTION);
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton).toBeNull();
    });

    it('"+" button should be hidden when disableAddElements is true', () => {
        const regularConnector = createComponentUnderTest(
            getRegularConnectorInfo(),
            AutoLayoutCanvasMode.DEFAULT,
            true
        );
        const addElementButton = regularConnector.shadowRoot.querySelector(selectors.addElementButton);
        expect(addElementButton).toBeNull();
    });

    it('Should have the target info (label) on a GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(goToConnectorInfo, AutoLayoutCanvasMode.DEFAULT);
        const goToTargetLabel = goToConnector.shadowRoot.querySelector(selectors.goToTargetLabel);
        expect(goToTargetLabel).not.toBeNull();
    });

    it('Should have the right text content on the target info (label) of the GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(goToConnectorInfo, AutoLayoutCanvasMode.DEFAULT);
        const goToTargetLabel = goToConnector.shadowRoot.querySelector(selectors.goToTargetLabel);
        expect(goToTargetLabel.textContent).toBe(goToConnectorInfo.goToTargetLabel);
    });

    it('Should have the target info (arrow) on a GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(goToConnectorInfo, AutoLayoutCanvasMode.DEFAULT);
        const goToTargetArrow = goToConnector.shadowRoot.querySelectorAll(selectors.goToTargetArrow)[1];
        expect(goToTargetArrow).not.toBeNull();
    });

    it('Should have the right text content on the target info (arrow) of the GoTo connector', () => {
        const goToConnectorInfo = getGoToConnectorInfo();
        const goToConnector = createComponentUnderTest(goToConnectorInfo, AutoLayoutCanvasMode.DEFAULT);
        const goToTargetArrow = goToConnector.shadowRoot.querySelectorAll(selectors.goToTargetArrow)[1];
        expect(goToTargetArrow.textContent).toBe('→');
    });

    it('Should have aria attributes set properly for add button', () => {
        const regularConnector = createComponentUnderTest(getRegularConnectorInfo(), AutoLayoutCanvasMode.DEFAULT);
        const connectorButtonLabel = regularConnector.shadowRoot.querySelector(selectors.flcButtonMenu);
        expect(connectorButtonLabel.getAttribute('aria-label')).toEqual(LABELS.connectorButtonLabel);
        expect(connectorButtonLabel.getAttribute('aria-haspopup')).toEqual('dialog');
    });
});
