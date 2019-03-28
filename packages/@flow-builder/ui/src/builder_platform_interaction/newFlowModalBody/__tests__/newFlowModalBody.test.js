import { createElement } from 'lwc';
import NewFlowModalBody from 'builder_platform_interaction/newFlowModalBody';
import { ProcessTypeSelectedEvent, TemplateChangedEvent } from 'builder_platform_interaction/events';
import { ALL_PROCESS_TYPE} from 'builder_platform_interaction/processTypeLib';
import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";
import { MOCK_ALL_PROCESS_TYPES } from "mock/processTypesData";
import { MOCK_ALL_TEMPLATES, MOCK_AUTO_TEMPLATE, MOCK_SCREEN_TEMPLATE_1, MOCK_SCREEN_TEMPLATE_2 } from 'mock/templates';

const mockAllProcessTypes = {"processTypes": JSON.stringify(MOCK_ALL_PROCESS_TYPES)};

const mockProcessTypesPromise = Promise.resolve(mockAllProcessTypes);

const mockTemplatesPromise = Promise.resolve(MOCK_ALL_TEMPLATES);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = require.requireActual('../../serverDataLib/serverDataLib.js');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce : (serverActionType) => {
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

function createComponentForTest() {
    const el = createElement('builder_platform_interaction-new-flow-modal-body', { is: NewFlowModalBody });
    document.body.appendChild(el);
    return el;
}

const SELECTORS = {
    PROCESS_TYPES_NAVIGATION: 'builder_platform_interaction-process-types-vertical-navigation',
    PROCESS_TYPES_TEMPLATES: 'builder_platform_interaction-process-types-templates',
    FEATURED_SECTION: '.featured',
    TEMPLATES_SECTION: '.templates',
    VISUAL_PICKER_LIST: 'builder_platform_interaction-visual-picker-list',
    ERROR_MESSAGE: '.errorMessage .slds-notify__content',
};

const getShadowRoot = (element) => {
    return element.shadowRoot;
};

const getProcessTypesNavigation = (modalBody) => {
    return getShadowRoot(modalBody).querySelector(SELECTORS.PROCESS_TYPES_NAVIGATION);
};

const getProcessTypesTemplates = (modalBody) => {
    return getShadowRoot(modalBody).querySelector(SELECTORS.PROCESS_TYPES_TEMPLATES);
};

const getTemplates = (processTypeTemplates, section) => {
    return getShadowRoot(processTypeTemplates).querySelector(section).querySelector(SELECTORS.VISUAL_PICKER_LIST);
};

const getErrorMessage = (modalBody) => {
    return getShadowRoot(modalBody).querySelector(SELECTORS.ERROR_MESSAGE);
};

const getProcessType = (processTypeName) => MOCK_ALL_PROCESS_TYPES.find(processType => processType.name === processTypeName);

describe('new-flow-modal-body', () => {
    describe('process types navigation', () => {
        let newFlowModalBody;
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
        });

        it('shows correct number of process types in navigation', () => {
            const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
            expect(processTypesNavigation.processTypes).toHaveLength(MOCK_ALL_PROCESS_TYPES.length);
        });

        it('selects "all" as the default process type', () => {
            const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
            expect(processTypesNavigation.selectedProcessType).toEqual(ALL_PROCESS_TYPE.name);
        });

        it('should change templates when select the process type', async () => {
            const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
            processTypesNavigation.dispatchEvent(new ProcessTypeSelectedEvent(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW));
            await Promise.resolve();
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            expect(processTypesTemplates.processType).toEqual(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
            const processTypeTiles = getTemplates(processTypesTemplates, SELECTORS.FEATURED_SECTION);
            expect(processTypeTiles.items).toEqual([{"description": "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription", "iconName": "utility:magicwand", "isSelected": true, "itemId": FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW, "label": getProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW).label}]);
            const templates = getTemplates(processTypesTemplates, SELECTORS.TEMPLATES_SECTION);
            expect(templates.items).toEqual([{"description": MOCK_AUTO_TEMPLATE.Description, "iconName": "utility:magicwand", "isSelected": false, "itemId": MOCK_AUTO_TEMPLATE.EnumOrID, "label": MOCK_AUTO_TEMPLATE.Label}]);
        });
    });

    describe('process types templates', () => {
        let newFlowModalBody;
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
        });

        it('shows process types templates', () => {
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            expect(processTypesTemplates.processType).toEqual(ALL_PROCESS_TYPE.name);
        });

        it('shows 2 process type tiles: one screen and one autolaunched', () => {
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            const processTypeTiles = getTemplates(processTypesTemplates, SELECTORS.FEATURED_SECTION);
            expect(processTypeTiles.items).toEqual([{"description": "FlowBuilderProcessTypeTemplates.newFlowDescription", "iconName": "utility:desktop", "isSelected": true, "itemId": FLOW_PROCESS_TYPE.FLOW, "label": getProcessType(FLOW_PROCESS_TYPE.FLOW).label},
                {"description": "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription", "iconName": "utility:magicwand", "isSelected": false, "itemId": FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW, "label": getProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW).label}]);
        });

        it('shows 3 templates: two screens and one autolaunched', () => {
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            const templates = getTemplates(processTypesTemplates, SELECTORS.TEMPLATES_SECTION);
            expect(templates.items).toEqual([{"description": MOCK_AUTO_TEMPLATE.Description, "iconName": "utility:magicwand", "isSelected": false, "itemId": MOCK_AUTO_TEMPLATE.EnumOrID, "label": MOCK_AUTO_TEMPLATE.Label},
                {"description": MOCK_SCREEN_TEMPLATE_1.Description, "iconName": "utility:desktop", "isSelected": false, "itemId": MOCK_SCREEN_TEMPLATE_1.EnumOrID, "label": MOCK_SCREEN_TEMPLATE_1.Label},
                {"description": MOCK_SCREEN_TEMPLATE_2.Description, "iconName": "utility:desktop", "isSelected": false, "itemId": MOCK_SCREEN_TEMPLATE_2.EnumOrID, "label": MOCK_SCREEN_TEMPLATE_2.Label}]);
        });
    });

    describe('error cases', () => {
        let newFlowModalBody, errorMessage;
        const ERROR_MESSAGE = 'This is my error message';
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
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
            const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
            processTypesNavigation.dispatchEvent(new ProcessTypeSelectedEvent(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW));
            await Promise.resolve();
            errorMessage = getErrorMessage(newFlowModalBody);
            expect(errorMessage).toBeNull();
        });
        it('should reset error message when changing the template', async () => {
            newFlowModalBody.errorMessage = ERROR_MESSAGE;
            await Promise.resolve();
            const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
            processTypesTemplates.dispatchEvent(new TemplateChangedEvent(MOCK_AUTO_TEMPLATE.EnumOrId, false));
            await Promise.resolve();
            errorMessage = getErrorMessage(newFlowModalBody);
            expect(errorMessage).toBeNull();
        });
    });
});