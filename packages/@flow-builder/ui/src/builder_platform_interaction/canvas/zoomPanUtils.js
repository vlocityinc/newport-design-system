import { ZOOM_ACTION } from "builder_platform_interaction/events";
import { getFlowBounds } from "builder_platform_interaction/connectorUtils";

export const SCALE_BOUNDS = {
    MIN_SCALE: 0.2,
    MAX_SCALE: 1.0,
    SCALE_CHANGE: 0.2
};

/**
 * Method to check for undefined values
 *
 * @param {Number} currentScale - Current scale of the inner canvas
 * @param {Number} viewportWidth - Width of the current viewport
 * @param {Number} viewportHeight - Height of the current viewport
 * @param {Number} viewportCenterX - x-coordinate of the viewport center
 * @param {Number} viewportCenterY - y-coordinate of the viewport center
 * @param {Number} centerOffsetX - Distance between the center of the viewport and the inner canvas center in x direction
 * @param {Number} centerOffsetY - Distance between the center of the viewport and the inner canvas center in y direction
 * @param {Array} canvasElements - Array of canvas elements
 * @return {boolean} True if everything is defined else false
 */
function checkForUndefined(currentScale, viewportWidth, viewportHeight, viewportCenterX, viewportCenterY, centerOffsetX,
    centerOffsetY, canvasElements) {
    return (currentScale !== undefined && viewportWidth !== undefined &&
    viewportHeight !== undefined && viewportCenterX !== undefined && viewportCenterY !== undefined &&
    centerOffsetX !== undefined && centerOffsetY !== undefined && canvasElements.length > 0);
}

/**
 * An object containing viewport and offset numbers
 *
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
 * @return {Object} scaleAndDeltaConfig - Contains the new scale along with the new deltaX and deltaY values
 */
export function getScaleAndDeltaValues(action, currentScale, { viewportWidth, viewportHeight, viewportCenterX,
    viewportCenterY, centerOffsetX, centerOffsetY }, canvasElements) {
    // Spacing to add on the edges after zooming to fit
    const VIEWPORT_SPACING = 100;

    const scaleAndDeltaConfig = {};

    if (action === ZOOM_ACTION.ZOOM_OUT && currentScale !== undefined) {
        scaleAndDeltaConfig.newScale = Math.max(SCALE_BOUNDS.MIN_SCALE, currentScale - SCALE_BOUNDS.SCALE_CHANGE);
        scaleAndDeltaConfig.deltaX = 0;
        scaleAndDeltaConfig.deltaY = 0;
    } else if (action === ZOOM_ACTION.ZOOM_TO_FIT && checkForUndefined(currentScale, viewportWidth, viewportHeight,
        viewportCenterX, viewportCenterY, centerOffsetX, centerOffsetY, canvasElements)) {
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
    } else if (action === ZOOM_ACTION.ZOOM_IN && currentScale !== undefined) {
        scaleAndDeltaConfig.newScale = Math.min(SCALE_BOUNDS.MAX_SCALE, currentScale + SCALE_BOUNDS.SCALE_CHANGE);
        scaleAndDeltaConfig.deltaX = 0;
        scaleAndDeltaConfig.deltaY = 0;
    }
    return scaleAndDeltaConfig;
}

/**
 * An object containing scaled offset values and mouse positions
 *
 * @typedef {Object} panConfig
 * @property {Number} scaledCenterOffsetX - Width of the current viewport
 * @property {Number} scaledCenterOffsetY - Height of the current viewport
 * @property {Number} mouseDownX - x-coordinate of the viewport center
 * @property {Number} mouseDownY - y-coordinate of the viewport center
 * @property {Number} mouseMoveX - Distance between the center of the viewport and the inner canvas center in x direction
 * @property {Number} mouseMoveY - Distance between the center of the viewport and the inner canvas center in y direction
 */

