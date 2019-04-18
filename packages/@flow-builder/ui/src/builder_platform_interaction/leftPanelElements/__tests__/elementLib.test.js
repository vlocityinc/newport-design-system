import { getElementSections } from "../elementLib";
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => {
    const actual = require.requireActual('../../storeLib/storeLib.js');
    return {
        deepCopy: actual.deepCopy,
        generateGuid: jest.fn().mockImplementation(() => {
            return "testGUID";
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
        it('returns the expected sections list based on custom ordering when receive child element list', () => {
            const unsortedElements = [
                {"elementType": ELEMENT_TYPE.WAIT}, {"elementType": ELEMENT_TYPE.ASSIGNMENT}, {"elementType": ELEMENT_TYPE.SCREEN},
                {"elementType": ELEMENT_TYPE.RECORD_LOOKUP}, {"elementType": ELEMENT_TYPE.RECORD_CREATE}, {"elementType": ELEMENT_TYPE.ACTION_CALL}
            ];

            const expectedElementSections = [
                {"_children":
                    [{"elementType": ELEMENT_TYPE.SCREEN}, {"elementType": ELEMENT_TYPE.ACTION_CALL}],
                    "guid": "testGUID",
                    "label": "FlowBuilderLeftPanelElements.flowInteractionComponentsLabel"
                },
                {"_children":
                    [{"elementType": ELEMENT_TYPE.ASSIGNMENT}, {"elementType": ELEMENT_TYPE.WAIT}],
                    "guid": "testGUID",
                    "label": "FlowBuilderLeftPanelElements.flowControlLogicLabel"
                },
                {"_children":
                    [{"elementType": ELEMENT_TYPE.RECORD_CREATE}, {"elementType": ELEMENT_TYPE.RECORD_LOOKUP}],
                    "guid": "testGUID",
                    "label": "FlowBuilderLeftPanelElements.flowControlDataOperationsLabel"
                }
            ];

            expect(getElementSections(unsortedElements)).toMatchObject(expectedElementSections);
        });

        it('returns the expected sections list based on custom ordering when receive full element list', () => {
            const unsortedElements = [
                {"elementType": ELEMENT_TYPE.SUBFLOW}, {"elementType": ELEMENT_TYPE.WAIT}, {"elementType": ELEMENT_TYPE.DECISION}, {"elementType": ELEMENT_TYPE.LOOP},
                {"elementType": ELEMENT_TYPE.ASSIGNMENT}, {"elementType": ELEMENT_TYPE.SCREEN}, {"elementType": ELEMENT_TYPE.RECORD_UPDATE}, {"elementType": ELEMENT_TYPE.RECORD_LOOKUP},
                {"elementType": ELEMENT_TYPE.RECORD_CREATE}, {"elementType": ELEMENT_TYPE.RECORD_DELETE}, {"elementType": ELEMENT_TYPE.ACTION_CALL}
            ];

            const expectedElementSections = [
                {"_children":
                    [{"elementType": ELEMENT_TYPE.SCREEN}, {"elementType": ELEMENT_TYPE.ACTION_CALL}, {"elementType": ELEMENT_TYPE.SUBFLOW}],
                    "guid": "testGUID",
                    "label": "FlowBuilderLeftPanelElements.flowInteractionComponentsLabel"
                },
                {"_children":
                    [{"elementType": ELEMENT_TYPE.ASSIGNMENT}, {"elementType": ELEMENT_TYPE.DECISION}, {"elementType": ELEMENT_TYPE.WAIT}, {"elementType": ELEMENT_TYPE.LOOP}],
                    "guid": "testGUID",
                    "label": "FlowBuilderLeftPanelElements.flowControlLogicLabel"
                },
                {"_children":
                    [{"elementType": ELEMENT_TYPE.RECORD_CREATE}, {"elementType": ELEMENT_TYPE.RECORD_UPDATE}, {"elementType": ELEMENT_TYPE.RECORD_LOOKUP}, {"elementType": ELEMENT_TYPE.RECORD_DELETE}],
                    "guid": "testGUID",
                    "label": "FlowBuilderLeftPanelElements.flowControlDataOperationsLabel"
                }
            ];

            expect(getElementSections(unsortedElements)).toMatchObject(expectedElementSections);
        });
    });
});