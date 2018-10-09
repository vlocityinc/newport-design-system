import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { createWaitEvent, createWaitWithWaitEvents } from '../wait';
import { baseCanvasElement, baseChildElement } from "../base/baseElement";
import { ELEMENT_TYPE, CONDITION_LOGIC} from "builder_platform_interaction/flowMetadata";
import {baseCanvasElementMetadataObject, baseChildElementMetadataObject} from "../base/baseMetadata";
import { createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor } from "../wait";
import { LABELS } from "../elementFactoryLabels";
import { createWaitMetadataObject, createWaitWithWaitEventReferences } from "../wait";

const newWaitGuid = 'newWait';
const existingWaitGuid = 'existingWait';
const existingWait = {
    guid: existingWaitGuid,
    waitEventReferences: [
        { waitReference: 'existingWaitEvent1'},
        { waitReference: 'existingWaitEvent1'}
    ]
};

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn()
    };
});

const foundElementGuidPrefix = 'found';
getElementByGuid.mockImplementation((guid) => {
    if (guid === newWaitGuid) {
        return null;
    } else if (guid === existingWaitGuid) {
        return existingWait;
    }

    return {
        guid: foundElementGuidPrefix + guid
    };
});

jest.mock('../base/baseElement', () => {
    return {
        baseCanvasElement: jest.fn((element) => {
            return Object.assign({}, element);
        }).mockName('baseCanvasElementMock'),
        baseChildElement: jest.fn((waitEvent) => {
            return Object.assign({}, waitEvent);
        }).mockName('baseChildElementMock'),
        baseCanvasElementsArrayToMap: jest.requireActual('../base/baseElement').baseCanvasElementsArrayToMap
    };
});

jest.mock('../base/baseMetadata');
baseCanvasElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});
baseChildElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});

