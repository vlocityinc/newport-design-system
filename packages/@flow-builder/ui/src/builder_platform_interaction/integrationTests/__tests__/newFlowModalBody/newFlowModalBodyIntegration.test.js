import { createElement } from 'lwc';
import NewFlowModalBody from 'builder_platform_interaction/newFlowModalBody';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { resolveRenderCycles } from '../resolveRenderCycles';
import { resetState } from '../integrationTestUtils';
import { getTemplates, initializeAuraFetch } from '../serverDataTestUtils';
import { ALL_PROCESS_TYPE } from 'builder_platform_interaction/processTypeLib';
import { processTypes } from 'serverData/GetProcessTypes/processTypes.json';
import { flowEntries } from 'serverData/GetFlowEntries/flowEntries.json';
import { templatesForFlowAndAutoLaunchedFlow } from 'serverData/GetTemplates/templatesForFlowAndAutoLaunchedFlow.json';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

const SELECTORS = {
    ERROR_MESSAGE: '.errorMessage .slds-notify__content',
    TEMPLATES_SECTION: '.templates',
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const getProcessTypesNavigationItems = modalBody => {
    return deepQuerySelector(modalBody, [
        SELECTORS.PROCESS_TYPES_NAVIGATION,
        SELECTORS.LIGHTNING_VERTICAL_NAVIGATION
    ]).querySelectorAll('lightning-vertical-navigation-item-icon');
};

const selectProcessType = (processTypesNavigationItems, processType) => {
    const searchedNode = [...processTypesNavigationItems].find(processTypeNode => processTypeNode.name === processType);

    searchedNode.dispatchEvent(
        new CustomEvent('select', {
            bubbles: true,
            composed: true,
            detail: {
                name: searchedNode.name
            }
        })
    );
};

const getProcessTypesTemplates = modalBody => modalBody.shadowRoot.querySelector(SELECTORS.PROCESS_TYPES_TEMPLATES);

const getTemplateList = (processTypeTemplates, section) =>
    processTypeTemplates.shadowRoot.querySelector(section).querySelector(SELECTORS.VISUAL_PICKER_LIST);

const getTemplateItems = templatesList => templatesList.shadowRoot.querySelectorAll(SELECTORS.VISUAL_PICKER_ITEM);

const getExploreFlowTemplateTile = processTypeTemplates =>
    processTypeTemplates.shadowRoot
        .querySelector(SELECTORS.TEMPLATES_SECTION)
        .querySelector(SELECTORS.GET_TEMPLATES_TILE);

const createComponentForTest = () => {
    const el = createElement('builder_platform_interaction-new-Flow-modal-body', { is: NewFlowModalBody });
    Object.assign(el, {
        builderType: 'FlowBuilder',
        showAll: true,
        showRecommended: true
    });
    document.body.appendChild(el);
    return el;
};

const getTemplateItemTitle = templateItem => templateItem.shadowRoot.querySelector('h2').title;

describe('new Flow Modal Body', () => {
    let newFlowModalBody;
    describe('with existing templates', () => {
        beforeAll(() => {
            Store.getStore(reducer);
            initializeAuraFetch({
                'c.getProcessTypes': () => ({
                    data: processTypes
                }),
                'c.getTemplates': getTemplates(templatesForFlowAndAutoLaunchedFlow)
            });
        });
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
        });
        afterAll(() => {
            resetState();
        });
        describe('Process Types', () => {
            it('should have "all" select by default', () => {
                return resolveRenderCycles(() => {
                    expect(newFlowModalBody.selectedProcessType).toBe('all');
                });
            });
            it('should show the correct number of process types in navigation', () => {
                const processTypesNavigationItems = getProcessTypesNavigationItems(newFlowModalBody);
                expect(processTypesNavigationItems).toHaveLength(processTypes.length + 1);
            });
            it('should show the correct number of templates in navigation', () => {
                return resolveRenderCycles(() => {
                    const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
                    const templatesTiles = getTemplateList(processTypesTemplates, SELECTORS.TEMPLATES_SECTION);
                    const templateItems = getTemplateItems(templatesTiles);
                    expect(templateItems).toHaveLength(templatesForFlowAndAutoLaunchedFlow.length + flowEntries.length);
                });
            });
            describe('select a Process Type', () => {
                it('should only display autolaunched flow templates', async () => {
                    const processTypesNavigationItems = getProcessTypesNavigationItems(newFlowModalBody);
                    selectProcessType(processTypesNavigationItems, FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
                    await Promise.resolve();
                    const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
                    const templateList = getTemplateList(processTypesTemplates, SELECTORS.TEMPLATES_SECTION);
                    const templateItems = getTemplateItems(templateList);
                    expect(templateItems).toHaveLength(5);
                    // 5 = Blanks(AutoLaunched + BeforeSave + Scheduled + FlowByValue) + 1 template

                    const templateItemTitles = Array.from(templateItems).map(templateItem =>
                        getTemplateItemTitle(templateItem)
                    );
                    expect(templateItemTitles).toContain('FTEST-TestFileBasedT');
                    expect(templateItemTitles).not.toContain('FTest-TestFileBasedScreen');
                });
                it('should only display screen flow templates', async () => {
                    const processTypesNavigationItems = getProcessTypesNavigationItems(newFlowModalBody);
                    selectProcessType(processTypesNavigationItems, FLOW_PROCESS_TYPE.FLOW);
                    await Promise.resolve();
                    const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
                    const templateList = getTemplateList(processTypesTemplates, SELECTORS.TEMPLATES_SECTION);
                    const templateItems = getTemplateItems(templateList);
                    const templateItemTitles = Array.from(templateItems).map(templateItem =>
                        getTemplateItemTitle(templateItem)
                    );
                    expect(templateItemTitles).not.toContain('FTEST-TestFileBasedT');
                    expect(templateItemTitles).toContain('FTest-TestFileBasedScreen');
                });
            });
        });
    });
    describe('without templates', () => {
        beforeAll(() => {
            initializeAuraFetch({
                'c.getProcessTypes': () => ({
                    data: processTypes
                }),
                'c.getTemplates': () => ({ data: [] })
            });
        });
        beforeEach(() => {
            newFlowModalBody = createComponentForTest();
        });
        afterAll(() => {
            resetState();
        });
        it('should display the process types templates', () => {
            return resolveRenderCycles(() => {
                const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
                expect(processTypesTemplates.processType).toEqual(ALL_PROCESS_TYPE.name);
            });
        });
        it('should display the get template tile', () => {
            return resolveRenderCycles(() => {
                const processTypesTemplates = getProcessTypesTemplates(newFlowModalBody);
                const exploreFlowTemplate = getExploreFlowTemplateTile(processTypesTemplates);
                expect(exploreFlowTemplate).not.toBeNull();
                const templatesTiles = getTemplateList(processTypesTemplates, SELECTORS.TEMPLATES_SECTION);
                const templateItems = getTemplateItems(templatesTiles);
                expect(templateItems).toHaveLength(flowEntries.length);
            });
        });
    });
});
