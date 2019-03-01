import {
    getElementsToBeDeleted,
    getSaveType,
    updateStoreAfterSaveFlowIsSuccessful,
    updateStoreAfterSaveAsNewFlowIsFailed,
    updateStoreAfterSaveAsNewVersionIsFailed,
    updateUrl,
    setFlowErrorsAndWarnings,
    flowPropertiesCallback,
    saveAsFlowCallback,
    setPeripheralDataForPropertyEditor,
    getDuplicateElementGuidMaps,
    getConnectorToDuplicate,
    highlightCanvasElement } from "../editorUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { SaveType } from 'builder_platform_interaction/saveType';
import { SaveFlowEvent } from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        canvasSelector: jest.fn().mockImplementation(() => {
            return [{
                guid: 'canvasElement1',
                elementType: 'ASSIGNMENT',
                config: {
                    isSelected: true,
                    isHighlighted: false
                }
            }, {
                guid: 'canvasElement2',
                elementType: 'DECISION',
                config: {
                    isSelected: false,
                    isHighlighted: false
                }
            }, {
                guid: 'canvasElement3',
                elementType: 'ASSIGNMENT',
                config: {
                    isSelected: true,
                    isHighlighted: false
                }
            }, {
                guid: 'canvasElement4',
                elementType: 'ASSIGNMENT',
                config: {
                    isSelected: false,
                    isHighlighted: false
                }
            }];
        })
    };
});

jest.mock('builder_platform_interaction/actions', () => {
    return {
        deleteElement: jest.fn().mockImplementation((payload) => {
            return {
                type: 'deleteElement',
                payload
            };
        }),
        updatePropertiesAfterSaving: jest.fn().mockImplementation((payload) => {
            return {
                type: 'updatePropertiesAfterSaving',
                payload
            };
        }),
        updateProperties: jest.fn().mockImplementation((payload) => {
            return {
                type: 'updateProperties',
                payload
            };
        }),
        highlightOnCanvas: jest.fn().mockImplementation((payload) => {
            return {
                type: 'highlightOnCanvas',
                payload
            };
        })
    };
});

jest.mock('builder_platform_interaction/usedByLib', () => {
    return {
        usedBy: jest.fn().mockImplementation(() => {
            return [];
        })
    };
});

jest.mock('builder_platform_interaction/drawingLib', () => require('builder_platform_interaction_mocks/drawingLib'));

jest.mock('builder_platform_interaction/propertyEditorFactory', () => {
    return {
        getElementForStore: jest.fn().mockImplementation(() => {
            return {
                name: 'flowProperties'
            };
        })
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return 'rand_guid';
        })
    };
});

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        setRules: jest.fn(),
        setOperators: jest.fn()
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        setEventTypes: jest.fn(),
        setEntities: jest.fn()
    };
});

jest.mock('builder_platform_interaction/dataTypeLib', () => {
    return {
        setResourceTypes: jest.fn()
    };
});

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        setProcessTypes: jest.fn(),
        setGlobalVariables: jest.fn(),
        setSystemVariables: jest.fn()
    };
});

jest.mock('builder_platform_interaction/apexTypeLib', () => {
    return {
        setApexClasses: jest.fn()
    };
});

jest.mock('builder_platform_interaction/comboboxCache', () => {
    return {
        addToParentElementCache: jest.fn()
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getFlowSystemVariableComboboxItem: jest.fn().mockImplementation(() => {
            return [];
        }),
        getGlobalVariableTypeComboboxItems: jest.fn().mockImplementation(() => {
            return [];
        })
    };
});

jest.mock('builder_platform_interaction/elementConfig', () => {
    return {
        getConfigForElementType: jest.fn()
    };
});

