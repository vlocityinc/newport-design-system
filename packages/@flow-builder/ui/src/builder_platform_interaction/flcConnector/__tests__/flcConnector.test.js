import { createElement } from 'lwc';
import FlcConnector from 'builder_platform_interaction/flcConnector';
import { ConditionType } from 'builder_platform_interaction/flowUtils';

const defaultConnectorInfo = {
    type: 'branchHead',
    geometry: {
        x: 0,
        y: 0,
        w: 20,
        h: 40
    },
    svgInfo: {
        geometry: {
            x: 0,
            y: 0,
            w: 20,
            h: 40
        },
        path: 'M 10, 20'
    },
    addInfo: {
        offsetY: 20,
        menuOpened: false
    },
    connectionInfo: {
        prev: null,
        next: 'nextGuid1',
        parent: 'parentGuid1',
        childIndex: 1
    },
    isFault: false,
    labelOffsetY: 50,
    conditionType: ConditionType.DEFAULT,
    defaultConnectorLabel: 'Default Connector Label',
    toBeDeleted: false
};

const createComponentUnderTest = connectorInfo => {
    const el = createElement('builder_platform_interaction-flc-connector', {
        is: FlcConnector
    });

    el.connectorInfo = connectorInfo;
    document.body.appendChild(el);
    return el;
};

describe('Auto-Layout connector tests', () => {
    it('Default connector should have the label badge', () => {
        const defaultConnector = createComponentUnderTest(defaultConnectorInfo);
        const labelBadge = defaultConnector.shadowRoot.querySelector('.connector-badge.default-badge span');
        expect(labelBadge).not.toBeUndefined();
    });

    it('Default connector should have the right label content', () => {
        const defaultConnector = createComponentUnderTest(defaultConnectorInfo);
        const labelBadge = defaultConnector.shadowRoot.querySelector('.connector-badge.default-badge span');
        expect(labelBadge.textContent).toEqual(defaultConnectorInfo.defaultConnectorLabel);
    });
});
