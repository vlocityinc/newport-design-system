import { translateUIModelToFlow } from "../uiToFlowTranslator";

const uiModel = {
    elements: {
        'guid1': {
            elementType: 'dummyElementType',
            guid: 'guid1',
            name: 'dummyElementName',
        },
        'guid2': {
            elementType: 'startElement',
            guid: 'guid2',
            name: 'startElementName'
        }
    },
    connectors: [{
        source: 'guid2',
        target: 'guid1',
    }],
    properties: {
        versionNumber: 1,
        name: 'flow name',
        elementType: 'flowProperties'
    },
    canvasElements: ['guid1', 'guid2']
};
jest.mock('builder_platform_interaction/flowMetadata', () => {
    return {
        ELEMENT_TYPE: {
            DUMMY: 'dummy',
            START_ELEMENT: 'startElement'
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
        getConfigForElementType: jest.fn().mockImplementation((elementType) => {
            if (elementType === 'dummyElementType') {
                return {
                    metadataKey: 'dummyMetadataKey',
                    factory: {
                        uiToFlow: () => {
                            return {
                                name: 'dummyElementName'
                            };
                        }
                    }
                };
            } else if (elementType === 'startElement') {
                return {
                    factory: {}
                };
            } else if (elementType === 'flowProperties') {
                return {
                    factory: {
                        uiToFlow: () => {
                            return {
                                versionNumber: 1,
                                name: 'flow name'
                            };
                        }
                    }
                };
            }
            return {};
        })
    };
});

jest.mock('builder_platform_interaction/connectorUtils', () => {
    return {
        getFlowBounds: jest.fn().mockImplementation(() => {
            return {
                flowWidth: 10,
                flowHeight: 10
            };
        })
    };
});

describe('UI to Flow Translation', () => {
    describe('translateUIModelToFlow', () => {
        it('return version number', () => {
            const { versionNumber } = translateUIModelToFlow(uiModel);
            expect(versionNumber).toBe(1);
        });
        it('return full name', () => {
            const { fullName } = translateUIModelToFlow(uiModel);
            expect(fullName).toBe('flow name');
        });
        describe('return metadata', () => {
            it('with start element reference', () => {
                const { metadata } = translateUIModelToFlow(uiModel);
                const { startElementReference } = metadata;
                expect(startElementReference).toBe('dummyElementName');
            });
            it('with one element', () => {
                const { metadata } = translateUIModelToFlow(uiModel);
                const { dummyMetadataKey } = metadata;
                expect(dummyMetadataKey).toHaveLength(1);
            });
            it('with one element having name property', () => {
                const { metadata } = translateUIModelToFlow(uiModel);
                const { dummyMetadataKey } = metadata;
                expect(dummyMetadataKey[0].name).toBe('dummyElementName');
            });
        });
    });
});