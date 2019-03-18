import { createElement } from 'lwc';
import NewFlowModalBody from 'builder_platform_interaction/newFlowModalBody';
import { ProcessTypeSelectedEvent } from 'builder_platform_interaction/events';
import { ALL_PROCESS_TYPE} from 'builder_platform_interaction/processTypeLib';
import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";
import { MOCK_ALL_PROCESS_TYPES } from "mock/processTypesData";

const autoTemplate = {
    masterLabel: 'Autolaunched template',
    activeVersionId: '301xx000003Gblb',
    latestVersionId: null,
    processType: 'AutoLaunchedFlow',
    description: 'This is an autolaunched template',
};
const screenTemplateWithActiveVersion = {
    masterLabel: 'Screen template',
    activeVersionId: '301xx000005Abdh',
    latestVersionId: null,
    processType: 'Flow',
    description: 'This is a screen template',
};
const screenTemplateWithNoActiveVersion = {
    masterLabel: 'Screen template 2',
    activeVersionId: null,
    latestVersionId: '301xx000008jhgn',
    processType: 'Flow',
    description: 'This is a screen template 2',
};

const mockAllProcessTypes = {"processTypes": JSON.stringify(MOCK_ALL_PROCESS_TYPES)};

const mockProcessTypesPromise = Promise.resolve(mockAllProcessTypes);

const mockTemplates = [autoTemplate, screenTemplateWithActiveVersion, screenTemplateWithNoActiveVersion];

const mockTemplatesPromise = Promise.resolve(mockTemplates);

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

describe('new-flow-modal-body', () => {
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

    it('shows process types templates', () => {
        const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
        expect(processTypesTemplates.processType).toEqual(ALL_PROCESS_TYPE.name);
    });

    it('shows 2 process type tiles: one screen and one autolaunched', () => {
        const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
        const processTypeTiles = getTemplates(processTypesTemplates, SELECTORS.FEATURED_SECTION);
        expect(processTypeTiles.items).toEqual([{"description": "FlowBuilderProcessTypeTemplates.newFlowDescription", "iconName": "utility:desktop", "isSelected": true, "itemId": "Flow", "label": "FlowBuilderProcessTypeTemplates.newFlowTitle"},
            {"description": "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription", "iconName": "utility:magicwand", "isSelected": false, "itemId": "AutoLaunchedFlow", "label": "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowTitle"}]);
    });

    it('shows 3 templates: two screens and one autolaunched', () => {
        const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
        const templates = getTemplates(processTypesTemplates, SELECTORS.TEMPLATES_SECTION);
        expect(templates.items).toEqual([{"description": autoTemplate.description, "iconName": "utility:magicwand", "isSelected": false, "itemId": autoTemplate.activeVersionId, "label": autoTemplate.masterLabel},
            {"description": screenTemplateWithActiveVersion.description, "iconName": "utility:desktop", "isSelected": false, "itemId": screenTemplateWithActiveVersion.activeVersionId, "label": screenTemplateWithActiveVersion.masterLabel},
            {"description": screenTemplateWithNoActiveVersion.description, "iconName": "utility:desktop", "isSelected": false, "itemId": screenTemplateWithNoActiveVersion.latestVersionId, "label": screenTemplateWithNoActiveVersion.masterLabel}]);
    });

    it('should change templates when select the process type', async () => {
        const processTypesNavigation = getProcessTypesNavigation(newFlowModalBody);
        processTypesNavigation.dispatchEvent(new ProcessTypeSelectedEvent(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW));
        await Promise.resolve();
        const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
        expect(processTypesTemplates.processType).toEqual(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
        const processTypeTiles = getTemplates(processTypesTemplates, SELECTORS.FEATURED_SECTION);
        expect(processTypeTiles.items).toEqual([{"description": "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowDescription", "iconName": "utility:magicwand", "isSelected": true, "itemId": "AutoLaunchedFlow", "label": "FlowBuilderProcessTypeTemplates.newAutolaunchedFlowTitle"}]);
        const templates = getTemplates(processTypesTemplates, SELECTORS.TEMPLATES_SECTION);
        expect(templates.items).toEqual([{"description": autoTemplate.description, "iconName": "utility:magicwand", "isSelected": false, "itemId": autoTemplate.activeVersionId, "label": autoTemplate.masterLabel}]);
    });
});