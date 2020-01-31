import { createElement } from 'lwc';
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import ProcessTypesTemplates from 'builder_platform_interaction/processTypesTemplates';
import { TemplateChangedEvent, CannotRetrieveTemplatesEvent } from 'builder_platform_interaction/events';
import { ALL_PROCESS_TYPE, resetCacheTemplates } from 'builder_platform_interaction/processTypeLib';
import { MOCK_ALL_TEMPLATES, MOCK_AUTO_TEMPLATE, MOCK_SCREEN_TEMPLATE_1, MOCK_SCREEN_TEMPLATE_2 } from 'mock/templates';
import { MOCK_ALL_PROCESS_TYPES } from 'mock/processTypesData';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

let mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: serverActionType => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_TEMPLATES:
                    return mockTemplatesPromise;
                default:
                    return Promise.reject();
            }
        }
    };
});

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        getProcessTypes: jest.fn().mockImplementation(() => {
            return require('mock/processTypesData').MOCK_ALL_PROCESS_TYPES;
        })
    };
});

const commonUtils = require.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

function createComponentForTest({ processType = ALL_PROCESS_TYPE.name } = {}) {
    const el = createElement('builder_platform_interaction-process-types-templates', { is: ProcessTypesTemplates });
    Object.assign(el, {
        processType,
        processTypes: MOCK_ALL_PROCESS_TYPES
    });
    document.body.appendChild(el);
    return el;
}

const SELECTORS = {
    TEMPLATES_SECTION: '.templates',
    VISUAL_PICKER_LIST: 'builder_platform_interaction-visual-picker-list',
    VISUAL_PICKER_ITEM: 'builder_platform_interaction-visual-picker-item',
    CHECKBOX: 'input[type="checkbox"]'
};

const getVisualPickerList = processTypeTemplates => {
    const featuredSection = processTypeTemplates.shadowRoot.querySelector(SELECTORS.TEMPLATES_SECTION);
    return featuredSection.querySelector(SELECTORS.VISUAL_PICKER_LIST);
};

const getVisualPickerListItems = processTypeTemplates => {
    const visualPickerList = getVisualPickerList(processTypeTemplates);
    return visualPickerList.items;
};

const getVisualPickerItems = visualPickerList => {
    return visualPickerList.shadowRoot.querySelectorAll(SELECTORS.VISUAL_PICKER_ITEM);
};

const getCheckbox = visualPickerItem => {
    return visualPickerItem.shadowRoot.querySelector(SELECTORS.CHECKBOX);
};

const getChangedEvent = () => {
    return new Event('change');
};

