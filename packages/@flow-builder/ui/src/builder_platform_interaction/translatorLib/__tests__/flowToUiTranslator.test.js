import { translateFlowToUIModel } from "../flowToUiTranslator";

const flowWithDummyElement = {
    metadata: {
        dummyMetadata: [{
            name: 'dummyElementName'
        }]
    }
};

jest.mock('builder_platform_interaction/elementFactory', () => {
    return {
        createFlowProperties: jest.fn().mockImplementation(() => {
            return {
                name: 'Test Flow',
            };
        }),
        createStartElementWithConnectors: jest.fn().mockImplementation(() => {
            const guid = 'guid2';
            return {
                elements: {
                    [guid]: {
                        name: 'startElementName',
                        isCanvasElement: true
                    }
                }
            };
        }),
        getDataTypeKey: require.requireActual('builder_platform_interaction/elementFactory').getDataTypeKey,
    };
});

jest.mock('builder_platform_interaction/flowMetadata', () => {
    return {
        ELEMENT_TYPE: {
            DUMMY: 'dummy'
        },
        METADATA_KEY: {
            DUMMY_METADATA: 'dummyMetadata'
        },
        TEMPLATE_FIELDS: new Set(),
        REFERENCE_FIELDS: new Set(),
        SPECIAL_REFERENCE_FIELDS: new Set()
    };
});

jest.mock('builder_platform_interaction/elementConfig', () => {
    return {
        elementTypeToConfigMap: {
            dummy: {
                metadataKey: 'dummyMetadata',
                factory: {
                    flowToUi: ({name}) => {
                        const guid = 'guid1';
                        return {
                            elements: {
                                [guid]: {
                                    guid,
                                    name
                                }
                            },
                            connectors: [{
                                guid: 'connector1'
                            }]
                        };
                    }
                }
            }
        }
    };
});


describe('Flow to ui translator tests', () => {
    describe('translateFlowToUIModel function', () => {
        describe('return properties', () => {
            it('which has name prop', () => {
                const { properties } = translateFlowToUIModel(flowWithDummyElement);
                expect(properties.name).toBe('Test Flow');
            });
        });
        describe('returns elements object', () => {
            it('which has two elements', () => {
                const { elements } = translateFlowToUIModel(flowWithDummyElement);
                const elementKeys = Object.keys(elements);
                expect(elementKeys).toHaveLength(2);
            });
            it('which has one element with name prop', () => {
                const { elements } = translateFlowToUIModel(flowWithDummyElement);
                const { guid1 } = elements;
                expect(guid1.name).toBe('dummyElementName');
            });
            it('which has second element with name prop', () => {
                const { elements } = translateFlowToUIModel(flowWithDummyElement);
                const { guid2 } = elements;
                expect(guid2.name).toBe('startElementName');
            });
        });
        describe('return connectors array', () => {
            it('which has two connectors', () => {
                const { connectors } = translateFlowToUIModel(flowWithDummyElement);
                expect(connectors).toHaveLength(1);
            });
            it('which has a connector with guid', () => {
                const { connectors } = translateFlowToUIModel(flowWithDummyElement);
                const { guid } = connectors[0];
                expect(guid).toBe('connector1');
            });
        });
        describe('return canvas element array', () => {
            it('which has one canvas element guid', () => {
                const { canvasElements } = translateFlowToUIModel(flowWithDummyElement);
                expect(canvasElements).toHaveLength(1);
            });
        });
    });
});