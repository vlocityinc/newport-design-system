import { createElement } from 'engine';
import { EVENT, ELEMENT_TYPE } from 'builder_platform_interaction-constant';
jest.unmock('builder_platform_interaction-store-lib');
import Editor from 'builder_platform_interaction-editor';
import { Store } from 'builder_platform_interaction-store-lib';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    root: '.editor',
    save: '.toolbar-save'
};

jest.mock('builder_platform_interaction-store-lib', () => {
    const createTestObj = () => {
        return {
            nodes : [
                {
                    guid: '1',
                    locationX : '20',
                    locationY : '40',
                    elementType : 'ASSIGNMENT',
                    label : 'First Node',
                    description : 'My first test node',
                    config: {isSelected: false}
                },
                {
                    guid: '2',
                    locationX : '50',
                    locationY : '40',
                    elementType : 'ASSIGNMENT',
                    label : 'Second Node',
                    description : 'My second test node',
                    config: {isSelected: true}
                }
            ],
            connectors : [
                {
                    guid: 'c1',
                    source: '1',
                    target: '2',
                    label: 'label',
                    config: {isSelected: false}
                },
                {
                    guid: 'c2',
                    source: '2',
                    target: '1',
                    label: 'label',
                    config: {isSelected: true}
                }
            ]
        };
    };

    const dispatchSpy = jest.fn().mockImplementation(() => {});

    return {
        Store: {
            getStore : () => {
                return {
                    subscribe: (mapAppStateToStore) => {
                        mapAppStateToStore();
                        return jest.fn().mockImplementation(() => {
                            return 'Testing';
                        });
                    },
                    dispatch: dispatchSpy,
                    getCurrentState : () => {
                        return createTestObj();
                    }
                };
            }
        },
        deepCopy: jest.fn().mockImplementation((obj) => {
            return obj;
        }),
        generateGuid: jest.fn().mockImplementation((prefix) => {
            return prefix;
        })
    };
});

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        canvasSelector : jest.fn().mockImplementation((obj) => {
            return obj.nodes;
        }),
        resourcesSelector : jest.fn().mockImplementation((obj) => {
            return obj;
        })
    };
});

const element = (guid, type) => {
    return {
        payload : {
            guid
        },
        type
    };
};

const deselectionAction = {
    payload : {},
    type : 'DESELECT_ON_CANVAS'
};

const deleteElement = {
    payload : {
        selectedCanvasElementGUIDs: ['2'],
        connectorGUIDs: ['c1', 'c2'],
        canvasElementsToUpdate: ['1'],
        elementType: ELEMENT_TYPE.ASSIGNMENT
    },
    type : 'DELETE_CANVAS_ELEMENT'
};

const updateElement = {
    payload : {
        guid : '1',
        elementType : ELEMENT_TYPE.ASSIGNMENT,
        locationX : '80',
        locationY : '70'
    },
    type : 'UPDATE_CANVAS_ELEMENT'
};

const connectorElement = {
    payload : {
        guid: 'CONNECTOR',
        source: '1',
        target: '2',
        label: 'Label',
        config: {isSelected: false}
    },
    type : 'ADD_CONNECTOR'
};

describe('editor', () => {
    it('fires saveflow event when save button is clicked', () => {
        const toolbarComponent = createComponentUnderTest();
        return Promise.resolve().then(() => {
            const eventCallback = jest.fn();
            toolbarComponent.addEventListener('saveflow', eventCallback);
            toolbarComponent.querySelector(selectors.save).click();
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    it('Checks if node selection is handled correctly when an unselected node is clicked without multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID : '1',
                isMultiSelectKeyPressed: false
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(element('1', 'SELECT_ON_CANVAS'));
        });
    });

    it('Checks if node selection is handled correctly when a selected node is clicked without multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID : '2',
                isMultiSelectKeyPressed: false
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(element('2', 'SELECT_ON_CANVAS'));
        });
    });

    it('Checks if node selection is handled correctly when an unselected node is clicked with multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID : '1',
                isMultiSelectKeyPressed: true
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(element('1', 'TOGGLE_ON_CANVAS'));
        });
    });

    it('Checks if node selection is handled correctly when a selected node is clicked with multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID : '2',
                isMultiSelectKeyPressed: true
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(element('2', 'TOGGLE_ON_CANVAS'));
        });
    });

    it('Checks if node and connector deselection is handled correctly when a canvas is clicked', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.CANVAS_MOUSEUP, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(deselectionAction);
        });
    });

    it('Checks if connector selection is handled correctly when an unselected connector is clicked without multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.CONNECTOR_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                connectorGUID: 'c1',
                isMultiSelectKeyPressed: false
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(element('c1', 'SELECT_ON_CANVAS'));
        });
    });

    it('Checks if connector selection is handled correctly when a selected connector is clicked without multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.CONNECTOR_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                connectorGUID: 'c2',
                isMultiSelectKeyPressed: false
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(element('c2', 'SELECT_ON_CANVAS'));
        });
    });

    it('Checks if connector selection is handled correctly when an unselected connector is clicked with multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.CONNECTOR_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                connectorGUID: 'c1',
                isMultiSelectKeyPressed: true
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(element('c1', 'TOGGLE_ON_CANVAS'));
        });
    });

    it('Checks if connector selection is handled correctly when a selected connector is clicked with multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.CONNECTOR_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                connectorGUID: 'c2',
                isMultiSelectKeyPressed: true
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(element('c2', 'TOGGLE_ON_CANVAS'));
        });
    });

    it('Checks if node deletion is handled correctly when trash-can is clicked', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.DELETE_ON_CANVAS, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedCanvasElementGUIDs: ['2'],
                connectorGUIDs: ['c1', 'c2'],
                canvasElementsToUpdate: ['1']
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(deleteElement);
        });
    });

    it('Checks if node and connector deletion is handled correctly when delete key is pressed', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.DELETE_ON_CANVAS, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedCanvasElementGUIDs: ['2'],
                connectorGUIDs: ['c1', 'c2'],
                canvasElementsToUpdate: ['1']
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(deleteElement);
        });
    });

    it('Checks if node location is updated correctly when a node stops dragging', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.DRAG_STOP, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID : '1',
                elementType: ELEMENT_TYPE.ASSIGNMENT,
                locationX: '80',
                locationY: '70'
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(updateElement);
        });
    });

    it('Checks if connections are added correctly', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.ADD_CONNECTION, {
            bubbles: true,
            composed: true,
            detail: {
                source: '1',
                target: '2',
                label: 'Label'
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(connectorElement);
        });
    });
});