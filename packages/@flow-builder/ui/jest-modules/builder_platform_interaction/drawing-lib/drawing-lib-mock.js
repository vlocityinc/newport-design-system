/**
 * Mock object for the drawing library.  If a test needs specific values returned by any function in the library
 * then the test should override those methods as needed.
 */
let mock = {
    setNewConnection : () => {},
    setContainer : () => {},
    getContainer : () => {
        return {
            classList: {
                // TODO: probably want to mock this for different cases
                contains: () => {}
            }
        }
    },
    removeNodeFromLib : () => {},
    setSuspendDrawing : () => {},
};

export { mock as drawingLibInstance};
