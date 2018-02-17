/**
 * Mock object for the drawing library.  If a test needs specific values returned by any function in the library
 * then the test should override those methods as needed.
 */
let mock = {
    setContainer : jest.fn(),
    getContainer : () => {
        return {
            classList: {
                // TODO: probably want to mock this for different cases
                contains: jest.fn()
            }
        }
    },
    setNewConnection : jest.fn(),
    clickConnection : jest.fn(),
    removeNodeFromLib : jest.fn(),
    setSuspendDrawing : jest.fn(),
};

export { mock as drawingLibInstance};
