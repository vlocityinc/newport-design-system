/**
 * Helper function to check if there is overlap between the element and marquee selection box.
 * It easier to find if an element is not overlapping, which could reduce to 4 conditions check.
 * The box start and end position could vary depending on how it is created, which can be simplified by calculating the min and max of box position.
 * The min will always be the left/top and max will always be the right/bottom.
 *
 * @param {Number[]} elementStartPoint element start (top, left) position
 * @param {Number[]} elementEndPoint element end (bottom, right) position
 * @param {Number[]} boxStartPoint selection box start position
 * @param {Number[]} boxEndPoint selection box end position
 * @returns {Boolean}  Returns true if the element is overlap with the selection box
 */
export function isElementOverlapWithBox(elementStartPoint, elementEndPoint, boxStartPoint, boxEndPoint) {
    const marqueeBoxMaxX = Math.max(boxStartPoint[0], boxEndPoint[0]);
    const marqueeBoxMinX = Math.min(boxStartPoint[0], boxEndPoint[0]);
    const marqueeBoxMaxY = Math.max(boxStartPoint[1], boxEndPoint[1]);
    const marqueeBoxMinY = Math.min(boxStartPoint[1], boxEndPoint[1]);

    return !(elementEndPoint[0] < marqueeBoxMinX ||   // Node element is on the left of the box
             elementStartPoint[0] > marqueeBoxMaxX || // Node element is on the right of the box
             elementEndPoint[1] < marqueeBoxMinY ||   // Node element is on the top of the box
             elementStartPoint[1] > marqueeBoxMaxY    // Node element is on the bottom of the box
            );
}