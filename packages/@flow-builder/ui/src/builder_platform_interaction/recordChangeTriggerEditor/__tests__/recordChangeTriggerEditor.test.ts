// @ts-nocheck
import { createElement } from 'lwc';
import { FLOW_TRIGGER_TYPE, FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { query, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import RecordChangeTriggerEditor from '../recordChangeTriggerEditor';
import { UpdateNodeEvent } from 'builder_platform_interaction/events';

const SELECTORS = {
    SAVE_TYPE_SECTION: 'lightning-radio-group.recordCreateOrUpdate',
    TRIGGER_TYPE_BEFORE_SAVE: 'input.beforeSave',
    TRIGGER_TYPE_AFTER_SAVE: 'input.afterSave',
    BEFORE_DELETE_INFO_BOX: 'div.beforeDeleteInfo'
};

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-change-trigger-editor', {
        is: RecordChangeTriggerEditor
    });

    Object.assign(el, { node });

    setDocumentBodyChildren(el);
    return el;
}

function createRecordTriggerCustomEvent(recordTriggerType) {
    const event = new CustomEvent('change', {
        detail: {
            value: recordTriggerType
        }
    });
    return event;
}

function recordChangeTriggerElement(flowTriggerType, recordTriggerType) {
    const triggerStartElement = {
        elementType: 'START_ELEMENT',
        guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
        triggerType: { value: flowTriggerType, error: null },
        recordTriggerType: { value: recordTriggerType, error: null }
    };

    return triggerStartElement;
}

