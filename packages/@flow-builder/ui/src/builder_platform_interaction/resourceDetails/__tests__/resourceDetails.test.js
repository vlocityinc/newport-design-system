import { createElement } from 'lwc';
import {
    EditElementEvent,
    DeleteResourceEvent
} from 'builder_platform_interaction/events';
import ResourceDetails from 'builder_platform_interaction/resourceDetails';
import { LABELS } from '../resourceDetailsLabels';

const createComponentUnderTest = details => {
    const el = createElement('builder_platform_interaction-resource-details', {
        is: ResourceDetails
    });
    el.resourceDetails = details;
    document.body.appendChild(el);
    return el;
};

const ASSIGNMENT_DETAILS = {
    elementType: 'ASSIGNMENT',
    guid: 'guid1',
    label: 'Assignment',
    iconName: 'Assignment_Icon',
    description: 'Assignment_Desc',
    name: 'guid1',
    editable: true,
    deletable: true
};

const GETRECORD_AS_RESOURCE_DETAILS = {
    title: 'Account from myGetAccount2',
    elementType: 'RecordQuery',
    elementGuid: '9955802e-230e-44a7-a59e-f18c621678f6',
    typeLabel: 'Get Records',
    typeIconName: 'utility:sobject',
    apiName: 'myGetAccount2',
    editable: false,
    deletable: false,
    createdByElement: {
        guid: '9955802e-230e-44a7-a59e-f18c621678f6',
        label: 'myGetAccount2',
        name: 'myGetAccount2',
        elementGuidsReferenced: ['9955802e-230e-44a7-a59e-f18c621678f6'],
        iconName: 'standard:record_lookup',
        isCanvasElement: true
    },
    usedByElements: [],
    asResource: true
};

const selectors = {
    footer: '.panel-footer',
    footerButtons: 'lightning-button',
    detailsSection: '.resource-detail-panel-body',
    usedByContent: 'builder_platform_interaction-used-by-content'
};

describe('Resource Details', () => {
    describe('For elements', () => {
        it('should display Edit Button', () => {
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            return Promise.resolve().then(() => {
                const footerButtons = element.shadowRoot.querySelectorAll(
                    `${selectors.footer} ${selectors.footerButtons}`
                );
                expect(footerButtons[1].label).toBe(LABELS.editButtonLabel);
                expect(footerButtons[1].title).toBe(LABELS.editButtonLabel);
            });
        });

        it('handle edit click SHOULD fire EditElementEvent with outcome canvasElementGUID', () => {
            const eventCallback = jest.fn();
            const guid = 'guid1';
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            element.addEventListener(
                EditElementEvent.EVENT_NAME,
                eventCallback
            );
            return Promise.resolve().then(() => {
                const footerButtons = element.shadowRoot.querySelectorAll(
                    `${selectors.footer} ${selectors.footerButtons}`
                );
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
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            return Promise.resolve().then(() => {
                const footerButtons = element.shadowRoot.querySelectorAll(
                    `${selectors.footer} ${selectors.footerButtons}`
                );
                expect(footerButtons[0].label).toBe(LABELS.deleteButtonLabel);
                expect(footerButtons[0].title).toBe(LABELS.deleteButtonLabel);
            });
        });

        it('handle delete click SHOULD fire DeleteResourceEvent with outcome selectedElementGUID and selectedElementType', () => {
            const eventCallback = jest.fn();
            const guid = 'guid1';
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            element.addEventListener(
                DeleteResourceEvent.EVENT_NAME,
                eventCallback
            );
            return Promise.resolve().then(() => {
                const footerButtons = element.shadowRoot.querySelectorAll(
                    `${selectors.footer} ${selectors.footerButtons}`
                );
                const deleteButtonClickedEvent = new DeleteResourceEvent(
                    [guid],
                    'ASSIGNMENT'
                );
                footerButtons[0].dispatchEvent(deleteButtonClickedEvent);
                return Promise.resolve().then(() => {
                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({
                        detail: {
                            selectedElementGUID: [guid],
                            selectedElementType: 'ASSIGNMENT'
                        }
                    });
                });
            });
        });
    });
    describe('For GetRecord as a resource (in automatic output handling mode)', () => {
        it('should not display Edit and Delete buttons', () => {
            const element = createComponentUnderTest(
                GETRECORD_AS_RESOURCE_DETAILS
            );
            return Promise.resolve().then(() => {
                const footerButtons = element.shadowRoot.querySelectorAll(
                    `${selectors.footer} ${selectors.footerButtons}`
                );
                expect(footerButtons).toHaveLength(0);
            });
        });
        it('should display the element that created the automatic output', () => {
            const element = createComponentUnderTest(
                GETRECORD_AS_RESOURCE_DETAILS
            );
            return Promise.resolve().then(() => {
                const createdBy = element.shadowRoot.querySelector(
                    selectors.usedByContent
                );
                expect(createdBy).toBeDefined();
                expect(createdBy.listSectionHeader).toBe(
                    'FlowBuilderResourceDetailsPanel.createdByText'
                );
                expect(createdBy.listSectionItems).toEqual([
                    GETRECORD_AS_RESOURCE_DETAILS.createdByElement
                ]);
            });
        });
    });
});
