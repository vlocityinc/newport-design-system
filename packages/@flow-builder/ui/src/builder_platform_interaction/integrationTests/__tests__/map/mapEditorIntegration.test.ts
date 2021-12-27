import {
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import CollectionProcessorEditor from 'builder_platform_interaction/collectionProcessorEditor';
import { AddElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import {
    COLLECTION_PROCESSOR_SUB_TYPE,
    ELEMENT_TYPE,
    FLOW_PROCESS_TYPE
} from 'builder_platform_interaction/flowMetadata';
import MapEditor from 'builder_platform_interaction/mapEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { createElement } from 'lwc';
import * as recommendationFlow from 'mock/flows/recommendationFlow.json';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { recommendationFields } from 'serverData/GetFieldsForEntity/recommendationFields.json';
import { getToolboxElements } from '../../../editor/editorUtils';
import { ComboboxTestComponent } from '../comboboxTestUtils';
import { resetState, setupStateForProcessType, translateFlowToUIAndDispatch } from '../integrationTestUtils';
import { getLabelDescriptionElement, LabelDescriptionComponentTest } from '../labelDescriptionTestUtils';
import { RecordInputOutputAssignmentsComponentTest } from '../recordInputOutputAssignmentsTestUtils';

const mockCreateComponentCallbackStatus = 'SUCCESS';

const createCollectionProcessorEditorForTest = (node, processType, mode) => {
    const el = createElement('builder_platform_interaction-collection-processor-editor', {
        is: CollectionProcessorEditor
    });
    Object.assign(el, { node, processType, mode });
    setDocumentBodyChildren(el);
    return el;
};

const createMapEditorForTest = (props?: {}) => {
    const el = createElement('builder_platform_interaction-map-editor', {
        is: MapEditor
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

jest.mock('aura', () => {
    return {
        createComponent: jest.fn().mockImplementation(async (cmpName, attr, callback) => {
            const newComponent = {
                getElement: () => createMapEditorForTest({ elementInfo: attr.elementInfo }),
                destroy: () => {}
            };
            callback(newComponent, mockCreateComponentCallbackStatus, null);
        }),
        renderComponent: jest.fn((cmp, container) => {
            if (cmp && container && cmp.getElement) {
                container.appendChild(cmp.getElement());
            }
        })
    };
});

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const getCustomPropertyEditor = (collectionProcessorEditor) => {
    return deepQuerySelector(collectionProcessorEditor, [SELECTORS.CUSTOM_PROPERTY_EDITOR]);
};

const getMapEditor = (collectionProcessorEditor) => {
    return deepQuerySelector(collectionProcessorEditor, [SELECTORS.CUSTOM_PROPERTY_EDITOR, SELECTORS.MAP_EDITOR]);
};

const getInputCollection = (mapEditor) =>
    deepQuerySelector(mapEditor, [SELECTORS.INPUT_COLLECTION, SELECTORS.FEROV_RESOURCE_PICKER]);

const getCollectionVariableCombobox = (mapEditor) => {
    const cbx = deepQuerySelector(mapEditor, [
        SELECTORS.INPUT_COLLECTION,
        SELECTORS.FEROV_RESOURCE_PICKER,
        SELECTORS.BASE_RESOURCE_PICKER,
        SELECTORS.COMBOBOX
    ]);
    return new ComboboxTestComponent(cbx);
};

const getRecordInputOutputAssignments = (mapEditor) => {
    return new RecordInputOutputAssignmentsComponentTest(
        deepQuerySelector(mapEditor, [SELECTORS.MAP_ITEMS, SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS])
    );
};

const getMapItems = (mapEditor) => {
    const ioAssignments = deepQuerySelector(mapEditor, [
        SELECTORS.MAP_ITEMS,
        SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS
    ]);
    return ioAssignments.shadowRoot.querySelectorAll(SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER);
};

export const getDeleteButton = (mapEditor, index) => {
    const ioAssignments = deepQuerySelector(mapEditor, [
        SELECTORS.MAP_ITEMS,
        SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS
    ]);
    const rows = ioAssignments.shadowRoot.querySelectorAll(SELECTORS.ROW);
    return rows[index].shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
};

describe('Map Editor', () => {
    const processType = FLOW_PROCESS_TYPE.RECOMMENDATION_STRATEGY;
    let store;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.RECOMMENDATION_STRATEGY);
        await getToolboxElements(processType, null);
        translateFlowToUIAndDispatch(recommendationFlow, store);
    });
    afterAll(() => {
        resetState();
    });
    describe('New mode', () => {
        let collectionProcessorEditor;
        beforeEach(async () => {
            const element = {
                locationX: 100,
                locationY: 100,
                elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
                elementSubtype: COLLECTION_PROCESSOR_SUB_TYPE.MAP,
                isNew: true
            };
            const mapNode = getElementForPropertyEditor(element);
            collectionProcessorEditor = createCollectionProcessorEditorForTest(
                mapNode,
                processType,
                AddElementEvent.EVENT_NAME
            );
        });
        it('let the user enter label, api name and description', () => {
            const labelDescription = new LabelDescriptionComponentTest(
                getLabelDescriptionElement(collectionProcessorEditor)
            );
            expect(labelDescription.getLabelElement()).not.toBeNull();
            expect(labelDescription.getNameElement()).not.toBeNull();
        });
        it('should have a custom property editor', () => {
            const cpe = getCustomPropertyEditor(collectionProcessorEditor);
            expect(cpe).not.toBeNull();
        });
        it('should have map editor', () => {
            const cpe = getCustomPropertyEditor(collectionProcessorEditor);
            expect(cpe.configurationEditor.name).toEqual('builder_platform_interaction:mapEditor');
        });
        it('should have element info', () => {
            const expectedElementInfo = {
                assignNextValueToReference: {
                    error: null,
                    value: null
                },
                collectionReference: {
                    error: null,
                    value: null
                },
                elementSubtype: 'RecommendationMapCollectionProcessor',
                elementType: 'CollectionProcessor',
                mapItems: []
            };
            const cpe = getCustomPropertyEditor(collectionProcessorEditor);
            expect(cpe.elementInfo).toMatchObject(expectedElementInfo);
        });
        it('should render map editor', () => {
            const mapEditor = getMapEditor(collectionProcessorEditor);
            expect(mapEditor).not.toBeNull();
        });
    });
    describe('Edit mode', () => {
        let element, collectionProcessorEditor, mapEditor;
        const getCollectionProcessorEditor = (nodeName) => {
            element = getElementByDevName(nodeName);
            const cpNode = getElementForPropertyEditor(element);
            return createCollectionProcessorEditorForTest(cpNode, processType, EditElementEvent.EVENT_NAME);
        };
        describe('Map from accounts to recommendations', () => {
            beforeEach(async () => {
                collectionProcessorEditor = getCollectionProcessorEditor('Accounts_to_Recommendations');
                await ticks(1);
                mapEditor = getMapEditor(collectionProcessorEditor);
            });
            it('should have a map editor', () => {
                expect(mapEditor).not.toBeNull();
            });
            it('shows selected input collection', () => {
                const inputCollection = getInputCollection(mapEditor);
                const getAccounts = getElementByDevName('Get_Accounts');
                expect(inputCollection.value.value).toEqual(getAccounts?.guid);
            });
            it('shows map items', () => {
                const mapItems = getMapItems(mapEditor);
                expect(mapItems).toHaveLength(element.mapItems.length);
            });
            it('shows value in each map item', () => {
                const mapItems = getMapItems(mapEditor);
                mapItems.forEach((item, index) => {
                    expect(item.expression.leftHandSide.value).toBe(element.mapItems[index].leftHandSide);
                    expect(item.expression.operator.value).toBe(element.mapItems[index].operator);
                    expect(item.expression.rightHandSide.value).toBe(element.mapItems[index].rightHandSide);
                    // disable lhs for required fields
                    const fieldName = item.expression.leftHandSide.value.split('.')[1];
                    expect(item.lhsDisabled).toBe(recommendationFields[fieldName].required);
                    // delete button is disabled
                    expect(item.parentElement.parentElement.showDelete).toBe(!recommendationFields[fieldName].required);
                });
            });
            it('changes operator value', async () => {
                const exps = getRecordInputOutputAssignments(mapEditor).getFieldToFerovExpressionBuilders();
                await exps[0].selectOperator('Add');
                const mapItems = getMapItems(mapEditor);
                expect(mapItems[0].expression.operator.value).toBe('Add');
            });
            it('changes rhs value', async () => {
                const exps = getRecordInputOutputAssignments(mapEditor).getFieldToFerovExpressionBuilders();
                const rhs = await exps[0].getRhsCombobox();
                await rhs.typeMergeField('{!currentItem_Accounts_to_Recommendations.Name}');
                const mapItems = getMapItems(mapEditor);
                const currentItem = getElementByDevName('currentItem_Accounts_to_Recommendations');
                expect(mapItems[0].expression.rightHandSide.value).toBe(currentItem?.guid + '.Name');
            });
            it('changes rhs value to no-exist resource', async () => {
                const exps = getRecordInputOutputAssignments(mapEditor).getFieldToFerovExpressionBuilders();
                const rhs = await exps[0].getRhsCombobox();
                await rhs.typeMergeField('{!noexist}');
                const mapItems = getMapItems(mapEditor);
                expect(mapItems[0].expression.rightHandSide.value).toBe('{!noexist}');
                expect(mapItems[0].expression.rightHandSide.error).toBe(
                    'FlowBuilderMergeFieldValidation.unknownResource'
                );
            });
            it('changes rhs value to no-exist field name', async () => {
                const exps = getRecordInputOutputAssignments(mapEditor).getFieldToFerovExpressionBuilders();
                const rhs = await exps[0].getRhsCombobox();
                await rhs.typeMergeField('{!currentItem_Accounts_to_Recommendations.noExistField}');
                const mapItems = getMapItems(mapEditor);
                expect(mapItems[0].expression.rightHandSide.value).toBe(
                    '{!currentItem_Accounts_to_Recommendations.noExistField}'
                );
                expect(mapItems[0].expression.rightHandSide.error).toBe(
                    'FlowBuilderMergeFieldValidation.unknownRecordField'
                );
            });
            it('adds item', async () => {
                const recordInputOutputAss = getRecordInputOutputAssignments(mapEditor);
                await recordInputOutputAss.clickAddFieldButton();
                // map items should contain empty last element
                const mapItems = getMapItems(mapEditor);
                expect(mapItems).toHaveLength(element.mapItems.length + 1);
                expect(mapItems[mapItems.length - 1].expression.leftHandSide.value).toBe('');
                expect(mapItems[mapItems.length - 1].expression.operator.value).toBe('');
                expect(mapItems[mapItems.length - 1].expression.rightHandSide.value).toBe('');
            });
            it('changes lhs value to valid field name', async () => {
                const recordInputOutputAss = getRecordInputOutputAssignments(mapEditor);
                await recordInputOutputAss.clickAddFieldButton();
                // map items should contain empty last element
                const exps = getRecordInputOutputAssignments(mapEditor).getFieldToFerovExpressionBuilders();
                const lhs = await exps[exps.length - 1].getLhsCombobox();
                await lhs.typeLiteralValue('ImageId');
                const mapItems = getMapItems(mapEditor);
                expect(mapItems[exps.length - 1].expression.leftHandSide.value).toBe('Recommendation.ImageId');
                expect(mapItems[exps.length - 1].expression.leftHandSide.error).toBeNull();
            });
            it('changes lhs value to no-exist field name', async () => {
                const recordInputOutputAss = getRecordInputOutputAssignments(mapEditor);
                await recordInputOutputAss.clickAddFieldButton();
                // map items should contain empty last element
                const exps = getRecordInputOutputAssignments(mapEditor).getFieldToFerovExpressionBuilders();
                const lhs = await exps[exps.length - 1].getLhsCombobox();
                await lhs.typeLiteralValue('noExistField');
                const mapItems = getMapItems(mapEditor);
                expect(mapItems[exps.length - 1].expression.leftHandSide.value).toBe('noExistField');
                expect(mapItems[exps.length - 1].expression.leftHandSide.error).toBe(
                    'FlowBuilderCombobox.genericErrorMessage'
                );
            });
            it('deletes item', async () => {
                const recordInputOutputAss = getRecordInputOutputAssignments(mapEditor);
                await recordInputOutputAss.clickAddFieldButton();
                let mapItems = getMapItems(mapEditor);
                expect(mapItems).toHaveLength(element.mapItems.length + 1);
                // delete item
                const deleteButton = getDeleteButton(mapEditor, element.mapItems.length);
                await deleteButton.click();
                mapItems = getMapItems(mapEditor);
                expect(mapItems).toHaveLength(element.mapItems.length);
            });
            it('changes input collection will reset map items', async () => {
                const inputCbx = getCollectionVariableCombobox(mapEditor);
                await inputCbx.typeReferenceOrValue('{!outputRecommendations}');
                // map items should contain only one empty item
                const mapItems = getMapItems(mapEditor);
                expect(mapItems).toHaveLength(1);
                expect(mapItems[0].expression.leftHandSide.value).toBe('');
                expect(mapItems[0].expression.operator.value).toBe('');
                expect(mapItems[0].expression.rightHandSide.value).toBe('');
            });
        });
        describe('Update recommendations', () => {
            beforeEach(async () => {
                collectionProcessorEditor = getCollectionProcessorEditor('Modify_recommendations');
                await ticks(1);
                mapEditor = getMapEditor(collectionProcessorEditor);
            });
            it('should have a map editor', () => {
                expect(mapEditor).not.toBeNull();
            });
            it('shows selected input collection', () => {
                const inputCollection = getInputCollection(mapEditor);
                const getRecommendations = getElementByDevName('Accounts_to_Recommendations');
                expect(inputCollection.value.value).toEqual(getRecommendations?.guid);
            });
            it('shows map items', () => {
                const mapItems = getMapItems(mapEditor);
                expect(mapItems).toHaveLength(element.mapItems.length);
            });
            it('shows value in each map item', () => {
                const mapItems = getMapItems(mapEditor);
                mapItems.forEach((item, index) => {
                    expect(item.expression.leftHandSide.value).toBe(element.mapItems[index].leftHandSide);
                    expect(item.expression.operator.value).toBe(element.mapItems[index].operator);
                    expect(item.expression.rightHandSide.value).toBe(element.mapItems[index].rightHandSide);
                    // lhs is not disabled
                    expect(item.lhsDisabled).toBeFalsy();
                });
            });
            it('changes input collection will reset map items', async () => {
                const inputCbx = getCollectionVariableCombobox(mapEditor);
                await inputCbx.typeReferenceOrValue('{!Get_Accounts}');
                // map items should contain the prepopulated required fields
                const mapItems = getMapItems(mapEditor);
                const recommendationRequiredFields = Object.keys(recommendationFields).filter(
                    (field) => recommendationFields[field].creatable && recommendationFields[field].required
                );
                expect(mapItems).toHaveLength(recommendationRequiredFields.length);
                const currentItem = getElementByDevName('currentItem_Modify_recommendations');
                mapItems.forEach((item, index) => {
                    const fieldName = recommendationRequiredFields[index];
                    expect(item.expression.leftHandSide.value).toBe(
                        'Recommendation.' + recommendationRequiredFields[index]
                    );
                    expect(item.expression.operator.value).toBe('Assign');
                    if (accountFields[fieldName]) {
                        expect(item.expression.rightHandSide.value).toBe(currentItem?.guid + '.' + fieldName);
                    } else {
                        expect(item.expression.rightHandSide.value).toBe('');
                    }
                });
            });
        });
    });
});