/**
 * Method to calculate the new offset values for the inner canvas based on how much the mouse has moved
 *
 * @param {Object} panConfig - Contains scaled offset values and mouse positions
 * @return {Object} offsetConfig - Contains the new offset values for the inner canvas
 */
export function getOffsetValues({ scaledCenterOffsetX, scaledCenterOffsetY, mouseDownX, mouseDownY, mouseMoveX, mouseMoveY }) {
    const offsetConfig = {};
    if (scaledCenterOffsetX !== undefined && scaledCenterOffsetY !== undefined && mouseDownX !== undefined &&
        mouseDownY !== undefined && mouseMoveX !== undefined && mouseMoveY !== undefined) {
        // Calculating how much the mouse has moved while down and using that to calculate the new offsets for the inner canvas
        offsetConfig.offsetLeft = scaledCenterOffsetX + (mouseMoveX - mouseDownX);
        offsetConfig.offsetTop = scaledCenterOffsetY + (mouseMoveY - mouseDownY);
    }
    return offsetConfig;
}

/**
 * Gets the distance between two given points on the canvas on a given scale. In our case we use it to get the distance
 * the center of the viewport and the location of a given element. This would help in determining the new offsets of our
 * innerCanvas.
 *
 * @param {Number} viewportCenterX - x-coordinate of the target location
 * @param {Number} viewportCenterY - y-coordinate of the target location
 * @param {Number} elementLocationX - x-coordinate of the source location
 * @param {Number} elementLocationY - y-coordinate of the source location
 * @param {Number} currentScale - scale of the innerCanvas
 * @returns {{newInnerCanvasOffsetLeft: number, newInnerCanvasOffsetTop: number}} - The new offsets for the innerCanvas
 */
export function getDistanceBetweenViewportCenterAndElement(viewportCenterX, viewportCenterY, elementLocationX, elementLocationY, currentScale) {
    const newInnerCanvasOffsetLeft = (viewportCenterX - elementLocationX) * currentScale;
    const newInnerCanvasOffsetTop = (viewportCenterY - elementLocationY) * currentScale;

    return {newInnerCanvasOffsetLeft, newInnerCanvasOffsetTop};
}

/**
 * An object containing the current and new offset values along with the viewport center location
 *
 * @typedef {Object} panToViewConfig
 * @property {Number} currentInnerCanvasOffsetLeft - Current left offset of the inner canvas
 * @property {Number} currentInnerCanvasOffsetTop - Current top offset of the inner canvas
 * @property {Number} newInnerCanvasOffsetLeft - New left offset of the inner canvas to bring the element to the center of the viewport
 * @property {Number} newInnerCanvasOffsetTop - New top offset of the inner canvas to bring the element to the center of the viewport
 * @property {Number} viewportCenterX - x-coordinate of the center of the viewport
 * @property {Number} viewportCenterY - y-coordinate of the center of the viewport
 */

/**
 * Figures out if the element is currently in the viewport or not
 *
 * @param {Object} panToViewConfig - Contains the current and new offset values along with the viewport center location
 * @returns {Boolean} True if element is in the current viewport, false otherwise
 */
export function isElementInViewport({ currentInnerCanvasOffsetLeft, currentInnerCanvasOffsetTop, newInnerCanvasOffsetLeft, newInnerCanvasOffsetTop, viewportCenterX, viewportCenterY }) {
    const EDGE_SPACING = 50;

    // Calculate the absoluteDistance between the current offset and the new offset of the innerCanvas
    const absoluteDistanceX = Math.abs(currentInnerCanvasOffsetLeft - newInnerCanvasOffsetLeft);
    const absoluteDistanceY = Math.abs(currentInnerCanvasOffsetTop - newInnerCanvasOffsetTop);

    // If the absoluteDistance is less than the center of the viewport in either directions then that would mean that the searched
    // canvas element lies within the current viewport.
    return (absoluteDistanceX <= (viewportCenterX - EDGE_SPACING) && absoluteDistanceY <= (viewportCenterY - EDGE_SPACING));
}