import { isEmptyArray, getNodesFromStore, getConnectorsFromStore, updateStoreOnSelection, shouldCreateStartConnection, hasOneAvailableConnection, shouldOpenConnectorSelectionModal, addConnection, getSourceAndTargetElement, createConnectorWhenOneConnectionAvailable, openConnectorSelectionModal } from '../canvasContainerUtils';

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        canvasSelector: jest.fn().mockImplementation(() => {
            return ['canvasElement1'];
        })
    };
});

jest.mock('builder_platform_interaction/actions', () => {
    return {
        selectOnCanvas: jest.fn().mockImplementation((payload) => {
            return {
                type: 'selectOnCanvas',
                payload
            };
        }),
        toggleOnCanvas: jest.fn().mockImplementation((payload) => {
            return {
                type: 'toggleOnCanvas',
                payload
            };
        }),
        addConnector: jest.fn().mockImplementation((payload) => {
            return {
                type: 'addConnection',
                payload
            };
        })

    };
});

jest.mock('builder_platform_interaction/flowMetadata', () => {
    return {
        ELEMENT_TYPE: {
            START_ELEMENT: 'START_ELEMENT',
            DECISION: 'DECISION',
            LOOP: 'LOOP',
            WAIT: 'WAIT'
        }
    };
});

jest.mock('builder_platform_interaction/builderUtils', () => {
    return {
        invokePropertyEditor: jest.fn(),
        PROPERTY_EDITOR: {}
    };
});

jest.mock('builder_platform_interaction/connectorUtils', () => {
    return {
        createNewConnector: jest.fn().mockImplementation(() => {
            return {};
        }),
        getLabelAndValueForConnectorPickerOptions: jest.fn().mockImplementation(() => {
            return {
                label: 'label1',
                value: 'value1'
            };
        }),
        sortConnectorPickerComboboxOptions: jest.fn()
    };
});

const { invokePropertyEditor } = require('builder_platform_interaction/builderUtils');

