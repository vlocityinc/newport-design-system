import { createElement } from 'lwc';
import ProcessTypesTemplates from 'builder_platform_interaction/processTypesTemplates';
import { TemplateChangedEvent, CannotRetrieveTemplatesEvent } from 'builder_platform_interaction/events';
import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";
import { ALL_PROCESS_TYPE, resetCacheTemplates } from 'builder_platform_interaction/processTypeLib';
import { MOCK_ALL_TEMPLATES, MOCK_AUTO_TEMPLATE, MOCK_SCREEN_TEMPLATE_1, MOCK_SCREEN_TEMPLATE_2 } from 'mock/templates';
import { MOCK_ALL_PROCESS_TYPES } from "mock/processTypesData";

let mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('../../serverDataLib/serverDataLib.js');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
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
        }),
    };
});

const commonUtils = require.requireActual('../../commonUtils/commonUtils.js');
commonUtils.format = jest.fn().mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

function createComponentForTest({ processType = ALL_PROCESS_TYPE.name } = {}) {
    const el = createElement('builder_platform_interaction-process-types-templates', { is: ProcessTypesTemplates });
    Object.assign(el, {processType});
    document.body.appendChild(el);
    return el;
}

const SELECTORS = {
    FEATURED_SECTION: '.featured',
    TEMPLATES_SECTION: '.templates',
    VISUAL_PICKER_LIST: 'builder_platform_interaction-visual-picker-list',
    VISUAL_PICKER_ITEM: 'builder_platform_interaction-visual-picker-item',
    CHECKBOX: 'input[type="checkbox"]',
};

const getVisualPickerList = (processTypeTemplates, section) => {
    const featuredSection = processTypeTemplates.shadowRoot.querySelector(section);
    return featuredSection.querySelector(SELECTORS.VISUAL_PICKER_LIST);
};

const getTemplates = (processTypeTemplates, section) => {
    const visualPickerList = getVisualPickerList(processTypeTemplates, section);
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
const getProcessType = (processTypeName) => MOCK_ALL_PROCESS_TYPES.find(processType => processType.name === processTypeName);

describe('process-type-templates', () => {
    let processTypeTemplates;
    beforeEach(() => {
        processTypeTemplates = createComponentForTest();
    });
    afterAll(() => {
        resetCacheTemplates();
    });
    it('shows 2 process type tiles: one screen and one autolaunched', () => {
        const processTypeTiles = getTemplates(processTypeTemplates, SELECTORS.FEATURED_SECTION);
        expect(processTypeTiles).toHaveLength(2);
        expect(processTypeTiles).toEqual([{"description": "FlowBuilderProcessTypeTemplates.newFlowDescription", "iconName": "utility:desktop", "isSelected": true, "itemId": FLOW_PROCESS_TYPE.FLOW, "label": getProcessType(FLOW_PROCESS_TYPE.FLOW).label},
            {"description": "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription", "iconName": "utility:magicwand", "isSelected": false, "itemId": FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW, "label": getProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW).label}]);
    });

    it('shows 3 templates: two screens and one autolaunched', () => {
        const templates = getTemplates(processTypeTemplates, SELECTORS.TEMPLATES_SECTION);
        expect(templates).toHaveLength(3);
        expect(templates).toEqual([{"description": MOCK_AUTO_TEMPLATE.Description, "iconName": "utility:magicwand", "isSelected": false, "itemId": MOCK_AUTO_TEMPLATE.EnumOrID, "label": MOCK_AUTO_TEMPLATE.Label},
            {"description": MOCK_SCREEN_TEMPLATE_1.Description, "iconName": "utility:desktop", "isSelected": false, "itemId": MOCK_SCREEN_TEMPLATE_1.EnumOrID, "label": MOCK_SCREEN_TEMPLATE_1.Label},
            {"description": MOCK_SCREEN_TEMPLATE_2.Description, "iconName": "utility:desktop", "isSelected": false, "itemId": MOCK_SCREEN_TEMPLATE_2.EnumOrID, "label": MOCK_SCREEN_TEMPLATE_2.Label}]);
    });

    it('selects template should uncheck the process type tile', async () => {
        const screenProcessTypeTile = getTemplates(processTypeTemplates, SELECTORS.FEATURED_SECTION)[0];
        expect(screenProcessTypeTile.isSelected).toBe(true);
        const visualPickerList = getVisualPickerList(processTypeTemplates, SELECTORS.TEMPLATES_SECTION);
        const template = getVisualPickerItems(visualPickerList)[0];
        const checkbox = getCheckbox(template);
        checkbox.checked = true;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(screenProcessTypeTile.isSelected).toBe(false);
    });

    it('selects the same template should keep this template checked', async () => {
        const visualPickerList = getVisualPickerList(processTypeTemplates, SELECTORS.FEATURED_SECTION);
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
        const visualPickerList = getVisualPickerList(processTypeTemplates, SELECTORS.TEMPLATES_SECTION);
        const template = getVisualPickerItems(visualPickerList)[0];
        const checkbox = getCheckbox(template);
        checkbox.checked = true;
        checkbox.dispatchEvent(getChangedEvent());
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toEqual({id: template.itemId, isProcessType: false});
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
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        document.removeEventListener(CannotRetrieveTemplatesEvent.EVENT_NAME, eventCallback);
    });
});