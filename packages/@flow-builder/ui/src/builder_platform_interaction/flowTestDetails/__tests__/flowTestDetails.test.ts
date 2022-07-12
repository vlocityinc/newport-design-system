// @ts-nocheck
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { FLOW_TRIGGER_SAVE_TYPE, SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createElement } from 'lwc';
import FlowTestDetails from '../flowTestDetails';
import { LABELS } from '../flowTestDetailsLabels';

const { CREATE, UPDATE, CREATE_AND_UPDATE } = FLOW_TRIGGER_SAVE_TYPE;
const SELECTORS = {
    RECORD_TRIGGER_TYPE_SECTION: 'lightning-radio-group.test-trigger-type',
    RUN_PATH_SECTION: 'lightning-combobox.run-path',
    LABEL_NAME: 'builder_platform_interaction-label-description'
};

function flowTestDetails(testType, saveType, mode, runPathValue = SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH) {
    const flowTestDetails = {
        triggerSaveType: saveType,
        label: { value: 'test' },
        devName: { value: 'testApi' },
        description: { value: 'testDescription' },
        testTriggerType: testType,
        runPathValue,
        mode,
        options: [
            { value: SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH, label: LABELS.runImmediatelyPath },
            { value: 'sp2', label: 'sp 2' }
        ]
    };
    return flowTestDetails;
}
function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-', {
        is: FlowTestDetails
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

describe('flow-test-editor', () => {
    it('should select Create radio button option when testTriggerType is Create and radio options disabled', () => {
        const data = flowTestDetails(CREATE, CREATE);
        const element = createComponentForTest(data);
        const radioOptions = element.shadowRoot.querySelector(SELECTORS.RECORD_TRIGGER_TYPE_SECTION);
        expect(radioOptions.value).toEqual(CREATE);
        expect(radioOptions.disabled).toBeTruthy();
    });

    it('should select Update radio button option when testTriggerType is Update and radio options disabled', () => {
        const data = flowTestDetails(UPDATE, UPDATE);
        const element = createComponentForTest(data);
        const radioOptions = element.shadowRoot.querySelector(SELECTORS.RECORD_TRIGGER_TYPE_SECTION);
        expect(radioOptions.value).toEqual(UPDATE);
        expect(radioOptions.disabled).toBeTruthy();
    });

    it('should enable radio buttons when saveTriggerType is CreateUpdate, set Create as default testTriggerType', () => {
        const data = flowTestDetails(CREATE, CREATE_AND_UPDATE);
        const element = createComponentForTest(data);
        const radioOptions = element.shadowRoot.querySelector(SELECTORS.RECORD_TRIGGER_TYPE_SECTION);
        expect(radioOptions.value).toEqual(CREATE);
        expect(radioOptions.disabled).toBeFalsy();
    });
    it('should enable radio buttons when saveTriggerType is CreateUpdate and Test mode is Edit', () => {
        const data = flowTestDetails(CREATE, CREATE_AND_UPDATE, FlowTestMode.Edit);
        const element = createComponentForTest(data);
        const radioOptions = element.shadowRoot.querySelector(SELECTORS.RECORD_TRIGGER_TYPE_SECTION);
        expect(radioOptions.value).toEqual(CREATE);
        expect(radioOptions.disabled).toBeFalsy();
    });

    it('should default run path to run immediately', () => {
        const data = flowTestDetails(CREATE, CREATE_AND_UPDATE);
        const element = createComponentForTest(data);
        const combobox = element.shadowRoot.querySelector(SELECTORS.RUN_PATH_SECTION);
        expect(combobox.value).toEqual(SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH);
    });
    it('should default run path to selected scheduled Path on edit', () => {
        const data = flowTestDetails(CREATE, CREATE_AND_UPDATE, FlowTestMode.Edit, 'sp2');
        const element = createComponentForTest(data);
        const combobox = element.shadowRoot.querySelector(SELECTORS.RUN_PATH_SECTION);
        expect(combobox.value).toEqual('sp2');
    });
    it('has name and api name component', async () => {
        const data = flowTestDetails(CREATE, CREATE_AND_UPDATE);
        const element = createComponentForTest(data);

        await ticks(1);
        const labelName = element.shadowRoot.querySelectorAll(SELECTORS.LABEL_NAME);
        expect(labelName).toHaveLength(1);
        expect(labelName[0].label.value).toBe(element.label.value);
        expect(labelName[0].devName.value).toBe(element.devName.value);
        expect(labelName[0].description.value).toBe(element.description.value);
    });
});
