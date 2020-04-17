import { getElementSections } from 'builder_platform_interaction/editorElementsUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/storeLib');
    return {
        deepCopy: actual.deepCopy,
        generateGuid: jest.fn().mockImplementation(() => {
            return 'testGUID';
        })
    };
});

describe('element-lib', () => {
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
                { elementType: ELEMENT_TYPE.ACTION_CALL },
                { type: 'marketingEmail', name: 'testAction', label: 'testActionLabel' }
            ];

            const palette = {
                headers: [
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowInteractionComponentsLabel',
                        headerItems: [
                            { type: 'element', name: ELEMENT_TYPE.SCREEN },
                            { type: 'element', name: ELEMENT_TYPE.ACTION_CALL },
                            { type: 'element', name: ELEMENT_TYPE.LOOP }
                        ]
                    },
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowControlLogicLabel',
                        headerItems: [
                            { type: 'element', name: ELEMENT_TYPE.ASSIGNMENT },
                            { type: 'element', name: ELEMENT_TYPE.WAIT },
                            { type: 'action', name: 'marketingEmail' }
                        ]
                    },
                    {
                        headerLabel: 'FlowBuilderLeftPanelElements.flowControlDataOperationsLabel',
                        headerItems: [
                            { type: 'element', name: ELEMENT_TYPE.RECORD_CREATE },
                            { type: 'element', name: ELEMENT_TYPE.RECORD_LOOKUP }
                        ]
                    }
                ]
            };

            const expectedElementSections = [
                {
                    _children: [{ elementType: ELEMENT_TYPE.SCREEN }, { elementType: ELEMENT_TYPE.ACTION_CALL }],
                    guid: 'testGUID',
                    label: 'FlowBuilderLeftPanelElements.flowInteractionComponentsLabel'
                },
                {
                    _children: [
                        { elementType: ELEMENT_TYPE.ASSIGNMENT },
                        { elementType: ELEMENT_TYPE.WAIT },
                        {
                            elementType: ELEMENT_TYPE.ACTION_CALL,
                            actionType: 'marketingEmail',
                            actionName: 'testAction'
                        }
                    ],
                    guid: 'testGUID',
                    label: 'FlowBuilderLeftPanelElements.flowControlLogicLabel'
                },
                {
                    _children: [
                        { elementType: ELEMENT_TYPE.RECORD_CREATE },
                        { elementType: ELEMENT_TYPE.RECORD_LOOKUP }
                    ],
                    guid: 'testGUID',
                    label: 'FlowBuilderLeftPanelElements.flowControlDataOperationsLabel'
                }
            ];

            expect(getElementSections(unsortedElements, palette)).toMatchObject(expectedElementSections);
        });
    });
});
