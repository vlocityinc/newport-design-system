import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import { mockAccountFields } from "mock/serverEntityData";
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

import {
    AddRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import RecordInputOutputAssignments from '../recordInputOutputAssignments.js';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () => require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder'));

const mockDefaultRecordInputAssignment = {
    object: 'Account',
    inputOutputAssignmentsItems: [{
        leftHandSide: {value: '', error: null},
        rightHandSide: {value: '', error: null},
        rightHandSideDataType: {value: '', error: null},
        rowIndex: 'RECORDCREATEASSIGNMENTFIELD_1',
    }],
    recordFields: mockAccountFields,
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    rhsLabel: 'Value'
};

const mock2InputAssignmentsItems = [{
    leftHandSide: {value: 'Account.Description', error: null},
    rightHandSide: {value: 'vDescription', error: null},
    rightHandSideDataType: {value: 'reference', error: null},
    rowIndex: "RECORDCREATEASSIGNMENTFIELD_21",
},
{
    leftHandSide: {value: 'Account.Name', error: null},
    rightHandSide: {value: 'nameC', error: null},
    rightHandSideDataType: {value: 'reference', error: null},
    rowIndex: "RECORDCREATEASSIGNMENTFIELD_22",
}
];

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-record-input-output-assignments', {
        is: RecordInputOutputAssignments
    });
    Object.assign(el, mockDefaultRecordInputAssignment);
    document.body.appendChild(el);
    return el;
};

const selectors = {
    expressionBuilder: 'builder_platform_interaction-field-to-ferov-expression-builder',
    fieldList: 'builder_platform_interaction-list',
};

const getFieldList = (recordInputOutputAssignmentCmp) => {
    return getShadowRoot(recordInputOutputAssignmentCmp).querySelector(selectors.fieldList);
};

const getExpressionBuilders = (recordInputOutputAssignmentCmp) => {
    return getShadowRoot(recordInputOutputAssignmentCmp).querySelectorAll(selectors.expressionBuilder);
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
    });
    describe('Assignment Items', () => {
        let element, expressionBuilders;
        beforeAll(() => {
            mockDefaultRecordInputAssignment.inputOutputAssignmentsItems = mock2InputAssignmentsItems;
            element = createComponentUnderTest();
            expressionBuilders = getExpressionBuilders(element);
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
    });
    describe('Lhs Fields', () => {
        let element, expressionBuilders;
        beforeAll(() => {
            mockDefaultRecordInputAssignment.readOnlyFields = true;
            element = createComponentUnderTest();
            expressionBuilders = getExpressionBuilders(element);
        });
        it('should not contain duplicated fields', () => {
            expect(Object.values(expressionBuilders[0].lhsFields).map(field => field.apiName).includes("Name")).toBe(false);
            expect(Object.values(expressionBuilders[1].lhsFields).map(field => field.apiName).includes("Description")).toBe(false);
        });
    });
    describe('handleAddAssignment', () => {
        it('fires addRecordAssignmentEvent', () => {
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(AddRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
                const fieldList = getFieldList(element);
                fieldList.dispatchEvent(new AddRecordFieldAssignmentEvent());
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });

    describe('handleUpdateAssignment', () => {
        it('fires updateRecordAssignmentEvent', () => {
            const updateData = {
                index: 0,
                value: 'newValue',
            };
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(UpdateRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
                const fieldList = getFieldList(element);
                fieldList.dispatchEvent(new UpdateRecordFieldAssignmentEvent(updateData.index, updateData.value));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: updateData.index,
                        value: updateData.value,
                    }
                });
            });
        });
    });

    describe('handleDeleteAssignment', () => {
        it('fires deleteRecordAssignmentEvent', () => {
            const deleteIndex = 1;
            const element = createComponentUnderTest();
            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                element.addEventListener(DeleteRecordFieldAssignmentEvent.EVENT_NAME, eventCallback);
                const fieldList = getFieldList(element);
                fieldList.dispatchEvent(new DeleteRecordFieldAssignmentEvent(deleteIndex));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        index: deleteIndex,
                    }
                });
            });
        });
    });
});