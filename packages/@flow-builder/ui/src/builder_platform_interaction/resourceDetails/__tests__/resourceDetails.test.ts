// @ts-nocheck
import { clickEvent, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { DeleteResourceEvent, EditElementEvent } from 'builder_platform_interaction/events';
import ResourceDetails from 'builder_platform_interaction/resourceDetails';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { createElement } from 'lwc';
import {
    mockAccountRecordVariable,
    mockActionSubmitForApprovalAutomaticOutputsModeResourceDetails,
    mockActionSubmitForApprovalNotInAutomaticOutputsModeResourceDetails,
    mockApexActionInAutomaticOutputsModeAnonymousStringResourceDetails,
    mockApexActionInAutomaticOutputsModeResourceDetails,
    mockApexActionNotInAutomaticOutputsModeResourceDetails,
    mockCreateRecordAutomaticOutputModeResourceDetails,
    mockCreateRecordNotInAutomaticOutputModeResourceDetails,
    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails,
    mockExtensionScreenfieldNotInAutomaticOutputsModeResourceDetails,
    mockGetRecordsAutomaticOutputModeResourceDetails,
    mockLoopOnApexTypeInAutomaticOutputModeResourceDetails,
    mockLoopOnSObjectInAutomaticOutputModeResourceDetails,
    mockLoopOnTextInAutomaticOutputModeResourceDetails,
    mockSubflowInAutomaticOutputModeResourceDetails
} from 'mock/resourceDetailsData';
import { LABELS } from '../resourceDetailsLabels';

const { logInteraction } = loggingUtils;

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    const actions = jest.requireActual('builder_platform_interaction/sharedUtils/actionUtils');
    return Object.assign({}, sharedUtils, { actionUtils: actions });
});

const createComponentUnderTest = (details) => {
    const el = createElement('builder_platform_interaction-resource-details', {
        is: ResourceDetails
    });
    el.resourceDetails = details;
    setDocumentBodyChildren(el);
    return el;
};

const ASSIGNMENT_DETAILS = {
    elementType: 'ASSIGNMENT',
    elementGuid: 'guid1',
    label: 'Assignment',
    iconName: 'Assignment_Icon',
    description: 'Assignment_Desc',
    name: 'guid1',
    editable: true,
    deletable: true,
    usedByElements: [
        {
            guid: 'used-by-guid',
            label: 'used-by-label',
            name: 'used-by-name',
            elementGuidsReferenced: [],
            iconName: 'standard:iconName',
            isCanvasElement: true
        }
    ],
    storeOutputAutomatically: undefined,
    title: 'assign1',
    typeIconName: undefined,
    typeLabel: 'Assignment'
};

const SELECTORS = {
    footerButtons: '.panel-footer lightning-button',
    editButton: '.panel-footer lightning-button.editbutton',
    detailsSection: '.resource-detail-panel-body',
    usedBySection: '.test-used-by-section',
    createdBySection: '.test-created-by-section',
    createdByList: 'builder_platform_interaction-used-by-content',
    usedByList: 'builder_platform_interaction-used-by-content',
    resourceDetailsParameters: 'builder_platform_interaction-resource-details-parameters',
    detailsSectionLi: '.resource-detail-panel-body li'
};

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const getApiNameLineTextContent = (resourceDetailsComponent) =>
    Array.from(resourceDetailsComponent.shadowRoot.querySelectorAll(SELECTORS.detailsSectionLi))
        .map((li) => li.textContent)
        .find((textContent) => textContent && textContent.includes('uniqueName'));

