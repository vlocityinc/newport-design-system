import { LABELS } from '../newFlowModalBodyLabels';
import { createElement } from 'lwc';
import NewFlowModalBody from 'builder_platform_interaction/newFlowModalBody';
import { ProcessTypeSelectedEvent, TemplateChangedEvent } from 'builder_platform_interaction/events';
import { ALL_PROCESS_TYPE, resetCacheTemplates } from 'builder_platform_interaction/processTypeLib';
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MOCK_ALL_PROCESS_TYPES } from 'mock/processTypesData';
import { MOCK_ALL_FLOW_ENTRIES } from 'mock/flowEntryData';
import { MOCK_ALL_TEMPLATES, MOCK_AUTO_TEMPLATE } from 'mock/templates';
import { setProcessTypes } from 'builder_platform_interaction/systemLib';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

let mockProcessTypesPromise = Promise.resolve(MOCK_ALL_PROCESS_TYPES);
let mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);
let mockFlowEntriesPromise = Promise.resolve(MOCK_ALL_FLOW_ENTRIES);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: serverActionType => {
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
    document.body.appendChild(el);
    return el;
}

const getTemplatesTab = modalBody => modalBody.shadowRoot.querySelector('lightning-tab.templates');

const getProcessTypesNavigation = modalBody =>
    modalBody.shadowRoot.querySelector('builder_platform_interaction-process-types-vertical-navigation');

const getProcessTypesTemplates = modalBody =>
    modalBody.shadowRoot.querySelector('builder_platform_interaction-process-types-templates');

const getRecommended = modalBody =>
    modalBody.shadowRoot
        .querySelector('lightning-tab.recommended')
        .querySelector('builder_platform_interaction-visual-picker-list');

const getTemplates = processTypeTemplates =>
    processTypeTemplates.shadowRoot.querySelector('builder_platform_interaction-visual-picker-list');

const getErrorMessage = modalBody => modalBody.shadowRoot.querySelector('.errorMessage .slds-notify__content');

const getErrorClosingButton = modalBody => modalBody.shadowRoot.querySelector('lightning-button-icon');

const getProcessType = processTypeName =>
    MOCK_ALL_PROCESS_TYPES.find(processType => processType.name === processTypeName);

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
                    description: 'Before Save Description',
                    iconName: 'utility:record_update',
                    itemId: 'AutoLaunchedFlow-RecordBeforeSave',
                    label: 'Before Save',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    triggerType: FLOW_TRIGGER_TYPE.BEFORE_SAVE,
                    recommended: true
                },
                {
                    description: 'Scheduled Autolaunch Flow Description',
                    iconName: 'utility:clock',
                    itemId: 'AutoLaunchedFlow-Scheduled',
                    label: 'Scheduled',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    triggerType: FLOW_TRIGGER_TYPE.SCHEDULED,
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
            expect(processTypesNavigation.processTypes).toHaveLength(MOCK_ALL_PROCESS_TYPES.length);
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
                    description: 'Before Save Description',
                    iconName: 'utility:record_update',
                    itemId: 'AutoLaunchedFlow-RecordBeforeSave',
                    label: 'Before Save',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    triggerType: FLOW_TRIGGER_TYPE.BEFORE_SAVE,
                    isSelected: true
                },
                {
                    description: 'Scheduled Autolaunch Flow Description',
                    iconName: 'utility:clock',
                    itemId: 'AutoLaunchedFlow-Scheduled',
                    label: 'Scheduled',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    triggerType: FLOW_TRIGGER_TYPE.SCHEDULED
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
                    description: 'Before Save Description',
                    iconName: 'utility:record_update',
                    itemId: 'AutoLaunchedFlow-RecordBeforeSave',
                    label: 'Before Save',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    triggerType: FLOW_TRIGGER_TYPE.BEFORE_SAVE
                },
                {
                    description: 'Scheduled Autolaunch Flow Description',
                    iconName: 'utility:clock',
                    itemId: 'AutoLaunchedFlow-Scheduled',
                    label: 'Scheduled',
                    processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    triggerType: FLOW_TRIGGER_TYPE.SCHEDULED
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

    describe('error cases', () => {
        let newFlowModalBody, errorMessage;
        const ERROR_MESSAGE = 'This is my error message';
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
        });
        afterAll(() => {
            resetProcessTypesCache();
        });
        it('should show error message', async () => {
            newFlowModalBody.errorMessage = ERROR_MESSAGE;
            await Promise.resolve();
            errorMessage = getErrorMessage(newFlowModalBody);
            expect(errorMessage).not.toBeNull();
            expect(errorMessage.textContent).toEqual(ERROR_MESSAGE);
        });
        it('should reset error message when changing the process type', async () => {
            const templatesTab = getTemplatesTab(newFlowModalBody);
            templatesTab.dispatchEvent(new CustomEvent('active'));
            newFlowModalBody.errorMessage = ERROR_MESSAGE;
            await Promise.resolve();
            const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
            processTypesNavigation.dispatchEvent(new ProcessTypeSelectedEvent(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW));
            await Promise.resolve();
            errorMessage = getErrorMessage(newFlowModalBody);
            expect(errorMessage).toBeNull();
        });
        it('should reset error message when changing the template', async () => {
            const templatesTab = getTemplatesTab(newFlowModalBody);
            templatesTab.dispatchEvent(new CustomEvent('active'));
            newFlowModalBody.errorMessage = ERROR_MESSAGE;
            await Promise.resolve();
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            processTypesTemplates.dispatchEvent(new TemplateChangedEvent(MOCK_AUTO_TEMPLATE.EnumOrId, false));
            await Promise.resolve();
            expect(newFlowModalBody.selectedItem).toBe(MOCK_AUTO_TEMPLATE.EnumOrId);
            errorMessage = getErrorMessage(newFlowModalBody);
            expect(errorMessage).toBeNull();
        });
    });
});

