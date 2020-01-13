import { LABELS } from '../newFlowModalBodyLabels';
import { createElement } from 'lwc';
import NewFlowModalBody from 'builder_platform_interaction/newFlowModalBody';
import {
    ProcessTypeSelectedEvent,
    TemplateChangedEvent
} from 'builder_platform_interaction/events';
import {
    ALL_PROCESS_TYPE,
    resetCacheTemplates
} from 'builder_platform_interaction/processTypeLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MOCK_ALL_PROCESS_TYPES } from 'mock/processTypesData';
import {
    MOCK_ALL_TEMPLATES,
    MOCK_AUTO_TEMPLATE
} from 'mock/templates';
import { setProcessTypes } from 'builder_platform_interaction/systemLib';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

let mockProcessTypesPromise = Promise.resolve(MOCK_ALL_PROCESS_TYPES);
let mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual(
        'builder_platform_interaction/serverDataLib'
    );
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: serverActionType => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_PROCESS_TYPES:
                    return mockProcessTypesPromise;
                case SERVER_ACTION_TYPE.GET_TEMPLATES:
                    return mockTemplatesPromise;
                default:
                    return Promise.reject();
            }
        }
    };
});

function createComponentForTest(props) {
    const el = createElement(
        'builder_platform_interaction-new-flow-modal-body',
        { is: NewFlowModalBody }
    );
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

const getTemplatesTab = modalBody => modalBody.shadowRoot
    .querySelector('lightning-tab.templates');

const getProcessTypesNavigation = modalBody => modalBody.shadowRoot
    .querySelector('builder_platform_interaction-process-types-vertical-navigation');

const getProcessTypesTemplates = modalBody => modalBody.shadowRoot
    .querySelector('builder_platform_interaction-process-types-templates');

const getRecommended = (modalBody) => modalBody.shadowRoot
    .querySelector('lightning-tab.recommended')
    .querySelector('builder_platform_interaction-visual-picker-list');

const getTemplates = (processTypeTemplates) => processTypeTemplates.shadowRoot
    .querySelector('builder_platform_interaction-visual-picker-list');

const getErrorMessage = modalBody => modalBody.shadowRoot
    .querySelector('.errorMessage .slds-notify__content');

const getErrorClosingButton = modalBody => modalBody.shadowRoot
    .querySelector('lightning-button-icon');

const getProcessType = processTypeName =>
    MOCK_ALL_PROCESS_TYPES.find(
        processType => processType.name === processTypeName
    );

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
        it('shows correct number of process types in navigation', () => {
            const recommendedTiles = getRecommended(newFlowModalBody);
            expect(recommendedTiles.items).toEqual([
                {
                    description: "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription",
                    iconName: "utility:magicwand",
                    isSelected: true,
                    itemId: "AutoLaunchedFlow",
                    label: "Autolaunched Flow"
                },
                {
                    description:
                        'FlowBuilderProcessTypeTemplates.newFlowDescription',
                    iconName: 'utility:desktop',
                    isSelected: false,
                    itemId: FLOW_PROCESS_TYPE.FLOW,
                    label: getProcessType(FLOW_PROCESS_TYPE.FLOW).label
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
            const processTypesNavigation = getProcessTypesNavigation(
                newFlowModalBody
            );
            expect(processTypesNavigation.processTypes).toHaveLength(
                MOCK_ALL_PROCESS_TYPES.length
            );
        });

        it('selects "all" as the default process type', () => {
            const processTypesNavigation = getProcessTypesNavigation(
                newFlowModalBody
            );
            expect(processTypesNavigation.selectedProcessType).toEqual(
                ALL_PROCESS_TYPE.name
            );
        });

        it('should change templates when select the process type', async () => {
            const processTypesNavigation = getProcessTypesNavigation(
                newFlowModalBody
            );
            processTypesNavigation.dispatchEvent(
                new ProcessTypeSelectedEvent(
                    FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                )
            );
            await Promise.resolve();
            const processTypesTemplates = getProcessTypesTemplates(
                newFlowModalBody
            );
            expect(processTypesTemplates.processType).toEqual(
                FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
            );
            const templates = getTemplates(
                processTypesTemplates
            );
            expect(templates.items).toEqual([
                {
                    description:
                        'FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription',
                    iconName: 'utility:magicwand',
                    isSelected: true,
                    itemId: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                    label: getProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW)
                        .label
                },
                {
                    description: MOCK_AUTO_TEMPLATE.Description,
                    iconName: 'utility:magicwand',
                    isSelected: false,
                    itemId: MOCK_AUTO_TEMPLATE.EnumOrID,
                    label: MOCK_AUTO_TEMPLATE.Label,
                    isTemplate: true
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
            const processTypesTemplates = getProcessTypesTemplates(
                newFlowModalBody
            );
            expect(newFlowModalBody.isProcessType).toBe(true);
            expect(processTypesTemplates.processType).toEqual(
                ALL_PROCESS_TYPE.name
            );
        });

        it('shows 8 process types and 3 templates', () => {
            const processTypesTemplates = getProcessTypesTemplates(
                newFlowModalBody
            );
            const processTypeTiles = getTemplates(
                processTypesTemplates
            );
            expect(processTypeTiles.items).toEqual([
                {
                    description: "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription",
                    iconName: "utility:magicwand",
                    isSelected: true,
                    itemId: "AutoLaunchedFlow",
                    label: "Autolaunched Flow"
                },
                {
                    description:
                        'FlowBuilderProcessTypeTemplates.newFlowDescription',
                    iconName: 'utility:desktop',
                    isSelected: false,
                    itemId: FLOW_PROCESS_TYPE.FLOW,
                    label: getProcessType(FLOW_PROCESS_TYPE.FLOW).label
                },
                {
                    description: "FlowBuilderProcessTypeTemplates.newProcessTypeDescription",
                    iconName: "utility:cart",
                    isSelected: false,
                    itemId: "CheckoutFlow",
                    label: "Checkout Flow"
                },
                {
                    description: "FlowBuilderProcessTypeTemplates.newContactRequestFlowDescription",
                    iconName: "utility:contact_request",
                    isSelected: false,
                    itemId: "ContactRequestFlow",
                    label: "Contact Request Flow",
                },
                {
                    description: "FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription",
                    iconName: "utility:insert_tag_field",
                    isSelected: false,
                    itemId: "FieldServiceWeb",
                    label: "Embedded Appointment Management Flow",
                },
                {
                    description: "FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription",
                    iconName: "utility:phone_portrait",
                    isSelected: false,
                    itemId: "FieldServiceMobile",
                    label: "Field Service Mobile Flow",
                },
                {
                    description: "FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription",
                    iconName: "utility:user",
                    isSelected: false,
                    itemId: "UserProvisioningFlow",
                    label: "User Provisioning Flow",
                },
                {
                    description: "FlowBuilderProcessTypeTemplates.newProcessTypeDescription",
                    iconName: "utility:flow",
                    isSelected: false,
                    itemId: "WeDoNotKnowYou",
                    label: "Well no icon yet",
                },
                {
                    description: "This is an autolaunched template",
                    iconName: "utility:magicwand",
                    isSelected: false,
                    isTemplate: true,
                    itemId: "1",
                    label: "Autolaunched template",
                },
                {
                    description: "This is a screen template",
                    iconName: "utility:desktop",
                    isSelected: false,
                    isTemplate: true,
                    itemId: "2",
                    label: "Screen template",
                },
                {
                    description: "This is a screen template 2",
                    iconName: "utility:desktop",
                    isSelected: false,
                    isTemplate: true,
                    itemId: "3",
                    label: "Screen template 2",
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
            newFlowModalBody.errorMessage = ERROR_MESSAGE;
            await Promise.resolve();
            const processTypesNavigation = getProcessTypesNavigation(
                newFlowModalBody
            );
            processTypesNavigation.dispatchEvent(
                new ProcessTypeSelectedEvent(
                    FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                )
            );
            await Promise.resolve();
            errorMessage = getErrorMessage(newFlowModalBody);
            expect(errorMessage).toBeNull();
        });
        it('should reset error message when changing the template', async () => {
            const templatesTab = getTemplatesTab(newFlowModalBody);
            templatesTab.dispatchEvent(new CustomEvent('active'));
            newFlowModalBody.errorMessage = ERROR_MESSAGE;
            await Promise.resolve();
            const processTypesTemplates = getProcessTypesTemplates(
                newFlowModalBody
            );
            processTypesTemplates.dispatchEvent(
                new TemplateChangedEvent(MOCK_AUTO_TEMPLATE.EnumOrId, false)
            );
            await Promise.resolve();
            expect(newFlowModalBody.selectedTemplate).toBe(
                MOCK_AUTO_TEMPLATE.EnumOrId
            );
            errorMessage = getErrorMessage(newFlowModalBody);
            expect(errorMessage).toBeNull();
        });
    });
});

describe('fetch server data error cases', () => {
    let newFlowModalBody;
    describe('process types', () => {
        beforeAll(() => {
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
            resetProcessTypesCache();
        });
        it('should show process types error message', async () => {
            const errorMessage = newFlowModalBody.errorMessage;
            expect(errorMessage).toEqual(LABELS.errorLoadingProcessTypes);
        });

        it('should show process types error close button that when clicked reset errors', async () => {
            const errorClosingButton = getErrorClosingButton(newFlowModalBody);
            expect(errorClosingButton).toBeDefined();
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
            expect(errorClosingButton).toBeDefined();
            errorClosingButton.dispatchEvent(new CustomEvent('click'));
            expect(newFlowModalBody.errorMessage).toHaveLength(0);
        });
    });
});