describe('Resource Details', () => {
    describe('For elements', () => {
        it('Should display usage section', () => {
            const resourceDetailsComponent = createComponentUnderTest(ASSIGNMENT_DETAILS);
            const usedByList = resourceDetailsComponent.shadowRoot.querySelector(
                `${SELECTORS.usedBySection} ${SELECTORS.usedByList}`
            );
            expect(usedByList).toBeDefined();
            expect(usedByList.showLocatorIcon).toBeTruthy();
        });
        it('should display Edit Button', () => {
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            const editBtn = element.shadowRoot.querySelector(SELECTORS.editButton);
            expect(editBtn.label).toBe(LABELS.editButtonLabel);
            expect(editBtn.title).toBe(LABELS.editButtonLabel);
        });
        it('handle edit click and check call to logging made', async () => {
            const eventCallback = jest.fn();
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            element.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            element.shadowRoot.querySelectorAll(SELECTORS.footerButtons)[1].dispatchEvent(new CustomEvent('click'));
            await Promise.resolve();
            expect(eventCallback).toHaveBeenCalled();
            expect(logInteraction).toHaveBeenCalled();
        });
        it('handle delete click and check call to logging made', async () => {
            const eventCallback = jest.fn();
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            element.addEventListener(DeleteResourceEvent.EVENT_NAME, eventCallback);
            element.shadowRoot.querySelectorAll(SELECTORS.footerButtons)[0].dispatchEvent(new CustomEvent('click'));
            await Promise.resolve();
            expect(eventCallback).toHaveBeenCalled();
            expect(logInteraction).toHaveBeenCalled();
        });
        it('handle edit click SHOULD fire EditElementEvent with outcome canvasElementGUID and element type', async () => {
            const eventCallback = jest.fn();
            const guid = ASSIGNMENT_DETAILS.elementGuid;
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            element.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);
            await ticks(2);
            const editButton = element.shadowRoot.querySelector(SELECTORS.editButton);
            editButton.dispatchEvent(clickEvent());
            await ticks(1);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
                canvasElementGUID: guid,
                elementType: ASSIGNMENT_DETAILS.elementType
            });
        });

        it('should display Delete Button', () => {
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            const footerButtons = element.shadowRoot.querySelectorAll(SELECTORS.footerButtons);
            expect(footerButtons[0].label).toBe(LABELS.deleteButtonLabel);
            expect(footerButtons[0].title).toBe(LABELS.deleteButtonLabel);
        });
        it('handle delete click SHOULD fire DeleteResourceEvent with outcome selectedElementGUID and selectedElementType', async () => {
            const eventCallback = jest.fn();
            const guid = 'guid1';
            const element = createComponentUnderTest(ASSIGNMENT_DETAILS);
            element.addEventListener(DeleteResourceEvent.EVENT_NAME, eventCallback);
            await ticks(2);
            const footerButtons = element.shadowRoot.querySelectorAll(SELECTORS.footerButtons);
            const deleteButtonClickedEvent = new DeleteResourceEvent([guid], 'ASSIGNMENT');
            footerButtons[0].dispatchEvent(deleteButtonClickedEvent);
            await ticks(1);
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    selectedElementGUID: [guid],
                    selectedElementType: 'ASSIGNMENT'
                }
            });
        });
    });
    describe("'Resource in automatic output handling mode", () => {
        describe('"Get Records" as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(mockGetRecordsAutomaticOutputModeResourceDetails);
            });
            it('should not display Edit and Delete buttons', () => {
                const footerButtons = resourceDetailsComponent.shadowRoot.querySelectorAll(SELECTORS.footerButtons);
                expect(footerButtons).toHaveLength(0);
            });
            it('should display the element that created the automatic output (createdBy section) with correct title and list elements', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(SELECTORS.createdBySection);
                expect(createdBySection).toBeDefined();
                const createdByList = createdBySection.querySelector(SELECTORS.createdByList);
                expect(createdByList.listSectionHeader).toBe('FlowBuilderResourceDetailsPanel.createdByText');
                expect(createdByList.listSectionItems).toEqual([
                    mockGetRecordsAutomaticOutputModeResourceDetails.createdByElement
                ]);
                expect(createdByList.showLocatorIcon).toBeTruthy();
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
            it('should not display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);

                expect(apiName).not.toBeDefined();
            });
        });
        describe('"Loop" as a resource', () => {
            const allMockLoopResourceDetails = new Map([
                [mockLoopOnSObjectInAutomaticOutputModeResourceDetails, 'SObject'],
                [mockLoopOnTextInAutomaticOutputModeResourceDetails, 'Text'],
                [mockLoopOnApexTypeInAutomaticOutputModeResourceDetails, 'Apex Type']
            ]);
            for (const [mockLoopResourceDetails, loopOnWhatTypeDesc] of allMockLoopResourceDetails) {
                describe(`On ${loopOnWhatTypeDesc} collection`, () => {
                    const resourceDetailsComponent = createComponentUnderTest(mockLoopResourceDetails);
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
                        const createdByList = createdBySection.querySelector(SELECTORS.createdByList);
                        expect(createdByList.listSectionHeader).toBe('FlowBuilderResourceDetailsPanel.createdByText');
                        expect(createdByList.listSectionItems).toEqual([mockLoopResourceDetails.createdByElement]);
                        expect(createdByList.showLocatorIcon).toBeTruthy();
                        expect(resourceDetailsComponent.createdByElements).toEqual([
                            mockLoopResourceDetails.createdByElement
                        ]);
                    });
                    it('should not display "Parameters" section (element type not supported)', () => {
                        const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                            SELECTORS.resourceDetailsParameters
                        );
                        expect(resourceDetailsParametersComponent).toBeNull();
                    });
                    it('should display API Name', () => {
                        const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                        expect(apiName).toContain(mockLoopResourceDetails.apiName);
                    });
                });
            }
        });
        describe('Extension (ie: lightning component) screenfield as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails
                );
            });

            it('should not display "Edit" and "Delete" buttons', () => {
                const footerButtons = resourceDetailsComponent.shadowRoot.querySelectorAll(SELECTORS.footerButtons);
                expect(footerButtons).toHaveLength(0);
            });
            it('should display the element that created the automatic output (createdBy section) with correct title and list elements', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(SELECTORS.createdBySection);
                expect(createdBySection).toBeDefined();
                const createdByList = createdBySection.querySelector(SELECTORS.createdByList);
                expect(createdByList.listSectionHeader).toBe('FlowBuilderResourceDetailsPanel.createdByText');
                expect(createdByList.listSectionItems).toEqual([
                    mockExtensionScreenfieldAutomaticOutputsModeResourceDetails.createdByElement
                ]);
                expect(createdByList.showLocatorIcon).toBeTruthy();
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
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);

                expect(apiName).toContain('email1');
            });
        });
        describe('Action (core action - submit for approval) as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockActionSubmitForApprovalAutomaticOutputsModeResourceDetails
                );
            });

            it('should not display "Edit" and "Delete" buttons', () => {
                const footerButtons = resourceDetailsComponent.shadowRoot.querySelectorAll(SELECTORS.footerButtons);
                expect(footerButtons).toHaveLength(0);
            });
            it('should display the element that created the automatic output (createdBy section) with correct title and list elements', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(SELECTORS.createdBySection);
                expect(createdBySection).toBeDefined();
                const createdByList = createdBySection.querySelector(SELECTORS.createdByList);
                expect(createdByList.listSectionHeader).toBe('FlowBuilderResourceDetailsPanel.createdByText');
                expect(createdByList.listSectionItems).toEqual([
                    mockActionSubmitForApprovalAutomaticOutputsModeResourceDetails.createdByElement
                ]);
                expect(createdByList.showLocatorIcon).toBeTruthy();
                expect(resourceDetailsComponent.createdByElements).toEqual([
                    mockActionSubmitForApprovalAutomaticOutputsModeResourceDetails.createdByElement
                ]);
            });
            it('should display "Parameters" section (element type supported)', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).not.toBeNull();
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);

                expect(apiName).toContain('actionCallAutomaticOutput');
            });
        });
        describe('Action (Apex action) as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockApexActionInAutomaticOutputsModeResourceDetails
                );
            });

            it('should not display "Edit" and "Delete" buttons', () => {
                const footerButtons = resourceDetailsComponent.shadowRoot.querySelectorAll(SELECTORS.footerButtons);
                expect(footerButtons).toHaveLength(0);
            });
            it('should display the element that created the automatic output (createdBy section) with correct title and list elements', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(SELECTORS.createdBySection);
                expect(createdBySection).toBeDefined();
                const createdByList = createdBySection.querySelector(SELECTORS.createdByList);
                expect(createdByList.listSectionHeader).toBe('FlowBuilderResourceDetailsPanel.createdByText');
                expect(createdByList.listSectionItems).toEqual([
                    mockApexActionInAutomaticOutputsModeResourceDetails.createdByElement
                ]);
                expect(createdByList.showLocatorIcon).toBeTruthy();
                expect(resourceDetailsComponent.createdByElements).toEqual([
                    mockApexActionInAutomaticOutputsModeResourceDetails.createdByElement
                ]);
            });
            it('should display "Parameters" section (element type supported)', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).not.toBeNull();
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);

                expect(apiName).toContain('apex_action1');
            });
        });
        describe('Action (Apex action) with anonymous output as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockApexActionInAutomaticOutputsModeAnonymousStringResourceDetails
                );
            });
            it('should not display "Parameters" section (element type supported)', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
        });
        describe('"Create Record" as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(mockCreateRecordAutomaticOutputModeResourceDetails);
            });
            it('should not display Edit and Delete buttons', () => {
                const footerButtons = resourceDetailsComponent.shadowRoot.querySelectorAll(SELECTORS.footerButtons);
                expect(footerButtons).toHaveLength(0);
            });
            it('should display the element that created the automatic output (createdBy section) with correct title and list elements', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(SELECTORS.createdBySection);
                expect(createdBySection).toBeDefined();
                const createdByList = createdBySection.querySelector(SELECTORS.createdByList);
                expect(createdByList.listSectionHeader).toBe('FlowBuilderResourceDetailsPanel.createdByText');
                expect(createdByList.listSectionItems).toEqual([
                    mockCreateRecordAutomaticOutputModeResourceDetails.createdByElement
                ]);
                expect(createdByList.showLocatorIcon).toBeTruthy();
                expect(resourceDetailsComponent.createdByElements).toEqual([
                    mockCreateRecordAutomaticOutputModeResourceDetails.createdByElement
                ]);
            });
            it('should not display "Parameters" section (element type not supported)', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
            it('should not display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);

                expect(apiName).not.toBeDefined();
            });
        });
        describe('Subflow as a resource', () => {
            let resourceDetailsComponent;
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(mockSubflowInAutomaticOutputModeResourceDetails);
            });
            it('should not display Edit and Delete buttons', () => {
                const footerButtons = resourceDetailsComponent.shadowRoot.querySelectorAll(SELECTORS.footerButtons);
                expect(footerButtons).toHaveLength(0);
            });
            it('should display the element that created the automatic output (createdBy section) with correct title and list elements', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(SELECTORS.createdBySection);
                expect(createdBySection).toBeDefined();
                const createdByList = createdBySection.querySelector(SELECTORS.createdByList);
                expect(createdByList.listSectionHeader).toBe('FlowBuilderResourceDetailsPanel.createdByText');
                expect(createdByList.listSectionItems).toEqual([
                    mockSubflowInAutomaticOutputModeResourceDetails.createdByElement
                ]);
                expect(createdByList.showLocatorIcon).toBeTruthy();
                expect(resourceDetailsComponent.createdByElements).toEqual([
                    mockSubflowInAutomaticOutputModeResourceDetails.createdByElement
                ]);
            });
            it('should display "Parameters" section (element type supported)', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).not.toBeNull();
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                expect(apiName).toContain(mockSubflowInAutomaticOutputModeResourceDetails.apiName);
            });
        });
    });
    describe("'Resource NOT in automatic output handling mode", () => {
        let resourceDetailsComponent;
        describe('"Get Records" as a resource', () => {
            it('should NOT display "Parameters" section (element type that supports automatic output mode but "storeOutputAutomatically: false")', () => {
                resourceDetailsComponent = createComponentUnderTest(
                    Object.assign(mockGetRecordsAutomaticOutputModeResourceDetails, { storeOutputAutomatically: false })
                );
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                expect(apiName).toContain(mockGetRecordsAutomaticOutputModeResourceDetails.apiName);
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
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                expect(apiName).toContain(mockExtensionScreenfieldNotInAutomaticOutputsModeResourceDetails.apiName);
            });
        });
        describe('Action (core action - submit for approval) as a resource', () => {
            beforeAll(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockActionSubmitForApprovalNotInAutomaticOutputsModeResourceDetails
                );
            });
            it('should NOT display "Parameters" section (element type that supports automatic output mode but "storeOutputAutomatically: false")', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                expect(apiName).toContain(mockActionSubmitForApprovalNotInAutomaticOutputsModeResourceDetails.apiName);
            });
        });
        describe('Action (Apex action) as a resource', () => {
            beforeAll(() => {
                resourceDetailsComponent = createComponentUnderTest(
                    mockApexActionNotInAutomaticOutputsModeResourceDetails
                );
            });
            it('should NOT display "Parameters" section (element type that supports automatic output mode but "storeOutputAutomatically: false")', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                expect(apiName).toContain(mockApexActionNotInAutomaticOutputsModeResourceDetails.apiName);
            });
        });
        describe('"Account record variable as a resource', () => {
            beforeEach(() => {
                resourceDetailsComponent = createComponentUnderTest(mockAccountRecordVariable);
            });
            it('should NOT display "Parameters" section (element type that does not supports automatic output mode - "storeOutputAutomatically: undefined")', () => {
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
            it('should NOT display the element that created the automatic output (createdBy section)', () => {
                const createdBySection = resourceDetailsComponent.shadowRoot.querySelector(SELECTORS.createdBySection);
                expect(createdBySection).toBeDefined();
                expect(resourceDetailsComponent.createdByElements).toHaveLength(0);
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                expect(apiName).toContain('vAccount');
            });
        });
        describe('"Create Record" as a resource', () => {
            it('should NOT display "Parameters" section (element type that supports automatic output mode but "storeOutputAutomatically: false")', () => {
                resourceDetailsComponent = createComponentUnderTest(
                    Object.assign(mockCreateRecordNotInAutomaticOutputModeResourceDetails, {
                        storeOutputAutomatically: false
                    })
                );
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                expect(apiName).toContain(mockCreateRecordNotInAutomaticOutputModeResourceDetails.apiName);
            });
        });
        describe('Subflow as a resource', () => {
            it('should NOT display "Parameters" section (element type that supports automatic output mode but "storeOutputAutomatically: false")', () => {
                resourceDetailsComponent = createComponentUnderTest(
                    Object.assign(mockSubflowInAutomaticOutputModeResourceDetails, {
                        storeOutputAutomatically: false
                    })
                );
                const resourceDetailsParametersComponent = resourceDetailsComponent.shadowRoot.querySelector(
                    SELECTORS.resourceDetailsParameters
                );
                expect(resourceDetailsParametersComponent).toBeNull();
            });
            it('should display API Name', () => {
                const apiName = getApiNameLineTextContent(resourceDetailsComponent);
                expect(apiName).toContain(mockSubflowInAutomaticOutputModeResourceDetails.apiName);
            });
        });
    });
});
