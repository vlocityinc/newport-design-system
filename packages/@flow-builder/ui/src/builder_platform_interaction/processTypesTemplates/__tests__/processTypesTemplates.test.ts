// @ts-nocheck
import { createElement } from 'lwc';
import ProcessTypesTemplates from 'builder_platform_interaction/processTypesTemplates';
import { TemplateChangedEvent, CannotRetrieveTemplatesEvent } from 'builder_platform_interaction/events';
import { ALL_PROCESS_TYPE, resetCacheTemplates } from 'builder_platform_interaction/processTypeLib';
import { MOCK_ALL_TEMPLATES, MOCK_AUTO_TEMPLATE, MOCK_SCREEN_TEMPLATE_1, MOCK_SCREEN_TEMPLATE_2 } from 'mock/templates';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { processTypes } from 'serverData/GetProcessTypes/processTypes.json';

let mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_TEMPLATES:
                    return mockTemplatesPromise;
                default:
                    return Promise.reject();
            }
        }
    };
});

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

function createComponentForTest({ processType = ALL_PROCESS_TYPE.name } = {}) {
    const el = createElement('builder_platform_interaction-process-types-templates', { is: ProcessTypesTemplates });
    Object.assign(el, {
        processType,
        processTypes,
        blankItems: [
            {
                label: 'process type a',
                description: 'process type a description',
                iconName: 'some:icon',
                itemId: 'abc'
            }
        ]
    });
    setDocumentBodyChildren(el);
    return el;
}

const SELECTORS = {
    TEMPLATES_SECTION: '.templates',
    VISUAL_PICKER_LIST: 'builder_platform_interaction-visual-picker-list',
    VISUAL_PICKER_ITEM: 'builder_platform_interaction-visual-picker-item',
    CHECKBOX: 'input[type="radio"]'
};

const getVisualPickerList = (processTypeTemplates) => {
    const featuredSection = processTypeTemplates.shadowRoot.querySelector(SELECTORS.TEMPLATES_SECTION);
    return featuredSection.querySelector(SELECTORS.VISUAL_PICKER_LIST);
};

const getVisualPickerListItems = (processTypeTemplates) => {
    const visualPickerList = getVisualPickerList(processTypeTemplates);
    return visualPickerList.items;
};

const getVisualPickerItems = (visualPickerList) => {
    return visualPickerList.shadowRoot.querySelectorAll(SELECTORS.VISUAL_PICKER_ITEM);
};

const getCheckbox = (visualPickerItem) => {
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
        expect(templates).toHaveLength(4); // MOCK_ALL_TEMPLATES.length
        expect(templates).toMatchObject([
            {
                itemId: 'abc',
                label: 'process type a',
                iconName: 'some:icon'
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
