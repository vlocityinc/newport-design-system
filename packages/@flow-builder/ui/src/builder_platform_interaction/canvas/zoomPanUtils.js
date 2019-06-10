import { ZOOM_ACTION } from 'builder_platform_interaction/events';
import { getFlowBounds } from 'builder_platform_interaction/connectorUtils';
import { KEYS } from './keyConstants';

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
 * @param {Number} centerOffsetX - Distance between the center of the viewport and the inner canvas center in x direction
 * @param {Number} centerOffsetY - Distance between the center of the viewport and the inner canvas center in y direction
 * @param {Array} canvasElements - Array of canvas elements
 * @return {boolean} True if everything is defined else false
 * @private
 */
const _checkForUndefined = (
    currentScale,
    viewportWidth,
    viewportHeight,
    centerOffsetX,
    centerOffsetY,
    canvasElements
) => {
    return (
        currentScale !== undefined &&
        viewportWidth !== undefined &&
        viewportHeight !== undefined &&
        centerOffsetX !== undefined &&
        centerOffsetY !== undefined &&
        canvasElements.length > 0
    );
};

/**
 * An object containing scaled offset values and mouse positions
 *
 * @typedef {Object} panConfig
 * @property {Number[]} scaledOffsetsOnPanStart - Scaled offsetLeft and offsetTop of the innerCanvas when mouse down happens on the canvas
 * @property {Number[]} mouseDownPoint - point on the overlay where mouse down happened
 * @property {Number[]} mouseMovePoint - point on the overlay where mouse has moved to
 */

/**
 * Method to calculate the new offset values for the inner canvas based on how much the mouse has moved
 *
 * @param {Object} panConfig - Contains scaled offset values and mouse positions
 * @return {Object} Contains the new offset values for the inner canvas
 */
export const getOffsetValuesOnPan = ({
    scaledOffsetsOnPanStart,
    mouseDownPoint,
    mouseMovePoint
}) => {
    let newScaledOffsetLeft;
    let newScaledOffsetTop;

    if (
        scaledOffsetsOnPanStart[0] !== undefined &&
        scaledOffsetsOnPanStart[1] !== undefined &&
        mouseDownPoint[0] !== undefined &&
        mouseDownPoint[1] !== undefined &&
        mouseMovePoint[0] !== undefined &&
        mouseMovePoint[1] !== undefined
    ) {
        // Calculating how much the mouse has moved while down and using that to calculate the new offsets for the inner canvas
        newScaledOffsetLeft =
            scaledOffsetsOnPanStart[0] +
            (mouseMovePoint[0] - mouseDownPoint[0]);
        newScaledOffsetTop =
            scaledOffsetsOnPanStart[1] +
            (mouseMovePoint[1] - mouseDownPoint[1]);
    }
    return { newScaledOffsetLeft, newScaledOffsetTop };
};

/**
 * Checks if the user is trying to delete, i.e. checks if the delete shortcut is used during the event or not. The user
 * should not be able to delete when the mouse is down on the canvas or when the marquee mode is turned on.
 *
 * @param {Object} event - Any event that needs to be checked for deletion
 * @param {Boolean} isCanvasMouseDown - Checks whether mouse is down on the canvas or not
 * @param {Boolean} isMarqueeModeOn - Checks whether the marquee mode has been turned on or not
 * @return {Boolean}  Returns true if deletion shortcut is used during the event
 */
export const canDelete = (event, isCanvasMouseDown, isMarqueeModeOn) => {
    return (
        event &&
        (event.key === KEYS.BACKSPACE || event.key === KEYS.DELETE) &&
        !isCanvasMouseDown &&
        !isMarqueeModeOn
    );
};

/**
 * Checks if the user is trying to zoom, i.e. checks if the zooming shortcut is used during the event or not. The user
 * should not be able to zoom when the mouse is down on the canvas or when marquee selection is in progress.
 *
 * @param {Object} event - Any event that needs to be checked for zooming
 * @param {Boolean} isCanvasMouseDown - Checks whether mouse is down on the canvas or not
 * @param {Boolean} isMarqueeInProgress - Checks whether the marquee is in progress or not
 * @return {Boolean}  Returns true if zooming shortcut is used during the event
 */
export const canZoom = (event, isCanvasMouseDown, isMarqueeInProgress) => {
    return (
        event &&
        (event.metaKey || event.ctrlKey) &&
        (event.key === KEYS.NEGATIVE ||
            event.key === KEYS.ZERO ||
            event.key === KEYS.ONE ||
            event.key === KEYS.EQUAL) &&
        !isCanvasMouseDown &&
        !isMarqueeInProgress
    );
};

/**
 * An object containing viewport and offset numbers
 *
 * @typedef {Object} viewportAndOffsetConfig
 * @property {Object} viewportDimensions - Dimensions of the current viewport
 * @property {Number []} centerOffsets - Distance between the center of the viewport and the inner canvas center on scale 1
 */

/**
 * Method to get the new zoom level and scaled offset values based on the zoom action performed.
 *
 * @param {String} action - Zoom action coming from _canvasZoom method in canvas.js
 * @param {Number} currentScale - Current scale of the inner canvas
 * @param {Object} viewportAndOffsetConfig - Contains all viewport and offset numbers
 * @param {Array} canvasElements - Array of canvas elements
 * @return {Object} Contains the new scale along with the new offset values
 */
