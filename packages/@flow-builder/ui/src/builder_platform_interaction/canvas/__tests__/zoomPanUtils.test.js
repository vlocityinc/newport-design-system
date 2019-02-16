import { getScaleAndDeltaValues, getOffsetValues, getDistanceBetweenViewportCenterAndElement, isElementInViewport } from "../zoomPanUtils";
import { ZOOM_ACTION } from "builder_platform_interaction/events";

describe('Testing getScaleAndDeltaValues', () => {
    const viewportAndOffsetConfig = {
        viewportWidth: 500,
        viewportHeight: 500,
        viewportCenterX: 250,
        viewportCenterY: 250,
        centerOffsetX: 0,
        centerOffsetY: 0
    };

    it('Gets the scale and delta values for zoom out action', () => {
        expect(
            getScaleAndDeltaValues(ZOOM_ACTION.ZOOM_OUT, 0.4, viewportAndOffsetConfig, [{locationX: 20, locationY: 20}])
        ).toEqual({newScale: 0.2, deltaX: 0, deltaY: 0});
    });

    it('Gets the scale and delta values for zoom to fit action', () => {
        expect(
            getScaleAndDeltaValues(ZOOM_ACTION.ZOOM_TO_FIT, 0.4, viewportAndOffsetConfig, [{locationX: 20, locationY: 20}])
        ).toEqual({newScale: 0.4, deltaX: 206, deltaY: 182});
    });

    it('Gets the scale and delta values for zoom to view action', () => {
        expect(
            getScaleAndDeltaValues(ZOOM_ACTION.ZOOM_TO_VIEW, 0.4, viewportAndOffsetConfig, [{locationX: 20, locationY: 20}])
        ).toEqual({newScale: 1, deltaX: 0, deltaY: 0});
    });

    it('Gets the scale and delta values for zoom in action', () => {
        expect(
            getScaleAndDeltaValues(ZOOM_ACTION.ZOOM_IN, 0.4, viewportAndOffsetConfig, [{locationX: 20, locationY: 20}])
        ).toEqual({newScale: 0.6000000000000001, deltaX: 0, deltaY: 0});
    });
});

describe('Testing getOffsetValues', () => {
    it('Gets the translateX and translateY values for panning with positive offsets', () => {
        expect(
            getOffsetValues({scaledCenterOffsetX: 10, scaledCenterOffsetY: 10, mouseDownX: 20, mouseDownY: 20, mouseMoveX: 40, mouseMoveY: 40})
        ).toEqual({offsetLeft: 30, offsetTop: 30});
    });

    it('Gets the translateX and translateY values for panning with negative offsets', () => {
        expect(
            getOffsetValues({scaledCenterOffsetX: -10, scaledCenterOffsetY: -10, mouseDownX: 20, mouseDownY: 20, mouseMoveX: 40, mouseMoveY: 40})
        ).toEqual({offsetLeft: 10, offsetTop: 10});
    });
});

describe('Testing getDistanceBetweenViewportCenterAndElement', () => {
    it('Gets the distance between the element and the viewport center when the element is to the right of the center', () => {
        expect(
            getDistanceBetweenViewportCenterAndElement(250, 250, 300, 250, 0.4)
        ).toEqual({newInnerCanvasOffsetLeft: -20, newInnerCanvasOffsetTop: 0});
    });

    it('Gets the distance between the element and the viewport center when the element is to the left of the center', () => {
        expect(
            getDistanceBetweenViewportCenterAndElement(250, 250, 200, 250, 0.4)
        ).toEqual({newInnerCanvasOffsetLeft: 20, newInnerCanvasOffsetTop: 0});
    });

    it('Gets the distance between the element and the viewport center when the element is to the bottom of the center', () => {
        expect(
            getDistanceBetweenViewportCenterAndElement(250, 250, 250, 300, 0.4)
        ).toEqual({newInnerCanvasOffsetLeft: 0, newInnerCanvasOffsetTop: -20});
    });

    it('Gets the distance between the element and the viewport center when the element is to the top of the center', () => {
        expect(
            getDistanceBetweenViewportCenterAndElement(250, 250, 250, 200, 0.4)
        ).toEqual({newInnerCanvasOffsetLeft: 0, newInnerCanvasOffsetTop: 20});
    });
});

describe('Testing isElementInViewport', () => {
    it('When element is to left of the viewport center and in the viewport', () => {
        expect(isElementInViewport({currentInnerCanvasOffsetLeft: 0, currentInnerCanvasOffsetTop: 0, newInnerCanvasOffsetLeft: 50,
            newInnerCanvasOffsetTop: 0, viewportCenterX: 250, viewportCenterY: 250})).toBeTruthy();
    });

    it('When element is to left of the viewport center and outside the viewport', () => {
        expect(isElementInViewport({currentInnerCanvasOffsetLeft: 0, currentInnerCanvasOffsetTop: 0, newInnerCanvasOffsetLeft: 300,
                newInnerCanvasOffsetTop: 0, viewportCenterX: 250, viewportCenterY: 250})).toBeFalsy();
    });

    it('When element is to right of the viewport center and in the viewport', () => {
        expect(isElementInViewport({currentInnerCanvasOffsetLeft: 0, currentInnerCanvasOffsetTop: 0, newInnerCanvasOffsetLeft: -50,
            newInnerCanvasOffsetTop: 0, viewportCenterX: 250, viewportCenterY: 250})).toBeTruthy();
    });

    it('When element is to right of the viewport center and outside the viewport', () => {
        expect(isElementInViewport({currentInnerCanvasOffsetLeft: 0, currentInnerCanvasOffsetTop: 0, newInnerCanvasOffsetLeft: -300,
            newInnerCanvasOffsetTop: 0, viewportCenterX: 250, viewportCenterY: 250})).toBeFalsy();
    });

    it('When element is to top of the viewport center and in the viewport', () => {
        expect(isElementInViewport({currentInnerCanvasOffsetLeft: 0, currentInnerCanvasOffsetTop: 0, newInnerCanvasOffsetLeft: 0,
            newInnerCanvasOffsetTop: 50, viewportCenterX: 250, viewportCenterY: 250})).toBeTruthy();
    });

    it('When element is to top of the viewport center and outside the viewport', () => {
        expect(isElementInViewport({currentInnerCanvasOffsetLeft: 0, currentInnerCanvasOffsetTop: 0, newInnerCanvasOffsetLeft: 0,
            newInnerCanvasOffsetTop: 300, viewportCenterX: 250, viewportCenterY: 250})).toBeFalsy();
    });

    it('When element is to bottom of the viewport center and in the viewport', () => {
        expect(isElementInViewport({currentInnerCanvasOffsetLeft: 0, currentInnerCanvasOffsetTop: 0, newInnerCanvasOffsetLeft: 0,
            newInnerCanvasOffsetTop: -50, viewportCenterX: 250, viewportCenterY: 250})).toBeTruthy();
    });

    it('When element is to bottom of the viewport center and outside the viewport', () => {
        expect(isElementInViewport({currentInnerCanvasOffsetLeft: 0, currentInnerCanvasOffsetTop: 0, newInnerCanvasOffsetLeft: 0,
            newInnerCanvasOffsetTop: -300, viewportCenterX: 250, viewportCenterY: 250})).toBeFalsy();
    });
});