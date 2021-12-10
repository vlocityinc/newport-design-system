// @ts-nocheck
import { LABELS } from '../newFlowModalBodyLabels';
import { createElement } from 'lwc';
import NewFlowModalBody from 'builder_platform_interaction/newFlowModalBody';
import { ProcessTypeSelectedEvent, TemplateChangedEvent } from 'builder_platform_interaction/events';
import { ALL_PROCESS_TYPE, resetCacheTemplates } from 'builder_platform_interaction/processTypeLib';
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MOCK_ALL_FLOW_ENTRIES } from 'mock/flowEntryData';
import { MOCK_ALL_TEMPLATES, MOCK_AUTO_TEMPLATE } from 'mock/templates';
import { setProcessTypes } from 'builder_platform_interaction/systemLib';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { processTypes } from 'serverData/GetProcessTypes/processTypes.json';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

let mockProcessTypesPromise = Promise.resolve(processTypes);
let mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);
let mockFlowEntriesPromise = Promise.resolve(MOCK_ALL_FLOW_ENTRIES);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_PROCESS_TYPES:
                    return mockProcessTypesPromise;
                case SERVER_ACTION_TYPE.GET_TEMPLATES:
                    return mockTemplatesPromise;
                case SERVER_ACTION_TYPE.GET_PROCESS_TYPE_FEATURES:
                    return Promise.resolve([]);
                case SERVER_ACTION_TYPE.GET_FLOW_ENTRIES:
                    return mockFlowEntriesPromise;
                default:
                    return Promise.reject(new Error('Unexpected server action ' + serverActionType));
            }
        }
    };
});

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-new-flow-modal-body', { is: NewFlowModalBody });
    Object.assign(el, {
        builderType: 'test_builder_type',
        showRecommended: true,
        showAll: true
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

const getProcessTypesNavigation = (modalBody) =>
    modalBody.shadowRoot.querySelector('builder_platform_interaction-process-types-vertical-navigation');

const getProcessTypesTemplates = (modalBody) =>
    modalBody.shadowRoot.querySelector('builder_platform_interaction-process-types-templates');

const getRecommended = (modalBody) =>
    modalBody.shadowRoot
        .querySelector('lightning-tab.recommended')
        .querySelector('builder_platform_interaction-visual-picker-list');

const getTemplates = (processTypeTemplates) =>
    processTypeTemplates.shadowRoot.querySelector('builder_platform_interaction-visual-picker-list');

const getProcessType = (processTypeName) => processTypes.find((processType) => processType.name === processTypeName);

const resetProcessTypesCache = () => setProcessTypes([]);

describe('new-flow-modal-body', () => {
    describe('recommended items', () => {
        let newFlowModalBody;
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
        });
        afterAll(() => {
            resetProcessTypesCache();
        });
        it('shows correct number of tiles', () => {
            const houseForSale = {
                bath: true,
                bedrooms: 4,
                kitchen: {
                    amenities: ['oven', 'stove', 'washer'],
                    area: 20,
                    wallColor: 'white'
                }
            };
            const desiredHouse = {
                bath: true,
                kitchen: {
                    amenities: ['oven', 'stove', 'washer'],
                    wallColor: expect.stringMatching(/white|yellow/)
                }
            };

            expect([houseForSale]).toMatchObject([desiredHouse]);

            const recommendedTiles = getRecommended(newFlowModalBody);
            expect(recommendedTiles.items).toMatchObject([
                {
                    description: 'Screen Flow Description',
                    iconName: 'utility:desktop',
                    itemId: FLOW_PROCESS_TYPE.FLOW,
                    label: getProcessType(FLOW_PROCESS_TYPE.FLOW).label,
                    processType: FLOW_PROCESS_TYPE.FLOW,
                    recommended: true,
                    isSelected: true
                },
                {
                    description: 'Record Changed Description',
                    iconName: 'utility:record_update',
                    itemId: 'AutoLaunchedFlow-RecordAfterSave',
                    label: 'Record Changed',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    defaultTriggerType: FLOW_TRIGGER_TYPE.AFTER_SAVE,
                    recommended: true
                },
                {
                    description: 'Scheduled Autolaunch Flow Description',
                    iconName: 'utility:clock',
                    itemId: 'AutoLaunchedFlow-Scheduled',
                    label: 'Scheduled',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    defaultTriggerType: FLOW_TRIGGER_TYPE.SCHEDULED,
                    recommended: true
                },
                {
                    description: 'Autolaunch Flow Description',
                    iconName: 'utility:magicwand',
                    itemId: 'AutoLaunchedFlow',
                    label: getProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW).label,
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    recommended: true
                },
                {
                    description: 'Flow by value entry Description',
                    iconName: 'utility:flow',
                    label: 'Flow by value entry'
                }
            ]);
        });
    });

    describe('process types navigation', () => {
        let newFlowModalBody;
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
        });
        afterAll(() => {
            resetProcessTypesCache();
        });
        it('shows correct number of process types in navigation', () => {
            const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
            expect(processTypesNavigation.processTypes).toHaveLength(processTypes.length + 1); // The +1 is for the 'All process types' option
        });

        it('selects "all" as the default process type', () => {
            const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
            expect(processTypesNavigation.selectedProcessType).toEqual(ALL_PROCESS_TYPE.name);
        });

        it('should change templates after selecting a different process type', async () => {
            const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
            processTypesNavigation.dispatchEvent(new ProcessTypeSelectedEvent(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW));
            await Promise.resolve();
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            expect(processTypesTemplates.processType).toEqual(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
            const templates = getTemplates(processTypesTemplates);
            expect(templates.items).toMatchObject([
                {
                    description: 'Record Changed Description',
                    iconName: 'utility:record_update',
                    itemId: 'AutoLaunchedFlow-RecordAfterSave',
                    label: 'Record Changed',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    defaultTriggerType: FLOW_TRIGGER_TYPE.AFTER_SAVE,
                    isSelected: true
                },
                {
                    description: 'Scheduled Autolaunch Flow Description',
                    iconName: 'utility:clock',
                    itemId: 'AutoLaunchedFlow-Scheduled',
                    label: 'Scheduled',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    defaultTriggerType: FLOW_TRIGGER_TYPE.SCHEDULED
                },
                {
                    description: 'Autolaunch Flow Description',
                    iconName: 'utility:magicwand',
                    itemId: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    label: getProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW).label,
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                },
                {
                    description: 'Flow by value entry Description'
                },
                {
                    description: MOCK_AUTO_TEMPLATE.Description,
                    iconName: 'utility:magicwand',
                    itemId: MOCK_AUTO_TEMPLATE.EnumOrID,
                    label: MOCK_AUTO_TEMPLATE.Label,
                    templateId: '1'
                }
            ]);
        });
    });

    describe('process types templates', () => {
        let newFlowModalBody;

        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
        });

        afterAll(() => {
            resetProcessTypesCache();
        });

        it('shows process types templates', () => {
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            expect(newFlowModalBody.selectedItem).toMatchObject({
                description: 'Screen Flow Description',
                iconName: 'utility:desktop',
                isSelected: true,
                itemId: 'Flow',
                label: getProcessType(FLOW_PROCESS_TYPE.FLOW).label,
                processType: FLOW_PROCESS_TYPE.FLOW
            });
            expect(processTypesTemplates.processType).toEqual(ALL_PROCESS_TYPE.name);
        });

        it('shows 8 process types and 3 templates', () => {
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            const processTypeTiles = getTemplates(processTypesTemplates);
            expect(processTypeTiles.items).toMatchObject([
                {
                    description: 'Screen Flow Description',
                    iconName: 'utility:desktop',
                    itemId: FLOW_PROCESS_TYPE.FLOW,
                    label: getProcessType(FLOW_PROCESS_TYPE.FLOW).label,
                    processType: FLOW_PROCESS_TYPE.FLOW,
                    isSelected: true
                },
                {
                    description: 'Record Changed Description',
                    iconName: 'utility:record_update',
                    itemId: 'AutoLaunchedFlow-RecordAfterSave',
                    label: 'Record Changed',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    defaultTriggerType: FLOW_TRIGGER_TYPE.AFTER_SAVE
                },
                {
                    description: 'Scheduled Autolaunch Flow Description',
                    iconName: 'utility:clock',
                    itemId: 'AutoLaunchedFlow-Scheduled',
                    label: 'Scheduled',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    defaultTriggerType: FLOW_TRIGGER_TYPE.SCHEDULED
                },
                {
                    description: 'Autolaunch Flow Description',
                    iconName: 'utility:magicwand',
                    itemId: 'AutoLaunchedFlow',
                    label: 'Autolaunched Flow',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                },
                {
                    description: 'Checkout Flow Description',
                    iconName: 'utility:cart',
                    itemId: 'CheckoutFlow',
                    label: 'Checkout Flow',
                    processType: 'CheckoutFlow'
                },
                {
                    description: 'Flow by value entry Description',
                    flow: {
                        start: {
                            triggerType: FLOW_TRIGGER_TYPE.BEFORE_SAVE
                        },
                        processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                    },
                    iconName: 'utility:flow',
                    label: 'Flow by value entry'
                },
                {
                    description: 'FlowBuilderProcessTypeTemplates.newContactRequestFlowDescription',
                    iconName: 'utility:contact_request',
                    itemId: 'ContactRequestFlow',
                    label: 'Contact Request Flow',
                    processType: 'ContactRequestFlow'
                },
                {
                    description: 'FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription',
                    iconName: 'utility:insert_tag_field',
                    itemId: 'FieldServiceWeb',
                    label: 'Embedded Appointment Management Flow',
                    processType: 'FieldServiceWeb'
                },
                {
                    description: 'FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription',
                    iconName: 'utility:phone_portrait',
                    itemId: 'FieldServiceMobile',
                    label: 'Field Service Mobile Flow',
                    processType: 'FieldServiceMobile'
                },
                {
                    description: 'FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription',
                    iconName: 'utility:user',
                    itemId: 'UserProvisioningFlow',
                    label: 'User Provisioning Flow',
                    processType: 'UserProvisioningFlow'
                },
                {
                    description: 'FlowBuilderProcessTypeTemplates.newProcessTypeDescription',
                    iconName: 'utility:flow',
                    itemId: 'WeDoNotKnowYou',
                    label: 'Well no icon yet',
                    processType: 'WeDoNotKnowYou'
                },
                {
                    description: 'This is an autolaunched template',
                    iconName: 'utility:magicwand',
                    templateId: '1',
                    itemId: '1',
                    label: 'Autolaunched template'
                },
                {
                    description: 'This is a screen template',
                    iconName: 'utility:desktop',
                    templateId: '2',
                    itemId: '2',
                    label: 'Screen template'
                },
                {
                    description: 'This is a screen template 2',
                    iconName: 'utility:desktop',
                    templateId: '3',
                    itemId: '3',
                    label: 'Screen template 2'
                }
            ]);
        });
    });
});

