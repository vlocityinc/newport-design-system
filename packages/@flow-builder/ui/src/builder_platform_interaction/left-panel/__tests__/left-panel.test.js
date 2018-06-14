import { createElement } from 'engine';
import { EditElementEvent, DeleteElementEvent, PaletteItemClickedEvent, PaletteItemChevronClickedEvent } from 'builder_platform_interaction-events';
import LeftPanel from 'builder_platform_interaction-left-panel';

import backButtonAltText from '@label/FlowBuilderResourceDetailsPanel.backButtonAltText';
import editButtonLabel from '@label/FlowBuilderResourceDetailsPanel.editButtonLabel';
import deleteButtonLabel from '@label/FlowBuilderResourceDetailsPanel.deleteButtonLabel';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-left-panel', {
        is: LeftPanel
    });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    resourceDetailsBackButton: 'lightning-button-icon',
    panelFooter: '.panel-footer',
    panelFooterButtons: 'lightning-button',
    panelBody: '.slds-panel__body',
    resourceDetailsBody: 'builder_platform_interaction-resource-details',
    tabSetContentsBody: 'builder_platform_interaction-tabset',
    tabItems: 'builder_platform_interaction-tabitem'
};

const constants = {
    defaultActiveTabId: 'left-panel-tabitem-elements'
};

