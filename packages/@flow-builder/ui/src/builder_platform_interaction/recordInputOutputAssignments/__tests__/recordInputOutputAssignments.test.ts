// @ts-nocheck
import { createElement } from 'lwc';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

import {
    AddRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import RecordInputOutputAssignments from '../recordInputOutputAssignments';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const mockDefaultRecordInputAssignment = {
    object: 'Account',
    inputOutputAssignmentsItems: [
        {
            leftHandSide: { value: '', error: null },
            rightHandSide: { value: '', error: null },
            rightHandSideDataType: { value: '', error: null },
            rowIndex: 'RECORDCREATEASSIGNMENTFIELD_1'
        }
    ],
    recordFields: accountFields,
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    rhsLabel: 'Value'
};

const mock2InputAssignmentsItems = [
    {
        leftHandSide: { value: 'Account.Description', error: null },
        rightHandSide: { value: 'vDescription', error: null },
        rightHandSideDataType: { value: 'reference', error: null },
        rowIndex: 'RECORDCREATEASSIGNMENTFIELD_21'
    },
    {
        leftHandSide: { value: 'Account.Name', error: null },
        rightHandSide: { value: 'nameC', error: null },
        rightHandSideDataType: { value: 'reference', error: null },
        rowIndex: 'RECORDCREATEASSIGNMENTFIELD_22'
    }
];

const mockDefaultMapAssignmentItems = {
    recordEntityName: 'Account',
    inputOutputAssignmentsItems: [
        {
            leftHandSide: { value: 'Account.Name', error: null },
            operator: { value: 'EqualTo', error: null },
            rightHandSide: { value: 'nameC', error: null },
            rightHandSideDataType: { value: 'reference', error: null },
            deletable: false,
            required: true,
            lhsDisabled: true,
            rowIndex: 'MAPASSIGNMENTFIELD_21'
        },
        {
            leftHandSide: { value: 'Account.Description', error: null },
            operator: { value: 'EqualTo', error: null },
            rightHandSide: { value: 'vDescription', error: null },
            rightHandSideDataType: { value: 'reference', error: null },
            deletable: true,
            required: false,
            lhsDisabled: false,
            rowIndex: 'MAPASSIGNMENTFIELD_22'
        }
    ],
    recordFields: accountFields,
    elementType: ELEMENT_TYPE.COLLECTION_PROCESSOR,
    rhsLabel: 'Value',
    lhsLabel: 'Output Field',
    operatorLabel: 'Operator',
    operatorPlaceholder: 'Select',
    lhsPlaceholder: 'Select Field'
};

const createComponentUnderTest = (mockRecord = mockDefaultRecordInputAssignment) => {
    const el = createElement('builder_platform_interaction-record-input-output-assignments', {
        is: RecordInputOutputAssignments
    });
    Object.assign(el, mockRecord);
    setDocumentBodyChildren(el);
    return el;
};

const getFieldList = (recordInputOutputAssignmentCmp) => {
    return recordInputOutputAssignmentCmp.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.LIST);
};

const getExpressionBuilders = (recordInputOutputAssignmentCmp) => {
    return recordInputOutputAssignmentCmp.shadowRoot.querySelectorAll(
        INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER
    );
};

const getRows = (recordInputOutputAssignmentCmp) => {
    return recordInputOutputAssignmentCmp.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.ROW);
};

const getDeleteButton = (row) => {
    return row.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_ICON);
};

