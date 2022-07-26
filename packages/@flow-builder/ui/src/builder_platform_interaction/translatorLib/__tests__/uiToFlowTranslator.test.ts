// @ts-nocheck
import { Store } from 'builder_platform_interaction/storeLib';
import { getFlowMetadataInJsonString, translateUIModelToFlow } from '../uiToFlowTranslator';

const uiModel = {
    elements: {
        guid1: {
            elementType: 'dummyElementType',
            guid: 'guid1',
            name: 'dummyElementName'
        },
        guid2: {
            elementType: 'startElement',
            guid: 'guid2',
            name: 'startElementName'
        }
    },
    connectors: [
        {
            source: 'guid2',
            target: 'guid1'
        }
    ],
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
            DUMMY_METADATA: 'dummyMetadata',
            START: 'start'
        },
        TEMPLATE_FIELDS: new Set(),
        REFERENCE_FIELDS: new Set(),
        SPECIAL_REFERENCE_FIELDS: new Set(),
        FLOW_PROCESS_TYPE: {
            AUTO_LAUNCHED_FLOW: 'AutoLaunchedFlow'
        },
        FLOW_TRIGGER_TYPE: {
            SCHEDULED: 'Scheduled',
            BEFORE_SAVE: 'BeforeSave'
        },
        FLOW_SUPPORTED_FEATURES: {
            CONDITIONAL_FIELD_VISIBILITY: 'ConditionalFieldVisibility',
            CONFIGURABLE_START: 'ConfigurableStart'
        },
        FLOW_TRIGGER_SAVE_TYPE: {
            UPDATE: 'Update',
            CREATE: 'Create',
            CREATE_AND_UPDATE: 'CreateAndUpdate'
        },
        WAIT_TIME_EVENT_OFFSET_UNIT: {
            DAYS: 'Days'
        },
        FlowScreenFieldType: {}
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
                    metadataKey: 'start',
                    factory: {
                        uiToFlow: () => {
                            return {
                                name: 'startElementName'
                            };
                        }
                    }
                };
            } else if (elementType === 'flowProperties') {
                return {
                    factory: {
                        uiToFlow: () => {
                            return {
                                versionNumber: 1,
                                name: 'flow name',
                                processType: 'AutoLaunchedFlow'
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

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

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
            it('with start element', () => {
                const { metadata } = translateUIModelToFlow(uiModel);
                const { start } = metadata;
                expect(start.name).toBe('startElementName');
            });
            it('with regular element', () => {
                const { metadata } = translateUIModelToFlow(uiModel);
                const { dummyMetadataKey } = metadata;
                expect(dummyMetadataKey).toHaveLength(1);
            });
            it('with regular element having name property', () => {
                const { metadata } = translateUIModelToFlow(uiModel);
                const { dummyMetadataKey } = metadata;
                expect(dummyMetadataKey[0].name).toBe('dummyElementName');
            });
        });
    });
});

describe('getFlowMetadataInJsonString', () => {
    const uiModel = {
        elements: {
            guid1: {
                elementType: 'startElement',
                guid: 'guid1',
                name: 'startElementName'
            }
        },
        connectors: [{ source: 'guid1' }],
        properties: {
            versionNumber: 1,
            name: 'flowName',
            elementType: 'flowProperties'
        },
        canvasElements: ['guid1']
    };

    it('should translate UI model to stringified flow metadata ', () => {
        Store.setMockState(uiModel);
        const metadata = getFlowMetadataInJsonString();
        const expected = JSON.stringify({
            start: { name: 'startElementName' },
            versionNumber: 1,
            name: 'flow name',
            processType: 'AutoLaunchedFlow'
        });
        expect(metadata).toEqual(expected);
    });
});