describe('process-type-templates', () => {
    let processTypeTemplates;
    beforeEach(() => {
        processTypeTemplates = createComponentForTest();
    });
    afterAll(() => {
        resetCacheTemplates();
    });

    it('shows 3 templates: two screens and one autolaunched', () => {
        const templates = getVisualPickerListItems(processTypeTemplates);
        expect(templates).toHaveLength(13); // MOCK_ALL_PROCESS_TYPES.length + MOCK_ALL_TEMPLATES.length + 2 (scheduled + before save)
        expect(templates).toEqual([
            {
                description: 'FlowBuilderProcessTypeTemplates.newBeforeSaveFlowDescription',
                iconName: 'utility:record_update',
                isSelected: true,
                itemId: 'AutoLaunchedFlow-RecordBeforeSave',
                label: 'FlowBuilderProcessTypeTemplates.newBeforeSaveFlowLabel',
                processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                triggerType: FLOW_TRIGGER_TYPE.BEFORE_SAVE
            },
            {
                description: 'FlowBuilderProcessTypeTemplates.newScheduledFlowDescription',
                iconName: 'utility:clock',
                itemId: 'AutoLaunchedFlow-Scheduled',
                label: 'FlowBuilderProcessTypeTemplates.newScheduledFlowLabel',
                processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
                triggerType: FLOW_TRIGGER_TYPE.SCHEDULED
            },
            {
                itemId: 'AutoLaunchedFlow',
                label: 'Autolaunched Flow',
                description: 'FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription',
                iconName: 'utility:magicwand',
                processType: FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
            },
            {
                itemId: 'Flow',
                label: 'Screen Flow',
                description: 'FlowBuilderProcessTypeTemplates.newFlowDescription',
                iconName: 'utility:desktop',
                processType: FLOW_PROCESS_TYPE.FLOW
            },
            {
                itemId: 'CheckoutFlow',
                label: 'Checkout Flow',
                description: 'FlowBuilderProcessTypeTemplates.newProcessTypeDescription(Checkout Flow)',
                iconName: 'utility:cart',
                processType: 'CheckoutFlow'
            },
            {
                itemId: 'ContactRequestFlow',
                label: 'Contact Request Flow',
                description: 'FlowBuilderProcessTypeTemplates.newContactRequestFlowDescription',
                iconName: 'utility:contact_request',
                processType: 'ContactRequestFlow'
            },
            {
                itemId: 'FieldServiceWeb',
                label: 'Embedded Appointment Management Flow',
                description: 'FlowBuilderProcessTypeTemplates.newFieldServiceWebDescription',
                iconName: 'utility:insert_tag_field',
                processType: 'FieldServiceWeb'
            },
            {
                itemId: 'FieldServiceMobile',
                label: 'Field Service Mobile Flow',
                description: 'FlowBuilderProcessTypeTemplates.newFieldServiceMobileDescription',
                iconName: 'utility:phone_portrait',
                processType: 'FieldServiceMobile'
            },
            {
                itemId: 'UserProvisioningFlow',
                label: 'User Provisioning Flow',
                description: 'FlowBuilderProcessTypeTemplates.newUserProvisioningFlowDescription',
                iconName: 'utility:user',
                processType: 'UserProvisioningFlow'
            },
            {
                itemId: 'WeDoNotKnowYou',
                label: 'Well no icon yet',
                description: 'FlowBuilderProcessTypeTemplates.newProcessTypeDescription(Well no icon yet)',
                iconName: 'utility:flow',
                processType: 'WeDoNotKnowYou'
            },
            {
                description: MOCK_AUTO_TEMPLATE.Description,
                iconName: 'utility:magicwand',
                templateId: MOCK_AUTO_TEMPLATE.EnumOrID,
                itemId: MOCK_AUTO_TEMPLATE.EnumOrID,
                label: MOCK_AUTO_TEMPLATE.Label
            },
            {
                description: MOCK_SCREEN_TEMPLATE_1.Description,
                iconName: 'utility:desktop',
                templateId: MOCK_SCREEN_TEMPLATE_1.EnumOrID,
                itemId: MOCK_SCREEN_TEMPLATE_1.EnumOrID,
                label: MOCK_SCREEN_TEMPLATE_1.Label
            },
            {
                description: MOCK_SCREEN_TEMPLATE_2.Description,
                iconName: 'utility:desktop',
                templateId: MOCK_SCREEN_TEMPLATE_2.EnumOrID,
                itemId: MOCK_SCREEN_TEMPLATE_2.EnumOrID,
                label: MOCK_SCREEN_TEMPLATE_2.Label
            }
        ]);
    });

    it('should uncheck the process type tile after selecting a template ', async () => {
        const items = getVisualPickerListItems(processTypeTemplates);
        const screenProcessTypeTile = items[0];
        expect(screenProcessTypeTile.isSelected).toBe(true);
        const visualPickerList = getVisualPickerList(processTypeTemplates);
        const template = getVisualPickerItems(visualPickerList)[1];
        const checkbox = getCheckbox(template);
        checkbox.checked = true;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(screenProcessTypeTile.isSelected).toBe(false);
    });

    it('selects the same template should keep this template checked', async () => {
        const visualPickerList = getVisualPickerList(processTypeTemplates);
        const screenProcessTypeTile = getVisualPickerItems(visualPickerList)[0];
        const checkbox = getCheckbox(screenProcessTypeTile);
        checkbox.checked = false;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(screenProcessTypeTile.isSelected).toBe(true);
    });

    it('should fire TemplateChangedEvent when checking the template', async () => {
        const eventCallback = jest.fn();
        processTypeTemplates.addEventListener(TemplateChangedEvent.EVENT_NAME, eventCallback);
        const visualPickerList = getVisualPickerList(processTypeTemplates);
        const visualPickerItems = getVisualPickerItems(visualPickerList);
        const template = visualPickerItems[visualPickerItems.length - 1];
        const checkbox = getCheckbox(template);
        checkbox.checked = true;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toEqual('3');
    });
});
describe('templates load server error', () => {
    beforeEach(() => {
        mockTemplatesPromise = Promise.reject();
        resetCacheTemplates();
    });
    afterEach(() => {
        mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);
        resetCacheTemplates();
    });
    it('should fire CannotRetrieveTemplatesEvent', async () => {
        const eventCallback = jest.fn();
        document.addEventListener(CannotRetrieveTemplatesEvent.EVENT_NAME, eventCallback);
        createComponentForTest();
        await ticks(2);
        expect(eventCallback).toHaveBeenCalled();
        document.removeEventListener(CannotRetrieveTemplatesEvent.EVENT_NAME, eventCallback);
    });
});