describe('fetch server data error cases', () => {
    let newFlowModalBody;
    describe('process types', () => {
        // Mock handler for toast event
        const handler = jest.fn();
        beforeAll(() => {
            resetProcessTypesCache();
            mockProcessTypesPromise = Promise.reject();
        });
        beforeEach(() => {
            newFlowModalBody = createComponentForTest({
                footer: {
                    disableButtons() {}
                }
            });
            // Add event listener to catch toast event
            newFlowModalBody.addEventListener(ShowToastEventName, handler);
        });
        afterAll(() => {
            mockProcessTypesPromise = Promise.resolve(processTypes);
        });
        it('should show process types error message', async () => {
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail.variant).toBe('error');
            expect(handler.mock.calls[0][0].detail.message).toEqual(LABELS.errorLoadingProcessTypes);
        });
        it('show toast event when fetching process types fail', async () => {
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail.variant).toBe('error');
        });
    });
    describe('flow entries', () => {
        // Mock handler for toast event
        const handler = jest.fn();
        beforeAll(() => {
            mockFlowEntriesPromise = Promise.reject();
        });
        beforeEach(() => {
            newFlowModalBody = createComponentForTest({
                footer: {
                    disableButtons() {}
                }
            });
            // Add event listener to catch toast event
            newFlowModalBody.addEventListener(ShowToastEventName, handler);
        });
        afterAll(() => {
            mockFlowEntriesPromise = Promise.resolve(MOCK_ALL_FLOW_ENTRIES);
        });
        it('should show flow entries error message', async () => {
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail.variant).toBe('error');
            expect(handler.mock.calls[0][0].detail.message).toEqual(LABELS.errorLoadingFlowEntries);
        });
        it('show toast event when showing flow entries fail', async () => {
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail.variant).toBe('error');
        });
    });
    describe('templates', () => {
        // Mock handler for toast event
        const handler = jest.fn();
        beforeAll(() => {
            resetCacheTemplates();
            mockTemplatesPromise = Promise.reject();
        });
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
            // Add event listener to catch toast event
            newFlowModalBody.addEventListener(ShowToastEventName, handler);
        });
        afterAll(() => {
            mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);
        });
        it('should show templates error message', async () => {
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail.variant).toBe('error');
            expect(handler.mock.calls[0][0].detail.message).toEqual(LABELS.errorLoadingTemplates);
        });
        it('show toast event when showing templates fail', async () => {
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail.variant).toBe('error');
        });
    });
});
