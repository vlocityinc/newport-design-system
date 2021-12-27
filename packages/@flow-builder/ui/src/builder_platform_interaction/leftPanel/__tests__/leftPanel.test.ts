// @ts-nocheck
import newResourceButtonText from '@salesforce/label/FlowBuilderLeftPanel.newResourceButtonText';
import backButtonAltText from '@salesforce/label/FlowBuilderResourceDetailsPanel.backButtonAltText';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import {
    DeleteResourceEvent,
    EditElementEvent,
    PaletteItemClickedEvent,
    ShowResourceDetailsEvent
} from 'builder_platform_interaction/events';
import LeftPanel from 'builder_platform_interaction/leftPanel';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import {
    actionCallElementGuid,
    assignmentElement,
    flowWithAllElementsUIModel,
    lookupRecordAutomaticOutput,
    lookupRecordCollectionAutomaticOutput,
    lookupRecordOutputReference,
    loopOnAccountAutoOutput,
    numberVariable,
    stringConstant,
    stringVariable
} from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-left-panel', {
        is: LeftPanel
    });
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    panel: '.slds-panel',
    panelHeader: '.slds-panel__header',
    panelHeaderBackButton: 'lightning-button-icon',
    panelBody: '.slds-panel__body',
    resourceDetailsBody: 'builder_platform_interaction-resource-details',
    footer: '.panel-footer',
    footerButtons: 'lightning-button',
    addnewresource: '.new-resource-button',
    searchInput: 'lightning-input',
    leftPanelResources: 'builder_platform_interaction-left-panel-resources',
    divParentResourcesTabNewResources: 'lightning-tabset lightning-tab div.slds-p-around_small'
};

const getSectionItem = (sections, { sectionLabel, elementGuid }) => {
    let result;
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!sectionLabel || section.label === sectionLabel) {
            const count = section._children.length;
            for (let j = 0; j < count; j++) {
                const item = section._children[j];
                if (item.guid === elementGuid) {
                    result = item;
                }
            }
        }
    }
    return result;
};

