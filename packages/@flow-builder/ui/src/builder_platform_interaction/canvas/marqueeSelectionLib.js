const NODE_LENGTH = 48;

/**
 * Helper function to check if there is overlap between the element and marquee selection box.
 * It easier to find if an element is not overlapping, which could reduce to 4 conditions check.
 * The box start and end position could vary depending on how it is created, which can be simplified by calculating the min and max of box position.
 * The min will always be the left/top and max will always be the right/bottom.
 *
 * @param {Number[]} canvasElementStartPoint element start (top, left) position
 * @param {Number[]} canvasElementEndPoint element end (bottom, right) position
 * @param {Number[]} marqueeBoxStartPoint selection box start position
 * @param {Number[]} marqueeBoxEndPoint selection box end position
 * @returns {Boolean}  Returns true if the element is overlap with the selection box
 * @private
 */
const _checkIfMarqueeOverlapsCanvasElement = (
    canvasElementStartPoint,
    canvasElementEndPoint,
    marqueeBoxStartPoint,
    marqueeBoxEndPoint
) => {
    const marqueeBoxMaxX = Math.max(
        marqueeBoxStartPoint[0],
        marqueeBoxEndPoint[0]
    );
    const marqueeBoxMinX = Math.min(
        marqueeBoxStartPoint[0],
        marqueeBoxEndPoint[0]
    );
    const marqueeBoxMaxY = Math.max(
        marqueeBoxStartPoint[1],
        marqueeBoxEndPoint[1]
    );
    const marqueeBoxMinY = Math.min(
        marqueeBoxStartPoint[1],
        marqueeBoxEndPoint[1]
    );

    return !(
        canvasElementEndPoint[0] < marqueeBoxMinX || // Canvas element is on the left of the box
        canvasElementStartPoint[0] > marqueeBoxMaxX || // Canvas element is on the right of the box
        canvasElementEndPoint[1] < marqueeBoxMinY || // Canvas element is on the top of the box
        canvasElementStartPoint[1] > marqueeBoxMaxY
    ); // Canvas element is on the bottom of the box
};

/**
 * Helper function to calculate the relative location of the start and end point of the marquee box with respect to the
 * viewport center
 *
 * @param {Number[]} marqueeStartPoint - Start point of the marquee box
 * @param {Number[]} marqueeEndPoint - End point of the marquee box
 * @param {Number[]} viewportCenterPoint - Center point of the current viewport
 * @return {Object} Returns an object containing the start and end point of the marquee box relative to the viewport center
 * @private
 */
const _getMarqueePointsRelativeToViewportCenter = (
    marqueeStartPoint,
    marqueeEndPoint,
    viewportCenterPoint
) => {
    const relativeMarqueeStartPoint = [
        marqueeStartPoint[0] - viewportCenterPoint[0],
        marqueeStartPoint[1] - viewportCenterPoint[1]
    ];
    const relativeMarqueeEndPoint = [
        marqueeEndPoint[0] - viewportCenterPoint[0],
        marqueeEndPoint[1] - viewportCenterPoint[1]
    ];

    return { relativeMarqueeStartPoint, relativeMarqueeEndPoint };
};

/**
 * Helper function to calculate the start and the end point of the canvas element relative to the viewport center
 *
 * @param {Number} locationX - Original locationX of the canvas element
 * @param {Number} locationY - Original locationY of the canvas element
 * @param {Number} currentScale - Current scale of the inner canvas
 * @param {Number[]} scaledOffsetsOnMarqueeStart - Scaled offsetLeft and offsetTop of the innerCanvas when mouse down happens on the overlay
 * @param {Number[]} viewportCenterPoint - Center point of the current viewport
 * @return {Object} Returns an object containing the start and the end point of the canvas element relative to the viewport center
 * @private
 */
