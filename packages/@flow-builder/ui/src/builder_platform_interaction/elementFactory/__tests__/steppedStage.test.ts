// @ts-nocheck

import {
    getElementByGuid,
    getElementsForElementType,
    shouldUseAutoLayoutCanvas
} from 'builder_platform_interaction/storeUtils';
import {
    createSteppedStageWithItems,
    createSteppedStageItem,
    createSteppedStageWithItemReferencesWhenUpdatingFromPropertyEditor,
    createSteppedStageWithItemReferences,
    createSteppedStageMetadataObject,
    getSteps,
    getOtherItemsInSteppedStage
} from '../steppedStage';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseCanvasElement, baseChildElement, baseCanvasElementsArrayToMap } from '../base/baseElement';
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from '../base/baseMetadata';
import { sanitizeDevName } from 'builder_platform_interaction/commonUtils';
import { Guid } from 'builder_platform_interaction/flowModel';

const commonUtils = jest.requireActual('builder_platform_interaction/commonUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn(),
        isExecuteOnlyWhenChangeMatchesConditionsPossible: jest.fn().mockReturnValue(true),
        shouldUseAutoLayoutCanvas: jest.fn(),
        getElementsForElementType: jest.fn(() => {
            return [];
        })
    };
});

const newSteppedStageGuid = 'newSteppedStage';
const existingSteppedStageGuid = 'existingSteppedStage';
const steppedStageWithChildrenGuid = 'newSteppedStageWithChildren';
const existingSteppedStageWithOneChildGuid = 'existingSteppedStageWithOneChild';
const existingSteppedStageWithChildrenGuid = 'existingSteppedStageWithChildren';

const existingSteppedStage: SteppedStage = {
    guid: existingSteppedStageGuid,
    childReferences: [{ childReference: 'existingItem1' }, { childReference: 'existingItem2' }],
    steps: []
};
const existingSteppedStageWithOneChild = {
    guid: existingSteppedStageWithOneChildGuid,
    childReferences: [{ childReference: 'existingItem1' }]
};

const existingSteppedStageWithChildren = {
    guid: existingSteppedStageWithChildrenGuid,
    childReferences: [{ childReference: 'existingItem1' }, { childReference: 'existingItem2' }]
};

getElementByGuid.mockImplementation((guid) => {
    if (guid === newSteppedStageGuid || guid === steppedStageWithChildrenGuid) {
        return null;
    } else if (guid === existingSteppedStageGuid) {
        return existingSteppedStage;
    } else if (guid === existingSteppedStageWithChildren.guid) {
        return existingSteppedStageWithChildren;
    } else if (guid === 'step1' || guid === 'step2' || guid === 'step3') {
        return {
            guid,
            entryCriteria: []
        };
    }

    return {
        guid
    };
});

jest.mock('../base/baseElement');
baseCanvasElement
    .mockImplementation((element) => {
        return Object.assign({}, element);
    })
    .mockName('baseCanvasElementMock');
baseChildElement
    .mockImplementation((outcome) => {
        return Object.assign({}, outcome);
    })
    .mockName('baseChildElementMock');
baseCanvasElementsArrayToMap.mockImplementation(jest.requireActual('../base/baseElement').baseCanvasElementsArrayToMap);

jest.mock('../base/baseMetadata');
baseCanvasElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});
baseChildElementMetadataObject.mockImplementation((element) => {
    return Object.assign({}, element);
});

