// @ts-nocheck
import { createElement } from 'lwc';
import { FLOW_TRIGGER_TYPE, FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { query } from 'builder_platform_interaction/builderTestUtils';
import RecordChangeTriggerEditor from '../recordChangeTriggerEditor';

const SELECTORS = {
    SAVE_TYPE_SECTION: 'lightning-radio-group.recordCreateOrUpdate',
    TRIGGER_TYPE_BEFORE_SAVE: 'input.beforeSave',
    TRIGGER_TYPE_AFTER_SAVE: 'input.afterSave'
};

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-change-trigger-editor', {
        is: RecordChangeTriggerEditor
    });

    Object.assign(el, { node });

    document.body.appendChild(el);
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

const recordChangeTriggerElement = () => ({
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    triggerType: { value: FLOW_TRIGGER_TYPE.BEFORE_SAVE, error: null },
    recordTriggerType: { value: FLOW_TRIGGER_SAVE_TYPE.CREATE, error: null }
});

describe('record-change-trigger-editor', () => {
    it('handles recordTriggerType updates', () => {
        const element = createComponentForTest(recordChangeTriggerElement());
        const event = new CustomEvent('change', {
            detail: {
                value: FLOW_TRIGGER_SAVE_TYPE.UPDATE
            }
        });
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(event);

        expect(element.node.recordTriggerType.value).toBe(FLOW_TRIGGER_SAVE_TYPE.UPDATE);
    });

    it('handles typeBeforeSave get selected', () => {
        const element = createComponentForTest(recordChangeTriggerElement());
        const event = new CustomEvent('change');
        query(element, SELECTORS.TRIGGER_TYPE_BEFORE_SAVE).dispatchEvent(event);

        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.BEFORE_SAVE);
    });

    it('handles typeAfterSave get selected', () => {
        const element = createComponentForTest(recordChangeTriggerElement());
        const event = new CustomEvent('change');
        query(element, SELECTORS.TRIGGER_TYPE_AFTER_SAVE).dispatchEvent(event);

        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.AFTER_SAVE);
    });

    it('Verify Delete record trigger type auto selects Before Delete as the Flow Trigger', () => {
        const element = createComponentForTest(recordChangeTriggerElement());
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(
            createRecordTriggerCustomEvent(FLOW_TRIGGER_SAVE_TYPE.DELETE)
        );
        // Setting the record trigger type to Delete should automatically select Before Delete flow trigger type
        expect(element.node.recordTriggerType.value).toBe(FLOW_TRIGGER_SAVE_TYPE.DELETE);
        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.BEFORE_DELETE);
    });

    it('Verify switching from delete to create auto selects previously selected Flow Trigger type', () => {
        const element = createComponentForTest(recordChangeTriggerElement());
        // Switch to Delete
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(
            createRecordTriggerCustomEvent(FLOW_TRIGGER_SAVE_TYPE.DELETE)
        );

        // Switch to Create
        query(element, SELECTORS.SAVE_TYPE_SECTION).dispatchEvent(
            createRecordTriggerCustomEvent(FLOW_TRIGGER_SAVE_TYPE.CREATE)
        );
        // Setting the record trigger type to Create should automatically select the flow trigger type which was prior to selecting
        // Delete. In this case, the recordChangeTriggerElement is defined as BeforeSave, so selecting from delete to create
        // should select Before Save as the flow trigger type
        expect(element.node.recordTriggerType.value).toBe(FLOW_TRIGGER_SAVE_TYPE.CREATE);
        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.BEFORE_SAVE);
    });
});