const _getElementLocationRelativeToViewportCenter = (
    locationX,
    locationY,
    currentScale,
    scaledOffsetsOnMarqueeStart,
    viewportCenterPoint
) => {
    // Calculating the canvas element's coordinates relative to the viewport center (keeping in mind the current scale and scaled center offsets)
    const newScaledX = currentScale + scaledOffsetsOnMarqueeStart[0];
    const newScaledY = currentScale + scaledOffsetsOnMarqueeStart[1];
    const relativeElementLocationX =
        (locationX - viewportCenterPoint[0]) * newScaledX;
    const relativeElementLocationY =
        (locationY - viewportCenterPoint[1]) * newScaledY;

    // Calculating the start and end point of the canvas element using the element dimensions and current scale
    const relativeElementStartPoint = [
        relativeElementLocationX,
        relativeElementLocationY
    ];
    const scaledNodeLength = NODE_LENGTH * currentScale;
    const relativeElementEndPoint = [
        relativeElementLocationX + scaledNodeLength,
        relativeElementLocationY + scaledNodeLength
    ];

    return { relativeElementStartPoint, relativeElementEndPoint };
};

/**
 * Helper function to check if canvas elements need to be selected/deselected and update the current selection list accordingly,
 * the node would be selected when it is overlapping with the marquee box.
 *
 * @param {Object[]} canvasElements - Array of canvas elements
 * @param {Number} currentScale - Current scale of the inner canvas
 * @param {Number[]} scaledOffsetsOnMarqueeStart - Scaled offsetLeft and offsetTop of the canvas when mouse down happens on the overlay
 * @param {Number[]} marqueeStartPoint - Start point of the marquee box
 * @param {Number[]} marqueeEndPoint - End point of the marquee box
 * @param {Number[]} viewportCenterPoint - Center of the current canvas viewport ([canvasWidth / 2, canvasHeight / 2])
 * @return {Object} Returns an object containing arrays of canvasElementGuidsToSelect and canvasElementGuidsToDeselect
 * @private
 */
const _getCanvasElementGuidsToSelectAndDeselect = (
    canvasElements,
    currentScale,
    { scaledOffsetsOnMarqueeStart, marqueeStartPoint, marqueeEndPoint },
    viewportCenterPoint
) => {
    const canvasElementGuidsToSelect = [];
    const canvasElementGuidsToDeselect = [];

    // Used to keep track of all the selected canvas elements. This is needed to select/deselect the connectors
    const allSelectedCanvasElementGuids = new Set();

    // Getting the location of the marquee points relative to the viewport center
    const {
        relativeMarqueeStartPoint,
        relativeMarqueeEndPoint
    } = _getMarqueePointsRelativeToViewportCenter(
        marqueeStartPoint,
        marqueeEndPoint,
        viewportCenterPoint
    );

    canvasElements.forEach(
        ({ locationX, locationY, config, guid, elementType }) => {
            // Originally our canvas offsets and zooming are center oriented whereas our element locations are relative to
            // the top-left corner of the canvas. Hence calculating the start and end point of the canvas element, on a
            // given scale, relative to the viewport center, to achieve a common coordinate system
            const {
                relativeElementStartPoint,
                relativeElementEndPoint
            } = _getElementLocationRelativeToViewportCenter(
                locationX,
                locationY,
                currentScale,
                scaledOffsetsOnMarqueeStart,
                viewportCenterPoint
            );

            // Using the relative locations to check if a canvas element is overlapping with the marquee selection box or not
            const isMarqueeOverlappingCanvasElement = _checkIfMarqueeOverlapsCanvasElement(
                relativeElementStartPoint,
                relativeElementEndPoint,
                relativeMarqueeStartPoint,
                relativeMarqueeEndPoint
            );

            // Original selected state of the canvas element in the store
            const wasCanvasElementOriginallySelected =
                config && config.isSelected;

            // TODO: Without this check will throw exception when marquee select 'START_ELEMENT' and duplicate, can remove it once the refactoring of element config happens
            if (
                !wasCanvasElementOriginallySelected &&
                isMarqueeOverlappingCanvasElement &&
                elementType !== 'START_ELEMENT'
            ) {
                // Adding canvas elements that were not originally selected but overlap with the marquee box to both
                // canvasElementGuidsToSelect and allSelectedCanvasElementGuids
                canvasElementGuidsToSelect.push(guid);
                allSelectedCanvasElementGuids.add(guid);
            } else if (
                wasCanvasElementOriginallySelected &&
                !isMarqueeOverlappingCanvasElement
            ) {
                // Adding canvas elements that were originally selected but don't overlap with the marquee box to
                // canvasElementGuidsToDeselect and removing them from allSelectedCanvasElementGuids
                canvasElementGuidsToDeselect.push(guid);
                allSelectedCanvasElementGuids.delete(guid);
            } else if (
                wasCanvasElementOriginallySelected &&
                isMarqueeOverlappingCanvasElement
            ) {
                // Adding the canvas elements that were orignally selected and still overlap with the marquee box to
                // allSelectedCanvasElementGuids
                allSelectedCanvasElementGuids.add(guid);
            }
        }
    );

    return {
        canvasElementGuidsToSelect,
        canvasElementGuidsToDeselect,
        allSelectedCanvasElementGuids
    };
};

