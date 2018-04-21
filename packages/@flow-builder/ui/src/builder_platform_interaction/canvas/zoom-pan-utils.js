import { ZOOM_ACTION } from 'builder_platform_interaction-events';
import { getFlowBounds } from 'builder_platform_interaction-connector-utils';

export const SCALE_BOUNDS = {
    MIN_SCALE: 0.2,
    MAX_SCALE: 1.0,
    SCALE_CHANGE: 0.2
};

/**
 * An object containing viewport and offset numbers
 * @typedef {Object} viewportAndOffsetConfig
 * @property {Number} viewportWidth - Width of the current viewport
 * @property {Number} viewportHeight - Height of the current viewport
 * @property {Number} viewportCenterX - x-coordinate of the viewport center
 * @property {Number} viewportCenterY - y-coordinate of the viewport center
 * @property {Number} centerOffsetX - Distance between the center of the viewport and the inner canvas center in x direction
 * @property {Number} centerOffsetY - Distance between the center of the viewport and the inner canvas center in y direction
 */

/**
 * Method to get the new zoom level and delta values based on the zoom action performed.
 *
 * @param {String} action - Zoom action coming from canvasZoom method in canvas.js
 * @param {Number} currentScale - Current scale of the inner canvas
 * @param {Object} viewportAndOffsetConfig - Contains all viewport and offset numbers
 * @param {Array} canvasElements - Array of canvas elements
 * @return {Object} result - Contains the new scale along with the new deltaX and deltaY values
 */
export function getScaleAndDeltaValues(action, currentScale, { viewportWidth, viewportHeight, viewportCenterX,
    viewportCenterY, centerOffsetX, centerOffsetY }, canvasElements) {
    // Spacing to add on the edges after zooming to fit
    // TODO: Update it based on UX feedback
    const VIEWPORT_SPACING = 100;

    const scaleAndDeltaConfig = {};

    // TODO: Add null checks. Will be covered with panning work-item (W-4907821)
    if (action === ZOOM_ACTION.ZOOM_OUT) {
        scaleAndDeltaConfig.newScale = Math.max(SCALE_BOUNDS.MIN_SCALE, currentScale - SCALE_BOUNDS.SCALE_CHANGE);
        scaleAndDeltaConfig.deltaX = 0;
        scaleAndDeltaConfig.deltaY = 0;
    } else if (action === ZOOM_ACTION.ZOOM_TO_FIT) {
        const fitWidth = viewportWidth - VIEWPORT_SPACING;
        const fitHeight = viewportHeight - VIEWPORT_SPACING;

        // Calculating the flow width and height along with the minimum and maximum bounds
        const flowBounds = getFlowBounds(canvasElements);

        // Calculating the width and height ratio between the viewport and the flow.
        const widthRatio = fitWidth / flowBounds.flowWidth;
        const heightRatio = fitHeight / flowBounds.flowHeight;

        // Calculating how much the flow needs to shift in order to be in the center of the viewport
        scaleAndDeltaConfig.deltaX = centerOffsetX + (viewportCenterX - (flowBounds.minX + (flowBounds.flowWidth / 2)));
        scaleAndDeltaConfig.deltaY = centerOffsetY + (viewportCenterY - (flowBounds.minY + (flowBounds.flowHeight / 2)));

        // If the flow goes beyond the viewport then deciding the zoom level based on the width and height ratios, else
        // maintaining the same zoom level.
        if ((flowBounds.flowWidth > fitWidth) || (flowBounds.flowHeight > fitHeight)) {
            scaleAndDeltaConfig.newScale = Math.min(widthRatio, heightRatio);
        } else {
            scaleAndDeltaConfig.newScale = currentScale;
        }
    } else if (action === ZOOM_ACTION.ZOOM_TO_VIEW) {
        scaleAndDeltaConfig.newScale = SCALE_BOUNDS.MAX_SCALE;
        scaleAndDeltaConfig.deltaX = 0;
        scaleAndDeltaConfig.deltaY = 0;
    } else if (action === ZOOM_ACTION.ZOOM_IN) {
        scaleAndDeltaConfig.newScale = Math.min(SCALE_BOUNDS.MAX_SCALE, currentScale + SCALE_BOUNDS.SCALE_CHANGE);
        scaleAndDeltaConfig.deltaX = 0;
        scaleAndDeltaConfig.deltaY = 0;
    }
    return scaleAndDeltaConfig;
}