// @ts-nocheck
import { createElement } from 'lwc';
import ZoomPanel from 'builder_platform_interaction/zoomPanel';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { ToggleMarqueeOnEvent, ClickToZoomEvent, ZOOM_ACTION } from 'builder_platform_interaction/events';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';

const { KeyboardInteractions } = keyboardInteractionUtils;

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-zoom-panel', {
        is: ZoomPanel
    });

    Object.assign(el, props, {
        keyboardInteractions: new KeyboardInteractions()
    });

    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    marqueeButton: 'lightning-button-icon-stateful',
    zoomButtonGroup: 'lightning-button-group',
    zoomOutButton: 'lightning-button-icon.zoomOutButton',
    zoomInButton: 'lightning-button-icon.zoomInButton',
    fitExpandButton: 'lightning-button-icon.fitExpandButton'
};

describe('Zoom Panel', () => {
    describe('Marquee button', () => {
        it('check marquee button is hidden by default when showMarqueeButton is false', () => {
            const zoomPanelElement = createComponentUnderTest();
            const marqueeButton = zoomPanelElement.shadowRoot.querySelector(selectors.marqueeButton);
            expect(marqueeButton).toBeNull();
        });

        it('check marquee button is shown when showMarqueeButton specified to true', () => {
            const zoomPanelElement = createComponentUnderTest({
                showMarqueeButton: true
            });
            const marqueeButton = zoomPanelElement.shadowRoot.querySelector(selectors.marqueeButton);
            expect(marqueeButton).not.toBeNull();
        });
        it('dispatches the toggleMarqueeOnEvent when the marquee button is clicked', () => {
            const zoomPanelElement = createComponentUnderTest({
                showMarqueeButton: true
            });
            const marqueeButton = zoomPanelElement.shadowRoot.querySelector(selectors.marqueeButton);
            const callBack = jest.fn();
            zoomPanelElement.addEventListener(ToggleMarqueeOnEvent.EVENT_NAME, callBack);
            marqueeButton.click();
            expect(callBack).toHaveBeenCalled();
        });
    });

    describe('Zoom button group', () => {
        it('check zoom button group is shown by default', () => {
            const zoomPanelElement = createComponentUnderTest();
            const zoomButtonGroup = zoomPanelElement.shadowRoot.querySelector(selectors.zoomButtonGroup);
            expect(zoomButtonGroup).not.toBeNull();
        });
        it('dispatches the ClickToZoomEvent with the zoom-out action when the zoom out button is clicked', () => {
            const zoomPanelElement = createComponentUnderTest();
            const zoomOutButton = zoomPanelElement.shadowRoot.querySelector(selectors.zoomOutButton);
            const callBack = jest.fn();
            zoomPanelElement.addEventListener(ClickToZoomEvent.EVENT_NAME, callBack);
            zoomOutButton.click();
            expect(callBack.mock.calls[0][0].detail).toMatchObject({
                action: ZOOM_ACTION.ZOOM_OUT
            });
        });
        it('dispatches the ClickToZoomEvent with the zoom-in action when the zoom in button is clicked', () => {
            const zoomPanelElement = createComponentUnderTest();
            const zoomInButton = zoomPanelElement.shadowRoot.querySelector(selectors.zoomInButton);
            const callBack = jest.fn();
            zoomPanelElement.addEventListener(ClickToZoomEvent.EVENT_NAME, callBack);
            zoomInButton.click();
            expect(callBack.mock.calls[0][0].detail).toMatchObject({
                action: ZOOM_ACTION.ZOOM_IN
            });
        });

        it('dispatches the ClickToZoomEvent with the zoom-to-view action when the fully zoomed out and the fitExpandButton button is clicked', () => {
            const zoomPanelElement = createComponentUnderTest({
                isZoomInDisabled: true
            });
            const fitExpandButton = zoomPanelElement.shadowRoot.querySelector(selectors.fitExpandButton);
            const callBack = jest.fn();
            zoomPanelElement.addEventListener(ClickToZoomEvent.EVENT_NAME, callBack);
            fitExpandButton.click();
            expect(callBack.mock.calls[0][0].detail).toMatchObject({ action: ZOOM_ACTION.ZOOM_TO_FIT });
        });
        it('dispatches the ClickToZoomEvent with the zoom-to-fit action when fully zoomed in and the fitExpandButton button is clicked', () => {
            const zoomPanelElement = createComponentUnderTest({
                isZoomInDisabled: false
            });
            const fitExpandButton = zoomPanelElement.shadowRoot.querySelector(selectors.fitExpandButton);
            const callBack = jest.fn();
            zoomPanelElement.addEventListener(ClickToZoomEvent.EVENT_NAME, callBack);
            fitExpandButton.click();
            expect(callBack.mock.calls[0][0].detail).toMatchObject({ action: ZOOM_ACTION.ZOOM_TO_VIEW });
        });
    });
});
