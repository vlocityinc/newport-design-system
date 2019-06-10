import {
    getScaleAndOffsetValuesOnZoom,
    getOffsetValuesOnPan,
    getDistanceBetweenViewportCenterAndElement,
    isElementInViewport
} from '../zoomPanUtils';
import { ZOOM_ACTION } from 'builder_platform_interaction/events';

describe('Testing getScaleAndDeltaValues', () => {
    const viewportAndOffsetConfig = {
        viewportDimensions: {
            viewportWidth: 500,
            viewportHeight: 500,
            viewportCenterPoint: [250, 250]
        },
        centerOffsets: [0, 0]
    };

    it('Gets the scale and delta values for zoom out action', () => {
        expect(
            getScaleAndOffsetValuesOnZoom(
                ZOOM_ACTION.ZOOM_OUT,
                0.4,
                viewportAndOffsetConfig,
                [{ locationX: 20, locationY: 20 }]
            )
        ).toEqual({
            newScaledOffsetLeft: 0,
            newScaledOffsetTop: 0,
            newScale: 0.2
        });
    });

    it('Gets the scale and delta values for zoom to fit action', () => {
        expect(
            getScaleAndOffsetValuesOnZoom(
                ZOOM_ACTION.ZOOM_TO_FIT,
                0.4,
                viewportAndOffsetConfig,
                [{ locationX: 20, locationY: 20 }]
            )
        ).toEqual({
            newScaledOffsetLeft: 82.4,
            newScaledOffsetTop: 72.8,
            newScale: 0.4
        });
    });

    it('Gets the scale and delta values for zoom to view action', () => {
        expect(
            getScaleAndOffsetValuesOnZoom(
                ZOOM_ACTION.ZOOM_TO_VIEW,
                0.4,
                viewportAndOffsetConfig,
                [{ locationX: 20, locationY: 20 }]
            )
        ).toEqual({
            newScaledOffsetLeft: 0,
            newScaledOffsetTop: 0,
            newScale: 1
        });
    });

    it('Gets the scale and delta values for zoom in action', () => {
        expect(
            getScaleAndOffsetValuesOnZoom(
                ZOOM_ACTION.ZOOM_IN,
                0.4,
                viewportAndOffsetConfig,
                [{ locationX: 20, locationY: 20 }]
            )
        ).toEqual({
            newScaledOffsetLeft: 0,
            newScaledOffsetTop: 0,
            newScale: 0.6000000000000001
        });
    });
});

describe('Testing getOffsetValues', () => {
    it('Gets the translateX and translateY values for panning with positive offsets', () => {
        expect(
            getOffsetValuesOnPan({
                scaledOffsetsOnPanStart: [10, 10],
                mouseDownPoint: [20, 20],
                mouseMovePoint: [40, 40]
            })
        ).toEqual({ newScaledOffsetLeft: 30, newScaledOffsetTop: 30 });
    });

    it('Gets the translateX and translateY values for panning with negative offsets', () => {
        expect(
            getOffsetValuesOnPan({
                scaledOffsetsOnPanStart: [-10, -10],
                mouseDownPoint: [20, 20],
                mouseMovePoint: [40, 40]
            })
        ).toEqual({ newScaledOffsetLeft: 10, newScaledOffsetTop: 10 });
    });
});

describe('Testing getDistanceBetweenViewportCenterAndElement', () => {
    it('Gets the distance between the element and the viewport center when the element is to the right of the center', () => {
        expect(
            getDistanceBetweenViewportCenterAndElement(
                [250, 250],
                300,
                250,
                0.4
            )
        ).toEqual({ newScaledOffsetLeft: -20, newScaledOffsetTop: 0 });
    });

    it('Gets the distance between the element and the viewport center when the element is to the left of the center', () => {
        expect(
            getDistanceBetweenViewportCenterAndElement(
                [250, 250],
                200,
                250,
                0.4
            )
        ).toEqual({ newScaledOffsetLeft: 20, newScaledOffsetTop: 0 });
    });

    it('Gets the distance between the element and the viewport center when the element is to the bottom of the center', () => {
        expect(
            getDistanceBetweenViewportCenterAndElement(
                [250, 250],
                250,
                300,
                0.4
            )
        ).toEqual({ newScaledOffsetLeft: 0, newScaledOffsetTop: -20 });
    });

    it('Gets the distance between the element and the viewport center when the element is to the top of the center', () => {
        expect(
            getDistanceBetweenViewportCenterAndElement(
                [250, 250],
                250,
                200,
                0.4
            )
        ).toEqual({ newScaledOffsetLeft: 0, newScaledOffsetTop: 20 });
    });
});

describe('Testing isElementInViewport', () => {
    it('When element is to left of the viewport center and in the viewport', () => {
        expect(
            isElementInViewport({
                originalScaledCenterOffsets: [0, 0],
                newScaledCenterOffsets: [50, 0],
                viewportCenterPoint: [250, 250]
            })
        ).toBeTruthy();
    });

    it('When element is to left of the viewport center and outside the viewport', () => {
        expect(
            isElementInViewport({
                originalScaledCenterOffsets: [0, 0],
                newScaledCenterOffsets: [300, 0],
                viewportCenterPoint: [250, 250]
            })
        ).toBeFalsy();
    });

    it('When element is to right of the viewport center and in the viewport', () => {
        expect(
            isElementInViewport({
                originalScaledCenterOffsets: [0, 0],
                newScaledCenterOffsets: [-50, 0],
                viewportCenterPoint: [250, 250]
            })
        ).toBeTruthy();
    });

    it('When element is to right of the viewport center and outside the viewport', () => {
        expect(
            isElementInViewport({
                originalScaledCenterOffsets: [0, 0],
                newScaledCenterOffsets: [-300, 0],
                viewportCenterPoint: [250, 250]
            })
        ).toBeFalsy();
    });

    it('When element is to top of the viewport center and in the viewport', () => {
        expect(
            isElementInViewport({
                originalScaledCenterOffsets: [0, 0],
                newScaledCenterOffsets: [0, 50],
                viewportCenterPoint: [250, 250]
            })
        ).toBeTruthy();
    });

    it('When element is to top of the viewport center and outside the viewport', () => {
        expect(
            isElementInViewport({
                originalScaledCenterOffsets: [0, 0],
                newScaledCenterOffsets: [0, 300],
                viewportCenterPoint: [250, 250]
            })
        ).toBeFalsy();
    });

    it('When element is to bottom of the viewport center and in the viewport', () => {
        expect(
            isElementInViewport({
                originalScaledCenterOffsets: [0, 0],
                newScaledCenterOffsets: [0, -50],
                viewportCenterPoint: [250, 250]
            })
        ).toBeTruthy();
    });

    it('When element is to bottom of the viewport center and outside the viewport', () => {
        expect(
            isElementInViewport({
                originalScaledCenterOffsets: [0, 0],
                newScaledCenterOffsets: [0, -300],
                viewportCenterPoint: [250, 250]
            })
        ).toBeFalsy();
    });
});