export const getScaleAndOffsetValuesOnZoom = (
    action,
    currentScale,
    { viewportDimensions, centerOffsets },
    canvasElements
) => {
    // Spacing to add on the edges after zooming to fit
    const VIEWPORT_SPACING = 100;

    let newScale = currentScale;
    let newScaledOffsetLeft = 0;
    let newScaledOffsetTop = 0;

    if (action === ZOOM_ACTION.ZOOM_OUT && currentScale !== undefined) {
        newScale = Math.max(
            SCALE_BOUNDS.MIN_SCALE,
            currentScale - SCALE_BOUNDS.SCALE_CHANGE
        );
        newScaledOffsetLeft = centerOffsets[0] * newScale;
        newScaledOffsetTop = centerOffsets[1] * newScale;
    } else if (
        action === ZOOM_ACTION.ZOOM_TO_FIT &&
        _checkForUndefined(
            currentScale,
            viewportDimensions.viewportWidth,
            viewportDimensions.viewportHeight,
            centerOffsets[0],
            centerOffsets[1],
            canvasElements
        )
    ) {
        const fitWidth = viewportDimensions.viewportWidth - VIEWPORT_SPACING;
        const fitHeight = viewportDimensions.viewportHeight - VIEWPORT_SPACING;

        // Calculating the flow width and height along with the minimum and maximum bounds
        const flowBounds = getFlowBounds(canvasElements);

        // Calculating the width and height ratio between the viewport and the flow.
        const widthRatio = fitWidth / flowBounds.flowWidth;
        const heightRatio = fitHeight / flowBounds.flowHeight;

        // If the flow goes beyond the viewport then deciding the zoom level based on the width and height ratios, else
        // maintaining the same zoom level.
        if (
            flowBounds.flowWidth > fitWidth ||
            flowBounds.flowHeight > fitHeight
        ) {
            newScale = Math.min(widthRatio, heightRatio);
        }

        // Calculating the required innerCanvas offset to fit the flow into the viewport (on new scale)
        const halfFlowWidth = flowBounds.flowWidth / 2;
        const halfFlowHeight = flowBounds.flowHeight / 2;
        newScaledOffsetLeft =
            (viewportDimensions.viewportCenterPoint[0] -
                (flowBounds.minX + halfFlowWidth)) *
            newScale;
        newScaledOffsetTop =
            (viewportDimensions.viewportCenterPoint[1] -
                (flowBounds.minY + halfFlowHeight)) *
            newScale;
    } else if (action === ZOOM_ACTION.ZOOM_TO_VIEW) {
        newScale = SCALE_BOUNDS.MAX_SCALE;
        newScaledOffsetLeft = centerOffsets[0] * newScale;
        newScaledOffsetTop = centerOffsets[1] * newScale;
    } else if (action === ZOOM_ACTION.ZOOM_IN && currentScale !== undefined) {
        newScale = Math.min(
            SCALE_BOUNDS.MAX_SCALE,
            currentScale + SCALE_BOUNDS.SCALE_CHANGE
        );
        newScaledOffsetLeft = centerOffsets[0] * newScale;
        newScaledOffsetTop = centerOffsets[1] * newScale;
    }
    return { newScaledOffsetLeft, newScaledOffsetTop, newScale };
};

/**
 * Gets the distance between two given points on the canvas on a given scale. In our case we use it to get the distance
 * the center of the viewport and the location of a given element. This would help in determining the new offsets of our
 * innerCanvas.
 *
 * @param {Number []} viewportCenterPoint - coordinates of the target location
 * @param {Number} elementLocationX - x-coordinate of the source location
 * @param {Number} elementLocationY - y-coordinate of the source location
 * @param {Number} currentScale - scale of the innerCanvas
 * @returns {{newScaledOffsetLeft: number, newScaledOffsetTop: number}} - The new offsets for the innerCanvas
 */
export const getDistanceBetweenViewportCenterAndElement = (
    viewportCenterPoint,
    elementLocationX,
    elementLocationY,
    currentScale
) => {
    const newScaledOffsetLeft =
        (viewportCenterPoint[0] - elementLocationX) * currentScale;
    const newScaledOffsetTop =
        (viewportCenterPoint[1] - elementLocationY) * currentScale;

    return { newScaledOffsetLeft, newScaledOffsetTop };
};

/**
 * An object containing the current and new offset values along with the viewport center location
 *
 * @typedef {Object} panToViewConfig
 * @property {Number []} originalScaledCenterOffsets - Current offsets of the inner canvas
 * @property {Number []} newScaledCenterOffsets - New offsets of the inner canvas to bring the element to the center of the viewport
 * @property {Number []} viewportCenterPoint - coordinates of the center of the viewport
 */

/**
 * Figures out if the element is currently in the viewport or not
 *
 * @param {Object} panToViewConfig - Contains the current and new offset values along with the viewport center location
 * @returns {Boolean} True if element is in the current viewport, false otherwise
 */
export const isElementInViewport = ({
    originalScaledCenterOffsets,
    newScaledCenterOffsets,
    viewportCenterPoint
}) => {
    const EDGE_SPACING = 50;

    // Calculate the absoluteDistance between the current offset and the new offset of the innerCanvas
    const absoluteDistanceX = Math.abs(
        originalScaledCenterOffsets[0] - newScaledCenterOffsets[0]
    );
    const absoluteDistanceY = Math.abs(
        originalScaledCenterOffsets[1] - newScaledCenterOffsets[1]
    );

    // If the absoluteDistance is less than the center of the viewport in either directions then that would mean that the searched
    // canvas element lies within the current viewport.
    return (
        absoluteDistanceX <= viewportCenterPoint[0] - EDGE_SPACING &&
        absoluteDistanceY <= viewportCenterPoint[1] - EDGE_SPACING
    );
};