describe('fetch server data error cases', () => {
    let newFlowModalBody;
    describe('process types', () => {
        beforeAll(() => {
            resetProcessTypesCache();
            mockProcessTypesPromise = Promise.reject();
        });
        beforeEach(async () => {
            newFlowModalBody = createComponentForTest({
                footer: {
                    disableButtons() {}
                }
            });
            await ticks(10);
        });
        afterAll(() => {
            mockProcessTypesPromise = Promise.resolve(MOCK_ALL_PROCESS_TYPES);
        });
        it('should show process types error message', async () => {
            const errorMessage = newFlowModalBody.errorMessage;
            expect(errorMessage).toEqual(LABELS.errorLoadingProcessTypes);
        });
        it('should show process types error close button that when clicked reset errors', async () => {
            const errorClosingButton = getErrorClosingButton(newFlowModalBody);
            expect(errorClosingButton).toBeTruthy();
            errorClosingButton.dispatchEvent(new CustomEvent('click'));
            expect(newFlowModalBody.errorMessage).toHaveLength(0);
        });
    });
    describe('flow entries', () => {
        beforeAll(() => {
            mockFlowEntriesPromise = Promise.reject();
        });
        beforeEach(async () => {
            newFlowModalBody = createComponentForTest({
                footer: {
                    disableButtons() {}
                }
            });
            await ticks(10);
        });
        afterAll(() => {
            mockFlowEntriesPromise = Promise.resolve(MOCK_ALL_FLOW_ENTRIES);
        });
        it('should show flow entries error message', async () => {
            const errorMessage = newFlowModalBody.errorMessage;
            expect(errorMessage).toEqual(LABELS.errorLoadingFlowEntries);
        });
        it('should show flow entries error close button that when clicked reset errors', async () => {
            const errorClosingButton = getErrorClosingButton(newFlowModalBody);
            expect(errorClosingButton).toBeTruthy();
            errorClosingButton.dispatchEvent(new CustomEvent('click'));
            expect(newFlowModalBody.errorMessage).toHaveLength(0);
        });
    });
    describe('templates', () => {
        beforeAll(() => {
            resetCacheTemplates();
            mockTemplatesPromise = Promise.reject();
        });
        beforeEach(async () => {
            newFlowModalBody = createComponentForTest();
            await ticks(10);
        });
        afterAll(() => {
            mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);
        });
        it('should show templates error message', async () => {
            const errorMessage = newFlowModalBody.errorMessage;
            expect(errorMessage).toEqual(LABELS.errorLoadingTemplates);
        });
        it('should show templates error close button that when clicked reset errors', async () => {
            const errorClosingButton = getErrorClosingButton(newFlowModalBody);
            expect(errorClosingButton).toBeTruthy();
            errorClosingButton.dispatchEvent(new CustomEvent('click'));
            expect(newFlowModalBody.errorMessage).toHaveLength(0);
        });
    });
});