describe('record-change-trigger-editor', () => {
    it('handles recordTriggerType updates', () => {
        const element = createComponentForTest(
            recordChangeTriggerElement(FLOW_TRIGGER_TYPE.BEFORE_SAVE, FLOW_TRIGGER_SAVE_TYPE.CREATE)
        );
        const event = new CustomEvent('change', {
            detail: {
                value: FLOW_TRIGGER_SAVE_TYPE.UPDATE
            }
        });
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(event);

        expect(element.node.recordTriggerType.value).toBe(FLOW_TRIGGER_SAVE_TYPE.UPDATE);
    });

    it('handles typeBeforeSave get selected', () => {
        const element = createComponentForTest(
            recordChangeTriggerElement(FLOW_TRIGGER_TYPE.BEFORE_SAVE, FLOW_TRIGGER_SAVE_TYPE.CREATE)
        );
        const event = new CustomEvent('change');
        query(element, SELECTORS.TRIGGER_TYPE_BEFORE_SAVE).dispatchEvent(event);

        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.BEFORE_SAVE);
    });

    it('handles typeAfterSave get selected', () => {
        const element = createComponentForTest(
            recordChangeTriggerElement(FLOW_TRIGGER_TYPE.BEFORE_SAVE, FLOW_TRIGGER_SAVE_TYPE.CREATE)
        );
        const event = new CustomEvent('change');
        query(element, SELECTORS.TRIGGER_TYPE_AFTER_SAVE).dispatchEvent(event);

        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.AFTER_SAVE);
        expect(query(element, SELECTORS.BEFORE_DELETE_INFO_BOX)).toBeNull();
    });

    it('Verify Delete record trigger type auto selects Before Delete as the Flow Trigger', () => {
        const element = createComponentForTest(
            recordChangeTriggerElement(FLOW_TRIGGER_TYPE.BEFORE_SAVE, FLOW_TRIGGER_SAVE_TYPE.CREATE)
        );
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(
            createRecordTriggerCustomEvent(FLOW_TRIGGER_SAVE_TYPE.DELETE)
        );
        // Setting the record trigger type to Delete should automatically select Before Delete flow trigger type
        expect(element.node.recordTriggerType.value).toBe(FLOW_TRIGGER_SAVE_TYPE.DELETE);
        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.BEFORE_DELETE);
        expect(query(element, SELECTORS.BEFORE_DELETE_INFO_BOX)).toBeDefined();
    });

    it('Verify switching from delete to create auto selects previously selected Flow Trigger type', () => {
        const element = createComponentForTest(
            recordChangeTriggerElement(FLOW_TRIGGER_TYPE.AFTER_SAVE, FLOW_TRIGGER_SAVE_TYPE.CREATE)
        );
        // Switch to Delete
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(
            createRecordTriggerCustomEvent(FLOW_TRIGGER_SAVE_TYPE.DELETE)
        );

        // Switch to Create
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(
            createRecordTriggerCustomEvent(FLOW_TRIGGER_SAVE_TYPE.CREATE)
        );
        // Setting the record trigger type to Create should automatically select the flow trigger type which was prior to selecting
        // Delete. In this case, the recordChangeTriggerElement is defined as After Save, so selecting from delete to create
        // should select Before Save as the flow trigger type
        expect(element.node.recordTriggerType.value).toBe(FLOW_TRIGGER_SAVE_TYPE.CREATE);
        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.AFTER_SAVE);
    });

    it('Verify switching from delete to create auto selects Flow Trigger type to Before Save if Flow Trigger type is found as null in the start element', () => {
        const element = createComponentForTest(recordChangeTriggerElement(null, FLOW_TRIGGER_SAVE_TYPE.DELETE));

        // Switch to Create
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(
            createRecordTriggerCustomEvent(FLOW_TRIGGER_SAVE_TYPE.CREATE)
        );
        // Setting the record trigger type to Create should automatically select the flow trigger type to Before Save if Flow trigger type
        // is found as null.. Ideally, this shouldn't happen, but a negative test case to ensure Flow Trigger Type is always set to a valid
        // trigger type value and doesn't leave the start element in invalid state
        expect(element.node.recordTriggerType.value).toBe(FLOW_TRIGGER_SAVE_TYPE.CREATE);
        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.BEFORE_SAVE);
    });

    describe('UpdateNodeEvent', () => {
        it('dispatched on handleTypeBeforeSave', async () => {
            expect.assertions(1);
            const element = createComponentForTest(
                recordChangeTriggerElement(FLOW_TRIGGER_TYPE.BEFORE_SAVE, FLOW_TRIGGER_SAVE_TYPE.CREATE)
            );
            const updateNodeCallback = jest.fn();
            element.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            await ticks(1);

            const event = new CustomEvent('change', {
                detail: {
                    value: FLOW_TRIGGER_SAVE_TYPE.UPDATE
                }
            });
            query(element, SELECTORS.TRIGGER_TYPE_BEFORE_SAVE).dispatchEvent(event);

            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: element.getNode() }
                })
            );
        });
        it('dispatched on handleTypeBeforeDelete', async () => {
            expect.assertions(1);
            const element = createComponentForTest(recordChangeTriggerElement(null, FLOW_TRIGGER_SAVE_TYPE.DELETE));

            const updateNodeCallback = jest.fn();
            element.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            await ticks(1);

            query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(
                createRecordTriggerCustomEvent(FLOW_TRIGGER_SAVE_TYPE.DELETE)
            );

            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: element.getNode() }
                })
            );
        });

        it('dispatched on handleTypeAfterSave', async () => {
            expect.assertions(1);
            const element = createComponentForTest(
                recordChangeTriggerElement(FLOW_TRIGGER_TYPE.BEFORE_SAVE, FLOW_TRIGGER_SAVE_TYPE.CREATE)
            );

            const updateNodeCallback = jest.fn();
            element.addEventListener(UpdateNodeEvent.EVENT_NAME, updateNodeCallback);

            await ticks(1);

            const event = new CustomEvent('change', {
                detail: {
                    value: FLOW_TRIGGER_SAVE_TYPE.UPDATE
                }
            });
            query(element, SELECTORS.TRIGGER_TYPE_AFTER_SAVE).dispatchEvent(event);

            expect(updateNodeCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { node: element.getNode() }
                })
            );
        });
    });
});
