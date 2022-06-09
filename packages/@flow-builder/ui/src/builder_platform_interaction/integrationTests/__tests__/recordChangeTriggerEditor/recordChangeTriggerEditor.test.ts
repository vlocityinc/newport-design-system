import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import type { RecordChangeTriggerEditor } from 'builder_platform_interaction/recordChangeTriggerEditor';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import { resetState, setupStateForFlow } from '../integrationTestUtils';
import { getRHSCombobox } from '../recordFilterTestUtils';

describe('Record Change Trigger Editor', () => {
    let recordChangeTriggerComponent: RecordChangeTriggerEditor, recordChangeTriggerNode: {};
    beforeAll(async () => {
        await setupStateForFlow(recordTriggeredFlow);
    });
    afterAll(() => {
        resetState();
    });
    beforeAll(() => {
        const startElement = getElementByDevName('$Record');
        recordChangeTriggerNode = getElementForPropertyEditor(startElement);
    });
    beforeEach(async () => {
        recordChangeTriggerComponent = await createComponent(
            'builder_platform_interaction-record-change-trigger-editor',
            { node: recordChangeTriggerNode }
        );
    });
    describe('Filters', () => {
        it('should NOT display the "$Record" entry in the RHS combobox (no system global variables category)', async () => {
            const rhsComboboxComponent = await getRHSCombobox(recordChangeTriggerComponent);
            const hasSystemGlobalVariableCategory = rhsComboboxComponent
                .getItems()
                .some(({ label }) => label === 'FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory');
            expect(hasSystemGlobalVariableCategory).toBe(false);
        });
    });
});
