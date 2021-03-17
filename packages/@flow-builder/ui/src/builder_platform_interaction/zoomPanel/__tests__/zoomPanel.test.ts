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
    zoomToFitButton: 'lightning-button-icon.fitButton',
    zoomToViewButton: 'lightning-button-icon.expandButton'
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

        it('shows the zoom to fit button when isZoomToView is true', () => {
            const zoomPanelElement = createComponentUnderTest({
                isZoomToView: true
            });
            const zoomToFitButton = zoomPanelElement.shadowRoot.querySelector(selectors.zoomToFitButton);
            const zoomToViewButton = zoomPanelElement.shadowRoot.querySelector(selectors.zoomToViewButton);
            expect.assertions(2);
            expect(zoomToFitButton).not.toBeNull();
            expect(zoomToViewButton).toBeNull();
        });
        it('shows the zoom to view button when isZoomToView is false', () => {
            const zoomPanelElement = createComponentUnderTest({
                isZoomToView: false
            });
            const zoomToViewButton = zoomPanelElement.shadowRoot.querySelector(selectors.zoomToViewButton);
            const zoomToFitButton = zoomPanelElement.shadowRoot.querySelector(selectors.zoomToFitButton);
            expect.assertions(2);
            expect(zoomToViewButton).not.toBeNull();
            expect(zoomToFitButton).toBeNull();
        });

        it('dispatches the ClickToZoomEvent with the zoom-to-fit action when the zoom to fit button is clicked', () => {
            const zoomPanelElement = createComponentUnderTest({
                isZoomToView: true
            });
            const zoomToFitButton = zoomPanelElement.shadowRoot.querySelector(selectors.zoomToFitButton);
            const callBack = jest.fn();
            zoomPanelElement.addEventListener(ClickToZoomEvent.EVENT_NAME, callBack);
            zoomToFitButton.click();
            expect(callBack.mock.calls[0][0].detail).toMatchObject({ action: ZOOM_ACTION.ZOOM_TO_FIT });
        });
        it('dispatches the ClickToZoomEvent with the zoom-to-view action when the zoom to view button is clicked', () => {
            const zoomPanelElement = createComponentUnderTest({
                isZoomToView: false
            });
            const zoomToViewButton = zoomPanelElement.shadowRoot.querySelector(selectors.zoomToViewButton);
            const callBack = jest.fn();
            zoomPanelElement.addEventListener(ClickToZoomEvent.EVENT_NAME, callBack);
            zoomToViewButton.click();
            expect(callBack.mock.calls[0][0].detail).toMatchObject({ action: ZOOM_ACTION.ZOOM_TO_VIEW });
        });
    });
});
