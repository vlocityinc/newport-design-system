import { createElement } from 'engine';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import Editor from '../editor';
import { CANVAS_EVENT } from 'builder_platform_interaction-events';
import { Store } from 'builder_platform_interaction-store-lib';
import { translateUIModelToFlow } from 'builder_platform_interaction-translator-lib';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';

jest.mock('builder_platform_interaction-translator-lib', () => {
    return {
        translateUIModelToFlow: jest.fn()
    };
});

jest.mock('builder_platform_interaction-server-data-lib', () => {
    return {
        fetch: jest.fn(),
        SERVER_ACTION_TYPE: require.requireActual('builder_platform_interaction-server-data-lib').SERVER_ACTION_TYPE
    };
});

jest.unmock('builder_platform_interaction-store-lib');

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-editor', {
        is: Editor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

const selectors = {
    root: '.editor',
    save: '.toolbar-save',
    addnewresource: '.left-panel-add-resource'
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
            ],
            properties : {
                label: 'Flow Name',
                versionNumber: '1'
            }
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
        }),
        combinedReducer: jest.fn()
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
    describe('saving', () => {
        it('translates the ui model to flow data', () => {
            const toolbarComponent = createComponentUnderTest();
            return Promise.resolve().then(() => {
                toolbarComponent.querySelector(selectors.save).click();

                expect(translateUIModelToFlow.mock.calls).toHaveLength(1);
                expect(translateUIModelToFlow.mock.calls[0][0]).toEqual(Store.getStore().getCurrentState());
            });
        });

        it('passes the translated value to fetch', () => {
            const toolbarComponent = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const flow = {x: 1};

                translateUIModelToFlow.mockReturnValue(flow);

                toolbarComponent.querySelector(selectors.save).click();
                // Check against the last call to fetch.  The first is in editor.js constructor and thus
                // unavoidable and other components included via editor.html may also have fetch calls
                // (for example left-panel-elements
                const saveFetchCallIndex = fetch.mock.calls.length - 1;

                expect(fetch.mock.calls[saveFetchCallIndex][0]).toEqual(SERVER_ACTION_TYPE.SAVE_FLOW);
                expect(fetch.mock.calls[saveFetchCallIndex][2]).toEqual({ flow });
            });
        });
    });

    describe('Server side fetch', () => {
        it('getting rules', () => {
            createComponentUnderTest();
            return Promise.resolve().then(() => {
                expect(fetch.mock.calls).toHaveLength(4);
                expect(fetch.mock.calls[0][0]).toEqual(SERVER_ACTION_TYPE.GET_RULES);
            });
        });
        it('getting flow metadata', () => {
            createComponentUnderTest({
                flowId: 'flow 123'
            });
            return Promise.resolve().then(() => {
                expect(fetch.mock.calls).toHaveLength(5);
                expect(fetch.mock.calls[3][0]).toEqual(SERVER_ACTION_TYPE.GET_FLOW);
            });
        });
        it('getting header urls', () => {
            createComponentUnderTest();
            return Promise.resolve().then(() => {
                expect(fetch.mock.calls).toHaveLength(4);
                expect(fetch.mock.calls[2][0]).toEqual(SERVER_ACTION_TYPE.GET_HEADER_URLS);
            });
        });
    });

    describe('Canvas', () => {
        it('Checks if node selection is handled correctly when an unselected node is clicked without multiSelect key', () => {
            const editorComponent = createComponentUnderTest();
            const event = new CustomEvent(CANVAS_EVENT.NODE_SELECTED, {
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
            const event = new CustomEvent(CANVAS_EVENT.NODE_SELECTED, {
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
            const event = new CustomEvent(CANVAS_EVENT.NODE_SELECTED, {
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
            const event = new CustomEvent(CANVAS_EVENT.NODE_SELECTED, {
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
            const event = new CustomEvent(CANVAS_EVENT.CANVAS_MOUSEUP, {
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
            const event = new CustomEvent(CANVAS_EVENT.CONNECTOR_SELECTED, {
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
            const event = new CustomEvent(CANVAS_EVENT.CONNECTOR_SELECTED, {
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
            const event = new CustomEvent(CANVAS_EVENT.CONNECTOR_SELECTED, {
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
            const event = new CustomEvent(CANVAS_EVENT.CONNECTOR_SELECTED, {
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
            const event = new CustomEvent(CANVAS_EVENT.DELETE_ON_CANVAS, {
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
            const event = new CustomEvent(CANVAS_EVENT.DELETE_ON_CANVAS, {
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
            const event = new CustomEvent(CANVAS_EVENT.DRAG_STOP, {
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
            const event = new CustomEvent(CANVAS_EVENT.ADD_CONNECTION, {
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

    describe('Left Panel Resources Tab', () => {
        it('fires add new resource event when NEW RESOURCE button is clicked', () => {
            const leftPanelComponent = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                leftPanelComponent.addEventListener('addnewresource', eventCallback);
                leftPanelComponent.querySelector(selectors.addnewresource).click();
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });
});