describe('left-panel', () => {
    describe('header section', () => {
        it('no back-button when showResourceDetails is false.', () => {
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const backButton = element.querySelector(selectors.resourceDetailsBackButton);
                expect(backButton).toBeNull();
            });
        });

        it('has back-button when showResourceDetails is true.', () => {
            const element = createComponentUnderTest();
            const guid = "guid1";
            const paletteItemClickedEvent = new PaletteItemChevronClickedEvent('VARIABLE', guid);
            element.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
            return Promise.resolve().then(() => {
                const backButton = element.querySelector(selectors.resourceDetailsBackButton);
                expect(backButton.iconName).toBe('utility:back');
                expect(backButton.alternativeText).toBe(backButtonAltText);
            });
        });

        it('handle back-button when showResourceDetails is true.', () => {
            const element = createComponentUnderTest();
            const guid = "guid1";
            const paletteItemClickedEvent = new PaletteItemChevronClickedEvent('VARIABLE', guid);
            element.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
            return Promise.resolve().then(() => {
                const backButton = element.querySelector(selectors.resourceDetailsBackButton);
                backButton.click();
                return Promise.resolve().then(() => {
                    const button = element.querySelector(selectors.resourceDetailsBackButton);
                    expect(button).toBeNull();
                });
            });
        });
    });

    describe('footer section', () => {
        it('no footer section when showResourceDetails is false.', () => {
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const panelFooter = element.querySelector(selectors.panelFooter);
                expect(panelFooter).toBeNull();
            });
        });

        it('should have edit-button when showResourceDetails is true.', () => {
            const element = createComponentUnderTest();
            const guid = "guid1";
            const paletteItemClickedEvent = new PaletteItemChevronClickedEvent('VARIABLE', guid);
            element.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
            return Promise.resolve().then(() => {
                const footerButtons = element.querySelectorAll(`${selectors.panelFooter} ${selectors.panelFooterButtons}`);
                expect(footerButtons[1].label).toBe(editButtonLabel);
                expect(footerButtons[1].title).toBe(editButtonLabel);
            });
        });

        it('click edit-button when showResourceDetails is true SHOULD fire EditElementEvent with outcome canvasElementGUID', () => {
            const eventCallback = jest.fn();
            const element = createComponentUnderTest();
            element.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            const guid = "guid1";
            const paletteItemClickedEvent = new PaletteItemChevronClickedEvent('VARIABLE', guid);
            element.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
            return Promise.resolve().then(() => {
                const footerButtons = element.querySelectorAll(`${selectors.panelFooter} ${selectors.panelFooterButtons}`);
                const editButtonClickedEvent = new EditElementEvent(guid);
                footerButtons[1].dispatchEvent(editButtonClickedEvent);
                return Promise.resolve().then(() => {
                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            canvasElementGUID: guid
                        }
                    });
                });
            });
        });

        it('should have delete-button when showResourceDetails is true.', () => {
            const element = createComponentUnderTest();
            const guid = "guid1";
            const paletteItemClickedEvent = new PaletteItemChevronClickedEvent('VARIABLE', guid);
            element.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
            return Promise.resolve().then(() => {
                const footerButtons = element.querySelectorAll(`${selectors.panelFooter} ${selectors.panelFooterButtons}`);
                expect(footerButtons[0].label).toBe(deleteButtonLabel);
                expect(footerButtons[0].title).toBe(deleteButtonLabel);
            });
        });

        it('click delete-button when showResourceDetails is true SHOULD fire DeleteElementEvent with outcome canvasElementGUID', () => {
            const eventCallback = jest.fn();
            const element = createComponentUnderTest();
            element.addEventListener(DeleteElementEvent.EVENT_NAME, eventCallback);
            const guid = "guid1";
            const type = "VARIABLE";
            const paletteItemClickedEvent = new PaletteItemChevronClickedEvent('VARIABLE', guid);
            element.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
            return Promise.resolve().then(() => {
                const footerButtons = element.querySelectorAll(`${selectors.panelFooter} ${selectors.panelFooterButtons}`);
                const deleteButtonClickedEvent = new DeleteElementEvent([guid], type);
                footerButtons[0].dispatchEvent(deleteButtonClickedEvent);
                return Promise.resolve().then(() => {
                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            selectedElementGUID: [guid],
                            selectedElementType: type
                        }
                    });
                });
            });
        });
    });

    describe('body section', () => {
        it('should consists of tabset element classes when showResourceDetails is false.', () => {
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const tabSetContent = element.querySelector(`${selectors.panelBody} ${selectors.tabSetContentsBody}`);
                const resourceDetailsContent = element.querySelector(`${selectors.panelBody} ${selectors.resourceDetailsBody}`);
                expect(tabSetContent.classList).toContain('slds-show');
                expect(tabSetContent.classList).toContain('slds-tabs_default');
                expect(resourceDetailsContent.classList).toContain('slds-hide');
            });
        });

        it('should consists of resource details element classes when showResourceDetails is true.', () => {
            const element = createComponentUnderTest();
            const guid = "guid1";
            const paletteItemClickedEvent = new PaletteItemChevronClickedEvent('VARIABLE', guid);
            element.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
            return Promise.resolve().then(() => {
                const tabSetContent = element.querySelector(`${selectors.panelBody} ${selectors.tabSetContentsBody}`);
                const resourceDetailsContent = element.querySelector(`${selectors.panelBody} ${selectors.resourceDetailsBody}`);
                expect(resourceDetailsContent.classList).toContain('slds-show');
                expect(tabSetContent.classList).toContain('slds-tabs_default');
                expect(tabSetContent.classList).toContain('slds-hide');
            });
        });

        it('should set the active id to tab item-elements attributes by default.', () => {
            const element = createComponentUnderTest();
            const tabItemsContent = element.querySelectorAll(selectors.tabItems);
            return Promise.resolve().then(() => {
                expect(tabItemsContent[0].activeid).toEqual(constants.defaultActiveTabId);
            });
        });
        describe('resource manage tab', () => {
            it('handle Pallete Item Chevron Click Event ', () => {
                const leftPanelComponent = createComponentUnderTest();
                const eventCallback = jest.fn();
                leftPanelComponent.addEventListener(PaletteItemChevronClickedEvent.EVENT_NAME, eventCallback);
                const type = "VARIABLE";
                const guid = "guid1";
                const name = "guid_1";
                const desc = '';
                const paletteItemChevronClickedEvent = new PaletteItemChevronClickedEvent(type, guid, name, name, desc);
                leftPanelComponent.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemChevronClickedEvent);
                return Promise.resolve().then(() => {
                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            elementType: type,
                            elementGUID: guid,
                            label: name,
                            iconName: name,
                            description: ''
                        }
                    });
                });
            });

            it('handle Pallete Item Click Event ', () => {
                const leftPanelComponent = createComponentUnderTest();
                const eventCallback = jest.fn();
                leftPanelComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
                const type = "VARIABLE";
                const guid = "guid1";
                const paletteItemClickedEvent = new PaletteItemClickedEvent(type, guid);
                leftPanelComponent.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
                return Promise.resolve().then(() => {
                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            canvasElementGUID: guid
                        }
                    });
                });
            });
        });
    });
});