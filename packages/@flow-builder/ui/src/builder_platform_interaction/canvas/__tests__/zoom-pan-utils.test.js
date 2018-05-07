import { getScaleAndDeltaValues, getOffsetValues } from '../zoom-pan-utils';
import { ZOOM_ACTION } from 'builder_platform_interaction-events';

describe('Zoom Pan Utils', () => {
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