describe('Canvas container utils test', () => {
    describe('isEmptyArray function', () => {
        it('returns false if array has a value', () => {
            const array = [1, 2, 3];
            expect(isEmptyArray(array)).toBe(false);
        });
        it('returns true if array is empty', () => {
            const array = [];
            expect(isEmptyArray(array)).toBe(true);
        });
        it('throws an error if array is undefined', () => {
            expect((() => {
                isEmptyArray();
            })).toThrow();
        });
    });
    describe('getNodesFromStore function', () => {
        it('returns empty array if store state is not defined', () => {
            expect(getNodesFromStore()).toHaveLength(0);
        });
        it('returns canvas element array if store state is defined', () => {
            const currentStoreState = {};
            expect(getNodesFromStore(currentStoreState)).toHaveLength(1);
            expect(getNodesFromStore(currentStoreState)[0]).toBe('canvasElement1');
        });
    });
    describe('getConnectorsFromStore function', () => {
        it('returns empty array if store state is not defined', () => {
            expect(getConnectorsFromStore()).toHaveLength(0);
        });
        it('returns connector array if store state is defined', () => {
            const currentStoreState = {
                connectors: ['connector1']
            };
            expect(getConnectorsFromStore(currentStoreState)).toHaveLength(1);
            expect(getConnectorsFromStore(currentStoreState)).toBe(currentStoreState.connectors);
        });
    });
    describe('updateStoreOnSelection function', () => {
        it('throws an error if storeInstance is not defined', () => {
            expect(() => {
                updateStoreOnSelection();
            }).toThrow();
        });
        it('throws an error if payload is not defined', () => {
            const storeInstance = {};
            expect(() => {
                updateStoreOnSelection(storeInstance);
            }).toThrow();
        });
        it('dispatches selectOnCanvas action if one element is selected', () => {
            const dispatch = jest.fn();
            const payload = {};
            const storeInstance = {
                dispatch
            };
            updateStoreOnSelection(storeInstance, payload);
            expect(dispatch).toHaveBeenCalledWith({
                type: 'selectOnCanvas',
                payload
            });
        });
        it('dispatches toggleOnCanvas action if multiple elements are selected', () => {
            const dispatch = jest.fn();
            const payload = {};
            const storeInstance = {
                dispatch
            };
            updateStoreOnSelection(storeInstance, payload, true);
            expect(dispatch).toHaveBeenCalledWith({
                type: 'toggleOnCanvas',
                payload
            });
        });
    });
    describe('shouldCreateStartConnection function', () => {
        it('throws an error if store instance is not defined', () => {
            expect(() => {
                shouldCreateStartConnection();
            }).toThrow();
        });
        it('throws an error if source guid is not defined', () => {
            const storeInstance = {};
            expect(() => {
                shouldCreateStartConnection(storeInstance);
            }).toThrow();
        });
        it('return false if element type is not start element', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            availableConnections: [],
                            elementType: 'not start Element'
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(shouldCreateStartConnection(storeInstance, 'guid_1')).toBe(false);
        });
        it('return false if avaiable connections are not defined', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            elementType: 'not start Element'
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(shouldCreateStartConnection(storeInstance, 'guid_1')).toBe(false);
        });
        it('return true if avaiable connections are not defined and element is a start element', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            elementType: 'START_ELEMENT'
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(shouldCreateStartConnection(storeInstance, 'guid_1')).toBe(true);
        });
    });
    describe('hasOneAvailableConnection function', () => {
        it('returns false if there are more than one available connections', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            availableConnections: ['connection1', 'connection2']
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(hasOneAvailableConnection(storeInstance, 'guid_1')).toBe(false);
        });
        it('returns true if there is one available connections', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            availableConnections: ['connection1']
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(hasOneAvailableConnection(storeInstance, 'guid_1')).toBe(true);
        });
    });
    describe('shouldOpenConnectorSelectionModal function', () => {
        it('returns false if there is only one available connections', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            availableConnections: ['connection1']
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(shouldOpenConnectorSelectionModal(storeInstance, 'guid_1')).toBe(false);
        });
        it('returns false if element type is not decision, wait or loop', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            availableConnections: ['connection1', 'connection2'],
                            elementType: 'not decision, wait or loop'
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(shouldOpenConnectorSelectionModal(storeInstance, 'guid_1')).toBe(false);
        });
        it('returns true if there are more than 1 available connections and element type is decision', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            availableConnections: ['connection1', 'connection2'],
                            elementType: 'DECISION'
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(shouldOpenConnectorSelectionModal(storeInstance, 'guid_1')).toBe(true);
        });
        it('returns true if there are more than 1 available connections and element type is loop', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            availableConnections: ['connection1', 'connection2'],
                            elementType: 'LOOP'
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(shouldOpenConnectorSelectionModal(storeInstance, 'guid_1')).toBe(true);
        });
        it('returns true if there are more than 1 available connections and element type is wait', () => {
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid_1': {
                            availableConnections: ['connection1', 'connection2'],
                            elementType: 'WAIT'
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            expect(shouldOpenConnectorSelectionModal(storeInstance, 'guid_1')).toBe(true);
        });
    });
    describe('addConnection function', () => {
        it('throws an error if storeInstance is not defined', () => {
            expect(() => {
                addConnection()();
            }).toThrow();
        });
        it('dispatches add connection action', () => {
            const dispatch = jest.fn();
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {}
                };
            });
            const storeInstance = {
                dispatch,
                getCurrentState
            };
            addConnection(storeInstance)();
            expect(dispatch).toHaveBeenCalledWith({
                type:'addConnection',
                payload: {}
            });
        });
    });
    describe('getSourceAndTargetElement function', () => {
        it('returns source and target elements if source and target guid is passed', () => {
            const sourceGuid = 'guid_1';
            const targetGuid = 'guid_2';
            const sourceName = 'element 1';
            const targetName = 'element 2';
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        [sourceGuid]: {
                            name: 'element 1'
                        },
                        [targetGuid]: {
                            name: 'element 2'
                        }
                    }
                };
            });
            const storeInstance = {
                getCurrentState
            };
            const { sourceElement, targetElement } = getSourceAndTargetElement(storeInstance, sourceGuid, targetGuid);
            expect(sourceElement.name).toBe(sourceName);
            expect(targetElement.name).toBe(targetName);
        });
    });
    describe('createConnectorWhenOneConnectionAvailable', () => {
        it('throws an error if storeInstance is not defined', () => {
            expect(() => {
                createConnectorWhenOneConnectionAvailable();
            }).toThrow();
        });
        it('dispatches addConnection action if there is one available connection', () => {
            const sourceGuid = 'guid_1';
            const targetGuid = 'guid_2';
            const dispatch = jest.fn();
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        [sourceGuid]: {
                            availableConnections: [{
                                childReference: 'childReference1',
                                type: 'regular'
                            }]
                        },
                        [targetGuid]: {}
                    }
                };
            });
            const storeInstance = {
                dispatch,
                getCurrentState
            };
            createConnectorWhenOneConnectionAvailable(storeInstance, sourceGuid, targetGuid);
            expect(dispatch).toHaveBeenCalledWith({
                type:'addConnection',
                payload: {}
            });
        });
    });
    describe('openConnectorSelectionModal function', () => {
        it('throws an error if storeInstance is not defined', () => {
            expect(() => {
                openConnectorSelectionModal();
            }).toThrow();
        });
        it('calls invoke property editor', () => {
            const sourceGuid = 'guid_1';
            const targetGuid = 'guid_2';
            const dispatch = jest.fn();
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        [sourceGuid]: {
                            availableConnections: [{
                                childReference: 'childReference1',
                                type: 'regular'
                            }]
                        },
                        [targetGuid]: {}
                    }
                };
            });
            const storeInstance = {
                dispatch,
                getCurrentState
            };
            openConnectorSelectionModal(storeInstance, sourceGuid, targetGuid);
            expect(invokePropertyEditor.mock.calls).toHaveLength(1);
        });
    });
});