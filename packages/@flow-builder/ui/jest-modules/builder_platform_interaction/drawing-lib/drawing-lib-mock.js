/**
 * Mock object for the drawing library.  If a test needs specific values returned by any function in the library
 * then the test should override those methods as needed.
 */
let mock = {
    setNewConnection : () => {},
    setContainer : () => {},
    setSuspendDrawing : () => {},
};

export { mock as drawingLibInstance};
