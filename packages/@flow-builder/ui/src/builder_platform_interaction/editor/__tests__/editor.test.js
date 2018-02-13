import { createElement } from 'engine';
import { EVENT } from 'builder_platform_interaction-constant';
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
        })
    };
});

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        canvasSelector : jest.fn().mockImplementation((obj) => {
            return obj;
        })
    };
});

const createNodeMap = (component) => {
    const nodeMap = new Map();
    const nodeElements = component.querySelectorAll('builder_platform_interaction-node');
    for (let i = 0; i < nodeElements.length; i++) {
        nodeMap.set(nodeElements[i].node.guid, {isSelected: nodeElements[i].node.config.isSelected,
            locationX: nodeElements[i].node.locationX, locationY: nodeElements[i].node.locationY});
    }
    return nodeMap;
};

const getSelectionInfo = (component) => {
    const nodeMap = createNodeMap(component);
    const isOneSelected = nodeMap.get('1').isSelected;
    const isTwoSelected = nodeMap.get('2').isSelected;
    return {
        isOneSelected,
        isTwoSelected
    };
};

const updateElement = {
    payload : {
        config : {
            isSelected : false
        },
        description : 'My first test node',
        elementType : 'ASSIGNMENT',
        guid : '1',
        label : 'First Node',
        locationX : '80',
        locationY : '70',
    },
    type : 'UPDATE_CANVAS_ELEMENT'
};

const deleteElement = {
    payload : {
        config : {
            isSelected : true
        },
        description : 'My second test node',
        elementType : 'ASSIGNMENT',
        guid : '2',
        label : 'Second Node',
        locationX : '50',
        locationY : '40',
    },
    type : 'DELETE_CANVAS_ELEMENT'
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
                nodeGUID : '1',
                isMultiSelectKeyPressed: false
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const selectionInfo = getSelectionInfo(editorComponent);
            expect(selectionInfo.isOneSelected).toEqual(true);
            expect(selectionInfo.isTwoSelected).toEqual(false);
        });
    });

    it('Checks if node selection is handled correctly when a selected node is clicked without multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                nodeGUID : '2',
                isMultiSelectKeyPressed: false
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const selectionInfo = getSelectionInfo(editorComponent);
            expect(selectionInfo.isOneSelected).toEqual(false);
            expect(selectionInfo.isTwoSelected).toEqual(true);
        });
    });

    it('Checks if node selection is handled correctly when an unselected node is clicked with multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                nodeGUID : '1',
                isMultiSelectKeyPressed: true
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const selectionInfo = getSelectionInfo(editorComponent);
            expect(selectionInfo.isOneSelected).toEqual(true);
            expect(selectionInfo.isTwoSelected).toEqual(true);
        });
    });
    it('Checks if node selection is handled correctly when a selected node is clicked with multiSelect key', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                nodeGUID : '2',
                isMultiSelectKeyPressed: true
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const selectionInfo = getSelectionInfo(editorComponent);
            expect(selectionInfo.isOneSelected).toEqual(false);
            expect(selectionInfo.isTwoSelected).toEqual(false);
        });
    });

    it('Checks if node deselection is handled correctly when a canvas is clicked', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_SELECTED, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {}
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const selectionInfo = getSelectionInfo(editorComponent);
            expect(selectionInfo.isOneSelected).toEqual(false);
            expect(selectionInfo.isTwoSelected).toEqual(false);
        });
    });

    it('Checks if node location is updated correctly when a node stops dragging', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.DRAG_STOP, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                nodeGUID : '1',
                locationX: '80',
                locationY: '70'
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const nodeMap = createNodeMap(editorComponent);
            const locationX = nodeMap.get('1').locationX;
            const locationY = nodeMap.get('1').locationY;
            expect(locationX).toEqual('80');
            expect(locationY).toEqual('70');
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(updateElement);
        });
    });

    it('Checks if node deletion is handled correctly when trash-can is clicked', () => {
        const editorComponent = createComponentUnderTest();
        const event = new CustomEvent(EVENT.NODE_DELETE, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                nodeGUID : '2'
            }
        });
        editorComponent.querySelector('builder_platform_interaction-canvas').dispatchEvent(event);
        return Promise.resolve().then(() => {
            const spy = Store.getStore().dispatch;
            expect(spy).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual(deleteElement);
        });
    });
});
