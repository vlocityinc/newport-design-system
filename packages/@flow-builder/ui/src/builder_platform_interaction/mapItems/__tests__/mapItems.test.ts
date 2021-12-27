import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import {
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import MapItems from 'builder_platform_interaction/mapItems';
import { createElement } from 'lwc';

const commonUtils = jest.requireActual('builder_platform_interaction/sharedUtils');
commonUtils.format = jest
    .fn()
    .mockImplementation((formatString, ...args) => formatString + '(' + args.toString() + ')');

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const recommendationFields = {
    AcceptanceLabel: {
        activePicklistValues: [],
        apiName: 'AcceptanceLabel',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'STRING',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: true,
        isAvailableForMerge: true,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: false,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'Acceptance Label',
        length: 80,
        precision: 0,
        referenceToNames: [],
        relationshipName: null,
        required: true,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    ActionReference: {
        activePicklistValues: [],
        apiName: 'ActionReference',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'STRING',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: false,
        isAvailableForMerge: false,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: false,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'Action',
        length: 255,
        precision: 0,
        referenceToNames: [],
        relationshipName: null,
        required: true,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    Category__c: {
        activePicklistValues: [],
        apiName: 'Category__c',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'STRING',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: true,
        isAvailableForMerge: true,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: true,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'Category',
        length: 255,
        precision: 0,
        referenceToNames: [],
        relationshipName: null,
        required: false,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    Description: {
        activePicklistValues: [],
        apiName: 'Description',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'STRING',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: true,
        isAvailableForMerge: true,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: false,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'Description',
        length: 255,
        precision: 0,
        referenceToNames: [],
        relationshipName: null,
        required: true,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    discount__c: {
        activePicklistValues: [],
        apiName: 'discount__c',
        compoundFieldName: null,
        creatable: true,
        dataType: 'Number',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'DOUBLE',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: true,
        isAvailableForMerge: true,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: true,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'discount',
        length: 0,
        precision: 2,
        referenceToNames: [],
        relationshipName: null,
        required: false,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    ExternalId: {
        activePicklistValues: [],
        apiName: 'ExternalId',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'STRING',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: true,
        isAvailableForMerge: true,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: false,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'External Id',
        length: 255,
        precision: 0,
        referenceToNames: [],
        relationshipName: null,
        required: false,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    ImageId: {
        activePicklistValues: [],
        apiName: 'ImageId',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'REFERENCE',
        filterable: true,
        inlineHelpText: 'For best results, use a 1000 px x 380 px image at 72 dpi or one with a similar ratio.',
        isAvailableForFormulas: false,
        isAvailableForMerge: false,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: false,
        isPolymorphic: false,
        isSpanningAllowed: true,
        isWorkflowFilterable: true,
        label: 'Asset File ID',
        length: 18,
        precision: 0,
        referenceToNames: ['ContentAsset'],
        relationshipName: 'Image',
        required: false,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    Name: {
        activePicklistValues: [],
        apiName: 'Name',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'STRING',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: true,
        isAvailableForMerge: true,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: false,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'Name',
        length: 80,
        precision: 0,
        referenceToNames: [],
        relationshipName: null,
        required: true,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    RejectionLabel: {
        activePicklistValues: [],
        apiName: 'RejectionLabel',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'STRING',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: true,
        isAvailableForMerge: true,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: false,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'Rejection Label',
        length: 80,
        precision: 0,
        referenceToNames: [],
        relationshipName: null,
        required: true,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    },
    user_tier__c: {
        activePicklistValues: [],
        apiName: 'user_tier__c',
        compoundFieldName: null,
        creatable: true,
        dataType: 'String',
        editable: true,
        extraTypeInfo: null,
        fieldDataType: 'STRING',
        filterable: true,
        inlineHelpText: null,
        isAvailableForFormulas: true,
        isAvailableForMerge: true,
        isCalculated: false,
        isCollection: false,
        isCompound: false,
        isCustom: true,
        isPolymorphic: false,
        isSpanningAllowed: false,
        isWorkflowFilterable: true,
        label: 'user_tier',
        length: 10,
        precision: 0,
        referenceToNames: [],
        relationshipName: null,
        required: false,
        scale: 0,
        sobjectName: 'Recommendation',
        sortable: true,
        subtype: null
    }
};
const mockMapItems = {
    inputObjectType: 'Account',
    outputObjectType: 'Recommendation',
    mapItems: [
        {
            leftHandSide: { value: 'Recommendation.AcceptanceLabel', error: null },
            rightHandSide: { value: 'Accept', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            operator: { value: 'Assign', error: null },
            rowIndex: 'MapItem_1'
        },
        {
            leftHandSide: { value: 'Recommendation.ActionReference', error: null },
            rightHandSide: { value: 'ActionFlow', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            operator: { value: 'Assign', error: null },
            rowIndex: 'MapItem_2'
        },
        {
            leftHandSide: { value: 'Recommendation.Description', error: null },
            rightHandSide: { value: 'currentItem_testMap.Description', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            operator: { value: 'Assign', error: null },
            rowIndex: 'MapItem_3'
        },
        {
            leftHandSide: { value: 'Recommendation.Name', error: null },
            rightHandSide: { value: 'currentItem_testMap.Name', error: null },
            rightHandSideDataType: { value: 'reference', error: null },
            operator: { value: 'Assign', error: null },
            rowIndex: 'MapItem_4'
        },
        {
            leftHandSide: { value: 'Recommendation.RejectionLabel', error: null },
            rightHandSide: { value: 'Reject', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            operator: { value: 'Assign', error: null },
            rowIndex: 'MapItem_5'
        },
        {
            leftHandSide: { value: 'Recommendation.Category__c', error: null },
            rightHandSide: { value: 'My Category', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            operator: { value: 'Assign', error: null },
            rowIndex: 'MapItem_6'
        }
    ],
    recordFields: recommendationFields
};

const createComponentUnderTest = ({ inputObjectType, outputObjectType, mapItems, recordFields } = mockMapItems) => {
    const el = createElement('builder_platform_interaction-map-items', {
        is: MapItems
    });
    Object.assign(el, { inputObjectType, outputObjectType, mapItems, recordFields });
    setDocumentBodyChildren(el);
    return el;
};

const getRecordInputOutputAssignments = (mapItemsCmp) => {
    return mapItemsCmp.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);
};

const getList = (mapItemsCmp) => {
    return getRecordInputOutputAssignments(mapItemsCmp).shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LIST);
};

const getExpressionBuilders = (mapItemsCmp) => {
    return getRecordInputOutputAssignments(mapItemsCmp).shadowRoot.querySelectorAll(
        INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER
    );
};

const getRows = (mapItemsCmp) => {
    return getRecordInputOutputAssignments(mapItemsCmp).shadowRoot.querySelectorAll(
        INTERACTION_COMPONENTS_SELECTORS.ROW
    );
};

describe('map-items', () => {
    describe('Initial state', () => {
        let element, expressionBuilders;
        beforeAll(() => {
            element = createComponentUnderTest();
            expressionBuilders = getExpressionBuilders(element);
        });
        it('should contain a record input output assignments', () => {
            expect(getRecordInputOutputAssignments(element)).not.toBeNull();
        });
        it('should contain a list of field-to-ferov-expression-builder', () => {
            expect(expressionBuilders).toHaveLength(mockMapItems.mapItems.length);
        });
        it('should have lhs label', () => {
            expect(expressionBuilders[0].lhsLabel).toBe('FlowBuilderMapEditor.lhsLabel');
        });
        it('should have lhs placeholder', () => {
            expect(expressionBuilders[0].lhsPlaceholder).toBe('FlowBuilderMapEditor.lhsPlaceholder');
        });
        it('should have rhs label', () => {
            expect(expressionBuilders[0].rhsLabel).toBe('FlowBuilderMapEditor.rhsLabel');
        });
        it('should have operator label', () => {
            expect(expressionBuilders[0].operatorLabel).toBe('FlowBuilderMapEditor.operatorLabel');
        });
        it('should display value in lhs', () => {
            expressionBuilders.forEach((expBuilder, index) => {
                expect(expBuilder.expression.leftHandSide.value).toBe(mockMapItems.mapItems[index].leftHandSide.value);
            });
        });
        it('should set disabled to lhs for required fields', () => {
            expressionBuilders.forEach((expBuilder) => {
                const fieldName = expBuilder.expression.leftHandSide.value.split('.')[1];
                expect(expBuilder.lhsDisabled).toBe(recommendationFields[fieldName].required);
            });
        });
        it('should display value in rhs', () => {
            expressionBuilders.forEach((expBuilder, index) => {
                expect(expBuilder.expression.rightHandSide.value).toBe(
                    mockMapItems.mapItems[index].rightHandSide.value
                );
            });
        });
        it('should have operator', () => {
            expressionBuilders.forEach((expBuilder, index) => {
                expect(expBuilder.expression.operator.value).toBe(mockMapItems.mapItems[index].operator.value);
            });
        });
        it('should not show delete button for required fields', () => {
            const rows = getRows(element);
            expressionBuilders.forEach((expBuilder, index) => {
                const fieldName = expBuilder.expression.leftHandSide.value.split('.')[1];
                expect(rows[index].showDelete).toBe(!recommendationFields[fieldName].required);
            });
        });
    });

    describe('handleAddMapItem', () => {
        it('fires addRecordAssignmentEvent', async () => {
            const element = createComponentUnderTest();
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(AddRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
            const fieldList = getList(element);
            fieldList.dispatchEvent(new AddRecordFieldAssignmentEvent());
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('handleUpdateMapItem', () => {
        it('fires updateRecordAssignmentEvent', async () => {
            const updateData = {
                index: 0,
                value: 'newValue'
            };
            const element = createComponentUnderTest();
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(UpdateRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
            const fieldList = getList(element);
            fieldList.dispatchEvent(new UpdateRecordFieldAssignmentEvent(updateData.index, updateData.value));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: updateData.index,
                    value: updateData.value
                }
            });
        });
    });

    describe('handleDeleteMapItem', () => {
        it('fires deleteRecordAssignmentEvent', async () => {
            const deleteIndex = 1;
            const element = createComponentUnderTest();
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(DeleteRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
            const fieldList = getList(element);
            fieldList.dispatchEvent(new DeleteRecordFieldAssignmentEvent(deleteIndex));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    index: deleteIndex
                }
            });
        });
    });
});
