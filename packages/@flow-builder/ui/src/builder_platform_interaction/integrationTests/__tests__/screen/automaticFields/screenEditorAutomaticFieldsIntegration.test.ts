import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    createComponentUnderTest,
    getComponentsPaletteInFirstTab,
    getAutomaticFieldsPaletteInSecondTab,
    getRecordVariablePickerChildComboboxComponent
} from '../../screenEditorTestUtils';
import { typeMergeFieldInCombobox } from '../../comboboxTestUtils';

import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

describe('ScreenEditor automatic fields', () => {
    let screenNode;
    let screenEditor;
    describe('Existing flow', () => {
        beforeAll(async () => {
            await setupStateForFlow(flowWithAllElements);
        });
        afterAll(() => {
            resetState();
        });
        describe('Test components tab', () => {
            beforeEach(async () => {
                const element = getElementByDevName('screenWithAddress');
                screenNode = getElementForPropertyEditor(element);
                screenEditor = createComponentUnderTest({
                    node: screenNode,
                    processType: FLOW_PROCESS_TYPE.FLOW
                });
            });
            it('should contain in first tab the components palette', () => {
                expect(getComponentsPaletteInFirstTab(screenEditor)).not.toBeNull();
            });
            it('should contain in second tab the automatic field palette', () => {
                expect(getAutomaticFieldsPaletteInSecondTab(screenEditor)).not.toBeNull();
            });
            it('should be able to select accountSObjectVariable in sObject picker', async () => {
                const autoFieldPalette = getAutomaticFieldsPaletteInSecondTab(screenEditor);
                const sObjectPicker = autoFieldPalette.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
                );
                const combobox = getRecordVariablePickerChildComboboxComponent(sObjectPicker);
                await typeMergeFieldInCombobox(combobox, '{!accountSObjectVariable}');
                expect(combobox.hasPill).toBe(true);
                expect(combobox.errorMessage).toEqual(null);
            });
            it('should not be able to select apexContainsOnlyASingleSObjectVariable in sObject picker', async () => {
                const autoFieldPalette = getAutomaticFieldsPaletteInSecondTab(screenEditor);
                const sObjectPicker = autoFieldPalette.shadowRoot.querySelector(
                    INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER
                );
                const combobox = getRecordVariablePickerChildComboboxComponent(sObjectPicker);
                await typeMergeFieldInCombobox(combobox, '{!apexContainsOnlyASingleSObjectVariable}');
                expect(combobox.hasPill).toBe(false);
                expect(combobox.errorMessage).toEqual('FlowBuilderCombobox.genericErrorMessage');
            });
        });
    });
});
