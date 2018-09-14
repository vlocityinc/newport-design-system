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

const mockDefaultRecordInputAssignment = {
    object: 'Account',
    inputOutputAssignmentsItems: [{
        leftHandSide: '',
        rightHandSide: '',
        rightHandSideDataType: '',
        rowIndex: 'RECORDCREATEASSIGNMENTFIELD_1',
    }],
    recordFields: mockAccountFields,
    elementType: ELEMENT_TYPE.RECORD_CREATE,
};

const mock2InputAssignmentsItems = [{
    leftHandSide: "Account.Description",
    rightHandSide: "vDescription",
    rightHandSideDataType: "reference",
    rowIndex: "RECORDCREATEASSIGNMENTFIELD_21",
},
{
    leftHandSide: "Account.Name",
    rightHandSide: "nameC",
    rightHandSideDataType: "reference",
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
    describe('Assignment Items', () => {
        let element;
        beforeEach(() => {
            mockDefaultRecordInputAssignment.inputOutputAssignmentsItems = mock2InputAssignmentsItems;
            element = createComponentUnderTest();
        });
        it('Filter list should be displayed', () => {
            expect(getFieldList(element)).not.toBeNull();
        });
        it('All filter items should be displayed', () => {
            expect(getExpressionBuilders(element)).toHaveLength(2);
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