describe('wait', () => {
    describe('createWaitWithWaitEvents', () => {
        it('with no parameter calls baseCanvasElement with an empty object', () => {
            createWaitWithWaitEvents();
            expect(baseCanvasElement.mock.calls[0][0]).toEqual({});
        });

        it('element type is WAIT', () => {
            const wait = createWaitWithWaitEvents();

            expect(wait.elementType).toEqual(ELEMENT_TYPE.WAIT);
        });

        describe('wait events', () => {
            it('includes a single default wait event if no wait event references present', () => {
                const waitEvent = {
                    foo: 'bar'
                };
                baseChildElement.mockReturnValueOnce(waitEvent);
                const wait = createWaitWithWaitEvents();

                expect(wait.waitEvents).toHaveLength(1);
                expect(wait.waitEvents[0]).toEqual(waitEvent);
            });

            it('includes wait event for all wait event references present', () => {
                const waitEventReferences = [
                    { waitEventReference: 'a'},
                    { waitEventReference: 'b'},
                    { waitEventReference: 'c'}
                ];

                const wait = createWaitWithWaitEvents({
                    waitEventReferences
                });

                expect(wait.waitEvents).toHaveLength(3);
                expect(wait.waitEvents[0].guid).toEqual(foundElementGuidPrefix + waitEventReferences[0].waitEventReference);
                expect(wait.waitEvents[1].guid).toEqual(foundElementGuidPrefix + waitEventReferences[1].waitEventReference);
                expect(wait.waitEvents[2].guid).toEqual(foundElementGuidPrefix + waitEventReferences[2].waitEventReference);
            });
        });
    });

    describe('createWaitEvent', () => {
        const defaultWaitEvent = {conditionLogic : CONDITION_LOGIC.NO_CONDITIONS};

        it('calls baseChildElement with elementType = WAIT_EVENT', () => {
            createWaitEvent();
            expect(baseChildElement.mock.calls[0][1]).toEqual(ELEMENT_TYPE.WAIT_EVENT);
        });

        it('has NO_CONDITIONS as the default condition logic', () => {
            createWaitEvent();
            expect(baseChildElement.mock.calls[0][0].conditionLogic).toEqual(defaultWaitEvent.conditionLogic);
        });

        it('uses existing values when passed in a waitEvent object', () => {
            const mockCondition1 = { operator: 'foo' };
            const mockCondition2 = { operator: 'bar' };
            const mockWaitEvent =  {
                conditionLogic: CONDITION_LOGIC.OR,
                conditions: [
                    mockCondition1,
                    mockCondition2,
                ],
                dataType: 'sfdc'
            };

            createWaitEvent(mockWaitEvent);

            expect(baseChildElement.mock.calls[0][0]).toEqual(mockWaitEvent);
        });
    });

    describe('createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor', () => {
        let waitFromPropertyEditor;

        beforeEach(() => {
            waitFromPropertyEditor = {
                guid: newWaitGuid,
                waitEvents: [{
                    guid: 'waitEvent1'
                }]
            };
        });

        it('includes the return value of a call to baseCanvasElement', () => {
            createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(waitFromPropertyEditor);

            expect(baseCanvasElement).toHaveBeenCalledWith(waitFromPropertyEditor);
        });

        it('element type is WAIT_WITH_MODIFIED_AND_DELETED_WAIT_EVENTS', () => {
            const result = createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(waitFromPropertyEditor);

            expect(result.elementType).toEqual(ELEMENT_TYPE.WAIT_WITH_MODIFIED_AND_DELETED_WAIT_EVENTS);
        });

        it('wait element type is WAIT', () => {
            const result = createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(waitFromPropertyEditor);

            expect(result.wait.elementType).toEqual(ELEMENT_TYPE.WAIT);
        });


        describe('defaultConnectorLabel', () => {
            it('is used if passed in', () => {
                const defaultConnectorLabel = 'some label';

                waitFromPropertyEditor.defaultConnectorLabel = defaultConnectorLabel;
                const result = createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(waitFromPropertyEditor);

                expect(result.wait.defaultConnectorLabel).toEqual(defaultConnectorLabel);
            });
        });

        describe('new/modified waitEvents', () => {
            it('wait includes waitEvent references for all waitEvents present', () => {
                const waitEvents = [
                    { guid: 'a'},
                    { guid: 'b'},
                    { guid: 'c'}
                ];

                waitFromPropertyEditor.waitEvents = waitEvents;

                const result = createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(waitFromPropertyEditor);

                expect(result.wait.waitEventReferences).toHaveLength(3);
                expect(result.wait.waitEventReferences[0].waitEventReference).toEqual(waitEvents[0].guid);
                expect(result.wait.waitEventReferences[1].waitEventReference).toEqual(waitEvents[1].guid);
                expect(result.wait.waitEventReferences[2].waitEventReference).toEqual(waitEvents[2].guid);
            });
            it('includes waitEvents for all waitEvents present', () => {
                const waitEvents = [
                    { guid: 'a'},
                    { guid: 'b'},
                    { guid: 'c'}
                ];

                waitFromPropertyEditor.waitEvents = waitEvents;

                const result = createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(waitFromPropertyEditor);

                expect(result.waitEvents).toHaveLength(3);
                expect(result.waitEvents[0].guid).toEqual(waitEvents[0].guid);
                expect(result.waitEvents[1].guid).toEqual(waitEvents[1].guid);
                expect(result.waitEvents[2].guid).toEqual(waitEvents[2].guid);
            });
        });
        describe('deleted waitEvents', () => {
            it('wait does not include waitEvent references for deleted waitEvents', () => {
                waitFromPropertyEditor = {
                    guid: existingWaitGuid,
                    waitEvents: [{
                        guid: 'waitEvent1'
                    }]
                };

                const result = createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(waitFromPropertyEditor);

                expect(result.wait.waitEventReferences).toHaveLength(1);
                expect(result.wait.waitEventReferences[0].waitEventReference).toEqual(waitFromPropertyEditor.waitEvents[0].guid);
            });
            it('includes all deleted waitEvents', () => {
                waitFromPropertyEditor = {
                    guid: existingWaitGuid,
                    waitEvents: [{
                        guid: 'waitEvent1'
                    }]
                };

                const result = createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor(waitFromPropertyEditor);

                expect(result.deletedWaitEvents).toHaveLength(2);
                expect(result.deletedWaitEvents[0].guid).toEqual(foundElementGuidPrefix + existingWait.waitEventReferences[0].waitEventReference);
                expect(result.deletedWaitEvents[1].guid).toEqual(foundElementGuidPrefix + existingWait.waitEventReferences[1].waitEventReference);
            });
        });
    });

    describe('createWaitWithWaitEventReferences', () => {
        let waitFromFlow;

        beforeEach(() => {
            waitFromFlow = {
                guid: existingWaitGuid,
                waitEvents: [
                    {
                        name: 'waitEvent1',
                        guid: 'waitEvent1'
                    },
                    {
                        name: 'waitEvent2',
                        guid: 'waitEvent2'
                    },
                    {
                        name: 'waitEvent3',
                        guid: 'waitEvent3'
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElement', () => {
            createWaitWithWaitEventReferences(waitFromFlow);

            expect(baseCanvasElement).toHaveBeenCalledWith(waitFromFlow);
        });

        it('element type is WAIT', () => {
            const result = createWaitWithWaitEventReferences(waitFromFlow);

            const wait = result.elements[existingWaitGuid];
            expect(wait.elementType).toEqual(ELEMENT_TYPE.WAIT);
        });

        describe('defaultConnectorLabel', () => {
            it('defaults to LABELS.emptyDefaultWaitPathLabel', () => {
                const result = createWaitWithWaitEventReferences(waitFromFlow);
                const wait = result.elements[existingWaitGuid];

                expect(wait.defaultConnectorLabel).toEqual(LABELS.emptyDefaultWaitPathLabel);
            });
            it('is used if passed in', () => {
                const defaultConnectorLabel = 'some label';

                waitFromFlow.defaultConnectorLabel = defaultConnectorLabel;

                const result = createWaitWithWaitEventReferences(waitFromFlow);
                const wait = result.elements[existingWaitGuid];

                expect(wait.defaultConnectorLabel).toEqual(defaultConnectorLabel);
            });
        });
        describe('waitEvents', () => {
            it('wait includes waitEvents for all waitEvents present', () => {
                const result = createWaitWithWaitEventReferences(waitFromFlow);
                const wait = result.elements[existingWaitGuid];

                expect(wait.waitEventReferences).toHaveLength(3);
                expect(wait.waitEventReferences[0].waitEventReference).toEqual(waitFromFlow.waitEvents[0].guid);
                expect(wait.waitEventReferences[1].waitEventReference).toEqual(waitFromFlow.waitEvents[1].guid);
                expect(wait.waitEventReferences[2].waitEventReference).toEqual(waitFromFlow.waitEvents[2].guid);
            });

            it('are included in element map for all waitEvents present', () => {
                const result = createWaitWithWaitEventReferences(waitFromFlow);

                expect(result.elements[waitFromFlow.waitEvents[0].guid]).toMatchObject(waitFromFlow.waitEvents[0]);
                expect(result.elements[waitFromFlow.waitEvents[1].guid]).toMatchObject(waitFromFlow.waitEvents[1]);
                expect(result.elements[waitFromFlow.waitEvents[2].guid]).toMatchObject(waitFromFlow.waitEvents[2]);
            });
        });
    });
    describe('createWaitMetadataObject', () => {
        let waitFromStore;

        beforeEach(() => {
            waitFromStore = {
                guid: existingWaitGuid,
                waitEventReferences: [
                    {
                        waitEventReference: 'waitEvent1'
                    },
                    {
                        waitEventReference: 'waitEvent2'
                    },
                    {
                        waitEventReference: 'waitEvent3'
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElementMetadataObject', () => {
            createWaitMetadataObject(waitFromStore);

            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(waitFromStore, {});
        });

        describe('waitEvents', () => {
            it('wait includes waitEvents for all waitEvent references present', () => {
                const wait = createWaitMetadataObject(waitFromStore);

                expect(wait.waitEvents).toHaveLength(3);
                expect(wait.waitEvents[0].guid).toEqual(foundElementGuidPrefix + waitFromStore.waitEventReferences[0].waitEventReference);
                expect(wait.waitEvents[1].guid).toEqual(foundElementGuidPrefix + waitFromStore.waitEventReferences[1].waitEventReference);
                expect(wait.waitEvents[2].guid).toEqual(foundElementGuidPrefix + waitFromStore.waitEventReferences[2].waitEventReference);
            });
        });

        describe('defaultConnectorLabel', () => {
            it('defaults to LABELS.emptyDefaultWaitPathLabel', () => {
                const wait = createWaitMetadataObject(waitFromStore);

                expect(wait.defaultConnectorLabel).toEqual(LABELS.emptyDefaultWaitPathLabel);
            });
            it('is used if passed in', () => {
                const defaultConnectorLabel = 'some label';
                waitFromStore.defaultConnectorLabel = defaultConnectorLabel;

                const wait = createWaitMetadataObject(waitFromStore);

                expect(wait.defaultConnectorLabel).toEqual(defaultConnectorLabel);
            });
        });
    });
});