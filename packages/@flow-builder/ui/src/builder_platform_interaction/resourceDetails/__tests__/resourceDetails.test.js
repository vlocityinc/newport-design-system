import { createElement } from 'lwc';
import {
    EditElementEvent,
    DeleteResourceEvent
} from 'builder_platform_interaction/events';
import ResourceDetails from 'builder_platform_interaction/resourceDetails';
import {
    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails,
    mockGetRecordsAutomaticOutputModeResourceDetails,
    mockExtensionScreenfieldNotInAutomaticOutputsModeResourceDetails,
    mockAccountRecordVariable
} from 'mock/resourceDetailsData';
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

const SELECTORS = {
    footerButtons: '.panel-footer lightning-button',
    detailsSection: '.resource-detail-panel-body',
    usedBySection: '.test-used-by-section',
    createdBySection: '.test-created-by-section',
    createdByList: 'builder_platform_interaction-used-by-content',
    usedByList: 'builder_platform_interaction-used-by-content',
    resourceDetailsParameters:
        'builder_platform_interaction-resource-details-parameters'
};

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

describe('Resource Details', () => {
    describe('For elements', () => {
        it('should display Edit Button', () => {
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            const footerButtons = element.shadowRoot.querySelectorAll(
                SELECTORS.footerButtons
            );
            expect(footerButtons[1].label).toBe(LABELS.editButtonLabel);
            expect(footerButtons[1].title).toBe(LABELS.editButtonLabel);
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
                    SELECTORS.footerButtons
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
            const footerButtons = element.shadowRoot.querySelectorAll(
                SELECTORS.footerButtons
            );
            expect(footerButtons[0].label).toBe(LABELS.deleteButtonLabel);
            expect(footerButtons[0].title).toBe(LABELS.deleteButtonLabel);
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
                    SELECTORS.footerButtons
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
    describe("'Resource in automatic output handling mode", () => {
        describe('"GetRecords" as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockGetRecordsAutomaticOutputModeResourceDetails
                );
            });
            it('should not display Edit and Delete buttons', () => {
                const footerButtons = resourceDetailsComponent.shadowRoot.querySelectorAll(
                    SELECTORS.footerButtons
                );
                expect(footerButtons).toHaveLength(0);
            });
            it('should display the element that created the automatic output (createdBy section) with correct title and list elements', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.createdBySection
                );
                expect(createdBySection).toBeDefined();
                const createdByList = createdBySection.querySelector(
                    SELECTORS.createdByList
                );
                expect(createdByList.listSectionHeader).toBe(
                    'FlowBuilderResourceDetailsPanel.createdByText'
                );
                expect(createdByList.listSectionItems).toEqual([
                    mockGetRecordsAutomaticOutputModeResourceDetails.createdByElement
                ]);
                expect(resourceDetailsComponent.createdByElements).toEqual([
                    mockGetRecordsAutomaticOutputModeResourceDetails.createdByElement
                ]);
            });
            it('should not display "Parameters" section (element type not supported)', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
        });
        describe('Extension (ie: lightning component) screenfield as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails
                );
            });

            it('should not display "Edit" and "Delete" buttons', () => {
                const footerButtons = resourceDetailsComponent.shadowRoot.querySelectorAll(
                    SELECTORS.footerButtons
                );
                expect(footerButtons).toHaveLength(0);
            });
            it('should display the element that created the automatic output (createdBy section) with correct title and list elements', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.createdBySection
                );
                expect(createdBySection).toBeDefined();
                const createdByList = createdBySection.querySelector(
                    SELECTORS.createdByList
                );
                expect(createdByList.listSectionHeader).toBe(
                    'FlowBuilderResourceDetailsPanel.createdByText'
                );
                expect(createdByList.listSectionItems).toEqual([
                    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails.createdByElement
                ]);
                expect(resourceDetailsComponent.createdByElements).toEqual([
                    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails.createdByElement
                ]);
            });
            it('should display "Parameters" section (element type supported)', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).not.toBeNull();
            });
        });
    });
    describe("'Resource NOT in automatic output handling mode", () => {
        let resourceDetailsComponent;
        describe('"GetRecords" as a resource', () => {
            it('should NOT display "Parameters" section (element type that supports automatic output mode but "storeOutputAutomatically: false")', () => {
                resourceDetailsComponent = createComponentUnderTest(
                    Object.assign(
                        mockGetRecordsAutomaticOutputModeResourceDetails,
                        { storeOutputAutomatically: false }
                    )
                );
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
        });
        describe('Extension (ie: lightning component) screenfield as a resource', () => {
            beforeAll(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockExtensionScreenfieldNotInAutomaticOutputsModeResourceDetails
                );
            });
            it('should NOT display "Parameters" section (element type that supports automatic output mode but "storeOutputAutomatically: false")', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
        });
        describe('"Account record variable as a resource', () => {
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockAccountRecordVariable
                );
            });
            it('should NOT display "Parameters" section (element type that does not supports automatic output mode - "storeOutputAutomatically: undefined")', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
            it('should NOT display the element that created the automatic output (createdBy section)', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.createdBySection
                );
                expect(createdBySection).toBeDefined();
                expect(resourceDetailsComponent.createdByElements).toHaveLength(
                    0
                );
            });
        });
    });
});