describe('SteppedStage', () => {
    describe('createSteppedStageWithItems', () => {
        it('includes the return value of a call to baseCanvasElement', () => {
            createSteppedStageWithItems(existingSteppedStage);

            expect(baseCanvasElement).toHaveBeenCalledWith(existingSteppedStage);
        });

        it('element type is STEPPED_STAGE', () => {
            const steppedStage = createSteppedStageWithItems(existingSteppedStage);

            expect(steppedStage.elementType).toEqual(ELEMENT_TYPE.STEPPED_STAGE);
        });

        it('default name/label', () => {
            const steppedStage = createSteppedStageWithItems({});

            expect(getElementsForElementType).toHaveBeenCalledWith(ELEMENT_TYPE.STEPPED_STAGE);

            const defaultLabel = 'FlowBuilderElementConfig.defaultSteppedStageName(1)';
            expect(steppedStage.label).toEqual(defaultLabel);
            expect(steppedStage.name).toEqual(sanitizeDevName(defaultLabel));
        });

        describe('items', () => {
            it('includes items for all item references present', () => {
                const childReferences = [{ childReference: 'a' }, { childReference: 'b' }, { childReference: 'c' }];

                const stage = createSteppedStageWithItems({ childReferences });

                expect(stage.steps).toHaveLength(3);
                expect(stage.steps[0].guid).toEqual(childReferences[0].childReference);
                expect(stage.steps[1].guid).toEqual(childReferences[1].childReference);
                expect(stage.steps[2].guid).toEqual(childReferences[2].childReference);
            });
        });
    });

    describe('createSteppedStageItem', () => {
        beforeEach(() => {
            baseChildElement.mockClear();
        });
        it('calls baseChildElement with elementType = STEPPED_STAGE_ITEM', () => {
            createSteppedStageItem({});
            expect(baseChildElement.mock.calls[0][1]).toEqual(ELEMENT_TYPE.STEPPED_STAGE_ITEM);
        });

        it('calls baseChildElement with a step type of "work step"', () => {
            const workStepLabel = 'FlowBuilderElementConfig.workStepLabel';
            createSteppedStageItem({});
            expect(baseChildElement.mock.calls[0][0]).toEqual({
                stepTypeLabel: workStepLabel
            });
        });

        it('uses existing values when passed in an item object', () => {
            const mockItem = {
                label: 'foo'
            };

            createSteppedStageItem(mockItem);

            expect(baseChildElement.mock.calls[0][0]).toMatchObject(mockItem);
        });

        it('uses the default name and label if none provided', () => {
            const mockItem = {
                parent: existingSteppedStageWithChildren.guid
            };

            const item = createSteppedStageItem(mockItem);

            expect(getElementByGuid).toHaveBeenCalledWith(existingSteppedStageWithChildren.guid);
            expect(commonUtils.format).toHaveBeenCalledWith(
                'FlowBuilderElementConfig.defaultSteppedStageItemName',
                existingSteppedStageWithChildren.childReferences.length + 1,
                undefined
            );
            expect(item.label).toEqual('FlowBuilderElementConfig.defaultSteppedStageItemName(3,)');
        });
    });

    describe('createSteppedStageWithItemReferencesWhenUpdatingFromPropertyEditor', () => {
        const shouldUseFlc = (useFlc) => {
            shouldUseAutoLayoutCanvas.mockImplementation(() => {
                return useFlc;
            });
        };

        let steppedStageFromPropertyEditor;

        beforeEach(() => {
            shouldUseFlc(false);

            steppedStageFromPropertyEditor = {
                guid: newSteppedStageGuid,
                steps: [
                    {
                        guid: 'item1',
                        entryCriteria: []
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElement', () => {
            createSteppedStageWithItemReferencesWhenUpdatingFromPropertyEditor(steppedStageFromPropertyEditor);

            expect(baseCanvasElement).toHaveBeenCalledWith(steppedStageFromPropertyEditor);
        });

        it('element type is STEPPED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS', () => {
            const result = createSteppedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
                steppedStageFromPropertyEditor
            );

            expect(result.elementType).toEqual(ELEMENT_TYPE.STEPPED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS);
        });

        it('element type is STEPPED_STAGE', () => {
            const result = createSteppedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
                steppedStageFromPropertyEditor
            );

            expect(result.canvasElement.elementType).toEqual(ELEMENT_TYPE.STEPPED_STAGE);
        });
    });

    describe('createSteppedStageWithItemReferences', () => {
        let steppedStageFromFlow;

        beforeEach(() => {
            steppedStageFromFlow = {
                guid: existingSteppedStageGuid,
                steps: [
                    {
                        name: 'step1',
                        guid: 'step1'
                    },
                    {
                        name: 'step2',
                        guid: 'step2'
                    },
                    {
                        name: 'step3',
                        guid: 'step3'
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElement', () => {
            createSteppedStageWithItemReferences(steppedStageFromFlow);

            expect(baseCanvasElement).toHaveBeenCalledWith(steppedStageFromFlow);
        });

        it('element type is STEPPED_STAGE', () => {
            const result = createSteppedStageWithItemReferences(steppedStageFromFlow);

            const steppedStage = result.elements[existingSteppedStageGuid];
            expect(steppedStage.elementType).toEqual(ELEMENT_TYPE.STEPPED_STAGE);
        });

        describe('SteppedStageItems', () => {
            it('includes childReferences for all items present', () => {
                const result = createSteppedStageWithItemReferences(steppedStageFromFlow);
                const steppedStage = result.elements[existingSteppedStageGuid];

                expect(steppedStage.childReferences).toHaveLength(3);
                expect(steppedStage.childReferences[0].childReference).toEqual(steppedStageFromFlow.steps[0].guid);
                expect(steppedStage.childReferences[1].childReference).toEqual(steppedStageFromFlow.steps[1].guid);
                expect(steppedStage.childReferences[2].childReference).toEqual(steppedStageFromFlow.steps[2].guid);
            });

            it('are included in element map for all steps present', () => {
                const result = createSteppedStageWithItemReferences(steppedStageFromFlow);

                expect(result.elements[steppedStageFromFlow.steps[0].guid]).toMatchObject(
                    steppedStageFromFlow.steps[0]
                );
                expect(result.elements[steppedStageFromFlow.steps[1].guid]).toMatchObject(
                    steppedStageFromFlow.steps[1]
                );
                expect(result.elements[steppedStageFromFlow.steps[2].guid]).toMatchObject(
                    steppedStageFromFlow.steps[2]
                );
            });
        });
    });
    describe('createSteppedStageMetadataObject', () => {
        let steppedStageFromStore;

        beforeEach(() => {
            steppedStageFromStore = {
                guid: existingSteppedStageGuid,
                childReferences: [
                    {
                        childReference: 'step1'
                    },
                    {
                        childReference: 'step2'
                    },
                    {
                        childReference: 'step3'
                    }
                ]
            };
        });

        it('includes the return value of a call to baseCanvasElementMetadataObject', () => {
            createSteppedStageMetadataObject(steppedStageFromStore);

            expect(baseCanvasElementMetadataObject).toHaveBeenCalledWith(steppedStageFromStore, {});
        });

        describe('steps', () => {
            it('are included for all child references present', () => {
                const steppedStage = createSteppedStageMetadataObject(steppedStageFromStore);

                expect(steppedStage.steps).toHaveLength(3);
                expect(steppedStage.steps[0].guid).toEqual(steppedStageFromStore.childReferences[0].childReference);
                expect(steppedStage.steps[1].guid).toEqual(steppedStageFromStore.childReferences[1].childReference);
                expect(steppedStage.steps[2].guid).toEqual(steppedStageFromStore.childReferences[2].childReference);
            });
        });
    });

    describe('getSteps', () => {
        it('returns all items for the SteppedStage', () => {
            const data = getSteps(existingSteppedStageWithChildren.guid);
            expect(data).toHaveLength(2);

            expect(getElementByGuid).toHaveBeenCalledTimes(3);
            expect(getElementByGuid.mock.calls[1][0]).toEqual(
                existingSteppedStageWithChildren.childReferences[0].childReference
            );
            expect(getElementByGuid.mock.calls[2][0]).toEqual(
                existingSteppedStageWithChildren.childReferences[1].childReference
            );
        });
        it('sets the label to WorkStep for all steps', () => {
            const workStepLabel = 'FlowBuilderElementConfig.workStepLabel';
            const data = getSteps(existingSteppedStageWithChildren.guid);
            expect(data[0].stepTypeLabel).toEqual(workStepLabel);
            expect(data[1].stepTypeLabel).toEqual(workStepLabel);
        });
    });

    describe('getOtherItemsInSteppedStage', () => {
        it('throws an error if no parent found', () => {
            const nonexistantGuid: Guid = 'foo';

            expect(() => {
                getOtherItemsInSteppedStage(nonexistantGuid);
            }).toThrow(`No parent SteppedStage found for SteppedStageItem ${nonexistantGuid}`);
        });

        it('returns an empty array if the only step is the selected one', () => {
            getElementsForElementType.mockImplementation(() => {
                return [existingSteppedStageWithOneChild];
            });

            const data = getOtherItemsInSteppedStage('existingItem1');

            expect(data).toHaveLength(0);
        });

        it('returns all other children', () => {
            getElementsForElementType.mockImplementation(() => {
                return [existingSteppedStageWithChildren];
            });

            const data = getOtherItemsInSteppedStage('existingItem1');

            expect(data).toHaveLength(1);
            expect(data[0]).toMatchObject({ guid: 'existingItem2' });
        });
    });
});