describe('Editor Utils Test', () => {
    describe('getElementsToBeDeleted function', () => {
        let storeInstance;
        let dispatch;
        let getCurrentState;

        beforeEach(() => {
            dispatch = jest.fn();
            getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'canvasElement1': {
                            guid: 'canvasElement1',
                            elementType: ELEMENT_TYPE.ASSIGNMENT,
                            config: {
                                isSelected: true,
                                isHighlighted: false
                            }
                        },
                        'canvasElement2' : {
                            guid: 'canvasElement2',
                            elementType: ELEMENT_TYPE.DECISION,
                            config: {
                                isSelected: false,
                                isHighlighted: false
                            }
                        },
                        'canvasElement3' : {
                            guid: 'canvasElement3',
                            elementType: ELEMENT_TYPE.ASSIGNMENT,
                            config: {
                                isSelected: true,
                                isHighlighted: false
                            }
                        },
                        'canvasElement4' : {
                            guid: 'canvasElement4',
                            elementType: ELEMENT_TYPE.ASSIGNMENT,
                            config: {
                                isSelected: false,
                                isHighlighted: false
                            }
                        }
                    },
                    connectors: [{
                        source: 'canvasElement2',
                        target: 'canvasElement3',
                        config: {
                            isSelected: false
                        }
                    }, {
                        source: 'canvasElement3',
                        target: 'canvasElement4',
                        config: {
                            isSelected: false
                        }
                    }, {
                        source: 'canvasElement2',
                        target: 'canvasElement4',
                        config: {
                            isSelected: true
                        }
                    }]
                };
            });

            storeInstance = {
                dispatch,
                getCurrentState
            };
        });

        it('dispatch deleteElement action with only one element when isMultiElementDelete is false and no connectors are involved', () => {
            const selectedElementGUID = ['canvasElement1'];
            const selectedElementType = ELEMENT_TYPE.ASSIGNMENT;

            const payload = {
                selectedElementGUIDs: ['canvasElement1'],
                connectorsToDelete: [],
                elementType: ELEMENT_TYPE.ASSIGNMENT
            };

            getElementsToBeDeleted(storeInstance, {selectedElementGUID, selectedElementType});

            expect(dispatch).toHaveBeenCalledWith({
                type: 'deleteElement',
                payload
            });
        });

        it('dispatch deleteElement action when isMultiElementDelete is false and all connectors are involved', () => {
            const selectedElementGUID = ['canvasElement2'];
            const selectedElementType = ELEMENT_TYPE.ASSIGNMENT;

            const payload = {
                selectedElementGUIDs: ['canvasElement2'],
                connectorsToDelete: [{
                    source: 'canvasElement2',
                    target: 'canvasElement3',
                    config: {
                        isSelected: false
                    }
                }, {
                    source: 'canvasElement2',
                    target: 'canvasElement4',
                    config: {
                        isSelected: true
                    }
                }],
                elementType: ELEMENT_TYPE.ASSIGNMENT
            };

            getElementsToBeDeleted(storeInstance, {selectedElementGUID, selectedElementType});

            expect(dispatch).toHaveBeenCalledWith({
                type: 'deleteElement',
                payload
            });
        });

        it('dispatch deleteElement action when isMultiElementDelete is true and some of connectors are involved', () => {
            const selectedElementGUID = undefined;
            const selectedElementType = undefined;

            const payload = {
                selectedElementGUIDs: ['canvasElement1', 'canvasElement3'],
                connectorsToDelete: [{
                    source: 'canvasElement2',
                    target: 'canvasElement3',
                    config: {
                        isSelected: false
                    }
                }, {
                    source: 'canvasElement3',
                    target: 'canvasElement4',
                    config: {
                        isSelected: false
                    }
                }, {
                    source: 'canvasElement2',
                    target: 'canvasElement4',
                    config: {
                        isSelected: true
                    }
                }],
                elementType: undefined
            };

            getElementsToBeDeleted(storeInstance, {selectedElementGUID, selectedElementType});

            expect(dispatch).toHaveBeenCalledWith({
                type: 'deleteElement',
                payload
            });
        });
    });

    describe('getSaveType function', () => {
        it('throw an error if event type not defined', () => {
            expect(() => {
                getSaveType();
            }).toThrow();
        });

        it('return "UPDATE" save type if flow event type is "save" and flowid is defined', () => {
            expect(getSaveType(SaveFlowEvent.Type.SAVE, 'flowid', false)).toBe(SaveType.UPDATE);
        });

        it('return "CREATE" save type if flow event type is "save" and flow id is not defined', () => {
            expect(getSaveType(SaveFlowEvent.Type.SAVE, undefined, false)).toBe(SaveType.CREATE);
        });

        it('return "NEW_DEFINITION" save type if flow event type is "save_as", "flowId" is undefined and "canOnlySaveAsNewDefinition" is true', () => {
            expect(getSaveType(SaveFlowEvent.Type.SAVE_AS, undefined, true)).toBe(SaveType.NEW_DEFINITION);
        });

        it('return "NEW_DEFINITION" save type if flow event type is "save_as", "flowId" is defined and "canOnlySaveAsNewDefinition" is true', () => {
            expect(getSaveType(SaveFlowEvent.Type.SAVE_AS, 'flowid', true)).toBe(SaveType.NEW_DEFINITION);
        });

        it('return "NEW_VERSION" save type if flow event type is "save_as", "flowId" is undefined and "canOnlySaveAsNewDefinition" is false', () => {
            expect(getSaveType(SaveFlowEvent.Type.SAVE_AS, undefined, false)).toBe(SaveType.NEW_VERSION);
        });

        it('return "NEW_VERSION" save type if flow event type is "save_as", "flowId" is defined and "canOnlySaveAsNewDefinition" is false', () => {
            expect(getSaveType(SaveFlowEvent.Type.SAVE_AS, 'flowid', false)).toBe(SaveType.NEW_VERSION);
        });
    });


    describe('updateStoreAfterSaveFlowIsSuccessful function', () => {
        it('throw an error if store instance not defined', () => {
            expect(() => {
                updateStoreAfterSaveFlowIsSuccessful();
            }).toThrow();
        });
        it('dispatch updatePropertiesAfterSaving action if flow save success', () => {
            const dispatch = jest.fn();
            const storeInstance = {
                dispatch
            };

            updateStoreAfterSaveFlowIsSuccessful(storeInstance, {versionNumber: '1', status: 'Active', lastModifiedDate: '', lastModifiedBy: 'user1'});

            const payload = {
                versionNumber: '1',
                status: 'Active',
                lastModifiedDate: '',
                isLightningFlowBuilder: true,
                lastModifiedBy: 'user1',
                canOnlySaveAsNewDefinition: false
            };

            expect(dispatch).toHaveBeenCalledWith({
                type: 'updatePropertiesAfterSaving',
                payload
            });
        });
    });

    describe('updateStoreAfterSaveAsNewFlowIsFailed function', () => {
        it('throw an error if store instance not defined', () => {
            expect(() => {
                updateStoreAfterSaveAsNewFlowIsFailed();
            }) .toThrow();
        });

        it('dispatch updateProperties action if saveAsNewFlow fails', () => {
            const dispatch = jest.fn();
            const storeInstance = {
                dispatch
            };

            updateStoreAfterSaveAsNewFlowIsFailed(storeInstance);

            const payload = {
                versionNumber: null,
                status: null,
                lastModifiedDate: null,
                isLightningFlowBuilder: true,
                lastModifiedBy: null,
                canOnlySaveAsNewDefinition: false
            };

            expect(dispatch).toHaveBeenCalledWith({
                type: 'updateProperties',
                payload
            });
        });
    });


    describe('updateStoreAfterSaveAsNewVersionIsFailed function', () => {
        it('throw an error if store instance not defined', () => {
            expect(() => {
                updateStoreAfterSaveAsNewVersionIsFailed();
            }).toThrow();
        });

        it('dispatch updateProperties action if saveAsNewVersion fails', () => {
           const dispatch = jest.fn();
           const storeInstance = {
               dispatch
           };

           updateStoreAfterSaveAsNewVersionIsFailed(storeInstance, "label1", "description1", "interviewLabel1");

           const payload = {
               label: "label1",
               description: "description1",
               interviewLabel: "interviewLabel1"
           };

           expect(dispatch).toHaveBeenCalledWith({
               type: 'updateProperties',
               payload
           });
        });
    });

    describe('updateUrl function', () => {
        it('when update url check the window history state', () => {
            window.history.pushState = jest.fn();
            updateUrl('123');
            expect(window.history.pushState).toHaveBeenCalled();
        });
    });

    describe('setFlowErrorsAndWarnings function', () => {
        it('when no errors and warnings are present', () => {
            expect(setFlowErrorsAndWarnings({})).toEqual({errors: {}, warnings: {}});
        });

        it('when errors are present, but warnings are not', () => {
            const errors = {e1: "e1"}, warnings = {};
            expect(setFlowErrorsAndWarnings({errors, warnings})).toEqual({errors: {e1: "e1"}, warnings: {}});
        });

        it('when errors are not present and warnings are present', () => {
            const errors = {}, warnings = {w1: "w1"};
            expect(setFlowErrorsAndWarnings({errors, warnings})).toEqual({errors: {}, warnings: {w1: "w1"}});
        });

        it('when both errors and warnings are present', () => {
            const errors = {e1: "e1"}, warnings = {e1: "e1"};
            expect(setFlowErrorsAndWarnings({errors, warnings})).toEqual({errors: {e1: "e1"}, warnings: {e1: "e1"}});
        });
    });

    describe('flowPropertiesCallback function', () => {
        it('throw an error if store instance is not defined', () => {
           expect(() => {
               flowPropertiesCallback()({});
           }).toThrow('Store instance is not defined');
        });

        it('dispatch updateProperties action when flow property editor ok', () => {
            const dispatch = jest.fn();
            const storeInstance = {
                dispatch
            };

            flowPropertiesCallback(storeInstance)({
                name: {error: null, value: 'flowProperties'}
            });

            const payload = {
                name: 'flowProperties'
            };

            expect(dispatch).toHaveBeenCalledWith({
                type: 'updateProperties',
                payload
            });
        });
    });

    describe('saveAsFlowCallback function', () => {
        it('throw an error if store instance is not defined', () => {
            expect(() => {
               saveAsFlowCallback()();
            }).toThrow('Store instance is not defined');
        });

        it('throw an error if save flow function is not defined', () => {
           expect(() => {
               saveAsFlowCallback({})();
           }).toThrow('Save flow function is not defined');
        });

        it('saveFlowFn is not called when save type is "UPDATE"', () => {
            const dispatch = jest.fn();
            const storeInstance = {
                dispatch
            };
            const flowProperties = {
                saveType: SaveType.UPDATE
            };
            const mocksaveFlowFn = jest.fn(saveType => saveType);
            saveAsFlowCallback(storeInstance, mocksaveFlowFn)(flowProperties);
            expect(mocksaveFlowFn.mock.calls).toHaveLength(0);
        });

        it('saveFlowFn is called when save type is not "UPDATE', () => {
            const dispatch = jest.fn();
            const storeInstance = {
                dispatch
            };
            const flowProperties = {
                saveType: SaveType.CREATE
            };
            const mocksaveFlowFn = jest.fn(saveType => saveType);
            saveAsFlowCallback(storeInstance, mocksaveFlowFn)(flowProperties);
            expect(mocksaveFlowFn.mock.results[0].value).toBe(SaveType.CREATE);
        });
    });

    describe('setPeripheralDataForPropertyEditor function', () => {
        const { setRules, setOperators } = require('builder_platform_interaction/ruleLib');
        const { setResourceTypes } = require('builder_platform_interaction/dataTypeLib');
        const { setEntities, setEventTypes } = require('builder_platform_interaction/sobjectLib');
        const { setGlobalVariables, setSystemVariables, setProcessTypes } = require('builder_platform_interaction/systemLib');
        const { setApexClasses } = require("builder_platform_interaction/apexTypeLib");

        const rules = [{
            ruleType: 'assignment'
        }];
        const operators = {};
        const resourceTypes = {};
        const eventTypes = {};
        const processTypes = {};
        const globalVariables = {};
        const systemVariables = [{
            devName: 'CurrentDate'
        }];
        const entities = [{
            fields: null
        }];
        const apexTypes = {};

        beforeEach(() => {
            setPeripheralDataForPropertyEditor({
                rules,
                operators,
                resourceTypes,
                eventTypes,
                processTypes,
                globalVariables,
                systemVariables,
                entities,
                apexTypes
            });
        });

        it('setRules has been called', () => {
            expect(setRules).toHaveBeenCalled();
        });

        it('setOperators has been called', () => {
            expect(setOperators).toHaveBeenCalled();
        });

        it('setResourceTypes has been called', () => {
            expect(setResourceTypes).toHaveBeenCalled();
        });

        it('setEventTypes has been called', () => {
            expect(setEventTypes).toHaveBeenCalled();
        });

        it('setProcessTypes has been called', () => {
            expect(setProcessTypes).toHaveBeenCalled();
        });

        it('setGlobalVariables has been called', () => {
            expect(setGlobalVariables).toHaveBeenCalled();
        });

        it('setSystemVariables has been called', () => {
            expect(setSystemVariables).toHaveBeenCalled();
        });

        it('setEntities has been called', () => {
            expect(setEntities).toHaveBeenCalled();
        });

        it('setApexClasses has been called', () => {
            expect(setApexClasses).toHaveBeenCalled();
        });
    });

    describe('getDuplicateElementGuidMaps function', () => {
        it('throw an error if canvasElementsInStore is not defined', () => {
            expect(() => {
                getDuplicateElementGuidMaps(undefined, {});
            }).toThrow('canvasElementsInStore is not defined');
        });

        it('throw an error if elementsInStore is not defined', () => {
            expect(() => {
                getDuplicateElementGuidMaps([], undefined);
            }).toThrow('elementsInStore is not defined');
        });

        it('return {canvasElementGuidMap, childElementGuidMap}', () => {
            const canvasElementsInStore = ['guid1', 'guid2'];
            const elementsInStore = {
                'guid1': {
                    config: {isSelected: false, isHighlighted: false},
                    connectorCount: 0,
                    elementType: "START_ELEMENT",
                    guid: "guid1",
                    isCanvasElement: true
                },
                'guid2': {
                    config: {isSelected: true, isHighlighted: false},
                    connectorCount: 0,
                    elementType: "SCREEN",
                    guid: "guid2",
                    isCanvasElement: true
                }
            };

            const canvasElementGuidMap = {
                'guid2': 'rand_guid'
            };
            const childElementGuidMap = {};
            const res = {canvasElementGuidMap, childElementGuidMap};
            expect(getDuplicateElementGuidMaps(canvasElementsInStore, elementsInStore)).toEqual(res);
        });
    });

    describe('getConnectorToDuplicate function', () => {
        it('throw an error if connectorsInStore is not defined', () => {
            expect(() => {
                getConnectorToDuplicate(undefined, {});
            }).toThrow('connectorsInStore is not defined');
        });

        it('throw an error if canvasElementGuidMap is not defined', () => {
            expect(() => {
                getConnectorToDuplicate([], undefined);
            }).toThrow('canvasElementGuidMap is not defined');
        });

        it('return array containing connectors that need to be duplicated', () => {
            const connectorsInStore = [{
                guid: 'conn1',
                source: 'guid1',
                target: 'guid2',
                config: {isSelected: false},
                type: 'REGULAR'
            }, {
                guid: 'conn2',
                source: 'guid2',
                target: 'guid3',
                config: {isSelected: true},
                type: 'REGULAR'
            }, {
                guid: 'conn3',
                source: 'guid3',
                target: 'guid4',
                config: {isSelected: true},
                type: 'REGULAR'
            }];
            const canvasElementGuidMap = {
                'guid3': 'rand_guid3',
                'guid4': 'rand_guid4'
            };

            const connectorsToDuplicate = [{
                guid: 'conn3',
                source: 'guid3',
                target: 'guid4',
                config: {isSelected: true},
                type: 'REGULAR'
            }];
            expect(getConnectorToDuplicate(connectorsInStore, canvasElementGuidMap)).toEqual(connectorsToDuplicate);
        });
    });

    describe('highlightCanvasElement function', () => {
        it('throw an error if store instance is not defined', () => {
            expect(() => {
                highlightCanvasElement(undefined, 'guid1');
            }).toThrow('Store instance is not defined');
        });

        it('throw an error if elementGuid is not defined', () => {
            expect(() => {
                highlightCanvasElement({}, undefined);
            }).toThrow('elementGuid is not defined');
        });

        it('dispatch highlightOnCanvas action if the searched element is not highlighted', () => {
            const dispatch = jest.fn();
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid1': {
                            guid: 'guid1',
                            config: {
                                isHighlighted: false
                            }
                        }
                    }
                };
            });
            const storeInstance = {
                dispatch,
                getCurrentState
            };
            const elementGuid = 'guid1';

            highlightCanvasElement(storeInstance, elementGuid);

            const payload = {
                guid: 'guid1'
            };
            expect(dispatch).toHaveBeenCalledWith({
                type: 'highlightOnCanvas',
                payload
            });
        });

        it('highlightOnCanvas action is not dispatched if the searched element is already highlighted', () => {
            const dispatch = jest.fn();
            const getCurrentState = jest.fn().mockImplementation(() => {
                return {
                    elements: {
                        'guid1': {
                            guid: 'guid1',
                            config: {
                                isHighlighted: true
                            }
                        }
                    }
                };
            });
            const storeInstance = {
                dispatch,
                getCurrentState
            };
            const elementGuid = 'guid1';

            highlightCanvasElement(storeInstance, elementGuid);

            const payload = {
                guid: 'guid1'
            };
            expect(dispatch).not.toHaveBeenCalledWith({
                type: 'highlightOnCanvas',
                payload
            });
        });
    });
});