import { createElement } from 'lwc';
import { FLOW_TRIGGER_TYPE, FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { query } from 'builder_platform_interaction/builderTestUtils';
import RecordChangeTriggerEditor from '../recordChangeTriggerEditor';

const SELECTORS = {
    SAVE_TYPE_SECTION: 'lightning-radio-group.recordCreateOrUpdate',
    TRIGGER_TYPE_INPUT: 'lightning-radio-group.triggerType'
};

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-change-trigger-editor', {
        is: RecordChangeTriggerEditor
    });

    Object.assign(el, { node });

    document.body.appendChild(el);
    return el;
}

const recordChangeTriggerElement = () => ({
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    triggerType: { value: FLOW_TRIGGER_TYPE.BEFORE_SAVE, error: null },
    recordTriggerType: { value: FLOW_TRIGGER_SAVE_TYPE.CREATE, error: null }
});

describe('record-change-trigger-editor', () => {
    it('handles triggerType updates', () => {
        const element = createComponentForTest(recordChangeTriggerElement());
        const event = new CustomEvent('change', {
            detail: {
                value: FLOW_TRIGGER_TYPE.AFTER_SAVE
            }
        });
        query(element, SELECTORS.TRIGGER_TYPE_INPUT).dispatchEvent(event);

        expect(element.node.triggerType.value).toBe(FLOW_TRIGGER_TYPE.AFTER_SAVE);
    });

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
});
