import { createElement } from 'engine';
import { EditElementEvent, DeleteResourceEvent } from 'builder_platform_interaction-events';
import ResourceDetails from 'builder_platform_interaction-resource-details';

import editButtonLabel from '@label/FlowBuilderResourceDetailsPanel.editButtonLabel';
import deleteButtonLabel from '@label/FlowBuilderResourceDetailsPanel.deleteButtonLabel';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-resource-details', {
        is: ResourceDetails
    });
    const details = {
        TYPE: 'ASSIGNMENT',
        GUID: 'guid1',
        LABEL: 'label',
        ICON_NAME: 'Assignment_Icon',
        DESCRIPTION: 'Assignment_Desc',
        NAME: 'guid_1'
    };
    el.resourceDetails = details;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    footer: '.panel-footer',
    footerButtons: 'lightning-button',
};

describe('Resource Details', () => {
    it('should display Edit Button', () => {
        const element = createComponentUnderTest();
        return Promise.resolve().then(() => {
            const footerButtons = element.querySelectorAll(`${selectors.footer} ${selectors.footerButtons}`);
            expect(footerButtons[1].label).toBe(editButtonLabel);
            expect(footerButtons[1].title).toBe(editButtonLabel);
        });
    });

    it('handle edit click SHOULD fire EditElementEvent with outcome canvasElementGUID', () => {
        const eventCallback = jest.fn();
        const guid = "guid1";
        const element = createComponentUnderTest();
        element.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
        return Promise.resolve().then(() => {
            const footerButtons = element.querySelectorAll(`${selectors.footer} ${selectors.footerButtons}`);
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

    it('should display Delete Button', () => {
        const element = createComponentUnderTest();
        return Promise.resolve().then(() => {
            const footerButtons = element.querySelectorAll(`${selectors.footer} ${selectors.footerButtons}`);
            expect(footerButtons[0].label).toBe(deleteButtonLabel);
            expect(footerButtons[0].title).toBe(deleteButtonLabel);
        });
    });

    it('handle delete click SHOULD fire DeleteResourceEvent with outcome selectedElementGUID and selectedElementType', () => {
        const eventCallback = jest.fn();
        const guid = "guid1";
        const element = createComponentUnderTest();
        element.addEventListener(DeleteResourceEvent.EVENT_NAME, eventCallback);
        return Promise.resolve().then(() => {
            const footerButtons = element.querySelectorAll(`${selectors.footer} ${selectors.footerButtons}`);
            const deleteButtonClickedEvent = new DeleteResourceEvent([guid], "ASSIGNMENT");
            footerButtons[0].dispatchEvent(deleteButtonClickedEvent);
            return Promise.resolve().then(() => {
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        selectedElementGUID: [guid],
                        selectedElementType: "ASSIGNMENT"
                    }
                });
            });
        });
    });
});