describe('left-panel', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('CSS padding', () => {
        it('displays correctly the new resource padding', () => {
            const leftPanelComponent = createComponentUnderTest();
            const parentDivNewResource = leftPanelComponent.shadowRoot.querySelector(
                selectors.divParentResourcesTabNewResources
            );
            expect(parentDivNewResource).not.toBeNull();
        });
    });
    describe('element classes', () => {
        it('when in Flow Resource List view - the panel should match the transition layout classes.', async () => {
            const element = createComponentUnderTest();
            await ticks(1);
            const panel = element.shadowRoot.querySelector(selectors.panel);
            expect(panel.classList).toContain('slds-is-open');
            expect(panel.classList).not.toContain('show-details');
        });

        it('when in Flow Resource Details view - the panel header should match the transition layout classes.', async () => {
            const element = createComponentUnderTest();
            const showResourceDetailsEvent = new ShowResourceDetailsEvent(numberVariable.guid);
            element.shadowRoot
                .querySelector('builder_platform_interaction-left-panel-resources')
                .dispatchEvent(showResourceDetailsEvent);
            await ticks(1);
            const panel = element.shadowRoot.querySelector(selectors.panel);
            expect(panel.classList).toContain('slds-is-open');
            expect(panel.classList).toContain('show-details');
        });
    });

    describe('header section', () => {
        describe('element classes', () => {
            it('when in Flow Resource List view - the panel header should match the layout classes.', async () => {
                const element = createComponentUnderTest();
                await ticks(1);
                const header = element.shadowRoot.querySelector(selectors.panelHeader);
                expect(header.classList).toContain('slds-p-left_medium');
            });

            it('when in Flow Resource Details view - the panel header should match the layout classes.', async () => {
                const element = createComponentUnderTest();
                const showResourceDetailsEvent = new ShowResourceDetailsEvent(numberVariable.guid);
                element.shadowRoot
                    .querySelector('builder_platform_interaction-left-panel-resources')
                    .dispatchEvent(showResourceDetailsEvent);
                await ticks(1);
                const header = element.shadowRoot.querySelector(selectors.panelHeader);
                expect(header.classList).not.toContain('slds-p-left_medium');
            });
        });

        it('when in Flow Resource List view - should NOT have Back Button Utility Icon.', async () => {
            const element = createComponentUnderTest();
            await ticks(1);
            const backButton = element.shadowRoot.querySelector(selectors.panelHeaderBackButton);
            expect(backButton).toBeNull();
        });

        it('when in Flow Resource Details view - should have Back Button Utility Icon.', async () => {
            const element = createComponentUnderTest();
            const showResourceDetailsEvent = new ShowResourceDetailsEvent(numberVariable.guid);
            element.shadowRoot
                .querySelector('builder_platform_interaction-left-panel-resources')
                .dispatchEvent(showResourceDetailsEvent);
            await ticks(1);
            const backButton = element.shadowRoot.querySelector(selectors.panelHeaderBackButton);
            expect(backButton.iconName).toBe('utility:back');
            expect(backButton.alternativeText).toBe(backButtonAltText);
        });

        it('when in Flow Resource Details view - should handle back-button click.', async () => {
            const element = createComponentUnderTest();
            const showResourceDetailsEvent = new ShowResourceDetailsEvent(numberVariable.guid);
            element.shadowRoot
                .querySelector('builder_platform_interaction-left-panel-resources')
                .dispatchEvent(showResourceDetailsEvent);
            await ticks(2);
            const backButton = element.shadowRoot.querySelector(selectors.panelHeaderBackButton);
            backButton.click();
            await ticks(1);
            const button = element.shadowRoot.querySelector(selectors.panelHeaderBackButton);
            expect(button).toBeNull();
        });
    });

    describe('body section', () => {
        it('when in Flow Resource List view - should NOT add show-details class.', async () => {
            const element = createComponentUnderTest();
            await ticks(1);
            const leftPanel = element.shadowRoot.querySelector('.slds-panel');
            expect(leftPanel.classList).not.toContain('show-details');
        });

        it('when in Flow Resource Details view - should add show-details class.', async () => {
            const element = createComponentUnderTest();
            const showResourceDetailsEvent = new ShowResourceDetailsEvent(numberVariable.guid);
            element.shadowRoot
                .querySelector('builder_platform_interaction-left-panel-resources')
                .dispatchEvent(showResourceDetailsEvent);
            await ticks(1);
            const leftPanel = element.shadowRoot.querySelector('.slds-panel');
            expect(leftPanel.classList).toContain('show-details');
        });

        it('when in Flow Resource Details view - Flow Resource List should have class slds-hidden', async () => {
            const element = createComponentUnderTest();
            const showResourceDetailsEvent = new ShowResourceDetailsEvent(numberVariable.guid);
            element.shadowRoot
                .querySelector('builder_platform_interaction-left-panel-resources')
                .dispatchEvent(showResourceDetailsEvent);
            await ticks(1);
            const leftPanelList = element.shadowRoot.querySelector('.flow-resource-list');
            expect(leftPanelList.classList).toContain('slds-hidden');
        });

        describe('resource manager tab', () => {
            describe('New Resource BUTTON', () => {
                it('Label name should be New Resource ', () => {
                    const leftPanelComponent = createComponentUnderTest();
                    expect(leftPanelComponent.shadowRoot.querySelector(selectors.addnewresource).label).toEqual(
                        newResourceButtonText
                    );
                });
                it('fires add event when NEW RESOURCE button is clicked', async () => {
                    const leftPanelComponent = createComponentUnderTest();
                    await ticks(1);
                    const eventCallback = jest.fn();
                    leftPanelComponent.addEventListener('addnewresource', eventCallback);
                    leftPanelComponent.shadowRoot.querySelector(selectors.addnewresource).click();
                    expect(eventCallback).toHaveBeenCalled();
                });
            });
            describe('search input', () => {
                function searchMock(searchTerm) {
                    const leftPanelComponent = createComponentUnderTest();
                    const searchInput = leftPanelComponent.shadowRoot.querySelector(selectors.searchInput);
                    const changeEvent = new CustomEvent('change', {
                        detail: { value: searchTerm }
                    });
                    searchInput.dispatchEvent(changeEvent);
                    const leftPanelResources = leftPanelComponent.shadowRoot.querySelector(
                        selectors.leftPanelResources
                    );
                    return leftPanelResources;
                }
                it('should filter the resources and elements by API name', async () => {
                    const leftPanelResources = searchMock('lookup');
                    await Promise.resolve();
                    const elementsSections = leftPanelResources.canvasElements;
                    const resourceSections = leftPanelResources.nonCanvasElements;
                    expect(
                        getSectionItem(elementsSections, {
                            sectionLabel: 'FlowBuilderElementConfig.recordLookupPluralLabel',
                            elementGuid: lookupRecordAutomaticOutput.guid
                        })
                    ).toBeDefined();
                    expect(
                        getSectionItem(elementsSections, {
                            sectionLabel: 'FlowBuilderElementConfig.recordLookupPluralLabel',
                            elementGuid: lookupRecordOutputReference.guid
                        })
                    ).toBeDefined();
                    expect(
                        getSectionItem(elementsSections, {
                            sectionLabel: 'FlowBuilderElementConfig.recordLookupPluralLabel',
                            elementGuid: lookupRecordCollectionAutomaticOutput.guid
                        })
                    ).toBeDefined();
                    expect(
                        getSectionItem(elementsSections, {
                            elementGuid: actionCallElementGuid
                        })
                    ).toBeUndefined();
                    expect(
                        getSectionItem(resourceSections, {
                            sectionLabel: 'FlowBuilderElementConfig.sObjectCollectionPluralLabel',
                            elementGuid: lookupRecordCollectionAutomaticOutput.guid
                        })
                    ).toBeDefined();
                    expect(
                        getSectionItem(resourceSections, {
                            sectionLabel: 'FlowBuilderElementConfig.sObjectPluralLabel',
                            elementGuid: lookupRecordAutomaticOutput.guid
                        })
                    ).toBeDefined();
                    expect(
                        getSectionItem(resourceSections, {
                            elementGuid: numberVariable.guid
                        })
                    ).toBeUndefined();
                });
                it('should filter the resources and elements by Label', async () => {
                    const leftPanelResources = searchMock('Label');
                    await Promise.resolve();
                    const elementsSections = leftPanelResources.canvasElements;
                    const resourceSections = leftPanelResources.nonCanvasElements;
                    expect(
                        getSectionItem(elementsSections, {
                            elementGuid: assignmentElement.guid
                        })
                    ).toBeDefined();
                    expect(
                        getSectionItem(elementsSections, {
                            sectionLabel: 'FlowBuilderElementConfig.recordLookupPluralLabel',
                            elementGuid: lookupRecordAutomaticOutput.guid
                        })
                    ).toBeUndefined();
                    expect(
                        getSectionItem(resourceSections, {
                            sectionLabel: 'FlowBuilderElementConfig.sObjectCollectionPluralLabel',
                            elementGuid: lookupRecordCollectionAutomaticOutput.guid
                        })
                    ).toBeUndefined();
                });
                it('should filter the resources and elements by Description', async () => {
                    const leftPanelResources = searchMock('random description');
                    await Promise.resolve();
                    const elementsSections = leftPanelResources.canvasElements;
                    const resourceSections = leftPanelResources.nonCanvasElements;
                    expect(
                        getSectionItem(resourceSections, {
                            elementGuid: stringConstant.guid
                        })
                    ).toBeDefined();
                    expect(
                        getSectionItem(resourceSections, {
                            elementGuid: stringVariable.guid
                        })
                    ).toBeDefined();
                    expect(
                        getSectionItem(elementsSections, {
                            sectionLabel: 'FlowBuilderElementConfig.recordLookupPluralLabel',
                            elementGuid: lookupRecordAutomaticOutput.guid
                        })
                    ).toBeUndefined();
                    expect(
                        getSectionItem(resourceSections, {
                            sectionLabel: 'FlowBuilderElementConfig.sObjectCollectionPluralLabel',
                            elementGuid: lookupRecordCollectionAutomaticOutput.guid
                        })
                    ).toBeUndefined();
                });
                it('should show no results if search string is not in the flow', async () => {
                    const leftPanelResources = searchMock('definitleyNotInTheMockFlow');
                    await Promise.resolve();
                    const elementsSections = leftPanelResources.canvasElements;
                    const resourceSections = leftPanelResources.nonCanvasElements;
                    expect(elementsSections).toHaveLength(0);
                    expect(resourceSections).toHaveLength(0);
                });
            });
            it('handle Palette Item Click Event ', async () => {
                const leftPanelComponent = createComponentUnderTest();
                const eventCallback = jest.fn();
                leftPanelComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
                const type = 'VARIABLE';
                const guid = 'guid1';
                const paletteItemClickedEvent = new PaletteItemClickedEvent(type, guid);
                leftPanelComponent.shadowRoot
                    .querySelector('builder_platform_interaction-left-panel-resources')
                    .dispatchEvent(paletteItemClickedEvent);
                await ticks(1);
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        canvasElementGUID: guid,
                        elementType: type
                    }
                });
            });
        });
    });

    describe('focus', () => {
        it('focus is called on tabset when deleting a resource', async () => {
            const element = createComponentUnderTest();
            const tabset = element.shadowRoot.querySelector('lightning-tabset');
            tabset.focus = jest.fn();
            const showResourceDetailsEvent = new ShowResourceDetailsEvent(numberVariable.guid);
            element.shadowRoot
                .querySelector('builder_platform_interaction-left-panel-resources')
                .dispatchEvent(showResourceDetailsEvent);
            await ticks(1);

            const resourceDetails = element.shadowRoot.querySelector(selectors.resourceDetailsBody);
            resourceDetails.dispatchEvent(new DeleteResourceEvent(numberVariable.guid, numberVariable.elementType));
            await ticks(1);

            expect(tabset.focus).toHaveBeenCalled();
        });

        it('focus is called on tabset when deleting a loop element', async () => {
            const element = createComponentUnderTest();
            const tabset = element.shadowRoot.querySelector('lightning-tabset');
            tabset.focus = jest.fn();
            const showResourceDetailsEvent = new ShowResourceDetailsEvent(loopOnAccountAutoOutput.guid);
            element.shadowRoot
                .querySelector('builder_platform_interaction-left-panel-resources')
                .dispatchEvent(showResourceDetailsEvent);
            await ticks(1);

            const resourceDetails = element.shadowRoot.querySelector(selectors.resourceDetailsBody);
            resourceDetails.dispatchEvent(
                new DeleteResourceEvent(loopOnAccountAutoOutput.guid, loopOnAccountAutoOutput.elementType)
            );
            await ticks(1);

            expect(tabset.focus).toHaveBeenCalled();
        });
    });
});
