import { translateFlowToUIModel, getFlowStartElementReference} from "../flowToUiTranslator";

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
                        isCanvasElement: true,
                        guid
                    }
                }
            };
        }),
        getDataTypeKey: require.requireActual('../../elementFactory/elementFactory.js').getDataTypeKey,
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
    describe('"getFlowStartElementReference" function', () => {
        const startElementReference = 'dummyElementName';
        let flowStartElementReference;
        it('returns "undefined" when no startElementReference property (neither at metadata level nor root level of flow)', () => {
            flowStartElementReference = getFlowStartElementReference(flowWithDummyElement);
            expect(flowStartElementReference).toBeUndefined();
        });
        it('returns flow "startElementReference" property when flow "startElementReference" property', () => {
            const flowWithStartElementReference = { startElementReference};
            flowStartElementReference = getFlowStartElementReference(flowWithStartElementReference);
            expect(flowStartElementReference).toBe(startElementReference);
        });
        it('returns flow metadata "startElementReference" property when flow metadata "startElementReference" property ', () => {
            const flowWithMetadataStartElementReference = { metadata : {startElementReference}};
            flowStartElementReference = getFlowStartElementReference(flowWithMetadataStartElementReference);
            expect(flowStartElementReference).toBe(startElementReference);
        });
    });
});