describe('record-input-output-assignment', () => {
    describe('Initial state', () => {
        let element, expressionBuilders;
        beforeAll(() => {
            element = createComponentUnderTest();
            expressionBuilders = getExpressionBuilders(element);
        });
        it('should contain a list', () => {
            expect(getFieldList(element)).not.toBeNull();
        });
        it('should contain only one field-to-ferov-expression-builder', () => {
            expect(expressionBuilders).toHaveLength(1);
        });
        it('should have lhs label', () => {
            expect(expressionBuilders[0].lhsLabel).toBe('FlowBuilderRecordEditor.field');
        });
        it('should have lhs placeholder', () => {
            expect(expressionBuilders[0].lhsPlaceholder).toBe('FlowBuilderRecordEditor.getFieldPlaceholder');
        });
        it('should display empty value in lhs', () => {
            expect(expressionBuilders[0].expression.leftHandSide.value).toBe('');
        });
        it('should have rhs label', () => {
            expect(expressionBuilders[0].rhsLabel).toBe('Value');
        });
        it('should display empty value in rhs', () => {
            expect(expressionBuilders[0].expression.rightHandSide.value).toBe('');
        });
        it('should not have operator label', () => {
            expect(expressionBuilders[0].operatorLabel).toBeUndefined();
        });
        it('should have operator icon', () => {
            expect(expressionBuilders[0].operatorIconName).toEqual('utility:back');
        });
        it('should not show delete button', () => {
            const rows = getRows(element);
            expect(rows).toHaveLength(1);
            expect(rows[0].showDelete).toBe(false);
        });
    });
    describe('Assignment Items', () => {
        let element, expressionBuilders, rows;
        describe('in record create editor', () => {
            beforeAll(() => {
                mockDefaultRecordInputAssignment.inputOutputAssignmentsItems = mock2InputAssignmentsItems;
                element = createComponentUnderTest();
                expressionBuilders = getExpressionBuilders(element);
                rows = getRows(element);
            });
            it('should have 2 field-to-ferov-expression-builder', () => {
                expect(expressionBuilders).toHaveLength(2);
            });
            it('should display value in lhs', () => {
                expect(expressionBuilders[0].expression.leftHandSide.value).toBe('Account.Description');
            });
            it('should display value in rhs', () => {
                expect(expressionBuilders[0].expression.rightHandSide.value).toBe('vDescription');
            });
            it('should show delete button', () => {
                rows.forEach((row) => {
                    expect(row.showDelete).toBe(true);
                });
            });
        });
        describe('in map editor', () => {
            beforeAll(() => {
                element = createComponentUnderTest(mockDefaultMapAssignmentItems);
                expressionBuilders = getExpressionBuilders(element);
                rows = getRows(element);
            });
            /**
             * Verify the specific property
             *
             * @param cmps list of components
             * @param property name of property
             * @param values list of expected values. If you want to check that the property's value is the same in any component, just pass the single value.
             */
            const verifyProperty = (cmps, property, values) => {
                if (values.length !== 1) {
                    expect(values).toHaveLength(cmps.length);
                }
                cmps.forEach((cmp, index) => {
                    const expValue = values.length === 1 ? values[0] : values[index];
                    expect(cmp[property]).toEqual(expValue);
                });
            };
            it('should have 2 field-to-ferov-expression-builder', () => {
                expect(expressionBuilders).toHaveLength(2);
            });
            it('should have lhs label', () => {
                verifyProperty(expressionBuilders, 'lhsLabel', [mockDefaultMapAssignmentItems.lhsLabel]);
            });
            it('should have lhs placeholder', () => {
                verifyProperty(expressionBuilders, 'lhsPlaceholder', [mockDefaultMapAssignmentItems.lhsPlaceholder]);
            });
            it('should have rhs label', () => {
                verifyProperty(expressionBuilders, 'rhsLabel', [mockDefaultMapAssignmentItems.rhsLabel]);
            });
            it('should have operator label', () => {
                verifyProperty(expressionBuilders, 'operatorLabel', [mockDefaultMapAssignmentItems.operatorLabel]);
            });
            it('should not have operator icon', () => {
                verifyProperty(expressionBuilders, 'operatorIconName', [null]);
            });
            it('should have operator placeholder', () => {
                verifyProperty(expressionBuilders, 'operatorPlaceholder', [
                    mockDefaultMapAssignmentItems.operatorPlaceholder
                ]);
            });
            it('should display value in lhs', () => {
                verifyProperty(
                    [expressionBuilders[0].expression.leftHandSide, expressionBuilders[1].expression.leftHandSide],
                    'value',
                    ['Account.Name', 'Account.Description']
                );
            });
            it('should display value in operator', () => {
                verifyProperty(
                    [expressionBuilders[0].expression.operator, expressionBuilders[1].expression.operator],
                    'value',
                    ['EqualTo', 'EqualTo']
                );
            });
            it('should display value in rhs', () => {
                verifyProperty(
                    [expressionBuilders[0].expression.rightHandSide, expressionBuilders[1].expression.rightHandSide],
                    'value',
                    ['nameC', 'vDescription']
                );
            });
            it('verifies that the lhs in first row is disable, the lhs in second row is enable', () => {
                verifyProperty(expressionBuilders, 'lhsDisabled', [true, false]);
            });
            it('verifies that the first row is required, the second row is not required', () => {
                verifyProperty(expressionBuilders, 'required', [true, false]);
            });
            it('verifies that the delete button in first row is disable, the delete button in second row is enable', () => {
                const deleteButtons = [];
                rows.forEach((row) => {
                    deleteButtons.push(getDeleteButton(row));
                });
                verifyProperty(deleteButtons, 'disabled', [true, false]);
            });
        });
    });
    describe('Lhs Fields', () => {
        let element, expressionBuilders;
        beforeAll(() => {
            mockDefaultRecordInputAssignment.readOnlyFields = true;
            element = createComponentUnderTest();
            expressionBuilders = getExpressionBuilders(element);
        });
        it('should not contain duplicated fields', () => {
            expect(
                Object.values(expressionBuilders[0].lhsFields)
                    .map((field) => field.apiName)
                    .includes('Name')
            ).toBe(false);
            expect(
                Object.values(expressionBuilders[1].lhsFields)
                    .map((field) => field.apiName)
                    .includes('Description')
            ).toBe(false);
        });
    });
    describe('handleAddAssignment', () => {
        it('fires addRecordAssignmentEvent', async () => {
            const element = createComponentUnderTest();
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(AddRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
            const fieldList = getFieldList(element);
            fieldList.dispatchEvent(new AddRecordFieldAssignmentEvent());
            expect(eventCallback).toHaveBeenCalled();
        });
    });

    describe('handleUpdateAssignment', () => {
        it('fires updateRecordAssignmentEvent', async () => {
            const updateData = {
                index: 0,
                value: 'newValue'
            };
            const element = createComponentUnderTest();
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(UpdateRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
            const fieldList = getFieldList(element);
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

    describe('handleDeleteAssignment', () => {
        it('fires deleteRecordAssignmentEvent', async () => {
            const deleteIndex = 1;
            const element = createComponentUnderTest();
            await ticks(1);
            const eventCallback = jest.fn();
            element.addEventListener(DeleteRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
            const fieldList = getFieldList(element);
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