/**
 * Helper function to calculate the connectors that need to be selected or deselected.
 * A connector can only be selected when both the source and target elements are selected.
 *
 * @param {Object[]} connectors - Array of connectors
 * @param {String[]} allSelectedCanvasElementGuids - Array of all selected canvas elements
 * @return {Object} Returns an object containing arrays of connectorGuidsToSelect and connectorGuidsToDeselect
 * @private
 */
const _getConnectorGuidsToSelectAndDeselect = (
    connectors,
    allSelectedCanvasElementGuids
) => {
    const connectorGuidsToSelect = [];
    const connectorGuidsToDeselect = [];

    connectors.forEach(({ source, target, config, guid }) => {
        // Checking if the source and target canvas elements are a part of the current selection or not
        const isSourceElementSelected = allSelectedCanvasElementGuids.has(
            source
        );
        const isTargetElementSelected = allSelectedCanvasElementGuids.has(
            target
        );

        // Original selected state of the connector in the store
        const wasConnectorOriginallySelected = config && config.isSelected;

        if (
            !wasConnectorOriginallySelected &&
            (isSourceElementSelected && isTargetElementSelected)
        ) {
            // Adding connectors that were not originally selected but have both their source and target elements
            // selected to connectorGuidsToSelect
            connectorGuidsToSelect.push(guid);
        } else if (
            wasConnectorOriginallySelected &&
            (!isSourceElementSelected || !isTargetElementSelected)
        ) {
            // Adding connectors that were originally selected but don't have either the source or the target element
            // selected to connectorGuidsToDeselect
            connectorGuidsToDeselect.push(guid);
        }
    });

    return { connectorGuidsToSelect, connectorGuidsToDeselect };
};

/**
 * Helper function to check elements (nodes && connectors) selection/deselection when starting the marquee
 *
 * @param {Object[]} canvasElements - Array of canvas elements
 * @param {Object[]} connectors - Array of connectors
 * @param {Number} currentScale - Current scale of the inner canvas
 * @param {Object} marqueeConfig - Contains the scaledOffsets of the innerCanvas when marquee selection begins along with
 * the start and end point of the marquee box
 * @param {Number[]} viewportCenterPoint - Center of the current canvas viewport ([canvasWidth / 2, canvasHeight / 2])
 * @return {Object} - Object of arrays containing the node && connector guids that needed to be selected && deselected
 */
export const checkMarqueeSelection = (
    canvasElements,
    connectors,
    currentScale,
    marqueeConfig,
    viewportCenterPoint
) => {
    if (!canvasElements) {
        throw new Error('canvasElements is not defined. It must be defined.');
    }

    if (!connectors) {
        throw new Error('connectors is not defined. It must be defined.');
    }

    if (!currentScale) {
        throw new Error('currentScale is not defined. It must be defined.');
    }

    if (!marqueeConfig) {
        throw new Error('marqueeConfig is not defined. It must be defined.');
    }

    if (!viewportCenterPoint) {
        throw new Error(
            'viewportCenterPoint is not defined. It must be defined.'
        );
    }

    const {
        canvasElementGuidsToSelect,
        canvasElementGuidsToDeselect,
        allSelectedCanvasElementGuids
    } = _getCanvasElementGuidsToSelectAndDeselect(
        canvasElements,
        currentScale,
        marqueeConfig,
        viewportCenterPoint
    );
    const {
        connectorGuidsToSelect,
        connectorGuidsToDeselect
    } = _getConnectorGuidsToSelectAndDeselect(
        connectors,
        allSelectedCanvasElementGuids
    );

    return {
        canvasElementGuidsToSelect,
        canvasElementGuidsToDeselect,
        connectorGuidsToSelect,
        connectorGuidsToDeselect
    };
};
