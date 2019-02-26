/**
 * Mock object for the drawing library.  If a test needs specific values returned by any function in the library
 * then the test should override those methods as needed.
 */
let mock = {
        setContainer : jest.fn(),
        getContainer : () => {
            return null;
        },
        setSuspendDrawing: jest.fn(),
        setZoom: jest.fn(),
        setDraggable: jest.fn(),
        isSource: jest.fn(),
        makeSource: jest.fn(),
        isTarget: jest.fn(),
        makeTarget: jest.fn(),
        setExistingConnections: jest.fn(),
        setNewConnection : jest.fn(),
        clickConnection : jest.fn(),
        setPaintStyleAndLabel: jest.fn(),
        selectConnector: jest.fn(),
        deselectConnector: jest.fn(),
        addToDragSelection: jest.fn(),
        removeFromDragSelection: jest.fn(),
        removeNodeFromLib : jest.fn(),
        removeConnectorFromLib : jest.fn(),
        repaintEverything: jest.fn()
    };

export const setConnectionDecorator = jest.fn();

export { mock as drawingLibInstance };
