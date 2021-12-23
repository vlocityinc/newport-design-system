// @ts-nocheck
import { getElementSections } from 'builder_platform_interaction/editorElementsUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getProcessType } from 'builder_platform_interaction/storeUtils';

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/storeLib');
    return {
        deepCopy: actual.deepCopy,
        generateGuid: jest.fn().mockImplementation(() => {
            return 'testGUID';
        })
    };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getProcessType: jest.fn()
    };
});

describe('element-lib', () => {
    beforeEach(() => {
        // Some tests override the getProcessType return value
        // so reset at the beginning of each test
        getProcessType.mockReturnValue('testProcessType');
    });

    describe('When no elements are available', () => {
        it('returns an empty list when elements is undefined', () => {
            expect(getElementSections()).toEqual([]);
        });

        it('returns an empty list when elements is null', () => {
            expect(getElementSections(null)).toEqual([]);
        });

        it('returns an empty list when elements is empty', () => {
            expect(getElementSections({})).toEqual([]);
        });
    });

    describe('When elements are available', () => {
        it('returns the expected sections list based on palette', () => {
            const unsortedElements = [
                { elementType: ELEMENT_TYPE.WAIT },
                { elementType: ELEMENT_TYPE.ASSIGNMENT },
                { elementType: ELEMENT_TYPE.SCREEN },
                { elementType: ELEMENT_TYPE.RECORD_LOOKUP },
                { elementType: ELEMENT_TYPE.RECORD_CREATE },
                { elementType: ELEMENT_TYPE.RECORD_UPDATE },
                { elementType: ELEMENT_TYPE.ACTION_CALL }
            ];

            const palette = {
                headers: [
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.quickLinksLabel',
                        headerItems: [
                            {
                                type: 'shortcut',
                                shortcutEnumName: 'RecordUpdate',
                                shortcutEnumType: 'element',
                                shortcutDescription: 'QuickLinksLabelAndDescription.recordUpdateDescription',
                                shortcutLabel: 'QuickLinksLabelAndDescription.recordUpdateLabel'
                            },
                            {
                                type: 'shortcut',
                                shortcutEnumName: 'emailAlert',
                                shortcutEnumType: 'action',
                                actionIsStandard: false,
                                shortcutDescription: 'QuickLinksLabelAndDescription.emailAlertDescription',
                                shortcutLabel: 'QuickLinksLabelAndDescription.emailAlertLabel'
                            }
                        ],
                        headerFreeformVisibility: false
                    },
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowInteractionComponentsLabel',
                        headerItems: [
                            { type: 'element', name: ELEMENT_TYPE.SCREEN },
                            { type: 'element', name: ELEMENT_TYPE.ACTION_CALL }
                        ],
                        headerFreeformVisibility: true
                    },
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowControlLogicLabel',
                        headerItems: [
                            { type: 'element', name: ELEMENT_TYPE.ASSIGNMENT },
                            { type: 'element', name: ELEMENT_TYPE.WAIT },
                            {
                                type: 'action',
                                name: 'marketingEmail',
                                actionIsStandard: true,
                                actionLabel: 'Marketing E-Mail',
                                actionDescription: 'Send an email where you specify the subject, body, and recipients'
                            }
                        ],
                        headerFreeformVisibility: true
                    },
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowControlDataOperationsLabel',
                        headerItems: [
                            { type: 'element', name: ELEMENT_TYPE.RECORD_CREATE },
                            { type: 'element', name: ELEMENT_TYPE.RECORD_UPDATE },
                            { type: 'element', name: ELEMENT_TYPE.RECORD_LOOKUP }
                        ]
                    }
                ]
            };

            expect(getElementSections(unsortedElements, palette)).toMatchSnapshot();
        });
    });

    describe('item description', () => {
        it('returns the orchestration description for process type Orchestrator', () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);

            const unsortedElements = [
                { elementType: ELEMENT_TYPE.ORCHESTRATED_STAGE },
                { elementType: ELEMENT_TYPE.DECISION },
                { name: 'SortCollectionProcessor', label: 'Collection Sort' }
            ];

            const palette = {
                headers: [
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowControlLogicLabel',
                        headerItems: [
                            { type: 'element', name: ELEMENT_TYPE.ORCHESTRATED_STAGE },
                            { type: 'element', name: ELEMENT_TYPE.DECISION }
                        ]
                    }
                ]
            };

            const items = getElementSections(unsortedElements, palette);
            const stageDescription = items[0]._children.find(
                (child) => child.elementType === ELEMENT_TYPE.ORCHESTRATED_STAGE
            ).description;
            const discisionDescription = items[0]._children.find(
                (child) => child.elementType === ELEMENT_TYPE.DECISION
            ).description;
            expect(stageDescription).toBe('FlowBuilderLeftPanelElements.orchestratedStageComponentDescription');
            expect(discisionDescription).toBe('FlowBuilderLeftPanelElements.orchestratorDecisionLogicDescription');
        });

        it('returns correct descriptions for other process types', () => {
            const unsortedElements = [
                { elementType: ELEMENT_TYPE.SCREEN },
                { elementType: ELEMENT_TYPE.DECISION },
                { name: 'SortCollectionProcessor', label: 'Collection Sort' }
            ];

            const palette = {
                headers: [
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowInteractionComponentsLabel',
                        headerItems: [{ type: 'element', name: ELEMENT_TYPE.SCREEN }]
                    },
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowControlLogicLabel',
                        headerItems: [{ type: 'element', name: ELEMENT_TYPE.DECISION }]
                    }
                ]
            };

            const items = getElementSections(unsortedElements, palette);
            const screenDescription = items[0]._children.find(
                (child) => child.elementType === ELEMENT_TYPE.SCREEN
            ).description;
            const discisionDescription = items[1]._children.find(
                (child) => child.elementType === ELEMENT_TYPE.DECISION
            ).description;
            expect(screenDescription).toBe('FlowBuilderLeftPanelElements.screenComponentDescription');
            expect(discisionDescription).toBe('FlowBuilderLeftPanelElements.decisionLogicDescription');
        });
    });
});
