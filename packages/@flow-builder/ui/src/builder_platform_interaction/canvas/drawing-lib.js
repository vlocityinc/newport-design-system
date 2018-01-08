/**
 * @type {object} instance
 */
let instance = null;

/**
 * @return {object} jsPlumbInstance - singleton jsplumb instance
 */
export const getJSPlumbInstance = () => {
    if (instance === null) {
        instance = window.jsPlumb.getInstance({
            Endpoint: "Blank",
            ConnectionOverlays: [
                ["Arrow", {
                    location: 1,
                    visible:true,
                    width:15,
                    length:15,
                    id:"ARROW"
                }]
            ]
        });
    }
    return instance;
};

/**
 * @param {string} container - class name to be used as the container for all nodes in jsplumb instance
 * @param {object} [jsPlumbInstance] - jsplumb instance
 */
export const setContainer = (container, jsPlumbInstance = instance) => {
    jsPlumbInstance.setContainer(container);
};
